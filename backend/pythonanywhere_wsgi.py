# ─────────────────────────────────────────────────────────────────────────────
# Paste this into your PythonAnywhere WSGI file (Web tab -> "WSGI configuration
# file"), replacing its contents. Change YOUR_USERNAME and, if you cloned the
# repo somewhere else, PROJECT_HOME. See the README for the full walkthrough.
#
# Settings such as SECRET_KEY / DATABASE_URL are read from backend/.env by
# config/settings/base.py, so nothing secret belongs in this file.
# ─────────────────────────────────────────────────────────────────────────────
import os
import sys

PROJECT_HOME = "/home/YOUR_USERNAME/Nsame-reneportfolio/backend"
if PROJECT_HOME not in sys.path:
    sys.path.insert(0, PROJECT_HOME)

os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings.production"

from django.core.wsgi import get_wsgi_application  # noqa: E402

application = get_wsgi_application()
