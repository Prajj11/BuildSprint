import sqlite3
import httpx
from typing import Optional
from app.core.config import DB_PATH
from app.services.market_service import get_market_trends
from app.services.weather_service import get_weather_advisory

def query_icar_rag_knowledge(query: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT crop, growth_stage, advisory_text, recommended_practice, institute FROM icar_advisories")
    rows = cursor.fetchall()
    conn.close()
    
    query_lower = query.lower()
    matched_advisories = []
    
    for row in rows:
        crop, stage, text, practice, inst = row
        if crop.lower() in query_lower or any(word in query_lower for word in text.lower().split()[:5]):
            matched_advisories.append({
                "crop": crop,
                "stage": stage,
                "advisory": text,
                "practice": practice,
                "source": inst
            })
            
    if not matched_advisories and rows:
        row = rows[0]
        matched_advisories.append({
            "crop": row[0],
            "stage": row[1],
            "advisory": row[2],
            "practice": row[3],
            "source": row[4]
        })
        
    return matched_advisories

async def generate_assistant_response(message: str, history: list = [], user_profile: Optional[dict] = None):
    message_lower = message.lower()
    user_state = user_profile.get("state", "Maharashtra") if user_profile else "Maharashtra"
    user_crop = user_profile.get("primary_crop", "Rice") if user_profile else "Rice"
    user_lat = user_profile.get("latitude") if user_profile else None
    user_lon = user_profile.get("longitude") if user_profile else None
    
    # 1. Market intelligence query
    if any(k in message_lower for k in ["price", "mandi", "market", "rate", "cost", "sell"]):
        commodity = user_crop
        for c in ["Rice", "Wheat", "Maize", "Cotton", "Potato", "Tomato", "Apple", "Grapes", "Onion", "Soybean"]:
            if c.lower() in message_lower:
                commodity = c
                break
        market_data = get_market_trends(commodity, user_state)
        summary = market_data["summary"]
        reply = (
            f"📈 **Market Intelligence for {commodity} in {user_state}**:\n"
            f"• **Current Average Modal Price**: ₹{summary['avg_modal_price']:,} / Quintal\n"
            f"• **Price Range**: ₹{summary['min_price']:,} - ₹{summary['max_price']:,}\n"
            f"• **Market Trend**: {summary['trend_direction']} (Volatility: {summary['volatility_index']})\n\n"
            f"💡 *Recommendation*: Mandi prices in top APMCs show strong realization. Check out the Market Intelligence tab to view the 'Where to Sell' ranker!"
        )
        return {
            "response": reply,
            "tool_used": "MarketIntelligence_Tool",
            "rag_context": []
        }
        
    # 2. Weather advisory query
    if any(k in message_lower for k in ["weather", "rain", "temperature", "forecast", "humidity", "spray"]):
        adv = await get_weather_advisory(latitude=user_lat, longitude=user_lon, crop=user_crop)
        summary = adv["summary"]
        icar = adv["icar_advisory"]
        reply = (
            f"🌦 **7-Day Weather Forecast ({adv['location']})**:\n"
            f"• **Expected Cumulative Rain**: {summary['total_rainfall_mm']} mm\n"
            f"• **Mean Max Temp**: {summary['mean_max_temperature_c']}°C\n"
            f"• **Fungal Pathogen Risk**: {summary['fungal_pathogen_risk']}\n"
            f"• **Spraying Safety Window**: {summary['spraying_safety_window']}\n\n"
            f"🏛 **ICAR ({icar['institute']}) Guidance**: {icar['advisory_text']}"
        )
        return {
            "response": reply,
            "tool_used": "WeatherAdvisory_Tool",
            "rag_context": [icar]
        }
        
    # 3. RAG Query
    rag_hits = query_icar_rag_knowledge(message)
    rag_text = ""
    if rag_hits:
        hit = rag_hits[0]
        rag_text = f"\n\n🏛 **ICAR Agronomic Advisory ({hit['source']})**:\n• **Stage**: {hit['stage']}\n• **Advisory**: {hit['advisory']}\n• **Recommended Practice**: {hit['practice']}"
        
    name_greeting = f"Namaste {user_profile.get('farmer_name', 'Farmer')}!" if user_profile else "Namaste Farmer!"
    reply = (
        f"{name_greeting} Based on SmartAgri AI agronomic telemetry:\n\n"
        f"For optimal crop management, ensure balanced N-P-K fertigation, inspect leaf undersides for early pathogen symptoms, "
        f"and monitor relative humidity before chemical foliar application."
        f"{rag_text}\n\n"
        f"Feel free to ask about specific crop recommendations, disease symptoms, or government subsidies!"
    )
    
    return {
        "response": reply,
        "tool_used": "ICAR_RAG_Assistant",
        "rag_context": rag_hits
    }
