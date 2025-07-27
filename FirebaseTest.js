// FirebaseTest.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth, db } from './firebaseConfig';

const FirebaseTest = () => {
  const [status, setStatus] = useState('Testing Firebase...');

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Test if auth is available
        if (auth) {
          console.log('Firebase Auth initialized successfully');
          setStatus('Firebase Auth: ✅ OK');
        } else {
          setStatus('Firebase Auth: ❌ Failed');
        }

        // Test if Firestore is available
        if (db) {
          console.log('Firestore initialized successfully');
          setStatus(prev => prev + '\nFirestore: ✅ OK');
        } else {
          setStatus(prev => prev + '\nFirestore: ❌ Failed');
        }
      } catch (error) {
        console.error('Firebase test error:', error);
        setStatus(`Firebase Error: ${error.message}`);
      }
    };

    testFirebase();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Status</Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  status: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default FirebaseTest; 
