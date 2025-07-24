import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';



const AddFundsScreen = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddFunds = async () => {
    if (!accountNumber || !amount) {
      Alert.alert('Error', 'Please enter both account number and amount.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid positive amount.');
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        accountNumber: accountNumber,
        amount: parsedAmount,
      };

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert('Success', responseData.message || 'Funds added successfully!');
        console.log('Funds added:', responseData);
        
        setAccountNumber('');
        setAmount('');
        
      } else {
        let errorMessage = 'Failed to add funds. Please try again.';
        if (responseData && responseData.message) {
          const backendMessage = responseData.message.toLowerCase();
          if (backendMessage.includes('account not found')) {
            errorMessage = 'Account not found. Please check the account number.';
          } else if (backendMessage.includes('invalid amount') || backendMessage.includes('validation failed')) {
            errorMessage = `Invalid input: ${responseData.message}`;
          } else {
            errorMessage = responseData.message;
          }
        } else if (response.status === 400) {
          errorMessage = 'Invalid request data. Please check your inputs.';
        } else if (response.status === 404) { 
          errorMessage = 'Account not found for the given number.';
        }
        Alert.alert('Error', errorMessage);
        console.error('Add funds failed:', responseData);
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
          <Text style={styles.title}>Add Funds to Wallet</Text>

          <View style={styles.formSection}>
            <Text style={styles.label}>Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter wallet account number"
              keyboardType="numeric"
              value={accountNumber}
              onChangeText={setAccountNumber}
            />

            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount to add"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handleAddFunds}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Add Funds</Text>
              )}
            </TouchableOpacity>
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

export default AddFundsScreen;
