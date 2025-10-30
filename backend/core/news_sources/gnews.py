import requests
from django.conf import settings
from .article_scraper import get_article_content

def fetch_from_gnews():
    API_KEY = settings.GNEWS_KEY
    url = f"https://gnews.io/api/v4/top-headlines?lang=en&country=us&token={API_KEY}"
    response = requests.get(url)
    data = response.json()

    articles = []
    for a in data.get("articles", []):
        if not (a.get("image") or a.get("urlToImage")):
            continue
        
        # Get full article content (scrape from URL)
        truncated_content = a.get("content", "")
        title = a.get("title", "")
        full_content = get_article_content(a.get("url", ""), fallback_content=truncated_content, title=title)
        
        articles.append({
            "title": title,
            "source": a.get("source", {}).get("name", "Unknown"),
            "author": "",
            "url": a.get("url", ""),
            "urlToImage": a.get("image"),
            "publishedAt": a.get("publishedAt", ""),
            "content": full_content,
            "category": "general"
        })
    
    return articles