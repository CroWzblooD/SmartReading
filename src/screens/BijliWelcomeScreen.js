import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const BijliWelcomeScreen = ({ navigation }) => {
  const [pulseAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    // Pulse animation for main icon
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Main Content */}
      <LinearGradient
        colors={['#FFF9C4', '#FFEB3B', '#FFC107']}
        style={styles.mainContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Animatable.View 
            animation="fadeInDown" 
            duration={1000} 
            style={styles.logoContainer}
          >
            <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnimation }] }]}>
              <Ionicons name="flash" size={60} color="#FF6F00" />
            </Animated.View>
            <Text style={styles.appTitle}>SmartMeter</Text>
            <Text style={styles.appSubtitle}>Intelligent Energy Reading</Text>
          </Animatable.View>
        </View>

        {/* Welcome Content */}
        <Animatable.View 
          animation="fadeInUp" 
          duration={1000} 
          delay={300} 
          style={styles.welcomeContent}
        >
          <Text style={styles.welcomeTitle}>Welcome</Text>
          <Text style={styles.welcomeDescription}>
            Advanced meter reading technology at your fingertips
          </Text>
        </Animatable.View>

        {/* Action Buttons */}
        <Animatable.View 
          animation="fadeInUp" 
          duration={1000} 
          delay={600} 
          style={styles.buttonsContainer}
        >
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('MobileLogin')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FFFFFF', '#FFFDE7']}
              style={styles.buttonGradient}
            >
              <Ionicons name="phone-portrait-outline" size={24} color="#FF6F00" />
              <Text style={styles.primaryButtonText}>Login with Mobile</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('MPINLogin')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FFF8E1', '#FFFFFF']}
              style={styles.buttonGradient}
            >
              <Ionicons name="keypad-outline" size={24} color="#E65100" />
              <Text style={styles.secondaryButtonText}>Login with PIN</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tertiaryButton}
            onPress={() => navigation.navigate('RoleSelection')}
            activeOpacity={0.9}
          >
            <Text style={styles.tertiaryButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Footer */}
        <Animatable.View 
          animation="fadeIn" 
          duration={1000} 
          delay={900} 
          style={styles.footer}
        >
          <Text style={styles.footerText}></Text>
        </Animatable.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Header Styles
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#424242',
    fontWeight: '400',
    letterSpacing: 0.5,
  },

  // Welcome Content
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
    letterSpacing: 2,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    paddingHorizontal: 20,
  },

  // Buttons Container
  buttonsContainer: {
    flex: 1.5,
    width: '100%',
    justifyContent: 'center',
    gap: 16,
  },

  // Primary Button
  primaryButton: {
    width: '100%',
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    gap: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },

  // Secondary Button
  secondaryButton: {
    width: '100%',
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    gap: 12,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },

  // Tertiary Button
  tertiaryButton: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    fontSize: 16,
    color: '#424242',
    fontWeight: '500',
    textDecorationLine: 'underline',
    letterSpacing: 0.5,
  },

  // Footer
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
    letterSpacing: 1,
  },
});

export default BijliWelcomeScreen;