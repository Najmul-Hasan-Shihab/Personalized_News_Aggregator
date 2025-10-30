import requests
from django.conf import settings
from .article_scraper import get_article_content

def fetch_from_mediastack():
    API_KEY = settings.MEDIASTACK_KEY
    url = f"http://api.mediastack.com/v1/news?access_key={API_KEY}&countries=us&limit=20"
    response = requests.get(url)
    data = response.json()

    articles = []
    for a in data.get("data", []):
        if not (a.get("image") or a.get("urlToImage")):
            continue
        
        # Get full article content (scrape from URL)
        truncated_content = a.get("description", "")
        title = a.get("title", "")
        full_content = get_article_content(a["url"], fallback_content=truncated_content, title=title)
        
        articles.append({
            "title": title,
            "source": a["source"],
            "author": a.get("author", ""),
            "url": a["url"],
            "urlToImage": a.get("image", ""),  
            "publishedAt": a["published_at"],
            "content": full_content,
            "category": a.get("category", "general")
        })
    
    return articles