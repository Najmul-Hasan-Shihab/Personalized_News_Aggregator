from django.urls import path
from .views import (
    update_articles, get_articles, register_user, update_preferences, 
    get_preferences, get_filtered_articles, track_article_view, 
    get_reading_history, get_personalized_recommendations, search_articles,
    track_search_query, get_search_suggestions,
    add_bookmark, remove_bookmark, get_bookmarks, check_bookmark_status,
    create_reading_list, get_reading_lists, add_to_reading_list,
    remove_from_reading_list, delete_reading_list
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("articles/update/", update_articles),
    path("articles/", get_articles),
    path("articles/filtered/", get_filtered_articles),
    path("articles/personalized/", get_personalized_recommendations),
    path("articles/search/", search_articles),
    path("articles/track/", track_article_view),
    path("register/", register_user),
    path("login/", TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("token/refresh/", TokenRefreshView.as_view(), name='token_refresh'),
    path("preferences/update/", update_preferences),
    path("preferences/", get_preferences),
    path("reading-history/", get_reading_history),
    path("search/track/", track_search_query),
    path("search/suggestions/", get_search_suggestions),
    # Bookmarks
    path("bookmarks/add/", add_bookmark),
    path("bookmarks/remove/", remove_bookmark),
    path("bookmarks/", get_bookmarks),
    path("bookmarks/check/", check_bookmark_status),
    # Reading Lists
    path("reading-lists/create/", create_reading_list),
    path("reading-lists/", get_reading_lists),
    path("reading-lists/add-article/", add_to_reading_list),
    path("reading-lists/remove-article/", remove_from_reading_list),
    path("reading-lists/delete/", delete_reading_list),
]
