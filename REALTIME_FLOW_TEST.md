# Real-Time Session Flow Testing Guide

## Overview
This document explains how to test the real-time session request flow between migrants and guides.

## Test Users Created
- **Guide**: Dr. Michael Rodriguez (michael@example.com)
- **Migrant 1**: Ishika Sharma (ishika@example.com)  
- **Migrant 2**: Sarah Chen (sarah@example.com)

## Complete Test Flow

### Step 1: Test as Migrant (Ishika)
1. Go to `/manual-login`
2. Login as "Ishika Sharma" (use name field)
3. Navigate to `/guides` 
4. Find "Dr. Michael Rodriguez" in the guides list
5. Click "Book Call" button
6. Fill out the call request form:
   - Purpose: Select "Immigration Consultation"
   - Additional Details: "I need help with Express Entry application"
   - Urgency: "High - Within 2-3 days"
   - Preferred Time: "Weekday evenings"
   - Budget: "$50-100"
   - Timeline: "Within 1 week"
   - Specific Questions: "What documents do I need for work experience?"
7. Click "Send Call Request"
8. Should see success message and redirect to guides page

### Step 2: Test as Guide (Michael)
1. Open a new browser tab/window
2. Go to `/manual-login`
3. Login as "Dr. Michael Rodriguez" (use name field)
4. Should be redirected to `/home/guide`
5. Click "Dashboard" in the navigation
6. Should see the new session request from Ishika
7. Notice:
   - Browser title shows "(1) Guide Dashboard - Voyagery"
   - New request has "NEW" badge and red notification dot
   - Request shows all details from Ishika's form
8. Click "Accept" button
9. Should see success toast and request status changes to "accepted"

### Step 3: Real-Time Features to Observe

#### For Guides:
- **Auto-refresh**: Dashboard polls for new requests every 10 seconds
- **Browser notifications**: If permission granted, shows desktop notification for new requests
- **Visual indicators**: New requests have pulsing animation, "NEW" badge, and red dot
- **Title updates**: Browser tab title shows pending request count
- **Toast notifications**: In-app notifications for new requests

#### For Migrants:
- **Success feedback**: Clear confirmation when request is sent
- **Request tracking**: Can see their request was submitted successfully

## Real-Time Database Flow

### When Migrant Submits Request:
1. Form data is validated
2. Session object is created with:
   - `guideId`: Target guide's user ID
   - `migrantId`: Current user's ID
   - `requestStatus`: "pending"
   - `status`: "pending"
   - All form details (purpose, urgency, budget, etc.)
3. Data is stored in `guide_sessions` collection
4. Success response sent to migrant

### When Guide Views Dashboard:
1. Fetches sessions where `guideId` matches current user
2. Displays all sessions with proper status indicators
3. Polls every 10 seconds for updates
4. Shows notifications for new pending requests

### When Guide Accepts/Declines:
1. Updates session with new `requestStatus`
2. Changes `status` to "scheduled" (if accepted) or "cancelled" (if declined)
3. Updates `updatedAt` timestamp
4. Returns updated session data

## API Endpoints Used

- `POST /api/guide-sessions` - Create new session request
- `GET /api/guide-sessions?guideId=X` - Get sessions for specific guide
- `PUT /api/guide-sessions/:id` - Update session status
- `GET /auth/user` - Get current authenticated user

## Database Collections

### guide_sessions
```javascript
{
  _id: ObjectId,
  guideId: "user_id_string",
  migrantId: "user_id_string", 
  title: "Immigration Consultation",
  purpose: "immigration_consultation",
  urgency: "high",
  budget: "$50-100",
  timeline: "Within 1 week",
  preferredTime: "Weekday evenings",
  specificQuestions: "What documents do I need?",
  requestStatus: "pending", // pending, accepted, declined
  status: "pending", // pending, scheduled, completed, cancelled
  migrantName: "Ishika Sharma",
  migrantEmail: "ishika@example.com",
  guideName: "Dr. Michael Rodriguez",
  createdAt: Date,
  updatedAt: Date
}
```

## Expected Behavior

✅ **Working Features:**
- Real-time session creation from migrant to guide
- Guide dashboard shows requests immediately (within 10 seconds)
- Accept/decline functionality works
- Visual indicators for new requests
- Browser notifications (if permission granted)
- Proper status tracking and updates

🔄 **Polling Mechanism:**
- Dashboard refreshes every 10 seconds
- New requests trigger notifications
- Visual feedback for all state changes

📱 **Responsive Design:**
- Works on desktop and mobile
- Proper card layouts for session requests
- Clear action buttons and status indicators

## Troubleshooting

### If requests don't appear:
1. Check browser console for API errors
2. Verify user IDs match between migrant request and guide dashboard
3. Check MongoDB for session data
4. Ensure polling is working (check console logs)

### If notifications don't work:
1. Grant browser notification permission
2. Check if toast notifications appear instead
3. Verify polling interval is running

### If accept/decline doesn't work:
1. Check network tab for API call success
2. Verify session ID is correct
3. Check server logs for update errors

## Next Steps for Enhancement

1. **WebSocket Integration**: Replace polling with real-time WebSocket connections
2. **Email Notifications**: Send email alerts for new requests
3. **Mobile Push Notifications**: Add PWA support with push notifications
4. **Calendar Integration**: Add actual meeting scheduling with calendar links
5. **Video Call Integration**: Add direct video call functionality
6. **Chat System**: Add real-time messaging between migrants and guides