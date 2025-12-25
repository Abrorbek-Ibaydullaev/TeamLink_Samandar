from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.contrib.auth import get_user_model

from .models import Project, Column, ProjectMember
from .serializers import (
    ProjectSerializer,
    ProjectCreateSerializer,
    ProjectUpdateSerializer,
    ColumnSerializer,
    ColumnCreateSerializer,
    ColumnUpdateSerializer,
    ProjectMemberSerializer,
    ProjectMemberAddSerializer
)
from apps.workspaces.models import Membership
from apps.activity.models import ActivityLog
from apps.tasks.models import Task

User = get_user_model()


class ProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for project CRUD operations"""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        workspace_id = self.request.query_params.get('workspace')

        # Get projects where user is a workspace member
        queryset = Project.objects.filter(
            workspace__memberships__user=user,
            workspace__memberships__is_active=True
        )

        if workspace_id:
            queryset = queryset.filter(workspace_id=workspace_id)

        # Filter archived projects
        show_archived = self.request.query_params.get(
            'archived', 'false').lower() == 'true'
        if not show_archived:
            queryset = queryset.filter(is_archived=False)

        return queryset.distinct().select_related('workspace', 'created_by').prefetch_related('columns', 'project_members__user')

    def get_serializer_class(self):
        if self.action == 'create':
            return ProjectCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ProjectUpdateSerializer
        return ProjectSerializer

    def perform_create(self, serializer):
        project = serializer.save()

        # Log activity
        ActivityLog.log_activity(
            user=self.request.user,
            action='create',
            entity_type='project',
            entity_id=project.id,
            description=f"Created project '{project.name}'",
            workspace=project.workspace,
            project=project
        )

    def perform_update(self, serializer):
        project = serializer.save()

        # Log activity
        ActivityLog.log_activity(
            user=self.request.user,
            action='update',
            entity_type='project',
            entity_id=project.id,
            description=f"Updated project '{project.name}'",
            workspace=project.workspace,
            project=project
        )

    def perform_destroy(self, instance):
        # Log activity before deletion
        ActivityLog.log_activity(
            user=self.request.user,
            action='delete',
            entity_type='project',
            entity_id=str(instance.id),
            description=f"Deleted project '{instance.name}'",
            workspace=instance.workspace
        )

        instance.delete()

    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        """Archive a project"""
        project = self.get_object()
        project.is_archived = True
        project.save()

        ActivityLog.log_activity(
            user=request.user,
            action='archive',
            entity_type='project',
            entity_id=project.id,
            description=f"Archived project '{project.name}'",
            workspace=project.workspace,
            project=project
        )

        return Response({'message': 'Project archived successfully'})

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        project = self.get_object()
        project.is_archived = False
        project.save()

        ActivityLog.log_activity(
            user=request.user,
            action='restore',
            entity_type='project',
            entity_id=project.id,
            description=f"Restored project '{project.name}'",
            workspace=project.workspace,
            project=project
        )

        return Response({'message': 'Project restored successfully'})

    @action(detail=True, methods=['get', 'post'], url_path='columns')
    def columns(self, request, workspace_pk=None, pk=None):
        project = self.get_object()

        if request.method == 'GET':
            columns = project.columns.all().order_by('position')
            serializer = ColumnSerializer(columns, many=True)
            return Response(serializer.data)

        serializer = ColumnCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        column = serializer.save(project=project)

        ActivityLog.log_activity(
            user=request.user,
            action='create',
            entity_type='column',
            entity_id=column.id,
            description=f"Added column '{column.name}' to project '{project.name}'",
            workspace=project.workspace,
            project=project
        )

        return Response(ColumnSerializer(column).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def add_column(self, request, pk=None):
        project = self.get_object()
        serializer = ColumnCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        column = serializer.save()

        ActivityLog.log_activity(
            user=request.user,
            action='create',
            entity_type='column',
            entity_id=column.id,
            description=f"Added column '{column.name}' to project '{project.name}'",
            workspace=project.workspace,
            project=project
        )

        return Response(ColumnSerializer(column).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        project = self.get_object()
        members = project.project_members.all().select_related('user', 'added_by')
        serializer = ProjectMemberSerializer(members, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        project = self.get_object()
        serializer = ProjectMemberAddSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = serializer.validated_data['user_id']
        user = User.objects.get(id=user_id)

        # Check if user is a workspace member
        if not Membership.objects.filter(
            workspace=project.workspace,
            user=user,
            is_active=True
        ).exists():
            return Response({
                'error': 'User is not a member of the workspace'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if already a project member
        if ProjectMember.objects.filter(project=project, user=user).exists():
            return Response({
                'error': 'User is already a project member'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Add member
        project_member = ProjectMember.objects.create(
            project=project,
            user=user,
            added_by=request.user
        )

        ActivityLog.log_activity(
            user=request.user,
            action='assign',
            entity_type='project',
            entity_id=project.id,
            description=f"Added {user.email} to project '{project.name}'",
            workspace=project.workspace,
            project=project
        )

        return Response(
            ProjectMemberSerializer(project_member).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['delete'])
    def remove_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')

        try:
            project_member = ProjectMember.objects.get(
                project=project, user_id=user_id)
            user_email = project_member.user.email
            project_member.delete()

            ActivityLog.log_activity(
                user=request.user,
                action='update',
                entity_type='project',
                entity_id=project.id,
                description=f"Removed {user_email} from project '{project.name}'",
                workspace=project.workspace,
                project=project
            )

            return Response({'message': 'Member removed successfully'})
        except ProjectMember.DoesNotExist:
            return Response({
                'error': 'Project member not found'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get dashboard stats for the current user"""
        user = request.user

        # Get projects the user is part of
        projects = Project.objects.filter(
            workspace__memberships__user=user,
            workspace__memberships__is_active=True,
            is_archived=False
        ).distinct()

        # Get active tasks assigned to user
        active_tasks = Task.objects.filter(
            assignee=user,
            status__in=['todo', 'in-progress', 'review']
        ).select_related('project', 'column')[:10]

        # Get total stats
        total_tasks = Task.objects.filter(
            project__workspace__memberships__user=user,
            project__workspace__memberships__is_active=True
        )

        tasks_in_progress = total_tasks.filter(status='in-progress').count()
        total_completed = total_tasks.filter(status='done').count()
        total_active = total_tasks.filter(
            status__in=['todo', 'in-progress', 'review']).count()

        # Get team members count
        team_members = User.objects.filter(
            memberships__workspace__projects=projects,
            memberships__is_active=True
        ).distinct().count()

        # Get recent projects
        recent_projects = projects.order_by('-created_at')[:3]

        # Get recent activity
        from apps.activity.models import ActivityLog
        recent_activities = ActivityLog.objects.filter(
            user=user
        ).select_related('user', 'workspace', 'project').order_by('-created_at')[:5]

        # Format response
        dashboard_data = {
            'stats': {
                'active_tasks': total_active,
                'team_members': team_members,
                'projects': projects.count(),
                'completed_tasks': total_completed,
                'tasks_in_progress': tasks_in_progress,
            },
            'active_projects': ProjectSerializer(recent_projects, many=True).data,
            'active_tasks': [
                {
                    'id': str(task.id),
                    'title': task.title,
                    'project': task.project.name,
                    'priority': task.priority,
                    'status': task.status,
                    'due_date': task.due_date,
                }
                for task in active_tasks
            ],
            'recent_activity': [
                {
                    'id': str(activity.id),
                    'user': activity.user.full_name or activity.user.email,
                    'action': activity.action,
                    'item': activity.description,
                    'created_at': activity.created_at,
                }
                for activity in recent_activities
            ],
        }

        return Response(dashboard_data)


class ColumnViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        project_id = self.request.query_params.get('project')

        queryset = Column.objects.filter(
            project__workspace__memberships__user=user,
            project__workspace__memberships__is_active=True
        )

        if project_id:
            queryset = queryset.filter(project_id=project_id)

        return queryset.distinct().order_by('position')

    def get_serializer_class(self):
        if self.action == 'create':
            return ColumnCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ColumnUpdateSerializer
        return ColumnSerializer

    def perform_create(self, serializer):
        column = serializer.save()
        ActivityLog.log_activity(
            user=self.request.user,
            action='create',
            entity_type='column',
            entity_id=column.id,
            description=f"Created column '{column.name}'",
            workspace=column.project.workspace,
            project=column.project
        )

    def perform_update(self, serializer):
        column = serializer.save()

        ActivityLog.log_activity(
            user=self.request.user,
            action='update',
            entity_type='column',
            entity_id=column.id,
            description=f"Updated column '{column.name}'",
            workspace=column.project.workspace,
            project=column.project
        )

    def perform_destroy(self, instance):
        ActivityLog.log_activity(
            user=self.request.user,
            action='delete',
            entity_type='column',
            entity_id=instance.id,
            description=f"Deleted column '{instance.name}'",
            workspace=instance.project.workspace,
            project=instance.project
        )

        instance.delete()

    @action(detail=False, methods=['post'])
    def reorder(self, request):
        column_ids = request.data.get('column_ids', [])

        for index, column_id in enumerate(column_ids):
            Column.objects.filter(id=column_id).update(position=index)

        return Response({'message': 'Columns reordered successfully'})
