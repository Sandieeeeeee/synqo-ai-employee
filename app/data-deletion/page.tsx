import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import InteractiveBackground from "@/components/InteractiveBackground";

export const metadata: Metadata = {
  title: "Data Deletion Instructions",
  description: "How to request deletion of your Synqo AI account and connected social-account data.",
  alternates: { canonical: "/data-deletion" },
};

export default function DataDeletionPage() {
  return (
    <main className="legal-page">
      <InteractiveBackground />
      <nav className="inner-navbar">
        <Link href="/" className="brand"><span className="brand-mark">S</span><span className="brand-text">SYNQO <strong>AI</strong></span></Link>
        <Link href="/" className="inner-back-link"><ArrowLeft size={16} />Home</Link>
      </nav>
      <div className="legal-container">
        <h1>Data Deletion Instructions</h1>
        <p>You can request deletion of your Synqo AI account, workspace information and connected Instagram or Facebook data at any time.</p>
        <h2>How to request deletion</h2>
        <p>Open the Synqo AI Contact page, select account or privacy support, and send your request using the same email address registered to your Synqo account. Write “Delete my Synqo AI data” in your message.</p>
        <p><Link className="primary-button" href="/contact">Open Contact Page</Link></p>
        <h2>What happens next</h2>
        <p>We will verify account ownership, disconnect authorized social accounts and delete the associated Synqo AI data, except information we must retain for legal, security or billing obligations. We will confirm when the request is complete.</p>
        <h2>Disconnect without deleting your account</h2>
        <p>When Meta connection is available, you will also be able to disconnect Instagram and Facebook from Social Agent settings. You can separately remove Synqo AI from your Facebook Business Integrations settings.</p>
      </div>
    </main>
  );
}
