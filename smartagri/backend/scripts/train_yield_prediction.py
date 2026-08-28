import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
import joblib
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parent.parent))
from app.core.config import RAW_DATA_DIR, MODELS_DIR

def train_yield_model():
    print("Training Crop Yield GradientBoostingRegressor...")
    df = pd.read_csv(RAW_DATA_DIR / "yield_records.csv")
    
    # Target: yield in tons per hectare
    df['yield_per_ha'] = df['production_tons'] / df['area_hectares']
    
    X = df[['crop', 'state', 'season', 'fertilizer_kg_ha', 'rainfall_mm']]
    y = df['yield_per_ha']
    
    categorical_features = ['crop', 'state', 'season']
    numerical_features = ['fertilizer_kg_ha', 'rainfall_mm']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features),
            ('num', 'passthrough', numerical_features)
        ]
    )
    
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', GradientBoostingRegressor(n_estimators=150, learning_rate=0.1, random_state=42))
    ])
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    
    print(f"Yield Prediction Model R² = {r2:.4f}, MAE = {mae:.2f} Tons/Ha")
    
    model_path = MODELS_DIR / "yield_prediction_gbr.joblib"
    joblib.dump(model, model_path)
    print(f"Saved yield model to {model_path}")

if __name__ == "__main__":
    train_yield_model()
