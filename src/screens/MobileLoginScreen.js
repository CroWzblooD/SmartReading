import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const MobileLoginScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        '✅ OTP Sent Successfully!',
        `Verification code has been sent to +91 ${mobileNumber}`,
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('OTPVerification', { 
              mobileNumber: mobileNumber 
            })
          }
        ]
      );
    }, 2000);
  };

  const formatMobileNumber = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);
    setMobileNumber(limited);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF9C4" translucent />
      
      {/* Main Content */}
      <LinearGradient
        colors={['#FFF9C4', '#FFEB3B', '#FFC107']}
        style={styles.mainContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Ionicons name="phone-portrait-outline" size={40} color="#FF6F00" />
            <Text style={styles.headerTitle}>Mobile Login</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <Text style={styles.title}>Enter Mobile Number</Text>
          <Text style={styles.subtitle}>We'll send an OTP for verification</Text>

          {/* Mobile Input */}
          <View style={styles.inputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              style={styles.mobileInput}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor="#666"
              value={mobileNumber}
              onChangeText={formatMobileNumber}
              keyboardType="numeric"
              maxLength={10}
              autoFocus={true}
            />
            {mobileNumber.length === 10 && (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            )}
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity 
            style={[
              styles.sendButton,
              mobileNumber.length === 10 ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={handleSendOTP}
            disabled={mobileNumber.length !== 10 || isLoading}
          >
            <LinearGradient
              colors={mobileNumber.length === 10 ? ['#FF6F00', '#FF8F00'] : ['#E0E0E0', '#E0E0E0']}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <Animatable.View animation="rotate" iterationCount="infinite" duration={1000}>
                  <Ionicons name="hourglass-outline" size={20} color="#FFF" />
                </Animatable.View>
              ) : (
                <Ionicons name="send" size={20} color="#FFF" />
              )}
              <Text style={styles.buttonText}>
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Alternative Login */}
          <View style={styles.alternativeContainer}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.alternativeButton}
              onPress={() => navigation.navigate('MPINLogin')}
            >
              <Ionicons name="keypad-outline" size={20} color="#E65100" />
              <Text style={styles.alternativeButtonText}>Login with PIN</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}></Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9C4',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 0,
  },
  
  // Header
  header: {
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 15,
  },

  // Content
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    marginBottom: 40,
  },

  // Input Container
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  countryCode: {
    paddingRight: 15,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    marginRight: 15,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  mobileInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    paddingVertical: 15,
  },

  // Send Button
  sendButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  sendButtonActive: {},
  sendButtonInactive: {},
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Alternative Login
  alternativeContainer: {
    marginBottom: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 14,
    color: '#666666',
    marginHorizontal: 15,
    fontWeight: '500',
  },
  alternativeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E65100',
    gap: 10,
  },
  alternativeButtonText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
  },
});

export default MobileLoginScreen;