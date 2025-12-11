from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet
router = DefaultRouter()
router.register(r'', TaskViewSet, basename='task')
# router.register(r'comments', CommentViewSet, basename='comment')
# router.register(r'labels', TaskLabelViewSet, basename='label')

urlpatterns = [
    path('', include(router.urls)),
]
