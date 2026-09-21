import re
from urllib.parse import urlparse

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

# SVG is deliberately excluded: it can carry scripts.
validate_image_extension = FileExtensionValidator(["jpg", "jpeg", "png", "gif", "webp"])


def validate_image_size(file):
    if file.size > settings.MAX_UPLOAD_SIZE:
        limit_mb = settings.MAX_UPLOAD_SIZE // (1024 * 1024)
        raise ValidationError(f"Image is too large. The maximum size is {limit_mb} MB.")


IMAGE_VALIDATORS = [validate_image_extension, validate_image_size]

_HOST_RE = re.compile(r"^[^\s/?#]+$")


def validate_link(value):
    """Links/image URLs the owner types in: http(s) URL, site-relative path or "#".

    Rejects ``javascript:`` / ``data:`` and other schemes that would be unsafe
    to put in an href/src. Legacy placeholder values such as "#" stay valid.
    """
    if not value or value == "#" or value.startswith("/"):
        return
    parsed = urlparse(value)
    if parsed.scheme not in ("http", "https") or not _HOST_RE.match(parsed.netloc or ""):
        raise ValidationError("Enter a valid http(s) URL.")
