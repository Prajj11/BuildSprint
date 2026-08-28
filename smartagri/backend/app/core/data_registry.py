DATASETS_REGISTRY = {
    "crop_recommendation": {
        "title": "Soil & Climate Crop Recommendation Dataset",
        "records": 2200,
        "source": "ICAR & Kaggle Agronomic Telemetry",
        "features": ["N", "P", "K", "temperature", "humidity", "ph", "rainfall", "label"],
        "description": "2,200 soil and atmospheric measurement records covering 22 distinct Indian crop varieties."
    },
    "mandi_prices": {
        "title": "Agmarknet Mandi Daily Wholesale Market Prices",
        "records": 57330,
        "source": "Ministry of Agriculture & Farmers Welfare (Data.gov.in)",
        "features": ["commodity", "state", "district", "mandi", "min_price", "max_price", "modal_price", "arrival_date"],
        "description": "57,000+ state and district mandi price realizations across key agricultural commodities."
    },
    "yield_records": {
        "title": "State-Level Crop Yield & Agronomic Parameters",
        "records": 8550,
        "source": "DES (Directorate of Economics & Statistics)",
        "features": ["crop", "state", "season", "area_hectares", "production_tons", "rainfall_mm", "fertilizer_kg_ha"],
        "description": "Agronomic historical yield records across 8,550 harvest cycles."
    },
    "plantvillage_vision": {
        "title": "PlantVillage Multi-Crop Leaf Pathology Dataset",
        "records": 54305,
        "source": "Penn State University / PlantVillage",
        "features": ["image_bytes", "crop_species", "pathogen_label"],
        "description": "54,305 high-resolution leaf images covering 38 healthy and diseased plant classes."
    },
    "government_schemes": {
        "title": "Government Agricultural Schemes & Subsidies Registry",
        "records": 42,
        "source": "MyScheme GoI & Ministry of Agriculture",
        "features": ["scheme_name", "category", "beneficiary_type", "max_land_acres", "benefits_summary", "portal_url", "eligible_states"],
        "description": "Central and State government financial assistance schemes, credit cards, and subsidies."
    },
    "imd_rainfall_baselines": {
        "title": "IMD Subdivision Monsoon Rainfall Baselines",
        "records": 168,
        "source": "India Meteorological Department (IMD)",
        "features": ["subdivision", "state", "normal_monsoon_mm", "actual_monsoon_mm", "departure_pct"],
        "description": "Historical 30-year normal rainfall departures across 36 meteorological subdivisions."
    },
    "icar_advisories": {
        "title": "ICAR District Weather-Crop Advisory Bulletin",
        "records": 30,
        "source": "Indian Council of Agricultural Research (ICAR)",
        "features": ["crop", "growth_stage", "advisory_text", "recommended_practice", "institute"],
        "description": "Expert agronomic advisories from ICAR-CRRI, ICAR-CICR, ICAR-IIWBR, and CRIDA."
    },
    "district_crop_stats": {
        "title": "District Agricultural Statistics & Area Coverage",
        "records": 1665,
        "source": "Government of India Agricultural Census",
        "features": ["state", "district", "crop", "gross_cropped_area_ha", "irrigated_pct"],
        "description": "District-wise land allocation, irrigation coverage, and crop suitability statistics."
    },
    "soil_health_card_baselines": {
        "title": "National Soil Health Card District Benchmarks",
        "records": 720,
        "source": "Soil Health Card Scheme (GoI)",
        "features": ["district", "avg_N", "avg_P", "avg_K", "avg_pH", "soil_type"],
        "description": "District-level soil macro-nutrient and pH reference baselines."
    },
    "pest_disease_vector_tracker": {
        "title": "Seasonal Crop Pest & Disease Spore Tracker",
        "records": 1240,
        "source": "National Centre for Integrated Pest Management (NCIPM)",
        "features": ["crop", "pest_name", "min_temp", "max_temp", "min_humidity", "risk_index"],
        "description": "Micro-climate thresholds triggering disease and fungal spore outbreaks."
    },
    "fertilizer_response_curves": {
        "title": "Crop Nutrient Optimization & Response Curves",
        "records": 540,
        "source": "ICAR Indian Institute of Soil Science",
        "features": ["crop", "optimal_N", "optimal_P", "optimal_K", "yield_response_factor"],
        "description": "NPK dosage curves for target yield realization."
    },
    "water_requirement_index": {
        "title": "FAO-56 Crop Evapotranspiration (Kc) Index",
        "records": 380,
        "source": "FAO Irrigation and Drainage Paper 56",
        "features": ["crop", "growth_stage", "kc_factor", "total_water_mm"],
        "description": "Stage-wise crop water consumption coefficients."
    },
    "mandi_distance_matrix": {
        "title": "Inter-District Mandi Transportation Distance Matrix",
        "records": 2500,
        "source": "NHAI & National Logistics Portal",
        "features": ["origin_district", "mandi_name", "distance_km", "avg_freight_cost_per_ton"],
        "description": "Logistics cost matrix to rank highest net profit realization mandis."
    },
    "organic_remedies_catalogue": {
        "title": "Certified Bio-Pesticides & Botanical Extracts Index",
        "records": 150,
        "source": "National Centre of Organic Farming (NCOF)",
        "features": ["target_pathogen", "bio_agent", "preparation_method", "dosage_per_liter"],
        "description": "Organic, eco-friendly crop protection practices."
    },
    "chemical_fungicide_safety_guide": {
        "title": "CGB / CWA Agrochemical Safety & Dilution Standards",
        "records": 210,
        "source": "Central Insecticides Board & Registration Committee (CIBRC)",
        "features": ["active_ingredient", "trade_name", "target_disease", "dosage_g_l", "PHI_days"],
        "description": "Pre-harvest interval (PHI) and safe agrochemical application standards."
    },
    "climate_change_scenarios": {
        "title": "IPCC Representative Concentration Pathways (RCP 4.5/8.5)",
        "records": 120,
        "source": "IITM Pune Climate Change Cell",
        "features": ["region", "rcp_scenario", "temp_anomaly_c", "monsoon_variation_pct"],
        "description": "Regional climate anomaly projections for interactive stress testing."
    },
    "krishi_vigyan_kendram_network": {
        "title": "National KVK Agricultural Extension Officers Directory",
        "records": 731,
        "source": "Indian Council of Agricultural Research",
        "features": ["kvk_name", "district", "state", "helpline_number", "expert_email"],
        "description": "731 district agricultural extension officer support centers."
    },
    "crop_growing_calendar": {
        "title": "Agro-Climatic Zone Sowing & Harvest Calendar",
        "records": 480,
        "source": "Ministry of Agriculture Agro-Climatic Atlas",
        "features": ["agro_zone", "crop", "sowing_window", "harvest_window", "crop_duration_days"],
        "description": "Phenological calendars for 15 agro-climatic zones of India."
    }
}
