import { NextRequest, NextResponse } from "next/server";

import { requireUser } from "../../../../lib/auth-server";
import { adminDb } from "../../../../lib/firebase-admin";
import { stripe } from "../../../../lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const decodedUser = await requireUser(request);
    const billingSnapshot = await adminDb
      .collection("billing")
      .doc(decodedUser.uid)
      .get();

    const customerId = billingSnapshot.data()?.stripeCustomerId as
      | string
      | undefined;

    if (!customerId) {
      return NextResponse.json(
        { error: "No Stripe customer was found for this account." },
        { status: 404 }
      );
    }

    const origin =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/settings`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to open billing portal.";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    console.error("Stripe portal error:", error);

    return NextResponse.json(
      { error: "Unable to open billing portal." },
      { status: 500 }
    );
  }
}
