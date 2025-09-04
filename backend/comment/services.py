from django.db import IntegrityError, transaction

from rest_framework.exceptions import ValidationError

from posts.selectors import get_post
from profiles.models import User
from .models import *

def addComment(sender: User, pk: int):

    resiever = get_post(pk)

    try:
        with transaction.atomic():
            comment = Comment.objects.create(sender = sender, resiever = resiever)
    
    except IntegrityError:
        raise ValidationError("Somthing wrong while writing comment")

