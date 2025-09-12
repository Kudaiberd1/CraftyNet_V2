from django.urls import include, path

from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from .views import *

urlpatterns = [
    path("api/user/<str:username>/post/<int:post_id>/likes/", AddLikeApiView.as_view()),
    # path("api/post/<int:pk>/likes/reomve/"),
    path("api/post/<int:post_id>/likes/", LikesApiView.as_view()),
]