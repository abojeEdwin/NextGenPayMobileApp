import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router'; 




const DisplayWalletScreen = () => {
  const router = useRouter();
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh


  const getAuthenticatedCustomerId = () => {
  
    return "customer123"; 
  };

  const fetchWalletDetails = async () => {
    const customerId = getAuthenticatedCustomerId();
    if (!customerId) {
      Alert.alert('Authentication Error', 'Customer ID not found. Please log in again.');
      setIsLoading(false); 
      return;
    }

  
    console.log(`[DisplayWalletScreen] Attempting to fetch wallet for customerId: ${customerId}`);

    setIsLoading(true); 
    try {
      
      const response = await fetch(`${API_BASE_URL_FETCH_WALLET}/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          
        },
      });

      
      console.log(`[DisplayWalletScreen] Fetch response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        setWalletData(data); 
        console.log('[DisplayWalletScreen] Wallet details fetched from backend:', data);
      } else if (response.status === 404) {
        
        setWalletData(null); 
        Alert.alert('Wallet Not Found', 'No wallet found for your account. Please generate one.');
        console.log('[DisplayWalletScreen] No existing wallet found for this customer (404).');
      } else {
        
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to fetch wallet details.');
        console.error('[DisplayWalletScreen] Failed to fetch wallet:', errorData);
        console.error(`[DisplayWalletScreen] HTTP Status: ${response.status}`);
        setWalletData(null); 
      }
    } catch (error) {
      console.error('[DisplayWalletScreen] Network or unexpected error during wallet fetch:', error);
      Alert.alert('Error', 'Could not connect to server to fetch wallet details. Please check your network.');
      setWalletData(null); 
    } finally {
      setIsLoading(false); 
      setRefreshing(false); 
    }
  };

  
  useFocusEffect(
    useCallback(() => {
      fetchWalletDetails(); 
      return () => {
        
        setWalletData(null);
        setIsLoading(true); 
      };
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchWalletDetails();
  }, []); 

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498DB" />
          <Text style={styles.loadingText}>Loading wallet details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!walletData || !walletData.accountNumber) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No wallet found. Please generate one first.</Text>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => router.replace('/generatewallet')}
          >
            <Text style={styles.buttonText}>Generate Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonPrimary, { marginTop: 10, backgroundColor: '#95A5A6' }]}
            onPress={() => router.replace('/dashboard')} 
          >
            <Text style={styles.buttonText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3498DB" />
        }
      >
        <View style={styles.card}>
          <Text style={styles.title}>Your Wallet</Text>

          <View style={styles.detailsSection}>
            <Text style={styles.detailsLabel}>Account Number:</Text>
            <Text style={styles.detailsValue}>{walletData.accountNumber}</Text>

            <Text style={styles.detailsLabel}>Current Balance:</Text>
            <Text style={styles.detailsValue}>${walletData.balance ? parseFloat(walletData.balance).toFixed(2) : '0.00'}</Text>

            {}
            {walletData.message && (
              <>
                <Text style={styles.detailsLabel}>Message:</Text>
                <Text style={styles.detailsValue}>{walletData.message}</Text>
              </>
            )}

            <TouchableOpacity
              style={[styles.buttonPrimary, { marginTop: 30 }]}
              onPress={() => router.replace('/dashboard')}
            >
              <Text style={styles.buttonText}>Go to Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonPrimary, { marginTop: 10, backgroundColor: '#2ECC71' }]}
              onPress={() => router.push('/addfunds')} 
            >
              <Text style={styles.buttonText}>Add Funds</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonPrimary, { marginTop: 10, backgroundColor: '#F39C12' }]}
              onPress={onRefresh} 
            >
              <Text style={styles.buttonText}>Refresh Balance</Text>
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
  detailsSection: {
    width: '100%',
    paddingHorizontal: 10,
  },
  detailsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
    marginTop: 15,
    marginBottom: 5,
  },
  detailsValue: {
    fontSize: 18,
    color: '#2C3E50',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#34495E',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default DisplayWalletScreen;
