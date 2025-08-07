import requests
from django.conf import settings

def fetch_from_gnews():
    API_KEY = settings.GNEWS_KEY
    url = f"https://gnews.io/api/v4/top-headlines?lang=en&country=us&token={API_KEY}"
    response = requests.get(url)
    data = response.json()

    return [{
        "title": a.get("title", ""),
        "source": a.get("source", {}).get("name", "Unknown"),
        "author": "",
        "url": a.get("url", ""),
        "urlToImage": a.get("image"),
        "publishedAt": a.get("publishedAt", ""),
        "content": a.get("content", ""),
        "category": "general"
    } for a in data.get("articles", [])]