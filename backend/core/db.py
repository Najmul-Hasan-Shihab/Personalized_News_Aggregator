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

# Create indexes for better query performance
try:
    reading_history_collection.create_index([("username", 1), ("timestamp", -1)])
    reading_history_collection.create_index([("article_url", 1)])
    
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
        
except Exception as e:
    logger.error(f"Error creating indexes: {str(e)}")
