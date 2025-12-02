from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Workspace, Membership
from .serializers import (
    WorkspaceSerializer,
    WorkspaceCreateSerializer,
    WorkspaceInviteSerializer,
    MembershipSerializer,
    MembershipUpdateSerializer
)
from .permissions import IsWorkspaceMember, IsWorkspaceAdmin


class WorkspaceViewSet(viewsets.ModelViewSet):
    """ViewSet for workspace CRUD operations"""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Workspace.objects.filter(
            Q(memberships__user=user, memberships__is_active=True) |
            Q(owner=user)
        ).distinct()

    def get_serializer_class(self):
        if self.action == 'create':
            return WorkspaceCreateSerializer
        return WorkspaceSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsWorkspaceAdmin()]
        return super().get_permissions()

    def perform_create(self, serializer):
        """Create workspace and add owner as member"""
        workspace = serializer.save(owner=self.request.user)

        # Create owner membership
        Membership.objects.create(
            user=self.request.user,
            workspace=workspace,
            role='owner',
            is_active=True
        )

    @action(detail=False, methods=['post'])
    def join(self, request):
        """Join workspace using invite code"""
        serializer = WorkspaceInviteSerializer(
            data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        workspace = serializer.save()

        return Response({
            'message': 'Successfully joined workspace',
            'workspace': WorkspaceSerializer(workspace, context={'request': request}).data
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        """Get all members of a workspace"""
        workspace = self.get_object()
        memberships = workspace.memberships.filter(
            is_active=True).select_related('user')
        serializer = MembershipSerializer(memberships, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """Add a member to workspace (admin only)"""
        workspace = self.get_object()
        user_id = request.data.get('user_id')
        role = request.data.get('role', 'member')

        if not user_id:
            return Response({
                'error': 'user_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Check if already a member
        if Membership.objects.filter(user=user, workspace=workspace).exists():
            return Response({
                'error': 'User is already a member'
            }, status=status.HTTP_400_BAD_REQUEST)

        membership = Membership.objects.create(
            user=user,
            workspace=workspace,
            role=role
        )

        return Response(
            MembershipSerializer(membership).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['patch'])
    def update_member(self, request, pk=None):
        """Update member role (admin only)"""
        workspace = self.get_object()
        user_id = request.data.get('user_id')

        try:
            membership = Membership.objects.get(
                workspace=workspace,
                user_id=user_id
            )
        except Membership.DoesNotExist:
            return Response({
                'error': 'Member not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = MembershipUpdateSerializer(
            membership,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            MembershipSerializer(membership).data
        )

    @action(detail=True, methods=['delete'])
    def remove_member(self, request, pk=None):
        """Remove member from workspace (admin only)"""
        workspace = self.get_object()
        user_id = request.data.get('user_id')

        try:
            membership = Membership.objects.get(
                workspace=workspace,
                user_id=user_id
            )

            # Cannot remove workspace owner
            if membership.role == 'owner':
                return Response({
                    'error': 'Cannot remove workspace owner'
                }, status=status.HTTP_400_BAD_REQUEST)

            membership.delete()

            return Response({
                'message': 'Member removed successfully'
            }, status=status.HTTP_200_OK)

        except Membership.DoesNotExist:
            return Response({
                'error': 'Member not found'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def regenerate_invite(self, request, pk=None):
        """Regenerate workspace invite code (admin only)"""
        workspace = self.get_object()
        workspace.invite_code = Workspace.generate_invite_code()
        workspace.save()

        return Response({
            'invite_code': workspace.invite_code
        })

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Leave workspace"""
        workspace = self.get_object()

        try:
            membership = Membership.objects.get(
                workspace=workspace,
                user=request.user
            )

            # Owner cannot leave
            if membership.role == 'owner':
                return Response({
                    'error': 'Owner cannot leave workspace. Transfer ownership first.'
                }, status=status.HTTP_400_BAD_REQUEST)

            membership.delete()

            return Response({
                'message': 'Successfully left workspace'
            }, status=status.HTTP_200_OK)

        except Membership.DoesNotExist:
            return Response({
                'error': 'You are not a member of this workspace'
            }, status=status.HTTP_404_NOT_FOUND)
