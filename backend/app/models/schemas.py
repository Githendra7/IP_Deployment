from pydantic import BaseModel
from typing import Optional, Dict

class ProjectCreate(BaseModel):
    problem_statement: str

class ProjectPhaseUpdate(BaseModel):
    human_approved_data: Dict

class UserRegister(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str
    email: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

