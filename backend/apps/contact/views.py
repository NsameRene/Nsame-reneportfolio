import logging

from django.conf import settings
from django.core.mail import send_mail
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .serializers import ContactMessageSerializer

logger = logging.getLogger(__name__)


def notify_owner(message):
    """Forward the message by email if CONTACT_NOTIFY_EMAIL is configured.
    A mail failure must never lose the message or fail the request."""
    if not settings.CONTACT_NOTIFY_EMAIL:
        return
    body = (
        f"From: {message.name} <{message.email}>\n"
        f"Project type: {message.project_type or '-'}\n"
        f"Budget: {message.budget or '-'}\n\n"
        f"{message.message}"
    )
    try:
        send_mail(
            subject=f"[Portfolio] {message.subject}"[:200],
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_NOTIFY_EMAIL],
        )
    except Exception:  # noqa: BLE001 - SMTP errors vary widely
        logger.exception("Could not send contact notification for message %s", message.pk)


class ContactView(APIView):
    """POST /api/contact  { name, email, message, projectType?, budget?, subject? }"""

    permission_classes = [AllowAny]
    authentication_classes: list = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "contact"

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save()
        notify_owner(message)
        return Response({"success": True})
