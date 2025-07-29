// src/services/teamsBackendService.js
// Backend service for creating Teams meetings with external attendees

/**
 * Service for creating Teams meetings via backend API
 * This bypasses the domain restriction by using application permissions
 */
export const teamsBackendService = {
  /**
   * Create a Teams meeting with external attendees
   * @param {Object} meetingData - Meeting information
   * @returns {Promise<Object>} Meeting details including Teams link
   */
  createMeetingWithExternalAttendees: async (meetingData) => {
    const {
      platform,
      date,
      startTime,
      endTime,
      duration,
      attendee,
      timeZone = 'America/Chicago'
    } = meetingData;

    // Format date and time for API
    const startDateTime = `${date}T${startTime}:00`;
    const endDateTime = `${date}T${endTime}:00`;

    const requestBody = {
      subject: `${platform} Training Session - ${attendee.name}`,
      body: {
        contentType: 'HTML',
        content: `
          <h2>${platform} Training Session</h2>
          <p><strong>Duration:</strong> ${duration} minutes</p>
          <p><strong>Attendee:</strong> ${attendee.name} (${attendee.email})</p>
          ${attendee.company ? `<p><strong>Company:</strong> ${attendee.company}</p>` : ''}
          ${attendee.phone ? `<p><strong>Phone:</strong> ${attendee.phone}</p>` : ''}
          <p>This is an automated training session booking.</p>
        `
      },
      start: {
        dateTime: startDateTime,
        timeZone: timeZone
      },
      end: {
        dateTime: endDateTime,
        timeZone: timeZone
      },
      location: {
        displayName: 'Microsoft Teams Meeting'
      },
      attendees: [{
        emailAddress: {
          address: attendee.email,
          name: attendee.name
        },
        type: 'required'
      }],
      isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness',
      allowNewTimeProposals: false,
    };

    try {
      // Use Supabase Edge Function instead of separate backend
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-teams-meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers if needed
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const meetingDetails = await response.json();
      
      return {
        id: meetingDetails.id,
        webLink: meetingDetails.webLink,
        teamsMeetingUrl: meetingDetails.onlineMeeting?.joinUrl,
        subject: meetingDetails.subject,
        start: meetingDetails.start,
        end: meetingDetails.end,
        attendees: meetingDetails.attendees,
        organizer: meetingDetails.organizer,
      };
    } catch (error) {
      console.error('Error creating Teams meeting via backend:', error);
      throw error;
    }
  },

  /**
   * Get calendar events for availability checking
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} Calendar events
   */
  getCalendarEvents: async (date) => {
    const startDateTime = `${date}T00:00:00`;
    const endDateTime = `${date}T23:59:59`;
    
    try {
      const BACKEND_API_URL = import.meta.env.VITE_TEAMS_BACKEND_URL || 'http://localhost:3001/api';
      
      const response = await fetch(`${BACKEND_API_URL}/calendar-events?start=${startDateTime}&end=${endDateTime}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const events = await response.json();
      
      return events.map(event => ({
        id: event.id,
        subject: event.subject,
        startTime: new Date(event.start.dateTime).toTimeString().slice(0, 5),
        endTime: new Date(event.end.dateTime).toTimeString().slice(0, 5),
        isAllDay: event.isAllDay,
      }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return []; // Return empty array on error to allow scheduling to continue
    }
  },

  /**
   * Check if backend service is available
   * @returns {Promise<boolean>} Service availability
   */
  checkServiceHealth: async () => {
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      
      // Simple health check - try to call the function with OPTIONS (CORS preflight)
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-teams-meeting`, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Supabase Edge Function health check failed:', error);
      return false;
    }
  }
};
