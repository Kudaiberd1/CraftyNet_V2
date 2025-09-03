from django.urls import include, path

from django.conf import settings
from django.conf.urls.static import static

from .views import *

urlpatterns = [
    path("api/users/follow/<slug:user__username>/", CreateFollowApiView.as_view(), name="follow to"),
    path("api/users/unfollow/<slug:user__username>/", RemoveFollowApiView.as_view(), name="ufollow"),
    path("api/users/followers/<slug:user__username>/", FollowApiView.as_view(), name="followers"),
]