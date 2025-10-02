import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const MPINLoginScreen = ({ navigation }) => {
  const [mpin, setMpin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNumberPress = (number) => {
    if (mpin.length < 6) {
      setMpin(prev => prev + number);
    }
  };

  const handleBackspace = () => {
    setMpin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setMpin('');
  };

  const handleLogin = async () => {
    if (mpin.length !== 6) {
      Alert.alert('Invalid MPIN', 'Please enter a 6-digit MPIN');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        '✅ Login Successful!',
        'Welcome to Smart Meter Reading System',
        [
          {
            text: 'Continue to Dashboard',
            onPress: () => navigation.navigate('Dashboard', { userType: 'consumer' })
          }
        ]
      );
    }, 1500);
  };

  const renderMpinDots = () => {
    const dots = [];
    for (let i = 0; i < 6; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.mpinDot,
            i < mpin.length ? styles.mpinDotFilled : styles.mpinDotEmpty
          ]}
        />
      );
    }
    return dots;
  };

  const renderKeypadButton = (number, icon = null) => (
    <TouchableOpacity
      key={number}
      style={styles.keypadButton}
      onPress={() => {
        if (number === 'backspace') handleBackspace();
        else if (number === 'clear') handleClear();
        else handleNumberPress(number.toString());
      }}
      activeOpacity={0.7}
    >
      {icon ? (
        <Ionicons name={icon} size={24} color="#1A1A1A" />
      ) : (
        <Text style={styles.keypadButtonText}>{number}</Text>
      )}
    </TouchableOpacity>
  );

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
            <Ionicons name="keypad-outline" size={40} color="#FF6F00" />
            <Text style={styles.headerTitle}>PIN Login</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <Text style={styles.title}>Enter Your PIN</Text>
          <Text style={styles.subtitle}>Enter your 6-digit secure PIN</Text>

          {/* MPIN Dots Display */}
          <View style={styles.mpinDotsContainer}>
            {renderMpinDots()}
          </View>

          {/* Keypad */}
          <View style={styles.keypad}>
            {/* Row 1 */}
            <View style={styles.keypadRow}>
              {renderKeypadButton(1)}
              {renderKeypadButton(2)}
              {renderKeypadButton(3)}
            </View>
            
            {/* Row 2 */}
            <View style={styles.keypadRow}>
              {renderKeypadButton(4)}
              {renderKeypadButton(5)}
              {renderKeypadButton(6)}
            </View>
            
            {/* Row 3 */}
            <View style={styles.keypadRow}>
              {renderKeypadButton(7)}
              {renderKeypadButton(8)}
              {renderKeypadButton(9)}
            </View>
            
            {/* Row 4 */}
            <View style={styles.keypadRow}>
              {renderKeypadButton('clear', 'refresh')}
              {renderKeypadButton(0)}
              {renderKeypadButton('backspace', 'backspace')}
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={[
              styles.loginButton,
              mpin.length === 6 ? styles.loginButtonActive : styles.loginButtonInactive
            ]}
            onPress={handleLogin}
            disabled={mpin.length !== 6 || isLoading}
          >
            <LinearGradient
              colors={mpin.length === 6 ? ['#FF6F00', '#FF8F00'] : ['#E0E0E0', '#E0E0E0']}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <Animatable.View animation="rotate" iterationCount="infinite" duration={1000}>
                  <Ionicons name="hourglass-outline" size={20} color="#FFF" />
                </Animatable.View>
              ) : (
                <Ionicons name="log-in" size={20} color="#FFF" />
              )}
              <Text style={styles.buttonText}>
                {isLoading ? 'Verifying...' : 'Login'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
    paddingBottom: 30,
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
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    marginBottom: 25,
  },

  // MPIN Dots
  mpinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 25,
  },
  mpinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  mpinDotFilled: {
    backgroundColor: '#FF6F00',
  },
  mpinDotEmpty: {
    backgroundColor: '#E0E0E0',
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },

  // Keypad
  keypad: {
    alignItems: 'center',
    marginBottom: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 15,
  },
  keypadButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  keypadButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },

  // Login Button
  loginButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  loginButtonActive: {},
  loginButtonInactive: {},
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
    marginBottom: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
    paddingTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
  },
});

export default MPINLoginScreen;