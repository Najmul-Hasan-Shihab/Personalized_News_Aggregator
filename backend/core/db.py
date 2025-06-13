from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["news_aggregator_db"]
articles_collection = db["articles"]  # ✅ This line is crucial!
