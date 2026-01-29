from fastapi.testclient import TestClient
from main import app
from database import users_collection, messages_collection, groups_collection
import pytest

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_db():
    # Clean DB before each test
    users_collection.delete_many({})
    messages_collection.delete_many({})
    groups_collection.delete_many({})

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Chat App Backend Running ✅"}

def test_register_login():
    # Register
    res = client.post("/register", json={"username": "testuser", "password": "password123"})
    assert res.status_code == 200
    assert res.json()["status"] == "User registered successfully ✅"

    # Login
    res = client.post("/login", data={"username": "testuser", "password": "password123"})
    assert res.status_code == 200
    token = res.json()["access_token"]
    assert token is not None
    return token

def test_send_dm():
    # Register two users
    client.post("/register", json={"username": "alice", "password": "password"})
    client.post("/register", json={"username": "bob", "password": "password"})
    
    # Login Alice
    login_res = client.post("/login", data={"username": "alice", "password": "password"})
    token = login_res.json()["access_token"]
    
    # Send DM Alice -> Bob
    res = client.post(
        "/dm/send",
        json={"receiver": "bob", "message": "Hello Bob!"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200
    
    # Verify History
    history_res = client.get(
        "/dm/history?user2=bob",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert history_res.status_code == 200
    messages = history_res.json()["chat"]
    assert len(messages) == 1
    assert messages[0]["message"] == "Hello Bob!"
    assert messages[0]["sender"] == "alice"

def test_create_group():
    # Register users
    client.post("/register", json={"username": "g1", "password": "p"})
    client.post("/register", json={"username": "g2", "password": "p"})
    
    login_res = client.post("/login", data={"username": "g1", "password": "p"})
    token = login_res.json()["access_token"]
    
    # Create Group
    res = client.post(
        "/group/create",
        json={"group_name": "TestGroup", "members": ["g1", "g2"]},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res.status_code == 200
    assert res.json()["status"] == "Group created ✅"

    # Send Group Message
    msg_res = client.post(
        "/group/send",
        json={"group_name": "TestGroup", "message": "Hi Group!"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert msg_res.status_code == 200
    
    # Verify History
    hist_res = client.get(
        "/group/history?group_name=TestGroup",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert len(hist_res.json()["group_chat"]) == 1
    assert hist_res.json()["group_chat"][0]["message"] == "Hi Group!"
