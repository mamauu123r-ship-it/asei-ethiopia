import "server-only";

// Sends email through Resend (https://resend.com) when RESEND_API_KEY is set.
// If it is not set, emails are skipped and the website still works.

type Mail = { to: string; subject: string; text: string };

export async function sendEmail({ to, subject, text }: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from || !to) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, text }),
    });
    if (!res.ok) console.error("email failed", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("email failed", err);
    return false;
  }
}

/** Tells the ASEI team about a new form submission, if ADMIN_NOTIFY_EMAIL is set. */
export async function notifyAdmins(subject: string, text: string) {
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  if (to) await sendEmail({ to, subject, text });
}
