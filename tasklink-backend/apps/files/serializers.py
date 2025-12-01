from rest_framework import serializers
from .models import FileAttachment
from apps.authentication.serializers import UserSerializer


class FileAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = FileAttachment
        fields = [
            'id', 'file', 'file_url', 'original_filename', 'file_type',
            'file_size', 'file_size_mb', 'file_extension', 'mime_type',
            'task', 'chat_message', 'uploaded_by', 'created_at'
        ]
        read_only_fields = [
            'id', 'file_type', 'file_size', 'file_size_mb',
            'file_extension', 'mime_type', 'uploaded_by', 'created_at'
        ]

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class FileUploadSerializer(serializers.ModelSerializer):
    file = serializers.FileField()

    class Meta:
        model = FileAttachment
        fields = ['file', 'task', 'chat_message']

    def validate_file(self, value):
        # Check file size (from settings)
        from django.conf import settings
        max_size = getattr(settings, 'MAX_UPLOAD_SIZE',
                           10 * 1024 * 1024)  # 10MB default

        if value.size > max_size:
            raise serializers.ValidationError(
                f'File size must be less than {max_size / (1024 * 1024)}MB'
            )

        return value

    def validate(self, data):
        # Must have either task or chat_message
        if not data.get('task') and not data.get('chat_message'):
            raise serializers.ValidationError(
                'File must be attached to either a task or chat message'
            )

        if data.get('task') and data.get('chat_message'):
            raise serializers.ValidationError(
                'File cannot be attached to both task and chat message'
            )

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        file = validated_data['file']

        # Determine file type
        file_type = 'other'
        mime_type = file.content_type or ''

        if mime_type.startswith('image/'):
            file_type = 'image'
        elif mime_type.startswith('video/'):
            file_type = 'video'
        elif mime_type in ['application/pdf', 'application/msword',
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                           'application/vnd.ms-excel',
                           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']:
            file_type = 'document'

        attachment = FileAttachment.objects.create(
            file=file,
            original_filename=file.name,
            file_type=file_type,
            file_size=file.size,
            mime_type=mime_type,
            task=validated_data.get('task'),
            chat_message=validated_data.get('chat_message'),
            uploaded_by=request.user
        )

        return attachment
