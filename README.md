# BuildSprint - SmartAgri AI

SmartAgri AI translates multi-modal agricultural telemetry, computer vision leaf pathology, agronomic regression, Mandi wholesale price trends, and government schemes into actionable recommendations for farmers.

## 🏛️ System Architecture

- **Soil & Climate Crop Advisor**: RandomForest Classifier (98.86% accuracy) on soil N-P-K & atmospheric telemetry.
- **PyTorch Vision Pathology**: ResNet-38 CNN + Spatial Color Moments consensus layer with organic safeguards.
- **Yield Regressor**: Gradient Boosting Regressor ($R^2 = 0.9870$) for harvest predictions.
- **Market Intelligence**: Aggregates 57,000+ Agmarknet Mandi daily wholesale records with "Where-to-Sell" profit ranker.
- **Live Weather Telemetry**: Open-Meteo REST API forecast integration with browser GPS reverse geocoding.
- **AI Farmer Assistant**: ICAR Knowledge Bulletin RAG + Multi-Tool Router.
- **8-Point Action Plan**: Synthesizes an executive summary & 1-2-3 execution checklist.

## 🛠️ Technology Stack

- **Backend**: Python 3.11+, FastAPI, PyTorch, scikit-learn, SQLite (`smartagri.db`), PyJWT
- **Frontend**: React 18, Vite 5, Recharts, Lucide Icons, Vanilla CSS Design System
- **Deployment**: Render.com (`render.yaml`), Vercel (`vercel.json`)

## 🚀 How to Run

### Quick Launch (Windows)
Double-click `run_smartagri.bat` or execute:
```cmd
.\run_smartagri.bat
```

### Manual Launch

1. **Backend**:
   ```bash
   cd smartagri/backend
   pip install -r requirements.txt
   python scripts/download_and_process_data.py
   python scripts/seed_sqlite_db.py
   python scripts/train_crop_recommendation.py
   python scripts/train_yield_prediction.py
   python scripts/setup_disease_model.py
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

2. **Frontend**:
   ```bash
   cd smartagri/frontend
   npm install
   npm run dev -- --host 127.0.0.1 --port 5173
   ```

- **Frontend App**: http://127.0.0.1:5173
- **Backend API Docs**: http://127.0.0.1:8000/docs
