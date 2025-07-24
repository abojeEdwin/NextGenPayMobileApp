import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message'; 

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="registration" options={{ title: 'Register' }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="dashboard" options={{ title: 'Dashboard', headerShown: false }} />
        <Stack.Screen name="generatewallet" options={{ title: 'Generate Wallet' }} />
        <Stack.Screen name="addfunds" options={{ title: 'Add Funds' }} />
        <Stack.Screen name="displaywallet" options={{ title: 'Your Wallet' }} />
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="scantopay" options={{ title: 'Scan to Pay' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast /> {}
    </>
  );
}