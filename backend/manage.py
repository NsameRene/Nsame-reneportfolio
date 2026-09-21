#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path


def main():
    # Read backend/.env first so DJANGO_SETTINGS_MODULE can live there. On the
    # server put `DJANGO_SETTINGS_MODULE=config.settings.production` in .env and
    # every manage.py command (migrate, createsuperuser, ...) uses production
    # settings. Locally nothing is set, so development settings apply.
    try:
        from dotenv import load_dotenv

        load_dotenv(Path(__file__).resolve().parent / ".env")
    except ImportError:
        pass

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Is it installed and is your virtualenv activated?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
