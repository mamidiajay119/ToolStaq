"use server";

import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function submitContactForm(prevState: any, formData: FormData) {
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const subject = formData.get('subject')?.toString().trim();
  const message = formData.get('message')?.toString().trim();

  // Basic validation
  if (!name || !email || !subject || !message) {
    return {
      success: false,
      error: "All fields are required. Please fill out the entire form.",
    };
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: "Please enter a valid email address.",
    };
  }

  try {
    if (resend) {
      await resend.emails.send({
        from: 'ToolStaq Contact Form <onboarding@resend.dev>',
        to: 'contactus@toolstaq.com',
        replyTo: email,
        subject: `[ToolStaq Contact] ${subject}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #1e293b;">
            <h2>New Contact Us Message</h2>
            <p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `,
      });
    }

    console.log("=== NEW CONTACT FORM SUBMISSION TO contactus@toolstaq.com ===");
    console.log(`From: ${name} (${email}) | Subject: ${subject}`);
    console.log("==============================================================");

    const mailtoUrl = `mailto:contactus@toolstaq.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} <${email}>\n\n${message}`)}`;

    return {
      success: true,
      message: "Your message has been sent to contactus@toolstaq.com! Our team will respond within 24-48 hours.",
      mailtoUrl,
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      error: "An unexpected error occurred while sending your message. Please try again later.",
    };
  }
}
