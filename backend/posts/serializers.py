from .models import *
from rest_framework import serializers
from django.contrib.auth.models import User
from profiles.serializers import ProfileSerializer
from profiles.models import Profile

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name"]


class PostSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = Posts
        fields = [
            "id", "time", "time_update", "slug", "title", "photo",
            "likes", "about", "post", "is_published", "author", "profile",
            "author",
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request.user, "profile"):
            validated_data["profile"] = request.user.profile
        return super().create(validated_data)
