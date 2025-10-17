# Voyagery - Global Migration Platform

<div align="center">
  <img src="public/logo.png" alt="Voyagery Logo" width="120" height="120">
  
  **Your Journey to Global Success Starts Here**
  
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
  [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
</div>

## 🌍 About Voyagery

Voyagery is a comprehensive MERN stack platform that connects migrants with verified immigration guides worldwide. Our platform facilitates personalized 1:1 consultations, community insights, and expert advice to help individuals navigate their global migration journey successfully.

### ✨ Key Features

- **🔐 Dual Authentication System** - Google OAuth & Manual login with role-based access control
- **👥 Two-Sided Marketplace** - Separate interfaces for migrants and immigration guides
- **📞 Session Booking System** - Real-time call request and scheduling functionality
- **💬 Real-Time Dashboard** - Live updates for session requests and notifications
- **🌐 Community Platform** - Connect with fellow migrants and share experiences
- **💰 Cost Calculator** - Integrated cost-of-living calculator for destination planning
- **📊 Analytics Dashboard** - Comprehensive stats and session management
- **🔄 Real-Time Polling** - Auto-refresh for new requests and updates

## 🏗️ Architecture

### Frontend (React + Vite)
```
src_js/
├── components/          # Reusable UI components
├── pages/              # Route-based page components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API service layer
└── utils/              # Utility functions
```

### Backend (Node.js + Express)
```
server/
├── index.js            # Main server file with API routes
├── models/             # Database schemas and models
├── middleware/         # Authentication and validation
├── utils/              # Server utilities
└── config/             # Database and environment configuration
```

### Database (MongoDB)
```
Collections:
├── users               # User authentication data
├── profiles            # Extended user profiles (role-specific)
├── guide_sessions      # Session requests and bookings
├── migrant_requests    # Migration assistance requests
├── messages            # Chat messages between users
├── documents           # File uploads and verification
├── reviews             # Guide ratings and feedback
└── notifications       # User notifications
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/voyagery.git
   cd voyagery
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create environment file in server directory
   cd server
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/voyagery
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   SESSION_SECRET=your_session_secret
   PORT=5000
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB service
   mongod
   
   # Create test users and data
   node create-test-users.js
   ```

5. **Start the Application**
   ```bash
   # Terminal 1: Start backend server
   cd server
   node index.js
   
   # Terminal 2: Start frontend development server
   cd ..
   npm run dev
   ```

6. **Access the Application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5000

## 👥 User Roles & Features

### 🧳 For Migrants
- **Personalized Dashboard** - Welcome page with quick actions
- **Guide Discovery** - Browse and filter verified immigration guides
- **Session Booking** - Request consultations with detailed requirements
- **Cost Calculator** - Plan budget for destination countries
- **Community Access** - Connect with other migrants
- **Profile Management** - Track immigration goals and progress

### 👨‍💼 For Guides
- **Professional Dashboard** - Manage incoming session requests
- **Request Management** - Accept/decline consultation requests
- **Client Communication** - Contact and schedule with migrants
- **Session Analytics** - Track performance and client satisfaction
- **Profile Showcase** - Display expertise and credentials
- **Real-Time Notifications** - Instant alerts for new requests

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport.js** - Authentication middleware
- **Express Session** - Session management
- **CORS** - Cross-origin resource sharing

### Authentication
- **Google OAuth 2.0** - Social login integration
- **Session-based Auth** - Secure session management
- **Role-based Access Control** - Migrant/Guide permissions
- **Protected Routes** - Route-level authentication

## 📡 API Endpoints

### Authentication
```
GET  /auth/google              # Google OAuth login
GET  /auth/google/callback     # OAuth callback
GET  /auth/user               # Get current user
POST /auth/manual-login       # Manual login
POST /auth/set-role          # Set user role
GET  /auth/logout            # Logout user
```

### Profiles
```
GET  /api/profile/:userId     # Get user profile
POST /api/profile            # Create/update profile
```

### Sessions
```
GET  /api/guide-sessions      # Get sessions (with filters)
POST /api/guide-sessions      # Create session request
PUT  /api/guide-sessions/:id  # Update session status
DELETE /api/guide-sessions/:id # Delete session
```

### Search & Discovery
```
GET  /api/guides/search       # Search guides with filters
GET  /api/migrant-requests    # Get migration requests
```

## 🔧 Development

### Project Structure
```
voyagery/
├── public/                 # Static assets
├── src_js/                # Frontend source code
├── server/                # Backend source code
├── docs/                  # Documentation
├── tests/                 # Test files
└── scripts/               # Utility scripts
```

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Backend:**
```bash
node index.js                # Start server
node create-test-users.js    # Create test data
node debug-sessions.js       # Debug database
```

### Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd server && npm test

# Run integration tests
npm run test:integration
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Start production server
cd server
NODE_ENV=production node index.js
```

### Environment Variables (Production)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/voyagery
GOOGLE_CLIENT_ID=production_client_id
GOOGLE_CLIENT_SECRET=production_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback
SESSION_SECRET=secure_random_string
PORT=5000
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MongoDB** for the robust database solution
- **React Team** for the amazing frontend library
- **Express.js** for the lightweight backend framework
- **Tailwind CSS** for the utility-first styling approach
- **shadcn/ui** for the beautiful component library

## 📞 Support

For support, email support@voyagery.com or join our community Discord server.

---

<div align="center">
  <p>Made with ❤️ for the global migration community</p>
  <p>© 2024 Voyagery. All rights reserved.</p>
</div>
