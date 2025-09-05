from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.permissions import *

from .models import *
from .serializers import *
from posts.permissions import *
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response

class CommentApiView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, post_id):
        comments = Comment.objects.filter(resiever_id=post_id, parent=None).prefetch_related("replies")
        serializers = CommentSerializer(comments, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
    
    def post(self, request, post_id):
        data = request.data.copy()
        data["resiever"] = post_id
        serializers = CommentSerializer(data=data, context={"request": request})
        if serializers.is_valid():
            serializers.save(sender=request.user)
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, post_id):
        comment_id = request.data.get("id")  # frontend sends { "id": 5 }
        try:
            comment = Comment.objects.get(id=comment_id, resiever_id=post_id)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)

        if comment.sender != request.user:
            return Response({"error": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        comment.delete()
        return Response({"message": "Comment deleted"}, status=status.HTTP_204_NO_CONTENT)
