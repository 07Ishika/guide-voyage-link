# Demo Login Guide

This guide explains how to test and use the demo login functionality for both migrant and guide roles.

## 🎯 Overview

The demo login feature allows users to quickly test the application with pre-configured demo accounts without needing to go through the full Google OAuth flow. This is perfect for:

- Development and testing
- Showcasing the application to stakeholders
- Quick access to both migrant and guide dashboards

## 🚀 How Demo Login Works

### 1. **Role-Based Demo Login**
- Users can select either "migrant" or "guide" role
- The system automatically finds or creates a demo user with that role
- Demo users have pre-configured profiles and sample data

### 2. **Demo Users Available**
- **Migrant**: Sarah Chen (sarah@example.com)
- **Guide**: Dr. Michael Rodriguez (michael@example.com)

## 🧪 Testing Demo Login

### Method 1: Using the Web Interface

1. **Start the server**:
   ```bash
   cd server
   node index.js
   ```

2. **Seed the database** (if not already done):
   ```bash
   node server/seedData.js
   ```

3. **Open the role selection page**:
   - Navigate to `/role` in your application
   - Click on "Demo Login as Migrant" or "Demo Login as Guide"

### Method 2: Using the Test Page

1. **Open the test page**:
   ```bash
   # Open test-demo-login.html in your browser
   # Or serve it with a simple HTTP server
   ```

2. **Test both roles**:
   - Click "Test Migrant Demo Login"
   - Click "Test Guide Demo Login"
   - Verify the responses show correct user data

### Method 3: Manual Login Page

1. **Navigate to `/manual-login`**
2. **Use quick login buttons**:
   - "Login as Dr. Michael Rodriguez (Guide)"
   - "Login as Sarah Chen (Migrant)"

## 🔧 API Endpoint Details

### Demo Login Endpoint
```
POST /auth/demo-login
Content-Type: application/json

{
  "role": "migrant" | "guide"
}
```

### Response Format
```json
{
  "_id": "user_object_id",
  "displayName": "User Name",
  "email": "user@example.com",
  "role": "migrant" | "guide",
  "googleId": "demo_google_id",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 🎨 Frontend Integration

### DemoLoginButton Component
```jsx
import DemoLoginButton from "../components/DemoLoginButton";

// Usage
<DemoLoginButton role="migrant" />
<DemoLoginButton role="guide" />
```

### Features:
- ✅ Automatic role-based user creation
- ✅ Profile generation with sample data
- ✅ AuthContext integration
- ✅ Toast notifications
- ✅ Proper navigation after login
- ✅ Error handling

## 🔄 Navigation Flow

### After Demo Login:
- **Migrant**: Redirected to `/home` (main dashboard)
- **Guide**: Redirected to `/home/guide` (guide dashboard)

## 🛠️ Environment Setup

### Required Environment Variables:
```env
# .env.local
VITE_API_BASE_URL=http://localhost:5000/api
VITE_AUTH_BASE_URL=http://localhost:5000
```

### Database Requirements:
- MongoDB connection established
- Collections initialized (users, profiles, etc.)
- Optional: Seed data loaded for richer demo experience

## 🐛 Troubleshooting

### Common Issues:

1. **"User not found" error**:
   - Run `node server/seedData.js` to create demo users
   - Check MongoDB connection

2. **CORS errors**:
   - Verify server is running on port 5000
   - Check CORS configuration in server/index.js

3. **Navigation not working**:
   - Verify AuthContext is properly set up
   - Check route configuration

4. **Session not persisting**:
   - Ensure cookies are enabled
   - Check session configuration in server

### Debug Steps:

1. **Check server logs** for authentication messages
2. **Open browser dev tools** to see network requests
3. **Verify database** has demo users:
   ```bash
   node server/test-mongodb.js
   ```

## 📝 Sample Test Scenarios

### Scenario 1: Migrant Flow
1. Click "Demo Login as Migrant"
2. Should redirect to `/home`
3. Verify migrant dashboard loads
4. Check profile shows Sarah Chen's data

### Scenario 2: Guide Flow
1. Click "Demo Login as Guide"
2. Should redirect to `/home/guide`
3. Verify guide dashboard loads
4. Check profile shows Dr. Michael Rodriguez's data

### Scenario 3: Role Switching
1. Login as migrant
2. Logout
3. Login as guide
4. Verify different dashboard and data

## 🎉 Success Criteria

Demo login is working correctly when:
- ✅ Both migrant and guide demo logins work
- ✅ Users are redirected to correct dashboards
- ✅ Profiles are automatically created
- ✅ Session persists across page refreshes
- ✅ Logout clears session properly
- ✅ Error handling works for edge cases

## 🔗 Related Files

- `src_js/components/DemoLoginButton.jsx` - Demo login component
- `src_js/pages/RoleSelect.jsx` - Role selection with demo login
- `src_js/pages/ManualLogin.jsx` - Manual login for testing
- `server/index.js` - Demo login endpoint
- `server/seedData.js` - Demo user creation
- `test-demo-login.html` - Standalone test page