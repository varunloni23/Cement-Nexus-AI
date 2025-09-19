# Firebase Deployment Guide for CementAI Nexus

## Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created: `nexus-4b4ba`
- Service account key downloaded from Firebase Console

## Setup Instructions

### 1. Firebase Authentication Setup
```bash
# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init
```

### 2. Service Account Configuration
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Save as `service-account-key.json` in project root
4. Update `.env` file:
```
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
```

### 3. Database Rules Configuration
The Firebase Realtime Database rules are configured in `firebase-database-rules.json`:
- Authenticated users can read/write plant data
- Data is indexed for efficient queries
- Separate paths for real-time data, historical data, and AI insights

### 4. Deployment Commands

#### Deploy Frontend Only
```bash
npm run build:frontend
firebase deploy --only hosting
```

#### Deploy Database Rules
```bash
firebase deploy --only database
```

#### Deploy Functions (Backend)
```bash
npm run build:backend
firebase deploy --only functions
```

#### Full Deployment
```bash
npm run deploy
```

### 5. Environment Configuration for Production

#### Frontend Environment Variables
Create `frontend/.env.production`:
```
NEXT_PUBLIC_FIREBASE_CONFIG='{
  "apiKey": "AIzaSyDmiyJI9HLybYo5QE_k-bNuSEbeQOtXCXY",
  "authDomain": "nexus-4b4ba.firebaseapp.com",
  "projectId": "nexus-4b4ba",
  "storageBucket": "nexus-4b4ba.firebasestorage.app",
  "messagingSenderId": "492142282065",
  "appId": "1:492142282065:web:5ce721fc60c3286f8b7f70",
  "measurementId": "G-0W3KCLKSZ4",
  "databaseURL": "https://nexus-4b4ba-default-rtdb.firebaseio.com/"
}'
NEXT_PUBLIC_BACKEND_URL=https://nexus-4b4ba-default-rtdb.firebaseio.com
```

#### Backend Environment Variables
Configure in Firebase Functions:
```bash
firebase functions:config:set gemini.api_key="AIzaSyDDyDufEbJ2WcN-PWMiHrIBQYcN7DGliUo"
firebase functions:config:set firebase.project_id="nexus-4b4ba"
```

### 6. Monitoring and Analytics
- Firebase Console provides real-time monitoring
- Google Analytics integration with measurementId
- Performance monitoring available
- Error reporting via Firebase Crashlytics

### 7. Security Considerations
- Service account keys should never be committed to version control
- Use Firebase security rules to restrict access
- Enable Firebase App Check for additional security
- Configure CORS properly for production domains

### 8. Cost Optimization
- Firebase Realtime Database pricing based on bandwidth
- Optimize data structure to minimize reads/writes
- Use Firebase indexes for efficient queries
- Consider data retention policies for historical data

## Current Status
✅ Firebase project configured (nexus-4b4ba)
✅ Realtime Database enabled
✅ Authentication configured
✅ Storage bucket created
✅ Analytics enabled
✅ Development environment working

## Next Steps for Production
1. Generate and configure service account credentials
2. Set up CI/CD pipeline for automated deployments
3. Configure custom domain for hosting
4. Enable Firebase security features
5. Set up monitoring and alerting