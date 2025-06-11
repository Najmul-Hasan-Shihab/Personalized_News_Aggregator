from pymongo import MongoClient

client=MongoClient("mongodb://localhost:27017/")	

db=client["news_aggregator_db"]

test_collection=db["test_data"]