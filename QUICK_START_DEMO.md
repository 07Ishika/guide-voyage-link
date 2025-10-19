# 🚀 Quick Start: Demo Login

## Ready to showcase Voyagery? Here's how to get the demo login working in 3 steps:

### Step 1: Start the Server
```bash
cd server
node index.js
```
✅ Server should show: "Connected to MongoDB with all collections and GridFS initialized"

### Step 2: Start the Frontend
```bash
# In a new terminal, from the root directory
npm run dev
```
✅ Frontend should be available at http://localhost:5173

### Step 3: Test Demo Login
1. **Navigate to**: http://localhost:5173/role
2. **Click**: "Demo Login as Migrant" or "Demo Login as Guide"
3. **Verify**: You're redirected to the appropriate dashboard

## 🎯 What You'll See

### Migrant Demo (Sarah Chen)
- **Dashboard**: `/home` - Migrant-focused interface
- **Features**: Browse guides, book sessions, track progress
- **Profile**: Pre-filled with realistic migrant data

### Guide Demo (Dr. Michael Rodriguez)
- **Dashboard**: `/home/guide` - Guide-focused interface  
- **Features**: Manage sessions, view requests, update availability
- **Profile**: Pre-filled with professional guide credentials

## 🔧 Troubleshooting

### "Connection Error" when clicking demo login?
- ✅ Check server is running on port 5000
- ✅ Verify `.env.local` exists with correct URLs

### "Demo Login Failed" error?
- ✅ Run: `node server/verify-demo-setup.js` to check database
- ✅ If needed, reseed: `node server/seedData.js`

### Wrong dashboard after login?
- ✅ Check browser console for navigation logs
- ✅ Verify AuthContext is properly updating user state

## 🎉 You're Ready!

The demo login is now working perfectly for showcasing both the migrant and guide experiences of Voyagery. Switch between roles to demonstrate the complete platform functionality!