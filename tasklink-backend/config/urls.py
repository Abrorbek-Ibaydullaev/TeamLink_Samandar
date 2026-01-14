# from django.contrib import admin
# from django.urls import path, include
# from django.conf import settings
# from django.conf.urls.static import static
# from rest_framework_simplejwt.views import TokenRefreshView

# urlpatterns = [
#     path('admin/', admin.site.urls),

#     path('api/auth/', include('apps.authentication.urls')),
#     path('api/workspaces/', include('apps.workspaces.urls')),
#     path('api/projects/', include('apps.projects.urls')),
#     path('api/workspaces/<uuid:workspace_id>/projects/',
#          include('apps.projects.urls')),
#     path('api/tasks/', include('apps.tasks.urls')),
#     path('api/chat/', include('apps.chat.urls')),
#     # path('api/files/', include('apps.files.urls')),
#     # path('api/notifications/', include('apps.notifications.urls')),
#     # path('api/activity/', include('apps.activity.urls')),

#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
# ]

# # Serve media files in development
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL,
#                           document_root=settings.MEDIA_ROOT)
#     urlpatterns += static(settings.STATIC_URL,
#                           document_root=settings.STATIC_ROOT)


from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/', include('apps.authentication.urls')),
    path('api/workspaces/', include('apps.workspaces.urls')),
    
    # Single projects endpoint - handles both top-level and nested
    path('api/projects/', include('apps.projects.urls')),
    
    # Workspace-specific projects (this will also work with the updated viewset)
    path('api/workspaces/<uuid:workspace_id>/projects/',
         include('apps.projects.urls')),
    
    path('api/tasks/', include('apps.tasks.urls')),
    path('api/chat/', include('apps.chat.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)