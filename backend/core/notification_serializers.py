from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'task', 'message',
                  'is_read', 'created_at', 'type']
        read_only_fields = ['created_at']
