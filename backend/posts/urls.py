from django.urls import include, path

from django.conf import settings
from django.conf.urls.static import static

from .views import *

urlpatterns = [
    path("api/posts/", PostApiListView.as_view(), name="posts"),
    path("api/posts/add/", PostApiCreateView.as_view(), name="post_create"),
    path("api/posts/<int:pk>/update/", PostApiUpdateView.as_view(), name="post_update"),
    path("api/posts/<int:pk>/delete/", PostApiDeleteView.as_view(), name="post_delete"),
    path("api/posts/<int:pk>/", GetPostApiView.as_view(), name="get_post"),
    path("api/posts/author/<int:pk>/", GetAuthorPostView.as_view(), name="get_author_posts"),
    path("api/posts/author/<int:author_id>/<int:pk>/", AuthorPostDetailView.as_view()),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
