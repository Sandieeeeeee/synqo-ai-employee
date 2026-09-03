import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { adminDb } from "../../../../lib/firebase-admin";
import { stripe } from "../../../../lib/stripe";

export const runtime = "nodejs";

async function saveSubscription(subscription: Stripe.Subscription) {
  const firebaseUid = subscription.metadata.firebaseUid;

  if (!firebaseUid) {
    return;
  }

  const firstItem = subscription.items.data[0];

  await adminDb.collection("billing").doc(firebaseUid).set(
    {
      stripeCustomerId:
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      subscriptionPriceId: firstItem?.price.id ?? null,
      currentPeriodEnd: firstItem?.current_period_end
        ? new Date(firstItem.current_period_end * 1000)
        : null,
      plan: subscription.metadata.plan ?? "monthly",
      premium: ["active", "trialing"].includes(subscription.status),
      updatedAt: new Date(),
    },
    { merge: true }
  );
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET." },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 }
    );
  }

  try {
    const rawBody = await request.text();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const firebaseUid = session.metadata?.firebaseUid;
        const plan = session.metadata?.plan;

        if (firebaseUid) {
          const isLifetime = session.mode === "payment" && plan === "lifetime";

          await adminDb.collection("billing").doc(firebaseUid).set(
            {
              stripeCustomerId:
                typeof session.customer === "string"
                  ? session.customer
                  : session.customer?.id ?? null,
              checkoutSessionId: session.id,
              paymentStatus: session.payment_status,
              plan: plan ?? null,
              lifetimeAccess: isLifetime && session.payment_status === "paid",
              premium:
                isLifetime && session.payment_status === "paid"
                  ? true
                  : undefined,
              updatedAt: new Date(),
            },
            { merge: true }
          );
        }

        if (session.subscription) {
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;

          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);

          await saveSubscription(subscription);
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await saveSubscription(event.data.object as Stripe.Subscription);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionDetails = invoice.parent?.subscription_details;
        const subscriptionValue = subscriptionDetails?.subscription;

        if (subscriptionValue) {
          const subscriptionId =
            typeof subscriptionValue === "string"
              ? subscriptionValue
              : subscriptionValue.id;

          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);

          await saveSubscription(subscription);
        }

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);

    return NextResponse.json(
      { error: "Webhook signature verification failed." },
      { status: 400 }
    );
  }
}
