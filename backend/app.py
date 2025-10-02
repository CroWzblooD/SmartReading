"""
Simple FastAPI Backend for Meter Reading with YOLOv9
Clean, minimal implementation focused on best.pt model inference
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import torch
import numpy as np
from PIL import Image
import io
import logging
from datetime import datetime
from typing import Dict, Any
import os
import sys

# Import our YOLOv9 detector
try:
    from yolo_inference import YOLOv9Detector
    YOLO_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ YOLOv9Detector not available: {e}")
    YOLO_AVAILABLE = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model instance
model = None

def load_yolo_model():
    """Load YOLOv9 model using our custom detector"""
    global model
    
    try:
        if not YOLO_AVAILABLE:
            logger.error("❌ YOLOv9Detector not available")
            return None
        
        logger.info("🚀 Loading YOLOv9 model with custom detector...")
        
        # Use our YOLOv9 detector
        detector = YOLOv9Detector(model_path="models/best.pt")
        
        if detector.model is not None:
            logger.info("✅ YOLOv9 model loaded successfully!")
            return detector
        else:
            logger.error("❌ Failed to load YOLOv9 model")
            return None
        
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        return None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize and cleanup the model"""
    global model
    logger.info("🚀 Starting Smart Meter Reading API...")
    model = load_yolo_model()
    yield
    logger.info("🔄 Shutting down API...")

# Initialize FastAPI app
app = FastAPI(
    title="Smart Meter Reading API",
    description="Simple YOLOv9-powered meter reading API",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Smart Meter Reading API is running!",
        "status": "healthy" if model is not None else "model_not_loaded",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy" if model is not None else "unhealthy",
        "model_status": "loaded" if model is not None else "not_loaded",
        "gpu_available": torch.cuda.is_available(),
        "device": "cuda" if torch.cuda.is_available() else "cpu",
        "timestamp": datetime.now().isoformat()
    }

# Removed old parse_yolo_results function - now using YOLOv9Detector's built-in parsing

@app.post("/detect-meter-reading")
async def detect_meter_reading(file: UploadFile = File(...)):
    """
    Main endpoint for meter reading detection
    Accepts an image file and returns detected meter reading
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Please check server logs.")
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image file.")
    
    try:
        logger.info(f"📸 Processing meter image: {file.filename}")
        
        # Read and process image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array
        image_np = np.array(image)
        
        # Run YOLOv9 inference using our detector
        try:
            detections = model.detect(image)
            parsed_result = model.parse_meter_reading(detections)
        except Exception as e:
            logger.error(f"Inference failed: {e}")
            raise HTTPException(status_code=500, detail=f"Model inference failed: {str(e)}")
        
        # Prepare response
        response = {
            "success": True,
            "timestamp": datetime.now().isoformat(),
            "filename": file.filename,
            "detected_reading": parsed_result["reading"],
            "confidence": parsed_result["confidence"],
            "analysis": {
                "total_detections": parsed_result.get("detections", 0),
                "reliability": "high" if parsed_result["confidence"] > 0.8 else "medium" if parsed_result["confidence"] > 0.5 else "low"
            },
            "raw_detections": {
                "digits": parsed_result.get("detections", 0),
                "total": parsed_result.get("total_objects", 0),
                "sequence": parsed_result.get("digit_sequence", []),
                "all_objects": parsed_result.get("all_detections", [])
            },
            "metadata": {
                "image_size": f"{image.width}x{image.height}",
                "model": "YOLOv9 best.pt"
            }
        }
        
        if parsed_result.get("error"):
            response["error"] = parsed_result["error"]
        
        logger.info(f"✅ Detection completed: {parsed_result['reading']} (confidence: {parsed_result['confidence']:.2f})")
        
        return JSONResponse(content=response)
        
    except Exception as e:
        logger.error(f"❌ Detection failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

@app.get("/model-info")
async def get_model_info():
    """Get information about the loaded model"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Get class names from our detector
        classes = {i: name for i, name in enumerate(model.class_names)}
        
        return {
            "model_type": "YOLOv9",
            "model_file": "best.pt",
            "classes": classes,
            "device": str(model.device),
            "model_loaded": True,
            "image_size": model.img_size,
            "confidence_threshold": model.conf_thresh,
            "total_classes": len(model.class_names)
        }
    except Exception as e:
        return {
            "model_type": "YOLOv9",
            "model_file": "best.pt",
            "classes": "Unable to retrieve",
            "device": "cpu",
            "model_loaded": True,
            "error": str(e)
        }

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
