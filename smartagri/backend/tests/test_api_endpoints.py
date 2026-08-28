import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Helper function to register and log in a test user
def get_auth_headers(email="testfarmer@smartagri.in", password="secretpassword123"):
    reg_payload = {
        "email": email,
        "password": password,
        "farmer_name": "Test Farmer",
        "state": "Maharashtra",
        "district": "Nashik",
        "land_acres": 5.0,
        "soil_type": "Black Cotton Soil",
        "N": 90.0, "P": 42.0, "K": 43.0, "ph": 6.5,
        "primary_crop": "Rice",
        "latitude": 19.9975,
        "longitude": 73.7898
    }
    client.post("/api/auth/register", json=reg_payload)
    login_res = client.post("/api/auth/login", json={"email": email, "password": password})
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Production Decision Support Platform" in response.json()["platform"]

# 1. Auth & Profile Tests
def test_user_registration_and_login():
    headers = get_auth_headers("newfarmer@smartagri.in", "pass123456")
    res = client.get("/api/auth/me", headers=headers)
    assert res.status_code == 200
    assert res.json()["email"] == "newfarmer@smartagri.in"

def test_unauthenticated_access_denied():
    res = client.get("/api/weather/advisory")
    assert res.status_code == 401

def test_profile_update():
    headers = get_auth_headers()
    update_payload = {
        "farmer_name": "Updated Ramesh",
        "state": "Punjab",
        "district": "Ludhiana",
        "land_acres": 10.0,
        "soil_type": "Alluvial",
        "N": 100, "P": 50, "K": 50, "ph": 7.0,
        "primary_crop": "Wheat",
        "latitude": 30.9,
        "longitude": 75.85
    }
    res = client.post("/api/profile", json=update_payload, headers=headers)
    assert res.status_code == 200
    assert res.json()["profile"]["farmer_name"] == "Updated Ramesh"

def test_location_update():
    headers = get_auth_headers()
    res = client.post("/api/profile/location", json={"latitude": 28.6139, "longitude": 77.2090}, headers=headers)
    assert res.status_code == 200
    assert "formatted_address" in res.json()

# 2. Crop Recommendation Tests
def test_crop_recommendation_predict():
    payload = {"N": 90, "P": 42, "K": 43, "temperature": 20.8, "humidity": 82.0, "ph": 6.5, "rainfall": 202.9}
    res = client.post("/api/crop-recommendation/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "recommended_crop" in data
    assert "top_3" in data
    assert "feature_importances" in data

# 3. Disease Detection Tests
def test_disease_samples_list():
    res = client.get("/api/disease-detection/samples")
    assert res.status_code == 200
    assert "samples" in res.json()

def test_disease_sample_diagnose_healthy():
    res = client.post("/api/disease-detection/diagnose-sample?filename=apple_healthy.jpg")
    assert res.status_code == 200
    assert "organic_treatment" in res.json()

# 4. Yield Prediction Tests
def test_yield_predict_standard():
    payload = {"crop": "Rice", "state": "Punjab", "season": "Kharif", "area_acres": 5.0, "fertilizer_kg_ha": 120.0, "rainfall_mm": 950.0}
    res = client.post("/api/yield-prediction/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "predicted_yield_quintals_per_acre" in data

# 5. Weather Advisory Tests
def test_weather_advisory_authenticated():
    headers = get_auth_headers()
    res = client.get("/api/weather/advisory", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "telemetry_7day" in data
    assert "summary" in data

def test_weather_predict_from_history():
    headers = get_auth_headers()
    res = client.get("/api/weather/predict-from-history?temp_offset=2.0&rain_multiplier=1.5", headers=headers)
    assert res.status_code == 200
    assert "scenario" in res.json()

# 6. Market Intelligence Tests
def test_market_trends_rice():
    res = client.get("/api/market/trends?commodity=Rice&state=Maharashtra")
    assert res.status_code == 200
    assert "time_series" in res.json()

def test_market_where_to_sell_ranked():
    res = client.get("/api/market/where-to-sell?commodity=Rice&state=Maharashtra")
    assert res.status_code == 200
    assert len(res.json()["ranked_mandis"]) > 0

# 7. Government Schemes Tests
def test_schemes_search_all():
    res = client.get("/api/schemes/search?category=All")
    assert res.status_code == 200
    assert res.json()["count"] > 0

def test_schemes_match_profile():
    payload = {"state": "Maharashtra", "land_acres": 5.0, "crop": "Rice"}
    res = client.post("/api/schemes/match-profile", json=payload)
    assert res.status_code == 200
    assert res.json()["matched_count"] > 0

# 8. AI Assistant Tests
def test_assistant_chat_authenticated():
    headers = get_auth_headers()
    payload = {"message": "What is the price of Rice in Mandi?", "history": []}
    res = client.post("/api/assistant/chat", json=payload, headers=headers)
    assert res.status_code == 200
    assert "MarketIntelligence_Tool" in res.json()["tool_used"]

# 9. Action Plan Tests
def test_action_plan_generate():
    headers = get_auth_headers()
    res = client.get("/api/action-plan/generate", headers=headers)
    assert res.status_code == 200
    assert "action_plan_8_points" in res.json()

# 10. Models Info
def test_models_info_summary():
    res = client.get("/api/models-info/summary")
    assert res.status_code == 200
    assert len(res.json()["models"]) == 3
