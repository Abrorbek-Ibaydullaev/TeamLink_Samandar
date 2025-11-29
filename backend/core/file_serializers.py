from rest_framework import serializers
from .models import FileAttachment


class FileAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileAttachment
        fields = ['id', 'file', 'uploaded_by',
                  'uploaded_at', 'task', 'message']
        read_only_fields = ['uploaded_by', 'uploaded_at']
