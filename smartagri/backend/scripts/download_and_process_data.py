import csv
import json
import sqlite3
import random
import numpy as np
import pandas as pd
from pathlib import Path
import sys

# Add app to sys.path
sys.path.append(str(Path(__file__).resolve().parent.parent))
from app.core.config import RAW_DATA_DIR, PROCESSED_DATA_DIR, SAMPLES_DIR, MODELS_DIR

def generate_raw_datasets():
    print("Generating raw CSV datasets...")
    
    # 1. crop_recommendation.csv (2200 records)
    crops = [
        "rice", "maize", "chickpea", "kidneybeans", "pigeonpeas", "mothbeans",
        "mungbean", "blackgram", "lentil", "pomegranate", "banana", "mango",
        "grapes", "watermelon", "muskmelon", "apple", "orange", "papaya",
        "coconut", "cotton", "jute", "coffee"
    ]
    
    crop_profiles = {
        "rice": (80, 120, 35, 60, 35, 45, 20, 27, 80, 90, 6.0, 7.0, 180, 300),
        "maize": (60, 100, 35, 60, 15, 30, 18, 27, 55, 75, 5.5, 7.0, 60, 110),
        "chickpea": (35, 55, 55, 75, 65, 85, 17, 24, 14, 20, 6.0, 7.5, 65, 90),
        "kidneybeans": (15, 35, 55, 75, 15, 30, 15, 24, 18, 25, 5.5, 6.5, 60, 150),
        "pigeonpeas": (15, 35, 55, 75, 15, 30, 24, 38, 40, 65, 5.5, 7.0, 90, 210),
        "mothbeans": (15, 35, 35, 60, 15, 30, 24, 32, 40, 65, 3.5, 10.0, 30, 75),
        "mungbean": (15, 35, 35, 60, 15, 30, 27, 30, 80, 90, 6.2, 7.2, 35, 60),
        "blackgram": (35, 55, 55, 75, 15, 30, 25, 35, 60, 75, 6.5, 7.5, 60, 75),
        "lentil": (15, 35, 55, 75, 15, 30, 18, 30, 60, 70, 5.9, 6.9, 35, 55),
        "pomegranate": (15, 35, 15, 30, 35, 45, 18, 25, 85, 95, 5.5, 7.2, 35, 65),
        "banana": (90, 120, 70, 95, 45, 55, 25, 30, 75, 85, 5.5, 6.5, 90, 120),
        "mango": (15, 35, 15, 30, 25, 35, 27, 35, 45, 55, 4.5, 7.0, 85, 100),
        "grapes": (15, 35, 120, 145, 195, 205, 8, 42, 80, 90, 5.5, 6.5, 65, 75),
        "watermelon": (80, 120, 5, 30, 45, 55, 24, 27, 80, 90, 6.0, 7.0, 40, 60),
        "muskmelon": (80, 120, 5, 30, 45, 55, 27, 30, 90, 95, 6.0, 6.7, 20, 30),
        "apple": (15, 35, 120, 145, 195, 205, 21, 24, 90, 95, 5.5, 6.5, 100, 125),
        "orange": (15, 35, 5, 30, 5, 15, 10, 35, 90, 95, 6.0, 8.0, 100, 120),
        "papaya": (35, 75, 45, 70, 45, 55, 23, 44, 90, 95, 6.5, 7.0, 40, 250),
        "coconut": (15, 35, 5, 30, 5, 15, 25, 28, 90, 99, 5.5, 6.5, 130, 225),
        "cotton": (110, 140, 35, 60, 15, 25, 22, 26, 75, 85, 5.8, 8.0, 60, 90),
        "jute": (60, 90, 35, 50, 35, 45, 23, 26, 75, 85, 6.0, 7.4, 150, 200),
        "coffee": (80, 115, 15, 35, 25, 35, 23, 28, 50, 70, 6.0, 7.0, 115, 190)
    }
    
    crop_rows = []
    np.random.seed(42)
    for crop in crops:
        p = crop_profiles[crop]
        for _ in range(100):
            n = float(np.clip(np.random.normal((p[0]+p[1])/2, (p[1]-p[0])/6), 0, 140))
            pos = float(np.clip(np.random.normal((p[2]+p[3])/2, (p[3]-p[2])/6), 5, 145))
            k = float(np.clip(np.random.normal((p[4]+p[5])/2, (p[5]-p[4])/6), 5, 205))
            temp = float(np.clip(np.random.normal((p[6]+p[7])/2, (p[7]-p[6])/6), 8, 45))
            hum = float(np.clip(np.random.normal((p[8]+p[9])/2, (p[9]-p[8])/6), 14, 100))
            ph = float(np.clip(np.random.normal((p[10]+p[11])/2, (p[11]-p[10])/6), 3.5, 10.0))
            rain = float(np.clip(np.random.normal((p[12]+p[13])/2, (p[13]-p[12])/6), 20, 300))
            crop_rows.append([round(n, 1), round(pos, 1), round(k, 1), round(temp, 2), round(hum, 2), round(ph, 2), round(rain, 2), crop])
            
    df_crop = pd.DataFrame(crop_rows, columns=["N", "P", "K", "temperature", "humidity", "ph", "rainfall", "label"])
    df_crop.to_csv(RAW_DATA_DIR / "crop_recommendation.csv", index=False)
    print(f"Saved crop_recommendation.csv ({len(df_crop)} rows)")

    # 2. mandi_prices.csv (57330 records)
    states = ["Maharashtra", "Punjab", "Uttar Pradesh", "Madhya Pradesh", "Karnataka", "Gujarat", "Haryana", "Rajasthan", "Goa", "Tamil Nadu"]
    districts_map = {
        "Maharashtra": ["Nashik", "Pune", "Nagpur", "Ahmednagar", "Solapur"],
        "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bhatinda"],
        "Uttar Pradesh": ["Agra", "Varanasi", "Kanpur", "Lucknow", "Mathura"],
        "Madhya Pradesh": ["Indore", "Ujjain", "Bhopal", "Gwalior", "Jabalpur"],
        "Karnataka": ["Bangalore", "Mysore", "Belgaum", "Hubli", "Shimoga"],
        "Gujarat": ["Ahmedabad", "Rajkot", "Surat", "Vadodara", "Junagadh"],
        "Haryana": ["Karnal", "Hisar", "Ambala", "Rohtak", "Sonipat"],
        "Rajasthan": ["Jaipur", "Kota", "Udaipur", "Jodhpur", "Bikaner"],
        "Goa": ["North Goa", "South Goa", "Ponda", "Verna", "Mapusa"],
        "Tamil Nadu": ["Coimbatore", "Madurai", "Salem", "Trichy", "Tirupur"]
    }
    commodities = ["Rice", "Maize", "Wheat", "Cotton", "Potato", "Tomato", "Apple", "Grapes", "Onion", "Soybean"]
    
    base_prices = {
        "Rice": 2800, "Maize": 2100, "Wheat": 2400, "Cotton": 6200, "Potato": 1400,
        "Tomato": 2200, "Apple": 7500, "Grapes": 5500, "Onion": 1800, "Soybean": 4600
    }
    
    mandi_rows = []
    dates = [f"2026-08-{d:02d}" for d in range(1, 29)]
    
    total_records = 57330
    np.random.seed(42)
    
    records_per_iter = total_records // (len(commodities) * len(states))
    count = 0
    for st in states:
        dists = districts_map[st]
        for comm in commodities:
            bp = base_prices[comm]
            for i in range(records_per_iter):
                dist = dists[i % len(dists)]
                mandi_name = f"{dist} APMC Mandi"
                dt = dates[i % len(dates)]
                var = np.random.normal(0, bp * 0.08)
                modal = int(np.clip(bp + var, bp * 0.6, bp * 1.5))
                min_p = int(modal * np.random.uniform(0.85, 0.95))
                max_p = int(modal * np.random.uniform(1.05, 1.20))
                mandi_rows.append([comm, st, dist, mandi_name, min_p, max_p, modal, dt])
                count += 1
                
    # fill remaining to exact 57330
    while count < total_records:
        st = random.choice(states)
        dist = random.choice(districts_map[st])
        comm = random.choice(commodities)
        bp = base_prices[comm]
        dt = random.choice(dates)
        modal = int(bp + random.uniform(-200, 200))
        min_p = int(modal * 0.9)
        max_p = int(modal * 1.1)
        mandi_rows.append([comm, st, dist, f"{dist} Main APMC", min_p, max_p, modal, dt])
        count += 1
        
    df_mandi = pd.DataFrame(mandi_rows, columns=["commodity", "state", "district", "mandi", "min_price", "max_price", "modal_price", "arrival_date"])
    df_mandi.to_csv(RAW_DATA_DIR / "mandi_prices.csv", index=False)
    print(f"Saved mandi_prices.csv ({len(df_mandi)} rows)")

    # 3. yield_records.csv (8550 records)
    yield_rows = []
    seasons = ["Kharif", "Rabi", "Zaid", "Whole Year"]
    yield_base = {
        "Rice": (3.5, 120, 1000), "Maize": (4.2, 110, 700), "Wheat": (4.0, 130, 500),
        "Cotton": (2.2, 90, 800), "Potato": (18.0, 150, 600), "Tomato": (22.0, 160, 750),
        "Apple": (12.0, 100, 900), "Grapes": (15.0, 140, 650), "Chickpea": (1.8, 50, 450),
        "Banana": (35.0, 200, 1200)
    }
    
    np.random.seed(42)
    for _ in range(8550):
        st = random.choice(states)
        crop = random.choice(list(yield_base.keys()))
        season = random.choice(seasons)
        base_y, base_f, base_r = yield_base[crop]
        
        area_ha = round(random.uniform(0.5, 50.0), 2)
        fert = round(np.clip(np.random.normal(base_f, 25), 20, 300), 1)
        rain = round(np.clip(np.random.normal(base_r, 150), 200, 2500), 1)
        
        # Yield formula with realistic noise
        y_per_ha = base_y * (1 + 0.002 * (fert - base_f) + 0.0003 * (rain - base_r))
        y_per_ha = max(0.5, y_per_ha + np.random.normal(0, base_y * 0.15))
        prod_tons = round(y_per_ha * area_ha, 2)
        
        yield_rows.append([crop, st, season, area_ha, prod_tons, rain, fert])
        
    df_yield = pd.DataFrame(yield_rows, columns=["crop", "state", "season", "area_hectares", "production_tons", "rainfall_mm", "fertilizer_kg_ha"])
    df_yield.to_csv(RAW_DATA_DIR / "yield_records.csv", index=False)
    print(f"Saved yield_records.csv ({len(df_yield)} rows)")

    # 4. government_schemes.csv (42 records)
    schemes = [
        ("PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)", "Direct Benefit Transfer", "All Farmers", 100, "Direct income support of ₹6,000 per year in three equal installments of ₹2,000.", "https://pmkisan.gov.in", "All States"),
        ("Pradhan Mantri Fasal Bima Yojana (PMFBY)", "Crop Insurance", "Tenant & Landowner Farmers", 50, "Comprehensive crop insurance cover against yield losses due to non-preventable natural risks.", "https://pmfby.gov.in", "All States"),
        ("Kisan Credit Card (KCC) Scheme", "Credit & Subsidy", "Small & Marginal Farmers", 100, "Concessional institutional credit at 4% effective interest rate with prompt repayment incentive.", "https://myscheme.gov.in/schemes/kcc", "All States"),
        ("Paramparagat Krishi Vikas Yojana (PKVY)", "Organic Farming", "Organic Farmer Clusters", 20, "Financial assistance of ₹50,000 per hectare for organic inputs, certification, and marketing.", "https://dacfms.nic.in", "All States"),
        ("Sub-Mission on Agricultural Mechanization (SMAM)", "Equipment Subsidy", "Individual & Custom Hiring Centers", 100, "40% to 80% subsidy on purchase of tractors, rotavators, harvesters, and drones.", "https://agrimachinery.nic.in", "All States"),
        ("Soil Health Card Scheme", "Soil Testing & Advisory", "All Farmers", 100, "Free soil nutrient status analysis and customized fertilizer recommendations every 2 years.", "https://soilhealth.dac.gov.in", "All States"),
        ("Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)", "Micro Irrigation", "All Farmers", 100, "Up to 55% subsidy on drip and sprinkler irrigation installations for water conservation.", "https://pmksy.gov.in", "All States"),
        ("National Horticulture Mission (NHM)", "Horticulture Development", "Fruit & Vegetable Growers", 25, "Subsidy for orchard establishment, greenhouse polyhouses, and cold storage units.", "https://midh.gov.in", "All States"),
        ("Mission Organic Value Chain Development for NE Region", "Organic Farming", "NE Region Farmers", 50, "End-to-end support for organic value chain creation in North Eastern states.", "https://movcd.dac.gov.in", "Assam, Meghalaya, Sikkim, Nagaland, Manipur, Mizoram, Tripura, Arunachal Pradesh"),
        ("Agri Infrastructure Fund (AIF)", "Infrastructure Credit", "Agri-Entrepreneurs & FPOs", 100, "3% interest subvention on loans up to ₹2 Crore for post-harvest management infrastructure.", "https://agriinfra.dac.gov.in", "All States"),
        ("RKVY-RAFTAAR", "Agri-Business Incubation", "Startups & Agri Innovators", 100, "Grant-in-aid up to ₹25 Lakhs for agri-startups and innovative farming technologies.", "https://rkvy.nic.in", "All States"),
        ("PM-KUSUM Solar Pump Scheme", "Solar Energy", "Individual Farmers & Water User Associations", 10, "Up to 60% subsidy for setting up standalone solar agriculture pumps.", "https://pmkusum.mnre.gov.in", "All States")
    ]
    # replicate to 42 records
    full_schemes = []
    for i in range(42):
        base = schemes[i % len(schemes)]
        if i >= len(schemes):
            s_name = f"{base[0]} Phase {i//len(schemes) + 1}"
        else:
            s_name = base[0]
        full_schemes.append([s_name, base[1], base[2], base[3], base[4], base[5], base[6]])
        
    df_schemes = pd.DataFrame(full_schemes, columns=["scheme_name", "category", "beneficiary_type", "max_land_acres", "benefits_summary", "portal_url", "eligible_states"])
    df_schemes.to_csv(RAW_DATA_DIR / "government_schemes.csv", index=False)
    print(f"Saved government_schemes.csv ({len(df_schemes)} rows)")

    # 5. imd_rainfall_baselines.csv (168 records)
    subdivisions = [
        ("Subdivision 1", "Maharashtra", 950.0, 1020.0, 7.37),
        ("Subdivision 2", "Punjab", 550.0, 490.0, -10.9),
        ("Subdivision 3", "Uttar Pradesh", 850.0, 810.0, -4.7),
        ("Subdivision 4", "Madhya Pradesh", 1050.0, 1180.0, 12.38),
        ("Subdivision 5", "Karnataka", 1200.0, 1150.0, -4.16),
        ("Subdivision 6", "Goa", 2900.0, 3150.0, 8.62),
        ("Subdivision 7", "Tamil Nadu", 910.0, 940.0, 3.3),
        ("Subdivision 8", "Gujarat", 750.0, 820.0, 9.33)
    ]
    imd_rows = []
    for i in range(168):
        base = subdivisions[i % len(subdivisions)]
        sub_name = f"{base[1]} Zone-{i//len(subdivisions) + 1}"
        imd_rows.append([sub_name, base[1], base[2], base[3], base[4]])
    df_imd = pd.DataFrame(imd_rows, columns=["subdivision", "state", "normal_monsoon_mm", "actual_monsoon_mm", "departure_pct"])
    df_imd.to_csv(RAW_DATA_DIR / "imd_rainfall_baselines.csv", index=False)
    print(f"Saved imd_rainfall_baselines.csv ({len(df_imd)} rows)")

    # 6. icar_advisories.csv (30 records)
    icar_advisories = [
        ("Rice", "Tillering Stage", "Maintain 2-5cm standing water in rice fields. Monitor for Stem Borer infestation.", "Apply Cartap Hydrochloride 4G @ 10kg/acre if dead hearts exceed 5%.", "ICAR-CRRI Cuttack"),
        ("Cotton", "Boll Formation", "Avoid nitrogenous fertilizer excess. Monitor for pink bollworm larval entry.", "Install Pheromone traps @ 5 traps/acre for adult monitoring.", "ICAR-CICR Nagpur"),
        ("Wheat", "CRI Stage", "First irrigation at Crown Root Initiation (20-25 days after sowing) is crucial.", "Apply top dressing of Urea (45kg/acre) after first irrigation.", "ICAR-IIWBR Karnal"),
        ("Maize", "Knee-High Stage", "Watch out for Fall Armyworm (FAW) whorl damage.", "Whorl application of Neem cake or Emamectin Benzoate 5% SG @ 0.4g/L.", "ICAR-IIMR Ludhiana"),
        ("Potato", "Tuberization", "High relative humidity (>85%) and temperature between 10-20°C favors Late Blight.", "Prophylactic spray of Mancozeb 75 WP @ 2g/L.", "ICAR-CPRI Shimla"),
        ("Tomato", "Flowering & Fruiting", "Stake tomato vines to prevent soil-borne fungal pathogens.", "Foliar spray of 1% Potassium Nitrate to boost fruit setting.", "ICAR-IIHR Bengaluru")
    ]
    icar_rows = []
    for i in range(30):
        base = icar_advisories[i % len(icar_advisories)]
        icar_rows.append([base[0], base[1], base[2], base[3], base[4]])
    df_icar = pd.DataFrame(icar_rows, columns=["crop", "growth_stage", "advisory_text", "recommended_practice", "institute"])
    df_icar.to_csv(RAW_DATA_DIR / "icar_advisories.csv", index=False)
    print(f"Saved icar_advisories.csv ({len(df_icar)} rows)")

    # 7. district_crop_stats.csv (1665 records)
    district_rows = []
    for i in range(1665):
        st = states[i % len(states)]
        dist = districts_map[st][i % len(districts_map[st])]
        crop = commodities[i % len(commodities)]
        area = round(random.uniform(1000, 50000), 2)
        irrigated = round(random.uniform(30.0, 95.0), 1)
        district_rows.append([st, dist, crop, area, irrigated])
    df_dist = pd.DataFrame(district_rows, columns=["state", "district", "crop", "gross_cropped_area_ha", "irrigated_pct"])
    df_dist.to_csv(RAW_DATA_DIR / "district_crop_stats.csv", index=False)
    print(f"Saved district_crop_stats.csv ({len(df_dist)} rows)")

if __name__ == "__main__":
    generate_raw_datasets()
