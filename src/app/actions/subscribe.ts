"use server";

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface SubscriptionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function subscribeToNewsletter(
  prevState: any,
  formData: FormData
): Promise<SubscriptionResult> {
  const email = formData.get("email")?.toString().trim();

  if (!email) {
    return { success: false, error: "Email address is required." };
  }

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  // Simulation mode for development if API key is not configured
  if (!resend) {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 800)); // simulate network delay
      console.log(`[Dev Simulation] Subscription request for: ${email}`);
      return {
        success: true,
        message: "Successfully subscribed (Development Mode Simulation)! 🎉",
      };
    }
    return {
      success: false,
      error: "Newsletter service is currently not configured.",
    };
  }

  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!audienceId) {
      console.warn("RESEND_AUDIENCE_ID is not set. Falling back to sending a transactional welcome email.");
      
      // Fallback: If no audience is configured, we send a welcome email instead of adding to a list.
      await resend.emails.send({
        from: "ToolStaq Newsletter <newsletter@toolstaq.com>",
        to: email,
        subject: "Welcome to ToolStaq Newsletter!",
        html: "<p>Thank you for subscribing to ToolStaq updates! We will keep you updated on the latest AI tools and breakthroughs.</p>",
      });

      return {
        success: true,
        message: "Thank you for subscribing to ToolStaq! Check your inbox. ✉️",
      };
    }

    // Standard behavior: add to audience contacts
    const response = await resend.contacts.create({
      email: email,
      audienceId: audienceId,
    });

    if (response.error) {
      // Check if user is already in the audience list
      if (response.error.message?.toLowerCase().includes("already exists")) {
        return {
          success: true,
          message: "You're already subscribed to ToolStaq updates! Thank you! ❤️",
        };
      }
      return {
        success: false,
        error: response.error.message || "Failed to add subscriber to audience list.",
      };
    }

    return {
      success: true,
      message: "Thank you for subscribing to ToolStaq updates! 🎉",
    };
  } catch (err: any) {
    console.error("Resend subscription error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
