"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

import { auth } from "../../app/lib/firebase";

type BillingPortalButtonProps = {
  className?: string;
};

export default function BillingPortalButton({
  className,
}: BillingPortalButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function openPortal() {
    const user = auth.currentUser;

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await user.getIdToken();

      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to open billing portal.");
      }

      window.location.assign(data.url);
    } catch (portalError) {
      setError(
        portalError instanceof Error
          ? portalError.message
          : "Unable to open billing portal."
      );
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className={className}
        onClick={openPortal}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 size={18} />
            Opening billing...
          </>
        ) : (
          <>
            <CreditCard size={18} />
            Manage billing
          </>
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
