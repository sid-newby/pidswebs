// backend/server.js
// Node.js Express server for Teams meeting creation with application permissions

const express = require('express');
const cors = require('cors');
const { Client } = require('@azure/msal-node');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MSAL Configuration for Application Permissions (Client Credentials Flow)
const msalConfig = {
    auth: {
        clientId: process.env.AZURE_CLIENT_ID,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`
    }
};

const cca = new Client(msalConfig);

// Get access token using client credentials flow
async function getAppAccessToken() {
    const clientCredentialRequest = {
        scopes: ['https://graph.microsoft.com/.default']
    };

    try {
        const response = await cca.acquireTokenByClientCredential(clientCredentialRequest);
        return response.accessToken;
    } catch (error) {
        console.error('Error acquiring token:', error);
        throw new Error('Failed to acquire access token');
    }
}

// Make authenticated Graph API calls
async function callGraphAPI(endpoint, method = 'GET', data = null) {
    try {
        const accessToken = await getAppAccessToken();
        
        const config = {
            method,
            url: `https://graph.microsoft.com/v1.0${endpoint}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        if (data && (method === 'POST' || method === 'PATCH')) {
            config.data = data;
        }

        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error('Graph API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error?.message || 'Graph API call failed');
    }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'Teams Meeting Backend'
    });
});

// Create Teams meeting endpoint
app.post('/api/create-teams-meeting', async (req, res) => {
    try {
        const {
            subject,
            body,
            start,
            end,
            attendees,
            isOnlineMeeting,
            onlineMeetingProvider,
            location,
            allowNewTimeProposals
        } = req.body;

        // Create calendar event with Teams meeting
        // Note: We'll create it on a specific user's calendar (e.g., a service account)
        // You may want to create a dedicated service account for this
        const userId = process.env.ORGANIZER_USER_ID || 'me'; // Use 'me' or specific user ID
        
        const eventData = {
            subject,
            body,
            start,
            end,
            location,
            attendees,
            isOnlineMeeting: true,
            onlineMeetingProvider: 'teamsForBusiness',
            allowNewTimeProposals: allowNewTimeProposals || false
        };

        // Create the event
        const event = await callGraphAPI(`/users/${userId}/calendar/events`, 'POST', eventData);
        
        console.log('Teams meeting created successfully:', {
            id: event.id,
            subject: event.subject,
            teamsLink: event.onlineMeeting?.joinUrl
        });

        res.json({
            id: event.id,
            webLink: event.webLink,
            onlineMeeting: event.onlineMeeting,
            subject: event.subject,
            start: event.start,
            end: event.end,
            attendees: event.attendees,
            organizer: event.organizer
        });

    } catch (error) {
        console.error('Error creating Teams meeting:', error);
        res.status(500).json({
            error: 'Failed to create Teams meeting',
            message: error.message
        });
    }
});

// Get calendar events for availability checking
app.get('/api/calendar-events', async (req, res) => {
    try {
        const { start, end } = req.query;
        
        if (!start || !end) {
            return res.status(400).json({
                error: 'Missing required parameters',
                message: 'start and end query parameters are required'
            });
        }

        const userId = process.env.ORGANIZER_USER_ID || 'me';
        
        // Get calendar view for the specified date range
        const events = await callGraphAPI(
            `/users/${userId}/calendarView?startDateTime=${start}&endDateTime=${end}&$select=subject,start,end,isAllDay&$orderby=start/dateTime`
        );

        res.json(events.value || []);

    } catch (error) {
        console.error('Error fetching calendar events:', error);
        res.status(500).json({
            error: 'Failed to fetch calendar events',
            message: error.message
        });
    }
});

// Cancel meeting endpoint
app.delete('/api/meetings/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { cancellationMessage } = req.body;

        const userId = process.env.ORGANIZER_USER_ID || 'me';

        await callGraphAPI(`/users/${userId}/events/${eventId}/cancel`, 'POST', {
            comment: cancellationMessage || 'This meeting has been cancelled.'
        });

        res.json({ success: true, message: 'Meeting cancelled successfully' });

    } catch (error) {
        console.error('Error cancelling meeting:', error);
        res.status(500).json({
            error: 'Failed to cancel meeting',
            message: error.message
        });
    }
});

// Update meeting endpoint
app.patch('/api/meetings/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const updateData = req.body;

        const userId = process.env.ORGANIZER_USER_ID || 'me';

        const updatedEvent = await callGraphAPI(`/users/${userId}/events/${eventId}`, 'PATCH', updateData);

        res.json(updatedEvent);

    } catch (error) {
        console.error('Error updating meeting:', error);
        res.status(500).json({
            error: 'Failed to update meeting',
            message: error.message
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Teams Meeting Backend running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log('Environment check:');
    console.log('- AZURE_CLIENT_ID:', process.env.AZURE_CLIENT_ID ? '✓ Set' : '✗ Missing');
    console.log('- AZURE_CLIENT_SECRET:', process.env.AZURE_CLIENT_SECRET ? '✓ Set' : '✗ Missing');
    console.log('- AZURE_TENANT_ID:', process.env.AZURE_TENANT_ID ? '✓ Set' : '✗ Missing');
    console.log('- ORGANIZER_USER_ID:', process.env.ORGANIZER_USER_ID || 'Using "me"');
});

module.exports = app;
