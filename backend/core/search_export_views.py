from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
import csv
from .models import Task, ChatMessage, Notification
from .serializers import TaskSerializer, ChatMessageSerializer
from .notification_serializers import NotificationSerializer


class SearchViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def tasks(self, request):
        """Search tasks by title or description"""
        q = request.query_params.get('q', '')
        project = request.query_params.get('project')
        tasks = Task.objects.filter(title__icontains=q) | Task.objects.filter(
            description__icontains=q)
        if project:
            tasks = tasks.filter(column__project_id=project)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def messages(self, request):
        """Search chat messages"""
        q = request.query_params.get('q', '')
        project = request.query_params.get('project')
        messages = ChatMessage.objects.filter(text__icontains=q)
        if project:
            messages = messages.filter(project_id=project)
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)


class ExportViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def tasks_csv(self, request):
        """Export tasks as CSV"""
        project = request.query_params.get('project')
        tasks = Task.objects.all()
        if project:
            tasks = tasks.filter(column__project_id=project)

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="tasks.csv"'
        writer = csv.writer(response)
        writer.writerow(['ID', 'Title', 'Description',
                        'Assignee', 'Priority', 'Status', 'Created'])
        for task in tasks:
            writer.writerow([
                task.id,
                task.title,
                task.description,
                task.assignee.username if task.assignee else '',
                task.priority,
                task.column.title,
                task.created_at,
            ])
        return response


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_as_read(self, request):
        """Mark all notifications as read"""
        Notification.objects.filter(
            user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all marked as read'})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a single notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)
