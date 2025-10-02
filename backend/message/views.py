from django.shortcuts import get_object_or_404, render
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import *
from .models import *
from .serializers import *
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import status


class MessageApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username: str, format=None):
        messages = Message.objects.filter(Q(sender=request.user, recipient__id=username) | Q(sender__id=username, recipient=request.user)).order_by("timestamp")
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, username: str,format=None):
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(sender=User.objects.get(id = request.data["sender"]))
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def patch(self, request, *args, **kwargs):
        message_id = request.data.get("id")
        if not message_id:
            return Response({"error": "Message ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            message = Message.objects.get(id=message_id)
        except Message.DoesNotExist:
            return Response({"error": "Message not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = MessageSerializer(message, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, username: str,format=None):
        message_id = request.data.get("id")
        try:
            message = Message.objects.get(id=message_id)
        except Message.DoesNotExist:
            return Response({"error": "Message not found"}, status=status.HTTP_404_NOT_FOUND)
        
        message.delete()
        return Response({"message": "Message deleted"}, status=status.HTTP_204_NO_CONTENT)
        
    
class UserMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        users = User.objects.filter(Q(id__in=Message.objects.filter(sender=request.user).values_list('recipient', flat=True).distinct().order_by("timestamp")) | Q(id__in = Message.objects.filter(Q(recipient=request.user)).values_list('sender', flat=True).distinct().order_by("timestamp")))
        print(list(users))
        serializer = UserSerializer(users, many=True)
        print(serializer.data)
        return Response(serializer.data)