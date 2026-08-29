import sqlite3
import pandas as pd
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parent.parent))
from app.core.config import RAW_DATA_DIR, DB_PATH

def seed_database():
    print(f"Seeding SQLite database at {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create users table if not exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            farmer_name TEXT NOT NULL,
            state TEXT DEFAULT 'Maharashtra',
            district TEXT DEFAULT 'Nashik',
            land_acres REAL DEFAULT 5.0,
            soil_type TEXT DEFAULT 'Black Cotton Soil',
            N REAL DEFAULT 90.0,
            P REAL DEFAULT 42.0,
            K REAL DEFAULT 43.0,
            ph REAL DEFAULT 6.5,
            primary_crop TEXT DEFAULT 'Rice',
            latitude REAL DEFAULT 19.9975,
            longitude REAL DEFAULT 73.7898,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # Drop tables if exist
    tables = [
        "crop_recommendations", "mandi_prices", "yield_records",
        "government_schemes", "imd_rainfall_baselines", "icar_advisories",
        "district_crop_stats", "disease_remedies"
    ]
    for tbl in tables:
        cursor.execute(f"DROP TABLE IF EXISTS {tbl}")

    # Create disease_remedies table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS disease_remedies (
            class_id TEXT PRIMARY KEY,
            crop TEXT,
            condition TEXT,
            status TEXT,
            severity TEXT DEFAULT 'Moderate',
            pathogen TEXT DEFAULT 'Fungal / Bacterial',
            symptoms TEXT,
            immediate_action TEXT,
            organic_treatment TEXT,
            chemical_treatment TEXT,
            prevention TEXT DEFAULT 'Maintain proper plant spacing and rotation.'
        );
    """)

    # Populate disease_remedies table
    from app.core.disease_taxonomy import DISEASE_TAXONOMY
    for class_id, info in DISEASE_TAXONOMY.items():
        cursor.execute("""
            INSERT OR REPLACE INTO disease_remedies (class_id, crop, condition, status, severity, pathogen, symptoms, immediate_action, organic_treatment, chemical_treatment, prevention)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            class_id,
            info.get("crop", "Unknown"),
            info.get("disease", "Unknown"),
            info.get("status", "Unknown"),
            info.get("severity", "Moderate"),
            info.get("pathogen", "Fungal / Bacterial"),
            info.get("symptoms", ""),
            info.get("immediate_actions", ""),
            info.get("organic_treatment", ""),
            info.get("chemical_treatment", ""),
            info.get("prevention", "Maintain proper plant spacing and crop rotation.")
        ))

    # 1. crop_recommendations
    df_crop = pd.read_csv(RAW_DATA_DIR / "crop_recommendation.csv")
    df_crop.to_sql("crop_recommendations", conn, if_exists="replace", index=False)

    # 2. mandi_prices with Index
    df_mandi = pd.read_csv(RAW_DATA_DIR / "mandi_prices.csv")
    df_mandi.to_sql("mandi_prices", conn, if_exists="replace", index=False)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_mandi_search ON mandi_prices (commodity, state, district);")

    # 3. yield_records
    df_yield = pd.read_csv(RAW_DATA_DIR / "yield_records.csv")
    df_yield.to_sql("yield_records", conn, if_exists="replace", index=False)

    # 4. government_schemes
    df_schemes = pd.read_csv(RAW_DATA_DIR / "government_schemes.csv")
    df_schemes.to_sql("government_schemes", conn, if_exists="replace", index=False)

    # 5. imd_rainfall_baselines
    df_imd = pd.read_csv(RAW_DATA_DIR / "imd_rainfall_baselines.csv")
    df_imd.to_sql("imd_rainfall_baselines", conn, if_exists="replace", index=False)

    # 6. icar_advisories
    df_icar = pd.read_csv(RAW_DATA_DIR / "icar_advisories.csv")
    df_icar.to_sql("icar_advisories", conn, if_exists="replace", index=False)

    # 7. district_crop_stats
    df_dist = pd.read_csv(RAW_DATA_DIR / "district_crop_stats.csv")
    df_dist.to_sql("district_crop_stats", conn, if_exists="replace", index=False)

    conn.commit()
    conn.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
