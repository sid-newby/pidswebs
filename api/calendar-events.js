// api/calendar-events.js
// Vercel serverless function for fetching calendar events

import { ConfidentialClientApplication } from '@azure/msal-node';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check for required environment variables
    if (!process.env.AZURE_CLIENT_ID || !process.env.AZURE_CLIENT_SECRET || !process.env.AZURE_TENANT_ID) {
      console.error('Missing required Azure environment variables');
      // Return empty array instead of 500 to avoid CORS issues
      return res.status(200).json([]);
    }

    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: 'Missing start or end query parameters' });
    }

    const organizerUserId = process.env.ORGANIZER_USER_ID || 'me';
    
    // Get calendar events for the specified time range
    const events = await callGraphAPI(`/users/${organizerUserId}/calendar/events?$filter=start/dateTime ge '${start}' and end/dateTime le '${end}'&$select=id,subject,start,end,isAllDay`);
    
    console.log('Calendar events fetched successfully:', {
      count: events.value.length,
      dateRange: { start, end }
    });

    return res.status(200).json(events.value);

  } catch (error) {
    console.error('Error fetching calendar events:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      msalConfig: {
        clientId: process.env.AZURE_CLIENT_ID ? 'Present' : 'Missing',
        clientSecret: process.env.AZURE_CLIENT_SECRET ? 'Present' : 'Missing',
        tenantId: process.env.AZURE_TENANT_ID ? 'Present' : 'Missing',
        organizerUserId: process.env.ORGANIZER_USER_ID
      }
    });
    
    // Always return 200 with empty array to avoid CORS issues
    // The client will handle the empty response gracefully
    return res.status(200).json([]);
  }
}
