import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  booking: {
    id: string;
    seeker_name: string;
    seeker_email: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    total_amount: number;
    notes: string | null;
  };
  service: {
    title: string;
    description: string;
    duration_minutes: number;
  };
  helperEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { booking, service, helperEmail }: BookingConfirmationRequest = await req.json();

    console.log('Received booking confirmation request:', { booking, service, helperEmail });

    // Get helper's email from profiles table using helper_id (which is passed as helperEmail)
    const { data: helperProfile, error: profileError } = await supabase
      .from('profiles')
      .select('email, display_name')
      .eq('user_id', helperEmail)
      .single();

    console.log('Helper profile lookup:', { helperProfile, profileError, helperId: helperEmail });

    const formatTime = (timeString: string) => {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    // Send confirmation email to seeker
    const seekerEmailResponse = await resend.emails.send({
      from: "WO Commune <bookings@resend.dev>",
      to: [booking.seeker_email],
      subject: "🎉 Booking Confirmed - Your session is scheduled!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 28px;">Booking Confirmed! 🎉</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your session with ${helperProfile?.display_name || 'your Helpanion'} is all set</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 25px;">
            <h2 style="margin: 0 0 15px 0; color: #333; font-size: 20px;">Session Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Service:</td>
                <td style="padding: 8px 0; color: #333;">${service.title}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Date:</td>
                <td style="padding: 8px 0; color: #333;">${formatDate(booking.booking_date)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Time:</td>
                <td style="padding: 8px 0; color: #333;">${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Duration:</td>
                <td style="padding: 8px 0; color: #333;">${service.duration_minutes} minutes</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Helpanion:</td>
                <td style="padding: 8px 0; color: #333;">${helperProfile?.display_name || 'Your Helper'}</td>
              </tr>
              ${booking.total_amount ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Total:</td>
                <td style="padding: 8px 0; color: #333; font-weight: bold;">$${booking.total_amount}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          ${booking.notes ? `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 10px 0; color: #856404;">Your Message:</h3>
            <p style="margin: 0; color: #856404;">"${booking.notes}"</p>
          </div>
          ` : ''}

          <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; color: #155724;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #155724;">
              <li>Your Helpanion has been notified about the booking</li>
              <li>You'll receive session details and meeting link closer to the date</li>
              <li>Feel free to prepare any questions or materials in advance</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(service.title + ' Session')}&dates=${booking.booking_date.replace(/-/g, '')}T${booking.start_time.replace(':', '')}00/${booking.booking_date.replace(/-/g, '')}T${booking.end_time.replace(':', '')}00" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-bottom: 15px;">
              📅 Add to Calendar
            </a>
          </div>

          <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p>Need help? Reply to this email or contact us at support@wocommune.com</p>
            <p style="margin: 5px 0 0 0;">WO Commune - Connecting you with amazing Helpanions</p>
          </div>
        </div>
      `,
    });

    // Send notification email to helper
    if (helperProfile?.email) {
      const helperEmailResponse = await resend.emails.send({
        from: "WO Commune <bookings@resend.dev>",
        to: [helperProfile.email],
        subject: "🔔 New Booking - Session scheduled with a seeker",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
              <h1 style="margin: 0; font-size: 28px;">New Booking! 🔔</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">You have a new session scheduled</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 25px;">
              <h2 style="margin: 0 0 15px 0; color: #333; font-size: 20px;">Booking Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Seeker:</td>
                  <td style="padding: 8px 0; color: #333;">${booking.seeker_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 8px 0; color: #333;">${booking.seeker_email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Service:</td>
                  <td style="padding: 8px 0; color: #333;">${service.title}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Date:</td>
                  <td style="padding: 8px 0; color: #333;">${formatDate(booking.booking_date)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Time:</td>
                  <td style="padding: 8px 0; color: #333;">${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Duration:</td>
                  <td style="padding: 8px 0; color: #333;">${service.duration_minutes} minutes</td>
                </tr>
              </table>
            </div>

            ${booking.notes ? `
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="margin: 0 0 10px 0; color: #856404;">Seeker's Message:</h3>
              <p style="margin: 0; color: #856404;">"${booking.notes}"</p>
            </div>
            ` : ''}

            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="margin: 0 0 15px 0; color: #155724;">Next Steps:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #155724;">
                <li>The seeker has been notified about the booking confirmation</li>
                <li>Prepare for the session and any materials you might need</li>
                <li>You can reach out to the seeker directly at ${booking.seeker_email}</li>
              </ul>
            </div>

            <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p>Questions? Reply to this email or contact us at support@wocommune.com</p>
              <p style="margin: 5px 0 0 0;">WO Commune - Empowering Helpanions like you</p>
            </div>
          </div>
        `,
      });
    }

    console.log("Booking confirmation emails sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);