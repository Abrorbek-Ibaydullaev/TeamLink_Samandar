from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.http import HttpResponse
from django.contrib.auth import get_user_model
import csv
import json

from .models import Task, Comment, TaskLabel, TaskLabelAssignment
from .serializers import (
    TaskSerializer,
    TaskCreateSerializer,
    TaskUpdateSerializer,
    TaskMoveSerializer,
    TaskBulkUpdateSerializer,
    CommentSerializer,
    CommentCreateSerializer,
    TaskLabelSerializer,
    TaskExportSerializer
)
from apps.activity.models import ActivityLog
from apps.notifications.models import Notification

User = get_user_model()


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Support nested routes
        workspace_pk = self.kwargs.get('workspace_pk')
        project_pk = self.kwargs.get('project_pk')
        column_pk = self.kwargs.get('column_pk')

        queryset = Task.objects.filter(
            column__project__workspace__memberships__user=user,
            column__project__workspace__memberships__is_active=True
        )

        # Filter by nested route parameters
        if workspace_pk:
            queryset = queryset.filter(
                column__project__workspace_id=workspace_pk)
        if project_pk:
            queryset = queryset.filter(column__project_id=project_pk)
        if column_pk:
            queryset = queryset.filter(column_id=column_pk)

        # Filter by query params (backwards compatibility)
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(column__project_id=project_id)

        column_id = self.request.query_params.get('column')
        if column_id:
            queryset = queryset.filter(column_id=column_id)

        assignee_id = self.request.query_params.get('assignee')
        if assignee_id:
            queryset = queryset.filter(assignee__id=assignee_id)

        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)

        task_status = self.request.query_params.get('status')
        if task_status:
            queryset = queryset.filter(status=task_status)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        return queryset.distinct().select_related(
            'column__project', 'created_by', 'assignee'
        ).prefetch_related('comments', 'attachments', 'label_assignments__label').order_by('position', '-created_at')

    def get_serializer_class(self):
        if self.action == 'create':
            return TaskCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TaskUpdateSerializer
        return TaskSerializer

    def perform_create(self, serializer):
        task = serializer.save(created_by=self.request.user)

        ActivityLog.log_activity(
        user=self.request.user,
        action='create',
        entity_type='task',
        entity_id=task.id,
        description=f"Created task '{task.title}'",
        workspace=task.column.project.workspace,
        project=task.column.project
    )

        if task.assignee and task.assignee != self.request.user:
            Notification.objects.create(
                recipient=task.assignee,
                sender=self.request.user,
                notification_type='task_assigned',
                title='New Task Assigned',
                message=f'You have been assigned to task: {task.title}',
                link=f'/workspaces/{task.column.project.workspace.id}/projects/{task.column.project.id}',
                task=task,
                project=task.column.project
            )

    def perform_update(self, serializer):
        old_task = self.get_object()
        old_assignee = old_task.assignee

        task = serializer.save()

        # Log activity
        ActivityLog.log_activity(
            user=self.request.user,
            action='update',
            entity_type='task',
            entity_id=task.id,
            description=f"Updated task '{task.title}'",
            workspace=task.column.project.workspace,
            project=task.column.project
        )

        # Notify new assignee if changed
        new_assignee = task.assignee
        if new_assignee and new_assignee != old_assignee and new_assignee != self.request.user:
            Notification.objects.create(
                recipient=new_assignee,
                sender=self.request.user,
                notification_type='task_assigned',
                title='Task Assigned to You',
                message=f'You have been assigned to task: {task.title}',
                link=f'/workspaces/{task.column.project.workspace.id}/projects/{task.column.project.id}',
                task=task,
                project=task.column.project
            )

    def perform_destroy(self, instance):
        ActivityLog.log_activity(
            user=self.request.user,
            action='delete',
            entity_type='task',
            entity_id=str(instance.id),
            description=f"Deleted task '{instance.title}'",
            workspace=instance.column.project.workspace,
            project=instance.column.project
        )

        instance.delete()

    @action(detail=True, methods=['post'])
    def move(self, request, workspace_pk=None, project_pk=None, column_pk=None, pk=None):
        task = self.get_object()
        serializer = TaskMoveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        task.column_id = serializer.validated_data['column_id']
        if 'position' in serializer.validated_data:
            task.position = serializer.validated_data['position']
        task.save()

        ActivityLog.log_activity(
            user=request.user,
            action='move',
            entity_type='task',
            entity_id=task.id,
            description=f"Moved task '{task.title}' to {task.column.name}",
            workspace=task.column.project.workspace,
            project=task.column.project
        )

        return Response(TaskSerializer(task).data)

    @action(detail=True, methods=['get'])
    def comments(self, request, workspace_pk=None, project_pk=None, column_pk=None, pk=None):
        task = self.get_object()
        comments = task.comments.all().select_related('user')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_comment(self, request, workspace_pk=None, project_pk=None, column_pk=None, pk=None):
        task = self.get_object()
        serializer = CommentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        comment = Comment.objects.create(
            task=task,
            user=request.user,
            content=serializer.validated_data['content']
        )

        ActivityLog.log_activity(
            user=request.user,
            action='comment',
            entity_type='task',
            entity_id=task.id,
            description=f"Commented on task '{task.title}'",
            workspace=task.column.project.workspace,
            project=task.column.project
        )

        # Notify assignee
        if task.assignee and task.assignee != request.user:
            Notification.objects.create(
                recipient=task.assignee,
                sender=request.user,
                notification_type='task_comment',
                title='New Comment on Task',
                message=f'{request.user.full_name or request.user.email} commented on: {task.title}',
                link=f'/workspaces/{task.column.project.workspace.id}/projects/{task.column.project.id}',
                task=task,
                project=task.column.project
            )

        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)
