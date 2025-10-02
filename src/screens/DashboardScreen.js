import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const DashboardScreen = ({ navigation, route }) => {
  const { userType = 'consumer', profile } = route.params || {};
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);

  const quickStats = [
    { label: 'Current Bill', value: '₹2,340', icon: 'receipt-outline', color: '#FF6F00' },
    { label: 'Units Used', value: '1,245', icon: 'flash-outline', color: '#4CAF50' },
    { label: 'Days Left', value: '15', icon: 'calendar-outline', color: '#2196F3' },
  ];

  const posters = [
    {
      title: 'Heating Meter Control',
      subtitle: 'Central Heating Management',
      description: 'Optimize heating system for maximum efficiency',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
      gradient: ['#f093fb', '#f5576c'],
      icon: 'thermometer-outline'
    },
    {
      title: 'Smart Energy Monitor',
      subtitle: 'Power Usage Analytics',
      description: 'Track your electricity consumption in real-time',
      imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=200&fit=crop',
      gradient: ['#667eea', '#764ba2'],
      icon: 'speedometer-outline'
    },
    {
      title: 'Bill Management',
      subtitle: 'Digital Payment System',
      description: 'Manage all your utility bills seamlessly',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop',
      gradient: ['#4facfe', '#00f2fe'],
      icon: 'document-text-outline'
    }
  ];

  const serviceCards = [
    { title: 'Smart Readings', desc: 'AI-powered meter readings', icon: 'scan-outline', color: '#2196F3' },
    { title: 'Bill Analytics', desc: 'Detailed usage insights', icon: 'analytics-outline', color: '#4CAF50' },
    { title: 'Payment History', desc: 'Transaction records', icon: 'card-outline', color: '#FF9800' },
    { title: 'Energy Tips', desc: 'Save money tips', icon: 'bulb-outline', color: '#9C27B0' },
  ];

  const recentActivities = [
    { title: 'Payment Successful', desc: '₹2,100 paid', time: '2 hours ago', icon: 'checkmark-circle', color: '#4CAF50' },
    { title: 'Reading Submitted', desc: '12450 units recorded', time: 'Yesterday', icon: 'camera', color: '#2196F3' },
    { title: 'Bill Generated', desc: 'Monthly bill ready', time: '3 days ago', icon: 'receipt', color: '#FF9800' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPosterIndex(prev => (prev + 1) % posters.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => navigation.navigate('BijliWelcome') }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF9C4" />
      
      <LinearGradient colors={['#FFF9C4', '#FFEB3B']} style={styles.background}>
        
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <LinearGradient colors={['#FF6F00', '#FF8F00']} style={styles.logoGradient}>
                <Ionicons name="flash" size={24} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <View>
              <Text style={styles.appName}>SmartMeter</Text>
              <Text style={styles.userRole}>Consumer Portal</Text>
            </View>
          </View>
          
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <View style={styles.logoutContainer}>
              <Ionicons name="log-out-outline" size={20} color="#FF6F00" />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.welcomeSubtext}>User • 02/10/2025</Text>
          </View>

          <View style={styles.statsContainer}>
            {quickStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Ionicons name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.posterSection}>
            <View style={styles.posterCard}>
              <Image 
                source={{ uri: posters[currentPosterIndex].imageUrl }}
                style={styles.posterImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                style={styles.posterOverlay}
              >
                <View style={styles.posterContent}>
                  <View style={styles.posterLeft}>
                    <Ionicons name="flash" size={28} color="#FFD700" />
                    <Ionicons name={posters[currentPosterIndex].icon} size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.posterRight}>
                    <Text style={styles.posterTitle}>{posters[currentPosterIndex].title}</Text>
                    <Text style={styles.posterSubtitle}>{posters[currentPosterIndex].subtitle}</Text>
                    <Text style={styles.posterDescription}>{posters[currentPosterIndex].description}</Text>
                    <View style={styles.learnMoreButton}>
                      <Text style={styles.learnMoreText}>Learn More</Text>
                      <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.indicatorContainer}>
              {posters.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentPosterIndex ? styles.activeIndicator : styles.inactiveIndicator
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.servicesSection}>
            <Text style={styles.sectionTitle}>Quick Services</Text>
            <View style={styles.servicesGrid}>
              {serviceCards.map((service, index) => (
                <TouchableOpacity key={index} style={styles.serviceCard} activeOpacity={0.8}>
                  <View style={[styles.serviceIcon, { backgroundColor: `${service.color}15` }]}>
                    <Ionicons name={service.icon} size={24} color={service.color} />
                  </View>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceDesc}>{service.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityList}>
              {recentActivities.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: `${activity.color}15` }]}>
                    <Ionicons name={activity.icon} size={20} color={activity.color} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDesc}>{activity.desc}</Text>
                  </View>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.bottomTabContainer}>
          <View style={styles.bottomTabContent}>
            <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
              <View style={styles.activeTabBackground}>
                <Ionicons name="home" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.activeTabText}>Home</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.tabItem}
              onPress={() => navigation.navigate('CameraReading')}
            >
              <Ionicons name="camera-outline" size={20} color="#666666" />
              <Text style={styles.tabText}>Readings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.tabItem}
              onPress={() => navigation.navigate('Bills')}
            >
              <Ionicons name="receipt-outline" size={20} color="#666666" />
              <Text style={styles.tabText}>Bills</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.tabItem}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-outline" size={20} color="#666666" />
              <Text style={styles.tabText}>Profile</Text>
            </TouchableOpacity>
          </View>
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
  background: {
    flex: 1,
    paddingTop: 40,
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 12,
  },
  logoGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  logoutButton: {
    padding: 4,
  },
  logoutContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
  },
  posterSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  posterCard: {
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
    height: 160,
  },
  posterImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  posterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'center',
  },
  posterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  posterLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  posterRight: {
    flex: 1,
  },
  posterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  posterSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    fontWeight: '600',
  },
  posterDescription: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
    marginBottom: 12,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginRight: 4,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  activeIndicator: {
    width: 20,
    backgroundColor: '#FF6F00',
  },
  inactiveIndicator: {
    width: 6,
    backgroundColor: 'rgba(255, 111, 0, 0.3)',
  },
  servicesSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'center',
  },
  serviceDesc: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 14,
  },
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  activityList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 12,
    color: '#666666',
  },
  activityTime: {
    fontSize: 11,
    color: '#999999',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 100,
  },
  bottomTabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 12,
  },
  bottomTabContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    transform: [{ translateY: -4 }],
  },
  activeTabBackground: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6F00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  activeTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF6F00',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666666',
    marginTop: 4,
  },
});

export default DashboardScreen;
