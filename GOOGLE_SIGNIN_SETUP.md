# Google Sign-In Setup Guide

## Current Status

The app currently uses a mock authentication system for testing. To implement real Google Sign-In, follow these steps:

## Step 1: Set Up Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select your existing project
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add your app's bundle identifier and SHA-1 fingerprint

## Step 2: Configure Firebase Authentication

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable Google provider
3. Add your OAuth 2.0 Client ID and Client Secret

## Step 3: Update AuthContext.js

Replace the mock authentication in `AuthContext.js` with real Google Sign-In:

```javascript
import * as Google from 'expo-google-app-auth';

const signInWithGoogle = async () => {
  try {
    const result = await Google.logInAsync({
      androidClientId: 'YOUR_ANDROID_CLIENT_ID',
      iosClientId: 'YOUR_IOS_CLIENT_ID',
      webClientId: 'YOUR_WEB_CLIENT_ID',
      scopes: ['profile', 'email'],
    });

    if (result.type === 'success') {
      const { accessToken, idToken } = result;
      
      // Create Firebase credential
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      
      // Sign in to Firebase
      const userCredential = await signInWithCredential(auth, credential);
      return userCredential.user;
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};
```

## Step 4: Install Required Packages

```bash
npx expo install expo-google-app-auth
```

## Step 5: Configure app.json

Add the following to your `app.json`:

```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.lodugram",
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.lodugram",
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

## Step 6: Download Configuration Files

1. Download `google-services.json` from Firebase Console
2. Download `GoogleService-Info.plist` from Firebase Console
3. Place both files in your project root

## Testing

1. Run the app: `npm start`
2. Test Google Sign-In on both Android and iOS
3. Verify that user data is saved to Firestore

## Troubleshooting

- Make sure your OAuth client IDs are correct
- Verify that your app's bundle identifier matches
- Check that Firebase configuration is correct
- Ensure Firestore rules allow write access

## Next Steps

After implementing real Google Sign-In:
1. Test the authentication flow
2. Add user profile management
3. Implement the following system
4. Add post creation and sharing 