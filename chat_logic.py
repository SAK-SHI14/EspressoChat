from datetime import datetime
from database import users_collection, messages_collection, groups_collection
from auth import hash_password, verify_password

# =============================
# USER FUNCTIONS
# =============================

def add_user(username: str, password: str):
    if users_collection.find_one({"username": username}):
        return False
    
    user_doc = {
        "username": username,
        "password": hash_password(password),
        "created_at": datetime.utcnow()
    }
    users_collection.insert_one(user_doc)
    return True

def login_user(username: str, password: str):
    user = users_collection.find_one({"username": username})
    if not user:
        return False
    return verify_password(password, user["password"])

# =============================
# DM CHAT FUNCTIONS
# =============================

def send_dm(sender: str, receiver: str, message: str):
    # Check if receiver exists
    if not users_collection.find_one({"username": receiver}):
        return "User not found"
    
    msg_doc = {
        "type": "dm",
        "sender": sender,
        "receiver": receiver,
        "message": message,
        "timestamp": datetime.utcnow()
    }
    messages_collection.insert_one(msg_doc)
    return "DM sent ✅"

def get_dm_history(user1: str, user2: str):
    # Find messages where (sender=u1 AND receiver=u2) OR (sender=u2 AND receiver=u1)
    query = {
        "type": "dm",
        "$or": [
            {"sender": user1, "receiver": user2},
            {"sender": user2, "receiver": user1}
        ]
    }
    # Sort by timestamp ascending
    cursor = messages_collection.find(query).sort("timestamp", 1)
    
    # Convert _id to string or just return needed fields
    history = []
    for doc in cursor:
        history.append({
            "sender": doc["sender"],
            "message": doc["message"],
            "timestamp": doc["timestamp"].isoformat()
        })
    return history

# =============================
# GROUP CHAT FUNCTIONS
# =============================

def create_group(group_name: str, members: list):
    if groups_collection.find_one({"group_name": group_name}):
        return "Group already exists ❌"
    
    # Verify members
    valid_members = []
    for user in members:
        if users_collection.find_one({"username": user}):
            valid_members.append(user)
    
    if not valid_members:
        return "No valid members found ❌"

    group_doc = {
        "group_name": group_name,
        "members": valid_members,
        "created_by": valid_members[0] if valid_members else "unknown",
        "created_at": datetime.utcnow()
    }
    groups_collection.insert_one(group_doc)
    return "Group created ✅"

def send_group_message(sender: str, group_name: str, message: str):
    group = groups_collection.find_one({"group_name": group_name})
    if not group:
        return "Group does not exist ❌"
    
    if sender not in group["members"]:
        return "Sender not in group ❌"
    
    msg_doc = {
        "type": "group",
        "group_name": group_name,
        "sender": sender,
        "message": message,
        "timestamp": datetime.utcnow()
    }
    messages_collection.insert_one(msg_doc)
    return "Message sent ✅"

def get_group_history(group_name: str):
    if not groups_collection.find_one({"group_name": group_name}):
        return []
    
    cursor = messages_collection.find({"type": "group", "group_name": group_name}).sort("timestamp", 1)
    
    history = []
    for doc in cursor:
        history.append({
            "sender": doc["sender"],
            "message": doc["message"],
            "timestamp": doc["timestamp"].isoformat()
        })
    return history
