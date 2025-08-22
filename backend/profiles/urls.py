
from django.urls import path
from .views import *

urlpatterns = [
    path("api/profiles/", ProfileApiView.as_view(), name="all_users"),
    path("api/profiles/my/", MyProfileApiView.as_view(), name="my_profile"),
    path("api/profiles/<slug:user__username>", UserProfileApiView.as_view(), name="user_profile"),
]
