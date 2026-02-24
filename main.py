from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

# Routers
# Routers
from routes.dm import router as dm_router
from routes.group import router as group_router
from routes.users import router as users_router

# Models
from models import UserRegister

# Chat Logic
from chat_logic import add_user, login_user

# Auth Token Generator
from auth import create_token


# ============================================
# FastAPI App Initialization
# ============================================

app = FastAPI(title="Chat Application Backend 🚀")


# ============================================
# ✅ CORS Middleware (Frontend Connection)
# ============================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# Register Routers
# ============================================

app.include_router(dm_router, prefix="/dm", tags=["DM Chats"])
app.include_router(group_router, prefix="/group", tags=["Group Chats"])
app.include_router(users_router, prefix="/users", tags=["Users"])


# ============================================
# Home Route
# ============================================

@app.get("/")
def home():
    return {"message": "Chat App Backend Running ✅"}


# ============================================
# ✅ User Registration Route
# ============================================

@app.post("/register")
def register_user(data: UserRegister):

    success = add_user(data.username, data.password)

    if success:
        return {"status": "User registered successfully ✅"}

    raise HTTPException(status_code=400, detail="User already exists ❌")


# ============================================
# ✅ User Login Route (OAuth2 Standard)
# ============================================

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):

    valid_user = login_user(form_data.username, form_data.password)

    if not valid_user:
        raise HTTPException(status_code=401, detail="Invalid credentials ❌")

    token = create_token({"sub": form_data.username})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# ============================================
# ✅ WebSocket Endpoint
# ============================================

from fastapi import WebSocket, WebSocketDisconnect
from manager import manager
from jose import jwt, JWTError
from auth import SECRET_KEY, ALGORITHM

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = None):
    if not token:
        await websocket.close(code=4001)
        return

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            await websocket.close(code=4002)
            return
    except JWTError:
        await websocket.close(code=4003)
        return

    await manager.connect(websocket, username)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, username)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, username)
