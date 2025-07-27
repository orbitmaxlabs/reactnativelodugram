// HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

/**
 * HomeScreen component - Instagram-style feed
 */
export default function HomeScreen({ navigation }) {
  // Placeholder posts data
  const posts = [
    {
      id: '1',
      username: 'lodugram_user',
      userAvatar: '👤',
      image: '📸',
      caption: 'Welcome to Lodugram! Share your moments with the world 🌟',
      likes: 42,
      comments: 8,
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      username: 'photography_lover',
      userAvatar: '📷',
      image: '🌅',
      caption: 'Beautiful sunset captured today! Nature is amazing ✨',
      likes: 128,
      comments: 15,
      timestamp: '5 hours ago',
    },
    {
      id: '3',
      username: 'travel_enthusiast',
      userAvatar: '✈️',
      image: '🗺️',
      caption: 'Exploring new places and making memories! #travel #adventure',
      likes: 89,
      comments: 12,
      timestamp: '1 day ago',
    },
  ];

  const renderPost = (post) => (
    <View key={post.id} style={styles.post}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userAvatar}>{post.userAvatar}</Text>
          <View>
            <Text style={styles.username}>{post.username}</Text>
            <Text style={styles.timestamp}>{post.timestamp}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <View style={styles.postImage}>
        <Text style={styles.imagePlaceholder}>{post.image}</Text>
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="paper-plane-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Post Stats */}
      <View style={styles.postStats}>
        <Text style={styles.likes}>{post.likes} likes</Text>
      </View>

      {/* Post Caption */}
      <View style={styles.postCaption}>
        <Text style={styles.captionText}>
          <Text style={styles.username}>{post.username}</Text> {post.caption}
        </Text>
      </View>

      {/* Comments */}
      <TouchableOpacity style={styles.comments}>
        <Text style={styles.commentsText}>View all {post.comments} comments</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Fixed Header with Blur */}
      <BlurView intensity={20} style={styles.fixedHeader}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.headerContent}>
          <Text style={styles.usernameHeader}>Lodugram</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddPost')}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Posts */}
        {posts.map(renderPost)}
      </ScrollView>
    </View>
  );
}

// Define reusable styles for HomeScreen UI
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  usernameHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    padding: 8,
  },
  scrollContent: {
    flex: 1,
    paddingTop: 100, // Space for fixed header
  },
  post: {
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    fontSize: 32,
    marginRight: 10,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  postImage: {
    height: 300,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    fontSize: 48,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 15,
  },
  postStats: {
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  likes: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  postCaption: {
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  captionText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  comments: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  commentsText: {
    fontSize: 14,
    color: '#666',
  },
});
