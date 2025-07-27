// ChatService.js

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { getFirebaseDB } from './firebaseConfig';

class ChatService {
  // Get all users for search
  async getAllUsers() {
    try {
      const db = getFirebaseDB();
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  // Search users by username or display name
  async searchUsers(searchTerm) {
    try {
      const db = getFirebaseDB();
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return users.filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Create a new chat between two users
  async createChat(user1Id, user2Id) {
    try {
      const db = getFirebaseDB();
      const chatRef = await addDoc(collection(db, 'chats'), {
        participants: [user1Id, user2Id],
        lastMessage: null,
        lastMessageTime: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Add chat reference to both users
      await updateDoc(doc(db, 'users', user1Id), {
        chats: arrayUnion(chatRef.id)
      });
      await updateDoc(doc(db, 'users', user2Id), {
        chats: arrayUnion(chatRef.id)
      });

      return chatRef.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  // Create a group chat
  async createGroupChat(name, participants, createdBy) {
    try {
      const db = getFirebaseDB();
      const groupRef = await addDoc(collection(db, 'chats'), {
        name: name,
        participants: participants,
        createdBy: createdBy,
        isGroup: true,
        lastMessage: null,
        lastMessageTime: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Add chat reference to all participants
      for (const participantId of participants) {
        await updateDoc(doc(db, 'users', participantId), {
          chats: arrayUnion(groupRef.id)
        });
      }

      return groupRef.id;
    } catch (error) {
      console.error('Error creating group chat:', error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(chatId, senderId, text) {
    try {
      const db = getFirebaseDB();
      const messageRef = await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: senderId,
        text: text,
        timestamp: serverTimestamp(),
        read: false
      });

      // Update chat's last message
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return messageRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get user's chats
  async getUserChats(userId) {
    try {
      const db = getFirebaseDB();
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('participants', 'array-contains', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const chats = [];

      for (const chatDoc of snapshot.docs) {
        const chatData = chatDoc.data();
        
        // Get participant details for each chat
        const participants = [];
        for (const participantId of chatData.participants) {
          if (participantId !== userId) {
            const userDoc = await getDoc(doc(db, 'users', participantId));
            if (userDoc.exists()) {
              participants.push({
                id: participantId,
                ...userDoc.data()
              });
            }
          }
        }

        chats.push({
          id: chatDoc.id,
          ...chatData,
          participants: participants
        });
      }

      return chats;
    } catch (error) {
      console.error('Error getting user chats:', error);
      throw error;
    }
  }

  // Get chat messages
  async getChatMessages(chatId) {
    try {
      const db = getFirebaseDB();
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting chat messages:', error);
      throw error;
    }
  }

  // Listen to chat messages in real-time
  subscribeToChatMessages(chatId, callback) {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    });
  }

  // Listen to user's chats in real-time
  subscribeToUserChats(userId, callback) {
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, async (snapshot) => {
      const chats = [];

      for (const chatDoc of snapshot.docs) {
        const chatData = chatDoc.data();
        
        // Get participant details for each chat
        const participants = [];
        for (const participantId of chatData.participants) {
          if (participantId !== userId) {
            const userDoc = await getDoc(doc(db, 'users', participantId));
            if (userDoc.exists()) {
              participants.push({
                id: participantId,
                ...userDoc.data()
              });
            }
          }
        }

        chats.push({
          id: chatDoc.id,
          ...chatData,
          participants: participants
        });
      }

      callback(chats);
    });
  }

  // Mark messages as read
  async markMessagesAsRead(chatId, userId) {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(
        messagesRef,
        where('senderId', '!=', userId),
        where('read', '==', false)
      );
      
      const snapshot = await getDocs(q);
      const updatePromises = snapshot.docs.map(doc =>
        updateDoc(doc.ref, { read: true })
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  // Delete a message
  async deleteMessage(chatId, messageId) {
    try {
      await deleteDoc(doc(db, 'chats', chatId, 'messages', messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Leave a group chat
  async leaveGroupChat(chatId, userId) {
    try {
      await updateDoc(doc(db, 'chats', chatId), {
        participants: arrayRemove(userId)
      });
      
      await updateDoc(doc(db, 'users', userId), {
        chats: arrayRemove(chatId)
      });
    } catch (error) {
      console.error('Error leaving group chat:', error);
      throw error;
    }
  }
}

export default new ChatService(); 