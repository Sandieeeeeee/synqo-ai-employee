"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <InteractiveBackground />

      <nav className="inner-navbar">
        <Link href="/" className="brand">
          <span className="brand-mark">S</span>
          <span className="brand-text">
            SYNQO <strong>AI</strong>
          </span>
        </Link>

        <Link href="/" className="inner-back-link">
          <ArrowLeft size={16} />
          Home
        </Link>
      </nav>

      <div className="legal-container">
        <h1>Privacy Policy</h1>

        <p>
          Synqo AI respects your privacy and is committed to protecting your
          personal information.
        </p>

        <h2>Information We Collect</h2>

        <p>
          We may collect your name, email address, and information you provide
          when contacting us or using our services.
        </p>

        <h2>How We Use Information</h2>

        <p>
          We use your information to improve our products, communicate with
          users, and provide customer support.
        </p>

        <h2>Connected Social Accounts</h2>

        <p>
          If you choose to connect an Instagram or Facebook business account,
          Synqo AI may process account identifiers, comments, direct messages
          and access tokens only to provide the Social Agent features you
          authorize. We do not sell connected-account data. You can disconnect
          an account or request deletion at any time.
        </p>

        <h2>Data Deletion</h2>

        <p>
          You can review our <Link href="/data-deletion">data deletion instructions</Link>
          {" "}or contact us to request removal of your Synqo AI account and
          connected social data.
        </p>

        <h2>Security</h2>

        <p>
          We use industry-standard security practices to help protect your data.
        </p>

        <h2>Contact</h2>

        <p>
          Questions about this Privacy Policy can be sent through our Contact
          page.
        </p>
      </div>
    </main>
  );
}
