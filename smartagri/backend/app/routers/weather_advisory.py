from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional
from app.services.weather_service import get_weather_advisory, calculate_weather_scenario, reverse_geocode
from app.core.auth import get_current_user

router = APIRouter(prefix="/api/weather", tags=["Weather & Advisory"])

@router.get("/advisory")
async def get_advisory(
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    location: Optional[str] = Query(None),
    crop: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    try:
        # Priority: explicit lat/lon -> explicit location query -> user profile coordinates
        user_crop = crop or current_user.get("primary_crop", "Rice")
        
        target_lat = lat if lat is not None else current_user.get("latitude")
        target_lon = lon if lon is not None else current_user.get("longitude")
        
        loc_name = location
        if not loc_name and target_lat and target_lon:
            geo = await reverse_geocode(target_lat, target_lon)
            loc_name = geo["formatted_address"]
        elif not loc_name:
            loc_name = f"{current_user.get('district', 'Nashik')}, {current_user.get('state', 'Maharashtra')}"
            
        res = await get_weather_advisory(latitude=target_lat, longitude=target_lon, location_name=loc_name, crop=user_crop)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/predict-from-history")
def simulate_weather_scenario(
    temp_offset: float = Query(0.0, ge=-3.0, le=5.0),
    rain_multiplier: float = Query(1.0, ge=0.0, le=2.5),
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    try:
        target_lat = lat if lat is not None else current_user.get("latitude")
        target_lon = lon if lon is not None else current_user.get("longitude")
        res = calculate_weather_scenario(temp_offset, rain_multiplier, latitude=target_lat, longitude=target_lon)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
