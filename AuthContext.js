import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDB } from './firebaseConfig';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          
          // Get user profile from Firestore
          try {
            const db = getFirebaseDB();
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const profileData = userDoc.data();
              setUserProfile(profileData);
              setUsername(profileData.username);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setUser(null);
          setUserProfile(null);
          setUsername(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithEmail = async (email, password) => {
    try {
      const auth = getFirebaseAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email, password, displayName) => {
    try {
      const auth = getFirebaseAuth();
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase profile with display name
      await updateFirebaseProfile(result.user, {
        displayName: displayName
      });

      return result.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const setUserUsername = async (newUsername) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      // Check if username is already taken
      const db = getFirebaseDB();
      const usernameDoc = await getDoc(doc(db, 'usernames', newUsername));
      if (usernameDoc.exists()) {
        throw new Error('Username already taken');
      }

      // Create user profile in Firestore
      const userProfileData = {
        uid: user.uid,
        email: user.email,
        username: newUsername,
        displayName: user.displayName || 'User',
        profilePic: user.photoURL || 'https://via.placeholder.com/150/666666/FFFFFF?text=U',
        coverPhoto: 'https://via.placeholder.com/400x200/4a90e2/FFFFFF?text=Cover+Photo',
        bio: 'Welcome to Lodugram! 📸',
        createdAt: new Date(),
        posts: 0,
        followers: 0,
        following: 0,
      };

      // Save user profile
      await setDoc(doc(db, 'users', user.uid), userProfileData);
      
      // Reserve username
      await setDoc(doc(db, 'usernames', newUsername), {
        uid: user.uid,
        createdAt: new Date()
      });

      setUserProfile(userProfileData);
      setUsername(newUsername);
    } catch (error) {
      console.error('Error saving username:', error);
      throw error;
    }
  };

  const value = {
    user,
    username,
    userProfile,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOutUser,
    setUserUsername,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
