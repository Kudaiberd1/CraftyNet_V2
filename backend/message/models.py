from django.db import models

class Message(models.Model):
    sender = models.ForeignKey('auth.User', related_name='sent_messages', on_delete=models.CASCADE)
    recipient = models.ForeignKey('auth.User', related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message from {self.sender} to {self.recipient} at {self.timestamp}'
    