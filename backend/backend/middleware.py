import jwt
from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from django.conf import settings


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        from django.contrib.auth.models import AnonymousUser
        from django.contrib.auth import get_user_model

        User = get_user_model()  # ✅ moved inside

        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token")

        if token:
            try:
                payload = jwt.decode(token[0], settings.SECRET_KEY, algorithms=["HS256"])
                user = await self.get_user(User, payload["user_id"])
                scope["user"] = user
            except Exception:
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)

    @staticmethod
    async def get_user(User, user_id):
        from django.contrib.auth.models import AnonymousUser
        try:
            return await User.objects.aget(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()