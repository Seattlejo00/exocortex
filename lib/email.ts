import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set, skipping email.");
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const fromAddress = () =>
  process.env.EMAIL_FROM || "Exocortex <onboarding@resend.dev>";

const adminEmail = () => process.env.ADMIN_EMAIL || "";

/**
 * Send a notification email to the admin when someone joins the waitlist.
 * Fails silently (logs error but does not throw) so signup still succeeds.
 */
export async function sendAdminNotification(
  signupName: string,
  signupEmail: string
): Promise<void> {
  const resend = getResend();
  const admin = adminEmail();
  if (!resend || !admin) return;

  try {
    await resend.emails.send({
      from: fromAddress(),
      to: admin,
      subject: `New Exocortex waitlist signup: ${signupEmail}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px;">
          <h2 style="color: #f5f5f5; font-size: 18px;">New Waitlist Signup</h2>
          <table style="font-size: 14px; color: #a3a3a3;">
            <tr><td style="padding: 4px 12px 4px 0; font-weight: 600; color: #f5f5f5;">Name</td><td>${signupName || "(not provided)"}</td></tr>
            <tr><td style="padding: 4px 12px 4px 0; font-weight: 600; color: #f5f5f5;">Email</td><td>${signupEmail}</td></tr>
            <tr><td style="padding: 4px 12px 4px 0; font-weight: 600; color: #f5f5f5;">Time</td><td>${new Date().toISOString()}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #333; margin: 16px 0;" />
          <p style="font-size: 12px; color: #737373;">Exocortex Waitlist</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[email] Failed to send admin notification:", err);
  }
}

/**
 * Send a confirmation email to the user who just signed up.
 * Fails silently (logs error but does not throw) so signup still succeeds.
 */
export async function sendUserConfirmation(
  userName: string,
  userEmail: string
): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: fromAddress(),
      to: userEmail,
      subject: "You're on the Exocortex waitlist",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px;">
          <h2 style="color: #f5f5f5; font-size: 20px;">Welcome${userName ? `, ${userName}` : ""}.</h2>
          <p style="color: #a3a3a3; font-size: 15px; line-height: 1.6;">
            You've been added to the Exocortex waitlist. We'll reach out when it's your turn.
          </p>
          <hr style="border: none; border-top: 1px solid #333; margin: 24px 0;" />
          <p style="font-size: 12px; color: #737373;">
            Exocortex &mdash; Your entire digital self. One place.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[email] Failed to send user confirmation:", err);
  }
}
