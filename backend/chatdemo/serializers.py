from rest_framework import serializers
from .models import Chat

class ChatSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()

    class Meta:
        model = Chat
        fields = ["id", "room", "sender", "content", "timestamp"]