from django.db import models
from django.contrib.auth.models import User
from posts.models import Posts

class Comment(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE) 
    resiever = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name="comments")
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name="replies")
    content = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f'{self.sender} commented on {self.resiever}'