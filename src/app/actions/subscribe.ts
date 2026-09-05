"use server";

import { Resend } from "resend";
import { renderWelcomeEmailHtml } from "@/lib/newsletter/template";
import { getTopAINewsForNewsletter } from "@/lib/newsletter/aggregator";
import { checkRateLimit } from "@/lib/rate-limit";

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

  // Rate limiting check (max 5 requests per minute)
  const rateLimit = checkRateLimit(`subscribe_${email.toLowerCase()}`, 5, 60 * 1000);
  if (!rateLimit.success) {
    return { success: false, error: "Too many subscription attempts. Please wait a minute before trying again." };
  }

  // Simulation mode for development if API key is not configured
  if (!resend) {
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 800)); // simulate network delay
      console.log(`[Dev Simulation] Subscription request received for: [REDACTED]`);
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

    // Standard behavior: add contact globally or to specific audience
    const response = await resend.contacts.create({
      email: email,
      ...(audienceId ? { audienceId } : {}),
    });

    if (response.error) {
      // Check if user is already in the contacts list
      if (response.error.message?.toLowerCase().includes("already exists")) {
        return {
          success: true,
          message: "You're already subscribed to toolstaq updates! Thank you! ❤️",
        };
      }
      return {
        success: false,
        error: response.error.message || "Failed to add subscriber to contacts list.",
      };
    }

    // Send instant Light Mode branded Welcome Email with recent Top AI news preview
    try {
      const recentArticles = await getTopAINewsForNewsletter(3);
      const unsubscribeUrl = `https://toolstaq.com/unsubscribe?email=${encodeURIComponent(email)}`;
      const welcomeHtml = renderWelcomeEmailHtml({
        email,
        recentArticles,
        unsubscribeUrl,
      });

      await resend.emails.send({
        from: "toolstaq Newsletter <newsletter@toolstaq.com>",
        to: email,
        subject: "Welcome to toolstaq — AI News, Simplified 🎉",
        html: welcomeHtml,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
        },
      });
    } catch (emailErr) {
      console.warn("Welcome email dispatch warning (contact was added):", emailErr);
    }

    return {
      success: true,
      message: "Thanks for subscribing! Welcome email sent to your inbox.",
    };
  } catch (err: any) {
    console.error("Resend subscription error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
