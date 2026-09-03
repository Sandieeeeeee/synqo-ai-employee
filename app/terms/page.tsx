import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import styles from "./terms.module.css";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Synqo AI terms of service.",
};

export default function TermsOfServicePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}>S</span>
          <span>
            SYNQO <strong>AI</strong>
          </span>
        </Link>

        <Link className={styles.backLink} href="/">
          <ArrowLeft size={17} />
          Back home
        </Link>
      </header>

      <div className={styles.container}>
        <div className={styles.eyebrow}>Legal</div>
        <h1 className={styles.title}>Terms of Service</h1>

        <p className={styles.intro}>
          These terms govern your access to and use of Synqo AI websites,
          applications, software and related services.
        </p>

        <p className={styles.updated}>Last updated: July 23, 2026</p>

        <article className={styles.document}>
          <section className={styles.section}>
            <h2>1. Acceptance of terms</h2>
            <p>
              By accessing or using Synqo AI, you agree to these terms and our
              Privacy Policy. Do not use the services if you do not agree.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Accounts</h2>
            <p>
              You are responsible for providing accurate account information,
              protecting your login credentials and all activity performed
              through your account.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Acceptable use</h2>
            <p>You may not use Synqo AI to:</p>
            <ul>
              <li>
                Break applicable laws or violate another person&apos;s rights.
              </li>
              <li>Upload malware or interfere with service operation.</li>
              <li>Attempt unauthorized access to systems or accounts.</li>
              <li>Misrepresent your identity or engage in fraud.</li>
              <li>Abuse, overload, copy or resell the services unlawfully.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. AI-generated output</h2>
            <p>
              AI-generated results may be incomplete or inaccurate. You are
              responsible for reviewing output before relying on it for
              business, legal, financial, medical or other important decisions.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Plans, trials and payments</h2>
            <p>
              Certain features may require a paid plan. Pricing, billing
              periods, trial limits and cancellation rules will be shown before
              purchase. Taxes may apply where required.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Intellectual property</h2>
            <p>
              Synqo AI and its software, branding, interface and original
              content are owned by Synqo AI or its licensors. These terms do not
              transfer ownership rights to users.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Availability and changes</h2>
            <p>
              We may update, suspend or discontinue features to improve
              security, performance or product direction. We do not guarantee
              uninterrupted availability.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Disclaimer</h2>
            <p>
              Services are provided on an &quot;as available&quot; basis to the
              maximum extent permitted by law, without guarantees that every
              feature will always be error-free or suitable for every purpose.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, Synqo AI will not be
              liable for indirect, incidental, special or consequential losses
              resulting from use of or inability to use the services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Termination</h2>
            <p>
              We may suspend or terminate accounts that violate these terms,
              create security risks or misuse the services. You may stop using
              Synqo AI at any time.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Governing law</h2>
            <p>
              These terms are governed by applicable laws in Ontario, Canada,
              subject to any mandatory consumer protections that apply in your
              jurisdiction.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Changes to these terms</h2>
            <p>
              We may update these terms when our products or legal requirements
              change. Continued use after an update means you accept the revised
              terms.
            </p>
          </section>

          <div className={styles.contactBox}>
            <strong>Questions about these terms</strong>
            <a href="mailto:synqoai@yahoo.com">synqoai@yahoo.com</a>
          </div>

          <p className={styles.footer}>
            This page is a general startup template and should be reviewed by a
            qualified legal professional before a large-scale public launch.
          </p>
        </article>
      </div>
    </main>
  );
}
