from fastapi import APIRouter
from app.core.data_registry import DATASETS_REGISTRY

router = APIRouter(prefix="/api/models-info", tags=["Models & Registry Info"])

@router.get("/summary")
def get_models_summary():
    return {
        "models": [
            {
                "name": "Soil & Climate Crop Recommendation Classifier",
                "algorithm": "RandomForestClassifier",
                "dataset": "ICAR & Kaggle Agronomic Dataset (2,200 records)",
                "accuracy": "98.86%",
                "status": "Production Active ✅"
            },
            {
                "name": "Agronomic Yield Regressor",
                "algorithm": "GradientBoostingRegressor",
                "dataset": "DES State-Level Harvest Statistics (8,550 records)",
                "performance": "R² = 0.9870, MAE = 1.58 Tons/Ha",
                "status": "Production Active ✅"
            },
            {
                "name": "Multi-Stage Vision Pathology Model",
                "algorithm": "PyTorch ResNet-38 Vision CNN + Spatial Color Moments",
                "dataset": "PlantVillage Multi-Crop Dataset (54,305 images)",
                "classes": "38 healthy & diseased classes",
                "status": "Production Active ✅"
            }
        ]
    }

@router.get("/registry")
def get_datasets_registry():
    return {
        "total_datasets": len(DATASETS_REGISTRY),
        "registry": DATASETS_REGISTRY
    }
