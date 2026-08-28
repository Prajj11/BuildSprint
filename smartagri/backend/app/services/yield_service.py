import joblib
import pandas as pd
from app.core.config import MODELS_DIR

_yield_model = None

def get_yield_model():
    global _yield_model
    if _yield_model is None:
        model_path = MODELS_DIR / "yield_prediction_gbr.joblib"
        _yield_model = joblib.load(model_path)
    return _yield_model

def predict_yield(crop: str, state: str, season: str, area_acres: float, fertilizer_kg_ha: float, rainfall_mm: float):
    model = get_yield_model()
    
    # Model trained on fertilizer_kg_ha, rainfall_mm, crop, state, season
    input_data = pd.DataFrame([{
        'crop': crop.capitalize(),
        'state': state.capitalize(),
        'season': season.capitalize(),
        'fertilizer_kg_ha': fertilizer_kg_ha,
        'rainfall_mm': rainfall_mm
    }])
    
    predicted_tons_ha = float(model.predict(input_data)[0])
    predicted_tons_ha = max(0.5, predicted_tons_ha)
    
    # Conversions: 1 Hectare = 2.47105 Acres
    # 1 Metric Ton = 10 Quintals
    # Yield in Quintals per Acre = (Tons/Ha * 10) / 2.47105
    quintals_per_acre = round((predicted_tons_ha * 10.0) / 2.47105, 2)
    tons_per_ha = round(predicted_tons_ha, 2)
    
    total_production_quintals = round(quintals_per_acre * area_acres, 2)
    total_production_tons = round(total_production_quintals / 10.0, 2)
    
    # Min/Max confidence range (+/- 12%)
    min_q = round(quintals_per_acre * 0.88, 2)
    max_q = round(quintals_per_acre * 1.12, 2)
    
    return {
        "crop": crop,
        "state": state,
        "season": season,
        "area_acres": area_acres,
        "predicted_yield_quintals_per_acre": quintals_per_acre,
        "predicted_yield_tons_per_hectare": tons_per_ha,
        "total_production_quintals": total_production_quintals,
        "total_production_tons": total_production_tons,
        "confidence_range": {
            "min": min_q,
            "max": max_q
        }
    }
