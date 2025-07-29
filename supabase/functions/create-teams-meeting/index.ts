// supabase/functions/create-teams-meeting/index.ts
// Supabase Edge Function for creating Teams meetings with application permissions

/// <reference path="./types.d.ts" />

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MeetingRequest {
  subject: string
  body: {
    contentType: string
    content: string
  }
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  attendees: Array<{
    emailAddress: {
      address: string
      name: string
    }
    type: string
  }>
  isOnlineMeeting: boolean
  onlineMeetingProvider: string
}

async function getAccessToken(): Promise<string> {
  const clientId = Deno.env.get('AZURE_CLIENT_ID')
  const clientSecret = Deno.env.get('AZURE_CLIENT_SECRET')
  const tenantId = Deno.env.get('AZURE_TENANT_ID')

  if (!clientId || !clientSecret || !tenantId) {
    throw new Error('Missing Azure configuration')
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`
  
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials'
  })

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Token acquisition failed:', error)
    throw new Error(`Failed to acquire token: ${response.status}`)
  }

  const data = await response.json()
  return data.access_token
}

async function createTeamsMeeting(meetingData: MeetingRequest): Promise<any> {
  const accessToken = await getAccessToken()
  const organizerUserId = Deno.env.get('ORGANIZER_USER_ID') || 'me'

  const response = await fetch(`https://graph.microsoft.com/v1.0/users/${organizerUserId}/calendar/events`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...meetingData,
      isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness'
    })
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Meeting creation failed:', error)
    throw new Error(`Failed to create meeting: ${response.status}`)
  }

  return await response.json()
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const meetingData = await req.json() as MeetingRequest

    // Validate required fields
    if (!meetingData.subject || !meetingData.start || !meetingData.end || !meetingData.attendees) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Creating Teams meeting:', {
      subject: meetingData.subject,
      attendees: meetingData.attendees.map(a => a.emailAddress.address)
    })

    const meeting = await createTeamsMeeting(meetingData)

    console.log('Teams meeting created successfully:', {
      id: meeting.id,
      teamsLink: meeting.onlineMeeting?.joinUrl
    })

    return new Response(
      JSON.stringify({
        id: meeting.id,
        webLink: meeting.webLink,
        teamsMeetingUrl: meeting.onlineMeeting?.joinUrl,
        subject: meeting.subject,
        start: meeting.start,
        end: meeting.end,
        attendees: meeting.attendees,
        organizer: meeting.organizer
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in create-teams-meeting function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
