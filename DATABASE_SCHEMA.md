# Voyagery Database Schema

## Overview
This document outlines the MongoDB collections and their schemas for the Voyagery migration platform.

## Collections

### 1. `users` Collection
**Purpose:** Basic user authentication data from Google OAuth
```javascript
{
  _id: ObjectId,
  googleId: String,           // Google OAuth ID
  displayName: String,        // User's display name
  email: String,              // User's email
  photo: String,              // Profile photo URL
  role: String,               // 'migrant' or 'guide'
  createdAt: Date,
  updatedAt: Date
}
```

### 2. `profiles` Collection
**Purpose:** Extended user profiles with role-specific data
```javascript
{
  _id: ObjectId,
  userId: String,             // Reference to users._id
  
  // Common fields
  fullName: String,
  email: String,
  bio: String,
  timezone: String,
  website: String,
  linkedin: String,
  role: String,               // 'migrant' or 'guide'
  
  // Migrant-specific fields
  currentLocation: String,
  targetCountry: String,
  targetCity: String,
  visaType: String,
  educationLevel: String,
  fieldOfStudy: String,
  workExperience: String,
  languages: [String],
  budgetRange: String,
  timeline: String,
  
  // Guide-specific fields
  specialization: String,
  yearsExperience: String,
  hourlyRate: String,
  availability: String,
  citizenshipCountry: String,
  residenceCountry: String,
  targetCountries: [String],
  professionalLicenses: [String],
  verificationDocuments: [String],
  verifiedStatus: String,     // 'pending', 'verified', 'rejected'
  verificationDate: Date,
  expertiseAreas: [String],
  consultationTypes: [String],
  remoteConsultation: Boolean,
  inPersonConsultation: Boolean,
  emergencySupport: Boolean,
  rating: Number,             // Average rating
  totalReviews: Number,
  
  createdAt: Date,
  updatedAt: Date
}
```

### 3. `migrant_requests` Collection
**Purpose:** Migration session requests from migrants
```javascript
{
  _id: ObjectId,
  migrantId: String,          // Reference to users._id
  title: String,
  description: String,
  urgency: String,            // 'low', 'medium', 'high'
  budget: Number,
  timeline: String,
  specialization: [String],   // Required guide specializations
  targetCountry: String,
  visaType: String,
  status: String,             // 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'
  guideId: String,            // Assigned guide (if accepted)
  acceptedAt: Date,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. `guide_sessions` Collection
**Purpose:** Consultation sessions between guides and migrants
```javascript
{
  _id: ObjectId,
  guideId: String,            // Reference to users._id
  migrantId: String,          // Reference to users._id
  requestId: String,          // Reference to migrant_requests._id
  sessionType: String,        // 'initial', 'follow_up', 'document_review', 'interview_prep'
  scheduledAt: Date,
  duration: Number,           // Duration in minutes
  status: String,             // 'scheduled', 'in_progress', 'completed', 'cancelled'
  meetingLink: String,        // Video call link
  notes: String,              // Session notes
  rating: Number,             // Session rating (1-5)
  feedback: String,           // Session feedback
  createdAt: Date,
  updatedAt: Date
}
```

### 5. `messages` Collection
**Purpose:** Chat messages between users
```javascript
{
  _id: ObjectId,
  conversationId: String,     // Unique conversation identifier
  senderId: String,           // Reference to users._id
  receiverId: String,         // Reference to users._id
  message: String,
  messageType: String,        // 'text', 'image', 'document', 'file'
  attachments: [String],      // File URLs
  read: Boolean,
  readAt: Date,
  createdAt: Date
}
```

### 6. `documents` Collection
**Purpose:** File uploads and verification documents
```javascript
{
  _id: ObjectId,
  userId: String,             // Reference to users._id
  fileName: String,
  fileType: String,           // 'passport', 'visa', 'degree', 'license', 'other'
  fileUrl: String,            // File storage URL
  fileSize: Number,           // File size in bytes
  mimeType: String,           // MIME type
  status: String,             // 'pending', 'approved', 'rejected'
  verifiedBy: String,         // Admin/verifier ID
  verifiedAt: Date,
  rejectionReason: String,
  uploadedAt: Date
}
```

### 7. `reviews` Collection
**Purpose:** Guide ratings and reviews
```javascript
{
  _id: ObjectId,
  guideId: String,            // Reference to users._id
  migrantId: String,          // Reference to users._id
  sessionId: String,          // Reference to guide_sessions._id
  rating: Number,             // 1-5 stars
  title: String,
  review: String,
  categories: {
    communication: Number,    // 1-5
    expertise: Number,        // 1-5
    punctuality: Number,      // 1-5
    helpfulness: Number       // 1-5
  },
  verified: Boolean,          // Verified review
  createdAt: Date
}
```

### 8. `notifications` Collection
**Purpose:** User notifications
```javascript
{
  _id: ObjectId,
  userId: String,             // Reference to users._id
  type: String,               // 'request', 'message', 'session', 'review', 'system'
  title: String,
  message: String,
  data: Object,               // Additional notification data
  read: Boolean,
  readAt: Date,
  createdAt: Date
}
```

## API Endpoints

### Profiles
- `GET /api/profile/:userId` - Get user profile
- `POST /api/profile` - Create/update profile

### Migrant Requests
- `GET /api/migrant-requests` - Get all requests (with filters)
- `POST /api/migrant-requests` - Create new request
- `PUT /api/migrant-requests/:requestId` - Update request status

### Guide Sessions
- `GET /api/guide-sessions` - Get sessions (with filters)
- `POST /api/guide-sessions` - Create new session

### Messages
- `GET /api/messages/:conversationId` - Get conversation messages
- `POST /api/messages` - Send message

### Documents
- `GET /api/documents/:userId` - Get user documents
- `POST /api/documents` - Upload document

### Reviews
- `GET /api/reviews/:guideId` - Get guide reviews
- `POST /api/reviews` - Create review

### Notifications
- `GET /api/notifications/:userId` - Get user notifications
- `PUT /api/notifications/:notificationId/read` - Mark as read
- `POST /api/notifications` - Create notification

### Search & Dashboard
- `GET /api/guides/search` - Search guides
- `GET /api/dashboard/:userId` - Get dashboard stats

## Indexes (Recommended)

```javascript
// Users collection
db.users.createIndex({ "googleId": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })

// Profiles collection
db.profiles.createIndex({ "userId": 1 }, { unique: true })
db.profiles.createIndex({ "role": 1 })
db.profiles.createIndex({ "targetCountry": 1 })
db.profiles.createIndex({ "specialization": 1 })

// Migrant requests collection
db.migrant_requests.createIndex({ "migrantId": 1 })
db.migrant_requests.createIndex({ "status": 1 })
db.migrant_requests.createIndex({ "specialization": 1 })
db.migrant_requests.createIndex({ "createdAt": -1 })

// Guide sessions collection
db.guide_sessions.createIndex({ "guideId": 1 })
db.guide_sessions.createIndex({ "migrantId": 1 })
db.guide_sessions.createIndex({ "status": 1 })
db.guide_sessions.createIndex({ "scheduledAt": 1 })

// Messages collection
db.messages.createIndex({ "conversationId": 1 })
db.messages.createIndex({ "senderId": 1 })
db.messages.createIndex({ "receiverId": 1 })
db.messages.createIndex({ "createdAt": -1 })

// Documents collection
db.documents.createIndex({ "userId": 1 })
db.documents.createIndex({ "fileType": 1 })
db.documents.createIndex({ "status": 1 })

// Reviews collection
db.reviews.createIndex({ "guideId": 1 })
db.reviews.createIndex({ "migrantId": 1 })
db.reviews.createIndex({ "rating": 1 })

// Notifications collection
db.notifications.createIndex({ "userId": 1 })
db.notifications.createIndex({ "read": 1 })
db.notifications.createIndex({ "createdAt": -1 })
```

## Environment Variables Required

```env
MONGODB_URI=mongodb://localhost:27017/voyagery
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
PORT=5000
```

