from django.db import models
from django.conf import settings
import uuid


class Notification(models.Model):

    NOTIFICATION_TYPES = (
        ('task_assigned', 'Task Assigned'),
        ('task_updated', 'Task Updated'),
        ('task_comment', 'Task Comment'),
        ('project_added', 'Added to Project'),
        ('workspace_invite', 'Workspace Invite'),
        ('mention', 'Mentioned'),
        ('due_date_reminder', 'Due Date Reminder'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='sent_notifications'
    )
    notification_type = models.CharField(
        max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=500)
    message = models.TextField()
    link = models.CharField(max_length=500, blank=True)  # URL to navigate to

    # Optional relations
    task = models.ForeignKey(
        'tasks.Task',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )
    workspace = models.ForeignKey(
        'workspaces.Workspace',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )

    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.notification_type} for {self.recipient.email}"

    def mark_as_read(self):
        from django.utils import timezone
        self.is_read = True
        self.read_at = timezone.now()
        self.save()
