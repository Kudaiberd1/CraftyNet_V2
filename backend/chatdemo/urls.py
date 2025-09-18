# chatdemo/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatViewSet

router = DefaultRouter()
router.register(r'chat-messages', ChatViewSet, basename='chat')

urlpatterns = [
    path('', include(router.urls)),   # no "api/" here
]