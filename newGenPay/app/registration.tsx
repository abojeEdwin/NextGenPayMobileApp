import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message'; 



const RegistrationScreen = () => {
  const [userData, setUserData] = useState({
    email: '',
    phoneNumber: '',
    password: '',
  });


  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUserChange = (name, value) => {
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!userData.email || !userData.phoneNumber || !userData.password) {
      Toast.show({
        type: 'error',
        text1: 'Input Error',
        text2: 'Please fill in all required fields (Email, Phone Number, Password)!',
      });
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        password: userData.password,
      };

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Success!',
          text2: responseData.message || 'Registration successful!',
        });
        console.log('Registration successful:', responseData);

        
        setTimeout(() => {
          router.replace('/login');
        }, 1500); 
      } else {
        let errorMessage = 'Registration failed. Please try again.';

        if (responseData && responseData.message) {
          const backendMessage = responseData.message.toLowerCase();
          if (backendMessage.includes('email already exists') || backendMessage.includes('duplicate email')) {
            errorMessage = 'This email is already registered. Please use a different email.';
          } else if (backendMessage.includes('phone number already exists') || backendMessage.includes('duplicate phone')) {
            errorMessage = 'This phone number is already registered. Please use a different phone number.';
          } else if (backendMessage.includes('invalid input') || backendMessage.includes('validation failed')) {
            errorMessage = `Invalid input: ${responseData.message}`;
          } else {
            errorMessage = responseData.message;
          }
        } else if (response.status === 409) {
          errorMessage = 'A user with this email or phone number might already exist.';
        } else if (response.status === 400) {
          errorMessage = 'Invalid registration data. Please check your inputs.';
        }

        Toast.show({
          type: 'error',
          text1: 'Registration Error',
          text2: errorMessage,
        });
        console.error('Registration failed:', responseData);
        console.error('HTTP Status:', response.status);
      }
    } catch (error) {
      console.error('Network or unexpected error:', error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Could not connect to the server. Please check your network and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>
              Register Your Account
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={userData.email}
                onChangeText={(text) => handleUserChange('email', text)}
              />

              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={userData.phoneNumber}
                onChangeText={(text) => handleUserChange('phoneNumber', text)}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                value={userData.password}
                onChangeText={(text) => handleUserChange('password', text)}
              />

              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Register</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D6EAF8',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2C3E50',
    marginBottom: 24,
  },
  formSection: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegistrationScreen;
