// API Configuration for Smart Meter Reading App
// Update the BASE_URL with your computer's IP address where the FastAPI backend is running
// NEW SIMPLIFIED BACKEND - Uses app.py instead of main.py

export const API_CONFIG = {
  // Try these IPs in order if one doesn't work
  BASE_URL: 'http://10.97.34.174:8000',  // Updated to current Wi-Fi IP
  
  // Alternative IPs to try if current one fails
  ALTERNATIVE_IPS: [
    'http://10.97.34.174:8000',     // Current correct Wi-Fi IP  
    'http://10.0.2.2:8000',         // Android emulator default
    'http://localhost:8000',        // For iOS simulator
    'http://127.0.0.1:8000',        // Loop back  
    'http://10.200.36.174:8000',    // Previous Wi-Fi IP
    'http://192.168.31.78:8000',    // Previous Wi-Fi IP
    'http://10.178.231.174:8000',   // Previous IP
    'http://10.79.112.174:8000',    // Previous IP
  ],
  
  // Alternative configurations for different environments
  DEVELOPMENT: {
    BASE_URL: 'http://192.168.1.100:8000',  // Your development machine IP
  },
  
  LOCALHOST: {
    BASE_URL: 'http://127.0.0.1:8000',  // Only works in emulator
  },
  
  // API endpoints - Updated for new simplified backend
  ENDPOINTS: {
    DETECT_READING: '/detect-meter-reading',  // Main endpoint for meter reading
    HEALTH: '/health',                        // Health check endpoint
    MODEL_INFO: '/model-info'                 // Model information endpoint
  },
  
  // Request configuration
  TIMEOUT: 30000,  // 30 seconds
  MAX_FILE_SIZE: 10 * 1024 * 1024,  // 10MB
};

// Helper function to get full endpoint URL
export const getEndpointURL = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Instructions for finding your IP address:
// 
// Windows:
// 1. Open Command Prompt
// 2. Run: ipconfig
// 3. Look for "IPv4 Address" under your network adapter
//
// Mac/Linux:
// 1. Open Terminal
// 2. Run: ifconfig
// 3. Look for "inet" address (usually under en0 or wlan0)
//
// Make sure both your computer and phone are on the same WiFi network!