// api/create-teams-meeting.js
// Vercel serverless function for creating Teams meetings with application permissions

import { ConfidentialClientApplication } from '@azure/msal-node';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// MSAL Configuration for Application Permissions (Client Credentials Flow)
const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`
  }
};

let cca;
try {
  cca = new ConfidentialClientApplication(msalConfig);
} catch (error) {
  console.error('Error initializing MSAL client:', error);
}

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
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`https://graph.microsoft.com/v1.0${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Graph API Error:', error);
      throw new Error(`Graph API call failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Graph API Error:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  // ALWAYS set CORS headers first, before any processing
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle CORS preflight immediately
  if (req.method === 'OPTIONS') {
    console.log('CORS preflight request received');
    return res.status(200).end();
  }

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check for required environment variables
    if (!process.env.AZURE_CLIENT_ID || !process.env.AZURE_CLIENT_SECRET || !process.env.AZURE_TENANT_ID) {
      console.error('Missing required Azure environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Missing required Azure credentials' 
      });
    }
    const {
      subject,
      body,
      start,
      end,
      attendees,
      location,
      allowNewTimeProposals
    } = req.body;

    // Validate required fields
    if (!subject || !start || !end || !attendees) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Creating Teams meeting:', {
      subject,
      attendees: attendees.map(a => a.emailAddress.address)
    });

    // Create calendar event with Teams meeting
    const organizerUserId = process.env.ORGANIZER_USER_ID || 'me';
    
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
    const event = await callGraphAPI(`/users/${organizerUserId}/calendar/events`, 'POST', eventData);
    
    console.log('Teams meeting created successfully:', {
      id: event.id,
      subject: event.subject,
      teamsLink: event.onlineMeeting?.joinUrl
    });

    return res.status(200).json({
      id: event.id,
      webLink: event.webLink,
      teamsMeetingUrl: event.onlineMeeting?.joinUrl,
      subject: event.subject,
      start: event.start,
      end: event.end,
      attendees: event.attendees,
      organizer: event.organizer
    });

  } catch (error) {
    console.error('Error creating Teams meeting:', error);
    
    return res.status(500).json({
      error: 'Failed to create Teams meeting',
      message: error.message
    });
  }
}
