# views.py
from django.http import JsonResponse
from .utils import aggregate_and_store_articles
from .db import articles_collection, user_pref_collection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer

def update_articles(request):
    print("🔁 update_articles called")  # Debug log
    count = aggregate_and_store_articles()
    return JsonResponse({"status": f"{count} new articles stored"})


def get_articles(request):
    articles = list(articles_collection.find({}, {"_id": 0}))
    return JsonResponse(articles, safe=False)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer=RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username
        })
    print(serializer.errors)  # 👈🏽 Add this line to see exactly what's wrong
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_preferences(request):
    user = request.user.username
    categories = request.data.get('categories', [])
    
    # Update user preferences in the database
    user_pref_collection.update_one(
        {'username': user},
        {'$set': {'categories': categories}},
        upsert=True
    )
    
    return Response({"status": "Preferences updated successfully"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_preferences(request):
    user = request.user.username
    prefs = user_pref_collection.find_one({'username': user}, {'_id':0})
    return Response(prefs or {"categories": []})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_filtered_articles(request):
    user = request.user.username
    prefs = user_pref_collection.find_one({'username': user}, {'_id': 0})
    categories = prefs.get('categories', [])

    if not categories:
        return Response({"articles": [], "message": "No preferences set."})

    filtered_articles = list(articles_collection.find(
        {"category": {"$in": categories}},
        {"_id": 0}
    ))

    return Response({"articles": filtered_articles})