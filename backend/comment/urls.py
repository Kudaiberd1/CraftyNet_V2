from django.urls import include, path

from django.conf import settings
from django.conf.urls.static import static

from .views import *

urlpatterns = [
    path("api/posts/<int:post_id>/comments/", CommentApiView.as_view(), name="comments"),
]