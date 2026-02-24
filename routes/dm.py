from fastapi import APIRouter, Depends
from models import DMMessage
from chat_logic import send_dm, get_dm_history
from dependencies import get_current_user

router = APIRouter()


# ✅ Send DM (Token Protected)
from manager import manager
import asyncio
from datetime import datetime

# ✅ Send DM (Token Protected)
@router.post("/send")
async def send_dm_message(
    data: DMMessage,
    current_user: str = Depends(get_current_user)
):
    result = send_dm(current_user, data.receiver, data.message)
    
    if "✅" in result:
        # Push to receiver via WebSocket
        await manager.send_personal_message({
            "type": "dm",
            "sender": current_user,
            "message": data.message,
            "timestamp": datetime.utcnow().isoformat()
        }, data.receiver)
        
        # Also push to sender (so they see their own message if they have multiple tabs open)
        await manager.send_personal_message({
            "type": "dm",
            "sender": current_user,
            "message": data.message,
            "timestamp": datetime.utcnow().isoformat()
        }, current_user)

    return {"status": result}


# ✅ View DM History
@router.get("/history")
def dm_history(
    user2: str,
    current_user: str = Depends(get_current_user)
):
    return {"chat": get_dm_history(current_user, user2)}
