from rest_framework import routers
from django.urls import path, include
from .views import WorkspaceViewSet, ProjectViewSet, ColumnViewSet, TaskViewSet, CommentViewSet, ChatMessageViewSet, FileUploadViewSet
from .search_export_views import SearchViewSet, ExportViewSet, NotificationViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterAPIView, UserDetailAPIView

router = routers.DefaultRouter()
router.register(r'workspaces', WorkspaceViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'columns', ColumnViewSet, basename='column')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'comments', CommentViewSet)
router.register(r'chat-messages', ChatMessageViewSet, basename='chatmessage')
router.register(r'files', FileUploadViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'search', SearchViewSet, basename='search')
router.register(r'export', ExportViewSet, basename='export')

urlpatterns = [
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterAPIView.as_view(), name='auth_register'),
    path('auth/user/', UserDetailAPIView.as_view(), name='auth_user'),
    path('', include(router.urls)),
]
