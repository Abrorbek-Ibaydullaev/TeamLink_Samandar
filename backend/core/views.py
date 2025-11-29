from rest_framework import viewsets, permissions
from .models import Workspace, Project, Column, Task, Comment, ChatMessage
from .serializers import WorkspaceSerializer, ProjectSerializer, ColumnSerializer, TaskSerializer, CommentSerializer, ChatMessageSerializer
from .serializers import RegisterSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterAPIView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WorkspaceViewSet(viewsets.ModelViewSet):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]


class ColumnViewSet(viewsets.ModelViewSet):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Column.objects.all()
        project = self.request.query_params.get('project')
        if project:
            qs = qs.filter(project_id=project).order_by('order')
        return qs


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Task.objects.all()
        column = self.request.query_params.get('column')
        project = self.request.query_params.get('project')
        if column:
            qs = qs.filter(column_id=column).order_by('order')
        elif project:
            qs = qs.filter(column__project_id=project).order_by(
                'column__order', 'order')
        return qs


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]


class ChatMessageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ChatMessage.objects.order_by('timestamp')
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
