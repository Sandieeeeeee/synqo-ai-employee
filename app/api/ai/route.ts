import { NextRequest } from "next/server";

type Tool = "reply" | "email" | "followup" | "appointment" | "summary" | "quote" | "social";
type Tone = "professional" | "friendly" | "concise";

const TOOL_INSTRUCTIONS: Record<Tool, string> = {
  reply: "Write a ready-to-send customer-service reply.",
  email: "Write a complete business email, including a useful subject line.",
  followup: "Write a persuasive but respectful lead follow-up message with one clear next step.",
  appointment: "Write a clear appointment confirmation or rescheduling message.",
  summary: "Summarize the notes into key points, decisions, and action items. Do not invent missing facts.",
  quote: "Write a polished quote or estimate note. Preserve every supplied price, date, and condition exactly.",
  social: "Write an engaging business social-media caption with a natural call to action and no more than five relevant hashtags.",
};

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  professional: "Use a polished, confident, professional tone.",
  friendly: "Use a warm, approachable, human tone.",
  concise: "Be direct and concise while retaining essential details.",
};

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= LIMIT) return false;
  current.count += 1;
  return true;
}

async function verifyFirebaseUser(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const idToken = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!idToken || !apiKey) return null;

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken }),
    cache: "no-store",
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { users?: Array<{ localId?: string; email?: string; emailVerified?: boolean }> };
  const user = data.users?.[0];
  return user?.localId && user.emailVerified ? user : null;
}

function getGatewayCredential() {
  return process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN || "";
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyFirebaseUser(request);
    if (!user) return Response.json({ error: "Please sign in with a verified account." }, { status: 401 });

    const body = (await request.json()) as { tool?: string; tone?: string; input?: string };
    const tool = body.tool as Tool;
    const tone = body.tone as Tone;
    const input = body.input?.trim() || "";
    if (!(tool in TOOL_INSTRUCTIONS) || !(tone in TONE_INSTRUCTIONS) || input.length < 2 || input.length > 6000) {
      return Response.json({ error: "Add valid details between 2 and 6,000 characters." }, { status: 400 });
    }

    const rateKey = user.localId || user.email || "unknown";
    if (!checkRateLimit(rateKey)) {
      return Response.json({ error: "Hourly trial limit reached. Please try again later." }, { status: 429 });
    }

    const credential = getGatewayCredential();
    if (!credential) {
      return Response.json({ error: "AI service is not available yet. Please try again shortly." }, { status: 503 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    let gatewayResponse: Response;
    try {
      gatewayResponse = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
        method: "POST",
        headers: {
          authorization: `Bearer ${credential}`,
          "content-type": "application/json",
          "http-referer": process.env.NEXT_PUBLIC_APP_URL || "https://www.synqoai.com",
          "x-title": "Synqo AI Employee",
        },
        body: JSON.stringify({
          model: process.env.AI_GATEWAY_MODEL || "minimax/minimax-m3-free",
          messages: [
            {
              role: "system",
              content: `You are Synqo AI Employee, a practical writing assistant for small businesses. ${TOOL_INSTRUCTIONS[tool]} ${TONE_INSTRUCTIONS[tone]} Match the user's language when practical. Return only the useful finished draft. Never invent names, prices, dates, promises, or legal claims; use a clear [placeholder] if essential information is missing.`,
            },
            { role: "user", content: input },
          ],
          max_completion_tokens: 700,
        }),
        signal: controller.signal,
        cache: "no-store",
      });
    } finally {
      clearTimeout(timeout);
    }

    const data = (await gatewayResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };
    if (!gatewayResponse.ok) {
      console.error("AI Gateway request failed", gatewayResponse.status, data.error?.message || "Unknown gateway error");
      const status = gatewayResponse.status === 429 ? 429 : 502;
      return Response.json({ error: status === 429 ? "AI is busy right now. Please retry in a moment." : "AI could not complete this request. Please try again." }, { status });
    }

    const output = data.choices?.[0]?.message?.content?.trim();
    if (!output) return Response.json({ error: "AI returned an empty result. Please try again." }, { status: 502 });
    return Response.json({ output });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    console.error("Synqo AI request failed", timedOut ? "timeout" : error);
    return Response.json({ error: timedOut ? "AI took too long to respond. Please retry." : "Something went wrong. Please try again." }, { status: timedOut ? 504 : 500 });
  }
}
