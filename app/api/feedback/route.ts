import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type Feedback = {
  rating?: number;
  category?: string;
  message?: string;
  email?: string;
  page?: string;
  website?: string;
};

const clean = (value: unknown) => typeof value === "string" ? value.trim() : "";
const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

export async function POST(request: Request) {
  try {
    const body = await request.json() as Feedback;
    if (clean(body.website)) return NextResponse.json({ success: true });

    const rating = Number(body.rating);
    const category = clean(body.category);
    const message = clean(body.message);
    const email = clean(body.email).toLowerCase();
    const page = clean(body.page);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !category || message.length < 5) {
      return NextResponse.json({ success: false, message: "Please add a rating, category and a little more detail." }, { status: 400 });
    }
    if (message.length > 3000) {
      return NextResponse.json({ success: false, message: "Please keep feedback under 3,000 characters." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL;
    if (!apiKey || !contactEmail) {
      return NextResponse.json({ success: false, message: "Feedback service is temporarily unavailable." }, { status: 503 });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Synqo AI Feedback <onboarding@resend.dev>",
      to: [contactEmail],
      replyTo: email || undefined,
      subject: "Synqo feedback: " + rating + "/5 · " + category,
      text: ["Rating: " + rating + "/5", "Category: " + category, "Email: " + (email || "Not provided"), "Page: " + (page || "Not provided"), "", message].join("\n"),
      html: '<div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;padding:28px;background:#f6f8fc"><h2>New Synqo AI feedback</h2><p><strong>Rating:</strong> ' + rating + '/5</p><p><strong>Category:</strong> ' + escapeHtml(category) + '</p><p><strong>Email:</strong> ' + escapeHtml(email || "Not provided") + '</p><p><strong>Page:</strong> ' + escapeHtml(page || "Not provided") + '</p><div style="padding:16px;border-radius:12px;background:white;border:1px solid #e4e9f2">' + escapeHtml(message).replaceAll("\n", "<br>") + "</div></div>",
    });
    if (error) {
      console.error("Feedback email error:", error);
      return NextResponse.json({ success: false, message: "Feedback could not be sent. Please try again." }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: "Thank you. Your feedback has been received." });
  } catch (error) {
    console.error("Feedback route error:", error);
    return NextResponse.json({ success: false, message: "Unable to send feedback right now." }, { status: 500 });
  }
}
