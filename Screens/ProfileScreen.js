// ProfileScreen.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { useProfile } from '../ProfileContext';
import { useAuth } from '../AuthContext';

/**
 * ProfileScreen component - Instagram-style profile interface
 */
export default function ProfileScreen({ navigation }) {
  const { profileData } = useProfile();
  const { signOutUser } = useAuth();

  // Mock posts data - you can set this to empty array to test empty state
  const posts = Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    image: `https://via.placeholder.com/300x300/333333/FFFFFF?text=Post+${index + 1}`,
    caption: `This is post ${index + 1}`,
    username: profileData.username,
    userProfilePic: profileData.profilePic,
  }));

  const renderPost = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.postContainer}
      onPress={() => navigation.navigate('PostView', { 
        posts: posts, 
        initialIndex: index 
      })}
    >
      <Image source={{ uri: item.image }} style={styles.postImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Cover Photo Background */}
      <Image source={{ uri: profileData.coverPhoto }} style={styles.coverPhoto} />
      
      {/* Fixed Header with Blur */}
      <BlurView intensity={20} style={styles.fixedHeader}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.headerContent}>
          <Text style={styles.usernameHeader}>{profileData.username}</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="pencil" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('UserSearch')}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={signOutUser}
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Picture and Name */}
        <View style={styles.profileSection}>
          <View style={styles.profilePicContainer}>
            <Image source={{ uri: profileData.profilePic }} style={styles.profilePic} />
          </View>
          <Text style={styles.profileName}>{profileData.name}</Text>
        </View>

        {/* Bio Section */}
        <View style={styles.bioSection}>
          <Text style={styles.bio}>{profileData.bio}</Text>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsContainer}>
          {posts.length > 0 ? (
            <FlatList
              data={posts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIcon}>
                <Ionicons name="camera-outline" size={48} color="#666" />
              </View>
              <Text style={styles.emptyStateTitle}>No Posts Yet</Text>
              <Text style={styles.emptyStateSubtitle}>
                When you share photos and videos, they'll appear on your profile.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// Define reusable styles for ProfileScreen UI
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
    height: 200, // Adjust height as needed
    zIndex: -1, // Ensure it's behind other content
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  usernameHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
    padding: 8,
  },
  scrollContent: {
    flex: 1,
    paddingTop: 100, // Space for fixed header
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  profilePicContainer: {
    marginBottom: 10,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  bioSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bio: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  postsContainer: {
    paddingHorizontal: 1,
    minHeight: 200,
  },
  postContainer: {
    flex: 1,
    margin: 1,
    aspectRatio: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 