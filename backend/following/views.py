from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.permissions import *

from following.services import *
from .models import *
from .serializers import *
from posts.permissions import *
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response

class FollowApiView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request: Request, username: str):
        follow(sender=request.user, username=username)

        return Response(status=status.HTTP_201_CREATED)
    
class UnFollowApiView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request: Request, username: str):
        unfollow(sender=request.user, username=username)

        return Response(status=status.HTTP_204_NO_CONTENT)
    

class GetFollowingListApiView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request, username: str):
        following = (
            Subscription.objects
            .filter(follower__username=username)
            .select_related("to_user__profile")
        )
        data = [f.to_user.username for f in following] 
        return Response(data=data, status=status.HTTP_200_OK)
    
class GetFollowerListApiView(APIView):
    permission_classes = [AllowAny]

    def get(self, request: Request, username: str):
        followers = (
            Subscription.objects
            .filter(to_user__username=username)
            .select_related("follower__profile")
        )
        data = [f.follower.username for f in followers]
        return Response(data=data, status=status.HTTP_200_OK)