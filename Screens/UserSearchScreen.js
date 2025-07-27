import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAuth } from '../AuthContext';
import ChatService from '../ChatService';

const UserSearchScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = async () => {
    try {
      const users = await ChatService.getAllUsers();
      // Filter out current user
      const filteredUsers = users.filter(u => u.uid !== user.uid);
      setAllUsers(filteredUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const filtered = allUsers.filter(user => 
        user.username?.toLowerCase().includes(query.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleStartChat = async (selectedUser) => {
    try {
      setLoading(true);
      // Check if chat already exists
      const existingChat = await ChatService.getUserChats(user.uid);
      const chatExists = existingChat.find(chat => 
        !chat.isGroup && chat.participants.some(p => p.id === selectedUser.uid)
      );

      if (chatExists) {
        // Navigate to existing chat
        navigation.navigate('ChatMain', { selectedChat: chatExists });
      } else {
        // Create new chat
        const chatId = await ChatService.createChat(user.uid, selectedUser.uid);
        Alert.alert('Success', `Chat created with @${selectedUser.username}!`);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      Alert.alert('Error', 'Failed to start chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>
            {item.displayName?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userDisplayName}>{item.displayName || 'User'}</Text>
          <Text style={styles.userUsername}>@{item.username}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.chatButton, loading && styles.chatButtonDisabled]}
        onPress={() => handleStartChat(item)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.chatButtonText}>Message</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Fixed Header with Blur */}
      <BlurView intensity={20} style={styles.fixedHeader}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Find Users</Text>
          <View style={{ width: 24 }} />
        </View>
      </BlurView>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search by username or name"
            placeholderTextColor="#666"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {searchQuery.length > 0 ? (
          searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noResults}>
              <Ionicons name="search" size={48} color="#666" />
              <Text style={styles.noResultsText}>No users found</Text>
              <Text style={styles.noResultsSubtext}>Try a different search term</Text>
            </View>
          )
        ) : (
          <View style={styles.initialState}>
            <Ionicons name="people" size={48} color="#666" />
            <Text style={styles.initialStateText}>Search for users</Text>
            <Text style={styles.initialStateSubtext}>Find and follow people you know</Text>
          </View>
        )}
      </View>
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    paddingTop: 100, // Space for fixed header
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  resultsContainer: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userDisplayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 14,
    color: '#888',
  },
  chatButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chatButtonDisabled: {
    backgroundColor: '#333',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  initialState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  initialStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  initialStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default UserSearchScreen; 