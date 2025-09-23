from django.urls import include, path

from .views import *

urlpatterns = [
    path("api/inbox/<int:pk>/", InboxApiView.as_view()),
    path("api/inbox/len/", InboxLengthApiView.as_view()),
]