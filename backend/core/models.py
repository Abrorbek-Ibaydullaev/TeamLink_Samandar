from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    # extend later (profile, avatar)
    pass


class Workspace(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Membership(models.Model):
    ROLE_CHOICES = [('owner', 'Owner'), ('member', 'Member')]
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE)
    role = models.CharField(
        max_length=20, choices=ROLE_CHOICES, default='member')


class Project(models.Model):
    workspace = models.ForeignKey(
        Workspace, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=200)
    archived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Column(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='columns')
    title = models.CharField(max_length=200)
    order = models.IntegerField(default=0)


class Task(models.Model):
    column = models.ForeignKey(
        Column, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    assignee = models.ForeignKey(
        'User', null=True, blank=True, on_delete=models.SET_NULL)
    priority = models.IntegerField(default=0)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey('User', on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class FileAttachment(models.Model):
    file = models.FileField(upload_to='uploads/')
    uploaded_by = models.ForeignKey('User', on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    task = models.ForeignKey(
        Task, null=True, blank=True, on_delete=models.CASCADE)
    message = models.ForeignKey(
        'ChatMessage', null=True, blank=True, on_delete=models.CASCADE)


class ChatMessage(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey('User', on_delete=models.CASCADE)
    text = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)


class ActivityLog(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    actor = models.ForeignKey('User', on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
