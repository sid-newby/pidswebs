// src/services/teamsMeeting.js
import { msalAuth } from './msalAuth';

const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';

// Helper function to make authenticated Graph API calls
const graphApiCall = async (endpoint, options = {}) => {
  const accessToken = await msalAuth.getAccessToken();
  
  const response = await fetch(`${GRAPH_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Graph API call failed');
  }

  return response.json();
};

export const teamsMeetingService = {
  // Create a Teams meeting with calendar event
  createMeetingWithCalendarEvent: async (meetingData) => {
    const {
      platform,
      date,
      startTime,
      endTime,
      duration,
      attendee,
      timeZone = 'America/Chicago'
    } = meetingData;

    // Format date and time for Microsoft Graph
    const startDateTime = `${date}T${startTime}:00`;
    const endDateTime = `${date}T${endTime}:00`;

    try {
      // Create calendar event with Teams meeting
      const event = await graphApiCall('/me/calendar/events', {
        method: 'POST',
        body: JSON.stringify({
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
        }),
      });

      // Return the created event with Teams meeting details
      return {
        id: event.id,
        webLink: event.webLink,
        teamsMeetingUrl: event.onlineMeeting?.joinUrl,
        subject: event.subject,
        start: event.start,
        end: event.end,
        attendees: event.attendees,
        organizer: event.organizer,
      };
    } catch (error) {
      console.error('Error creating Teams meeting:', error);
      throw error;
    }
  },

  // Get user's calendar events for conflict checking
  getCalendarEvents: async (date) => {
    const startDateTime = `${date}T00:00:00`;
    const endDateTime = `${date}T23:59:59`;
    
    try {
      const response = await graphApiCall(
        `/me/calendarView?startDateTime=${startDateTime}&endDateTime=${endDateTime}&$select=subject,start,end,isAllDay&$orderby=start/dateTime`
      );
      
      return response.value.map(event => ({
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

  // Find available meeting times (optional advanced feature)
  findMeetingTimes: async (date, duration, attendeeEmails = []) => {
    try {
      const response = await graphApiCall('/me/findMeetingTimes', {
        method: 'POST',
        body: JSON.stringify({
          attendees: attendeeEmails.map(email => ({
            emailAddress: { address: email },
            type: 'required'
          })),
          timeConstraint: {
            timeslots: [{
              start: {
                dateTime: `${date}T09:00:00`,
                timeZone: 'America/Chicago'
              },
              end: {
                dateTime: `${date}T17:00:00`,
                timeZone: 'America/Chicago'
              }
            }]
          },
          meetingDuration: `PT${duration}M`,
          returnSuggestionReasons: true,
          minimumAttendeePercentage: 100
        }),
      });

      return response.meetingTimeSuggestions;
    } catch (error) {
      console.error('Error finding meeting times:', error);
      return [];
    }
  },

  // Cancel a meeting
  cancelMeeting: async (eventId, cancellationMessage = '') => {
    try {
      await graphApiCall(`/me/events/${eventId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({
          comment: cancellationMessage || 'This meeting has been cancelled.'
        }),
      });
      return true;
    } catch (error) {
      console.error('Error cancelling meeting:', error);
      throw error;
    }
  },

  // Update meeting time
  updateMeetingTime: async (eventId, newStart, newEnd, timeZone = 'America/Chicago') => {
    try {
      const updatedEvent = await graphApiCall(`/me/events/${eventId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          start: {
            dateTime: newStart,
            timeZone: timeZone
          },
          end: {
            dateTime: newEnd,
            timeZone: timeZone
          }
        }),
      });
      return updatedEvent;
    } catch (error) {
      console.error('Error updating meeting time:', error);
      throw error;
    }
  }
};
