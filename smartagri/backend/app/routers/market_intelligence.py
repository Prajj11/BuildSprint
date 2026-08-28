from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.services.market_service import get_market_trends, get_where_to_sell

router = APIRouter(prefix="/api/market", tags=["Market Intelligence"])

@router.get("/trends")
def market_trends(commodity: str = "Rice", state: Optional[str] = "Maharashtra"):
    try:
        res = get_market_trends(commodity, state)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/where-to-sell")
def where_to_sell(commodity: str = "Rice", state: Optional[str] = "Maharashtra"):
    try:
        res = get_where_to_sell(commodity, state)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
