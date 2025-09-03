from rest_framework import serializers
from django_countries.serializer_fields import CountryField
from django.contrib.auth.models import User
from posts.models import Posts
from profiles.models import Profile


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            password=validated_data["password"]
        )
        return user

class PostMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = "__all__"



class ProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source="user.first_name", allow_blank=True, required=False)
    last_name = serializers.CharField(source="user.last_name", allow_blank=True, required=False)
    username = serializers.CharField(source="user.username")
    email = serializers.CharField(source="user.email")
    is_staff = serializers.CharField(source="user.is_staff", read_only=True)
    date_joined = serializers.DateTimeField(source="user.date_joined", read_only=True)
    posts = PostMiniSerializer(many=True, read_only=True, source="profile")
    country = CountryField(allow_blank=True, required=False)

    class Meta:
        model = Profile
        fields = ["id", "username" ,"first_name", "last_name", "email","avatar", "bio", "country", "is_staff", "date_joined", "social_link", "posts"]
    
    def validate_social_link(self, value):
        from django.core.validators import URLValidator
        from django.core.exceptions import ValidationError

        if not value:  # allow blank values
            return value

        validator = URLValidator()
        try:
            validator(value)
        except ValidationError:
            raise serializers.ValidationError("Invalid URL")
        return value
    def update(self, instance, validated_data):
        # Extract and apply nested user data
        user_data = validated_data.pop("user", {})
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()
        return super().update(instance, validated_data)