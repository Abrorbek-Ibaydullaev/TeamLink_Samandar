from django.db import models
from django.conf import settings
import uuid


class ActivityLog(models.Model):

    ACTION_TYPES = (
        ('create', 'Created'),
        ('update', 'Updated'),
        ('delete', 'Deleted'),
        ('archive', 'Archived'),
        ('restore', 'Restored'),
        ('move', 'Moved'),
        ('assign', 'Assigned'),
        ('comment', 'Commented'),
        ('upload', 'Uploaded'),
    )

    ENTITY_TYPES = (
        ('workspace', 'Workspace'),
        ('project', 'Project'),
        ('task', 'Task'),
        ('comment', 'Comment'),
        ('file', 'File'),
        ('column', 'Column'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='activities'
    )
    action = models.CharField(max_length=20, choices=ACTION_TYPES)
    entity_type = models.CharField(max_length=50, choices=ENTITY_TYPES)
    entity_id = models.CharField(max_length=100)  # UUID as string
    description = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)  # Additional context

    # Relations
    workspace = models.ForeignKey(
        'workspaces.Workspace',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='activities'
    )
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='activities'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'activity_logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['workspace', 'created_at']),
            models.Index(fields=['project', 'created_at']),
            models.Index(fields=['user']),
            models.Index(fields=['entity_type', 'entity_id']),
        ]

    def __str__(self):
        return f"{self.user.email if self.user else 'System'} {self.action} {self.entity_type}"

    @classmethod
    def log_activity(cls, user, action, entity_type, entity_id, description, workspace=None, project=None, metadata=None):
        return cls.objects.create(
            user=user,
            action=action,
            entity_type=entity_type,
            entity_id=str(entity_id),
            description=description,
            workspace=workspace,
            project=project,
            metadata=metadata or {}
        )
