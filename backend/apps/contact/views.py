from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.core.notifications import notify_owner

from .serializers import ContactMessageSerializer


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
        notify_owner(
            message.subject,
            f"From: {message.name} <{message.email}>\n"
            f"Project type: {message.project_type or '-'}\n"
            f"Budget: {message.budget or '-'}\n\n"
            f"{message.message}",
        )
        return Response({"success": True})
