from datetime import datetime
from .ai_tasks.summarize import generate_summary
from .ai_tasks.sentiment import analyze_sentiment
from .ai_tasks.ner import extract_entities
from .ai_tasks.classify_category import predict_category,CATEGORY_LABELS
from .news_sources.newsapi import fetch_from_newsapi
from .news_sources.gnews import fetch_from_gnews
from .news_sources.mediastack import fetch_from_mediastack
from .db import articles_collection

def aggregate_and_store_articles():
    all_articles = (
        fetch_from_newsapi() +
        fetch_from_gnews() +
        fetch_from_mediastack()
    )

    print(f"🔎 Total articles fetched: {len(all_articles)}")

    inserted = 0
    for article in all_articles:
        if articles_collection.find_one({"url": article["url"]}):
            continue

        content = article.get("content", "")
        if not content or len(content.split()) < 30:
            continue

        # Summarization
        try:
            article["summary"] = generate_summary(content)
        except Exception as e:
            print(f"⚠️ Summarization failed: {e}")
            article["summary"] = ""

        # Sentiment Analysis
        try:
            sentiment = analyze_sentiment(content)
            article["sentiment_label"] = sentiment["label"]
            article["sentiment_confidence"] = sentiment["confidence"]
        except Exception as e:
            print(f"⚠️ Sentiment analysis failed: {e}")
            article["sentiment_label"] = "Neutral"
            article["sentiment_confidence"] = 0.0

        # NER
        try:
            article["entities"] = extract_entities(content)
        except Exception as e:
            print(f"⚠️ NER failed: {e}")
            article["entities"] = []

        # Determine final category
        source_category = article.get("category", "general").lower()

        if source_category != "general" and source_category in CATEGORY_LABELS:
            article["category"] = source_category
        else:
            article["category"] = predict_category(article["title"], content, fallback_label="general")

        # Timestamp for tracking
        article["ingested_at"] = datetime.utcnow()

        # Insert into DB
        articles_collection.insert_one(article)
        inserted += 1
        print(f"✔️ Inserted: {article['title'][:50]}...")

    return inserted
