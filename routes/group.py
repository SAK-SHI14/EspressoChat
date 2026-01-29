from fastapi import APIRouter, Depends
from models import GroupCreate, GroupMessage
from chat_logic import create_group, send_group_message, get_group_history
from dependencies import get_current_user

router = APIRouter()


# ✅ Create Group
@router.post("/create")
def create_new_group(
    data: GroupCreate,
    current_user: str = Depends(get_current_user)
):
    if current_user not in data.members:
        data.members.append(current_user)

    return {"status": create_group(data.group_name, data.members)}


# ✅ Send Group Message (Token Protected)
from manager import manager
from database import groups_collection
from datetime import datetime

# ✅ Send Group Message (Token Protected)
@router.post("/send")
async def send_message(
    data: GroupMessage,
    current_user: str = Depends(get_current_user)
):
    result = send_group_message(current_user, data.group_name, data.message)

    if "✅" in result:
        # Get group members to notify
        group = groups_collection.find_one({"group_name": data.group_name})
        if group and "members" in group:
            await manager.send_group_message({
                "type": "group",
                "group_name": data.group_name,
                "sender": current_user,
                "message": data.message,
                "timestamp": datetime.utcnow().timestamp()
            }, group["members"])

    return {
        "status": result
    }


# ✅ View Group History
@router.get("/history")
def group_history(
    group_name: str,
    current_user: str = Depends(get_current_user)
):
    return {"group_chat": get_group_history(group_name)}
