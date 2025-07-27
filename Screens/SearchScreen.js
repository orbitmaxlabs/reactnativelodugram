// SearchScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * SearchScreen component - Instagram-style search interface
 */
export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search & Explore</Text>
      <Text style={styles.subText}>Discover people, places, and posts</Text>
    </View>
  );
}

// Define reusable styles for SearchScreen UI
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
