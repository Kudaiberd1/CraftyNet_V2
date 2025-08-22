from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import *
from .models import *
from .serializers import *
from posts.permissions import *
from django.contrib.auth.models import User

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
