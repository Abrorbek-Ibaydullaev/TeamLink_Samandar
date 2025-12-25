from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import WorkspaceViewSet
from apps.projects.views import ProjectViewSet, ColumnViewSet
from apps.tasks.views import TaskViewSet

router = DefaultRouter()
router.register(r'', WorkspaceViewSet, basename='workspace')

workspaces_router = routers.NestedDefaultRouter(
    router, r'', lookup='workspace')
workspaces_router.register(r'projects', ProjectViewSet,
    basename='workspace-projects')

projects_router = routers.NestedDefaultRouter(
    workspaces_router, r'projects', lookup='project')
projects_router.register(r'columns', ColumnViewSet, basename='project-columns')

columns_router = routers.NestedDefaultRouter(
    projects_router, r'columns', lookup='column')
columns_router.register(r'tasks', TaskViewSet, basename='column-tasks')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(workspaces_router.urls)),
    path('', include(projects_router.urls)),
    path('', include(columns_router.urls)),
]