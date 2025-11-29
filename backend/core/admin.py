from django.contrib import admin
from .models import User, Workspace, Membership, Project, Column, Task, Comment, FileAttachment, ChatMessage, ActivityLog, Notification

admin.site.register(User)
admin.site.register(Workspace)
admin.site.register(Membership)
admin.site.register(Project)
admin.site.register(Column)
admin.site.register(Task)
admin.site.register(Comment)
admin.site.register(FileAttachment)
admin.site.register(ChatMessage)
admin.site.register(ActivityLog)
admin.site.register(Notification)
