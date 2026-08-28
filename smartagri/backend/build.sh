#!/usr/bin/env bash
# Render build script for SmartAgri AI Backend
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

python scripts/download_and_process_data.py
python scripts/seed_sqlite_db.py
python scripts/train_crop_recommendation.py
python scripts/train_yield_prediction.py
python scripts/setup_disease_model.py
