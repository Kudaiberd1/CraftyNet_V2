import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Chat

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Use URL kwargs
        self.sender_id = self.scope["url_route"]["kwargs"]["user1"]
        self.receiver_id = self.scope["url_route"]["kwargs"]["user2"]

        # Deterministic room name
        users = sorted([int(self.sender_id), int(self.receiver_id)])
        self.room_name = f"{users[0]}-{users[1]}"
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")
        sender = self.scope["user"]

        if sender.is_anonymous:
            await self.send(text_data=json.dumps({"error": "Auth required"}))
            return

        chat = await self.save_message(sender.id, self.receiver_id, message)

        response = {
            "message": chat.content,
            "username": sender.username,
            "timestamp": chat.timestamp.isoformat(),
        }

        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "chat_message", "message": response}
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, content):
        from django.contrib.auth.models import User  # import inside function
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)
        return Chat.objects.create(
            room=self.room_name,
            sender=sender,
            receiver=receiver,
            content=content,
        )