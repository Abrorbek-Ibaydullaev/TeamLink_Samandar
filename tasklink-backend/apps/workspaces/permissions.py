from rest_framework import permissions
from .models import Membership


class IsWorkspaceMember(permissions.BasePermission):
    """Permission to check if user is a workspace member"""

    def has_object_permission(self, request, view, obj):
        return Membership.objects.filter(
            workspace=obj,
            user=request.user,
            is_active=True
        ).exists()


class IsWorkspaceAdmin(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        membership = Membership.objects.filter(
            workspace=obj,
            user=request.user,
            is_active=True
        ).first()

        return membership and membership.role in ['owner', 'admin']


class IsWorkspaceOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
