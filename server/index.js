// Basic Express server setup for MongoDB connection

const express = require('express');
const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5000",
    "https://guide-voyage-link.vercel.app",
    /\.vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'your-session-secret',
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something stored
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery',
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: false, // set to true if using https
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: 'lax'
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document types
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, PNG, DOC, and DOCX files are allowed.'), false);
    }
  }
});


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
let gridFSBucket;

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

    // Initialize GridFS for file storage
    gridFSBucket = new GridFSBucket(db, { bucketName: 'uploads' });

    console.log('✅ Connected to MongoDB with all collections and GridFS initialized');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Server will continue without database functionality');
    // Server continues to run for API health checks
  });

// Passport config
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log('Deserializing user with ID:', id, 'Type:', typeof id);

    // Check if id is a valid ObjectId string
    if (!id || typeof id !== 'string' || (id.length !== 12 && id.length !== 24)) {
      console.log('Invalid ObjectId format:', id);
      return done(null, false);
    }

    // Try to create ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (objectIdError) {
      console.log('Failed to create ObjectId from:', id);
      return done(null, false);
    }

    const user = await usersCollection.findOne({ _id: objectId });
    console.log('Deserialized user:', user ? user.displayName : 'Not found');
    done(null, user);
  } catch (err) {
    console.error('Deserialize error:', err);
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
  async (req, res) => {
    // Successful authentication, redirect based on user role
    console.log('✅ OAuth callback successful - User:', req.user?.displayName, 'Role:', req.user?.role);

    const user = req.user;
    if (user && user.role) {
      console.log('🎯 Redirecting to role-based dashboard:', user.role);

      if (user.role === 'guide') {
        res.redirect('http://localhost:5173/home/guide');
      } else if (user.role === 'migrant') {
        res.redirect('http://localhost:5173/home');
      } else {
        // If no role is set, redirect to role selection
        res.redirect('http://localhost:5173/role');
      }
    } else {
      console.log('❌ No user or role found, redirecting to role selection');
      // If user data is not available, redirect to role selection
      res.redirect('http://localhost:5173/role');
    }
  }
);

// Re-register GoogleStrategy with passReqToCallback to access req.session
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
}, async function (req, accessToken, refreshToken, profile, done) {
  try {
    let user = await usersCollection.findOne({ googleId: profile.id });
    const selectedRole = req.session.oauthRole;

    if (!user) {
      // Create new user with role
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
        photo: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
        role: selectedRole || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await usersCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };

      // Create profile automatically
      if (selectedRole) {
        await createUserProfile(user, selectedRole);
      }
    } else if (!user.role && selectedRole) {
      // Update existing user with role
      await usersCollection.updateOne(
        { googleId: profile.id },
        {
          $set: {
            role: selectedRole,
            updatedAt: new Date()
          }
        }
      );
      user.role = selectedRole;

      // Create profile if it doesn't exist
      await createUserProfile(user, selectedRole);
    }

    // Clean up session
    req.session.oauthRole = undefined;
    done(null, user);
  } catch (err) {
    console.error('OAuth strategy error:', err);
    done(err, null);
  }
}));

// Helper function to create user profile
async function createUserProfile(user, role) {
  try {
    const existingProfile = await profilesCollection.findOne({ userId: user._id.toString() });
    if (existingProfile) {
      console.log('Profile already exists for user:', user.displayName);
      return;
    }

    const baseProfile = {
      userId: user._id.toString(),
      fullName: user.displayName,
      email: user.email,
      role: role,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let profileData;
    if (role === 'guide') {
      profileData = {
        ...baseProfile,
        specialization: ['General Consultation'],
        residenceCountry: 'Canada',
        targetCountries: ['Canada'],
        expertiseAreas: ['Immigration', 'Visa Process'],
        rating: 4.5,
        totalReviews: 0,
        hourlyRate: 50,
        languages: ['English'],
        yearsExperience: '2+ years',
        availability: 'Available',
        verifiedStatus: 'pending',
        bio: 'Experienced guide ready to help with your immigration journey.'
      };
    } else {
      profileData = {
        ...baseProfile,
        currentCountry: 'India',
        targetCountries: ['Canada'],
        profession: 'Professional',
        experience: '3+ years',
        education: 'Bachelor\'s Degree',
        languages: ['English'],
        immigrationGoals: ['Permanent Residence'],
        timeline: '6-12 months',
        budget: '$50-80 per session'
      };
    }

    await profilesCollection.insertOne(profileData);
    console.log(`✅ Created ${role} profile for:`, user.displayName);
  } catch (error) {
    console.error('Error creating profile:', error);
  }
}
app.get('/auth/failure', (req, res) => {
  res.status(401).json({ error: 'Authentication failed' });
});

// Demo login endpoint for testing
app.post('/auth/demo-login', async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['migrant', 'guide'].includes(role)) {
      return res.status(400).json({ error: 'Valid role required (migrant or guide)' });
    }

    // Find a demo user with the specified role
    const user = await usersCollection.findOne({ role: role });
    
    if (!user) {
      // If no user found, create a demo user
      const demoUsers = {
        migrant: {
          googleId: `demo_migrant_${Date.now()}`,
          displayName: 'Sarah Chen',
          email: 'sarah@example.com',
          photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
          role: 'migrant',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        guide: {
          googleId: `demo_guide_${Date.now()}`,
          displayName: 'Dr. Michael Rodriguez',
          email: 'michael@example.com',
          photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
          role: 'guide',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      const newUser = demoUsers[role];
      const result = await usersCollection.insertOne(newUser);
      newUser._id = result.insertedId;

      // Create profile for the new user
      await createUserProfile(newUser, role);

      // Set session data
      const userIdString = newUser._id.toString();
      req.session.passport = { user: userIdString };
      req.user = newUser;

      console.log('✅ Demo login successful (new user):', newUser.displayName, '(Role:', newUser.role, ') ID:', userIdString);
      res.json(newUser);
      return;
    }

    // Ensure profile exists for existing user
    await createUserProfile(user, role);

    // Set session data - ensure ObjectId is properly stored
    const userIdString = user._id.toString();
    req.session.passport = { user: userIdString };
    req.user = user;

    console.log('✅ Demo login successful:', user.displayName, '(Role:', user.role, ') ID:', userIdString);
    res.json(user);
  } catch (err) {
    console.error('❌ Demo login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all users for demo login selection
app.get('/auth/demo-users', async (req, res) => {
  try {
    const users = await usersCollection.find({}).toArray();
    const userList = users.map(user => ({
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
      role: user.role
    }));
    console.log('📋 Available users for demo login:', userList);
    res.json(userList);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Manual login by email or name
app.post('/auth/manual-login', async (req, res) => {
  try {
    const { email, name } = req.body;

    // If database is not available, use mock data for testing
    if (!usersCollection) {
      console.log('⚠️ Database not available, using mock user for testing');

      // Determine role based on input - if email contains 'guide' or name contains 'guide', make them a guide
      const inputText = (email || name || '').toLowerCase();
      const isGuide = inputText.includes('guide') || inputText.includes('michael') || inputText.includes('rodriguez');

      const mockUser = {
        _id: 'mock-user-id',
        displayName: name || (isGuide ? 'Dr. Michael Rodriguez' : 'Sarah Chen'),
        email: email || (isGuide ? 'michael@example.com' : 'sarah@example.com'),
        role: isGuide ? 'guide' : 'migrant',
        googleId: 'mock-google-id'
      };

      req.session.user = mockUser;
      return res.json({
        message: 'Login successful (mock mode)',
        user: mockUser
      });
    }

    let query = {};
    if (email) {
      query.email = { $regex: email, $options: 'i' }; // Case insensitive
    } else if (name) {
      query.displayName = { $regex: name, $options: 'i' }; // Case insensitive
    } else {
      return res.status(400).json({ error: 'Email or name required' });
    }

    console.log('🔍 Searching for user with query:', query);

    // Find the user in the database
    const user = await usersCollection.findOne(query);
    if (!user) {
      console.log('❌ User not found with query:', query);
      return res.status(404).json({ error: 'User not found in database' });
    }

    // Ensure profile exists for the user
    if (user.role) {
      await createUserProfile(user, user.role);
    }

    // Set session data - ensure ObjectId is properly stored
    const userIdString = user._id.toString();
    req.session.passport = { user: userIdString };
    req.user = user;

    console.log('✅ Manual login successful for:', user.displayName, '(Role:', user.role, ') ID:', userIdString);
    res.json({
      success: true,
      user: {
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ Manual login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/auth/user', (req, res) => {
  console.log('Auth check - Session:', req.session);
  console.log('Auth check - User:', req.user);
  console.log('Auth check - Is authenticated:', req.isAuthenticated());

  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Set user role (for users who logged in without selecting a role)
app.post('/auth/set-role', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { role } = req.body;
    if (!role || !['migrant', 'guide'].includes(role)) {
      return res.status(400).json({ error: 'Valid role required (migrant or guide)' });
    }

    const userId = req.user._id;

    // Update user role in database
    await usersCollection.updateOne(
      { _id: userId },
      {
        $set: {
          role: role,
          updatedAt: new Date()
        }
      }
    );

    // Update session user object
    req.user.role = role;

    // Create profile for the user
    await createUserProfile(req.user, role);

    console.log('✅ Role set for user:', req.user.displayName, 'Role:', role);

    res.json({
      success: true,
      user: {
        _id: req.user._id,
        displayName: req.user.displayName,
        email: req.user.email,
        role: role
      }
    });
  } catch (err) {
    console.error('❌ Error setting role:', err);
    res.status(500).json({ error: 'Failed to set role' });
  }
});

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
});

// ==================== PROFILES API ====================
// Get user profile with documents
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const profile = await profilesCollection.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Get user's documents
    const documents = await documentsCollection
      .find({ userId: req.params.userId })
      .sort({ uploadedAt: -1 })
      .toArray();

    // Add documents to profile
    profile.documents = documents;

    res.json(profile);
  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Create or update profile
app.post('/api/profile', async (req, res) => {
  try {
    const { userId, ...profileData } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Prepare profile data
    const updateData = {
      ...profileData,
      updatedAt: new Date()
    };

    // If this is a new profile, add createdAt
    const existingProfile = await profilesCollection.findOne({ userId });
    if (!existingProfile) {
      updateData.createdAt = new Date();
    }

    const result = await profilesCollection.updateOne(
      { userId },
      { $set: updateData },
      { upsert: true }
    );

    // Get the updated profile with documents
    const updatedProfile = await profilesCollection.findOne({ userId });
    const documents = await documentsCollection
      .find({ userId })
      .sort({ uploadedAt: -1 })
      .toArray();

    updatedProfile.documents = documents;

    res.json({
      success: true,
      profile: updatedProfile,
      upserted: result.upsertedCount > 0,
      modified: result.modifiedCount > 0
    });
  } catch (err) {
    console.error('Save profile error:', err);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Update profile verification status (for admin use)
app.patch('/api/profile/:userId/verification', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, notes } = req.body;

    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid verification status' });
    }

    const updateData = {
      verificationStatus: status,
      verificationNotes: notes || '',
      verificationUpdatedAt: new Date()
    };

    const result = await profilesCollection.updateOne(
      { userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ success: true, message: 'Verification status updated' });
  } catch (err) {
    console.error('Update verification error:', err);
    res.status(500).json({ error: 'Failed to update verification status' });
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
    const { guideId, migrantId, status, requestStatus, guideName } = req.query;
    let query = {};

    if (guideId) query.guideId = guideId;
    if (migrantId) query.migrantId = migrantId;
    if (status) query.status = status;
    if (requestStatus) query.requestStatus = requestStatus;
    if (guideName) query.guideName = { $regex: guideName, $options: 'i' }; // Case insensitive search

    console.log('🔍 Fetching sessions with query:', query);

    const sessions = await guideSessionsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    console.log('📋 Found sessions:', sessions.length);
    if (sessions.length > 0) {
      console.log('📄 Sample session:', sessions[0]);
    }

    res.json(sessions);
  } catch (err) {
    console.error('❌ Error fetching sessions:', err);
    res.status(500).json({ error: 'Failed to fetch guide sessions' });
  }
});

// Create guide session
app.post('/api/guide-sessions', async (req, res) => {
  try {
    console.log('📝 Received session request:', req.body);

    const sessionData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'scheduled'
    };

    console.log('💾 Storing session data:', sessionData);
    const result = await guideSessionsCollection.insertOne(sessionData);

    console.log('✅ Session stored with ID:', result.insertedId);
    res.json({ success: true, sessionId: result.insertedId });
  } catch (err) {
    console.error('❌ Error creating session:', err);
    res.status(500).json({ error: 'Failed to create guide session' });
  }
});

// Update guide session
app.put('/api/guide-sessions/:sessionId', async (req, res) => {
  try {
    console.log('📝 Updating session:', req.params.sessionId, 'with data:', req.body);

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    const result = await guideSessionsCollection.updateOne(
      { _id: new ObjectId(req.params.sessionId) },
      { $set: updateData }
    );

    console.log('✅ Session updated:', result);

    // Get the updated session to return complete data
    const updatedSession = await guideSessionsCollection.findOne({ _id: new ObjectId(req.params.sessionId) });

    res.json({ success: true, result, session: updatedSession });
  } catch (err) {
    console.error('❌ Error updating session:', err);
    res.status(500).json({ error: 'Failed to update guide session' });
  }
});

// Get session by ID
app.get('/api/guide-sessions/:sessionId', async (req, res) => {
  try {
    const session = await guideSessionsCollection.findOne({ _id: new ObjectId(req.params.sessionId) });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (err) {
    console.error('❌ Error fetching session:', err);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Delete session by ID (when guide declines)
app.delete('/api/guide-sessions/:sessionId', async (req, res) => {
  try {
    console.log('🗑️ Deleting session:', req.params.sessionId);

    const result = await guideSessionsCollection.deleteOne({ _id: new ObjectId(req.params.sessionId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log('✅ Session deleted successfully');
    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting session:', err);
    res.status(500).json({ error: 'Failed to delete session' });
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
// Upload document with file
app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId, documentType, country, description } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Create a unique filename
    const filename = `${userId}_${documentType}_${Date.now()}_${req.file.originalname}`;

    // Upload file to GridFS
    const uploadStream = gridFSBucket.openUploadStream(filename, {
      metadata: {
        userId,
        documentType,
        country,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        uploadedAt: new Date()
      }
    });

    // Write file buffer to GridFS
    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', async () => {
      try {
        // Save document metadata to documents collection
        const documentData = {
          userId,
          fileId: uploadStream.id,
          filename,
          originalName: req.file.originalname,
          documentType,
          country,
          description: description || '',
          mimetype: req.file.mimetype,
          size: req.file.size,
          uploadedAt: new Date(),
          status: 'pending'
        };

        const result = await documentsCollection.insertOne(documentData);

        res.json({
          success: true,
          documentId: result.insertedId,
          fileId: uploadStream.id,
          filename: filename
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        res.status(500).json({ error: 'Failed to save document metadata' });
      }
    });

    uploadStream.on('error', (error) => {
      console.error('GridFS upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    });

  } catch (err) {
    console.error('Document upload error:', err);
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
    console.error('Fetch documents error:', err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Download document file
app.get('/api/documents/download/:fileId', async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.fileId);

    // Find file metadata
    const file = await gridFSBucket.find({ _id: fileId }).toArray();

    if (!file || file.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileInfo = file[0];

    // Set appropriate headers
    res.set({
      'Content-Type': fileInfo.metadata.mimetype,
      'Content-Disposition': `attachment; filename="${fileInfo.metadata.originalName}"`,
      'Content-Length': fileInfo.length
    });

    // Stream file from GridFS
    const downloadStream = gridFSBucket.openDownloadStream(fileId);
    downloadStream.pipe(res);

    downloadStream.on('error', (error) => {
      console.error('Download stream error:', error);
      res.status(500).json({ error: 'Failed to download file' });
    });

  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Failed to download document' });
  }
});

// Delete document
app.delete('/api/documents/:documentId', async (req, res) => {
  try {
    const documentId = new ObjectId(req.params.documentId);

    // Find document to get fileId
    const document = await documentsCollection.findOne({ _id: documentId });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete file from GridFS
    if (document.fileId) {
      await gridFSBucket.delete(new ObjectId(document.fileId));
    }

    // Delete document metadata
    await documentsCollection.deleteOne({ _id: documentId });

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (err) {
    console.error('Delete document error:', err);
    res.status(500).json({ error: 'Failed to delete document' });
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

// Real-time session updates endpoint
app.get('/api/guide-sessions/realtime/:guideId', async (req, res) => {
  try {
    const { guideId } = req.params;
    const { lastUpdate } = req.query;

    let query = { guideId };

    // If lastUpdate is provided, only get sessions updated after that time
    if (lastUpdate) {
      query.updatedAt = { $gt: new Date(lastUpdate) };
    }

    const sessions = await guideSessionsCollection
      .find(query)
      .sort({ updatedAt: -1 })
      .toArray();

    res.json({
      sessions,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ Error fetching real-time sessions:', err);
    res.status(500).json({ error: 'Failed to fetch real-time sessions' });
  }
});

// ==================== SEARCH & FILTERS API ====================
// Search guides
app.get('/api/guides/search', async (req, res) => {
  try {
    const { specialization, country, rating, limit = 20, skip = 0 } = req.query;
    let query = { role: 'guide' }; // Removed verified requirement to show all guides

    if (specialization) query.specialization = { $in: [specialization] };
    if (country) query.targetCountries = { $in: [country] };
    if (rating) query.rating = { $gte: parseFloat(rating) };

    console.log('🔍 Searching for guides with query:', query);

    const guides = await profilesCollection
      .find(query)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .toArray();

    console.log('👥 Found guides:', guides.length);
    console.log('📄 Guide data:', guides);

    res.json(guides);
  } catch (err) {
    console.error('❌ Error searching guides:', err);
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


// Create a guide profile from current user
app.post('/api/create-guide-profile', async (req, res) => {
  try {
    const { userId, fullName, email, specialization, residenceCountry, hourlyRate } = req.body;

    const guideProfile = {
      userId: userId,
      fullName: fullName,
      email: email,
      role: 'guide',
      specialization: specialization || 'General Consultation',
      residenceCountry: residenceCountry || 'Canada',
      targetCountries: [residenceCountry || 'Canada'],
      expertiseAreas: ['Immigration', 'Visa Process'],
      rating: 4.5,
      totalReviews: 0,
      hourlyRate: hourlyRate || 50,
      languages: ['English'],
      yearsExperience: '5+ years',
      availability: 'Available',
      verifiedStatus: 'verified',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await profilesCollection.insertOne(guideProfile);
    res.json({ success: true, profileId: result.insertedId, profile: guideProfile });
  } catch (err) {
    console.error('Error creating guide profile:', err);
    res.status(500).json({ error: 'Failed to create guide profile' });
  }
});

// Root route for health check
app.get('/', (req, res) => {
  res.json({
    message: 'Voyagery API Server is running!',
    status: 'healthy',
    endpoints: {
      auth: '/auth/google',
      api: '/api/*',
      health: '/'
    }
  });
});

// API health check
app.get('/api', (req, res) => {
  res.json({
    message: 'Voyagery API is working!',
    status: 'healthy',
    version: '1.0.0',
    availableEndpoints: [
      'GET /api/profile/:userId',
      'POST /api/profile',
      'GET /api/migrant-requests',
      'POST /api/migrant-requests',
      'GET /api/guide-sessions',
      'POST /api/guide-sessions',
      'GET /api/documents/:userId',
      'POST /api/documents/upload'
    ]
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
    const result = await profilesCollection.insertOne(guideProfile);
    res.json({ success: true, profileId: result.insertedId });
  } catch (err) {
    console.error('❌ Error creating guide profile:', err);
    res.status(500).json({ error: 'Failed to create guide profile' });
  }
});

// Health check endpoint for production monitoring
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Voyagery Backend',
    database: db ? 'Connected' : 'Disconnected'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});