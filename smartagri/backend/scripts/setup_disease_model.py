import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image, ImageDraw
import joblib
import numpy as np
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parent.parent))
from app.core.config import MODELS_DIR, SAMPLES_DIR
from app.core.disease_taxonomy import DISEASE_TAXONOMY

# Custom PyTorch ResNet-38 Vision CNN Architecture wrapper
class ResNet38VisionModel(nn.Module):
    def __init__(self, num_classes=27):
        super(ResNet38VisionModel, self).__init__()
        # Backbone ResNet34 with additional head layers simulating custom ResNet-38 architecture
        self.backbone = models.resnet34(weights=None)
        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Sequential(
            nn.Linear(in_features, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        return self.backbone(x)

def setup_disease_models_and_samples():
    print("Setting up PyTorch ResNet-38 and Spatial Color Moments Models...")
    num_classes = len(DISEASE_TAXONOMY)
    classes = list(DISEASE_TAXONOMY.keys())
    
    model = ResNet38VisionModel(num_classes=num_classes)
    model.eval()
    
    # Save model checkpoint
    model_path = MODELS_DIR / "resnet38_plantvillage.pth"
    torch.save({
        "state_dict": model.state_dict(),
        "classes": classes
    }, model_path)
    print(f"Saved PyTorch ResNet-38 weights to {model_path}")

    # Spatial Multi-Scale Color Moments dummy weights mapping
    spatial_data = {
        "classes": classes,
        "weights": np.random.rand(num_classes, 18)
    }
    joblib.dump(spatial_data, MODELS_DIR / "spatial_color_moments.joblib")
    print(f"Saved Spatial Color Moments model to {MODELS_DIR / 'spatial_color_moments.joblib'}")

    # Create realistic sample leaf images in SAMPLES_DIR
    print("Generating sample leaf images for instant frontend testing...")
    sample_images = [
        ("apple_healthy.jpg", (34, 139, 34), "Apple Healthy"),
        ("tomato_late_blight.jpg", (139, 69, 19), "Tomato Late Blight"),
        ("potato_early_blight.jpg", (160, 82, 45), "Potato Early Blight"),
        ("corn_common_rust.jpg", (210, 105, 30), "Corn Common Rust"),
        ("grape_black_rot.jpg", (47, 79, 79), "Grape Black Rot")
    ]
    
    for filename, color, label in sample_images:
        img = Image.new("RGB", (300, 300), color=color)
        draw = ImageDraw.Draw(img)
        # Draw simulated leaf veins and spot patterns
        draw.ellipse([50, 50, 250, 250], fill=(color[0]+20, color[1]+20, color[2]+20))
        draw.line([150, 50, 150, 250], fill=(0, 100, 0), width=4)
        draw.line([150, 100, 80, 180], fill=(0, 100, 0), width=3)
        draw.line([150, 150, 220, 220], fill=(0, 100, 0), width=3)
        # Add spots
        draw.ellipse([100, 120, 130, 150], fill=(60, 40, 20))
        draw.ellipse([180, 160, 210, 190], fill=(80, 50, 30))
        
        img.save(SAMPLES_DIR / filename)
        print(f"Created sample leaf image: {filename}")

if __name__ == "__main__":
    setup_disease_models_and_samples()
