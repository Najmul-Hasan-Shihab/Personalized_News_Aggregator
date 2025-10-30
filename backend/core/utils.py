from datetime import datetime
from .ai_tasks.summarize import generate_summary
from .ai_tasks.sentiment import analyze_sentiment
from .ai_tasks.ner import extract_entities
from .ai_tasks.classify_category import predict_category, CATEGORY_LABELS
from .news_sources.newsapi import fetch_from_newsapi
from .news_sources.gnews import fetch_from_gnews
from .news_sources.mediastack import fetch_from_mediastack
from .db import articles_collection
import re

def clean_article_content(content, description=""):
    """Extract and clean article content."""
    # Combine description and content
    full_text = f"{description} {content}".strip()
    
    # Remove common junk patterns
    full_text = re.sub(r'\[.*?\]', '', full_text)  # Remove [+XXX chars]
    full_text = re.sub(r'Click here.*$', '', full_text, flags=re.IGNORECASE)
    full_text = re.sub(r'Read more.*$', '', full_text, flags=re.IGNORECASE)
    full_text = re.sub(r'Subscribe.*$', '', full_text, flags=re.IGNORECASE)
    full_text = re.sub(r'\s+', ' ', full_text).strip()
    
    return full_text

def aggregate_and_store_articles():
    """Fetch articles from all sources and process with AI."""
    all_articles = (
        fetch_from_newsapi() +
        fetch_from_gnews() +
        fetch_from_mediastack()
    )

    print(f"🔎 Total articles fetched: {len(all_articles)}")

    inserted = 0
    for article in all_articles:
        # Skip duplicates
        if articles_collection.find_one({"url": article["url"]}):
            continue

        # Get and clean content
        content = article.get("content", "")
        description = article.get("description", "")
        full_content = clean_article_content(content, description)
        
        # Skip only if content is completely empty or just placeholder
        if not full_content or full_content == "Article content unavailable.":
            # Try using title + description as last resort
            full_content = f"{article.get('title', '')} {description}".strip()
        
        # Very lenient check - only skip if truly empty (less than 10 words)
        if len(full_content.split()) < 10:
            print(f"⏭️ Skipped (no content): {article['title'][:50]}")
            continue

        print(f"\n🔄 Processing: {article['title'][:60]}...")
        
        # AI Processing - Summarization
        try:
            article["summary"] = generate_summary(full_content)
            if not article["summary"]:
                # Use description as fallback
                article["summary"] = description[:200] if description else ""
        except Exception as e:
            print(f"⚠️ Summarization failed: {e}")
            article["summary"] = description[:200] if description else ""

        # AI Processing - Sentiment Analysis
        try:
            sentiment = analyze_sentiment(full_content)
            article["sentiment_label"] = sentiment["label"]
            article["sentiment_confidence"] = sentiment["confidence"]
        except Exception as e:
            print(f"⚠️ Sentiment analysis failed: {e}")
            article["sentiment_label"] = "Neutral"
            article["sentiment_confidence"] = 0.0

        # AI Processing - Named Entity Recognition
        try:
            article["entities"] = extract_entities(full_content)
        except Exception as e:
            print(f"⚠️ NER failed: {e}")
            article["entities"] = []

        # AI Processing - Category Classification
        source_category = article.get("category", "general").lower()

        if source_category != "general" and source_category in CATEGORY_LABELS:
            article["category"] = source_category
            print(f"✅ Category (from source): {source_category}")
        else:
            article["category"] = predict_category(
                article["title"], 
                full_content, 
                fallback_label="general"
            )

        # Add timestamp
        article["ingested_at"] = datetime.utcnow()

        # Insert into MongoDB
        try:
            articles_collection.insert_one(article)
            inserted += 1
            print(f"✅ Inserted: {article['title'][:50]}...")
        except Exception as e:
            print(f"❌ Failed to insert article: {e}")

    print(f"\n🎉 Successfully inserted {inserted} new articles!")
    return inserted

