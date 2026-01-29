from fastapi import APIRouter, Depends
from database import users_collection, groups_collection
from dependencies import get_current_user

router = APIRouter()

@router.get("/")
def list_users(current_user: str = Depends(get_current_user)):
    # Return all users except current user
    users_cursor = users_collection.find({}, {"username": 1, "_id": 0})
    users = [u for u in users_cursor if u["username"] != current_user]
    return users

@router.get("/groups")
def list_groups(current_user: str = Depends(get_current_user)):
    # Return groups where current user is a member
    # groups collection schema has "members": [list of strings]
    groups_cursor = groups_collection.find({"members": current_user}, {"group_name": 1, "_id": 0})
    return [g for g in groups_cursor]
