from rest_framework.permissions import SAFE_METHODS, BasePermission


def _is_admin(user):
    return bool(user and user.is_authenticated and user.is_active and user.is_staff)


class IsStaffOrReadOnly(BasePermission):
    """Anyone can read; only staff users (portfolio owner) can create/update/delete.

    The old Node API accepted any valid JWT as admin. Here the token must also
    belong to an active staff account.
    """

    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or _is_admin(request.user)


class IsStaff(BasePermission):
    def has_permission(self, request, view):
        return _is_admin(request.user)
