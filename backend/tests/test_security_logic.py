import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.security import get_password_hash, verify_password, create_access_token, verify_token
from datetime import timedelta

def test_security_logic():
    print("Testing Security Logic...")
    
    # 1. Password Hashing
    password = "test_password_123"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed) == True
    assert verify_password("wrong_password", hashed) == False
    print("✅ Password hashing verified.")
    
    # 2. JWT Generation & Verification
    user_data = {"sub": "user-123", "email": "test@example.com"}
    token = create_access_token(user_data, expires_delta=timedelta(minutes=15))
    assert isinstance(token, str)
    
    payload = verify_token(token)
    assert payload["sub"] == "user-123"
    assert payload["email"] == "test@example.com"
    print("✅ JWT generation and verification verified.")
    
    # 3. Expiration (optional check)
    # Token should be valid now
    print("🚀 All security tests passed!")

if __name__ == "__main__":
    try:
        test_security_logic()
    except Exception as e:
        print(f"❌ Security test failed: {e}")
        sys.exit(1)
