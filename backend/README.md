# Smart Meter Reading Backend

Simple FastAPI backend for meter reading using YOLOv9 best.pt model.

## Quick Start

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Make sure your trained model exists:**
   - Place your `best.pt` file in `models/best.pt`

3. **Start the server:**
   ```bash
   python start_server.py
   ```
   Or:
   ```bash
   python app.py
   ```

4. **Test the API:**
   - Health check: http://localhost:8000/health
   - API documentation: http://localhost:8000/docs
   - Upload image to: http://localhost:8000/detect-meter-reading

## API Endpoints

- `GET /` - Basic health check
- `GET /health` - Detailed health check with GPU info
- `POST /detect-meter-reading` - Main endpoint for meter reading detection
- `GET /model-info` - Information about the loaded model

## Response Format

```json
{
    "success": true,
    "detected_reading": "12345.67",
    "confidence": 0.89,
    "analysis": {
        "reliability": "high"
    },
    "raw_detections": {
        "digits": 8,
        "sequence": ["1", "2", "3", "4", "5", "6", "7"]
    }
}
```

## Requirements

- Python 3.8+
- FastAPI
- Ultralytics YOLOv9
- PyTorch
- Pillow

## Model

Place your trained YOLOv9 model as `models/best.pt`. The model should be trained to detect:
- Digits (0-9)
- Decimal points
- kWh units (optional)
