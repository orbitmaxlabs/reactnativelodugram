// ReelsScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * ReelsScreen component - Instagram-style reels interface
 */
export default function ReelsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Reels</Text>
      <Text style={styles.subText}>Watch and create short videos</Text>
    </View>
  );
}

// Define reusable styles for ReelsScreen UI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
}); 