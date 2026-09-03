import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function BillingSuccessPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#020711",
        color: "#f7fbff",
      }}
    >
      <section
        style={{
          width: "min(100%, 560px)",
          padding: 36,
          border: "1px solid rgba(70, 180, 255, 0.22)",
          borderRadius: 24,
          textAlign: "center",
          background: "rgba(5, 21, 41, 0.95)",
        }}
      >
        <CheckCircle2 size={54} color="#4fc3ff" />
        <h1 style={{ marginTop: 18 }}>Payment successful</h1>
        <p style={{ color: "#8ba0b6", lineHeight: 1.7 }}>
          Your Synqo AI access is being updated. It may take a few seconds for
          the Stripe webhook to finish processing.
        </p>
        <Link
          href="/dashboard"
          style={{
            marginTop: 20,
            minHeight: 48,
            padding: "0 18px",
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 13,
            background: "#0b8ef3",
            color: "#fff",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          Go to dashboard
        </Link>
      </section>
    </main>
  );
}
