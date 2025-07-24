import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; 


const GenerateWalletScreen = () => {
  const [generatedWallet, setGeneratedWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [walletExists, setWalletExists] = useState(false); 
  const router = useRouter();

  
  const getAuthenticatedCustomerId = () => {
    console.log("Attempting to retrieve authenticated customer ID...");
    
    return "customer123"; 
  };

  
  const fetchWalletDetails = async (customerId) => {
    setIsLoading(true); 
    try {
      const response = await fetch(`${API_BASE_URL_FETCH_WALLET}/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
  
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedWallet(data); 
        setWalletExists(true); 
        await AsyncStorage.setItem('userWallet', JSON.stringify(data)); 
        console.log('Existing wallet found and cached:', data);
      
        router.replace('/displaywallet'); 
      } else if (response.status === 404) {
        
        setWalletExists(false);
        setGeneratedWallet(null);
        console.log('No existing wallet found for this customer.');
      } else {
       
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to fetch wallet details.');
        console.error('Failed to fetch wallet:', errorData);
        setWalletExists(false); 
      }
    } catch (error) {
      console.error('Network or unexpected error during wallet fetch:', error);
      Alert.alert('Error', 'Could not connect to server to check wallet status.');
      setWalletExists(false);
    } finally {
      setIsLoading(false); 
    }
  };

 
  useEffect(() => {
    const customerId = getAuthenticatedCustomerId();
    if (customerId) {
      fetchWalletDetails(customerId);
    } else {
      
      setIsLoading(false);
      setWalletExists(false);
      Alert.alert('Authentication Required', 'Please log in to manage your wallet.');
      ;
    }
  }, []); 

  const handleGenerateWallet = async () => {
    const customerId = getAuthenticatedCustomerId();

    if (!customerId) {
      Alert.alert('Authentication Error', 'Could not retrieve authenticated Customer ID. Please log in again.');
      return;
    }

    setIsLoading(true);
    setGeneratedWallet(null);

    try {
      const requestBody = {
        customerId: customerId,
      };

      const response = await fetch(API_BASE_URL_CREATE_WALLET, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert('Success', responseData.message || 'Wallet generated successfully!');
        setGeneratedWallet(responseData); 
        setWalletExists(true);
        await AsyncStorage.setItem('userWallet', JSON.stringify(responseData)); 
        console.log('Wallet generated and cached:', responseData);
        router.replace('/displaywallet');
      } else {
        let errorMessage = 'Failed to generate wallet. Please try again.';
        if (responseData && responseData.message) {
          errorMessage = responseData.message;
        } else if (response.status === 400) {
          errorMessage = 'Invalid request. Check if a wallet already exists or data is malformed.';
        } else if (response.status === 409) {
          errorMessage = 'A wallet already exists for this Customer ID.';
        }
        Alert.alert('Error', errorMessage);
        console.error('Wallet generation failed:', responseData);
        console.error('HTTP Status:', response.status);
      }
    } catch (error) {
      console.error('Network or unexpected error:', error);
      Alert.alert('Error', 'Could not connect to the server. Please check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Your Wallet</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3498DB" />
              <Text style={styles.loadingText}>Checking wallet status...</Text>
            </View>
          ) : (
            <View style={styles.formSection}>
              {walletExists && generatedWallet ? (
               
                <>
                  <Text style={styles.infoText}>
                    Wallet found! Redirecting to wallet details...
                  </Text>
                  <ActivityIndicator size="small" color="#3498DB" />
                </>
              ) : (
               
                <>
                  <Text style={styles.infoText}>
                    You don't have a wallet yet. Click the button below to generate your secure wallet.
                  </Text>
                  <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={handleGenerateWallet}
                    disabled={isLoading}
                  >
                    <Text style={styles.buttonText}>Generate Wallet</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
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
  infoText: {
    fontSize: 16,
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#34495E',
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
  walletDetailsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#EBF5FB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#AAB7B8',
  },
  detailsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 5,
  },
});

export default GenerateWalletScreen;
