import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const LoginScreen = ({ navigation }) => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp && !displayName) {
      Alert.alert('Error', 'Please enter your display name');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, displayName);
        Alert.alert('Success', 'Account created successfully!');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Authentication failed. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Fixed Header with Blur */}
      <BlurView intensity={20} style={styles.fixedHeader}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
        </View>
      </BlurView>

      {/* Main Content */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Lodugram</Text>
          <Text style={styles.tagline}>Share your moments</Text>
        </View>

        <View style={styles.formContainer}>
          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Display Name"
              placeholderTextColor="#666"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.authButton}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.authButtonText}>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text style={styles.switchButtonText}>
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by adrit.gay</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 45, // Account for status bar
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 120, // Space for fixed header
    paddingBottom: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  formContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    width: '100%',
    maxWidth: 300,
  },
  authButton: {
    backgroundColor: '#0095f6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    minWidth: 250,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginBottom: 20,
  },
  switchButtonText: {
    color: '#0095f6',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  termsText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#444',
    fontSize: 14,
  },
});

export default LoginScreen; 