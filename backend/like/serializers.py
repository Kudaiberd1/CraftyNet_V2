from posts.models import *
from rest_framework import serializers
from django.contrib.auth.models import User
from profiles.serializers import ProfileSerializer
from .models import Like

class LikeSerializers(serializers.ModelSerializer):

    class Meta:
        model = Like
        fields = "__all__"
