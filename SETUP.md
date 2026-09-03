# Synqo AI Stripe Setup

## 1. Install packages

```powershell
npm install stripe firebase-admin
```

## 2. Copy folders

Copy every folder in this package into your project root. Keep the same paths.

## 3. Create Stripe products

In Stripe Dashboard, create:

1. Synqo Reminder Monthly — recurring monthly price
2. Synqo Reminder Lifetime — one-time price

Copy both `price_...` IDs into `.env.local`.

## 4. Firebase Admin credentials

Firebase Console:

Project settings → Service accounts → Generate new private key

Copy:

- project_id
- client_email
- private_key

into `.env.local`.

Never upload `.env.local` or the service-account JSON to GitHub.

## 5. Add checkout buttons to pricing

Import:

```tsx
import CheckoutButton from "../../components/billing/CheckoutButton";
```

Monthly:

```tsx
<CheckoutButton plan="monthly" className={styles.primaryButton}>
  Start monthly plan
</CheckoutButton>
```

Lifetime:

```tsx
<CheckoutButton plan="lifetime" className={styles.primaryButton}>
  Get lifetime access
</CheckoutButton>
```

Adjust the relative import if your pricing page is in another folder.

## 6. Add billing portal to settings

Import:

```tsx
import BillingPortalButton from "../../components/billing/BillingPortalButton";
```

Use:

```tsx
<BillingPortalButton className={styles.secondaryButton} />
```

## 7. Local webhook testing

Install Stripe CLI and sign in:

```powershell
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the displayed `whsec_...` value into `.env.local`.

## 8. Production webhook

In Stripe Dashboard:

Developers → Webhooks → Add endpoint

Endpoint:

```text
https://www.synqoai.com/api/stripe/webhook
```

Select:

- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_failed

## 9. Enable customer portal

Stripe Dashboard:

Settings → Billing → Customer portal

Enable subscription cancellation and payment-method updates.

## 10. Firestore data

Webhook writes billing status to:

```text
billing/{firebaseUid}
```

Important fields:

- premium
- lifetimeAccess
- subscriptionStatus
- stripeCustomerId
- stripeSubscriptionId
- plan
- currentPeriodEnd
