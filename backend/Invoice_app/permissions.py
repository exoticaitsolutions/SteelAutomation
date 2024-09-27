from rest_framework.permissions import BasePermission

class IsAdminUserPermission(BasePermission):
    """
    Custom permission to only allow users with the role of 'Admin' to perform certain actions.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'
