import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const ConsumerProfileScreen = ({ navigation }) => {
  const [profileData] = useState({
    consumerNumber: 'CN123456789',
    name: 'John Doe',
    primaryMobile: '9876543210',
    address: '123 Main Street, City, State - 123456',
    email: 'john.doe@email.com',
    meterType: 'Single Phase',
    connectionType: 'Residential',
    joinedDate: '15 Mar 2024',
    status: 'Active'
  });

  const [billingData] = useState({
    currentBill: '₹1,245',
    dueDate: '25 Apr 2024',
    lastReading: '4,567 kWh',
    readingDate: '20 Mar 2024'
  });

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing functionality will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const handleViewBills = () => {
    Alert.alert(
      'Bill History',
      'Bill history feature will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const handlePayBill = () => {
    Alert.alert(
      'Pay Bill',
      'Bill payment feature will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const profileActions = [
    {
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: 'person-circle',
      color: '#FF6F00',
      onPress: handleEditProfile
    },
    {
      title: 'View Bills',
      subtitle: 'Check your billing history',
      icon: 'receipt',
      color: '#2196F3',
      onPress: handleViewBills
    },
    {
      title: 'Pay Bill',
      subtitle: 'Make a payment online',
      icon: 'card',
      color: '#4CAF50',
      onPress: handlePayBill
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
            <Ionicons name="person" size={40} color="#FF6F00" />
            <Text style={styles.headerTitle}>My Profile</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            style={styles.profileHeader}
          >
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={80} color="#FF6F00" />
            </View>
            <Text style={styles.profileName}>{profileData.name}</Text>
            <Text style={styles.profileSubtitle}>Consumer #{profileData.consumerNumber}</Text>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.statusText}>{profileData.status}</Text>
            </View>
          </Animatable.View>

          {/* Current Bill Summary */}
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={200}
            style={styles.billSummary}
          >
            <Text style={styles.sectionTitle}>Current Bill</Text>
            <View style={styles.billCard}>
              <View style={styles.billAmount}>
                <Text style={styles.billAmountText}>{billingData.currentBill}</Text>
                <Text style={styles.billLabel}>Amount Due</Text>
              </View>
              <View style={styles.billDetails}>
                <View style={styles.billDetailItem}>
                  <Text style={styles.billDetailLabel}>Due Date</Text>
                  <Text style={styles.billDetailValue}>{billingData.dueDate}</Text>
                </View>
                <View style={styles.billDetailItem}>
                  <Text style={styles.billDetailLabel}>Last Reading</Text>
                  <Text style={styles.billDetailValue}>{billingData.lastReading}</Text>
                </View>
              </View>
            </View>
          </Animatable.View>

          {/* Profile Information */}
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={400}
            style={styles.profileInfo}
          >
            <Text style={styles.sectionTitle}>Profile Information</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="call" size={20} color="#666666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Mobile Number</Text>
                  <Text style={styles.infoValue}>{profileData.primaryMobile}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="mail" size={20} color="#666666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email Address</Text>
                  <Text style={styles.infoValue}>{profileData.email}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="home" size={20} color="#666666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{profileData.address}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="flash" size={20} color="#666666" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Connection Type</Text>
                  <Text style={styles.infoValue}>{profileData.connectionType} - {profileData.meterType}</Text>
                </View>
              </View>
            </View>
          </Animatable.View>

          {/* Quick Actions */}
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={600}
            style={styles.actionsSection}
          >
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            {profileActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionItem}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999999" />
              </TouchableOpacity>
            ))}
          </Animatable.View>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
    marginLeft: 4,
  },
  billSummary: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  billAmount: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  billAmountText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF6F00',
    marginBottom: 4,
  },
  billLabel: {
    fontSize: 14,
    color: '#666666',
  },
  billDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  billDetailItem: {
    alignItems: 'center',
  },
  billDetailLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  billDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  profileInfo: {
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoIcon: {
    width: 40,
    alignItems: 'center',
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  actionsSection: {
    marginBottom: 40,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666666',
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

export default ConsumerProfileScreen;