from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class DMMessage(BaseModel):
    receiver: str
    message: str

class GroupCreate(BaseModel):
    group_name: str
    members: List[str]

class GroupMessage(BaseModel):
    group_name: str
    message: str

class UserRegister(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserInDB(BaseModel):
    username: str
    password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
