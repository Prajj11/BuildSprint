from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.services.assistant_service import generate_assistant_response
from app.core.auth import get_current_user

router = APIRouter(prefix="/api/assistant", tags=["AI Farmer Assistant"])

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

@router.post("/chat")
async def chat_endpoint(req: ChatRequest, current_user: dict = Depends(get_current_user)):
    try:
        res = await generate_assistant_response(
            message=req.message,
            history=req.history,
            user_profile=current_user
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
