from rest_framework import viewsets
from .models import Chat
from .serializers import ChatSerializer

class ChatViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Chat.objects.all().order_by('timestamp')  # oldest first
    serializer_class = ChatSerializer