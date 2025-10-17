# Debug Steps for Guide Dashboard Issue

## Current Issue
The guide dashboard shows "Something went wrong" error page instead of loading properly.

## Debugging Steps

### Step 1: Check if Server is Running
1. Make sure the server is running on `http://localhost:5000`
2. Check server console for any errors

### Step 2: Test Authentication
1. Go to `/manual-login`
2. Login as "Dr. Michael Rodriguez" (use the name field)
3. Check browser console for any errors
4. Verify you're redirected to `/home/guide`

### Step 3: Test Dashboard Access
1. After logging in, click "Dashboard" in the navigation
2. Should go to `/dashboard-guide`
3. Check browser console for debug logs:
   - Look for "🔍 Dashboard Debug:" logs
   - Check authentication status
   - Look for API call results

### Step 4: Check API Endpoints
Open browser dev tools and check Network tab:
1. `GET /auth/user` - Should return user data (200 status)
2. `GET /api/guide-sessions?guideId=X` - Should return sessions (200 status)

### Step 5: Expected Debug Output
In browser console, you should see:
```
🔍 Dashboard Debug: {
  currentUser: { _id: "...", displayName: "Dr. Michael Rodriguez", role: "guide" },
  userLoading: false,
  userError: null,
  isAuthenticated: true
}
```

## Common Issues & Solutions

### Issue 1: User Not Authenticated
**Symptoms**: `userError` or `currentUser` is null
**Solution**: 
1. Go to `/manual-login`
2. Login as "Dr. Michael Rodriguez"
3. Try dashboard again

### Issue 2: Server Not Running
**Symptoms**: Network errors in console
**Solution**: 
1. Start server: `cd server && node index.js`
2. Verify server runs on port 5000

### Issue 3: Database Connection Issues
**Symptoms**: API calls return 500 errors
**Solution**: 
1. Check MongoDB is running
2. Check server console for database errors
3. Run test user creation script if needed

### Issue 4: Session Data Missing
**Symptoms**: User authenticated but no sessions load
**Solution**: 
1. Create test session by logging in as migrant
2. Go to `/guides`, find Michael, click "Book Call"
3. Submit a call request
4. Then check guide dashboard

## Test Flow to Create Session Data

### As Migrant (Ishika):
1. `/manual-login` → Login as "Ishika Sharma"
2. `/guides` → Find "Dr. Michael Rodriguez"
3. Click "Book Call" → Fill form → Submit
4. Should see success message

### As Guide (Michael):
1. `/manual-login` → Login as "Dr. Michael Rodriguez"  
2. `/dashboard-guide` → Should see Ishika's request
3. Click "Accept" → Should work properly

## Expected Working State
- Guide dashboard loads without errors
- Shows session requests from migrants
- Accept/decline buttons work
- Real-time polling works (every 10 seconds)
- Notifications appear for new requests