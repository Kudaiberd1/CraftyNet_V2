from .models import *
from rest_framework import serializers
from django.contrib.auth.models import User

class InboxSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username", read_only=True)

    class Meta:
        model = Inbox
        fields = ['id', 'sender','sender_username' , 'resiever', 'context', 'link','readed' ,'timestamp']
