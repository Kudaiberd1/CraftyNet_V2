from django.urls import include, path

from django.conf import settings
from django.conf.urls.static import static

from .views import *

urlpatterns = [
    path("api/users/follow/<str:username>/", FollowApiView.as_view(), name="follow to"),
    path("api/users/unfollow/<str:username>/", UnFollowApiView.as_view(), name="ufollow"),
    path("api/users/followings/<str:username>/", GetFollowingListApiView.as_view(), name="followers"),
    path("api/users/followers/<str:username>/", GetFollowerListApiView.as_view(), name="followers"),
]