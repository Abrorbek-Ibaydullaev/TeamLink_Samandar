from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/projects/<uuid:project_id>/', consumers.ChatConsumer.as_asgi()),
]
