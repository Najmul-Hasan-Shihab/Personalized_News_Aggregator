# views.py
from django.http import JsonResponse
from .utils import aggregate_and_store_articles
from .db import (
    articles_collection, user_pref_collection, reading_history_collection, 
    search_history_collection, bookmarks_collection, reading_lists_collection,
    analytics_collection
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
from datetime import datetime
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

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow both authenticated and anonymous users
def track_article_view(request):
    """Track when a user views/clicks on an article for ML recommendations."""
    try:
        # Get user if authenticated, otherwise skip tracking
        if not request.user.is_authenticated:
            return Response({
                "status": "success",
                "message": "Tracking skipped for anonymous user"
            })
        
        user = request.user.username
        article_url = request.data.get('article_url')
        article_title = request.data.get('article_title', '')
        article_category = request.data.get('category', '')
        reading_time = request.data.get('reading_time', 0)  # in seconds
        
        if not article_url:
            return Response({
                "status": "error",
                "message": "article_url is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create reading history entry
        reading_entry = {
            "username": user,
            "article_url": article_url,
            "article_title": article_title,
            "category": article_category,
            "reading_time": reading_time,
            "timestamp": datetime.utcnow(),
            "interaction_type": "click"  # can be: click, read, share, bookmark
        }
        
        reading_history_collection.insert_one(reading_entry)
        
        logger.info(f" Tracked article view for user: {user}, article: {article_title[:50] if article_title else 'Unknown'}")
        return Response({
            "status": "success",
            "message": "Article view tracked successfully"
        })
    except Exception as e:
        logger.error(f" Error tracking article view: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to track article view",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reading_history(request):
    """Get user's reading history."""
    try:
        user = request.user.username
        limit = int(request.GET.get('limit', 50))
        
        history = list(reading_history_collection.find(
            {"username": user},
            {"_id": 0}
        ).sort("timestamp", -1).limit(limit))
        
        logger.info(f" Fetched {len(history)} reading history items for user: {user}")
        return Response({
            "history": history,
            "count": len(history)
        })
    except Exception as e:
        logger.error(f" Error fetching reading history: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to fetch reading history",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_personalized_recommendations(request):
    """Get ML-powered personalized article recommendations."""
    try:
        from .ai_tasks.recommendations import get_recommendations
        
        user = request.user.username
        limit = int(request.GET.get('limit', 50))
        
        # Fetch user preferences
        prefs = user_pref_collection.find_one({'username': user}, {'_id': 0})
        if not prefs or not prefs.get('categories'):
            return Response({
                "articles": [],
                "message": "Please set your category preferences first to get personalized recommendations."
            })
        
        # Fetch user's reading history
        reading_history = list(reading_history_collection.find(
            {"username": user},
            {"_id": 0}
        ).sort("timestamp", -1).limit(100))  # Last 100 reads
        
        # Fetch all available articles
        all_articles = list(articles_collection.find({}, {"_id": 0}))
        
        if not all_articles:
            return Response({
                "articles": [],
                "message": "No articles available. Please wait while we fetch the latest news."
            })
        
        # Generate personalized recommendations using ML
        recommendations = get_recommendations(
            user_preferences=prefs,
            reading_history=reading_history,
            all_articles=all_articles,
            limit=limit
        )
        
        logger.info(f" Generated {len(recommendations)} ML recommendations for user: {user}")
        return Response({
            "articles": recommendations,
            "count": len(recommendations),
            "categories": prefs.get('categories', []),
            "reading_history_count": len(reading_history),
            "recommendation_engine": "ML-powered (TF-IDF + Collaborative Filtering)"
        })
        
    except Exception as e:
        logger.error(f" Error generating personalized recommendations: {str(e)}")
        # Fallback to category-based filtering
        try:
            prefs = user_pref_collection.find_one({'username': request.user.username}, {'_id': 0})
            categories = prefs.get('categories', []) if prefs else []
            fallback_articles = list(articles_collection.find(
                {"category": {"$in": categories}},
                {"_id": 0}
            ).sort("publishedAt", -1).limit(limit))
            
            return Response({
                "articles": fallback_articles,
                "count": len(fallback_articles),
                "message": "Using fallback recommendations (category-based)",
                "error": str(e)
            })
        except:
            return Response({
                "status": "error",
                "message": "Failed to generate recommendations",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def search_articles(request):
    """
    Full-text search across articles with filters.
    Query params:
    - q: search query (required)
    - category: filter by category
    - sentiment: filter by sentiment (positive, negative, neutral)
    - date_from: filter articles after this date (ISO format)
    - date_to: filter articles before this date (ISO format)
    - sort: sort by 'relevance' (default) or 'date'
    - limit: number of results (default 50)
    """
    try:
        query = request.GET.get('q', '').strip()
        category = request.GET.get('category', '')
        sentiment = request.GET.get('sentiment', '')
        date_from = request.GET.get('date_from', '')
        date_to = request.GET.get('date_to', '')
        sort_by = request.GET.get('sort', 'relevance')
        limit = int(request.GET.get('limit', 50))
        
        if not query:
            return Response({
                "status": "error",
                "message": "Search query 'q' is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Build MongoDB text search query
        search_filter = {"$text": {"$search": query}}
        
        # Add optional filters
        if category:
            search_filter["category"] = category
        
        if sentiment:
            search_filter["sentiment_label"] = sentiment.capitalize()
        
        # Date range filter
        if date_from or date_to:
            date_filter = {}
            if date_from:
                date_filter["$gte"] = date_from
            if date_to:
                date_filter["$lte"] = date_to
            search_filter["publishedAt"] = date_filter
        
        # Perform search with text score for relevance sorting
        results = list(articles_collection.find(
            search_filter,
            {
                "_id": 0,
                "score": {"$meta": "textScore"}  # Include relevance score
            }
        ))
        
        # Sort results
        if sort_by == 'relevance':
            results.sort(key=lambda x: x.get('score', 0), reverse=True)
        elif sort_by == 'date':
            results.sort(key=lambda x: x.get('publishedAt', ''), reverse=True)
        
        # Remove score from results before sending
        for result in results:
            result.pop('score', None)
        
        # Limit results
        results = results[:limit]
        
        logger.info(f" Search for '{query}' returned {len(results)} results")
        return Response({
            "query": query,
            "results": results,
            "count": len(results),
            "filters_applied": {
                "category": category or None,
                "sentiment": sentiment or None,
                "date_from": date_from or None,
                "date_to": date_to or None
            }
        })
    except Exception as e:
        logger.error(f" Search error: {str(e)}")
        return Response({
            "status": "error",
            "message": "Search failed",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def track_search_query(request):
    """Track user search queries for analytics and suggestions."""
    try:
        user = request.user.username
        query = request.data.get('query', '').strip()
        results_count = request.data.get('results_count', 0)
        
        if not query:
            return Response({
                "status": "error",
                "message": "Search query is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create search history entry
        search_entry = {
            "username": user,
            "query": query,
            "results_count": results_count,
            "timestamp": datetime.utcnow()
        }
        
        search_history_collection.insert_one(search_entry)
        
        logger.info(f" Tracked search query for user: {user}, query: '{query}'")
        return Response({
            "status": "success",
            "message": "Search query tracked"
        })
    except Exception as e:
        logger.error(f" Error tracking search query: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to track search query",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_search_suggestions(request):
    """Get popular search queries and user's recent searches."""
    try:
        user = request.user.username
        limit = int(request.GET.get('limit', 10))
        
        # Get user's recent searches
        recent_searches = list(search_history_collection.find(
            {"username": user},
            {"_id": 0, "query": 1, "timestamp": 1}
        ).sort("timestamp", -1).limit(limit))
        
        # Get popular searches (most frequent queries)
        popular_pipeline = [
            {"$group": {"_id": "$query", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": limit},
            {"$project": {"query": "$_id", "count": 1, "_id": 0}}
        ]
        popular_searches = list(search_history_collection.aggregate(popular_pipeline))
        
        return Response({
            "recent_searches": [s['query'] for s in recent_searches],
            "popular_searches": [s['query'] for s in popular_searches]
        })
    except Exception as e:
        logger.error(f" Error fetching search suggestions: {str(e)}")
        return Response({
            "recent_searches": [],
            "popular_searches": []
        })


# ============ BOOKMARKS ENDPOINTS ============

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_bookmark(request):
    """Add an article to user's bookmarks."""
    try:
        user = request.user.username
        article_url = request.data.get('article_url')
        article_title = request.data.get('article_title', '')
        article_data = request.data.get('article_data', {})
        
        if not article_url:
            return Response({
                "status": "error",
                "message": "article_url is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if already bookmarked
        existing = bookmarks_collection.find_one({
            "username": user,
            "article_url": article_url
        })
        
        if existing:
            return Response({
                "status": "info",
                "message": "Article already bookmarked"
            })
        
        # Create bookmark entry
        bookmark = {
            "username": user,
            "article_url": article_url,
            "article_title": article_title,
            "article_data": article_data,  # Store full article data
            "created_at": datetime.utcnow(),
            "tags": []  # Can be used for organization
        }
        
        bookmarks_collection.insert_one(bookmark)
        
        logger.info(f" Added bookmark for user: {user}, article: {article_title[:50] if article_title else 'Unknown'}")
        return Response({
            "status": "success",
            "message": "Article bookmarked successfully"
        })
    except Exception as e:
        logger.error(f" Error adding bookmark: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to add bookmark",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_bookmark(request):
    """Remove an article from user's bookmarks."""
    try:
        user = request.user.username
        article_url = request.data.get('article_url')
        
        if not article_url:
            return Response({
                "status": "error",
                "message": "article_url is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        result = bookmarks_collection.delete_one({
            "username": user,
            "article_url": article_url
        })
        
        if result.deleted_count == 0:
            return Response({
                "status": "info",
                "message": "Bookmark not found"
            })
        
        logger.info(f" Removed bookmark for user: {user}")
        return Response({
            "status": "success",
            "message": "Bookmark removed successfully"
        })
    except Exception as e:
        logger.error(f" Error removing bookmark: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to remove bookmark",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_bookmarks(request):
    """Get all bookmarks for the current user."""
    try:
        user = request.user.username
        
        bookmarks_raw = list(bookmarks_collection.find(
            {"username": user},
            {"_id": 0}
        ).sort("created_at", -1))
        
        # Flatten the article_data into the bookmark object
        bookmarks = []
        for bookmark in bookmarks_raw:
            article_data = bookmark.get('article_data', {})
            flattened = {
                "article_url": bookmark.get('article_url'),
                "created_at": bookmark.get('created_at'),
                "title": article_data.get('title', bookmark.get('article_title', '')),
                "summary": article_data.get('summary', ''),
                "source": article_data.get('source', ''),
                "author": article_data.get('author', ''),
                "image_url": article_data.get('image_url') or article_data.get('urlToImage', ''),
                "published_at": article_data.get('published_at') or article_data.get('publishedAt', ''),
                "category": article_data.get('category', ''),
                "sentiment": article_data.get('sentiment') or article_data.get('sentiment_label', ''),
            }
            bookmarks.append(flattened)
        
        logger.info(f" Retrieved {len(bookmarks)} bookmarks for user: {user}")
        return Response({
            "bookmarks": bookmarks,
            "count": len(bookmarks)
        })
    except Exception as e:
        logger.error(f" Error fetching bookmarks: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to fetch bookmarks",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_bookmark_status(request):
    """Check if specific articles are bookmarked."""
    try:
        user = request.user.username
        article_urls = request.GET.getlist('urls[]')
        
        if not article_urls:
            return Response({
                "status": "error",
                "message": "urls[] parameter is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        bookmarked = {}
        for url in article_urls:
            exists = bookmarks_collection.find_one({
                "username": user,
                "article_url": url
            })
            bookmarked[url] = exists is not None
        
        return Response({"bookmarks": bookmarked})
    except Exception as e:
        logger.error(f" Error checking bookmark status: {str(e)}")
        return Response({
            "bookmarks": {}
        })


# ============ READING LISTS ENDPOINTS ============

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_reading_list(request):
    """Create a new reading list."""
    try:
        user = request.user.username
        list_name = request.data.get('list_name', '').strip()
        description = request.data.get('description', '')
        
        if not list_name:
            return Response({
                "status": "error",
                "message": "list_name is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if list already exists
        existing = reading_lists_collection.find_one({
            "username": user,
            "list_name": list_name
        })
        
        if existing:
            return Response({
                "status": "error",
                "message": "Reading list with this name already exists"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create reading list
        reading_list = {
            "username": user,
            "list_name": list_name,
            "description": description,
            "articles": [],  # Array of article URLs
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        reading_lists_collection.insert_one(reading_list)
        
        logger.info(f" Created reading list '{list_name}' for user: {user}")
        return Response({
            "status": "success",
            "message": "Reading list created successfully",
            "reading_list": {
                "list_name": list_name,
                "description": description,
                "articles": [],
                "created_at": reading_list['created_at'],
                "updated_at": reading_list['updated_at']
            }
        })
    except Exception as e:
        logger.error(f" Error creating reading list: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to create reading list",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reading_lists(request):
    """Get all reading lists for the current user."""
    try:
        user = request.user.username
        
        lists_raw = list(reading_lists_collection.find(
            {"username": user},
            {"_id": 0}
        ).sort("created_at", -1))
        
        # Flatten article data in each list
        lists = []
        for reading_list in lists_raw:
            articles = reading_list.get('articles', [])
            flattened_articles = []
            
            for article in articles:
                flattened = {
                    "article_url": article.get('url') or article.get('article_url', ''),
                    "title": article.get('title', ''),
                    "summary": article.get('summary', ''),
                    "source": article.get('source', ''),
                    "author": article.get('author', ''),
                    "image_url": article.get('image_url') or article.get('urlToImage', ''),
                    "published_at": article.get('published_at') or article.get('publishedAt', ''),
                    "category": article.get('category', ''),
                    "sentiment": article.get('sentiment') or article.get('sentiment_label', ''),
                }
                flattened_articles.append(flattened)
            
            lists.append({
                "list_name": reading_list.get('list_name'),
                "description": reading_list.get('description', ''),
                "articles": flattened_articles,
                "created_at": reading_list.get('created_at'),
                "updated_at": reading_list.get('updated_at')
            })
        
        logger.info(f" Retrieved {len(lists)} reading lists for user: {user}")
        return Response({
            "reading_lists": lists,
            "count": len(lists)
        })
    except Exception as e:
        logger.error(f" Error fetching reading lists: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to fetch reading lists",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_reading_list(request):
    """Add an article to a reading list."""
    try:
        user = request.user.username
        list_name = request.data.get('list_name')
        article_url = request.data.get('article_url')
        article_data = request.data.get('article_data', {})
        
        if not list_name or not article_url:
            return Response({
                "status": "error",
                "message": "list_name and article_url are required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if article already in list
        existing_list = reading_lists_collection.find_one({
            "username": user,
            "list_name": list_name
        })
        
        if not existing_list:
            return Response({
                "status": "error",
                "message": "Reading list not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if article already in list
        if any(article.get('url') == article_url for article in existing_list.get('articles', [])):
            return Response({
                "status": "info",
                "message": "Article already in this list"
            })
        
        # Add article to list
        reading_lists_collection.update_one(
            {"username": user, "list_name": list_name},
            {
                "$push": {"articles": article_data},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        logger.info(f" Added article to reading list '{list_name}' for user: {user}")
        return Response({
            "status": "success",
            "message": "Article added to reading list"
        })
    except Exception as e:
        logger.error(f" Error adding to reading list: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to add article to reading list",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_reading_list(request):
    """Remove an article from a reading list."""
    try:
        user = request.user.username
        list_name = request.data.get('list_name')
        article_url = request.data.get('article_url')
        
        if not list_name or not article_url:
            return Response({
                "status": "error",
                "message": "list_name and article_url are required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        result = reading_lists_collection.update_one(
            {"username": user, "list_name": list_name},
            {
                "$pull": {"articles": {"url": article_url}},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        if result.modified_count == 0:
            return Response({
                "status": "info",
                "message": "Article not found in list"
            })
        
        logger.info(f" Removed article from reading list '{list_name}' for user: {user}")
        return Response({
            "status": "success",
            "message": "Article removed from reading list"
        })
    except Exception as e:
        logger.error(f" Error removing from reading list: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to remove article from reading list",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_reading_list(request):
    """Delete a reading list."""
    try:
        user = request.user.username
        list_name = request.data.get('list_name')
        
        if not list_name:
            return Response({
                "status": "error",
                "message": "list_name is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        result = reading_lists_collection.delete_one({
            "username": user,
            "list_name": list_name
        })
        
        if result.deleted_count == 0:
            return Response({
                "status": "error",
                "message": "Reading list not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
        logger.info(f" Deleted reading list '{list_name}' for user: {user}")
        return Response({
            "status": "success",
            "message": "Reading list deleted successfully"
        })
    except Exception as e:
        logger.error(f" Error deleting reading list: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to delete reading list",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
