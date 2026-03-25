from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import verify_token
from app.core.config import supabase_client

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        
        payload = verify_token(token)
        # Check if sub (user_id) exists in payload
        if "sub" not in payload:
            raise HTTPException(status_code=401, detail="Invalid token: missing subject")
        
        user_id = payload["sub"]
        
        # Verify user still exists in DB (optional but recommended)
        # res = supabase_client.table("users").select("*").eq("id", user_id).execute()
        # if not res.data:
        #     raise HTTPException(status_code=401, detail="User no longer exists")
            
        return {"user_id": user_id, "email": payload.get("email")}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

