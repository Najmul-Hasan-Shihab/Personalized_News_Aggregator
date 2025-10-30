import requests
from django.conf import settings
from .article_scraper import get_article_content

def fetch_from_newsapi():
    API_KEY = settings.NEWSAPI_KEY
    url = f"https://newsapi.org/v2/top-headlines?country=us&apiKey={API_KEY}"
    response = requests.get(url)
    data=response.json()

    articles = []
    for a in data.get("articles", []):
        if not (a.get("image") or a.get("urlToImage")):
            continue
        
        # Get full article content (scrape from URL)
        truncated_content = a.get("content", "")
        title = a.get("title", "")
        full_content = get_article_content(a["url"], fallback_content=truncated_content, title=title)
        
        articles.append({
            "title": title,
            "source": a["source"]["name"],
            "author": a.get("author", " "),
            "url": a["url"],
            "urlToImage": a.get("urlToImage"),
            "publishedAt": a["publishedAt"],
            "content": full_content,
            "category": "general"
        })
    
    return articles