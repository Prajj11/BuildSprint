from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.yield_service import predict_yield

router = APIRouter(prefix="/api/yield-prediction", tags=["Yield Prediction"])

class YieldPredictionRequest(BaseModel):
    crop: str = "Rice"
    state: str = "Punjab"
    season: str = "Kharif"
    area_acres: float = 5.0
    fertilizer_kg_ha: float = 120.0
    rainfall_mm: float = 950.0

@router.post("/predict")
def get_yield_prediction(req: YieldPredictionRequest):
    try:
        res = predict_yield(
            crop=req.crop,
            state=req.state,
            season=req.season,
            area_acres=req.area_acres,
            fertilizer_kg_ha=req.fertilizer_kg_ha,
            rainfall_mm=req.rainfall_mm
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
