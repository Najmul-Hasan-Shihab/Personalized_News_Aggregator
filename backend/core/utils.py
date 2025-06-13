from .db import articles_collection
from .news_sources.newsapi import fetch_from_newsapi
from .news_sources.gnews import fetch_from_gnews
from .news_sources.mediastack import fetch_from_mediastack

def aggregate_and_store_articles():
    from .news_sources.newsapi import fetch_from_newsapi
    from .news_sources.gnews import fetch_from_gnews
    from .news_sources.mediastack import fetch_from_mediastack
    from .db import articles_collection

    all_articles = (
        fetch_from_newsapi() +
        fetch_from_gnews() +
        fetch_from_mediastack()
    )

    print(f"🔎 Total articles fetched: {len(all_articles)}")

    inserted = 0
    for article in all_articles:
        if not articles_collection.find_one({"url": article["url"]}):
            articles_collection.insert_one(article)
            inserted += 1

    print(f"✅ Total articles inserted: {inserted}")
    return inserted
