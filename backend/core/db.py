from pymongo import MongoClient
from django.conf import settings

# Use settings from environment variables
client = MongoClient(settings.MONGODB_URI)
db = client[settings.MONGODB_DB_NAME]
articles_collection = db["articles"]
user_pref_collection = db["user_preferences"]
