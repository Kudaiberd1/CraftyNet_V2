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
from posts.permissions import IsOwner
from rest_framework import status


class InboxApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, format=None):
        inbox = Inbox.objects.filter(resiever=request.user.id).order_by("timestamp")
        serializer = InboxSerializer(inbox, many=True)
        return Response(serializer.data)
    
    def post(self, request, pk, format=None):
        serializer = InboxSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def patch(self, request, pk, format=None):
        inbox = get_object_or_404(Inbox, pk=pk)
        serializer = InboxSerializer(inbox, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        inbox = get_object_or_404(Inbox, pk=pk)

        inbox.delete()
        return Response({"detail": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
            
class InboxLengthApiView(APIView):

    def get(self, request, format=None):
        inbox = Inbox.objects.filter(resiever=request.user.id).filter(readed=False)
        #print(len(inbox))

        return Response(len(inbox))