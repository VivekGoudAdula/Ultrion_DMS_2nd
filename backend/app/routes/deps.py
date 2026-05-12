from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.config.settings import settings
from app.config.db import get_db
from app.models.documents import UserDocument, PyObjectId
from app.schemas.schemas import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserDocument:
    """
    Extract token, validate JWT, and fetch user from DB.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email, role=payload.get("role"), company_id=payload.get("company_id"))
    except JWTError:
        raise credentials_exception

    # Standardized Super Admin bypass for Ultrion DMS
    if token_data.email == "admin@ultrion.com":
        return UserDocument(
            id=PyObjectId(b"superadmin00"), # valid 12-byte object id
            email="admin@ultrion.com", 
            role="super_admin", 
            password_hash="dummy",
            name="Super Admin"
        )

    db = get_db()
    user_dict = await db["users"].find_one({"email": token_data.email})
    if user_dict is None:
        raise credentials_exception
    
    if user_dict.get("company_id"):
        from bson import ObjectId
        if ObjectId.is_valid(user_dict["company_id"]):
            company = await db["companies"].find_one({"_id": ObjectId(user_dict["company_id"])})
            if company:
                user_dict["company_name"] = company["name"]
    
    user_dict["id"] = str(user_dict["_id"])
    return UserDocument(**user_dict)

async def require_super_admin(current_user: UserDocument = Depends(get_current_user)) -> UserDocument:
    """Ensure the user has an super_admin role."""
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super Admin privileges required."
        )
    return current_user
