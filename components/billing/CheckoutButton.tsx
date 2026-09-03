"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { auth } from "../../app/lib/firebase";

type CheckoutButtonProps = {
  plan: "monthly" | "lifetime";
  children: React.ReactNode;
  className?: string;
};

export default function CheckoutButton({
  plan,
  children,
  className,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    const user = auth.currentUser;

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await user.getIdToken();

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to open checkout.");
      }

      window.location.assign(data.url);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to open checkout."
      );
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className={className}
        onClick={startCheckout}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2
              size={18}
              style={{ animation: "spin 0.8s linear infinite" }}
            />
            Opening checkout...
          </>
        ) : (
          children
        )}
      </button>

      {error ? (
        <p style={{ marginTop: 8, color: "#ef9a9a", fontSize: 13 }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
