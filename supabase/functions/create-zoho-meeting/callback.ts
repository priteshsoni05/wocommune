import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return new Response(`
        <html>
          <body>
            <h1>Authorization Failed</h1>
            <p>Error: ${error}</p>
            <p>Please close this window and try again.</p>
          </body>
        </html>
      `, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        status: 400
      });
    }

    if (!code) {
      return new Response(`
        <html>
          <body>
            <h1>No Authorization Code</h1>
            <p>No authorization code received. Please try the authorization process again.</p>
          </body>
        </html>
      `, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        status: 400
      });
    }

    const clientId = Deno.env.get('ZOHO_CLIENT_ID');
    const clientSecret = Deno.env.get('ZOHO_CLIENT_SECRET');
    const redirectUri = `${url.origin}${url.pathname}`;

    if (!clientId || !clientSecret) {
      console.error('Missing Zoho credentials');
      return new Response(`
        <html>
          <body>
            <h1>Configuration Error</h1>
            <p>Zoho credentials not properly configured.</p>
          </body>
        </html>
      `, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        status: 500
      });
    }

    console.log('Exchanging authorization code for tokens...');

    // Exchange authorization code for access and refresh tokens
    const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'client_id': clientId,
        'client_secret': clientSecret,
        'redirect_uri': redirectUri,
        'code': code
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Failed to exchange code for tokens:', errorData);
      return new Response(`
        <html>
          <body>
            <h1>Token Exchange Failed</h1>
            <p>Failed to get access tokens from Zoho.</p>
            <p>Error: ${errorData}</p>
          </body>
        </html>
      `, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        status: 500
      });
    }

    const tokenData = await tokenResponse.json();
    console.log('Tokens received successfully');

    // Store the refresh token securely (you'll need to implement this based on your needs)
    // For now, we'll display it to the user to manually add as a secret
    return new Response(`
      <html>
        <head>
          <title>Zoho Authorization Successful</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .success { background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .token { background: #f8f9fa; padding: 10px; border: 1px solid #dee2e6; border-radius: 3px; word-break: break-all; }
            .instructions { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>✅ Zoho Authorization Successful!</h1>
          
          <div class="success">
            <strong>Success!</strong> Your Zoho Meeting integration has been authorized.
          </div>

          <div class="instructions">
            <h3>Next Step: Add Refresh Token</h3>
            <p>Copy the refresh token below and add it to your Supabase secrets as <strong>ZOHO_REFRESH_TOKEN</strong>:</p>
            <div class="token">
              <strong>Refresh Token:</strong><br>
              ${tokenData.refresh_token}
            </div>
          </div>

          <p><strong>Instructions:</strong></p>
          <ol>
            <li>Copy the refresh token above</li>
            <li>Go to your Supabase dashboard → Settings → Edge Functions</li>
            <li>Add a new secret named <code>ZOHO_REFRESH_TOKEN</code></li>
            <li>Paste the refresh token as the value</li>
            <li>Save the secret</li>
          </ol>

          <p>Once you've added the refresh token, your Zoho meeting integration will work automatically!</p>
          
          <p><small>You can close this window now.</small></p>
        </body>
      </html>
    `, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    });

  } catch (error) {
    console.error('Error in OAuth callback:', error);
    return new Response(`
      <html>
        <body>
          <h1>Error</h1>
          <p>An error occurred during authorization: ${error instanceof Error ? error.message : String(error)}</p>
        </body>
      </html>
    `, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      status: 500
    });
  }
});