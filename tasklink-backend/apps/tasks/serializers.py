from rest_framework import serializers
from .models import Task, Comment, TaskLabel, TaskLabelAssignment
from apps.authentication.serializers import UserSerializer


class TaskLabelSerializer(serializers.ModelSerializer):

    class Meta:
        model = TaskLabel
        fields = ['id', 'name', 'color', 'project', 'created_at']
        read_only_fields = ['id', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'task', 'user', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class CommentCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ['task', 'content']


class TaskSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    labels = TaskLabelSerializer(
        source='label_assignments.label', many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()
    attachments_count = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id', 'project', 'column', 'title', 'description', 'assignee',
            'created_by', 'priority', 'status', 'position', 'due_date',
            'completed_at', 'comments', 'labels', 'comments_count',
            'attachments_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_attachments_count(self, obj):
        return obj.attachments.count()


class TaskCreateSerializer(serializers.ModelSerializer):
    assignee_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = Task
        fields = [
            'project', 'column', 'title', 'description', 'assignee_id',
            'priority', 'status', 'position', 'due_date'
        ]

    def validate_assignee_id(self, value):
        if value:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                User.objects.get(id=value)
            except User.DoesNotExist:
                raise serializers.ValidationError("User not found.")
        return value

    def create(self, validated_data):
        assignee_id = validated_data.pop('assignee_id', None)
        request = self.context.get('request')

        task = Task.objects.create(
            # created_by=request.user,
            assignee_id=assignee_id,
            **validated_data
        )

        return task


class TaskUpdateSerializer(serializers.ModelSerializer):
    assignee_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = Task
        fields = [
            'title', 'description', 'assignee_id', 'priority', 'status',
            'position', 'column', 'due_date', 'completed_at'
        ]

    def validate_assignee_id(self, value):
        if value:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                User.objects.get(id=value)
            except User.DoesNotExist:
                raise serializers.ValidationError("User not found.")
        return value

    def update(self, instance, validated_data):
        assignee_id = validated_data.pop('assignee_id', None)

        if assignee_id is not None:
            instance.assignee_id = assignee_id

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class TaskMoveSerializer(serializers.Serializer):
    column_id = serializers.IntegerField()
    position = serializers.IntegerField(required=False)

    def validate_column_id(self, value):
        from apps.projects.models import Column
        try:
            Column.objects.get(id=value)
        except Column.DoesNotExist:
            raise serializers.ValidationError("Column not found.")
        return value


class TaskBulkUpdateSerializer(serializers.Serializer):
    task_ids = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=False
    )
    assignee_id = serializers.IntegerField(required=False, allow_null=True)
    priority = serializers.ChoiceField(
        choices=['low', 'medium', 'high'],
        required=False
    )
    status = serializers.ChoiceField(
        choices=['todo', 'in-progress', 'review', 'done'],
        required=False
    )


class TaskExportSerializer(serializers.Serializer):
    project_id = serializers.UUIDField(required=False)
    column_id = serializers.IntegerField(required=False)
    status = serializers.CharField(required=False)
    priority = serializers.CharField(required=False)
    format = serializers.ChoiceField(choices=['csv', 'json'], default='csv')
