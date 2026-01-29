import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    print("WARNING: MONGO_URI not found in .env file. Using default localhost.")
    MONGO_URI = "mongodb://localhost:27017"

client = MongoClient(MONGO_URI)
db = client["chat_app"]

users_collection = db["users"]
messages_collection = db["messages"]
groups_collection = db["groups"]
