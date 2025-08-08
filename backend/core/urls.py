from django.urls import path
from .views import update_articles, get_articles, register_user, update_preferences, get_preferences 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import get_filtered_articles


urlpatterns = [
    path("articles/update/", update_articles),
    path("articles/", get_articles),
    path("register/", register_user),
    path("login/", TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("token/refresh/", TokenRefreshView.as_view(), name='token_refresh'),
    path("preferences/update/", update_preferences),
    path("preferences/", get_preferences),
    path("articles/filtered/", get_filtered_articles),
]
