from django.contrib import admin

# Register your models here.
from .models import Project, Column, ProjectMember
admin.site.register(Project)
admin.site.register(Column)
admin.site.register(ProjectMember)
