// EditProfileScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, StatusBar, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useProfile } from '../ProfileContext';

/**
 * EditProfileScreen component - Instagram-style edit profile interface
 */
export default function EditProfileScreen({ navigation }) {
  const { profileData, updateProfile } = useProfile();
  const [localProfileData, setLocalProfileData] = useState(profileData);

  const [editingField, setEditingField] = useState(null);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert('Permission Required', 'Camera and media library permissions are required to change photos.');
      return false;
    }
    return true;
  };

  const selectImage = async (type) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    let result;
    
    if (type === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    }

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }
    return null;
  };

  const selectCoverImage = async (type) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    let result;
    
    if (type === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 1],
        quality: 0.8,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 1],
        quality: 0.8,
      });
    }

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }
    return null;
  };

  const handleProfilePhotoChange = async () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const uri = await selectImage('camera');
            if (uri) {
              updateField('profilePic', uri);
            }
          }
        },
        {
          text: 'Photo Library',
          onPress: async () => {
            const uri = await selectImage('gallery');
            if (uri) {
              updateField('profilePic', uri);
            }
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleCoverPhotoChange = async () => {
    Alert.alert(
      'Change Cover Photo',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const uri = await selectCoverImage('camera');
            if (uri) {
              updateField('coverPhoto', uri);
            }
          }
        },
        {
          text: 'Photo Library',
          onPress: async () => {
            const uri = await selectCoverImage('gallery');
            if (uri) {
              updateField('coverPhoto', uri);
            }
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleSave = () => {
    // Update the global profile data
    updateProfile(localProfileData);
    navigation.goBack();
  };

  const updateField = (field, value) => {
    setLocalProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderEditField = (label, field, value, multiline = false) => (
    <View style={styles.editField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, multiline && styles.multilineInput]}
        value={localProfileData[field]}
        onChangeText={(text) => updateField(field, text)}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#666"
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cover Photo Background */}
      <Image source={{ uri: localProfileData.coverPhoto }} style={styles.coverPhoto} />
      
      {/* Fixed Header with Blur */}
      <BlurView intensity={20} style={styles.fixedHeader}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.profilePicContainer}>
            <Image source={{ uri: localProfileData.profilePic }} style={styles.profilePic} />
            <TouchableOpacity style={styles.editPicButton} onPress={handleProfilePhotoChange}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.changePhotoButton} onPress={handleProfilePhotoChange}>
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Cover Photo Section */}
        <View style={styles.coverSection}>
          <Text style={styles.sectionTitle}>Cover Photo</Text>
          <View style={styles.coverContainer}>
            <Image source={{ uri: localProfileData.coverPhoto }} style={styles.coverPreview} />
            <TouchableOpacity style={styles.editCoverButton} onPress={handleCoverPhotoChange}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.changeCoverButton} onPress={handleCoverPhotoChange}>
            <Text style={styles.changePhotoText}>Change Cover Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Fields */}
        <View style={styles.editFields}>
          {renderEditField('Username', 'username')}
          {renderEditField('Name', 'name')}
          {renderEditField('Bio', 'bio', null, true)}
        </View>
      </ScrollView>
    </View>
  );
}

// Define reusable styles for EditProfileScreen UI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  coverPhoto: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: -1,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 45,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#0095f6',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    flex: 1,
    paddingTop: 100,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  profilePicContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editPicButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0095f6',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoButton: {
    paddingVertical: 8,
  },
  changePhotoText: {
    color: '#0095f6',
    fontSize: 16,
    fontWeight: '600',
  },
  coverSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  coverContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  coverPreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  editCoverButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeCoverButton: {
    paddingVertical: 8,
  },
  editFields: {
    paddingHorizontal: 16,
  },
  editField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
}); 