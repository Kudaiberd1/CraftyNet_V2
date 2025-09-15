from .models import *
from rest_framework import serializers

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'timestamp']