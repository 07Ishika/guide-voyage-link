# Voyagery Server

Backend API server for the Voyagery migration platform built with Express.js and MongoDB.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Setup
Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/voyagery
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
PORT=5000
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 4. Test Connection
```bash
npm test
```

### 5. Seed Database (Optional)
```bash
npm run seed
```

### 6. Start Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## 📊 Database Collections

The server manages 8 MongoDB collections:

1. **`users`** - Basic user authentication data
2. **`profiles`** - Extended user profiles (migrant/guide specific)
3. **`migrant_requests`** - Migration session requests
4. **`guide_sessions`** - Consultation sessions
5. **`messages`** - Chat messages between users
6. **`documents`** - File uploads and verification documents
7. **`reviews`** - Guide ratings and reviews
8. **`notifications`** - User notifications

## 🔌 API Endpoints

### Authentication
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/user` - Get current user
- `GET /auth/logout` - Logout user

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

## 🛠️ Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart
- `npm run seed` - Seed database with sample data
- `npm test` - Test MongoDB connection

### Project Structure
```
server/
├── index.js           # Main server file
├── seedData.js        # Database seeding script
├── testConnection.js  # Connection test script
├── package.json       # Dependencies and scripts
├── .env              # Environment variables
└── README.md         # This file
```

## 🔧 Configuration

### MongoDB Connection
The server connects to MongoDB using the `MONGODB_URI` environment variable. Default: `mongodb://localhost:27017/voyagery`

### CORS Settings
Configured to allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:5000` (Server itself)

### Session Configuration
- Secret: `your-session-secret` (change in production)
- Secure cookies: `false` (set to `true` for HTTPS)

## 🚨 Troubleshooting

### MongoDB Connection Issues
1. Ensure MongoDB is running
2. Check connection string in `.env`
3. Verify database permissions
4. Run `npm test` to diagnose

### Google OAuth Issues
1. Verify Google OAuth credentials in `.env`
2. Check callback URL configuration
3. Ensure OAuth consent screen is configured

### Port Conflicts
- Default port: 5000
- Change `PORT` in `.env` if needed
- Ensure port is not in use by other services

## 📝 Sample Data

The seeding script creates:
- 3 sample users (2 migrants, 1 guide)
- Complete profiles for each user
- Sample migrant requests
- Guide sessions
- Messages and notifications
- Documents and reviews

## 🔒 Security Notes

- Change session secret in production
- Use HTTPS in production
- Implement rate limiting
- Add input validation
- Use environment variables for secrets
- Implement proper error handling

## 📈 Next Steps

1. **File Upload**: Implement file storage (AWS S3, Cloudinary)
2. **Real-time**: Add WebSocket support for live chat
3. **Email**: Integrate email notifications
4. **Payment**: Add payment processing
5. **Analytics**: Implement usage tracking
6. **Caching**: Add Redis for performance
7. **Monitoring**: Add logging and monitoring

