from django.db import models
from django.contrib.auth.models import User
from posts.models import Posts

class Like(models.Model):
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user} liked to {self.post}"