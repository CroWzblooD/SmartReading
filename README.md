# SmartReading - Intelligent Meter Reading App

A React Native Expo application designed for smart meter reading using advanced camera technology and image processing.

## Features

- **Camera Integration**: High-quality camera capture for meter reading
- **Image Processing**: Smart detection and recognition of meter readings
- **User-Friendly Interface**: Intuitive design for easy meter reading
- **Cross-Platform**: Works on both iOS and Android devices
- **Web Support**: Can also run on web browsers

## Technology Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform for React Native
- **Expo Camera**: Camera functionality
- **React Navigation**: Navigation between screens
- **React Native Safe Area Context**: Safe area handling

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the App

### Development Mode
```bash
npm start
```

### Platform-Specific Commands
```bash
# Android
npm run android

# iOS (requires macOS)
npm run ios

# Web
npm run web
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/       # App screens
├── services/      # API and external services
└── utils/         # Utility functions and helpers
```

## Getting Started

1. Run `npm start` to start the Expo development server
2. Use the Expo Go app on your mobile device to scan the QR code
3. Or press 'w' to open in web browser

## Development

This app is designed for meter reading functionality. The current setup includes:

- Basic app structure with navigation
- Camera screen for capturing meter images
- Placeholder for image processing and OCR functionality
- Modern UI design optimized for meter reading workflows

## Future Enhancements

- OCR (Optical Character Recognition) for automatic reading detection
- Machine learning integration for improved accuracy
- Data storage and history tracking
- Export functionality for readings
- Multi-meter support
- Offline capability

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.