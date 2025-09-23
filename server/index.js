// Basic Express server setup for MongoDB connection

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5000"],
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true if using https
}));
app.use(passport.initialize());
app.use(passport.session());


// MongoDB connection URI (update with your credentials)
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';
let db;
let usersCollection;
let profilesCollection;
let migrantRequestsCollection;
let guideSessionsCollection;
let messagesCollection;
let documentsCollection;
let reviewsCollection;
let notificationsCollection;

MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(client => {
    db = client.db();
    usersCollection = db.collection('users');
    profilesCollection = db.collection('profiles');
    migrantRequestsCollection = db.collection('migrant_requests');
    guideSessionsCollection = db.collection('guide_sessions');
    messagesCollection = db.collection('messages');
    documentsCollection = db.collection('documents');
    reviewsCollection = db.collection('reviews');
    notificationsCollection = db.collection('notifications');
    console.log('Connected to MongoDB with all collections initialized');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Passport config
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersCollection.findOne({ _id: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user
    let user = await usersCollection.findOne({ googleId: profile.id });
    if (!user) {
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
        photo: profile.photos && profile.photos[0] ? profile.photos[0].value : null
      };
      const result = await usersCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// Middleware to save role in session before Google OAuth
app.get('/auth/google', (req, res, next) => {
  const { role } = req.query;
  if (role) {
    req.session.oauthRole = role;
  }
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));


// Auth routes (only keep the version with role middleware)

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: true
  }),
  (req, res) => {
    // Successful authentication, redirect to /role
  res.redirect('http://localhost:5173/role');
  }
);

// Re-register GoogleStrategy with passReqToCallback to access req.session
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
}, async function(req, accessToken, refreshToken, profile, done) {
  try {
    let user = await usersCollection.findOne({ googleId: profile.id });
    if (!user) {
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
        photo: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
        role: req.session.oauthRole || null
      };
      const result = await usersCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    } else if (!user.role && req.session.oauthRole) {
      // Update role if not set
      await usersCollection.updateOne({ googleId: profile.id }, { $set: { role: req.session.oauthRole } });
      user.role = req.session.oauthRole;
    }
    // Clean up session
    req.session.oauthRole = undefined;
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));
app.get('/auth/failure', (req, res) => {
  res.status(401).json({ error: 'Authentication failed' });
});

app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
});

// ==================== PROFILES API ====================
// Get user profile
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const profile = await profilesCollection.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Create or update profile
app.post('/api/profile', async (req, res) => {
  try {
    const { userId, ...profileData } = req.body;
    const result = await profilesCollection.updateOne(
      { userId },
      { $set: { ...profileData, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// ==================== MIGRANT REQUESTS API ====================
// Get all migrant requests (for guides)
app.get('/api/migrant-requests', async (req, res) => {
  try {
    const { status, specialization, limit = 20, skip = 0 } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (specialization) query.specialization = { $in: [specialization] };
    
    const requests = await migrantRequestsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .toArray();
    
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch migrant requests' });
  }
});

// Create migrant request
app.post('/api/migrant-requests', async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending'
    };
    const result = await migrantRequestsCollection.insertOne(requestData);
    res.json({ success: true, requestId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create migrant request' });
  }
});

// Update migrant request status
app.put('/api/migrant-requests/:requestId', async (req, res) => {
  try {
    const { status, guideId, ...updateData } = req.body;
    const result = await migrantRequestsCollection.updateOne(
      { _id: new require('mongodb').ObjectId(req.params.requestId) },
      { $set: { ...updateData, status, guideId, updatedAt: new Date() } }
    );
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update migrant request' });
  }
});

// ==================== GUIDE SESSIONS API ====================
// Get guide sessions
app.get('/api/guide-sessions', async (req, res) => {
  try {
    const { guideId, migrantId, status } = req.query;
    let query = {};
    
    if (guideId) query.guideId = guideId;
    if (migrantId) query.migrantId = migrantId;
    if (status) query.status = status;
    
    const sessions = await guideSessionsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guide sessions' });
  }
});

// Create guide session
app.post('/api/guide-sessions', async (req, res) => {
  try {
    const sessionData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'scheduled'
    };
    const result = await guideSessionsCollection.insertOne(sessionData);
    res.json({ success: true, sessionId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create guide session' });
  }
});

// ==================== MESSAGES API ====================
// Get messages between users
app.get('/api/messages/:conversationId', async (req, res) => {
  try {
    const messages = await messagesCollection
      .find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 })
      .toArray();
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
app.post('/api/messages', async (req, res) => {
  try {
    const messageData = {
      ...req.body,
      createdAt: new Date(),
      read: false
    };
    const result = await messagesCollection.insertOne(messageData);
    res.json({ success: true, messageId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ==================== DOCUMENTS API ====================
// Upload document
app.post('/api/documents', async (req, res) => {
  try {
    const documentData = {
      ...req.body,
      uploadedAt: new Date(),
      status: 'pending'
    };
    const result = await documentsCollection.insertOne(documentData);
    res.json({ success: true, documentId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Get user documents
app.get('/api/documents/:userId', async (req, res) => {
  try {
    const documents = await documentsCollection
      .find({ userId: req.params.userId })
      .sort({ uploadedAt: -1 })
      .toArray();
    
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// ==================== REVIEWS API ====================
// Get guide reviews
app.get('/api/reviews/:guideId', async (req, res) => {
  try {
    const reviews = await reviewsCollection
      .find({ guideId: req.params.guideId })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Create review
app.post('/api/reviews', async (req, res) => {
  try {
    const reviewData = {
      ...req.body,
      createdAt: new Date()
    };
    const result = await reviewsCollection.insertOne(reviewData);
    res.json({ success: true, reviewId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// ==================== NOTIFICATIONS API ====================
// Get user notifications
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const notifications = await notificationsCollection
      .find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
app.put('/api/notifications/:notificationId/read', async (req, res) => {
  try {
    const result = await notificationsCollection.updateOne(
      { _id: new require('mongodb').ObjectId(req.params.notificationId) },
      { $set: { read: true, readAt: new Date() } }
    );
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Create notification
app.post('/api/notifications', async (req, res) => {
  try {
    const notificationData = {
      ...req.body,
      createdAt: new Date(),
      read: false
    };
    const result = await notificationsCollection.insertOne(notificationData);
    res.json({ success: true, notificationId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// ==================== SEARCH & FILTERS API ====================
// Search guides
app.get('/api/guides/search', async (req, res) => {
  try {
    const { specialization, country, rating, limit = 20, skip = 0 } = req.query;
    let query = { role: 'guide', verified: true };
    
    if (specialization) query.specialization = { $in: [specialization] };
    if (country) query.targetCountries = { $in: [country] };
    if (rating) query.rating = { $gte: parseFloat(rating) };
    
    const guides = await profilesCollection
      .find(query)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .toArray();
    
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search guides' });
  }
});

// Get dashboard stats
app.get('/api/dashboard/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get user profile to determine role
    const profile = await profilesCollection.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    let stats = {};
    
    if (profile.role === 'migrant') {
      const [requests, sessions, documents] = await Promise.all([
        migrantRequestsCollection.countDocuments({ migrantId: userId }),
        guideSessionsCollection.countDocuments({ migrantId: userId }),
        documentsCollection.countDocuments({ userId })
      ]);
      
      stats = { requests, sessions, documents };
    } else if (profile.role === 'guide') {
      const [sessions, reviews, clients] = await Promise.all([
        guideSessionsCollection.countDocuments({ guideId: userId }),
        reviewsCollection.countDocuments({ guideId: userId }),
        guideSessionsCollection.distinct('migrantId', { guideId: userId })
      ]);
      
      stats = { 
        sessions, 
        reviews, 
        clients: clients.length,
        rating: profile.rating || 0
      };
    }
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Example route: get all items from 'test' collection
app.get('/api/items', async (req, res) => {
  try {
    const items = await db.collection('test').find().toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
