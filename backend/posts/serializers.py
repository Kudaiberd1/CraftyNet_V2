from .models import *
from rest_framework import serializers
from django.contrib.auth.models import User
from profiles.serializers import ProfileSerializer

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name"]


class PostSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = Posts
        fields = [
            "id", "time", "time_update", "slug", "title", "photo",
            "likes", "about", "post", "is_published", "author", "profile",
            "author",
        ]


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'password']
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
