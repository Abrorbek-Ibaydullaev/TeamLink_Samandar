from django.contrib import admin
from .models import Workspace, Membership


@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = ['name', 'workspace_type', 'owner',
                    'invite_code', 'is_active', 'created_at']
    list_filter = ['workspace_type', 'is_active', 'created_at']
    search_fields = ['name', 'description', 'invite_code', 'owner__email']
    readonly_fields = ['id', 'invite_code', 'created_at', 'updated_at']

    fieldsets = (
        ('Basic Info', {'fields': ('name', 'description', 'workspace_type')}),
        ('Ownership', {'fields': ('owner',)}),
        ('Invite', {'fields': ('invite_code',)}),
        ('Status', {'fields': ('is_active',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ['user', 'workspace', 'role', 'is_active', 'joined_at']
    list_filter = ['role', 'is_active', 'joined_at']
    search_fields = ['user__email', 'workspace__name']
    readonly_fields = ['joined_at']
