from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.services.action_plan_service import generate_8_point_action_plan
from app.core.auth import get_current_user

router = APIRouter(prefix="/api/action-plan", tags=["Action Plan Synthesizer"])

class ActionPlanRequest(BaseModel):
    state: Optional[str] = None
    district: Optional[str] = None
    crop: Optional[str] = None
    land_acres: Optional[float] = None
    N: Optional[float] = None
    P: Optional[float] = None
    K: Optional[float] = None
    ph: Optional[float] = None
    rainfall: Optional[float] = None
    temp: Optional[float] = None
    humidity: Optional[float] = None

@router.get("/generate")
@router.post("/generate")
async def generate_plan(req: Optional[ActionPlanRequest] = None, current_user: dict = Depends(get_current_user)):
    try:
        # Fill missing attributes from current_user profile
        st = (req.state if req and req.state else None) or current_user.get("state", "Maharashtra")
        dist = (req.district if req and req.district else None) or current_user.get("district", "Nashik")
        crp = (req.crop if req and req.crop else None) or current_user.get("primary_crop", "Rice")
        acres = (req.land_acres if req and req.land_acres else None) or current_user.get("land_acres", 5.0)
        n_val = (req.N if req and req.N is not None else None) or current_user.get("N", 90.0)
        p_val = (req.P if req and req.P is not None else None) or current_user.get("P", 42.0)
        k_val = (req.K if req and req.K is not None else None) or current_user.get("K", 43.0)
        ph_val = (req.ph if req and req.ph is not None else None) or current_user.get("ph", 6.5)
        rain_val = (req.rainfall if req and req.rainfall is not None else None) or 200.0
        temp_val = (req.temp if req and req.temp is not None else None) or 25.0
        hum_val = (req.humidity if req and req.humidity is not None else None) or 80.0

        res = await generate_8_point_action_plan(
            state=st,
            district=dist,
            crop=crp,
            land_acres=acres,
            N=n_val, P=p_val, K=k_val,
            ph=ph_val, rainfall=rain_val, temp=temp_val, humidity=hum_val
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
