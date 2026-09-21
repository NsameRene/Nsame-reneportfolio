"""Import content from the old Node/Postgres portfolio into Django.

Two sources:

  --from-api URL    Read the old server's public GET endpoints (no DB access
                    needed). Covers everything except contact messages.
  --from-json DIR   Read <table>.json files exported from Postgres. Use this for
                    contact_messages (not exposed by the old API) or when the old
                    server is offline. See the README for the psql export loop.

Row ids are preserved (the frontend links to /courses/<id>), so the command is
idempotent: run it again and rows are updated, not duplicated. Users are NOT
imported - create your admin with `manage.py createsuperuser`.
"""
import json
from datetime import timezone as dt_timezone
import urllib.error
import urllib.request
from pathlib import Path

from django.core.management import BaseCommand, CommandError
from django.core.management.color import no_style
from django.db import connection, transaction
from django.utils.dateparse import parse_datetime
from django.utils.timezone import is_naive, make_aware

from apps.contact.models import ContactMessage
from apps.content.models import (
    Blog,
    Certificate,
    Course,
    Education,
    Experience,
    GalleryItem,
    Project,
    Quote,
    SiteSettings,
    Skill,
    WhatIDo,
)
from apps.core.serializers import camel_to_snake

# legacy table / API path -> (Django model, columns to keep)
TABLES = {
    "settings": (SiteSettings, ["name", "email", "bio", "profile_image_url", "phone", "location", "website"]),
    "projects": (Project, ["title", "description", "technologies", "image_url", "github_link",
                           "live_demo_link", "category", "featured", "created_at"]),
    "blogs": (Blog, ["title", "slug", "content", "cover_image", "category", "tags", "published_at", "reading_time"]),
    "skills": (Skill, ["name", "category", "proficiency"]),
    "experiences": (Experience, ["company", "role", "start_date", "end_date", "description"]),
    "education": (Education, ["institution", "degree", "start_date", "end_date", "description"]),
    "certificates": (Certificate, ["name", "issuer", "date", "link"]),
    "courses": (Course, ["title", "description", "image_url", "link"]),
    "quotes": (Quote, ["text", "author"]),
    "gallery": (GalleryItem, ["title", "image_url", "created_at"]),
    "what_i_do": (WhatIDo, ["title", "icon", "items"]),
    "contact_messages": (ContactMessage, ["name", "email", "subject", "message", "created_at"]),
}
API_TABLES = [t for t in TABLES if t != "contact_messages"]
LINK_COLUMNS = {"image_url", "github_link", "live_demo_link", "cover_image", "link", "profile_image_url"}
DATETIME_COLUMNS = {"created_at", "published_at"}
PRESERVE_TIMESTAMP = {"created_at"}  # auto_now_add would overwrite it on insert


class Command(BaseCommand):
    help = "Import content from the legacy Node/Postgres portfolio (see module docstring)."

    def add_arguments(self, parser):
        source = parser.add_mutually_exclusive_group(required=True)
        source.add_argument("--from-api", metavar="URL", help="Base URL of the old API, e.g. https://old.onrender.com")
        source.add_argument("--from-json", metavar="DIR", help="Directory containing <table>.json exports")
        parser.add_argument("--dry-run", action="store_true", help="Run everything, then roll back")
        parser.add_argument("--timeout", type=int, default=90, help="HTTP timeout in seconds (Render cold starts are slow)")

    def handle(self, *args, **options):
        self.warnings = []
        data = self.load_api(options["from_api"], options["timeout"]) if options["from_api"] else self.load_json(options["from_json"])

        with transaction.atomic():
            for table, rows in data.items():
                self.import_table(table, rows)
            self.reset_sequences([TABLES[t][0] for t in data])
            if options["dry_run"]:
                transaction.set_rollback(True)

        for warning in self.warnings:
            self.stderr.write(self.style.WARNING("! " + warning))
        suffix = " (dry run: rolled back)" if options["dry_run"] else ""
        self.stdout.write(self.style.SUCCESS(f"Import finished{suffix}."))

    # ── sources ─────────────────────────────────────────────────────────────
    def load_api(self, base_url, timeout):
        base = base_url.rstrip("/")
        data = {}
        for table in API_TABLES:
            url = f"{base}/api/{table}"
            try:
                with urllib.request.urlopen(url, timeout=timeout) as response:  # noqa: S310 - user-supplied URL by design
                    payload = json.load(response)
            except (urllib.error.URLError, TimeoutError, ValueError) as exc:
                raise CommandError(f"Could not read {url}: {exc}") from exc
            data[table] = [payload] if isinstance(payload, dict) else payload
        self.warnings.append(
            "The old API returns hard-coded DEMO projects/blogs when those tables are empty. If your old "
            "database had none, delete the demo rows imported here. Contact messages are not exposed by "
            "the old API: use --from-json for them."
        )
        return data

    def load_json(self, directory):
        path = Path(directory)
        if not path.is_dir():
            raise CommandError(f"{directory} is not a directory.")
        data = {}
        for table in TABLES:
            file = path / f"{table}.json"
            if file.exists():
                text = file.read_text(encoding="utf-8-sig").strip()
                payload = json.loads(text) if text else []
                data[table] = [payload] if isinstance(payload, dict) else payload  # /api/settings is one object
        if not data:
            raise CommandError(f"No <table>.json files found in {directory}.")
        return data

    # ── import ──────────────────────────────────────────────────────────────
    def import_table(self, table, rows):
        model, columns = TABLES[table]
        count = 0
        for raw in rows or []:
            row = {camel_to_snake(k): v for k, v in raw.items()}
            if row.get("id") is None and table != "settings":
                self.warnings.append(f"{table}: row without id skipped: {str(raw)[:80]}")
                continue
            pk = 1 if table == "settings" else int(row["id"])
            defaults = {c: self.clean(table, pk, c, row.get(c)) for c in columns if c in row}
            # A missing timestamp falls back to the model default (now) instead of NULL.
            defaults = {c: v for c, v in defaults.items() if not (c in DATETIME_COLUMNS and v is None)}
            timestamps = {c: defaults.pop(c) for c in list(defaults) if c in PRESERVE_TIMESTAMP and defaults[c]}
            if table == "blogs":
                defaults["reading_time"] = defaults.get("reading_time") or 5
                if not defaults.get("slug"):
                    self.warnings.append(f"blogs id={pk}: no slug, skipped")
                    continue
            model.objects.update_or_create(pk=pk, defaults=defaults)
            if timestamps:
                model.objects.filter(pk=pk).update(**timestamps)
            count += 1
        self.stdout.write(f"{table:<17} {count} row(s)")

    def clean(self, table, pk, column, value):
        if column in DATETIME_COLUMNS:
            if not value:
                return None
            parsed = parse_datetime(value) if isinstance(value, str) else value
            if parsed is None:
                self.warnings.append(f"{table} id={pk}: unparseable {column} {value!r}")
                return None
            return make_aware(parsed, dt_timezone.utc) if is_naive(parsed) else parsed
        if column in LINK_COLUMNS:
            value = (value or "").strip()
            if value == "#":
                return ""
            if value.startswith("/uploads/"):
                # File lived on the old server's disk; it cannot be fetched from here.
                self.warnings.append(f"{table} id={pk}: {column} {value!r} was an old server upload - re-upload it in the admin")
                return ""
            return value
        if value is None:
            return {"featured": False}.get(column, "")
        return value

    def reset_sequences(self, models):
        """After inserting explicit ids, PostgreSQL sequences must catch up."""
        statements = connection.ops.sequence_reset_sql(no_style(), models)
        with connection.cursor() as cursor:
            for sql in statements:
                cursor.execute(sql)
