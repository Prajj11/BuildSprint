import sqlite3
import pandas as pd
from app.core.config import DB_PATH

def search_government_schemes(query: str = None, category: str = "All"):
    conn = sqlite3.connect(DB_PATH)
    sql = "SELECT scheme_name, category, beneficiary_type, max_land_acres, benefits_summary, portal_url, eligible_states FROM government_schemes WHERE 1=1"
    params = []
    
    if query:
        sql += " AND (LOWER(scheme_name) LIKE LOWER(?) OR LOWER(benefits_summary) LIKE LOWER(?))"
        params.extend([f"%{query}%", f"%{query}%"])
        
    if category and category.lower() != "all":
        sql += " AND LOWER(category) LIKE LOWER(?)"
        params.append(f"%{category}%")
        
    df = pd.read_sql_query(sql, conn, params=params)
    conn.close()
    
    schemes = []
    for _, row in df.iterrows():
        schemes.append({
            "scheme_name": row["scheme_name"],
            "category": row["category"],
            "beneficiary_type": row["beneficiary_type"],
            "max_land_acres": row["max_land_acres"],
            "benefits_summary": row["benefits_summary"],
            "portal_url": row["portal_url"],
            "eligible_states": row["eligible_states"]
        })
    return schemes

def match_schemes_for_profile(state: str, land_acres: float, crop: str = None):
    conn = sqlite3.connect(DB_PATH)
    sql = "SELECT scheme_name, category, beneficiary_type, max_land_acres, benefits_summary, portal_url, eligible_states FROM government_schemes"
    df = pd.read_sql_query(sql, conn)
    conn.close()
    
    matched = []
    for _, row in df.iterrows():
        # Check land eligibility
        max_land = float(row["max_land_acres"])
        states_str = str(row["eligible_states"])
        
        is_state_eligible = "All States" in states_str or state.lower() in states_str.lower()
        is_land_eligible = land_acres <= max_land
        
        if is_state_eligible and is_land_eligible:
            matched.append({
                "scheme_name": row["scheme_name"],
                "category": row["category"],
                "beneficiary_type": row["beneficiary_type"],
                "max_land_acres": row["max_land_acres"],
                "benefits_summary": row["benefits_summary"],
                "portal_url": row["portal_url"],
                "match_score": "100% Eligible ✨",
                "eligibility_reason": f"Matches land size ({land_acres} acres <= {max_land} acres limit) & location ({state})."
            })
            
    return matched[:6]
