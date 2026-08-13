"use server";

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
    // Log submission (in production this would send an email or write to a db)
    console.log("=== NEW CONTACT FORM SUBMISSION ===");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Subject:", subject);
    console.log("Message:", message);
    console.log("====================================");

    return {
      success: true,
      message: "Your message has been received! Our support team will get back to you within 24-48 hours.",
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      error: "An unexpected error occurred while sending your message. Please try again later.",
    };
  }
}
