from rest_framework import serializers
from .models import Project, Column, ProjectMember
from apps.authentication.serializers import UserSerializer


class ColumnSerializer(serializers.ModelSerializer):
    tasks_count = serializers.SerializerMethodField()

    class Meta:
        model = Column
        fields = ['id', 'name', 'position', 'color', 'project',
                  'tasks_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_tasks_count(self, obj):
        return obj.tasks.count()


class ProjectMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    added_by = UserSerializer(read_only=True)

    class Meta:
        model = ProjectMember
        fields = ['id', 'user', 'added_by', 'added_at']
        read_only_fields = ['id', 'added_by', 'added_at']


class ProjectSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    columns = ColumnSerializer(many=True, read_only=True)
    members = ProjectMemberSerializer(
        source='project_members', many=True, read_only=True)
    tasks_count = serializers.SerializerMethodField()
    members_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'workspace', 'name', 'description', 'created_by',
            'is_archived', 'start_date', 'end_date', 'columns', 'members',
            'tasks_count', 'members_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def get_tasks_count(self, obj):
        return obj.tasks.filter(column__isnull=False).count()

    def get_members_count(self, obj):
        return obj.project_members.count()


class ProjectCreateSerializer(serializers.ModelSerializer):
    create_default_columns = serializers.BooleanField(
        default=True, write_only=True)

    class Meta:
        model = Project
        fields = ['workspace', 'name', 'description',
                  'start_date', 'end_date', 'create_default_columns']

    def create(self, validated_data):
        create_default_columns = validated_data.pop(
            'create_default_columns', True)
        request = self.context.get('request')

        project = Project.objects.create(
            created_by=request.user,
            **validated_data
        )

        # Create default Kanban columns
        if create_default_columns:
            default_columns = [
                {'name': 'To Do', 'position': 0, 'color': '#3B82F6'},
                {'name': 'In Progress', 'position': 1, 'color': '#F59E0B'},
                {'name': 'Done', 'position': 2, 'color': '#10B981'},
            ]

            for col_data in default_columns:
                Column.objects.create(project=project, **col_data)

        # Add creator as project member
        ProjectMember.objects.create(
            project=project,
            user=request.user,
            added_by=request.user
        )

        return project


class ProjectUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating projects"""

    class Meta:
        model = Project
        fields = ['name', 'description',
                  'is_archived', 'start_date', 'end_date']


class ColumnCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Column
        fields = ['project', 'name', 'color', 'position']


class ColumnUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating columns"""

    class Meta:
        model = Column
        fields = ['name', 'color', 'position']


class ProjectMemberAddSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

    def validate_user_id(self, value):
        from django.contrib.auth import get_user_model
        User = get_user_model()

        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")

        return value
