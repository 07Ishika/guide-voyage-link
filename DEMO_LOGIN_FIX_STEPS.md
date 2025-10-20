# 🔧 Demo Login Fix - Step by Step

## The Problem
Both migrant and guide demo login buttons are logging in as the same user (guide) instead of their respective roles.

## Root Cause
The production database likely has duplicate or incorrectly configured demo users, causing the demo login to find the wrong user.

## 🚀 Quick Fix Steps

### Step 1: Clean Production Database
Run this script to fix the demo users in your Atlas database:

```bash
# Set your Atlas connection string
export MONGODB_URI="your-atlas-connection-string"

# Run the fix script
node fix-demo-users.js
```

### Step 2: Test the Fix
After running the fix script, test the demo login:

1. **Visit**: https://guide-voyage-link.vercel.app/role
2. **Test Migrant**: Click "Demo Login as Migrant" → Should show Sarah Chen
3. **Test Guide**: Click "Demo Login as Guide" → Should show Dr. Michael Rodriguez

### Step 3: Verify in Browser
Open browser dev tools and check:
- Network tab shows successful API calls
- Console shows correct user data
- Navigation goes to correct dashboards

## 🛠️ Alternative Manual Fix

If the script doesn't work, manually clean the database:

### Using MongoDB Compass or Atlas UI:
1. **Connect to your Atlas database**
2. **Delete existing demo users**:
   ```javascript
   // In users collection
   db.users.deleteMany({
     $or: [
       { email: "sarah@example.com" },
       { email: "michael@example.com" }
     ]
   })
   ```

3. **Delete existing demo profiles**:
   ```javascript
   // In profiles collection  
   db.profiles.deleteMany({
     $or: [
       { email: "sarah@example.com" },
       { email: "michael@example.com" }
     ]
   })
   ```

4. **Test demo login** - it will create fresh users automatically

## 🎯 Expected Result

After the fix:
- **Migrant Demo Login** → Sarah Chen (sarah@example.com) → `/home`
- **Guide Demo Login** → Dr. Michael Rodriguez (michael@example.com) → `/home/guide`

## 🔍 Debugging

If it still doesn't work:

1. **Check backend logs** on Render dashboard
2. **Test API directly**:
   ```bash
   curl -X POST https://guide-voyage-link-1.onrender.com/auth/demo-login \
     -H "Content-Type: application/json" \
     -d '{"role": "migrant"}'
   ```
3. **Verify database** has correct users with `node server/verify-demo-setup.js`

## 🎉 Success Criteria

Demo login is fixed when:
- ✅ Migrant login shows Sarah Chen's profile
- ✅ Guide login shows Dr. Rodriguez's profile  
- ✅ Different dashboards load for each role
- ✅ No console errors or API failures