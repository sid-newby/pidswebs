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
      // Use Vercel serverless function
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
      
      const response = await fetch(`${API_BASE_URL}/api/create-teams-meeting`, {
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
      // Try the current origin first, then fallback to configured API_BASE_URL
      const currentOrigin = window.location.origin;
      const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
      
      const urls = [
        `${currentOrigin}/api/calendar-events?start=${startDateTime}&end=${endDateTime}`,
        ...(configuredBaseUrl && configuredBaseUrl !== currentOrigin ? 
          [`${configuredBaseUrl}/api/calendar-events?start=${startDateTime}&end=${endDateTime}`] : [])
      ];
      
      console.log('Attempting calendar events fetch from URLs:', urls);
      
      for (const url of urls) {
        try {
          console.log('Trying URL:', url);
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log(`Response from ${url}:`, {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
          });

          if (response.ok) {
            const events = await response.json();
            console.log('Calendar events fetched successfully:', events.length, 'events');
            
            return events.map(event => ({
              id: event.id,
              subject: event.subject,
              startTime: new Date(event.start.dateTime).toTimeString().slice(0, 5),
              endTime: new Date(event.end.dateTime).toTimeString().slice(0, 5),
              isAllDay: event.isAllDay,
            }));
          } else {
            const errorText = await response.text().catch(() => 'Unknown error');
            console.warn(`Failed to fetch from ${url}:`, response.status, errorText.substring(0, 200));
          }
        } catch (fetchError) {
          console.warn(`Fetch error for ${url}:`, fetchError.message);
        }
      }
      
      throw new Error('All calendar API endpoints failed');
      
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        date,
        currentOrigin: window.location.origin,
        configuredBaseUrl: import.meta.env.VITE_API_BASE_URL
      });
      return []; // Return empty array on error to allow scheduling to continue
    }
  },

  /**
   * Check if backend service is available
   * @returns {Promise<boolean>} Service availability
   */
  checkServiceHealth: async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
    
    console.log('Checking service health at:', `${API_BASE_URL}/api/health`);
    
    try {
      // Use the health endpoint for better debugging
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Health check response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });

      if (response.ok) {
        const health = await response.json();
        console.log('API Health Check Success:', health);
        return true;
      } else {
        const errorText = await response.text();
        console.error('Health check failed:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText.substring(0, 200) // First 200 chars to see if it's HTML
        });
        return false;
      }
    } catch (error) {
      console.error('Vercel API health check failed:', {
        message: error.message,
        name: error.name,
        stack: error.stack?.substring(0, 200)
      });
      return false;
    }
  },

  /**
   * Test API connectivity and debug routing issues
   * @returns {Promise<Object>} Debug information
   */
  debugApiConnection: async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
    const results = {
      apiBaseUrl: API_BASE_URL,
      currentOrigin: window.location.origin,
      tests: {}
    };

    // Test health endpoint
    try {
      const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
      results.tests.health = {
        status: healthResponse.status,
        ok: healthResponse.ok,
        url: `${API_BASE_URL}/api/health`
      };
      
      if (healthResponse.ok) {
        results.tests.health.data = await healthResponse.json();
      } else {
        results.tests.health.error = await healthResponse.text();
      }
    } catch (error) {
      results.tests.health = {
        error: error.message,
        url: `${API_BASE_URL}/api/health`
      };
    }

    // Test calendar events endpoint
    try {
      const testDate = new Date().toISOString().split('T')[0];
      const calendarResponse = await fetch(`${API_BASE_URL}/api/calendar-events?start=${testDate}T00:00:00&end=${testDate}T23:59:59`);
      results.tests.calendarEvents = {
        status: calendarResponse.status,
        ok: calendarResponse.ok,
        url: `${API_BASE_URL}/api/calendar-events?start=${testDate}T00:00:00&end=${testDate}T23:59:59`
      };

      if (calendarResponse.ok) {
        results.tests.calendarEvents.data = await calendarResponse.json();
      } else {
        results.tests.calendarEvents.error = await calendarResponse.text();
      }
    } catch (error) {
      results.tests.calendarEvents = {
        error: error.message
      };
    }

    console.log('API Debug Results:', results);
    return results;
  }
};
