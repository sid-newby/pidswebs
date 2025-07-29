Core Microsoft Graph API Approach
Microsoft Graph API is your gateway to calendar functionality, providing access to calendar events, free/busy information, and meeting scheduling capabilities through endpoints like creating events, finding meeting times, and managing calendars Outlook calendar API overview - Microsoft Graph | Microsoft Learn +2.
Key APIs You'll Need:

Calendar Events API

Create/read/update/delete events
POST /me/calendar/events for creating new events Create event - Microsoft Graph v1.0 | Microsoft Learn
Manage recurring meetings
Handle meeting invitations and responses


FindMeetingTimes API

Suggest meeting times based on attendee availability and constraints, taking into account work schedules and free/busy status Stack OverflowGitHub
Intelligently suggest optimal meeting slots
Consider room availability


Free/Busy API

Get scheduleInformation objects for users/resources to check availability Find possible meeting times on the Outlook calendar - Microsoft Graph | Microsoft Learn
Display availability grids



Implementation Stack
1. Microsoft Graph Toolkit for React
Use @microsoft/mgt-react package which wraps Microsoft Graph Toolkit web components in React components Use the Microsoft Graph Toolkit with React - Microsoft Graph | Microsoft Learn:
bashnpm i @microsoft/mgt-react @microsoft/mgt-element @microsoft/mgt-msal2-provider
2. Authentication Setup
You'll need to:

Register an app in Azure AD
Configure MSAL2 provider for authentication
Required scopes: calendars.read, user.read, openid, profile, people.read Use the Microsoft Graph Toolkit with React - Microsoft Graph | Microsoft Learn

3. Core Packages
bashnpm i @microsoft/microsoft-graph-client @microsoft/microsoft-graph-types
Alternative Approaches
Microsoft Bookings API
If you want something simpler, Microsoft Bookings API is built into Microsoft 365 and allows managing customer bookings with minimal setup Microsoft LearnMicrosoft. However, it's more limited than building a custom solution.
Third-Party APIs (If Reconsidering)
CalendarBridge offers a React SDK with pre-built components and handles OAuth complexity for Google, Outlook, and iCloud calendars Scheduling & Booking Calendar API for REACT App Developers | CalendarBridge - though this goes against your "no third-party" requirement.
Sample ArchitectureMicrosoft Teams Scheduling App - React ComponentInteractive artifact Crafted potential scheduling solution for Microsoft Teams integration.1sThe artifact has been created successfully. Now let me provide some additional implementation details and considerations.Key Implementation Details
Authentication Flow
javascript// Initialize MSAL provider
const msalConfig = {
  auth: {
    clientId: 'YOUR_APP_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: window.location.origin
  }
};
Creating a Meeting with Teams Link
javascriptconst createMeeting = async () => {
  const event = {
    subject: meetingTitle,
    body: { contentType: "HTML", content: "Meeting agenda" },
    start: { dateTime: startTime, timeZone: "UTC" },
    end: { dateTime: endTime, timeZone: "UTC" },
    attendees: attendeesList,
    isOnlineMeeting: true,
    onlineMeetingProvider: "teamsForBusiness"
  };
  
  const response = await graphClient
    .api('/me/calendar/events')
    .post(event);
};
Finding Available Times
javascriptconst findTimes = async () => {
  const constraints = {
    attendees: [{ emailAddress: { address: "user@company.com" }}],
    timeConstraint: {
      activityDomain: "work",
      timeslots: [{ start, end }]
    },
    meetingDuration: "PT1H",
    minimumAttendeePercentage: 100
  };
  
  const suggestions = await graphClient
    .api('/me/findMeetingTimes')
    .post(constraints);
};
Advantages Over Calendly/HubSpot

Full Control: Complete customization of UI/UX and workflow
Data Privacy: All data stays within your Microsoft 365 tenant
No Additional Costs: Uses existing Microsoft 365 licenses
Deep Integration: Native Teams meeting creation, presence info, organizational hierarchy
Custom Business Logic: Implement your own rules for scheduling, approvals, etc.

Considerations

The findMeetingTimes API requires delegated permissions (not application permissions), meaning users must be logged in json - Microsoft Graph FindMeetingTimes API - Only returning 5 locations? - Stack Overflow
Microsoft Bookings (built into M365) costs as little as $7.20/month per user and includes basic scheduling, but lacks advanced features Microsoft Bookings vs Calendly: Which is best? [2025]
You'll need to handle timezone conversions carefully
Consider implementing webhooks for real-time calendar updates

Getting Started

Register app in Azure AD portal
Set up authentication with MSAL
Install Microsoft Graph Toolkit for React
Start with basic calendar read operations
Progressively add scheduling features

This approach gives you a fully custom scheduling solution integrated with Teams without third-party dependencies. The Microsoft Graph API provides all the building blocks you need for a robust scheduling system.