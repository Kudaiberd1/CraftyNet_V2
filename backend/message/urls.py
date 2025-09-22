from django.urls import include, path

from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from .views import *

router = DefaultRouter()

urlpatterns = [
    path("api/message/<username>/", MessageApiView.as_view(), name="message_api_view"),
    path('', include(router.urls)),
]