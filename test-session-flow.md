# Session Flow Test Plan

## Overview
Testing the complete flow from migrant booking a call to guide seeing the session request.

## Flow Steps

### 1. Migrant Side (Find Guide → Book Call)
- Navigate to `/guides` page
- Click "Book Call" button on any guide
- Fill out the CallRequest form
- Submit the form
- Data should be stored in `guide_sessions` collection

### 2. Guide Side (Dashboard)
- Navigate to `/dashboard-guide` 
- Should see the session request in pending state
- Can accept or decline the request
- Status updates should be reflected in MongoDB

## API Endpoints Used

### Frontend → Backend
1. `POST /api/guide-sessions` - Create session request
2. `GET /api/guide-sessions?guideId=xxx` - Fetch guide's sessions  
3. `PUT /api/guide-sessions/:sessionId` - Update session status

### Data Flow
```
CallRequest.jsx → apiService.createGuideSession() → POST /api/guide-sessions → MongoDB guide_sessions collection

DashboardGuide.jsx → apiService.getGuideSessions() → GET /api/guide-sessions → MongoDB guide_sessions collection
```

## Test Data Structure

### Session Request Data (from CallRequest)
```json
{
  "guideId": "guide_id_here",
  "migrantId": "migrant_id_here", 
  "sessionType": "initial",
  "duration": 60,
  "status": "scheduled",
  "title": "Call Request: immigration_consultation",
  "purpose": "immigration_consultation",
  "urgency": "medium",
  "budget": "50-100",
  "timeline": "1-week",
  "preferredTime": "Weekdays 6-8 PM EST",
  "specificQuestions": "Questions about visa process",
  "guideName": "Guide Name",
  "migrantName": "Migrant Name",
  "migrantEmail": "migrant@email.com",
  "requestStatus": "pending"
}
```

## Testing Steps

1. **Start Server**: `cd server && node index.js`
2. **Start Frontend**: `npm run dev`
3. **Test API**: `curl http://localhost:5000/api/guide-sessions`
4. **Test Flow**: 
   - Go to guides page
   - Click "Book Call"
   - Fill form and submit
   - Check guide dashboard
   - Verify data in MongoDB

## Expected Results

✅ Session request created in MongoDB  
✅ Guide sees request in dashboard  
✅ Guide can accept/decline request  
✅ Status updates properly  
✅ Real-time data flow working  

## Current Status
- ✅ CallRequest.jsx updated to use guide_sessions
- ✅ DashboardGuide.jsx updated to fetch sessions
- ✅ API service methods added
- ✅ Backend endpoints implemented
- 🔄 Testing in progress...