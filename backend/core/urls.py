from django.urls import path
from .views import (
    update_articles, get_articles, register_user, update_preferences, 
    get_preferences, get_filtered_articles, track_article_view, 
    get_reading_history, get_personalized_recommendations
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("articles/update/", update_articles),
    path("articles/", get_articles),
    path("articles/filtered/", get_filtered_articles),
    path("articles/personalized/", get_personalized_recommendations),
    path("articles/track/", track_article_view),
    path("register/", register_user),
    path("login/", TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("token/refresh/", TokenRefreshView.as_view(), name='token_refresh'),
    path("preferences/update/", update_preferences),
    path("preferences/", get_preferences),
    path("reading-history/", get_reading_history),
]
