import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Dimensions,
  Modal,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';
import { API_CONFIG, getEndpointURL } from '../config/api';

const CameraReadingScreen = ({ navigation, route }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [meterReading, setMeterReading] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('ELEC001234567');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  
  const cameraRef = useRef();

  // API processing function
  const processImageWithAPI = async (imageUri) => {
    try {
      console.log('🔄 Starting API request to:', API_CONFIG.BASE_URL);
      
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'meter_reading.jpg',
      });

      // Use the API configuration
      const apiUrl = getEndpointURL(API_CONFIG.ENDPOINTS.DETECT_READING);
      console.log('📡 API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        // Remove Content-Type header - let React Native set it automatically for FormData
        // timeout property doesn't work in React Native fetch
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Response error:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ API Response:', result);
      
      if (result.success && result.detected_reading) {
        return {
          reading: result.detected_reading,
          confidence: result.confidence,
          analysis: result.analysis,
          rawDetections: result.raw_detections,
          success: true
        };
      } else {
        throw new Error('No reading detected in the image');
      }
      
    } catch (error) {
      console.error('❌ OCR API Error:', error);
      
      // More specific error messages
      if (error.message === 'Network request failed') {
        Alert.alert(
          'Connection Error', 
          `Cannot connect to backend server at ${API_CONFIG.BASE_URL}\n\nMake sure:\n• Backend is running\n• Your phone and computer are on same WiFi\n• IP address is correct`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'OCR Processing Failed', 
          'Unable to automatically detect meter reading. Please enter it manually.',
          [{ text: 'OK' }]
        );
      }
      
      return {
        reading: '',
        confidence: 0,
        analysis: { reliability: 'manual_entry' },
        error: error.message,
        success: false
      };
    }
  };

  // Test network connectivity with fallback IPs
  const testNetworkConnection = async () => {
    console.log('🧪 Testing network connection...');
    
    // Try main URL first
    try {
      const response = await fetch(API_CONFIG.BASE_URL + '/');
      const result = await response.json();
      console.log('✅ Network test successful:', result);
      Alert.alert('Success', `Backend connection test passed!\nUsing: ${API_CONFIG.BASE_URL}`);
      return true;
    } catch (error) {
      console.log('❌ Main URL failed, trying alternatives...');
    }
    
    // Try alternative IPs
    for (const altUrl of API_CONFIG.ALTERNATIVE_IPS || []) {
      try {
        console.log('🔄 Trying:', altUrl);
        const response = await fetch(altUrl + '/');
        const result = await response.json();
        console.log('✅ Alternative URL works:', altUrl);
        Alert.alert('Connection Found!', `Backend reachable at:\n${altUrl}\n\nUpdate your API config to use this URL.`);
        return true;
      } catch (error) {
        console.log(`❌ ${altUrl} failed:`, error.message);
      }
    }
    
    Alert.alert('Connection Failed', 
      `Cannot reach backend at any URL.\n\nTried:\n${[API_CONFIG.BASE_URL, ...(API_CONFIG.ALTERNATIVE_IPS || [])].join('\n')}\n\nMake sure:\n• Backend is running\n• Same WiFi network\n• Correct IP address`
    );
    return false;
  };

  const handleLogout = () => {
    navigation.goBack();
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        setCapturedImage(photo);
        
        // Process with backend API
        setIsProcessing(true);
        const ocrResult = await processImageWithAPI(photo.uri);
        
        if (ocrResult.success && ocrResult.reading) {
          setMeterReading(ocrResult.reading);
          console.log('✅ Reading detected:', ocrResult.reading);
        } else {
          console.log('⚠️ No reading detected, user will enter manually');
          setMeterReading(''); // Clear for manual entry
        }
        
        setIsProcessing(false);
        setShowConfirmModal(true);
        
      } catch (error) {
        console.log('❌ Camera error:', error);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
        setIsProcessing(false);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setCapturedImage(selectedImage);
        
        // Process with backend API
        setIsProcessing(true);
        const ocrResult = await processImageWithAPI(selectedImage.uri);
        
        if (ocrResult.success && ocrResult.reading) {
          setMeterReading(ocrResult.reading);
          console.log('✅ Reading detected from gallery:', ocrResult.reading);
        } else {
          console.log('⚠️ No reading detected from gallery, user will enter manually');
          setMeterReading(''); // Clear for manual entry
        }
        
        setIsProcessing(false);
        setShowConfirmModal(true);
      }
    } catch (error) {
      console.error('❌ Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      setIsProcessing(false);
    }
  };

  const submitReading = async () => {
    if (!meterReading.trim()) {
      Alert.alert('Error', 'Please enter a valid meter reading');
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setScanSuccess(true);
      setShowConfirmModal(false);
      
      setTimeout(() => {
        Alert.alert(
          'Success',
          'Meter reading submitted successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }, 1000);
    }, 1500);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setMeterReading('');
    setShowConfirmModal(false);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#FFF9C4', '#FFEB3B']} style={styles.background}>
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#FF6F00" />
            <Text style={styles.loadingText}>Loading camera...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF9C4" />
        
        <LinearGradient colors={['#FFF9C4', '#FFEB3B']} style={styles.background}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleLogout} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Camera Reading</Text>
              <Text style={styles.headerSubtitle}>Smart Meter Scanner</Text>
            </View>
            <View style={styles.headerRight} />
          </View>

          <View style={styles.centerContent}>
            <View style={styles.permissionContainer}>
              <View style={styles.permissionIcon}>
                <Ionicons name="camera-outline" size={64} color="#FF6F00" />
              </View>
              <Text style={styles.permissionTitle}>Camera Permission Required</Text>
              <Text style={styles.permissionText}>
                We need access to your camera to scan meter readings automatically
              </Text>
              <TouchableOpacity 
                style={styles.permissionButton}
                onPress={requestPermission}
              >
                <LinearGradient colors={['#FF6F00', '#FF8F00']} style={styles.permissionGradient}>
                  <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF9C4" />
      
      <LinearGradient colors={['#FFF9C4', '#FFEB3B']} style={styles.background}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogout} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Camera Reading</Text>
            <Text style={styles.headerSubtitle}>Smart Meter Scanner</Text>
          </View>
          <TouchableOpacity style={styles.helpButton} onPress={testNetworkConnection}>
            <Ionicons name="wifi-outline" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* Simple Info Bar */}
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>Consumer: {consumerNumber}</Text>
          <Text style={styles.infoText}>{new Date().toLocaleDateString('en-GB')}</Text>
        </View>

        {/* Camera Container */}
        <View style={styles.cameraContainer}>
          <CameraView 
            style={styles.camera} 
            facing={facing}
            flash={flash}
            ref={cameraRef}
          >
            {/* Simple Scan Frame */}
            <View style={styles.overlay}>
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
                <Text style={styles.scanText}>Position meter here</Text>
              </View>
            </View>
            
            {/* Flash Button */}
            <TouchableOpacity 
              style={styles.flashButton}
              onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}
            >
              <Ionicons 
                name={flash === 'off' ? "flash-off" : "flash"} 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </CameraView>
        </View>

        {/* Simple Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={pickImageFromGallery}
            disabled={isProcessing}
          >
            <Ionicons name="images" size={24} color="#FF6F00" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.captureButton, isCapturing && styles.capturingButton]}
            onPress={takePicture}
            disabled={isCapturing || isProcessing}
          >
            {isCapturing ? (
              <ActivityIndicator color="#FFFFFF" size="large" />
            ) : (
              <Ionicons name="camera" size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          >
            <Ionicons name="camera-reverse" size={24} color="#FF6F00" />
          </TouchableOpacity>
        </View>

        {/* Simple Instruction */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instruction}>Tap camera button or select from gallery</Text>
        </View>

        {/* Simple Confirmation Modal */}
        <Modal
          visible={showConfirmModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Confirm Reading</Text>
                <TouchableOpacity onPress={() => setShowConfirmModal(false)}>
                  <Ionicons name="close" size={24} color="#666666" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalContent}>
                {capturedImage && (
                  <Image 
                    source={{ uri: capturedImage.uri }} 
                    style={styles.capturedImage}
                    resizeMode="contain"
                  />
                )}

                <View style={styles.readingContainer}>
                  <Text style={styles.readingLabel}>Meter Reading</Text>
                  <TextInput
                    style={styles.readingInput}
                    value={meterReading}
                    onChangeText={setMeterReading}
                    placeholder="Enter reading"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.detailsContainer}>
                  <Text style={styles.detailText}>Consumer: {consumerNumber}</Text>
                  <Text style={styles.detailText}>Date: {new Date().toLocaleDateString()}</Text>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.retakeButton}
                  onPress={retakePhoto}
                >
                  <Text style={styles.retakeButtonText}>Retake</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={submitReading}
                  disabled={isProcessing}
                >
                  <LinearGradient colors={['#FF6F00', '#FF8F00']} style={styles.submitGradient}>
                    {isProcessing ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.submitButtonText}>Submit</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Processing Overlay */}
        {isProcessing && (
          <View style={styles.processingOverlay}>
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#FF6F00" />
              <Text style={styles.processingTitle}>Processing Image</Text>
              <Text style={styles.processingText}>AI is analyzing your meter reading...</Text>
            </View>
          </View>
        )}

        {/* Success Animation */}
        {scanSuccess && (
          <Animatable.View 
            animation="zoomIn" 
            duration={1000}
            style={styles.successOverlay}
          >
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
              <Text style={styles.successText}>Reading Submitted!</Text>
              <Text style={styles.successSubtext}>Thank you for your submission</Text>
            </View>
          </Animatable.View>
        )}

      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight + 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Simple Info Bar
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },

  // Camera
  cameraContainer: {
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: Dimensions.get('window').width * 0.7,
    height: 150,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: '#FFEB3B',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  flashButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Simple Controls
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6F00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  capturingButton: {
    backgroundColor: '#FF8F00',
  },

  // Simple Instruction
  instructionContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  instruction: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  modalContent: {
    padding: 20,
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  readingContainer: {
    marginBottom: 20,
  },
  readingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  readingInput: {
    borderWidth: 2,
    borderColor: '#FF6F00',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#FFF9C4',
  },
  detailsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
  },
  submitButton: {
    flex: 2,
  },
  submitGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Permission Screen
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  permissionContainer: {
    alignItems: 'center',
  },
  permissionIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  permissionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  permissionGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Processing Overlay
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    minWidth: 200,
  },
  processingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 12,
  },
  processingText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
  },

  // Success Overlay
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    alignItems: 'center',
  },
  successText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  successSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
    opacity: 0.9,
  },
});

export default CameraReadingScreen;