import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';

const DashboardScreen = () => {
  const router = useRouter();

  const handleDashboardItemPress = (screenName) => {
    router.push(`/${screenName}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome Back!</Text>
          <Text style={styles.subHeaderText}>Shopping Made Easy.</Text>
        </View>

        <View style={styles.gridContainer}>
          {}
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => handleDashboardItemPress('generatewallet')}
          >
            <Text style={styles.icon}>💳</Text> {}
            <Text style={styles.gridItemText}>Generate Wallet</Text>
          </TouchableOpacity>

          {}
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => handleDashboardItemPress('scantopay')}
          >
            <Text style={styles.icon}>📱</Text> {}
            <Text style={styles.gridItemText}>Scan to Pay</Text>
          </TouchableOpacity>

          {}
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => handleDashboardItemPress('updateProfile')}
          >
            <Text style={styles.icon}>👤</Text> {}
            <Text style={styles.gridItemText}>Update Profile</Text>
          </TouchableOpacity>

          {}
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => handleDashboardItemPress('addfunds')}
          >
            <Text style={styles.icon}>💰</Text> {}
            <Text style={styles.gridItemText}>Add Funds</Text>
          </TouchableOpacity>

          {}
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => handleDashboardItemPress('displaywallet')}
          >
            <Text style={styles.icon}>👛</Text> {}
            <Text style={styles.gridItemText}>Display Wallet</Text>
          </TouchableOpacity>

          {}
        </View>

        {}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Quick Access & Secure Transactions</Text>
          <Text style={styles.infoDescription}>
            Your financial journey, simplified. Access all features instantly.
          </Text>
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
    padding: 20,
    alignItems: 'center',
  },
  header: {
    marginBottom: 40,
    marginTop: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50', 
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#34495E', 
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  gridItem: {
    backgroundColor: '#FFFFFF', 
    width: '45%', 
    aspectRatio: 1, 
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    padding: 10,
  },
  icon: {
    fontSize: 48, 
    marginBottom: 10,
  },
  gridItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#BEE3F8', 
    borderRadius: 10,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoDescription: {
    fontSize: 14,
    color: '#34495E',
    textAlign: 'center',
  },
});

export default DashboardScreen;
