from django.urls import path
from .views import update_articles, get_articles  # ⬅ import views

urlpatterns = [
    path("articles/update/", update_articles),
    path("articles/", get_articles),
]
