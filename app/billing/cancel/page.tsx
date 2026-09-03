import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";

export default function BillingCancelPage() {
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
          border: "1px solid rgba(255, 130, 130, 0.18)",
          borderRadius: 24,
          textAlign: "center",
          background: "rgba(5, 21, 41, 0.95)",
        }}
      >
        <XCircle size={54} color="#ef9a9a" />
        <h1 style={{ marginTop: 18 }}>Checkout cancelled</h1>
        <p style={{ color: "#8ba0b6", lineHeight: 1.7 }}>
          No payment was completed. You can return to pricing whenever you are
          ready.
        </p>
        <Link
          href="/pricing"
          style={{
            marginTop: 20,
            minHeight: 48,
            padding: "0 18px",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 13,
            border: "1px solid rgba(90, 170, 230, 0.22)",
            color: "#dceeff",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={18} />
          Back to pricing
        </Link>
      </section>
    </main>
  );
}
