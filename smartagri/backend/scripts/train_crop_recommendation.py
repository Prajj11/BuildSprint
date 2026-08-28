import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parent.parent))
from app.core.config import RAW_DATA_DIR, MODELS_DIR

def train_crop_model():
    print("Training Crop Recommendation RandomForestClassifier...")
    df = pd.read_csv(RAW_DATA_DIR / "crop_recommendation.csv")
    
    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Crop Recommendation Model Accuracy: {acc * 100:.2f}%")
    
    model_path = MODELS_DIR / "crop_recommendation_rf.joblib"
    joblib.dump(clf, model_path)
    print(f"Saved model to {model_path}")

if __name__ == "__main__":
    train_crop_model()
