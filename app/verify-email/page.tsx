"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  LogOut,
  MailCheck,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  signOut,
  User,
} from "firebase/auth";

import { auth } from "../lib/firebase";
import styles from "./verify-email.module.css";

const RESEND_COOLDOWN = 60;

export default function VerifyEmailPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [resending, setResending] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      try {
        await reload(currentUser);

        if (currentUser.emailVerified) {
          router.replace("/dashboard");
          return;
        }

        setUser(auth.currentUser);
      } catch {
        setUser(currentUser);
      } finally {
        setChecking(false);
      }
    });

    return unsubscribe;
  }, [router]);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  async function checkVerificationStatus() {
    if (!auth.currentUser) {
      router.replace("/login");
      return;
    }

    setChecking(true);
    setMessage("");
    setError("");

    try {
      await reload(auth.currentUser);

      if (auth.currentUser.emailVerified) {
        setMessage("Email verified successfully. Redirecting...");
        window.setTimeout(() => {
          router.replace("/dashboard");
        }, 700);
        return;
      }

      setError(
        "Your email is not verified yet. Open the verification link in your inbox, then check again.",
      );
    } catch {
      setError(
        "We could not refresh your verification status. Please try again.",
      );
    } finally {
      setChecking(false);
    }
  }

  async function resendVerificationEmail() {
    if (!auth.currentUser || cooldown > 0) {
      return;
    }

    setResending(true);
    setMessage("");
    setError("");

    try {
      await sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: false,
      });

      setCooldown(RESEND_COOLDOWN);
      setMessage(
        "A new verification email has been sent. Please check your inbox and spam folder.",
      );
    } catch (firebaseError: unknown) {
      const code =
        typeof firebaseError === "object" &&
        firebaseError !== null &&
        "code" in firebaseError
          ? String(firebaseError.code)
          : "";

      if (code === "auth/too-many-requests") {
        setError(
          "Too many verification requests. Please wait a few minutes and try again.",
        );
      } else {
        setError(
          "We could not resend the verification email. Please try again.",
        );
      }
    } finally {
      setResending(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    setMessage("");
    setError("");

    try {
      await signOut(auth);
      router.replace("/login");
    } catch {
      setError("We could not sign you out. Please try again.");
      setSigningOut(false);
    }
  }

  if (checking && !user) {
    return (
      <main className={styles.page}>
        <div className={styles.background} aria-hidden="true">
          <div className={styles.grid} />
          <div className={styles.glowOne} />
          <div className={styles.glowTwo} />
        </div>

        <div className={styles.loadingState}>
          <Loader2 className={styles.spinner} size={34} />
          <p>Checking your account...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.background} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55 }}
        className={styles.card}
      >
        <div className={styles.brand}>
          <span className={styles.brandMark}>S</span>
          <span>
            SYNQO <strong>AI</strong>
          </span>
        </div>

        <div className={styles.iconWrap}>
          <div className={styles.iconGlow} />
          <MailCheck size={42} />
        </div>

        <div className={styles.eyebrow}>
          <Sparkles size={16} />
          One final step
        </div>

        <h1>Verify your email address</h1>

        <p className={styles.description}>
          We sent a verification link to
          <strong>{user?.email ?? " your email address"}</strong>. Open the
          message, click the verification link, then return here and check your
          status.
        </p>

        <div className={styles.steps}>
          <div>
            <span>1</span>
            <p>Open your email inbox.</p>
          </div>

          <div>
            <span>2</span>
            <p>Click the Synqo AI verification link.</p>
          </div>

          <div>
            <span>3</span>
            <p>Return here and click “I&apos;ve verified my email.”</p>
          </div>
        </div>

        {message && (
          <div className={styles.successMessage} role="status">
            <CheckCircle2 size={19} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className={styles.errorMessage} role="alert">
            <ShieldCheck size={19} />
            <span>{error}</span>
          </div>
        )}

        <button
          className={styles.primaryButton}
          type="button"
          onClick={checkVerificationStatus}
          disabled={checking}
        >
          {checking ? (
            <>
              <Loader2 className={styles.spinner} size={19} />
              Checking status...
            </>
          ) : (
            <>
              <RefreshCw size={18} />
              I&apos;ve verified my email
            </>
          )}
        </button>

        <button
          className={styles.secondaryButton}
          type="button"
          onClick={resendVerificationEmail}
          disabled={resending || cooldown > 0}
        >
          {resending ? (
            <>
              <Loader2 className={styles.spinner} size={18} />
              Sending email...
            </>
          ) : (
            <>
              <Send size={18} />
              {cooldown > 0
                ? `Resend available in ${cooldown}s`
                : "Resend verification email"}
            </>
          )}
        </button>

        <button
          className={styles.signOutButton}
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <>
              <Loader2 className={styles.spinner} size={17} />
              Signing out...
            </>
          ) : (
            <>
              <LogOut size={17} />
              Use a different account
            </>
          )}
        </button>

        <div className={styles.note}>
          <ShieldCheck size={16} />
          <span>
            Can&apos;t find the email? Check your spam, junk, or promotions
            folder.
          </span>
        </div>
      </motion.section>
    </main>
  );
}
