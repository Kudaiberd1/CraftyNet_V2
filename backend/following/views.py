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

class CreateFollowApiView(generics.CreateAPIView):
    queryset = Subscription.objects.all()
    serializer_class = FollowSystemSerializers
    permission_classes = [IsAuthenticated]

class FollowApiView(generics.ListAPIView):
    queryset = Subscription.objects.all()
    serializer_class = FollowSystemSerializers
    permission_classes = [AllowAny]

class RemoveFollowApiView(generics.DestroyAPIView):
    queryset = Subscription.objects.all()
    serializer_class = FollowSystemSerializers
    permission_classes = [IsAuthenticated]
