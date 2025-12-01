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
    """ViewSet for task CRUD operations"""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(
            project__workspace__memberships__user=user,
            project__workspace__memberships__is_active=True
        )

        # Filter by project
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)

        # Filter by column
        column_id = self.request.query_params.get('column')
        if column_id:
            queryset = queryset.filter(column_id=column_id)

        # Filter by assignee
        assignee_id = self.request.query_params.get('assignee')
        if assignee_id:
            queryset = queryset.filter(assignee_id=assignee_id)

        # Filter by priority
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)

        # Filter by status
        task_status = self.request.query_params.get('status')
        if task_status:
            queryset = queryset.filter(status=task_status)

        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        return queryset.distinct().select_related(
            'project', 'column', 'assignee', 'created_by'
        ).prefetch_related('comments', 'attachments')

    def get_serializer_class(self):
        if self.action == 'create':
            return TaskCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TaskUpdateSerializer
        return TaskSerializer

    def perform_create(self, serializer):
        task = serializer.save()

        # Log activity
        ActivityLog.log_activity(
            user=self.request.user,
            action='create',
            entity_type='task',
            entity_id=task.id,
            description=f"Created task '{task.title}'",
            workspace=task.project.workspace,
            project=task.project
        )

        # Create notification for assignee
        if task.assignee and task.assignee != self.request.user:
            Notification.objects.create(
                recipient=task.assignee,
                sender=self.request.user,
                notification_type='task_assigned',
                title='New Task Assigned',
                message=f'You have been assigned to task: {task.title}',
                link=f'/projects/{task.project.id}/tasks/{task.id}',
                task=task,
                project=task.project
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
            workspace=task.project.workspace,
            project=task.project
        )

        # Notify if assignee changed
        if task.assignee and task.assignee != old_assignee and task.assignee != self.request.user:
            Notification.objects.create(
                recipient=task.assignee,
                sender=self.request.user,
                notification_type='task_assigned',
                title='Task Assigned to You',
                message=f'You have been assigned to task: {task.title}',
                link=f'/projects/{task.project.id}/tasks/{task.id}',
                task=task,
                project=task.project
            )

    def perform_destroy(self, instance):
        ActivityLog.log_activity(
            user=self.request.user,
            action='delete',
            entity_type='task',
            entity_id=str(instance.id),
            description=f"Deleted task '{instance.title}'",
            workspace=instance.project.workspace,
            project=instance.project
        )

        instance.delete()

    @action(detail=True, methods=['post'])
    def move(self, request, pk=None):
        """Move task to different column"""
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
            workspace=task.project.workspace,
            project=task.project
        )

        return Response(TaskSerializer(task).data)

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """Get all comments for a task"""
        task = self.get_object()
        comments = task.comments.all().select_related('user')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """Add a comment to task"""
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
            workspace=task.project.workspace,
            project=task.project
        )

        # Notify task assignee
        if task.assignee and task.assignee != request.user:
            Notification.objects.create(
                recipient=task.assignee,
                sender=request.user,
                notification_type='task_comment',
                title='New Comment on Your Task',
                message=f'{request.user.display_name} commented on: {task.title}',
                link=f'/projects/{task.project.id}/tasks/{task.id}',
                task=task,
                project=task.project
            )

        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        """Bulk update multiple tasks"""
        serializer = TaskBulkUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        task_ids = serializer.validated_data['task_ids']
        update_data = {}

        if 'assignee_id' in serializer.validated_data:
            update_data['assignee_id'] = serializer.validated_data['assignee_id']
        if 'priority' in serializer.validated_data:
            update_data['priority'] = serializer.validated_data['priority']
        if 'status' in serializer.validated_data:
            update_data['status'] = serializer.validated_data['status']

        tasks = Task.objects.filter(id__in=task_ids)
        tasks.update(**update_data)

        return Response({
            'message': f'Successfully updated {tasks.count()} tasks'
        })

    @action(detail=False, methods=['get'])
    def export(self, request):
        serializer = TaskExportSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        queryset = self.get_queryset()

        # Apply filters from serializer
        if 'project_id' in serializer.validated_data:
            queryset = queryset.filter(
                project_id=serializer.validated_data['project_id'])
        if 'column_id' in serializer.validated_data:
            queryset = queryset.filter(
                column_id=serializer.validated_data['column_id'])
        if 'status' in serializer.validated_data:
            queryset = queryset.filter(
                status=serializer.validated_data['status'])
        if 'priority' in serializer.validated_data:
            queryset = queryset.filter(
                priority=serializer.validated_data['priority'])

        export_format = serializer.validated_data.get('format', 'csv')

        if export_format == 'csv':
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="tasks.csv"'

            writer = csv.writer(response)
            writer.writerow([
                'ID', 'Title', 'Description', 'Project', 'Column', 'Assignee',
                'Priority', 'Status', 'Due Date', 'Created At'
            ])

            for task in queryset:
                writer.writerow([
                    str(task.id),
                    task.title,
                    task.description,
                    task.project.name,
                    task.column.name if task.column else '',
                    task.assignee.email if task.assignee else '',
                    task.priority,
                    task.status,
                    task.due_date,
                    task.created_at
                ])

            return response

        else:  # JSON
            tasks_data = TaskSerializer(queryset, many=True).data
            response = HttpResponse(
                json.dumps(tasks_data, indent=2),
                content_type='application/json'
            )
            response['Content-Disposition'] = 'attachment; filename="tasks.json"'
            return response


class CommentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def get_queryset(self):
        user = self.request.user
        task_id = self.request.query_params.get('task')

        queryset = Comment.objects.filter(
            task__project__workspace__memberships__user=user,
            task__project__workspace__memberships__is_active=True
        )

        if task_id:
            queryset = queryset.filter(task_id=task_id)

        return queryset.distinct().select_related('task', 'user')

    def perform_create(self, serializer):
        comment = serializer.save(user=self.request.user)

        ActivityLog.log_activity(
            user=self.request.user,
            action='comment',
            entity_type='comment',
            entity_id=comment.id,
            description=f"Added comment on task '{comment.task.title}'",
            workspace=comment.task.project.workspace,
            project=comment.task.project
        )

    def perform_destroy(self, instance):
        ActivityLog.log_activity(
            user=self.request.user,
            action='delete',
            entity_type='comment',
            entity_id=instance.id,
            description=f"Deleted comment on task '{instance.task.title}'",
            workspace=instance.task.project.workspace,
            project=instance.task.project
        )

        instance.delete()


class TaskLabelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskLabelSerializer

    def get_queryset(self):
        user = self.request.user
        project_id = self.request.query_params.get('project')

        queryset = TaskLabel.objects.filter(
            project__workspace__memberships__user=user,
            project__workspace__memberships__is_active=True
        )

        if project_id:
            queryset = queryset.filter(project_id=project_id)

        return queryset.distinct()

    def perform_create(self, serializer):
        label = serializer.save()

        ActivityLog.log_activity(
            user=self.request.user,
            action='create',
            entity_type='label',
            entity_id=label.id,
            description=f"Created label '{label.name}'",
            workspace=label.project.workspace,
            project=label.project
        )
