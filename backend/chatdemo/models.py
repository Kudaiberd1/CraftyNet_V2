from django.db import models

class Chat(models.Model):
    room = models.CharField(max_length=100, db_index=True)
    sender = models.ForeignKey("auth.User", on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.room} | {self.sender}: {self.content[:20]}'