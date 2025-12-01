from django.db import models
from django.conf import settings
import uuid
import os


def task_attachment_path(instance, filename):
    return f'attachments/tasks/{instance.task.id}/{filename}'


def chat_attachment_path(instance, filename):
    return f'attachments/chat/{instance.message.project.id}/{filename}'


class FileAttachment(models.Model):
    """File attachments for tasks and chat"""

    FILE_TYPES = (
        ('document', 'Document'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('other', 'Other'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.FileField(upload_to='attachments/')
    original_filename = models.CharField(max_length=500)
    file_type = models.CharField(
        max_length=20, choices=FILE_TYPES, default='other')
    file_size = models.BigIntegerField()  # in bytes
    mime_type = models.CharField(max_length=100, blank=True)

    # Relations
    task = models.ForeignKey(
        'tasks.Task',
        on_delete=models.CASCADE,
        related_name='attachments',
        null=True,
        blank=True
    )
    chat_message = models.ForeignKey(
        'chat.ChatMessage',
        on_delete=models.CASCADE,
        related_name='attachments',
        null=True,
        blank=True
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_files'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'file_attachments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['task']),
            models.Index(fields=['chat_message']),
            models.Index(fields=['uploaded_by']),
        ]

    def __str__(self):
        return self.original_filename

    def delete(self, *args, **kwargs):
        if self.file:
            if os.path.isfile(self.file.path):
                os.remove(self.file.path)
        super().delete(*args, **kwargs)

    @property
    def file_extension(self):
        return os.path.splitext(self.original_filename)[1].lower()

    @property
    def file_size_mb(self):
        return round(self.file_size / (1024 * 1024), 2)
