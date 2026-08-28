from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import sqlite3
from app.core.config import DB_PATH
from app.core.auth import get_current_user
from app.services.weather_service import reverse_geocode

router = APIRouter(prefix="/api/profile", tags=["Farmer Profile"])

class ProfileUpdate(BaseModel):
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
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float

@router.get("")
def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user

@router.post("")
def update_profile(profile: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    lat = profile.latitude if profile.latitude is not None else current_user["latitude"]
    lon = profile.longitude if profile.longitude is not None else current_user["longitude"]
    
    cursor.execute("""
        UPDATE users
        SET farmer_name = ?, state = ?, district = ?, land_acres = ?, soil_type = ?,
            N = ?, P = ?, K = ?, ph = ?, primary_crop = ?, latitude = ?, longitude = ?
        WHERE id = ?
    """, (
        profile.farmer_name, profile.state, profile.district, profile.land_acres, profile.soil_type,
        profile.N, profile.P, profile.K, profile.ph, profile.primary_crop, lat, lon,
        current_user["id"]
    ))
    conn.commit()
    conn.close()
    
    updated_user = current_user.copy()
    updated_user.update({
        "farmer_name": profile.farmer_name,
        "state": profile.state,
        "district": profile.district,
        "land_acres": profile.land_acres,
        "soil_type": profile.soil_type,
        "N": profile.N, "P": profile.P, "K": profile.K, "ph": profile.ph,
        "primary_crop": profile.primary_crop,
        "latitude": lat,
        "longitude": lon
    })
    return {"status": "success", "profile": updated_user}

@router.post("/location")
async def update_location(loc: LocationUpdate, current_user: dict = Depends(get_current_user)):
    # Reverse geocode to get actual city, district, state
    geo = await reverse_geocode(loc.latitude, loc.longitude)
    district = geo["district"]
    state = geo["state"]
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE users
        SET latitude = ?, longitude = ?, district = ?, state = ?
        WHERE id = ?
    """, (loc.latitude, loc.longitude, district, state, current_user["id"]))
    conn.commit()
    conn.close()
    
    return {
        "status": "success",
        "latitude": loc.latitude,
        "longitude": loc.longitude,
        "district": district,
        "state": state,
        "formatted_address": geo["formatted_address"]
    }
