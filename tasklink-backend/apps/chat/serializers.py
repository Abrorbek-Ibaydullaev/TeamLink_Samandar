from rest_framework import serializers
from .models import ChatMessage, ChatMessageRead
from apps.authentication.serializers import UserSerializer


class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    attachments = serializers.SerializerMethodField()
    is_read_by_user = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = [
            'id', 'project', 'sender', 'content', 'is_edited',
            'attachments', 'is_read_by_user', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'sender',
                            'is_edited', 'created_at', 'updated_at']

    def get_attachments(self, obj):
        from apps.files.serializers import FileAttachmentSerializer
        return FileAttachmentSerializer(obj.attachments.all(), many=True).data

    def get_is_read_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ChatMessageRead.objects.filter(
                message=obj,
                user=request.user
            ).exists()
        return False


class ChatMessageCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatMessage
        fields = ['project', 'content']

    def create(self, validated_data):
        request = self.context.get('request')
        message = ChatMessage.objects.create(
            sender=request.user,
            **validated_data
        )
        return message
