"""Settings shared by every environment. Environment-specific values live in
``local.py`` / ``production.py`` and in environment variables (see .env.example).
"""
from datetime import timedelta
from pathlib import Path

import dj_database_url
from dotenv import load_dotenv

from .env import env, env_bool, env_int, env_list

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # the backend/ folder

# Load backend/.env if present. Real environment variables always win.
load_dotenv(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
DEBUG = env_bool("DEBUG", False)
ALLOWED_HOSTS = env_list("ALLOWED_HOSTS")

# ── Applications ────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third party
    "rest_framework",
    "corsheaders",
    # Project
    "apps.core",
    "apps.accounts",
    "apps.content",
    "apps.contact",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # must sit above CommonMiddleware
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ── Database ────────────────────────────────────────────────────────────────
# Default: SQLite file backend/db.sqlite3 (fine for a one-owner portfolio, and the only
# database available on PythonAnywhere's free plan). Set DATABASE_URL to use another one:
#   sqlite:////absolute/path/to/db.sqlite3
#   mysql://USER:PASSWORD@HOST/NAME          (needs the mysqlclient package)
#   postgres://USER:PASSWORD@HOST:5432/NAME  (needs psycopg)
# Percent-encode special characters in the password (and "$" as %24 in names).
# env() treats a blank `DATABASE_URL=` (as copied from .env.example) like an unset variable;
# dj_database_url.config() would return an empty dict for it and Django would crash.
DATABASES = {
    "default": dj_database_url.parse(
        env("DATABASE_URL") or f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=env_int("DB_CONN_MAX_AGE", 0),
        conn_health_checks=True,
    )
}
if DATABASES["default"]["ENGINE"] == "django.db.backends.mysql":
    DATABASES["default"].setdefault("OPTIONS", {}).setdefault("charset", "utf8mb4")
elif DATABASES["default"]["ENGINE"] == "django.db.backends.sqlite3":
    # Several web workers may write at once (contact form, admin): wait up to
    # 20 s for the file lock instead of failing after the default 5 s.
    DATABASES["default"].setdefault("OPTIONS", {}).setdefault("timeout", 20)

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ── Auth ────────────────────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 10}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ── i18n ────────────────────────────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = False
USE_TZ = True

# ── Static & media files ────────────────────────────────────────────────────
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"  # `collectstatic` target (admin CSS/JS)
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"  # uploaded images

STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}

# Uploads: reject anything larger than this (see apps.core.validators too).
MAX_UPLOAD_SIZE = env_int("MAX_UPLOAD_SIZE_MB", 5) * 1024 * 1024
DATA_UPLOAD_MAX_MEMORY_SIZE = MAX_UPLOAD_SIZE
FILE_UPLOAD_MAX_MEMORY_SIZE = 2 * 1024 * 1024

# ── Django REST Framework ───────────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ["rest_framework_simplejwt.authentication.JWTAuthentication"],
    # Public reads, staff-only writes. Individual views override where needed.
    "DEFAULT_PERMISSION_CLASSES": ["apps.core.permissions.IsStaffOrReadOnly"],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.MultiPartParser",
        "rest_framework.parsers.FormParser",
    ],
    "DEFAULT_PAGINATION_CLASS": None,  # the frontend expects plain JSON arrays
    "DEFAULT_THROTTLE_RATES": {
        "login": env("THROTTLE_LOGIN", "10/min"),
        "contact": env("THROTTLE_CONTACT", "10/hour"),
        "testimonial": env("THROTTLE_TESTIMONIAL", "10/hour"),
    },
    "EXCEPTION_HANDLER": "apps.core.exceptions.api_exception_handler",
    "UNAUTHENTICATED_USER": "django.contrib.auth.models.AnonymousUser",
}

# Same token style as the old Node API: `Authorization: Bearer <jwt>`, 1 day.
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=env_int("JWT_LIFETIME_HOURS", 24)),
    "AUTH_HEADER_TYPES": ("Bearer",),
    "UPDATE_LAST_LOGIN": True,
}

# ── CORS / CSRF ─────────────────────────────────────────────────────────────
# FRONTEND_URL is the Vercel site, e.g. https://your-portfolio.vercel.app
# (comma-separate several, e.g. to add a custom domain). No trailing slash.
CORS_ALLOWED_ORIGINS = [
    origin.rstrip("/") for origin in env_list("FRONTEND_URL") + env_list("CORS_ALLOWED_ORIGINS")
]
# Optional, for Vercel preview deployments, e.g. ^https://my-portfolio-[a-z0-9-]+\.vercel\.app$
CORS_ALLOWED_ORIGIN_REGEXES = env_list("CORS_ALLOWED_ORIGIN_REGEXES")
CORS_URLS_REGEX = r"^/api/.*$"
# The API uses Bearer tokens, not cookies, so credentialed CORS is not needed.
CORS_ALLOW_CREDENTIALS = False

# Needed only for the Django admin when served from a domain other than the
# request host (custom domains). The API itself is CSRF-exempt: JWT auth.
CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS")

# ── Email (contact-form notifications; entirely optional) ───────────────────
EMAIL_HOST = env("EMAIL_HOST", "")
EMAIL_BACKEND = (
    "django.core.mail.backends.smtp.EmailBackend"
    if EMAIL_HOST
    else "django.core.mail.backends.console.EmailBackend"
)
EMAIL_PORT = env_int("EMAIL_PORT", 587)
EMAIL_HOST_USER = env("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = env_bool("EMAIL_USE_TLS", True)
EMAIL_TIMEOUT = 10
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", EMAIL_HOST_USER or "portfolio@localhost")
# Where new contact-form messages are forwarded. Empty = no notification email.
CONTACT_NOTIFY_EMAIL = env("CONTACT_NOTIFY_EMAIL", "")

# ── Admin URL (change from the default to reduce bot noise) ─────────────────
ADMIN_URL = env("ADMIN_URL", "admin/")

# ── Logging ─────────────────────────────────────────────────────────────────
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"simple": {"format": "{levelname} {asctime} {name} {message}", "style": "{"}},
    "handlers": {"console": {"class": "logging.StreamHandler", "formatter": "simple"}},
    "root": {"handlers": ["console"], "level": env("LOG_LEVEL", "INFO")},
}
