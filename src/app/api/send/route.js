import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with your API key from .env
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;

// POST handler for /api/send
export async function POST(req) {
  try {
    // Parse request JSON body
    const { email, subject, message } = await req.json();

    // Check if required fields are present
    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: fromEmail,
      to: [fromEmail, email],
      subject: subject,
      html: `
        <h1>${subject}</h1>
        <p>Thank you for contacting us!</p>
        <p><strong>Message from user:</strong></p>
        <p>${message}</p>
      `,
    });

    // Return success response
    return NextResponse.json(data);
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
