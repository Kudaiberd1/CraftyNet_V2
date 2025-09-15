from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

class Like(models.Model):
    post = models.ForeignKey("posts.Posts", on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(User, on_delete=models.CASCADE)


    def __str__(self):
        return f"{self.user} liked {self.post}"
    
@receiver(post_save, sender=Like)
def increment_post_likes(sender, instance, created, **kwargs):
    if created:
        post = instance.post
        post.likes_count = post.likes.count()
        post.save()

# Signal: when a Like is deleted
@receiver(post_delete, sender=Like)
def decrement_post_likes(sender, instance, **kwargs):
    post = instance.post
    post.likes_count = post.likes.count()
    post.save()