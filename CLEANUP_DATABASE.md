# Database Cleanup Instructions

## Problem:
- **2 migrant_requests** in MongoDB
- **4 guide_sessions** showing in dashboard  
- **Need synchronization** between collections

## Solution:

### **Step 1: Clean Up Duplicate Sessions**

**Option A: Using MongoDB Compass (Recommended)**
1. Open MongoDB Compass
2. Navigate to `voyagery` database → `guide_sessions` collection
3. **Delete all documents** in guide_sessions collection
4. This will clear all duplicate/test sessions

**Option B: Using MongoDB Shell**
```javascript
// Connect to MongoDB
use voyagery

// Clear all guide sessions
db.guide_sessions.deleteMany({})

// Verify it's empty
db.guide_sessions.countDocuments()  // Should return 0
```

### **Step 2: Restart Server**
```bash
cd guide-voyage-link/server
node index.js
```

### **Step 3: Create New Session Requests**
1. **Login as migrant** (Sarah Chen)
2. **Go to `/guides`** page
3. **Find Dr. Michael Rodriguez**
4. **Click "Book Call"** and submit request
5. **Repeat** for any other test requests you want

### **Step 4: Verify Synchronization**
1. **Check MongoDB:** Should have same number in both collections
2. **Check Dashboard:** Should show only the actual requests
3. **Test Accept/Decline:** Should work properly

## Expected Result:

### **Before Cleanup:**
- migrant_requests: 2 documents
- guide_sessions: 4 documents (duplicates/test data)
- Dashboard: Shows 4 sessions (confusing)

### **After Cleanup:**
- migrant_requests: 2 documents  
- guide_sessions: 2 documents (synchronized)
- Dashboard: Shows 2 sessions (accurate)

## New Dashboard Structure:

### **Pending Requests Section:**
- Shows only `requestStatus: 'pending'` sessions
- Has Accept/Decline buttons
- Clean, focused view

### **Active Sessions Section:**
- Shows only `requestStatus: 'accepted'` sessions  
- Has Contact/Schedule buttons
- Separate from pending requests

### **Stats Cards:**
- **Total Requests:** All sessions ever created
- **Pending:** Need guide response
- **Active Sessions:** Accepted and scheduled
- **Completed:** Finished sessions

This will give you a clean, synchronized dashboard that accurately reflects the actual migrant requests! 🚀