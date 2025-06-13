# views.py
from django.http import JsonResponse
from .utils import aggregate_and_store_articles
from .db import articles_collection

def update_articles(request):
    print("🔁 update_articles called")  # Debug log
    count = aggregate_and_store_articles()
    return JsonResponse({"status": f"{count} new articles stored"})


def get_articles(request):
    articles = list(articles_collection.find({}, {"_id": 0}))
    return JsonResponse(articles, safe=False)
