import json
import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatMessage, Project, User


class ProjectChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.project_id = self.scope['url_route']['kwargs']['project_id']
        self.group_name = f'project_{self.project_id}'

        # Require authenticated user
        user = self.scope.get('user')
        if not user or not getattr(user, 'is_authenticated', False):
            await self.close(code=4001)
            return

        # Accept connection
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        text = data.get('text')

        user = self.scope.get('user')
        sender_username = getattr(user, 'username', 'unknown')

        # Persist message
        await self.save_message(sender_username, text)

        payload = {
            'sender': sender_username,
            'text': text,
            'timestamp': str(datetime.datetime.utcnow()),
        }
        await self.channel_layer.group_send(self.group_name, {
            'type': 'chat.message',
            'message': payload
        })

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event['message']))

    @database_sync_to_async
    def save_message(self, sender_username, text):
        try:
            user = User.objects.get(username=sender_username)
        except User.DoesNotExist:
            user = None
        try:
            project = Project.objects.get(pk=self.project_id)
        except Project.DoesNotExist:
            project = None
        if project and user:
            ChatMessage.objects.create(project=project, sender=user, text=text)
