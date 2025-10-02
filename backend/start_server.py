"""
Simple script to start the meter reading server
"""

import uvicorn
import sys
import os

if __name__ == "__main__":
    print("🚀 Starting Smart Meter Reading Server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📍 Health check: http://localhost:8000/health")
    print("📍 API docs: http://localhost:8000/docs")
    print("\n⚠️  Make sure models/best.pt exists!")
    print("🛑 Press Ctrl+C to stop the server\n")
    
    try:
        uvicorn.run(
            "app:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)
