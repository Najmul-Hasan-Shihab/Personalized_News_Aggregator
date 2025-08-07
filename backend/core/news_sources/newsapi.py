import requests
from django.conf import settings

def fetch_from_newsapi():
    API_KEY = settings.NEWSAPI_KEY
    url = f"https://newsapi.org/v2/top-headlines?country=us&apiKey={API_KEY}"
    response = requests.get(url)
    data=response.json()

    return [{
        "title": a["title"],
        "source": a["source"]["name"],
        "author": a.get("author", " "),
        "url": a["url"],
        "urlToImage": a.get("urlToImage"),
        "publishedAt": a["publishedAt"],
        "content": a.get("content", " "),
        "category": "general"
    } for a in data.get("articles", []) if a.get("image") or a.get("urlToImage")]