import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface BookingRequest {
  service_name: string;
  start_time: string;
  end_time: string;
  seeker_name: string;
  seeker_email: string;
  helper_name: string;
  helper_email: string;
  helper_id?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if request has body
    const requestText = await req.text();
    if (!requestText) {
      console.error('Empty request body received');
      return new Response(
        JSON.stringify({ error: 'Request body is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    let requestData: BookingRequest;
    try {
      requestData = JSON.parse(requestText);
    } catch (parseError) {
      console.error('Invalid JSON in request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const {
      service_name,
      start_time,
      end_time,
      seeker_name,
      seeker_email,
      helper_name,
      helper_email,
    } = requestData;

    const clientId = Deno.env.get('ZOHO_CLIENT_ID');
    const clientSecret = Deno.env.get('ZOHO_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: 'Zoho credentials not configured' }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('Creating Zoho meeting for:', service_name);
    console.log('Meeting data:', { service_name, start_time, end_time, seeker_name, helper_name });

    // Get access token from Zoho
    const accessToken = await getZohoAccessToken(clientId, clientSecret);
    
    if (!accessToken) {
      console.error('Failed to get Zoho access token - check if ZOHO_REFRESH_TOKEN is set');
      return new Response(
        JSON.stringify({ error: 'Failed to get Zoho access token' }),
        { status: 500, headers: corsHeaders }
      );
    }
    
    console.log('Successfully obtained Zoho access token');

    // Prepare meeting data
    const meetingData = {
      topic: service_name,
      start_time: start_time,
      duration: calculateDuration(start_time, end_time),
      timezone: 'UTC',
      agenda: `Meeting between ${helper_name} and ${seeker_name} for ${service_name}`,
      participants: [
        {
          email: helper_email,
          name: helper_name
        },
        {
          email: seeker_email,
          name: seeker_name
        }
      ],
      settings: {
        join_before_host: true,
        mute_upon_entry: false,
        auto_recording: 'none'
      }
    };

    console.log('Preparing to create Zoho meeting with data:', JSON.stringify(meetingData, null, 2));

    // Create meeting in Zoho
    const meetingResponse = await fetch('https://meeting.zoho.com/api/v2/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meetingData),
    });

    console.log('Zoho API response status:', meetingResponse.status, meetingResponse.statusText);

    if (!meetingResponse.ok) {
      const errorData = await meetingResponse.text();
      console.error('Zoho API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to create Zoho meeting', details: errorData }),
        { status: 500, headers: corsHeaders }
      );
    }

    const meetingResult = await meetingResponse.json();
    console.log('Zoho meeting created:', meetingResult);

    return new Response(JSON.stringify({
      meeting_link: meetingResult.join_url || meetingResult.start_url,
      meeting_id: meetingResult.id || meetingResult.meeting_id,
      meeting_details: meetingResult
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-zoho-meeting function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function getZohoAccessToken(clientId: string, clientSecret: string): Promise<string | null> {
  try {
    const refreshToken = Deno.env.get('ZOHO_REFRESH_TOKEN');
    
    if (!refreshToken) {
      console.error('ZOHO_REFRESH_TOKEN not configured. Please complete OAuth flow first.');
      return null;
    }

    console.log('Using refresh token to get access token...');
    
    const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'grant_type': 'refresh_token',
        'client_id': clientId,
        'client_secret': clientSecret,
        'refresh_token': refreshToken
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Failed to get Zoho access token:', errorData);
      return null;
    }

    const tokenData = await response.json();
    console.log('Successfully obtained access token');
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting Zoho access token:', error);
    return null;
  }
}

function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // Duration in minutes
}