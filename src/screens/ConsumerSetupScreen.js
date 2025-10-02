import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const ConsumerSetupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    consumerNumber: '',
    name: '',
    primaryMobile: '',
    address: '',
    email: '',
    meterType: 'Single Phase',
    connectionType: 'Residential'
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { consumerNumber, name, primaryMobile, address, email } = formData;
    
    if (!consumerNumber || consumerNumber.length < 8) {
      Alert.alert('Validation Error', 'Consumer number must be at least 8 characters');
      return false;
    }
    
    if (!name || name.length < 2) {
      Alert.alert('Validation Error', 'Please enter a valid name');
      return false;
    }
    
    if (!primaryMobile || primaryMobile.length !== 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
      return false;
    }
    
    if (!address || address.length < 10) {
      Alert.alert('Validation Error', 'Please enter a complete address');
      return false;
    }
    
    if (!email || !email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert(
        'Setup Complete',
        'Your consumer account has been set up successfully!',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('ConsumerProfile')
          }
        ]
      );
    }
  };

  const meterTypes = ['Single Phase', 'Three Phase'];
  const connectionTypes = ['Residential', 'Commercial', 'Industrial'];

  const formFields = [
    {
      key: 'consumerNumber',
      label: 'Consumer Number',
      placeholder: 'Enter your consumer number',
      icon: 'card',
      required: true
    },
    {
      key: 'name',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      icon: 'person',
      required: true
    },
    {
      key: 'primaryMobile',
      label: 'Mobile Number',
      placeholder: 'Enter mobile number',
      icon: 'call',
      keyboardType: 'numeric',
      maxLength: 10,
      required: true
    },
    {
      key: 'email',
      label: 'Email Address',
      placeholder: 'Enter email address',
      icon: 'mail',
      keyboardType: 'email-address',
      required: true
    },
    {
      key: 'address',
      label: 'Address',
      placeholder: 'Enter your complete address',
      icon: 'home',
      multiline: true,
      required: true
    }
  ];

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
            <Ionicons name="home" size={40} color="#FF6F00" />
            <Text style={styles.headerTitle}>Consumer Setup</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Set Up Your Account</Text>
          <Text style={styles.subtitle}>
            Enter your details to create your consumer profile
          </Text>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {formFields.map((field, index) => (
              <Animatable.View
                key={field.key}
                animation="fadeInUp"
                duration={600}
                delay={index * 100}
                style={styles.fieldContainer}
              >
                <Text style={styles.fieldLabel}>
                  {field.label}
                  {field.required && <Text style={styles.required}> *</Text>}
                </Text>
                
                <View style={[
                  styles.inputContainer,
                  field.multiline && styles.multilineContainer
                ]}>
                  <View style={styles.inputIconContainer}>
                    <Ionicons name={field.icon} size={20} color="#666666" />
                  </View>
                  <TextInput
                    style={[
                      styles.textInput,
                      field.multiline && styles.multilineInput
                    ]}
                    placeholder={field.placeholder}
                    placeholderTextColor="#999999"
                    value={formData[field.key]}
                    onChangeText={(value) => updateFormData(field.key, value)}
                    keyboardType={field.keyboardType || 'default'}
                    maxLength={field.maxLength}
                    multiline={field.multiline}
                    numberOfLines={field.multiline ? 3 : 1}
                    autoCapitalize={field.key === 'email' ? 'none' : 'words'}
                  />
                </View>
              </Animatable.View>
            ))}

            {/* Meter Type Selection */}
            <Animatable.View
              animation="fadeInUp"
              duration={600}
              delay={500}
              style={styles.fieldContainer}
            >
              <Text style={styles.fieldLabel}>Meter Type</Text>
              <View style={styles.optionsContainer}>
                {meterTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionButton,
                      formData.meterType === type && styles.selectedOption
                    ]}
                    onPress={() => updateFormData('meterType', type)}
                  >
                    <Text style={[
                      styles.optionText,
                      formData.meterType === type && styles.selectedOptionText
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animatable.View>

            {/* Connection Type Selection */}
            <Animatable.View
              animation="fadeInUp"
              duration={600}
              delay={600}
              style={styles.fieldContainer}
            >
              <Text style={styles.fieldLabel}>Connection Type</Text>
              <View style={styles.optionsContainer}>
                {connectionTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionButton,
                      formData.connectionType === type && styles.selectedOption
                    ]}
                    onPress={() => updateFormData('connectionType', type)}
                  >
                    <Text style={[
                      styles.optionText,
                      formData.connectionType === type && styles.selectedOptionText
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animatable.View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF6F00', '#FF8F00']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Complete Setup</Text>
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 30,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  required: {
    color: '#F44336',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    height: 50,
  },
  multilineContainer: {
    alignItems: 'flex-start',
    height: 80,
    paddingVertical: 12,
  },
  inputIconContainer: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: '#FF6F00',
    borderColor: '#FF6F00',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  submitButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 40,
    elevation: 3,
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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

export default ConsumerSetupScreen;