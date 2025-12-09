from rest_framework import serializers
from .models import Workspace, Membership
from apps.authentication.serializers import UserSerializer


class MembershipSerializer(serializers.ModelSerializer):
    """Serializer for workspace membership"""
    user = UserSerializer(read_only=True)

    class Meta:
        model = Membership
        fields = ['id', 'user', 'workspace', 'role', 'joined_at', 'is_active']
        read_only_fields = ['id', 'joined_at']


class WorkspaceSerializer(serializers.ModelSerializer):
    """Serializer for workspace"""
    owner = UserSerializer(read_only=True)
    members_count = serializers.SerializerMethodField()
    projects_count = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()

    class Meta:
        model = Workspace
        fields = [
            'id', 'name', 'description', 'workspace_type', 'owner',
            'invite_code', 'is_active', 'members_count', 'projects_count',
            'user_role', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner',
                            'invite_code', 'created_at', 'updated_at']

    def get_members_count(self, obj):
        return obj.memberships.filter(is_active=True).count()

    def get_projects_count(self, obj):
        return obj.projects.filter(is_archived=False).count()

    def get_user_role(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            membership = obj.memberships.filter(
                user=request.user, is_active=True).first()
            return membership.role if membership else None
        return None


class WorkspaceCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating workspace"""

    class Meta:
        model = Workspace
        fields = ['id', 'name', 'description', 'workspace_type',
                  'owner', 'invite_code', 'created_at']
        read_only_fields = ['id', 'owner', 'invite_code', 'created_at']


class WorkspaceInviteSerializer(serializers.Serializer):
    """Serializer for joining workspace via invite code"""
    invite_code = serializers.CharField(max_length=10)

    def validate_invite_code(self, value):
        try:
            workspace = Workspace.objects.get(
                invite_code=value, is_active=True)
        except Workspace.DoesNotExist:
            raise serializers.ValidationError("Invalid invite code.")
        return value

    def save(self):
        request = self.context.get('request')
        workspace = Workspace.objects.get(
            invite_code=self.validated_data['invite_code'],
            is_active=True
        )

        # Check if already a member
        if Membership.objects.filter(user=request.user, workspace=workspace).exists():
            raise serializers.ValidationError(
                "You are already a member of this workspace.")

        # Add as member
        membership = Membership.objects.create(
            user=request.user,
            workspace=workspace,
            role='member'
        )

        return workspace


class MembershipUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating membership role"""

    class Meta:
        model = Membership
        fields = ['role', 'is_active']
