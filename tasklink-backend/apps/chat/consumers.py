import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import ChatMessage
from apps.projects.models import Project

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.project_id = self.scope['url_route']['kwargs']['project_id']
        self.project_group_name = f'project_{self.project_id}'
        self.user = self.scope['user']

        if not self.user.is_authenticated:
            await self.close()
            return

        has_access = await self.check_project_access()
        if not has_access:
            await self.close()
            return

        # Join project group
        await self.channel_layer.group_add(
            self.project_group_name,
            self.channel_name
        )

        await self.accept()

        # Mark user as online
        await self.set_user_online(True)

        # Broadcast user joined
        await self.channel_layer.group_send(
            self.project_group_name,
            {
                'type': 'user_status',
                'user_id': str(self.user.id),
                'username': self.user.username,
                'status': 'online'
            }
        )

    async def disconnect(self, close_code):
        # Mark user as offline
        await self.set_user_online(False)

        # Broadcast user left
        await self.channel_layer.group_send(
            self.project_group_name,
            {
                'type': 'user_status',
                'user_id': str(self.user.id),
                'username': self.user.username,
                'status': 'offline'
            }
        )

        # Leave project group
        await self.channel_layer.group_discard(
            self.project_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type', 'message')

            if message_type == 'message':
                content = data.get('content', '').strip()

                if not content:
                    return

                # Save message to database
                message = await self.save_message(content)

                # Broadcast message to project group
                await self.channel_layer.group_send(
                    self.project_group_name,
                    {
                        'type': 'chat_message',
                        'message': {
                            'id': str(message.id),
                            'content': message.content,
                            'sender': {
                                'id': str(self.user.id),
                                'username': self.user.username,
                                'email': self.user.email,
                                'full_name': self.user.full_name or self.user.username,
                                'avatar': self.user.avatar.url if self.user.avatar else None
                            },
                            'created_at': message.created_at.isoformat(),
                            'is_edited': message.is_edited
                        }
                    }
                )

            elif message_type == 'typing':
                # Broadcast typing indicator
                is_typing = data.get('is_typing', False)
                await self.channel_layer.group_send(
                    self.project_group_name,
                    {
                        'type': 'typing_indicator',
                        'user_id': str(self.user.id),
                        'username': self.user.username,
                        'is_typing': is_typing
                    }
                )

        except json.JSONDecodeError:
            pass

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message']
        }))

    async def user_status(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_status',
            'user_id': event['user_id'],
            'username': event['username'],
            'status': event['status']
        }))

    async def typing_indicator(self, event):
        # Don't send typing indicator to the user who is typing
        if event['user_id'] != str(self.user.id):
            await self.send(text_data=json.dumps({
                'type': 'typing',
                'user_id': event['user_id'],
                'username': event['username'],
                'is_typing': event['is_typing']
            }))

    @database_sync_to_async
    def check_project_access(self):
        try:
            project = Project.objects.get(id=self.project_id)
            # Check if user is a member of the workspace
            return project.workspace.memberships.filter(
                user=self.user,
                is_active=True
            ).exists()
        except Project.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, content):
        project = Project.objects.get(id=self.project_id)
        message = ChatMessage.objects.create(
            project=project,
            sender=self.user,
            content=content
        )
        return message

    @database_sync_to_async
    def set_user_online(self, is_online):
        if is_online:
            self.user.set_online()
        else:
            self.user.set_offline()
