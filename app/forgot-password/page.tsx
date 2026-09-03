"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../lib/firebase";
import styles from "./forgot-password.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, cleanEmail, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });

      setSuccess("Password reset link sent. Check your inbox and spam folder.");
    } catch (firebaseError: unknown) {
      const code =
        typeof firebaseError === "object" &&
        firebaseError !== null &&
        "code" in firebaseError
          ? String(firebaseError.code)
          : "";

      if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else {
        setError(
          "We could not send the reset email right now. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.background} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />
      </div>

      <motion.section
        className={styles.card}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.brand}>
          <span className={styles.brandMark}>S</span>
          <span>
            SYNQO <strong>AI</strong>
          </span>
        </div>

        <div className={styles.iconWrap}>
          <div className={styles.iconGlow} />
          <KeyRound size={42} />
        </div>

        <div className={styles.eyebrow}>
          <Sparkles size={16} />
          Account recovery
        </div>

        <h1>Forgot your password?</h1>

        <p className={styles.description}>
          Enter the email address connected to your Synqo AI account. We will
          send you a secure password reset link.
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email address</label>

          <div className={styles.inputWrap}>
            <Mail size={19} />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
                setSuccess("");
              }}
              disabled={loading}
            />
          </div>

          {success && (
            <div className={styles.successMessage} role="status">
              <CheckCircle2 size={19} />
              <span>{success}</span>
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
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className={styles.spinner} size={19} />
                Sending reset link...
              </>
            ) : (
              <>
                <Send size={18} />
                Send reset link
              </>
            )}
          </button>
        </form>

        <Link className={styles.backLink} href="/login">
          <ArrowLeft size={17} />
          Back to login
        </Link>

        <div className={styles.note}>
          <ShieldCheck size={16} />
          <span>
            For your security, the reset link will only work for a limited time.
          </span>
        </div>
      </motion.section>
    </main>
  );
}
