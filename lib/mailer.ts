import nodemailer from "nodemailer";

// Sends through a regular Gmail account (SMTP + an App Password) — no domain, no paid
// email service. See GMAIL_USER / GMAIL_APP_PASSWORD in the environment variables.
let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  }
  return cachedTransporter;
}

const COPY = {
  en: {
    subject: "Sign in to Leley Camp",
    heading: "Leley Camp",
    body: "Tap the button below to sign in and book your stay. This link expires in 15 minutes.",
    button: "Sign in to Leley Camp",
    ignore: "If you didn't request this, you can safely ignore this email.",
  },
  ar: {
    subject: "تسجيل الدخول إلى ليلى كامب",
    heading: "Leley Camp",
    body: "اضغط على الزرار تحت عشان تسجل دخولك وتحجز. اللينك صالح لمدة 15 دقيقة بس.",
    button: "تسجيل الدخول",
    ignore: "لو إنت مش اللي طلبت ده، تجاهل الإيميل ده عادي.",
  },
};

export async function sendLoginEmail(to: string, link: string, lang: "en" | "ar"): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.error("GMAIL_USER / GMAIL_APP_PASSWORD are not set, so login emails cannot be sent.");
    return false;
  }
  const t = COPY[lang] || COPY.en;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const html = `
    <div dir="${dir}" style="font-family: Georgia, 'Times New Roman', serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #0F2A33; background: #FBF7F0;">
      <h1 style="font-size: 20px; margin: 0 0 16px; letter-spacing: 0.02em;">${t.heading}</h1>
      <p style="font-size: 15px; line-height: 1.7; margin: 0 0 24px;">${t.body}</p>
      <p style="margin: 0 0 28px;">
        <a href="${link}" style="background: #0F3A4A; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 15px; display: inline-block;">${t.button}</a>
      </p>
      <p style="font-size: 13px; color: #667680; line-height: 1.6; margin: 0;">${t.ignore}</p>
    </div>`;

  try {
    await transporter.sendMail({
      from: `"Leley Camp" <${process.env.GMAIL_USER}>`,
      to,
      subject: t.subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Sending the login email failed:", error);
    return false;
  }
}
