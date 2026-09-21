import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def notify_owner(subject, body):
    """Email the site owner if CONTACT_NOTIFY_EMAIL is configured.

    A mail failure must never lose the submission or fail the request, so
    errors are logged and swallowed.
    """
    if not settings.CONTACT_NOTIFY_EMAIL:
        return
    try:
        send_mail(
            subject=f"[Portfolio] {subject}"[:200],
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_NOTIFY_EMAIL],
        )
    except Exception:  # noqa: BLE001 - SMTP errors vary widely
        logger.exception("Could not send owner notification: %s", subject)
