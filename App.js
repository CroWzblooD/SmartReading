import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import Screens
import BijliWelcomeScreen from './src/screens/BijliWelcomeScreen';
import MobileLoginScreen from './src/screens/MobileLoginScreen';
import MPINLoginScreen from './src/screens/MPINLoginScreen';
import OTPVerificationScreen from './src/screens/OTPVerificationScreen';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import ConsumerSetupScreen from './src/screens/ConsumerSetupScreen';
import MeterReaderProfile from './src/screens/MeterReaderProfile';
import ConsumerProfileScreen from './src/screens/ConsumerProfileScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CameraScreen from './src/screens/CameraScreen';
import CameraReadingScreen from './src/screens/CameraReadingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" backgroundColor="transparent" translucent={false} />
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        >
          <Stack.Screen 
            name="Welcome" 
            component={BijliWelcomeScreen}
            options={{ title: 'Welcome' }}
          />

          <Stack.Screen 
            name="MobileLogin" 
            component={MobileLoginScreen}
            options={{ title: 'Mobile Login' }}
          />
          <Stack.Screen 
            name="MPINLogin" 
            component={MPINLoginScreen}
            options={{ title: 'MPIN Login' }}
          />
          <Stack.Screen 
            name="OTPVerification" 
            component={OTPVerificationScreen}
            options={{ title: 'Verify OTP' }}
          />
          <Stack.Screen 
            name="RoleSelection" 
            component={RoleSelectionScreen}
            options={{ title: 'Select Role' }}
          />
          <Stack.Screen 
            name="ConsumerSetup" 
            component={ConsumerSetupScreen}
            options={{ title: 'Consumer Setup' }}
          />
          <Stack.Screen 
            name="MeterReaderProfile" 
            component={MeterReaderProfile}
            options={{ title: 'Meter Reader Profile' }}
          />
          <Stack.Screen 
            name="ConsumerProfile" 
            component={ConsumerProfileScreen}
            options={{ title: 'Consumer Profile' }}
          />
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ title: 'Dashboard' }}
          />
          <Stack.Screen 
            name="CameraReading" 
            component={CameraReadingScreen}
            options={{ title: 'Camera Reading' }}
          />
          <Stack.Screen 
            name="SelfReading" 
            component={CameraScreen}
            options={{ title: 'Self Reading' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
