from pymongo import MongoClient
from pymongo.errors import OperationFailure
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# Use settings from environment variables
client = MongoClient(settings.MONGODB_URI)
db = client[settings.MONGODB_DB_NAME]

# Collections
articles_collection = db["articles"]
user_pref_collection = db["user_preferences"]
reading_history_collection = db["reading_history"]
search_history_collection = db["search_history"]
bookmarks_collection = db["bookmarks"]
reading_lists_collection = db["reading_lists"]
analytics_collection = db["user_analytics"]

# Create indexes for better query performance
try:
    reading_history_collection.create_index([("username", 1), ("timestamp", -1)])
    reading_history_collection.create_index([("article_url", 1)])
    
    # Search history indexes
    search_history_collection.create_index([("username", 1), ("timestamp", -1)])
    search_history_collection.create_index([("query", 1)])
    
    # Try to create unique index on articles URL
    try:
        articles_collection.create_index([("url", 1)], unique=True)
    except OperationFailure as e:
        # Index might already exist or there are duplicates
        logger.warning(f"Could not create unique index on articles.url: {str(e)}")
        # Drop the index and recreate as non-unique if it exists
        try:
            articles_collection.drop_index("url_1")
            articles_collection.create_index([("url", 1)])  # Non-unique index
            logger.info("Recreated articles.url index as non-unique")
        except Exception:
            logger.warning("Using existing url index")
    
    try:
        user_pref_collection.create_index([("username", 1)], unique=True)
    except OperationFailure:
        logger.warning("User preferences index already exists")
    
    # Create text index for full-text search on articles
    try:
        # Text index on title, summary, and content for search functionality
        articles_collection.create_index([
            ("title", "text"),
            ("summary", "text"),
            ("content", "text")
        ], name="article_text_search", default_language="english")
        logger.info("Created text index for article search")
    except OperationFailure as e:
        if "already exists" in str(e).lower():
            logger.info("Text search index already exists")
        else:
            logger.warning(f"Could not create text search index: {str(e)}")
    
    # Additional indexes for filtering
    try:
        articles_collection.create_index([("category", 1)])
        articles_collection.create_index([("publishedAt", -1)])
        articles_collection.create_index([("sentiment_label", 1)])
    except OperationFailure:
        logger.info("Filter indexes already exist")
    
    # Bookmarks indexes
    try:
        bookmarks_collection.create_index([("username", 1), ("created_at", -1)])
        bookmarks_collection.create_index([("username", 1), ("article_url", 1)], unique=True)
        logger.info("Created bookmarks indexes")
    except OperationFailure:
        logger.info("Bookmarks indexes already exist")
    
    # Reading lists indexes
    try:
        reading_lists_collection.create_index([("username", 1), ("created_at", -1)])
        reading_lists_collection.create_index([("username", 1), ("list_name", 1)], unique=True)
        logger.info("Created reading lists indexes")
    except OperationFailure:
        logger.info("Reading lists indexes already exist")
    
    # Analytics indexes
    try:
        analytics_collection.create_index([("username", 1), ("date", -1)])
        analytics_collection.create_index([("username", 1), ("session_id", 1)])
        logger.info("Created analytics indexes")
    except OperationFailure:
        logger.info("Analytics indexes already exist")
        
except Exception as e:
    logger.error(f"Error creating indexes: {str(e)}")
