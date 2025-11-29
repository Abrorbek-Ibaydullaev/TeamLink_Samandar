import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken


@database_sync_to_async
def get_user(user_id):
    User = get_user_model()
    try:
        return User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return AnonymousUser()


class JwtAuthMiddleware:
    """Custom middleware that takes a `token` querystring or `Authorization` header
    and authenticates the user for WebSocket connections using SimpleJWT.
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return JwtAuthMiddlewareInstance(scope, self.inner)


class JwtAuthMiddlewareInstance:
    def __init__(self, scope, inner):
        self.scope = dict(scope)
        self.inner = inner

    async def __call__(self, receive, send):
        # Extract token from query string or headers
        token = None
        query_string = self.scope.get('query_string', b'').decode()
        qs_parts = [p for p in query_string.split('&') if p]
        for part in qs_parts:
            if part.startswith('token='):
                token = part.split('=', 1)[1]
                break

        # Check headers for Authorization
        if not token:
            headers = dict((k.decode().lower(), v.decode())
                           for k, v in self.scope.get('headers', []))
            auth = headers.get('authorization')
            if auth and auth.startswith('Bearer '):
                token = auth.split(' ', 1)[1]

        user = None
        if token:
            try:
                # Validate token
                UntypedToken(token)
                # Decode to get user id
                decoded = jwt.decode(
                    token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = decoded.get('user_id')
                if user_id:
                    user = await get_user(user_id)
            except Exception:
                user = None

        if user is None:
            self.scope['user'] = AnonymousUser()
        else:
            self.scope['user'] = user

        inner = self.inner(self.scope)
        return await inner(receive, send)


def JwtAuthMiddlewareStack(inner):
    return JwtAuthMiddleware(inner)
