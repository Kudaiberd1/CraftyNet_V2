from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import *
from .models import *
from .serializers import *
from django.contrib.auth.models import User


class MessageApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username: str, format=None):
        messages = Message.objects.filter(sender=request.user, recipient=username)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, username: str,format=None):
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(sender=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)