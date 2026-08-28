from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.scheme_service import search_government_schemes, match_schemes_for_profile

router = APIRouter(prefix="/api/schemes", tags=["Government Schemes"])

class ProfileMatchRequest(BaseModel):
    state: str = "Maharashtra"
    land_acres: float = 5.0
    crop: Optional[str] = "Rice"

@router.get("/search")
def search_schemes(query: Optional[str] = None, category: str = "All"):
    try:
        res = search_government_schemes(query, category)
        return {"count": len(res), "schemes": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/match-profile")
def match_profile(req: ProfileMatchRequest):
    try:
        res = match_schemes_for_profile(req.state, req.land_acres, req.crop)
        return {"matched_count": len(res), "matched_schemes": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
