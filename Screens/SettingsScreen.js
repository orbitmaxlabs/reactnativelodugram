// SettingsScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * SettingsScreen component - simple UI for the Settings tab
 */
export default function SettingsScreen() {
  return (
    // Same container style as HomeScreen for UI consistency
    <View style={styles.container}>
      {/* Text showing settings info */}
      <Text style={styles.text}>Here are your settings.</Text>
    </View>
  );
}

// Define reusable styles for SettingsScreen UI
const styles = StyleSheet.create({
  container: {
    flex: 1,                  
    justifyContent: 'center', 
    alignItems: 'center',     
    backgroundColor: '#121212', 
  },
  text: {
    fontSize: 18,
    color: '#fff',            
  },
});
