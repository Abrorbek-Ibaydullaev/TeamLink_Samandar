from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, ColumnViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'columns', ColumnViewSet, basename='column')

urlpatterns = [
    # Top-level routes: /api/projects/ and /api/columns/
    path('', include(router.urls)),
    
    # Workspace-nested projects route: /api/workspaces/{workspace_id}/projects/
    path('workspaces/<uuid:workspace_pk>/projects/', 
         ProjectViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='workspace-projects'),
    
    # Project-specific columns: /api/workspaces/{workspace_id}/projects/{project_id}/columns/
    path('workspaces/<uuid:workspace_id>/projects/<uuid:project_id>/columns/', 
         ColumnViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='project-columns'),
]