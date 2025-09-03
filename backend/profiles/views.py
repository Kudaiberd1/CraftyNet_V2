from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import *

from profiles.utils import set_jwt_token
from .models import *
from .serializers import *
from posts.permissions import *
from django.contrib.auth.models import User

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)

from rest_framework import status

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class ProfileApiView(generics.ListAPIView):
    queryset=Profile.objects.all()
    serializer_class=ProfileSerializer


class MyProfileApiView(generics.RetrieveUpdateAPIView):
    serializer_class=ProfileSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_object(self):
        return self.request.user.profile
    
class UserProfileApiView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = "user__username"


class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")

            if access_token and refresh_token:
                response = set_jwt_token(
                    response=response,
                    access_token=access_token,
                    refresh_token=refresh_token,
                )
                # Удаляем токены из тела ответа
                del response.data["access"]
                del response.data["refresh"]

        return response
