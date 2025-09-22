from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async

# Move AccessToken import inside the function
@database_sync_to_async
def get_user(token):
    if not token:
        from django.contrib.auth.models import AnonymousUser
        return AnonymousUser()
    try:
        from django.contrib.auth.models import User  # Import inside function
        from rest_framework_simplejwt.tokens import AccessToken  # <- move here
        from django.core.exceptions import ObjectDoesNotExist  # <- move here
        access = AccessToken(token)
        return User.objects.get(id=access["user_id"])
    except (ObjectDoesNotExist, Exception):
        from django.contrib.auth.models import AnonymousUser
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        params = parse_qs(query_string)
        token = params.get("token", [None])[0]
        user = await get_user(token)
        if str(user) == "AnonymousUser":
            await send({
                "type": "websocket.close",
                "code": 4001,
            })
            return
        scope["user"] = user
        return await super().__call__(scope, receive, send)