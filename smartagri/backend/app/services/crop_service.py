import joblib
import pandas as pd
import numpy as np
from app.core.config import MODELS_DIR

_crop_model = None

def get_crop_model():
    global _crop_model
    if _crop_model is None:
        model_path = MODELS_DIR / "crop_recommendation_rf.joblib"
        _crop_model = joblib.load(model_path)
    return _crop_model

def predict_crop(N: float, P: float, K: float, temperature: float, humidity: float, ph: float, rainfall: float):
    model = get_crop_model()
    input_data = pd.DataFrame([[N, P, K, temperature, humidity, ph, rainfall]], 
                              columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
    
    probs = model.predict_proba(input_data)[0]
    classes = model.classes_
    
    top_indices = np.argsort(probs)[::-1][:3]
    recommended_crop = classes[top_indices[0]].capitalize()
    confidence = float(probs[top_indices[0]])
    
    top_3 = []
    for idx in top_indices:
        top_3.append({
            "crop": classes[idx].capitalize(),
            "confidence": round(float(probs[idx]), 4),
            "percentage": f"{round(float(probs[idx]) * 100, 1)}%"
        })
        
    # Feature importances breakdown
    importances = model.feature_importances_
    features = ['Nitrogen', 'Phosphorus', 'Potassium', 'Temperature', 'Humidity', 'pH Level', 'Rainfall']
    feature_importances = {feat: round(float(imp), 4) for feat, imp in zip(features, importances)}
    
    return {
        "recommended_crop": recommended_crop,
        "confidence": round(confidence, 4),
        "confidence_percentage": f"{round(confidence * 100, 1)}%",
        "top_3": top_3,
        "feature_importances": feature_importances,
        "optimal_conditions": {
            "N": N, "P": P, "K": K,
            "temperature": temperature,
            "humidity": humidity,
            "ph": ph,
            "rainfall": rainfall
        }
    }
