from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import User, AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.core.exceptions import ObjectDoesNotExist

@database_sync_to_async
def get_user(token):
    if not token:
        return AnonymousUser()
    try:
        access = AccessToken(token)
        return User.objects.get(id=access["user_id"])
    except (ObjectDoesNotExist, Exception):
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        params = parse_qs(query_string)
        token = params.get("token", [None])[0]
        user = await get_user(token)
        if isinstance(user, AnonymousUser):
            # reject connection immediately
            await send({
                "type": "websocket.close",
                "code": 4001,  # custom close code for unauthorized
            })
            return
        scope["user"] = user
        return await super().__call__(scope, receive, send)