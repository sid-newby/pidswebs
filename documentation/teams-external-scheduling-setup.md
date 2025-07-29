# Teams External Scheduling Setup Guide

## Problem
The current setup uses delegated permissions which only allows scheduling meetings with users in the same Microsoft 365 tenant/domain. External users from different organizations cannot be invited.

## Solution: Application Permissions

### 1. Azure App Registration Changes

In your Azure App Registration, you need to change from delegated permissions to application permissions:

**Remove these delegated permissions:**
- User.Read
- Calendars.ReadWrite  
- OnlineMeetings.ReadWrite

**Add these application permissions:**
- Calendars.ReadWrite
- OnlineMeetings.ReadWrite
- User.Read.All (if needed for user info)

### 2. Admin Consent Required
Application permissions require admin consent for the entire tenant.

### 3. Authentication Method Change
Instead of interactive user login, use client credentials flow:

```javascript
// New authentication approach for application permissions
const clientCredentialRequest = {
    scopes: ['https://graph.microsoft.com/.default'],
    clientId: process.env.VITE_AZURE_CLIENT_ID,
    clientSecret: process.env.VITE_AZURE_CLIENT_SECRET, // Server-side only!
    authority: `https://login.microsoftonline.com/${process.env.VITE_AZURE_TENANT_ID}`
};
```

### 4. Security Considerations
- Client secret must be stored server-side only
- Never expose client secret in frontend code
- Consider using certificate authentication instead of client secret

### 5. Implementation Options

#### Option A: Backend API Approach (Recommended)
1. Create a backend API endpoint for scheduling
2. Frontend sends booking data to backend
3. Backend authenticates with client credentials
4. Backend creates Teams meeting and calendar event
5. Backend returns meeting details to frontend

#### Option B: Azure Function/Serverless
1. Create Azure Function for meeting creation
2. Use managed identity or app registration
3. Frontend calls function with booking data
4. Function creates meeting and returns details

### 6. Code Structure Changes Needed

**Frontend (TeamsScheduler.jsx):**
- Remove MSAL authentication
- Call backend API instead of Graph API directly
- Handle responses from backend

**Backend API:**
- Implement client credentials authentication
- Create Teams meeting with external attendees
- Handle error cases and responses

### 7. Benefits of Application Permissions
- Can invite external users from any domain
- No user interaction required for authentication
- Consistent authentication state
- Better for automated/scheduled operations

### 8. Meeting Creation with External Attendees

```javascript
// Example meeting creation with external attendee
const meeting = {
    subject: "Training Session",
    attendees: [
        {
            emailAddress: {
                address: "external.user@anydomain.com", // Any external email
                name: "External User"
            },
            type: "required"
        }
    ],
    isOnlineMeeting: true,
    onlineMeetingProvider: "teamsForBusiness"
};
```

This approach will allow scheduling Teams meetings with any external email address, not just users within your organization's domain.


The original setup only allowed scheduling meetings with users in the same Microsoft 365 domain/tenant due to using delegated permissions. This prevented external users from different organizations from being invited to Teams meetings.

Solution Implemented
1. Backend Service Architecture
Created teamsBackendService.js that calls a backend API instead of direct Microsoft Graph API calls
The backend will use application permissions (client credentials flow) to bypass domain restrictions
Frontend no longer requires visitor authentication
2. No Visitor Authentication Required
Visitors simply fill out their information (name, email, company, phone)
No Microsoft account sign-in required for users
System creates meetings on organization's calendar and invites external attendees
3. Key Files Created/Updated
New Backend Service (src/services/teamsBackendService.js):

createMeetingWithExternalAttendees() - Creates Teams meetings with any external email
getCalendarEvents() - Retrieves calendar availability
checkServiceHealth() - Monitors backend service status
Updated Frontend (src/components/TeamsScheduler.jsx):

Removed visitor authentication requirements
Uses backend service instead of direct MSAL calls
Shows service status to users
Graceful fallback when backend unavailable
Documentation (documentation/teams-external-scheduling-setup.md):

Complete setup guide for application permissions
Instructions for Azure App Registration changes
Backend implementation options
4. How It Works Now
Visitor Experience:

Fill out form with their email (any domain)
Select date/time
Submit booking
Receive Teams meeting invitation at their email
Backend Processing:

Backend authenticates with organization's Microsoft account
Creates Teams meeting on organization's calendar
Invites external attendee via email
Returns meeting details to frontend
Benefits:

✅ Works with ANY external email domain
✅ No visitor authentication required
✅ Meetings created on organization's calendar
✅ Automatic Teams meeting invitations sent
✅ Graceful fallback if service unavailable
5. Next Steps
To complete the implementation, you need to:

Set up the backend API with application permissions
Update Azure App Registration with application permissions instead of delegated
Configure the backend service URL in environment variables
Deploy the backend service
The frontend is now ready to work with external attendees from any domain once the backend is set up with proper application permissions.

