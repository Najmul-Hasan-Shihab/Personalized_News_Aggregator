# analytics_endpoints.py - Advanced Analytics Endpoints
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .db import analytics_collection, reading_history_collection
from datetime import datetime, timedelta
from collections import defaultdict, Counter
import logging
import uuid

logger = logging.getLogger(__name__)


# ============ ANALYTICS TRACKING ENDPOINTS ============

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def track_reading_session(request):
    """Track a detailed reading session with timing and engagement data."""
    try:
        user = request.user.username
        article_url = request.data.get('article_url')
        article_title = request.data.get('article_title', '')
        category = request.data.get('category', '')
        reading_time = request.data.get('reading_time', 0)  # in seconds
        completed = request.data.get('completed', False)
        
        if not article_url:
            return Response({
                "status": "error",
                "message": "article_url is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        session_data = {
            "session_id": str(uuid.uuid4()),
            "username": user,
            "article_url": article_url,
            "article_title": article_title,
            "category": category,
            "reading_time": reading_time,
            "completed": completed,
            "timestamp": datetime.utcnow(),
            "date": datetime.utcnow().strftime('%Y-%m-%d'),
            "hour": datetime.utcnow().hour,
            "day_of_week": datetime.utcnow().strftime('%A')
        }
        
        analytics_collection.insert_one(session_data)
        
        logger.info(f"📊 Tracked reading session for user: {user}, article: {article_title[:50] if article_title else 'Unknown'}")
        return Response({
            "status": "success",
            "message": "Reading session tracked successfully"
        })
    except Exception as e:
        logger.error(f"❌ Error tracking reading session: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to track reading session",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============ ANALYTICS RETRIEVAL ENDPOINTS ============

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reading_stats(request):
    """Get comprehensive reading statistics for the user."""
    try:
        user = request.user.username
        days = int(request.GET.get('days', 30))  # Default last 30 days
        
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Get all reading sessions in date range
        sessions = list(analytics_collection.find({
            "username": user,
            "timestamp": {"$gte": start_date, "$lte": end_date}
        }, {"_id": 0}).sort("timestamp", -1))
        
        # Calculate statistics
        total_articles = len(sessions)
        total_reading_time = sum(s.get('reading_time', 0) for s in sessions)
        completed_articles = sum(1 for s in sessions if s.get('completed', False))
        avg_reading_time = total_reading_time / total_articles if total_articles > 0 else 0
        
        # Category breakdown
        category_counts = Counter(s.get('category', 'Unknown') for s in sessions)
        
        stats = {
            "total_articles_read": total_articles,
            "total_reading_time": total_reading_time,
            "total_reading_time_formatted": format_time(total_reading_time),
            "average_reading_time": round(avg_reading_time, 2),
            "average_reading_time_formatted": format_time(avg_reading_time),
            "completed_articles": completed_articles,
            "completion_rate": round((completed_articles / total_articles * 100) if total_articles > 0 else 0, 1),
            "favorite_category": category_counts.most_common(1)[0][0] if category_counts else "None",
            "categories_breakdown": dict(category_counts),
            "period_days": days
        }
        
        logger.info(f"📈 Retrieved reading stats for user: {user}")
        return Response(stats)
    except Exception as e:
        logger.error(f"❌ Error fetching reading stats: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to fetch reading statistics",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reading_timeline(request):
    """Get day-by-day reading activity timeline."""
    try:
        user = request.user.username
        days = int(request.GET.get('days', 30))
        
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Get all sessions in range
        sessions = list(analytics_collection.find({
            "username": user,
            "timestamp": {"$gte": start_date, "$lte": end_date}
        }, {"_id": 0, "date": 1, "reading_time": 1, "category": 1}))
        
        # Group by date
        daily_data = defaultdict(lambda: {"count": 0, "reading_time": 0, "categories": Counter()})
        
        for session in sessions:
            date = session.get('date', '')
            daily_data[date]["count"] += 1
            daily_data[date]["reading_time"] += session.get('reading_time', 0)
            daily_data[date]["categories"][session.get('category', 'Unknown')] += 1
        
        # Convert to sorted list
        timeline = [
            {
                "date": date,
                "articles_read": data["count"],
                "reading_time": data["reading_time"],
                "reading_time_formatted": format_time(data["reading_time"]),
                "top_category": data["categories"].most_common(1)[0][0] if data["categories"] else "None"
            }
            for date, data in sorted(daily_data.items())
        ]
        
        logger.info(f"📅 Retrieved reading timeline for user: {user}")
        return Response({
            "timeline": timeline,
            "total_days": len(timeline)
        })
    except Exception as e:
        logger.error(f"❌ Error fetching reading timeline: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to fetch reading timeline",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_peak_reading_times(request):
    """Get peak reading hours and days analysis."""
    try:
        user = request.user.username
        days = int(request.GET.get('days', 30))
        
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        sessions = list(analytics_collection.find({
            "username": user,
            "timestamp": {"$gte": start_date, "$lte": end_date}
        }, {"_id": 0, "hour": 1, "day_of_week": 1, "reading_time": 1}))
        
        logger.info(f"🔍 Peak times analysis for {user}: Found {len(sessions)} sessions")
        
        # Analyze by hour
        hour_data = defaultdict(lambda: {"count": 0, "total_time": 0})
        for session in sessions:
            hour = session.get('hour', 0)
            hour_data[hour]["count"] += 1
            hour_data[hour]["total_time"] += session.get('reading_time', 0)
        
        # Analyze by day of week
        day_data = defaultdict(lambda: {"count": 0, "total_time": 0})
        for session in sessions:
            day = session.get('day_of_week', 'Unknown')
            day_data[day]["count"] += 1
            day_data[day]["total_time"] += session.get('reading_time', 0)
        
        logger.info(f"📊 Hour distribution: {dict(hour_data)}")
        logger.info(f"📅 Day distribution: {dict(day_data)}")
        
        # Find peaks
        peak_hour = max(hour_data.items(), key=lambda x: x[1]["count"])[0] if hour_data else 12
        peak_day = max(day_data.items(), key=lambda x: x[1]["count"])[0] if day_data else "Monday"
        
        # Format hour distribution
        hours_distribution = [
            {
                "hour": hour,
                "hour_label": format_hour(hour),
                "articles_read": data["count"],
                "total_time": data["total_time"]
            }
            for hour, data in sorted(hour_data.items())
        ]
        
        # Format day distribution
        day_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        days_distribution = [
            {
                "day": day,
                "articles_read": day_data[day]["count"],
                "total_time": day_data[day]["total_time"],
                "total_time_formatted": format_time(day_data[day]["total_time"])
            }
            for day in day_order if day in day_data
        ]
        
        logger.info(f"⏰ Retrieved peak reading times for user: {user}")
        return Response({
            "peak_hour": peak_hour,
            "peak_hour_label": format_hour(peak_hour),
            "peak_day": peak_day,
            "hours_distribution": hours_distribution,
            "days_distribution": days_distribution
        })
    except Exception as e:
        logger.error(f"❌ Error fetching peak reading times: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to fetch peak reading times",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_personalized_insights(request):
    """Generate personalized insights based on reading habits."""
    try:
        user = request.user.username
        days = int(request.GET.get('days', 30))
        
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        sessions = list(analytics_collection.find({
            "username": user,
            "timestamp": {"$gte": start_date, "$lte": end_date}
        }, {"_id": 0}))
        
        insights = []
        
        if not sessions:
            insights.append({
                "type": "welcome",
                "message": "Start reading articles to see personalized insights!",
                "icon": "📚"
            })
            return Response({"insights": insights})
        
        # Insight 1: Reading streak
        dates = sorted(set(s.get('date', '') for s in sessions))
        if len(dates) >= 7:
            insights.append({
                "type": "streak",
                "message": f"🔥 Great job! You've been reading consistently. Active on {len(dates)} different days!",
                "icon": "🔥"
            })
        
        # Insight 2: Favorite category
        categories = Counter(s.get('category', 'Unknown') for s in sessions)
        if categories:
            top_cat, count = categories.most_common(1)[0]
            percentage = round((count / len(sessions)) * 100)
            insights.append({
                "type": "category",
                "message": f"📰 {top_cat} is your favorite! {percentage}% of your reads are in this category.",
                "icon": "📰"
            })
        
        # Insight 3: Peak reading time
        hours = [s.get('hour', 12) for s in sessions]
        if hours:
            peak_hour = Counter(hours).most_common(1)[0][0]
            time_period = "morning" if 5 <= peak_hour < 12 else "afternoon" if 12 <= peak_hour < 17 else "evening" if 17 <= peak_hour < 21 else "night"
            insights.append({
                "type": "time",
                "message": f"⏰ You're most active in the {time_period} (around {format_hour(peak_hour)}).",
                "icon": "⏰"
            })
        
        # Insight 4: Reading time
        total_time = sum(s.get('reading_time', 0) for s in sessions)
        avg_daily = total_time / days if days > 0 else 0
        if avg_daily > 600:  # More than 10 minutes per day
            insights.append({
                "type": "time_spent",
                "message": f"📖 You spend an average of {format_time(avg_daily)} reading per day. Keep it up!",
                "icon": "📖"
            })
        
        # Insight 5: Completion rate
        completed = sum(1 for s in sessions if s.get('completed', False))
        completion_rate = (completed / len(sessions)) * 100 if sessions else 0
        if completion_rate > 70:
            insights.append({
                "type": "completion",
                "message": f"✅ Impressive! You complete {round(completion_rate)}% of articles you start reading.",
                "icon": "✅"
            })
        
        logger.info(f"💡 Generated {len(insights)} insights for user: {user}")
        return Response({"insights": insights})
    except Exception as e:
        logger.error(f"❌ Error generating insights: {str(e)}")
        return Response({
            "status": "error",
            "message": "Failed to generate insights",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============ UTILITY FUNCTIONS ============

def format_time(seconds):
    """Format seconds into readable time string."""
    if seconds < 60:
        return f"{int(seconds)}s"
    elif seconds < 3600:
        minutes = int(seconds / 60)
        return f"{minutes}m"
    else:
        hours = int(seconds / 3600)
        minutes = int((seconds % 3600) / 60)
        return f"{hours}h {minutes}m" if minutes > 0 else f"{hours}h"


def format_hour(hour):
    """Format hour (0-23) into 12-hour format."""
    if hour == 0:
        return "12 AM"
    elif hour < 12:
        return f"{hour} AM"
    elif hour == 12:
        return "12 PM"
    else:
        return f"{hour - 12} PM"
