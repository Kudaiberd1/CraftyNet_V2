from django.db import models
from django.contrib.auth.models import User

class Subscription(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following_subscriptions")
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers_subscriptions")
    
    class Meta:
        unique_together = ("follower", "to_user")

    
    def __str__(self):
        return f'{self.follower.username} followed to {self.to_user.username}'