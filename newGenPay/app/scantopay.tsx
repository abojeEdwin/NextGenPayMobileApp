import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView, 
  Platform, 
} from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import QRCode from 'react-native-qrcode-svg'; 


const ScanToPayScreen = () => {
  const router = useRouter();
  const [cashierId, setCashierId] = useState('');
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState(''); 
  const [isGenerating, setIsGenerating] = useState(false); 

  
  const getAuthenticatedCustomerId = () => {
  
    return "customer123"; 
  };

  const handleGenerateQRCode = useCallback(async () => {
    const customerId = getAuthenticatedCustomerId();

    if (!customerId) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: 'Customer ID not found. Please log in again.',
      });
      return;
    }

    if (!cashierId || !amount || !accountNumber) {
      Toast.show({
        type: 'error',
        text1: 'Input Error',
        text2: 'Please fill in all fields (Cashier ID, Amount, Account Number).',
      });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Amount',
        text2: 'Please enter a valid positive amount.',
      });
      return;
    }

    setIsGenerating(true);
    setQrCodeValue(''); 

    try {
    
      const qrData = {
        cashierId: cashierId,
        amount: parsedAmount,
        accountNumber: accountNumber,
        customerId: customerId,
      };

      
      const qrString = JSON.stringify(qrData);
      setQrCodeValue(qrString);

      Toast.show({
        type: 'success',
        text1: 'QR Code Generated!',
        text2: 'Show this QR code to the cashier to complete payment.',
      });
      console.log('QR Code Data:', qrString);

    } catch (error) {
      console.error('Error generating QR code:', error);
      Toast.show({
        type: 'error',
        text1: 'QR Generation Failed',
        text2: 'Could not generate QR code. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [cashierId, amount, accountNumber]); 

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20} 
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Scan to Pay</Text>

            <View style={styles.formSection}>
              <Text style={styles.label}>Cashier ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Cashier ID"
                keyboardType="default"
                autoCapitalize="none"
                value={cashierId}
                onChangeText={setCashierId}
              />

              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount to pay"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              <Text style={styles.label}>Your Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your wallet account number"
                keyboardType="numeric"
                value={accountNumber}
                onChangeText={setAccountNumber}
              />

              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleGenerateQRCode}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Generate QR Code</Text>
                )}
              </TouchableOpacity>

              {qrCodeValue ? (
                <View style={styles.qrCodeContainer}>
                  <Text style={styles.qrMessage}>Scan this QR code with the cashier's device:</Text>
                  <QRCode
                    value={qrCodeValue}
                    size={200}
                    color="black"
                    backgroundColor="white"
                  />
                  <Text style={styles.qrWarning}>
                    Do not close this screen until payment is confirmed.
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  qrCodeContainer: {
    marginTop: 30,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F8FF', 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BDC3C7',
  },
  qrMessage: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 15,
    textAlign: 'center',
  },
  qrWarning: {
    fontSize: 12,
    color: '#E74C3C', 
    marginTop: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ScanToPayScreen;
