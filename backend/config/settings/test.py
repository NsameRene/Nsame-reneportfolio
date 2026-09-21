"""Used by `python manage.py test --settings=config.settings.test` (fast hashing)."""
from .local import *  # noqa: F401,F403

PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
