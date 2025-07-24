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



const LoginScreen = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (name, value) => {
    setCredentials((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      Toast.show({
        type: 'error',
        text1: 'Input Error',
        text2: 'Please enter both email and password.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        email: credentials.email,
        password: credentials.password,
      };

      const response = await fetch(`${API_BASE_URL}/login`, {
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
          text2: responseData.message || 'Login successful!',
        });
        console.log('Login successful:', responseData);

        setTimeout(() => {
          router.replace('/dashboard'); 
        }, 1500);
      } else {
        let errorMessage = 'Login failed. Please try again.';

        if (responseData && responseData.message) {
          const backendMessage = responseData.message.toLowerCase();
          if (backendMessage.includes('invalid credentials') || backendMessage.includes('authentication failed')) {
            errorMessage = 'Invalid email or password. Please try again.';
          } else if (backendMessage.includes('user not found')) {
            errorMessage = 'No account found with this email. Please register.';
          } else {
            errorMessage = responseData.message;
          }
        } else if (response.status === 401) {
          errorMessage = 'Invalid credentials. Please check your email and password.';
        } else if (response.status === 400) {
          errorMessage = 'Invalid login data. Please check your inputs.';
        }

        Toast.show({
          type: 'error',
          text1: 'Login Error',
          text2: errorMessage,
        });
        console.error('Login failed:', responseData);
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
              Login to Your Account
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={credentials.email}
                onChangeText={(text) => handleChange('email', text)}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                value={credentials.password}
                onChangeText={(text) => handleChange('password', text)}
              />

              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push('/registration')}
              >
                <Text style={styles.linkText}>Don't have an account? Register here.</Text>
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
    justifyContent: 'center',
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
  linkButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  linkText: {
    color: '#3498DB',
    fontSize: 14,
    textDecorationLine: 'underline',
  }
});

export default LoginScreen;
