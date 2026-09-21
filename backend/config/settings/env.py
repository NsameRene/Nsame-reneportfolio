"""Tiny helpers for reading configuration from the environment."""
import os

from django.core.exceptions import ImproperlyConfigured

_TRUE = {"1", "true", "yes", "on"}


def env(name, default=None):
    """Value of an environment variable; unset, blank or whitespace-only means "use the default"."""
    value = os.environ.get(name)
    if value is None or value.strip() == "":
        return default
    return value.strip()


def env_required(name):
    value = env(name)
    if value is None:
        raise ImproperlyConfigured(f"Environment variable {name} is required.")
    return value


def env_bool(name, default=False):
    value = os.environ.get(name)
    if value is None or value == "":
        return default
    return value.strip().lower() in _TRUE


def env_int(name, default):
    value = os.environ.get(name)
    return default if value is None or value == "" else int(value)


def env_list(name, default=None):
    """Comma-separated list, whitespace and empty items removed."""
    value = os.environ.get(name)
    if value is None or value.strip() == "":
        return list(default or [])
    return [item.strip() for item in value.split(",") if item.strip()]
