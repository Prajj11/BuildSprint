import torch
import torch.nn as nn
from torchvision import models, transforms
import joblib
from PIL import Image
import io
import numpy as np
from app.core.config import MODELS_DIR

class ResNet38VisionModel(nn.Module):
    def __init__(self, num_classes=27):
        super(ResNet38VisionModel, self).__init__()
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

_pytorch_model = None
_classes = None
_spatial_model = None

def get_pytorch_model():
    global _pytorch_model, _classes
    if _pytorch_model is None:
        model_path = MODELS_DIR / "resnet38_plantvillage.pth"
        checkpoint = torch.load(model_path, map_location=torch.device('cpu'))
        _classes = checkpoint['classes']
        _pytorch_model = ResNet38VisionModel(num_classes=len(_classes))
        _pytorch_model.load_state_dict(checkpoint['state_dict'])
        _pytorch_model.eval()
    return _pytorch_model, _classes

def get_spatial_model():
    global _spatial_model
    if _spatial_model is None:
        _spatial_model = joblib.load(MODELS_DIR / "spatial_color_moments.joblib")
    return _spatial_model
