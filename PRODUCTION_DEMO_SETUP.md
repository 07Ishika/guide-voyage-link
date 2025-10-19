# 🚀 Production Demo Setup (Vercel + Render)

## Current Deployment Architecture
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render (https://guide-voyage-link-1.onrender.com)
- **Database**: MongoDB Atlas

## 🔧 Production Configuration

### Environment Variables
The production environment is already configured with:
```env
VITE_API_BASE_URL=https://guide-voyage-link-1.onrender.com/api
VITE_AUTH_BASE_URL=https://guide-voyage-link-1.onrender.com
```

### Demo Login Endpoint
The demo login is available at:
```
POST https://guide-voyage-link-1.onrender.com/auth/demo-login
```

## 🎯 Testing Production Demo Login

### Method 1: Direct API Test
```bash
curl -X POST https://guide-voyage-link-1.onrender.com/auth/demo-login \
  -H "Content-Type: application/json" \
  -d '{"role": "migrant"}'
```

### Method 2: Frontend Testing
1. **Visit your Vercel app**: https://your-vercel-app.vercel.app/role
2. **Click demo login buttons** for both migrant and guide
3. **Verify proper navigation** and dashboard loading

## 🛠️ Production Database Setup

### Seed Production Database
To ensure demo users exist in production:

1. **Connect to production database**:
   ```bash
   # Update MONGODB_URI in server/.env to point to Atlas
   # Then run from your local machine:
   cd server
   node seedData.js
   ```

2. **Verify demo users exist**:
   ```bash
   node verify-demo-setup.js
   ```

### Expected Demo Users
- **Migrant**: Sarah Chen (sarah@example.com)
- **Guide**: Dr. Michael Rodriguez (michael@example.com)

## 🔍 Production Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Verify Render backend allows Vercel domain
   - Check CORS configuration in server/index.js

2. **Demo Users Not Found**:
   - Run seedData.js against production database
   - Check MongoDB Atlas connection

3. **Session Issues**:
   - Verify session store is configured for production
   - Check cookie settings for cross-domain

### Debug Steps:

1. **Check backend health**:
   ```
   GET https://guide-voyage-link-1.onrender.com/health
   ```

2. **Test demo login directly**:
   ```bash
   curl -X POST https://guide-voyage-link-1.onrender.com/auth/demo-login \
     -H "Content-Type: application/json" \
     -d '{"role": "guide"}' \
     -v
   ```

3. **Check browser network tab** for API calls and responses

## 🚀 Production Demo Flow

### For Stakeholders/Demos:
1. **Share Vercel URL**: https://your-app.vercel.app
2. **Navigate to**: `/role` page
3. **Demo migrant experience**: Click "Demo Login as Migrant"
4. **Demo guide experience**: Click "Demo Login as Guide"
5. **Show features**: Browse through dashboards, profiles, sessions

### Expected Behavior:
- ✅ Instant login without Google OAuth
- ✅ Role-based navigation (migrant → `/home`, guide → `/home/guide`)
- ✅ Pre-populated profiles and sample data
- ✅ Full functionality demonstration

## 📱 Mobile Testing
The demo login works on mobile devices too:
- Responsive design maintained
- Touch-friendly demo login buttons
- Proper navigation on mobile browsers

## 🔐 Security Notes
- Demo users are clearly marked as test accounts
- Limited to development/demo purposes
- No sensitive data in demo profiles
- Easy to identify and clean up if needed

## 🎉 Ready for Production Demo!

Your Voyagery app is now ready to showcase both migrant and guide experiences in production without requiring users to set up Google OAuth or create real accounts.