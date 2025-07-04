from django.urls import path
from .views import update_articles, get_articles, register_user, update_preferences, get_preferences  # ⬅ import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("articles/update/", update_articles),
    path("articles/", get_articles),
    path("register/", register_user),
    path("login/", TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("token/refresh/", TokenRefreshView.as_view(), name='token_refresh'),
    path("preferences/update/", update_preferences),  # ⬅ Add this line
    path("preferences/", get_preferences),  # ⬅ Add this line
]
