from rest_framework import serializers
from django_countries.serializer_fields import CountryField
from django.contrib.auth.models import User
from posts.models import Posts
from profiles.models import Profile
from .models import Subscription

class FollowSystemSerializers(serializers.ModelSerializer):

    class Meta:
        model = Subscription
        fields = "__all__"