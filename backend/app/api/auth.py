from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.schemas import UserRegister, UserLogin, Token
from app.core.config import supabase_client

router = APIRouter()

@router.post("/register", response_model=Token)
def register(user_data: UserRegister):
    # Check if user already exists
    existing_user = supabase_client.table("users").select("*").eq("email", user_data.email).execute()
    if existing_user.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user in Supabase public.users table
    new_user = supabase_client.table("users").insert({
        "email": user_data.email,
        "hashed_password": hashed_password
    }).execute()
    
    if not new_user.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    user = new_user.data[0]
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user["id"]), "email": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
def login(user_data: UserLogin):
    # Find user
    res = supabase_client.table("users").select("*").eq("email", user_data.email).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = res.data[0]
    
    # Verify password
    if not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    # We use email as 'sub' for simplicity, or we could use the UUID
    access_token = create_access_token(data={"sub": str(user["id"]), "email": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}
