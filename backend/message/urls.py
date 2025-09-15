from django.urls import include, path

from django.conf import settings
from django.conf.urls.static import static

from .views import *

urlpatterns = [
    path("api/message/<username>/", MessageApiView.as_view(), name="message_api_view"),
]