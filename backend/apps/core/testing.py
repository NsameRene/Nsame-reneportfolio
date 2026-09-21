"""Shared helpers for the test suites."""
import io

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from rest_framework.test import APIClient

ADMIN_EMAIL = "owner@example.com"
ADMIN_PASSWORD = "correct-horse-battery-9"


def make_staff():
    return get_user_model().objects.create_user(
        username="owner", email=ADMIN_EMAIL, password=ADMIN_PASSWORD, is_staff=True, is_superuser=True
    )


def staff_client():
    """APIClient logged in through the real /api/auth/login endpoint."""
    make_staff()
    client = APIClient()
    token = client.post("/api/auth/login", {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, format="json").data["token"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    cache.clear()  # login throttling must not leak between tests
    return client


def png_upload(name="pic.png", size=(4, 4)):
    buffer = io.BytesIO()
    Image.new("RGB", size, "red").save(buffer, "PNG")
    return SimpleUploadedFile(name, buffer.getvalue(), content_type="image/png")
