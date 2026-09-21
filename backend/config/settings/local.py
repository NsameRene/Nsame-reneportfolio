"""Local development settings (SQLite, DEBUG on, localhost CORS)."""
from .base import *  # noqa: F401,F403
from .base import CORS_ALLOWED_ORIGINS, SECRET_KEY, env, env_bool, env_list

DEBUG = env_bool("DEBUG", True)

# Never used outside local development.
SECRET_KEY = SECRET_KEY or "insecure-local-development-key-do-not-use-in-production"

ALLOWED_HOSTS = env_list("ALLOWED_HOSTS", ["localhost", "127.0.0.1", "[::1]", "testserver"])

# Vite dev (5173) and preview (4173) servers.
CORS_ALLOWED_ORIGINS = CORS_ALLOWED_ORIGINS + [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

# Plain static storage locally: no `collectstatic` needed.
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
}

# Django's runserver serves static files itself; WhiteNoise is for production.
MIDDLEWARE = [m for m in MIDDLEWARE if "whitenoise" not in m]  # noqa: F405
