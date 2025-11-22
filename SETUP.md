# Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
4. Create Firestore Database:
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode (we'll add security rules later)
   - Choose a location (preferably close to UAE)
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Click the web icon (</>) to add a web app
   - Copy the config values

6. Update `src/config/firebase.ts` with your Firebase config, or create a `.env` file:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Step 3: OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new API key
5. Add it to your `.env` file:

```env
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-api-key-here
```

## Step 4: Firestore Security Rules

Add these security rules to your Firestore database (Firestore Database > Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /{collection}/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Allow users to create documents with their own userId
    match /{collection}/{document} {
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Step 5: Create Assets

Create placeholder images in the `assets/` folder:
- `icon.png` (1024x1024) - App icon
- `splash.png` (1284x2778) - Splash screen
- `adaptive-icon.png` (1024x1024) - Android adaptive icon
- `favicon.png` (48x48) - Web favicon
- `notification-icon.png` (96x96) - Notification icon

You can use placeholder images for now and replace them later.

## Step 6: Run the App

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app on your phone

## Step 7: Test the App

1. Sign up with a test email
2. Add your first account
3. Add a transaction
4. Set up a budget
5. Try the AI Coach feature

## Troubleshooting

### Firebase Connection Issues
- Make sure your Firebase project is active
- Check that Firestore is enabled
- Verify your config values are correct

### OpenAI API Errors
- Verify your API key is correct
- Check your OpenAI account has credits
- Ensure the API key has proper permissions

### Build Errors
- Clear cache: `expo start -c`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check that all dependencies are installed

### TypeScript Errors
- Run `npx tsc --noEmit` to check for type errors
- Make sure all imports are correct

## Next Steps

1. Customize the app design and colors
2. Add more UAE-specific merchants to categorization
3. Set up push notifications (requires additional Firebase setup)
4. Test on physical devices
5. Prepare for production deployment

