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
    const {
      service_name,
      start_time,
      end_time,
      seeker_name,
      seeker_email,
      helper_name,
      helper_email,
      helper_id,
    } = await req.json() as BookingRequest;

    const credentials = Deno.env.get('GOOGLE_CALENDAR_CREDENTIALS');
    const globalCalendarId = Deno.env.get('GOOGLE_CALENDAR_ID');

    if (!credentials || !globalCalendarId) {
      return new Response(
        JSON.stringify({ error: 'Google Calendar credentials not configured' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Initialize Supabase client for fetching helpanion's calendar
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get helpanion's calendar ID - REQUIRED, no fallback to global
    let calendarId = null;
    if (helper_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('google_calendar_id')
        .eq('user_id', helper_id)
        .maybeSingle();
      
      if (profile?.google_calendar_id) {
        calendarId = profile.google_calendar_id;
        console.log(`Using helpanion's calendar: ${calendarId}`);
      } else {
        console.error(`No calendar configured for helpanion ${helper_id}`);
        throw new Error('Helpanion has not configured their Google Calendar integration');
      }
    } else {
      throw new Error('Helper ID is required');
    }

    const credentialsObj = JSON.parse(credentials);
    
    // Get access token
    const jwt = await createJWT(credentialsObj);
    const accessToken = await getAccessToken(jwt);

    // Create the calendar event
    const event = {
      summary: `${service_name} - ${seeker_name}`,
      description: `Service: ${service_name}\nSeeker: ${seeker_name} (${seeker_email})\nHelper: ${helper_name} (${helper_email})`,
      start: {
        dateTime: start_time,
        timeZone: 'UTC',
      },
      end: {
        dateTime: end_time,
        timeZone: 'UTC',
      },
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID()
        }
      }
    };

    const makeUrl = (id: string) => `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(id)}/events?conferenceDataVersion=1`;

    let response = await fetch(
      makeUrl(calendarId),
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    // Fallback: if specified calendar isn't found, try primary
    if (response.status === 404 && calendarId !== 'primary') {
      console.warn('Specified calendar not found. Retrying with primary calendar.');
      response = await fetch(
        makeUrl('primary'),
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Calendar API error:', errorText);
      throw new Error(`Calendar API error: ${response.status} ${errorText}`);
    }

    const createdEvent = await response.json();
    console.log('Created event:', createdEvent);

    const extractMeet = (ev: any) =>
      ev?.conferenceData?.entryPoints?.find((entry: any) => entry.entryPointType === 'video')?.uri ||
      ev?.hangoutLink || null;

    let meetLink = extractMeet(createdEvent);

    // Fallback: Patch the event to request a conference if none was created
    if (!meetLink) {
      console.warn('No conference on create. Attempting PATCH to add Google Meet.');
      const patchUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(createdEvent.id)}?conferenceDataVersion=1`;

      const attemptPatch = async (body: any, label: string) => {
        const r = await fetch(patchUrl, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        if (!r.ok) {
          const t = await r.text();
          console.error(`PATCH ${label} failed:`, t);
          return null;
        }
        const ev = await r.json();
        console.log(`PATCH ${label} success:`, ev);
        return extractMeet(ev);
      };

      // 1) Try without explicit conference type
      meetLink = await attemptPatch({
        conferenceData: { createRequest: { requestId: crypto.randomUUID() } }
      }, 'no-type');

      // 2) If still missing, try with explicit hangoutsMeet type
      if (!meetLink) {
        meetLink = await attemptPatch({
          conferenceData: {
            createRequest: {
              requestId: crypto.randomUUID(),
              conferenceSolutionKey: { type: 'hangoutsMeet' }
            }
          }
        }, 'hangoutsMeet');
      }

      // 3) Fallback for consumer accounts: legacy eventHangout
      if (!meetLink) {
        meetLink = await attemptPatch({
          conferenceData: {
            createRequest: {
              requestId: crypto.randomUUID(),
              conferenceSolutionKey: { type: 'eventHangout' }
            }
          }
        }, 'eventHangout');
      }
    }

    if (!meetLink) {
      throw new Error('Failed to create Google Meet link for this helpanion calendar');
    }

    return new Response(
      JSON.stringify({ 
        meetLink,
        eventId: createdEvent.id,
        calendarUrl: createdEvent.htmlLink
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error creating Google Meet:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function createJWT(credentials: any): Promise<string> {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  
  // Convert PEM to DER format
  const privateKeyPem = credentials.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '');
  
  const privateKeyDer = Uint8Array.from(atob(privateKeyPem), c => c.charCodeAt(0));
  
  // Import the private key
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyDer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  // Sign the JWT
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(signingInput)
  );

  const encodedSignature = base64UrlEncode(new Uint8Array(signature));
  return `${signingInput}.${encodedSignature}`;
}

function base64UrlEncode(data: string | Uint8Array): string {
  let base64: string;
  if (typeof data === 'string') {
    base64 = btoa(data);
  } else {
    base64 = btoa(String.fromCharCode(...data));
  }
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(jwt: string): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get access token: ${errorText}`);
  }

  const tokenData = await response.json();
  return tokenData.access_token;
}