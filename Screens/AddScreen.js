// AddScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * AddScreen component - Instagram-style create post interface
 */
export default function AddScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        <View style={styles.placeholderImage}>
          <Ionicons name="camera" size={48} color="#666" />
          <Text style={styles.placeholderText}>Select from camera roll</Text>
        </View>
      </View>

      {/* Bottom Options */}
      <View style={styles.bottomOptions}>
        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="images" size={24} color="#fff" />
          <Text style={styles.optionText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="camera" size={24} color="#fff" />
          <Text style={styles.optionText}>Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Define reusable styles for AddScreen UI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  shareButton: {
    padding: 8,
  },
  shareButtonText: {
    color: '#0095f6',
    fontSize: 16,
    fontWeight: '600',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  placeholderImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
  },
  bottomOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  optionButton: {
    alignItems: 'center',
    padding: 16,
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
}); 
