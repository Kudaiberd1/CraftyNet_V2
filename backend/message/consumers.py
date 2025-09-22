import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender_id = self.scope['url_route']['kwargs']['sender_id']
        self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']
        self.room_name = f"{min(self.sender_id, self.receiver_id)}_{max(self.sender_id, self.receiver_id)}"
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        await self.send(json.dumps({"type": "system", "message": f"Connected to {self.room_name}"}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data.get("message")
        sender_id = data.get("sender")
        receiver_id = data.get("receiver")

        if content and sender_id and receiver_id:
            message_obj = await self.save_message(sender_id, receiver_id, content)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "id": message_obj.id,
                    "sender": message_obj.sender.id,
                    "receiver": message_obj.recipient.id,
                    "message": message_obj.content,
                    "timestamp": str(message_obj.timestamp),
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, content):
        from django.contrib.auth.models import User  # <- import here
        from .models import Message  # <- import here
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)
        room = f"{min(sender_id, receiver_id)}_{max(sender_id, receiver_id)}"
        return Message.objects.create(sender=sender, recipient=receiver, room=room, content=content)