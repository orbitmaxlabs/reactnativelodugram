// ProfileContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { getFirebaseDB } from './firebaseConfig';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    username: 'johndoe',
    name: 'John Doe',
    bio: 'Digital creator | Photography enthusiast 📸\nLiving life one frame at a time ✨',
    profilePic: 'https://via.placeholder.com/150/666666/FFFFFF?text=JD',
    coverPhoto: 'https://via.placeholder.com/400x200/4a90e2/FFFFFF?text=Cover+Photo',
    posts: 42,
    followers: 1234,
    following: 567,
  });

  // Update profile data when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        username: userProfile.username || 'johndoe',
        name: userProfile.displayName || 'User',
        bio: userProfile.bio || 'Welcome to Lodugram! 📸',
        profilePic: userProfile.profilePic || 'https://via.placeholder.com/150/666666/FFFFFF?text=U',
        coverPhoto: userProfile.coverPhoto || 'https://via.placeholder.com/400x200/4a90e2/FFFFFF?text=Cover+Photo',
        posts: userProfile.posts || 0,
        followers: userProfile.followers || 0,
        following: userProfile.following || 0,
      });
    }
  }, [userProfile]);

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        ...updates
      }));

      // Update Firestore
      const db = getFirebaseDB();
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, updates);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    profileData,
    updateProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}; 