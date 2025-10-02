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

const MeterReaderProfile = ({ navigation }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    mobileNumber: '',
    email: '',
    department: 'Meter Reading',
    designation: 'Field Officer'
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { employeeId, fullName, mobileNumber, email } = formData;
    
    if (!employeeId || employeeId.length < 5) {
      Alert.alert('Validation Error', 'Employee ID must be at least 5 characters');
      return false;
    }
    
    if (!fullName || fullName.length < 2) {
      Alert.alert('Validation Error', 'Please enter a valid full name');
      return false;
    }
    
    if (!mobileNumber || mobileNumber.length !== 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
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
        'Profile Setup Complete',
        'Your meter reader profile has been created successfully!',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('Dashboard')
          }
        ]
      );
    }
  };

  const formFields = [
    {
      key: 'employeeId',
      label: 'Employee ID',
      placeholder: 'Enter your employee ID',
      icon: 'card',
      required: true
    },
    {
      key: 'fullName',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      icon: 'person',
      required: true
    },
    {
      key: 'mobileNumber',
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
            <Ionicons name="person-circle" size={40} color="#FF6F00" />
            <Text style={styles.headerTitle}>Meter Reader Profile</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Enter your details to set up your meter reader account
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
                
                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <Ionicons name={field.icon} size={20} color="#666666" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder={field.placeholder}
                    placeholderTextColor="#999999"
                    value={formData[field.key]}
                    onChangeText={(value) => updateFormData(field.key, value)}
                    keyboardType={field.keyboardType || 'default'}
                    maxLength={field.maxLength}
                    autoCapitalize={field.key === 'email' ? 'none' : 'words'}
                  />
                </View>
              </Animatable.View>
            ))}

            {/* Department and Designation (Read-only) */}
            <View style={styles.readOnlySection}>
              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyLabel}>Department</Text>
                <View style={styles.readOnlyValue}>
                  <Ionicons name="business" size={16} color="#4CAF50" />
                  <Text style={styles.readOnlyText}>{formData.department}</Text>
                </View>
              </View>
              
              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyLabel}>Designation</Text>
                <View style={styles.readOnlyValue}>
                  <Ionicons name="ribbon" size={16} color="#2196F3" />
                  <Text style={styles.readOnlyText}>{formData.designation}</Text>
                </View>
              </View>
            </View>
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
              <Text style={styles.buttonText}>Complete Profile Setup</Text>
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
  inputIconContainer: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  readOnlySection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 111, 0, 0.2)',
  },
  readOnlyField: {
    marginBottom: 16,
  },
  readOnlyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 6,
  },
  readOnlyValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readOnlyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginLeft: 8,
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

export default MeterReaderProfile;