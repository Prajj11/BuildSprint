from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.core.config import SAMPLES_DIR
from app.routers import (
    auth,
    crop_recommendation,
    disease_detection,
    yield_prediction,
    weather_advisory,
    market_intelligence,
    government_schemes,
    ai_assistant,
    action_plan,
    models_info,
    farmer_profile
)

app = FastAPI(
    title="SmartAgri AI Platform Backend",
    description="Production Multi-Modal AI Decision Support Platform for Farmers",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory for sample leaf images
if SAMPLES_DIR.exists():
    app.mount("/static/samples", StaticFiles(directory=str(SAMPLES_DIR)), name="samples")

# Include Routers
app.include_router(auth.router)
app.include_router(crop_recommendation.router)
app.include_router(disease_detection.router)
app.include_router(yield_prediction.router)
app.include_router(weather_advisory.router)
app.include_router(market_intelligence.router)
app.include_router(government_schemes.router)
app.include_router(ai_assistant.router)
app.include_router(action_plan.router)
app.include_router(models_info.router)
app.include_router(farmer_profile.router)

@app.get("/")
def read_root():
    return {
        "platform": "SmartAgri AI Production Decision Support Platform",
        "status": "Online",
        "docs": "/docs"
    }
