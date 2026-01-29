from fastapi import WebSocket
from typing import List, Dict

class ConnectionManager:
    def __init__(self):
        # Map username -> list of active websockets (user might be logged in on multiple devices)
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()
        if username not in self.active_connections:
            self.active_connections[username] = []
        self.active_connections[username].append(websocket)
        print(f"User {username} connected. Active connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket, username: str):
        if username in self.active_connections:
            if websocket in self.active_connections[username]:
                self.active_connections[username].remove(websocket)
            if not self.active_connections[username]:
                del self.active_connections[username]
        print(f"User {username} disconnected.")

    async def send_personal_message(self, message: dict, receiver: str):
        if receiver in self.active_connections:
            for connection in self.active_connections[receiver]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"Error sending message to {receiver}: {e}")

    async def broadcast(self, message: dict):
        for username, connections in self.active_connections.items():
            for connection in connections:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"Error broadcasting: {e}")

    async def send_group_message(self, message: dict, members: List[str]):
        for member in members:
            if member in self.active_connections:
                for connection in self.active_connections[member]:
                    try:
                        await connection.send_json(message)
                    except Exception as e:
                        print(f"Error sending group message to {member}: {e}")

manager = ConnectionManager()
