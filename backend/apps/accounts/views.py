from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import AccessToken

from apps.core.permissions import IsStaff

User = get_user_model()


def _user_payload(user):
    # Same shape the Node API returned: { email, role }.
    return {"email": user.email, "role": "admin"}


def _authenticate_by_email(email, password):
    """Log in with an email address. Django usernames are separate, so look the
    account up by email and let Django verify the password (and is_active)."""
    for user in User.objects.filter(email__iexact=email).order_by("id"):
        authenticated = authenticate(username=user.get_username(), password=password)
        if authenticated is not None:
            return authenticated
    # Do comparable work when the email is unknown so response time does not
    # reveal which addresses have accounts.
    User().set_password(password)
    return None


class LoginView(APIView):
    """POST /api/auth/login  { email, password } -> { token, user }"""

    permission_classes = [AllowAny]
    authentication_classes: list = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        invalid = Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        if not isinstance(email, str) or not isinstance(password, str) or not email or not password:
            return invalid

        user = _authenticate_by_email(email.strip(), password)
        # Only staff accounts may use the admin dashboard.
        if user is None or not user.is_staff:
            return invalid

        token = AccessToken.for_user(user)
        return Response({"token": str(token), "user": _user_payload(user)})


class CheckView(APIView):
    """POST /api/auth/check (Bearer token) -> { user }"""

    permission_classes = [IsStaff]

    def post(self, request):
        return Response({"user": _user_payload(request.user)})
