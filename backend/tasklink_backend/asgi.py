import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from core.jwt_auth import JwtAuthMiddlewareStack
from django.core.asgi import get_asgi_application
import core.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tasklink_backend.settings')
django.setup()

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': JwtAuthMiddlewareStack(
        URLRouter(
            core.routing.websocket_urlpatterns
        )
    ),
})
