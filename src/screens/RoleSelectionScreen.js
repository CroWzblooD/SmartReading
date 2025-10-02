import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const RoleSelectionScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'meter_reader',
      title: 'Meter Reader',
      subtitle: 'Field Officer Access',
      description: 'Take meter readings and generate bills',
      icon: 'person-circle',
      color: '#4CAF50'
    },
    {
      id: 'consumer',
      title: 'Consumer',
      subtitle: 'Customer Access',
      description: 'View bills and submit readings',
      icon: 'home',
      color: '#2196F3'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      Alert.alert('Selection Required', 'Please select your role to continue');
      return;
    }

    if (selectedRole === 'meter_reader') {
      navigation.navigate('MeterReaderProfile');
    } else if (selectedRole === 'consumer') {
      navigation.navigate('ConsumerSetup');
    }
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
            <Ionicons name="people" size={40} color="#FF6F00" />
            <Text style={styles.headerTitle}>Select Role</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            Select your access level to continue
          </Text>

          {/* Role Cards */}
          <View style={styles.rolesContainer}>
            {roles.map((role, index) => (
              <Animatable.View
                key={role.id}
                animation="fadeInUp"
                duration={800}
                delay={index * 200}
              >
                <TouchableOpacity
                  style={[
                    styles.roleCard,
                    selectedRole === role.id && styles.selectedCard
                  ]}
                  onPress={() => handleRoleSelect(role.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardContent}>
                    <View style={[styles.iconContainer, { backgroundColor: role.color + '20' }]}>
                      <Ionicons name={role.icon} size={32} color={role.color} />
                    </View>
                    
                    <View style={styles.cardInfo}>
                      <Text style={styles.roleTitle}>{role.title}</Text>
                      <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
                      <Text style={styles.roleDescription}>{role.description}</Text>
                    </View>
                    
                    <View style={styles.checkContainer}>
                      {selectedRole === role.id ? (
                        <Ionicons name="checkmark-circle" size={24} color={role.color} />
                      ) : (
                        <Ionicons name="radio-button-off" size={24} color="#E0E0E0" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>

          {/* Continue Button */}
          <TouchableOpacity 
            style={[
              styles.continueButton,
              selectedRole ? styles.continueButtonActive : styles.continueButtonInactive
            ]}
            onPress={handleContinue}
            disabled={!selectedRole}
          >
            <LinearGradient
              colors={selectedRole ? ['#FF6F00', '#FF8F00'] : ['#E0E0E0', '#E0E0E0']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <Ionicons 
                name="arrow-forward" 
                size={20} 
                color={selectedRole ? "#FFF" : "#999"} 
              />
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
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -44,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  rolesContainer: {
    marginBottom: 40,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCard: {
    borderColor: '#FF6F00',
    backgroundColor: '#FFF8E1',
    elevation: 4,
    shadowOpacity: 0.2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 12,
    color: '#999999',
    lineHeight: 16,
  },
  checkContainer: {
    marginLeft: 12,
  },
  continueButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 30,
  },
  continueButtonActive: {
    elevation: 3,
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  continueButtonInactive: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
  },
});

export default RoleSelectionScreen;