# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import ProjectViewSet, ColumnViewSet

# router = DefaultRouter()
# router.register(r'projects', ProjectViewSet, basename='project')
# router.register(r'columns', ColumnViewSet, basename='column')

# urlpatterns = [
#     # Top-level routes: /api/projects/ and /api/columns/
#     path('', include(router.urls)),
    
#     # Workspace-nested projects route: /api/workspaces/{workspace_id}/projects/
#     path('workspaces/<uuid:workspace_pk>/projects/', 
#          ProjectViewSet.as_view({'get': 'list', 'post': 'create'}), 
#          name='workspace-projects'),
    
#     # Project-specific columns: /api/workspaces/{workspace_id}/projects/{project_id}/columns/
#     path('workspaces/<uuid:workspace_id>/projects/<uuid:project_id>/columns/', 
#          ColumnViewSet.as_view({'get': 'list', 'post': 'create'}), 
#          name='project-columns'),
# ]

# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import ProjectViewSet, ColumnViewSet

# router = DefaultRouter()
# router.register(r'projects', ProjectViewSet, basename='project')
# router.register(r'columns', ColumnViewSet, basename='column')

# urlpatterns = [
#     # Top-level routes: /api/projects/ and /api/columns/
#     # This includes ALL endpoints including dashboard actions
#     path('', include(router.urls)),
    
#     # Workspace-nested projects route: /api/workspaces/{workspace_id}/projects/
#     path('workspaces/<uuid:workspace_pk>/projects/', 
#          ProjectViewSet.as_view({'get': 'list', 'post': 'create'}), 
#          name='workspace-projects'),
    
#     # Project-specific columns: /api/workspaces/{workspace_id}/projects/{project_id}/columns/
#     path('workspaces/<uuid:workspace_id>/projects/<uuid:project_id>/columns/', 
#          ColumnViewSet.as_view({'get': 'list', 'post': 'create'}), 
#          name='project-columns'),
# ]



from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, ColumnViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'columns', ColumnViewSet, basename='column')

urlpatterns = [
    # ✅ ALL default router URLs including dashboard actions:
    # - /api/projects/ (list, create)
    # - /api/projects/{id}/ (retrieve, update, delete)
    # - /api/projects/dashboard/ (from @action)
    # - /api/projects/dashboard/stats/ (from @action)
    # - /api/projects/dashboard/active-projects/ (from @action)
    # - /api/projects/{id}/columns/ (from @action)
    # - /api/projects/{id}/members/ (from @action)
    # - /api/columns/ (list, create, etc.)
    path('', include(router.urls)),
    
    # ✅ Workspace-nested projects: /api/workspaces/{workspace_id}/projects/
    # Note: This will be accessible from main urls.py as /api/workspaces/{workspace_id}/projects/
    path('workspaces/<uuid:workspace_pk>/projects/', 
         ProjectViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='workspace-projects'),
    
    # ✅ Project-specific columns: /api/workspaces/{workspace_id}/projects/{project_id}/columns/
    path('workspaces/<uuid:workspace_id>/projects/<uuid:project_id>/columns/', 
         ColumnViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='project-columns'),
]