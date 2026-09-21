import io
import json
import tempfile
from pathlib import Path

from django.core.management import call_command
from django.test import TestCase, override_settings
from rest_framework.test import APITestCase

from apps.contact.models import ContactMessage
from apps.content.models import Blog, Course, Project, SiteSettings


@override_settings(CORS_ALLOWED_ORIGINS=["https://portfolio.vercel.app"], CORS_ALLOWED_ORIGIN_REGEXES=[])
class CorsTests(APITestCase):
    origin = "https://portfolio.vercel.app"

    def test_configured_frontend_origin_is_allowed(self):
        response = self.client.get("/api/projects", HTTP_ORIGIN=self.origin)
        self.assertEqual(response["Access-Control-Allow-Origin"], self.origin)

    def test_other_origins_get_no_cors_header(self):
        for origin in ("https://evil.example", "https://portfolio.vercel.app.evil.example", "http://portfolio.vercel.app"):
            response = self.client.get("/api/projects", HTTP_ORIGIN=origin)
            self.assertNotIn("Access-Control-Allow-Origin", response, origin)

    def test_preflight_for_admin_write_with_bearer_header(self):
        response = self.client.options(
            "/api/projects/1",
            HTTP_ORIGIN=self.origin,
            HTTP_ACCESS_CONTROL_REQUEST_METHOD="PUT",
            HTTP_ACCESS_CONTROL_REQUEST_HEADERS="authorization,content-type",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Access-Control-Allow-Origin"], self.origin)
        self.assertIn("PUT", response["Access-Control-Allow-Methods"])
        self.assertIn("authorization", response["Access-Control-Allow-Headers"])

    def test_no_wildcard_and_no_credentials(self):
        response = self.client.get("/api/projects", HTTP_ORIGIN=self.origin)
        self.assertNotEqual(response["Access-Control-Allow-Origin"], "*")
        self.assertNotIn("Access-Control-Allow-Credentials", response)


class BasicRoutesTests(APITestCase):
    def test_root_and_health(self):
        self.assertEqual(self.client.get("/").json(), {"message": "Portfolio API is running"})
        self.assertEqual(self.client.get("/api/health").json(), {"status": "ok"})

    def test_admin_login_page_renders(self):
        self.assertEqual(self.client.get("/admin/login/").status_code, 200)


class SeedDemoTests(TestCase):
    def test_seed_is_idempotent(self):
        call_command("seed_demo", verbosity=0)
        counts = (Project.objects.count(), Blog.objects.count(), Course.objects.count())
        self.assertGreater(min(counts), 0)
        call_command("seed_demo", verbosity=0)
        self.assertEqual(counts, (Project.objects.count(), Blog.objects.count(), Course.objects.count()))
        self.assertEqual(SiteSettings.objects.count(), 1)


class ImportLegacyTests(TestCase):
    """Rows in the shape Postgres (snake_case) and the old API (camelCase) produce."""

    def export(self, **tables):
        directory = tempfile.mkdtemp()
        for name, rows in tables.items():
            Path(directory, f"{name}.json").write_text(json.dumps(rows), encoding="utf-8")
        return directory

    def test_imports_preserving_ids_and_cleaning_legacy_values(self):
        directory = self.export(
            projects=[
                {"id": 7, "title": "Old", "description": "d", "technologies": "A, B", "image_url": "/uploads/abc123",
                 "github_link": "#", "live_demo_link": "https://x.dev", "category": None, "featured": True,
                 "created_at": "2024-03-01T10:00:00.123456"},
            ],
            blogs=[{"id": 3, "title": "Post", "slug": "post", "content": "c", "cover_image": None, "reading_time": None, "published_at": "2024-01-02T03:04:05Z", "tags": None, "category": None}],
            courses=[{"id": 5, "title": "Course", "description": "d", "imageUrl": "https://i/c.png", "link": "#"}],
            settings=[{"id": 1, "name": "Nsame", "profileImageUrl": "https://i/me.png", "email": None}],
            contact_messages=[{"id": 1, "name": "Ada", "email": "a@example.com", "subject": "Hi", "message": "hello", "created_at": "2024-05-05T05:05:05"}],
        )
        call_command("import_legacy", from_json=directory, verbosity=0, stderr=io.StringIO())

        project = Project.objects.get(pk=7)
        self.assertEqual((project.image_url, project.github_link, project.live_demo_link, project.category, project.featured), ("", "", "https://x.dev", "", True))
        self.assertEqual(project.created_at.isoformat(), "2024-03-01T10:00:00.123456+00:00")
        blog = Blog.objects.get(pk=3)
        self.assertEqual((blog.reading_time, blog.cover_image, blog.published_at.year), (5, "", 2024))
        self.assertEqual(Course.objects.get(pk=5).image_url, "https://i/c.png")
        self.assertEqual(SiteSettings.load().profile_image_url, "https://i/me.png")
        self.assertEqual(ContactMessage.objects.get(pk=1).created_at.year, 2024)

    def test_settings_json_may_be_a_single_object_as_returned_by_the_api(self):
        directory = self.export(settings={"id": 1, "name": "Nsame", "profileImageUrl": "https://i/me.png"})
        call_command("import_legacy", from_json=directory, verbosity=0)
        self.assertEqual(SiteSettings.load().name, "Nsame")

    def test_is_idempotent_and_dry_run_rolls_back(self):
        directory = self.export(skills=[{"id": 1, "name": "Py", "category": "Backend", "proficiency": 90}])
        call_command("import_legacy", from_json=directory, dry_run=True, verbosity=0)
        self.assertFalse(Project.objects.exists())
        from apps.content.models import Skill

        self.assertEqual(Skill.objects.count(), 0)
        call_command("import_legacy", from_json=directory, verbosity=0)
        call_command("import_legacy", from_json=directory, verbosity=0)
        self.assertEqual(Skill.objects.count(), 1)


class AdminSiteTests(TestCase):
    """Every model is manageable in the Django admin and its pages render."""

    def setUp(self):
        from apps.core.testing import make_staff

        call_command("seed_demo", verbosity=0)
        ContactMessage.objects.create(name="Ada", email="a@example.com", subject="s", message="m")
        self.client.force_login(make_staff())

    def test_changelist_add_and_change_pages_render_for_every_registered_model(self):
        from django.contrib import admin

        checked = 0
        for model, model_admin in admin.site._registry.items():
            if model._meta.app_label not in {"content", "contact"}:
                continue
            base = f"/admin/{model._meta.app_label}/{model._meta.model_name}/"
            self.assertEqual(self.client.get(base).status_code, 200, base)
            self.assertEqual(self.client.get(base + "?q=a").status_code, 200, base + " search")
            if model_admin.has_add_permission(_Req(self.client)):
                self.assertEqual(self.client.get(base + "add/").status_code, 200, base + "add/")
            obj = model.objects.first()
            if obj is not None:
                self.assertEqual(self.client.get(f"{base}{obj.pk}/change/").status_code, 200, base + "change")
            checked += 1
        self.assertEqual(checked, 13)  # 12 content models + contact messages

    def test_settings_admin_is_a_singleton(self):
        from apps.content.admin import SiteSettingsAdmin
        from django.contrib import admin

        model_admin = SiteSettingsAdmin(SiteSettings, admin.site)
        self.assertFalse(model_admin.has_add_permission(_Req(self.client)))  # row already exists
        self.assertFalse(model_admin.has_delete_permission(_Req(self.client)))

    def test_admin_url_is_configurable(self):
        from django.urls import reverse

        self.assertEqual(reverse("admin:index"), "/admin/")


class _Req:
    """Minimal request stand-in for ModelAdmin permission hooks."""

    def __init__(self, client):
        from django.contrib.auth import get_user_model

        self.user = get_user_model().objects.get(username="owner")


class DatabaseSettingsTests(TestCase):
    """Settings are evaluated at import time, so check them in a fresh interpreter."""

    def engine_with(self, **env_vars):
        import os
        import subprocess
        import sys

        env = {k: v for k, v in os.environ.items() if k != "DATABASE_URL"}
        env.update(DJANGO_SETTINGS_MODULE="config.settings.local", **env_vars)
        code = "from django.conf import settings; d = settings.DATABASES['default']; print(d['ENGINE'], d['NAME'])"
        result = subprocess.run([sys.executable, "-c", code], env=env, capture_output=True, text=True, cwd=str(Path(__file__).resolve().parents[2]))
        self.assertEqual(result.returncode, 0, result.stderr)
        return result.stdout.strip()

    def test_unset_and_blank_database_url_both_use_the_sqlite_file(self):
        for value in (None, "", "   "):
            env_vars = {} if value is None else {"DATABASE_URL": value}
            out = self.engine_with(**env_vars)
            self.assertTrue(out.startswith("django.db.backends.sqlite3 "), (value, out))
            self.assertTrue(out.endswith("db.sqlite3"), (value, out))

    def test_explicit_sqlite_url_is_used(self):
        self.assertIn("custom.sqlite3", self.engine_with(DATABASE_URL="sqlite:////tmp/custom.sqlite3"))
