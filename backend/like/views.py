from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import *
from rest_framework import status

from profiles.selectors import get_user
from .models import *
from .serializers import *
from django.contrib.auth.models import User

class LikesApiView(generics.ListAPIView):
    queryset = Like.objects.all()
    serializer_class = LikeSerializers

        
class AddLikeApiView(APIView):
    def post(self, request, username ,post_id):
        user = get_user(username)
        post = Posts.objects.get(pk=post_id)

        like = Like.objects.filter(post=post, user=user)

        if like.exists():
            return Response({"detail": "Already liked"}, status=status.HTTP_403_FORBIDDEN)

        data = dict(request.data)
        data["post"] = post.id
        data["user"] = user.id

        serializer = LikeSerializers(data = data, context = {"request": request})

        if(serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def delete(self, request, username, post_id):
        user = get_user(username)

        like = Like.objects.filter(post_id=post_id, user=user).first()
        if like:
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "Like not found"}, status=status.HTTP_404_NOT_FOUND)
