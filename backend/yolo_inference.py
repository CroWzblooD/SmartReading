"""
YOLOv9 Inference using original repository approach
Compatible with the trained best.pt model
"""

import sys
import os
import torch
import numpy as np
from PIL import Image
import cv2

# Add YOLOv9 repository to path
yolo_path = os.path.join(os.path.dirname(__file__), 'yolov9_repo')
sys.path.insert(0, yolo_path)

try:
    # Import YOLOv9 modules
    from models.experimental import attempt_load
    from utils.general import check_img_size, non_max_suppression, scale_boxes
    from utils.torch_utils import select_device
    from utils.augmentations import letterbox
    YOLO_IMPORTS_OK = True
except ImportError as e:
    print(f"❌ Failed to import YOLOv9 modules: {e}")
    print("Make sure yolov9_repo is properly cloned")
    YOLO_IMPORTS_OK = False

class YOLOv9Detector:
    """YOLOv9 detector using original repository"""
    
    def __init__(self, model_path="models/best.pt", conf_thresh=0.1):
        """Initialize the detector"""
        if not YOLO_IMPORTS_OK:
            self.model = None
            return
            
        self.model_path = model_path
        self.conf_thresh = conf_thresh
        self.device = select_device('cpu')  # Force CPU for compatibility
        self.model = None
        self.img_size = 640
        self.class_names = ['dot', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Kwh']
        
        self.load_model()
    
    def load_model(self):
        """Load the YOLOv9 model"""
        try:
            print(f"🚀 Loading YOLOv9 model from {self.model_path}")
            
            # Load model using original YOLOv9 approach
            self.model = attempt_load(self.model_path, device=self.device)
            self.model.eval()
            
            # Get image size
            self.img_size = check_img_size(self.img_size, s=self.model.stride.max())
            
            print(f"✅ Model loaded successfully!")
            print(f"📊 Device: {self.device}")
            print(f"📏 Image size: {self.img_size}")
            
            return True
            
        except Exception as e:
            print(f"❌ Failed to load model: {e}")
            self.model = None
            return False
    
    def preprocess_image(self, image):
        """Preprocess image for YOLOv9 with mobile photo optimization"""
        try:
            # Convert PIL to numpy if needed
            if isinstance(image, Image.Image):
                image = np.array(image)
            
            # Ensure RGB format
            if len(image.shape) == 3 and image.shape[2] == 3:
                # For mobile photos, keep RGB format first
                image_rgb = image.copy()
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            else:
                image_rgb = image
            
            print(f"📏 Original image shape: {image.shape}")
            
            # Letterbox resize with padding
            img = letterbox(image, new_shape=self.img_size, auto=False, scaleup=True)[0]
            
            print(f"📏 Letterboxed image shape: {img.shape}")
            
            # Convert back to RGB and normalize
            img = img[:, :, ::-1].transpose(2, 0, 1)  # BGR to RGB, HWC to CHW
            img = np.ascontiguousarray(img)
            img = torch.from_numpy(img).to(self.device)
            img = img.float() / 255.0  # Normalize to 0-1
            
            if img.ndimension() == 3:
                img = img.unsqueeze(0)
            
            print(f"📏 Final tensor shape: {img.shape}")
            
            return img, image_rgb
            
        except Exception as e:
            print(f"❌ Preprocessing failed: {e}")
            return None, None
    
    def detect(self, image):
        """Run detection on image"""
        if self.model is None:
            return []
        
        try:
            # Preprocess
            img_tensor, original_img = self.preprocess_image(image)
            if img_tensor is None:
                return []
            
            # Run inference
            print(f"🔄 Running inference on tensor shape: {img_tensor.shape}")
            with torch.no_grad():
                pred = self.model(img_tensor)[0]
            
            print(f"📊 Raw predictions shape: {pred.shape}")
            print(f"📊 Predictions above 0.1 confidence: {(pred[:, :, 4] > 0.1).sum()}")
            print(f"📊 Predictions above 0.05 confidence: {(pred[:, :, 4] > 0.05).sum()}")
            
            # Apply NMS with lower confidence threshold
            pred = non_max_suppression(pred, self.conf_thresh, 0.45)
            
            detections = []
            
            # Process predictions
            for i, det in enumerate(pred):
                print(f"📋 Detection batch {i}: {len(det)} detections")
                if len(det):
                    # Rescale boxes from img_size to original image size
                    det[:, :4] = scale_boxes(img_tensor.shape[2:], det[:, :4], original_img.shape).round()
                    
                    # Extract detections
                    for *xyxy, conf, cls in det:
                        x1, y1, x2, y2 = [int(x) for x in xyxy]
                        confidence = float(conf)
                        class_id = int(cls)
                        
                        # Get class name
                        class_name = self.class_names[class_id] if class_id < len(self.class_names) else f"class_{class_id}"
                        
                        # Calculate center coordinates (normalized)
                        img_h, img_w = original_img.shape[:2]
                        center_x = (x1 + x2) / 2 / img_w
                        center_y = (y1 + y2) / 2 / img_h
                        
                        print(f"✅ Detected: {class_name} (conf: {confidence:.3f}) at ({center_x:.3f}, {center_y:.3f})")
                        
                        detections.append({
                            'class': class_name,
                            'class_id': class_id,
                            'confidence': confidence,
                            'bbox': [x1, y1, x2, y2],
                            'center': [center_x, center_y],
                            'center_x': center_x,
                            'center_y': center_y
                        })
            
            print(f"🔍 Found {len(detections)} total detections")
            return detections
            
        except Exception as e:
            print(f"❌ Detection failed: {e}")
            return []
    
    def parse_meter_reading(self, detections):
        """Parse detections into meter reading"""
        try:
            if not detections:
                return {
                    "reading": None,
                    "confidence": 0.0,
                    "detections": 0,
                    "error": "No detections found"
                }
            
            # Filter for digits only (higher confidence threshold for better accuracy)
            digits = [d for d in detections if d['class'] in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] and d['confidence'] > 0.2]
            dots = [d for d in detections if d['class'] == 'dot' and d['confidence'] > 0.1]
            
            print(f"🔍 High-confidence digits found: {len(digits)}")
            print(f"🔍 Dots found: {len(dots)}")
            
            if not digits:
                all_classes = [d['class'] for d in detections]
                return {
                    "reading": None,
                    "confidence": 0.0,
                    "detections": len(detections),
                    "error": "No high-confidence digit detections found",
                    "raw_detections": all_classes
                }
            
            # Sort digits by horizontal position (left to right)
            digits_sorted = sorted(digits, key=lambda x: x['center_x'])
            
            # Remove duplicate digits at similar positions (common error)
            filtered_digits = []
            for i, digit in enumerate(digits_sorted):
                if i == 0:
                    filtered_digits.append(digit)
                else:
                    # Check if this digit is too close to the previous one
                    prev_digit = filtered_digits[-1]
                    x_distance = abs(digit['center_x'] - prev_digit['center_x'])
                    
                    # If digits are very close, keep the one with higher confidence
                    if x_distance < 0.05:  # 5% of image width
                        if digit['confidence'] > prev_digit['confidence']:
                            filtered_digits[-1] = digit  # Replace with higher confidence
                        # else: skip this digit
                    else:
                        filtered_digits.append(digit)
            
            print(f"🔍 After filtering duplicates: {len(filtered_digits)} digits")
            
            # Build reading
            reading_digits = [d['class'] for d in filtered_digits]
            reading = ''.join(reading_digits)
            
            # Calculate weighted confidence (give more weight to higher confidence digits)
            confidences = [d['confidence'] for d in filtered_digits]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0
            
            print(f"📊 Reading digits: {reading_digits}")
            print(f"📊 Raw reading: {reading}")
            
            # Smart decimal point placement
            decimal_pos = None
            
            # Method 1: Use detected dot position if available
            if dots:
                dot = max(dots, key=lambda x: x['confidence'])  # Use highest confidence dot
                dot_x = dot['center_x']
                
                # Find where to insert decimal based on dot position
                for i in range(len(filtered_digits)):
                    if i < len(filtered_digits) - 1:
                        curr_x = filtered_digits[i]['center_x']
                        next_x = filtered_digits[i + 1]['center_x']
                        
                        if curr_x < dot_x < next_x:
                            decimal_pos = i + 1
                            break
                
                print(f"🎯 Decimal position from dot: {decimal_pos}")
            
            # Method 2: Standard meter reading format (fallback)
            if decimal_pos is None:
                if len(reading) >= 5:
                    decimal_pos = len(reading) - 2  # XX.XX format
                elif len(reading) >= 3:
                    decimal_pos = len(reading) - 2  # X.XX format
                else:
                    decimal_pos = len(reading) - 1  # .X format
            
            # Insert decimal point
            if decimal_pos and 0 < decimal_pos < len(reading):
                reading = reading[:decimal_pos] + '.' + reading[decimal_pos:]
            
            print(f"✅ Final reading: {reading}")
            
            # Add kWh unit
            reading_with_unit = f"{reading} kWh"
            
            return {
                "reading": reading_with_unit,
                "confidence": float(avg_confidence),
                "detections": len(filtered_digits),
                "total_objects": len(detections),
                "digit_sequence": reading_digits,
                "all_detections": [d['class'] for d in detections],
                "decimal_method": "dot_detected" if dots else "heuristic",
                "filtered_count": len(filtered_digits),
                "original_count": len(digits_sorted) if 'digits_sorted' in locals() else len(digits)
            }
            
        except Exception as e:
            print(f"❌ Parsing failed: {e}")
            return {
                "reading": None,
                "confidence": 0.0,
                "detections": 0,
                "error": f"Parsing error: {str(e)}"
            }

# Test the detector
if __name__ == "__main__":
    detector = YOLOv9Detector()
    if detector.model:
        print("✅ YOLOv9 detector ready!")
    else:
        print("❌ Failed to initialize detector")
