from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import WorkspaceViewSet
from apps.projects.views import ProjectViewSet

router = DefaultRouter()
router.register(r'workspaces', WorkspaceViewSet, basename='workspace')

# Nested router for projects within workspaces
workspaces_router = routers.NestedDefaultRouter(
    router, r'workspaces', lookup='workspace')
workspaces_router.register(r'projects', ProjectViewSet,
                           basename='workspace-projects')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(workspaces_router.urls)),
]
