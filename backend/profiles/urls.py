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
    path("api/profiles/", ProfileApiView.as_view(), name="all_users"),
    path("api/profiles/my/", MyProfileApiView.as_view(), name="my_profile"),
    path("api/profiles/<slug:user__username>", UserProfileApiView.as_view(), name="user_profile"),

    path('api/register/', CreateUserView.as_view(), name="registration"),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/login/', LoginView.as_view(), name="login"),
]
