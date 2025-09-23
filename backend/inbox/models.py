from django.db import models
from django.contrib.auth.models import User

class Inbox(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="inbox_sender")
    resiever = models.ForeignKey(User, on_delete=models.CASCADE, related_name="inbpox_resiever")
    link = models.CharField(default=None)
    context = models.CharField()
    readed = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} sended {self.context} to {self.resiever}"