from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import *
from .models import *
from .serializers import *
from .permissions import *
from django.contrib.auth.models import User

#User

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

#Posts

class PostApiListView(generics.ListAPIView):
    queryset = Posts.published.all()
    serializer_class = PostSerializer

class PostApiCreateView(generics.ListCreateAPIView):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, )

class PostApiUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsOwner, )

class PostApiDeleteView(generics.RetrieveDestroyAPIView):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsOwner, )

#Post by id

class GetPostApiView(generics.RetrieveAPIView):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer