from django.db import models
from django.conf import settings
import uuid


class Task(models.Model):
    """Task model for Kanban board"""

    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    STATUS_CHOICES = (
        ('todo', 'To Do'),
        ('in-progress', 'In Progress'),
        ('review', 'Review'),
        ('done', 'Done'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    column = models.ForeignKey(
        'projects.Column',
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tasks'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_tasks'
    )
    priority = models.CharField(
        max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='todo')
    position = models.IntegerField(default=0)
    due_date = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tasks'
        ordering = ['position', '-created_at']
        indexes = [
            models.Index(fields=['project']),
            models.Index(fields=['column']),
            models.Index(fields=['assignee']),
            models.Index(fields=['priority']),
            models.Index(fields=['status']),
            models.Index(fields=['due_date']),
        ]

    def __str__(self):
        return self.title


class Comment(models.Model):
    """Comments on tasks"""

    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='task_comments'
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'task_comments'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['task']),
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"Comment by {self.user.email} on {self.task.title}"


class TaskLabel(models.Model):
    """Labels/tags for tasks"""

    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        related_name='labels'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'task_labels'
        unique_together = ['name', 'project']
        indexes = [
            models.Index(fields=['project']),
        ]

    def __str__(self):
        return self.name


class TaskLabelAssignment(models.Model):
    """Many-to-many relationship between tasks and labels"""

    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='label_assignments'
    )
    label = models.ForeignKey(
        TaskLabel,
        on_delete=models.CASCADE,
        related_name='task_assignments'
    )
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'task_label_assignments'
        unique_together = ['task', 'label']

    def __str__(self):
        return f"{self.task.title} - {self.label.name}"
