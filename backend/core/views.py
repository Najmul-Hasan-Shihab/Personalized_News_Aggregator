# views.py
import os
from django.http import JsonResponse
from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser
from django.conf import settings
from .utils import aggregate_and_store_articles
from .db import articles_collection, user_pref_collection, user_info_collection
from django.contrib.auth.models import User
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
    user_id = request.user.id
    categories = request.data.get('categories', [])
    
    # Update user preferences in the database
    user_pref_collection.update_one(
        {'user_id': user_id},
        {'$set': {'categories': categories}},
        upsert=True
    )
    
    return Response({"status": "Preferences updated successfully"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_preferences(request):
    user_id = request.user.id
    prefs = user_pref_collection.find_one({'user_id': user_id}, {'_id': 0})
    return Response(prefs or {"categories": []})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_filtered_articles(request):
    user_id = request.user.id
    prefs = user_pref_collection.find_one({'user_id': user_id}, {'_id': 0})
    print("🧾 Preferences found:", prefs)

    # Normalize preferences to lowercase to match DB
    categories = [cat.lower() for cat in (prefs.get('categories', []) if prefs else [])]
    print("📦 Extracted categories:", categories)

    if not categories:
        return Response({"articles": [], "message": "No preferences set."})

    # Find articles matching lowercase categories
    filtered_articles = list(articles_collection.find(
        {"category": {"$in": categories}},
        {"_id": 0}
    ))

    print("📰 Articles matched:", len(filtered_articles))
    return Response({"articles": filtered_articles})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_user_info(request):
    try:
        user_id = request.user.id
        profile_data = request.data
        profile_data['user_id'] = user_id

        # Optional: print size of image data
        print("ProfilePic size:", len(profile_data.get("profilePic", "")))
        print("CoverPic size:", len(profile_data.get("coverPic", "")))

        user_info_collection.update_one(
            {'user_id': user_id},
            {'$set': profile_data},
            upsert=True
        )
        return Response({"message": "Profile saved successfully"})
    except Exception as e:
        print("Error saving profile:", str(e))
        return Response({"error": "Failed to save profile"}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user_id = request.user.id
    user_info = user_info_collection.find_one({'user_id': user_id}, {'_id': 0})
    if user_info:
        return Response(user_info)
    return Response({"message": "No profile info found."})

@api_view(['POST'])
@parser_classes([MultiPartParser])
@permission_classes([IsAuthenticated])
def upload_profile_image(request):
    image_file = request.FILES.get('image')
    image_type = request.data.get('type')  # 'profilePic' or 'coverPic'

    if image_file and image_type:
        # Ensure media folder exists
        os.makedirs(settings.MEDIA_ROOT, exist_ok=True)

        # Save image to media folder
        filename = f"{request.user.id}_{image_type}.jpg"
        filepath = os.path.join(settings.MEDIA_ROOT, filename)

        with open(filepath, 'wb+') as f:
            for chunk in image_file.chunks():
                f.write(chunk)

        image_url = f"/media/{filename}"

        # Update MongoDB with image URL
        user_info_collection.update_one(
            {'user_id': request.user.id},
            {'$set': {image_type: image_url}},
            upsert=True
        )

        return Response({"message": "Image uploaded", "url": image_url})

    return Response({"error": "Invalid upload"}, status=400)