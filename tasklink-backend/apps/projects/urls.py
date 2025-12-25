from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, ColumnViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'columns', ColumnViewSet, basename='column')

urlpatterns = [
    path('workspaces/<uuid:workspace_id>/projects/<uuid:project_id>/columns/', 
         ColumnViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='project-columns-list'),
] + router.urls