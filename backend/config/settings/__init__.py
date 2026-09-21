"""Settings live in the modules of this package; the package itself is empty.

Pointing DJANGO_SETTINGS_MODULE at ``config.settings`` loads nothing and fails
much later with the cryptic "'Settings' object has no attribute 'ROOT_URLCONF'",
so fail immediately with the fix instead.
"""
import os

from django.core.exceptions import ImproperlyConfigured

if os.environ.get("DJANGO_SETTINGS_MODULE") == "config.settings":
    raise ImproperlyConfigured(
        "DJANGO_SETTINGS_MODULE is 'config.settings', which is an empty package. "
        "Use 'config.settings.production' on the server (in the WSGI file and in backend/.env) "
        "or 'config.settings.local' for development."
    )
