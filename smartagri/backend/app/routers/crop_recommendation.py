from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.crop_service import predict_crop

router = APIRouter(prefix="/api/crop-recommendation", tags=["Crop Recommendation"])

class CropPredictionRequest(BaseModel):
    N: float = 90.0
    P: float = 42.0
    K: float = 43.0
    temperature: float = 20.8
    humidity: float = 82.0
    ph: float = 6.5
    rainfall: float = 202.9

@router.post("/predict")
def get_crop_recommendation(req: CropPredictionRequest):
    try:
        res = predict_crop(req.N, req.P, req.K, req.temperature, req.humidity, req.ph, req.rainfall)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
