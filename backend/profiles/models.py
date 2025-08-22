from django.db import models
from django.contrib.auth.models import User
from django_countries.fields import CountryField

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to="profiles/avatar", blank=True, null=True)
    bio = models.TextField(max_length=512, blank=True)
    country = CountryField(blank=True, null=True)
    social_link = models.CharField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

