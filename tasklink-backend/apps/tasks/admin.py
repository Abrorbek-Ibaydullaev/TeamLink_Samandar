from django.contrib import admin
from .models import TaskLabel, Comment, Task
# Register your models here.

# admin.site.register(Task)
admin.site.register(TaskLabel)
admin.site.register(Comment)
admin.site.register(Task)
