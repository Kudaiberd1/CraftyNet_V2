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

# class AddCommentApiView(APIView):

#     permission_classes = [IsAuthenticated]

#     def post(self, requets: Request, id: int):
