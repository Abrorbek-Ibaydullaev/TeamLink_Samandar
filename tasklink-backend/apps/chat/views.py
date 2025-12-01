from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import ChatMessage, ChatMessageRead
from .serializers import ChatMessageSerializer, ChatMessageCreateSerializer
from apps.activity.models import ActivityLog


class ChatMessageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        project_id = self.request.query_params.get('project')

        queryset = ChatMessage.objects.filter(
            project__workspace__memberships__user=user,
            project__workspace__memberships__is_active=True
        )

        if project_id:
            queryset = queryset.filter(project_id=project_id)

        # Search in messages
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(content__icontains=search)

        return queryset.distinct().select_related('project', 'sender').order_by('created_at')

    def get_serializer_class(self):
        if self.action == 'create':
            return ChatMessageCreateSerializer
        return ChatMessageSerializer

    def perform_create(self, serializer):
        message = serializer.save()

        # Log activity
        ActivityLog.log_activity(
            user=self.request.user,
            action='create',
            entity_type='chat_message',
            entity_id=message.id,
            description=f"Sent message in project '{message.project.name}'",
            workspace=message.project.workspace,
            project=message.project
        )

    def perform_update(self, serializer):
        message = serializer.save(is_edited=True)

        ActivityLog.log_activity(
            user=self.request.user,
            action='update',
            entity_type='chat_message',
            entity_id=message.id,
            description=f"Edited message in project '{message.project.name}'",
            workspace=message.project.workspace,
            project=message.project
        )

    def perform_destroy(self, instance):
        ActivityLog.log_activity(
            user=self.request.user,
            action='delete',
            entity_type='chat_message',
            entity_id=str(instance.id),
            description=f"Deleted message in project '{instance.project.name}'",
            workspace=instance.project.workspace,
            project=instance.project
        )

        instance.delete()

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        message = self.get_object()

        ChatMessageRead.objects.get_or_create(
            message=message,
            user=request.user
        )

        return Response({'message': 'Message marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        project_id = request.data.get('project_id')

        if not project_id:
            return Response({
                'error': 'project_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        messages = ChatMessage.objects.filter(project_id=project_id)

        for message in messages:
            ChatMessageRead.objects.get_or_create(
                message=message,
                user=request.user
            )

        return Response({
            'message': f'Marked {messages.count()} messages as read'
        })

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        user = request.user
        project_id = request.query_params.get('project')

        if project_id:
            # Count for specific project
            total_messages = ChatMessage.objects.filter(
                project_id=project_id).count()
            read_messages = ChatMessageRead.objects.filter(
                message__project_id=project_id,
                user=user
            ).count()
            unread = total_messages - read_messages

            return Response({
                'project_id': project_id,
                'unread_count': unread
            })
        else:
            # Count for all projects
            from apps.projects.models import Project
            projects = Project.objects.filter(
                workspace__memberships__user=user,
                workspace__memberships__is_active=True
            )

            result = []
            for project in projects:
                total = ChatMessage.objects.filter(project=project).count()
                read = ChatMessageRead.objects.filter(
                    message__project=project,
                    user=user
                ).count()
                unread = total - read

                if unread > 0:
                    result.append({
                        'project_id': str(project.id),
                        'project_name': project.name,
                        'unread_count': unread
                    })

            return Response(result)
