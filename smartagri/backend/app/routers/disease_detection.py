from fastapi import APIRouter, HTTPException, File, UploadFile
from pathlib import Path
from app.services.disease_service import diagnose_leaf_image
from app.core.config import SAMPLES_DIR

router = APIRouter(prefix="/api/disease-detection", tags=["Disease Pathology"])

@router.post("/diagnose")
async def diagnose_uploaded_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        res = diagnose_leaf_image(contents, filename=file.filename)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/diagnose-sample")
async def diagnose_sample_image(filename: str = "apple_healthy.jpg"):
    sample_path = SAMPLES_DIR / filename
    if not sample_path.exists():
        raise HTTPException(status_code=404, detail=f"Sample image {filename} not found.")
    try:
        with open(sample_path, "rb") as f:
            contents = f.read()
        res = diagnose_leaf_image(contents, filename=filename)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/samples")
def list_sample_images():
    samples = []
    if SAMPLES_DIR.exists():
        for f in SAMPLES_DIR.glob("*.jpg"):
            samples.append({
                "filename": f.name,
                "url": f"/static/samples/{f.name}"
            })
    return {"samples": samples}
