from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional
import sqlite3
from app.core.config import DB_PATH
from app.core.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication & User Security"])

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    farmer_name: str
    state: Optional[str] = "Maharashtra"
    district: Optional[str] = "Nashik"
    land_acres: Optional[float] = 5.0
    soil_type: Optional[str] = "Black Cotton Soil"
    N: Optional[float] = 90.0
    P: Optional[float] = 42.0
    K: Optional[float] = 43.0
    ph: Optional[float] = 6.5
    primary_crop: Optional[str] = "Rice"
    latitude: Optional[float] = 19.9975
    longitude: Optional[float] = 73.7898

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdateRequest(BaseModel):
    farmer_name: str
    state: str
    district: str
    land_acres: float
    soil_type: str
    N: float
    P: float
    K: float
    ph: float
    primary_crop: str
    latitude: Optional[float] = 19.9975
    longitude: Optional[float] = 73.7898

@router.post("/register")
def register(req: RegisterRequest):
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")
    
    hashed_pwd = hash_password(req.password)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if email exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (req.email.lower(),))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="An account with this email address already exists.")
        
    try:
        cursor.execute("""
            INSERT INTO users (email, hashed_password, farmer_name, state, district, land_acres, soil_type, N, P, K, ph, primary_crop, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            req.email.lower(), hashed_pwd, req.farmer_name, req.state, req.district,
            req.land_acres, req.soil_type, req.N, req.P, req.K, req.ph, req.primary_crop,
            req.latitude, req.longitude
        ))
        user_id = cursor.lastrowid
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Database error registering user: {str(e)}")
        
    conn.close()
    
    token = create_access_token({"sub": str(user_id), "email": req.email.lower()})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": req.email.lower(),
            "farmer_name": req.farmer_name,
            "state": req.state,
            "district": req.district,
            "land_acres": req.land_acres,
            "soil_type": req.soil_type,
            "N": req.N, "P": req.P, "K": req.K, "ph": req.ph,
            "primary_crop": req.primary_crop,
            "latitude": req.latitude,
            "longitude": req.longitude
        }
    }

@router.post("/login")
def login(req: LoginRequest):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, email, hashed_password, farmer_name, state, district, land_acres, soil_type, N, P, K, ph, primary_crop, latitude, longitude
        FROM users WHERE email = ?
    """, (req.email.lower(),))
    row = cursor.fetchone()
    conn.close()
    
    if not row or not verify_password(req.password, row[2]):
        raise HTTPException(status_code=401, detail="Invalid email address or password.")
        
    user_id = row[0]
    token = create_access_token({"sub": str(user_id), "email": row[1]})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": row[0],
            "email": row[1],
            "farmer_name": row[3],
            "state": row[4],
            "district": row[5],
            "land_acres": row[6],
            "soil_type": row[7],
            "N": row[8], "P": row[9], "K": row[10], "ph": row[11],
            "primary_crop": row[12],
            "latitude": row[13],
            "longitude": row[14]
        }
    }

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
