import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const OTPVerificationScreen = ({ navigation, route }) => {
  const { mobileNumber } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [countdown, setCountdown] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpInput = (value, index) => {
    const digit = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    
    if (digit && index < 5) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
    
    if (newOtp.every(d => d !== '') && !isVerifying) {
      setTimeout(() => handleVerifyOtp(newOtp.join('')), 300);
    }
  };

  const handleBackspace = (index) => {
    const newOtp = [...otp];
    if (otp[index] !== '') {
      newOtp[index] = '';
      setOtp(newOtp);
    } else if (index > 0) {
      newOtp[index - 1] = '';
      setOtp(newOtp);
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpCode = otp.join('')) => {
    if (otpCode.length === 6) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        if (otpCode === '123456') {
          Alert.alert('Verification Successful!', 'Your mobile number has been verified successfully', [
            { text: 'Continue', onPress: () => navigation.navigate('RoleSelection') }
          ]);
        } else {
          Alert.alert('Invalid OTP', 'The OTP you entered is incorrect. Please try again.', [
            { text: 'OK', onPress: () => {
              setOtp(['', '', '', '', '', '']);
              setActiveIndex(0);
              inputRefs.current[0]?.focus();
            }}
          ]);
        }
      }, 2000);
    }
  };

  const handleResendOtp = () => {
    setCountdown(300);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setActiveIndex(0);
    inputRefs.current[0]?.focus();
    Alert.alert('OTP Sent!', `A new 6-digit verification code has been sent to +91 ${mobileNumber}`, [{ text: 'OK' }]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (number) => {
    if (!number) return '';
    const maskedNumber = number.slice(0, 2) + '****' + number.slice(-2);
    return `+91 ${maskedNumber}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF9C4" translucent />
      <LinearGradient colors={['#FFF9C4', '#FFEB3B', '#FFC107']} style={styles.mainContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={40} color="#FF6F00" />
            <Text style={styles.headerTitle}>OTP Verification</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>Code sent to {formatPhoneNumber(mobileNumber)}</Text>

          <Animatable.View animation="fadeInUp" duration={800} style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <View key={index} style={styles.otpBoxWrapper}>
                <TextInput
                  ref={ref => inputRefs.current[index] = ref}
                  style={[
                    styles.otpInput,
                    activeIndex === index && styles.activeOtpInput,
                    digit && styles.filledOtpInput
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpInput(value, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace') {
                      handleBackspace(index);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  onFocus={() => setActiveIndex(index)}
                  textAlign="center"
                  autoFocus={index === 0}
                />
              </View>
            ))}
          </Animatable.View>

          <Animatable.View animation="fadeInUp" duration={800} delay={200} style={styles.timerContainer}>
            <Ionicons name="time-outline" size={16} color="#666666" />
            <Text style={styles.timerText}>Code expires in {formatTime(countdown)}</Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" duration={800} delay={400}>
            <TouchableOpacity 
              style={[
                styles.verifyButton,
                otp.every(digit => digit !== '') ? styles.verifyButtonActive : styles.verifyButtonInactive
              ]}
              onPress={() => handleVerifyOtp()}
              disabled={!otp.every(digit => digit !== '') || isVerifying}
            >
              <LinearGradient
                colors={otp.every(digit => digit !== '') ? ['#FF6F00', '#FF8F00'] : ['#E0E0E0', '#E0E0E0']}
                style={styles.buttonGradient}
              >
                {isVerifying ? (
                  <Animatable.View animation="rotate" iterationCount="infinite" duration={1000}>
                    <Ionicons name="hourglass-outline" size={20} color="#FFF" />
                  </Animatable.View>
                ) : (
                  <Ionicons name="shield-checkmark" size={20} color="#FFF" />
                )}
                <Text style={styles.buttonText}>{isVerifying ? 'Verifying...' : 'Verify OTP'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" duration={800} delay={600} style={styles.resendContainer}>
            <Text style={styles.resendLabel}>Didn't receive the code?</Text>
            {canResend ? (
              <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp}>
                <Ionicons name="refresh" size={18} color="#E65100" />
                <Text style={styles.resendButtonText}>Resend Code</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.resendDisabled}>
                <Text style={styles.resendDisabledText}>Resend in {Math.ceil(countdown / 60)} minutes</Text>
              </View>
            )}
          </Animatable.View>

          <Animatable.View animation="fadeInUp" duration={800} delay={800} style={styles.demoContainer}>
          </Animatable.View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}></Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9C4' },
  mainContainer: { flex: 1, paddingTop: 40 },
  header: { paddingHorizontal: 20, paddingVertical: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  logoContainer: { flex: 1, alignItems: 'center', marginLeft: -44 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', marginTop: 5 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A1A', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666666', textAlign: 'center', marginBottom: 50 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, paddingHorizontal: 10 },
  otpBoxWrapper: { width: 45, height: 55 },
  otpInput: { width: '100%', height: '100%', backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#E0E0E0', borderRadius: 12, fontSize: 24, fontWeight: '600', color: '#1A1A1A', textAlign: 'center', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  activeOtpInput: { borderColor: '#FF6F00', backgroundColor: '#FFF8E1', elevation: 2 },
  filledOtpInput: { borderColor: '#4CAF50', backgroundColor: '#E8F5E8' },
  timerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 40, backgroundColor: 'rgba(255, 255, 255, 0.3)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20, alignSelf: 'center' },
  timerText: { fontSize: 14, color: '#666666', marginLeft: 6, fontWeight: '500' },
  verifyButton: { marginBottom: 40, borderRadius: 15, overflow: 'hidden' },
  verifyButtonActive: { elevation: 3, shadowColor: '#FF6F00', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  verifyButtonInactive: { opacity: 0.6 },
  buttonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 24 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginLeft: 8 },
  resendContainer: { alignItems: 'center', marginBottom: 30 },
  resendLabel: { fontSize: 14, color: '#666666', marginBottom: 12 },
  resendButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, backgroundColor: 'rgba(230, 81, 0, 0.1)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(230, 81, 0, 0.3)' },
  resendButtonText: { fontSize: 14, fontWeight: '600', color: '#E65100', marginLeft: 6 },
  resendDisabled: { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 20 },
  resendDisabledText: { fontSize: 14, color: '#999999' },
  demoContainer: { alignItems: 'center', marginBottom: 20 },
  demoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(33, 150, 243, 0.1)', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderLeftWidth: 3, borderLeftColor: '#2196F3' },
  demoText: { fontSize: 14, fontWeight: '500', color: '#1976D2', marginLeft: 8 },
  footer: { alignItems: 'center', paddingVertical: 20 },
  footerText: { fontSize: 12, color: '#999999' }
});

export default OTPVerificationScreen;