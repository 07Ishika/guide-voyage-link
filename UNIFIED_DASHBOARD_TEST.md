# Unified Dashboard Test

## What Changed:

✅ **Same Dashboard for Both Roles**: `/dashboard-guide` now works for both guides and migrants

✅ **Real Database Info**: Shows actual user name, email, and role from database

✅ **Role-Based Content**: Different content based on user role, same interface

## Expected Behavior:

### 👨‍⚕️ **As Dr. Michael Rodriguez (Guide):**
- **Header**: "Guide Dashboard"
- **User Info**: Shows "Dr. Michael Rodriguez • michael@example.com • Guide"
- **Stats**: "Total Requests", "Accepted", "Pending", "Completed"
- **Sessions**: Shows requests FROM migrants TO him
- **Actions**: Can Accept/Decline pending requests
- **Empty State**: "No requests received yet"

### 👩‍💻 **As Sarah Chen (Migrant):**
- **Header**: "My Requests Dashboard"  
- **User Info**: Shows "Sarah Chen • sarah@example.com • Migrant"
- **Stats**: "My Requests", "Accepted", "Pending", "Completed"
- **Sessions**: Shows requests FROM her TO guides
- **Actions**: Shows "Waiting for guide response..." for pending
- **Empty State**: "No requests made yet" + "Find Guides" button

### 👩‍💼 **As Ishika Sharma (Migrant):**
- Same as Sarah, but shows Ishika's data

## Test Flow:

### Step 1: Test Sarah (Migrant Dashboard)
1. Login as "Sarah Chen" → Go to `/dashboard-guide`
2. Should show "My Requests Dashboard" with Sarah's info
3. Should show empty state with "Find Guides" button
4. Go to `/guides` → Find Michael → "Book Call" → Submit request
5. Go back to `/dashboard-guide` → Should see her request to Michael
6. Status should show "Waiting for guide response..."

### Step 2: Test Michael (Guide Dashboard)  
1. Login as "Dr. Michael Rodriguez" → Go to `/dashboard-guide`
2. Should show "Guide Dashboard" with Michael's info
3. Should see Sarah's request with Accept/Decline buttons
4. Click "Accept" → Should update status
5. Sarah's dashboard should now show "Accepted" status

### Step 3: Test Ishika (Migrant Dashboard)
1. Login as "Ishika Sharma" → Go to `/dashboard-guide`
2. Should show "My Requests Dashboard" with Ishika's info
3. Make a request to Michael
4. Both Ishika and Michael should see the request in their respective dashboards

## Key Features:

✅ **Unified Interface**: Same dashboard URL and layout for both roles

✅ **Real User Data**: Shows actual names, emails, roles from database

✅ **Role-Based Views**: 
- Guides see incoming requests
- Migrants see outgoing requests

✅ **Proper Actions**:
- Guides can accept/decline
- Migrants see status updates

✅ **Smart Empty States**: Different messages and actions based on role

This creates a consistent experience where both users use the same dashboard but see role-appropriate content!