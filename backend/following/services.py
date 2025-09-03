from django.db import IntegrityError, transaction

from rest_framework.exceptions import ValidationError

from profiles.selectors import get_user
from profiles.models import User
from .models import *

def follow(sender: User, username: str) -> None:

    if sender.username == username:
        raise ValidationError("You can't follow to yourself.")
    
    to_follow = get_user(username=username)

    try:
        with transaction.atomic():
            following = Subscription.objects.create(
                follower = sender,
                to_user = to_follow,
            )
    except IntegrityError:
        raise ValidationError("Following already exists.")
    
def unfollow(sender: User, username: str) -> None:
    
    if sender.username == username:
        raise ValidationError("You can't unfollow from yourself.")
    
    following = Subscription.objects.filter(follower = sender, to_user = get_user(username=username))
    with transaction.atomic():
        following.delete()


    
    