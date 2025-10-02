"""
Test script to debug model loading issues
"""

import torch
import os
import sys

def test_model_loading():
    """Test different ways to load the best.pt model"""
    
    model_path = "models/best.pt"
    
    print(f"🔍 Testing model loading from: {model_path}")
    print(f"📁 File exists: {os.path.exists(model_path)}")
    
    if os.path.exists(model_path):
        file_size = os.path.getsize(model_path) / (1024 * 1024)  # MB
        print(f"📊 File size: {file_size:.1f} MB")
    
    print(f"🔧 PyTorch version: {torch.__version__}")
    print(f"💻 CUDA available: {torch.cuda.is_available()}")
    print(f"🖥️  Device: {'cuda' if torch.cuda.is_available() else 'cpu'}")
    
    # Test 1: Direct torch load
    print(f"\n🧪 Test 1: Direct torch load")
    try:
        checkpoint = torch.load(model_path, map_location='cpu')
        print(f"✅ Loaded checkpoint")
        print(f"📋 Checkpoint keys: {list(checkpoint.keys())[:5]}...")
        
        if 'model' in checkpoint:
            model = checkpoint['model']
            print(f"✅ Extracted model from checkpoint")
            print(f"📋 Model type: {type(model)}")
        else:
            model = checkpoint
            print(f"✅ Using checkpoint as model")
        
        # Try to get model info
        if hasattr(model, 'names'):
            print(f"📝 Model classes: {model.names}")
        elif hasattr(model, 'model') and hasattr(model.model, 'names'):
            print(f"📝 Model classes: {model.model.names}")
        else:
            print(f"⚠️  No class names found")
            
        print(f"📋 Model attributes: {[attr for attr in dir(model) if not attr.startswith('_')][:10]}")
        
    except Exception as e:
        print(f"❌ Direct torch load failed: {e}")
    
    # Test 2: Try ultralytics
    print(f"\n🧪 Test 2: Ultralytics YOLO")
    try:
        from ultralytics import YOLO
        model = YOLO(model_path)
        print(f"✅ Loaded with Ultralytics")
        print(f"📝 Model classes: {model.names}")
    except Exception as e:
        print(f"❌ Ultralytics failed: {e}")
    
    # Test 3: Try torch.hub
    print(f"\n🧪 Test 3: torch.hub")
    try:
        model = torch.hub.load('ultralytics/yolov5', 'custom', path=model_path, trust_repo=True)
        print(f"✅ Loaded with torch.hub")
        if hasattr(model, 'names'):
            print(f"📝 Model classes: {model.names}")
    except Exception as e:
        print(f"❌ torch.hub failed: {e}")

if __name__ == "__main__":
    test_model_loading()
