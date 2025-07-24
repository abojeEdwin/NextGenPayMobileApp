import React, { useEffect, useRef } from 'react'; 
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,   
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();

  
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1, 
        duration: 1500, 
        easing: Easing.ease, 
        useNativeDriver: true, 
      }),
      Animated.timing(slideAnim, {
        toValue: 0, 
        duration: 1000, 
        easing: Easing.out(Easing.ease), 
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]); 
  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {}
        <Image
          source={{ uri: 'https://placehold.co/600x400/A8DADC/000000?text=Happy+Shopping' }} 
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <View style={styles.overlay} /> {}

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.welcomeText}>Welcome to NextGenPay!</Text>
          <Text style={styles.tagline}>Your seamless shopping and payment experience starts here.</Text>

          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D6EAF8', 
  },
  container: {
    flex: 1,
    backgroundColor: '#D6EAF8', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.7, 
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)', 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1, 
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF', 
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)', 
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#F0F8FF', 
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  getStartedButton: {
    backgroundColor: '#3498DB', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
