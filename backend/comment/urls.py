from django.urls import include, path

from django.conf import settings
from django.conf.urls.static import static

from .views import *

urlpatterns = [
    path('api/comment/<int:pk>/'),
    path('api/comment/<int:pk>/delete/<int:pk>/')
]