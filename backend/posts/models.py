import uuid
from django.utils.text import slugify
from django.db import models
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User


class PublishedManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_published=Posts.Status.PUBLISHED)

class Posts(models.Model):
    class Status(models.IntegerChoices):
        DRAFT = 0, 'Drafts'
        PUBLISHED = 1, 'Published'

    time = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True, blank=True)
    title = models.CharField(max_length=255)
    photo = models.ImageField(upload_to="static/photos/%Y/%m/%d", default=None, blank=True, null=True, verbose_name='Image')
    likes = models.ManyToManyField(get_user_model(), related_name='liked_posts', blank=True)
    about = models.TextField(blank=True)
    post = models.TextField(blank=True)
    is_published = models.BooleanField(choices=tuple(map(lambda x: (bool(x[0]), x[1]) ,Status.choices)), 
                                       default=Status.DRAFT)
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='author', null=True, default=None)

    objects = models.Manager()
    published = PublishedManager()


    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse('post', kwargs={'post_id': self.pk})
    
    def save(self, *args, **kwargs):
        if 1:
            base_slug = slugify(self.title)
            slug = base_slug
            num = 1
            while Posts.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{num}"
                num += 1
            self.slug = slug
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = "Content"
        ordering = ["-time_update"]
        indexes = [
            models.Index(fields=ordering)
        ]