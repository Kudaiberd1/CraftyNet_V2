from rest_framework import serializers
from .models import Comment

from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]

class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "sender", "resiever", "parent", "content", "created_at", "replies"]
        read_only_fields = ["sender"]

    def get_replies(self, obj):
        return CommentSerializer(obj.replies.all(), many=True).data