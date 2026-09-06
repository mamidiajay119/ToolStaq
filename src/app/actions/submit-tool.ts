"use server";

import { getServiceRoleClient } from "@/lib/supabase";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface SubmissionResult {
  success: boolean;
  message?: string;
  error?: string;
  mailtoUrl?: string;
}

export async function submitTool(formData: {
  tool_name: string;
  url: string;
  category: string;
  description: string;
  email: string;
}): Promise<SubmissionResult> {
  const { tool_name, url, category, description, email } = formData;

  if (!tool_name || !url || !category || !email) {
    return { success: false, error: "Tool Name, Website URL, Category, and Email are required." };
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch (err) {
    return { success: false, error: "Please enter a valid website URL." };
  }

  // Mandatory email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const supabase = getServiceRoleClient();

    // Check if tool already exists in the live tools database (case-insensitive check)
    const { data: existingTool } = await supabase
      .from("tools")
      .select("slug")
      .ilike("tool_name", tool_name.trim())
      .maybeSingle();

    if (existingTool) {
      return {
        success: false,
        error: `"${tool_name}" already exists in the directory!`,
      };
    }

    // Insert the submission into the "submissions" table.
    const { error: insertError } = await supabase
      .from("submissions")
      .insert([
        {
          tool_name: tool_name.trim(),
          url: url.trim(),
          category: category,
          description: description ? description.trim() : null,
          email: email ? email.trim() : null,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      console.error("Supabase submission insert error:", insertError);
    }

    // Email notification to contactus@toolstaq.com via Resend if configured
    if (resend) {
      await resend.emails.send({
        from: 'ToolStaq Submissions <onboarding@resend.dev>',
        to: 'contactus@toolstaq.com',
        replyTo: email.trim(),
        subject: `[Tool Submission] ${tool_name.trim()}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #1e293b;">
            <h2>New AI Tool Submission</h2>
            <p><strong>Tool Name:</strong> ${tool_name.trim()}</p>
            <p><strong>URL:</strong> <a href="${url.trim()}">${url.trim()}</a></p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Submitter Email:</strong> ${email.trim()}</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="white-space: pre-wrap;"><strong>Description:</strong><br />${description ? description.trim() : 'N/A'}</p>
          </div>
        `,
      });
    }

    return {
      success: true,
      message: `Thank you! "${tool_name.trim()}" submission has been received and is pending review.`,
    };
  } catch (err: any) {
    console.error("Submit tool action unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
