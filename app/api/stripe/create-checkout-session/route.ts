import { NextRequest, NextResponse } from "next/server";

import { requireUser } from "../../../../lib/auth-server";
import { adminDb } from "../../../../lib/firebase-admin";
import { stripe } from "../../../../lib/stripe";

type Plan = "monthly" | "lifetime";

function getPriceId(plan: Plan) {
  if (plan === "monthly") {
    return process.env.STRIPE_MONTHLY_PRICE_ID;
  }

  return process.env.STRIPE_LIFETIME_PRICE_ID;
}

export async function POST(request: NextRequest) {
  try {
    const decodedUser = await requireUser(request);
    const body = (await request.json()) as { plan?: Plan };

    if (body.plan !== "monthly" && body.plan !== "lifetime") {
      return NextResponse.json(
        { error: "Invalid billing plan." },
        { status: 400 }
      );
    }

    const priceId = getPriceId(body.plan);

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price ID is not configured." },
        { status: 500 }
      );
    }

    const billingRef = adminDb.collection("billing").doc(decodedUser.uid);
    const billingSnapshot = await billingRef.get();

    let customerId = billingSnapshot.data()?.stripeCustomerId as
      | string
      | undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: decodedUser.email,
        name: decodedUser.name,
        metadata: {
          firebaseUid: decodedUser.uid,
        },
      });

      customerId = customer.id;

      await billingRef.set(
        {
          stripeCustomerId: customerId,
          email: decodedUser.email ?? null,
          updatedAt: new Date(),
        },
        { merge: true }
      );
    }

    const origin =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: body.plan === "monthly" ? "subscription" : "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_update: {
        address: "auto",
        name: "auto",
      },
      metadata: {
        firebaseUid: decodedUser.uid,
        plan: body.plan,
      },
      subscription_data:
        body.plan === "monthly"
          ? {
              metadata: {
                firebaseUid: decodedUser.uid,
                plan: body.plan,
              },
            }
          : undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create checkout.";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Unable to start secure checkout." },
      { status: 500 }
    );
  }
}
