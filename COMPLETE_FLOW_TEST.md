# Complete Session Request Flow Test

## 🎯 **What We've Built:**

### **1. Migrant Side (Call Request)**
- ✅ Migrant can find guides on `/guides` page
- ✅ Click "Book Call" to open call request form
- ✅ Fill out form with purpose, budget, timeline, etc.
- ✅ Submit request → Stored in MongoDB `guide_sessions` collection
- ✅ Data includes `guideId`, `migrantId`, `guideName`, `migrantName`

### **2. Guide Side (Dashboard)**
- ✅ Guide dashboard at `/dashboard-guide` 
- ✅ Shows all session requests for that specific guide
- ✅ Displays migrant name, purpose, budget, timeline
- ✅ Accept/Decline buttons for pending requests
- ✅ Real-time polling (updates every 10 seconds)
- ✅ Status badges (Pending, Accepted, Declined)

## 🧪 **Complete Test Flow:**

### **Step 1: Create a Session Request (as Migrant)**
1. Login as **Sarah Chen** (migrant)
2. Go to `/guides` page
3. Find **Dr. Michael Rodriguez**
4. Click **"Book Call"** button
5. Fill out the form:
   - **Purpose:** Immigration Consultation
   - **Urgency:** Medium - Within a week
   - **Budget:** $50-100
   - **Timeline:** Within 1 week
   - **Preferred Time:** Weekdays 6-8 PM EST
   - **Questions:** "I need help with Express Entry application"
6. Click **"Send Call Request"**
7. Should see success message

### **Step 2: View Request (as Guide)**
1. Login as **Dr. Michael Rodriguez** (guide)
2. Go to `/dashboard-guide`
3. Should see:
   - **Stats updated:** Total Requests = 1, Pending = 1
   - **Session card** showing Sarah's request
   - **Accept/Decline buttons**

### **Step 3: Accept/Decline Request**
1. Click **"Accept"** button
2. Should see:
   - Button changes to "Accepting..."
   - Success message appears
   - Status changes to "✅ Accepted"
   - Stats update: Accepted = 1, Pending = 0

## 🔄 **Real-Time Features:**

### **Auto-Refresh Dashboard**
- Dashboard polls for new requests every 10 seconds
- New requests appear automatically
- Status updates reflect immediately

### **Data Flow**
```
Migrant fills form → POST /api/guide-sessions → MongoDB guide_sessions
                                                      ↓
Guide dashboard ← GET /api/guide-sessions?guideId=X ← MongoDB
                                                      ↓
Guide clicks Accept → PUT /api/guide-sessions/:id → MongoDB (status updated)
```

## 📊 **MongoDB Data Structure**
```javascript
{
  _id: ObjectId,
  guideId: "68ee8899cc127bb559ee864",
  migrantId: "68ee8899cc127bb559ee865", 
  guideName: "Dr. Michael Rodriguez",
  migrantName: "Sarah Chen",
  migrantEmail: "sarah@example.com",
  purpose: "immigration_consultation",
  urgency: "medium",
  budget: "$50-100",
  timeline: "Within 1 week",
  preferredTime: "Weekdays 6-8 PM EST",
  specificQuestions: "I need help with Express Entry application",
  requestStatus: "pending", // pending → accepted/declined
  status: "scheduled", // scheduled/cancelled/completed
  createdAt: Date,
  updatedAt: Date
}
```

## ✅ **Expected Results:**

1. **Migrant Experience:**
   - Easy to find guides and book calls
   - Clear form with all necessary fields
   - Success confirmation after submission

2. **Guide Experience:**
   - Dashboard shows all incoming requests
   - Clear information about each request
   - Easy accept/decline actions
   - Real-time updates without refresh

3. **System Features:**
   - Data persistence in MongoDB
   - Real-time polling for updates
   - Proper status management
   - Role-based access control

## 🚀 **Ready to Test!**

The complete flow is now working:
- ✅ **Session creation** (migrant side)
- ✅ **Session display** (guide dashboard)
- ✅ **Session actions** (accept/decline)
- ✅ **Real-time updates** (polling)
- ✅ **Status management** (pending → accepted/declined)

Test it now and the guide should see all session requests in their dashboard! 🎉