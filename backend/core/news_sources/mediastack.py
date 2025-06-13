import requests
from django.conf import settings

def fetch_from_mediastack():
    API_KEY = settings.MEDIASTACK_KEY
    url = f"http://api.mediastack.com/v1/news?access_key={API_KEY}&countries=us&limit=20"
    response = requests.get(url)
    data=response.json()

    return [{
        "title": a["title"],
        "source": a["source"],
        "author": a.get("author", ""),
        "url": a["url"],
        "urlToImage": "",  # mediastack free plan may not include image
        "publishedAt": a["published_at"],
        "content": a.get("description", ""),
        "category": a.get("category", "general")
    } for a in data.get("data", [])]