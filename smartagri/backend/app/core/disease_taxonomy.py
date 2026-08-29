import sqlite3
from app.core.config import DB_PATH

def load_taxonomy_from_db():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT class_id, crop, condition, status, symptoms, organic_treatment, chemical_treatment, immediate_action
            FROM disease_remedies
        """)
        rows = cursor.fetchall()
        conn.close()
        
        taxonomy = {}
        for row in rows:
            class_id, crop, condition, status, symptoms, organic_treatment, chemical_treatment, immediate_action = row
            taxonomy[class_id] = {
                "crop": crop,
                "disease": condition,
                "status": status,
                "symptoms": symptoms,
                "organic_treatment": organic_treatment,
                "chemical_treatment": chemical_treatment,
                "immediate_actions": immediate_action
            }
        if taxonomy:
            return taxonomy
    except Exception:
        pass

    return {
        "Apple___Apple_scab": {
            "crop": "Apple",
            "disease": "Apple Scab",
            "status": "Diseased",
            "symptoms": "Olive-green to black velvet-like spots on leaves and fruit.",
            "organic_treatment": "Spray Neem oil (5ml/L) or Copper Fungicide (organic approved). Prune infected twigs and burn leaf litter.",
            "chemical_treatment": "Apply Captan 50 WP (2.5g/L) or Mancozeb 75 WP (2g/L) at pink bud stage.",
            "immediate_actions": "Collect and destroy fallen leaves. Ensure adequate tree canopy air circulation."
        }
    }

DISEASE_TAXONOMY = load_taxonomy_from_db()

DEFAULT_LOW_CONFIDENCE_SAFEGUARD = {
    "condition": "Uncertain Visual Diagnosis",
    "status": "Low Confidence Warning",
    "confidence_percentage": "Low (<60.0%)",
    "confidence_tier": "Low Confidence",
    "is_low_confidence": True,
    "warning": "Visual feature confidence is below the 60% threshold required for automated chemical pesticide recommendations.",
    "organic_treatment": "Apply Neem Oil emulsion (5ml/L water) or Trichoderma harzianum as a safe multi-spectrum organic protective barrier.",
    "chemical_treatment": "CHEMICAL TREATMENT WITHHELD FOR CROP SAFETY. Please consult a local Krishi Vigyan Kendra (KVK) officer before applying synthetic agrochemicals.",
    "immediate_actions": "Isolate affected leaf samples, photograph under clear natural daylight, and monitor leaf undersides for pests."
}
