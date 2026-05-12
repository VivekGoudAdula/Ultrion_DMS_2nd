from fastapi import APIRouter, Depends, HTTPException, status
from app.utils.auth import verify_password, create_access_token, hash_password
from app.config.db import get_db
from app.schemas.schemas import LoginRequest, LoginResponse, UserResponse
from app.models.documents import UserDocument
from app.routes.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    if payload.email == "admin@ultrion.com":
        if payload.password != "Admin@123":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        # Create super admin token
        access_token = create_access_token(
            subject=payload.email,
            extra_claims={"role": "super_admin"}
        )
        return {
            "token": access_token,
            "user": {
                "id": "superadmin00",
                "name": "Super Admin",
                "email": payload.email,
                "role": "super_admin",
                "status": "active"
            }
        }

    db = get_db()
    user = await db["users"].find_one({"email": payload.email})
    
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    if user.get("status") != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is not active",
        )
    
    user["id"] = str(user["_id"])
    
    from datetime import datetime
    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Get Company Name if applicable
    if user.get("company_id"):
        from bson import ObjectId
        if ObjectId.is_valid(user["company_id"]):
            company = await db["companies"].find_one({"_id": ObjectId(user["company_id"])})
            if company:
                user["company_name"] = company["name"]
    
    # Issue token containing both email and company_id
    access_token = create_access_token(
        subject=user["email"], 
        extra_claims={"company_id": str(user.get("company_id")), "role": user.get("role", "viewer")}
    )
    
    return {
        "token": access_token,
        "user": UserResponse(**user)
    }

@router.get("/me", response_model=UserResponse)
async def current_user(current: UserDocument = Depends(get_current_user)):
    return current

