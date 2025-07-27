# Firebase Setup Guide for Lodugram

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "Lodugram"
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Google" provider
5. Enable it and add your support email
6. Save the changes

## Step 3: Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users
5. Click "Done"

## Step 4: Enable Storage

1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" for development
4. Select a location (same as Firestore)
5. Click "Done"

## Step 5: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register your app with a nickname (e.g., "Lodugram Web")
5. Copy the firebaseConfig object

## Step 6: Update firebaseConfig.js

Replace the placeholder values in `firebaseConfig.js` with your actual configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Step 7: Set Up Security Rules

### Firestore Rules

Go to Firestore Database > Rules and replace with:

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

### Storage Rules

Go to Storage > Rules and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 8: Test the Setup

1. Run your app: `npm start`
2. Try signing in with Google
3. Check if the username selection works
4. Verify data is being saved to Firestore

## Troubleshooting

### Common Issues:

1. **"Firebase App named '[DEFAULT]' already exists"**
   - Make sure you're only initializing Firebase once
   - Check that firebaseConfig.js is imported correctly

2. **"Permission denied" errors**
   - Check your Firestore security rules
   - Make sure authentication is working properly

3. **Google Sign-In not working**
   - Verify Google provider is enabled in Firebase Console
   - Check that your app is properly configured

4. **Username validation errors**
   - Check Firestore rules for the usernames collection
   - Verify the database is accessible

## Next Steps

After setting up Firebase:

1. Test the authentication flow
2. Add more features like posts and following
3. Deploy to your domain (adrit.gay)
4. Set up production security rules

## Support

If you encounter issues:
- Check Firebase Console logs
- Review the README.md file
- Check the console for error messages 