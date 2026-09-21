"""Production settings (PythonAnywhere). Everything sensitive comes from
environment variables / backend/.env — see .env.example."""
from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa: F401,F403
from .base import (
    ALLOWED_HOSTS,
    CORS_ALLOWED_ORIGINS,
    CORS_ALLOWED_ORIGIN_REGEXES,
    DEBUG,
    SECRET_KEY,
    env,
    env_bool,
    env_int,
)

# ── Fail fast on missing / unsafe configuration ─────────────────────────────
if not SECRET_KEY or SECRET_KEY.startswith("insecure"):
    raise ImproperlyConfigured("SECRET_KEY must be set to a long random value in production.")
if not ALLOWED_HOSTS:
    raise ImproperlyConfigured("ALLOWED_HOSTS must be set (e.g. YOUR_USERNAME.pythonanywhere.com).")
if not env("DATABASE_URL"):
    raise ImproperlyConfigured("DATABASE_URL must be set in production.")
if not (CORS_ALLOWED_ORIGINS or CORS_ALLOWED_ORIGIN_REGEXES):
    raise ImproperlyConfigured("FRONTEND_URL must be set so the Vercel frontend may call this API.")

# ── HTTPS & cookies ─────────────────────────────────────────────────────────
# PythonAnywhere terminates TLS in front of the app and forwards this header.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = env_bool("SECURE_SSL_REDIRECT", True)
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"

# ── Security headers ────────────────────────────────────────────────────────
SECURE_HSTS_SECONDS = env_int("SECURE_HSTS_SECONDS", 31536000)  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
SECURE_CROSS_ORIGIN_OPENER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"

# PythonAnywhere puts exactly one proxy in front of the app; DRF throttling
# needs to know so it reads the real client IP from X-Forwarded-For.
REST_FRAMEWORK = {**REST_FRAMEWORK, "NUM_PROXIES": env_int("NUM_PROXIES", 1)}  # noqa: F405
