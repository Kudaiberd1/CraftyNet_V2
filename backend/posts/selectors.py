from .models import Posts
from rest_framework.exceptions import NotFound


def get_post(pk: int) -> Posts:
    post = Posts.objects.filter(pk=pk).first()

    if not post:
        raise NotFound(detail="Post not found!")

    return post