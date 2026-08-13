"use server";

import { getServiceRoleClient } from "@/lib/supabase";

interface SubmissionResult {
  success: boolean;
  message?: string;
  error?: string;
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
    const { data: existingTool, error: checkError } = await supabase
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
    // If the table doesn't exist yet, we catch the error and explain it, but this is the correct target.
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
      return {
        success: false,
        error: "Failed to store submission in the database. Please try again later.",
      };
    }

    return {
      success: true,
      message: `Thank you! "${tool_name}" has been successfully submitted and is pending review.`,
    };
  } catch (err: any) {
    console.error("Submit tool action unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
