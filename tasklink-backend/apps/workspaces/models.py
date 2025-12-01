from django.db import models
from django.conf import settings
import uuid


class Workspace(models.Model):
    """Workspace model for organizing projects"""

    WORKSPACE_TYPES = (
        ('personal', 'Personal'),
        ('team', 'Team'),
        ('organization', 'Organization'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    workspace_type = models.CharField(
        max_length=20, choices=WORKSPACE_TYPES, default='team')
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_workspaces'
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='Membership',
        related_name='workspaces'
    )
    invite_code = models.CharField(max_length=10, unique=True, db_index=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'workspaces'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['invite_code']),
            models.Index(fields=['owner']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.invite_code:
            self.invite_code = self.generate_invite_code()
        super().save(*args, **kwargs)

    @staticmethod
    def generate_invite_code():
        """Generate a unique invite code"""
        import random
        import string
        while True:
            code = ''.join(random.choices(
                string.ascii_uppercase + string.digits, k=8))
            if not Workspace.objects.filter(invite_code=code).exists():
                return code


class Membership(models.Model):
    """User membership in workspace with role"""

    ROLES = (
        ('owner', 'Owner'),
        ('admin', 'Admin'),
        ('member', 'Member'),
        ('guest', 'Guest'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='memberships'
    )
    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name='memberships'
    )
    role = models.CharField(max_length=20, choices=ROLES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'memberships'
        unique_together = ['user', 'workspace']
        ordering = ['-joined_at']
        indexes = [
            models.Index(fields=['user', 'workspace']),
            models.Index(fields=['role']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.workspace.name} ({self.role})"
