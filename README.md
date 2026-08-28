# SmartAgri AI - Production AI Decision Support Platform for Farmers

SmartAgri AI translates multi-modal agricultural telemetry, computer vision leaf pathology, agronomic regression, Mandi wholesale price trends, and government schemes into actionable recommendations for farmers.

---

## 👥 Setup Instructions for Teammates

Follow these simple steps to run the project directly on any device:

### Prerequisites
1. **Python 3.11+** installed ([Download Python](https://www.python.org/downloads/))
2. **Node.js 18+** installed ([Download Node.js](https://nodejs.org/))

---

### Option 1: 1-Click Launch (Windows)

Simply double-click **`run_smartagri.bat`** in the project root directory.

It will automatically:
1. Initialize the SQLite database and seed initial tables if needed.
2. Launch the **FastAPI Backend Server** at `http://127.0.0.1:8000`.
3. Launch the **Vite React Frontend** at `http://127.0.0.1:5173`.

---

### Option 2: Manual Step-by-Step Setup

#### Step 1: Clone the Repository
```bash
git clone https://github.com/Prajj11/BuildSprint.git
cd BuildSprint
```

#### Step 2: Backend Setup
```bash
# Navigate to backend folder
cd smartagri/backend

# Install all backend Python dependencies
pip install -r requirements.txt

# Run initial setup script (seeds database & builds ML model binaries if needed)
python scripts/seed_sqlite_db.py

# Start FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Step 3: Frontend Setup (Open a new terminal window)
```bash
# Navigate to frontend folder
cd smartagri/frontend

# Install all frontend Node modules
npm install

# Start Vite frontend development server
npm run dev -- --host 127.0.0.1 --port 5173
```

---

## 🌐 URLs
- **Frontend Web Application**: [http://127.0.0.1:5173](http://127.0.0.1:5173)
- **Backend Interactive API Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🏛️ Key Platform Modules

1. **Farmer Authentication & Security**: JWT Authentication with protected routes and encrypted sessions.
2. **Soil & Climate Crop Advisor**: RandomForest Classifier (98.86% accuracy) on soil N-P-K & atmospheric telemetry.
3. **PyTorch Vision Pathology**: ResNet-38 CNN + Spatial Color Moments consensus layer with organic safeguards.
4. **Yield Regressor**: Gradient Boosting Regressor ($R^2 = 0.9870$) for harvest volume predictions.
5. **Mandi Market Intelligence**: Analyzes 57,000+ Agmarknet Mandi daily records with a "Where-to-Sell" profit ranker.
6. **Live Meteorological Telemetry**: Open-Meteo REST API integration with real-time browser GPS reverse geocoding.
7. **AI Farmer Assistant**: ICAR Knowledge Bulletin RAG + Multi-Tool Router for natural language chat.
8. **8-Point Action Plan**: Synthesizes a 1-2-3 execution checklist for farmers.
