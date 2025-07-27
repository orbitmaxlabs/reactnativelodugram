# Lodugram

A social media app built with React Native and Firebase, inspired by Instagram. Users can sign up using Google authentication, choose a username, and follow other users.

## Features

- 🔐 Google Sign-In authentication
- 👤 Username selection and validation
- 📱 Instagram-style UI with dark theme
- 🔥 Firebase integration for data storage
- 📸 Photo sharing capabilities
- 👥 User following system

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication and select Google as a sign-in method
4. Create a Firestore database
5. Enable Storage
6. Get your Firebase configuration

### 3. Configure Firebase

1. Open `firebaseConfig.js`
2. Replace the placeholder values with your actual Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Firebase Security Rules

Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data and public user data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Usernames are public for checking availability
    match /usernames/{username} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Posts can be read by anyone, written by authenticated users
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Run the App

```bash
# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## Project Structure

```
app1/
├── App.js                 # Main app component with navigation
├── AuthContext.js         # Authentication context
├── ProfileContext.js      # Profile management context
├── firebaseConfig.js      # Firebase configuration
├── Screens/
│   ├── LoginScreen.js     # Google sign-in screen
│   ├── UsernameScreen.js  # Username selection screen
│   ├── HomeScreen.js      # Main feed screen
│   ├── SearchScreen.js    # User search screen
│   ├── ProfileScreen.js   # User profile screen
│   ├── AddScreen.js       # Add post screen
│   └── EditProfileScreen.js # Edit profile screen
└── assets/               # App icons and images
```

## Authentication Flow

1. **Login Screen**: Users sign in with Google
2. **Username Screen**: New users choose a unique username
3. **Main App**: Authenticated users access the main app features

## Database Schema

### Users Collection
```javascript
{
  uid: "user_id",
  email: "user@example.com",
  displayName: "User Name",
  photoURL: "profile_photo_url",
  username: "username",
  createdAt: timestamp,
  followers: ["user_id_1", "user_id_2"],
  following: ["user_id_3", "user_id_4"],
  posts: ["post_id_1", "post_id_2"]
}
```

### Usernames Collection
```javascript
{
  uid: "user_id",
  username: "username",
  createdAt: timestamp
}
```

## Web Version

The app is designed to work with your domain `adrit.gay`. To deploy the web version:

1. Build the web version: `npm run web`
2. Deploy to your hosting service
3. Configure your domain to point to the deployed app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@adrit.gay or create an issue in the repository. 