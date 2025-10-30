# views.py
from django.http import JsonResponse
from .utils import aggregate_and_store_articles
from .db import articles_collection, user_pref_collection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
import logging

logger = logging.getLogger(__name__)


def update_articles(request):
    """Fetch and store new articles from all news sources."""
    try:
        logger.info("🔁 Article update requested")
        count = aggregate_and_store_articles()
        return JsonResponse({
            "status": "success",
            "message": f"{count} new articles stored",
            "count": count
        })
    except Exception as e:
        logger.error(f"❌ Error updating articles: {str(e)}")
        return JsonResponse({
            "status": "error",
            "message": "Failed to update articles",
            "error": str(e)
        }, status=500)


def get_articles(request):
    """Get all articles from the database."""
    try:
        articles = list(articles_collection.find({}, {"_id": 0}))
        return JsonResponse(articles, safe=False)
    except Exception as e:
        logger.error(f"❌ Error fetching articles: {str(e)}")
        return JsonResponse({
            "status": "error",
            "message": "Failed to fetch articles",
            "error": str(e)
        }, status=500)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new user."""
    try:
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username
            }, status=status.HTTP_201_CREATED)
        
        logger.warning(f"Registration validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"❌ Registration error: {str(e)}")
        return Response({
            "status": "error",
            "message": "Registration failed",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_preferences(request):
    """Update user's category preferences."""
    try:
        user = request.user.username
        categories = request.data.get('categories', [])
        
        if not isinstance(categories, list):
            return Response({
                "status": "error",
                "message": "Categories must be a list"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update user preferences in the database
        user_pref_collection.update_one(
            {'username': user},
            {'$set': {'categories': categories}},
            upsert=True
        )
        
        logger.info(f"✅ Preferences updated for user: {user}")
        return Response({
            "status": "success",
            "message": "Preferences updated successfully"
        })
    except Exception as e:
        logger.error(f"❌ Error updating preferences: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to update preferences",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_preferences(request):
    """Get user's category preferences."""
    try:
        user = request.user.username
        prefs = user_pref_collection.find_one({'username': user}, {'_id': 0})
        return Response(prefs or {"categories": []})
    except Exception as e:
        logger.error(f"❌ Error fetching preferences: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to fetch preferences",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_filtered_articles(request):
    """Get articles filtered by user's category preferences."""
    try:
        user = request.user.username
        prefs = user_pref_collection.find_one({'username': user}, {'_id': 0})
        
        if not prefs:
            return Response({
                "articles": [],
                "message": "No preferences set. Please set your preferences first."
            })
        
        categories = prefs.get('categories', [])
        
        if not categories:
            return Response({
                "articles": [],
                "message": "No category preferences selected."
            })

        filtered_articles = list(articles_collection.find(
            {"category": {"$in": categories}},
            {"_id": 0}
        ).sort("publishedAt", -1))  # Sort by newest first

        logger.info(f"✅ Fetched {len(filtered_articles)} filtered articles for user: {user}")
        return Response({
            "articles": filtered_articles,
            "count": len(filtered_articles),
            "categories": categories
        })
    except Exception as e:
        logger.error(f"❌ Error fetching filtered articles: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to fetch filtered articles",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)