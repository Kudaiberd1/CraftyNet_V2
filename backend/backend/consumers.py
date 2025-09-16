import json
from channels.generic.websocket import WebsocketConsumer
from django.shortcuts import get_object_or_404
from message.models import Message

class ChatroomConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope['user']
        self.chatroom_name = self.scope['url_route']['kwargs']['chatroom_name']
        self.chatroom = get_object_or_404(Message, group_name=self.chatroom_name)
        self.accept()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)

        message = Message.objects.create(
            sender = self.user,
            group_name = self.chatroom,
            
        )