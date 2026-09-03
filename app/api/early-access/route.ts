import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, company, businessType, teamSize, priority, message } =
      body;

    if (
      !name ||
      !email ||
      !company ||
      !businessType ||
      !teamSize ||
      !priority ||
      !message
    ) {
      return NextResponse.json(
        { success: false, message: "Please complete all required fields." },
        { status: 400 },
      );
    }

    const yahooEmail = process.env.YAHOO_EMAIL;
    const yahooPassword = process.env.YAHOO_APP_PASSWORD;

    if (!yahooEmail || !yahooPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Email service is not configured.",
        },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      service: "yahoo",
      auth: {
        user: yahooEmail,
        pass: yahooPassword,
      },
    });

    await transporter.sendMail({
      from: `"Synqo AI Website" <${yahooEmail}>`,
      to: yahooEmail,
      replyTo: email,
      subject: `New Synqo AI Employee Early Access Request - ${company}`,
      text: `
NEW SYNQO AI EMPLOYEE EARLY ACCESS REQUEST

Full Name:
${name}

Business Email:
${email}

Business Name:
${company}

Business Type:
${businessType}

Team Size:
${teamSize}

Main Priority:
${priority}

What they want their AI Employee to handle:
${message}
      `,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;padding:30px;background:#f7f9fc;border-radius:16px">
          <h2 style="margin-top:0;color:#111827">
            New Synqo AI Employee Early Access Request
          </h2>

          <p><strong>Full Name:</strong><br>${name}</p>
          <p><strong>Business Email:</strong><br>${email}</p>
          <p><strong>Business Name:</strong><br>${company}</p>
          <p><strong>Business Type:</strong><br>${businessType}</p>
          <p><strong>Team Size:</strong><br>${teamSize}</p>
          <p><strong>Main Priority:</strong><br>${priority}</p>

          <p>
            <strong>What they want their AI Employee to handle:</strong>
          </p>

          <div style="padding:16px;background:white;border-radius:10px;border:1px solid #e5e7eb">
            ${message}
          </div>

          <hr style="margin:28px 0;border:0;border-top:1px solid #e5e7eb">

          <small style="color:#6b7280">
            Submitted through Synqo AI website.
          </small>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Early access request submitted successfully.",
    });
  } catch (error) {
    console.error("Early access form error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit your request right now.",
      },
      { status: 500 },
    );
  }
}
