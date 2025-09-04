from django.db import models
from django.contrib.auth.models import User
from posts.models import Posts

class Comment(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE) 
    resiever = models.ForeignKey(Posts, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.sender} write comment to {self.resiever}'