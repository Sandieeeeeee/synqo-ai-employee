"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db, googleProvider } from "../lib/firebase";

import styles from "./signup.module.css";

function getFirebaseError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "This email is already registered. Please sign in.";

      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/weak-password":
        return "Password must contain at least 6 characters.";

      case "auth/popup-closed-by-user":
        return "Google sign-up was cancelled.";

      case "auth/popup-blocked":
        return "Google popup was blocked by your browser.";

      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";

      default:
        return "Something went wrong. Please try again.";
    }
  }

  return "Something went wrong. Please try again.";
}

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the Terms and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const credential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password,
      );

      await updateProfile(credential.user, {
        displayName: cleanName,
      });

      await setDoc(
        doc(db, "users", credential.user.uid),
        {
          uid: credential.user.uid,
          fullName: cleanName,
          email: cleanEmail,
          photoURL: credential.user.photoURL ?? "",
          provider: "password",
          emailVerified: credential.user.emailVerified,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      await sendEmailVerification(credential.user);

      setMessage(
        "Account created. Verification email sent. Please check your inbox.",
      );

      setTimeout(() => {
        router.push("/verify-email");
      }, 1500);
    } catch (signupError) {
      console.error("Signup error:", signupError);
      setError(getFirebaseError(signupError));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setMessage("");

    if (!acceptTerms) {
      setError("Please accept the Terms and Privacy Policy.");
      return;
    }

    try {
      setGoogleLoading(true);

      const credential = await signInWithPopup(auth, googleProvider);
      const user = credential.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          fullName: user.displayName ?? "",
          email: user.email ?? "",
          photoURL: user.photoURL ?? "",
          provider: "google",
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      router.push("/dashboard");
    } catch (googleError) {
      console.error("Google signup error:", googleError);
      setError(getFirebaseError(googleError));
    } finally {
      setGoogleLoading(false);
    }
  };

  const busy = loading || googleLoading;

  return (
    <main className={styles.page}>
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />

      <section className={styles.card}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>S</span>
          <span>Synqo AI</span>
        </Link>

        <div className={styles.heading}>
          <p className={styles.eyebrow}>START BUILDING WITH AI</p>
          <h1>Create your account</h1>
          <p>
            Join Synqo AI and access intelligent software, automation and
            business tools.
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {message && <div className={styles.success}>{message}</div>}

        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleSignup}
          disabled={busy}
        >
          <span className={styles.googleIcon}>G</span>
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        <div className={styles.divider}>
          <span>or continue with email</span>
        </div>

        <form onSubmit={handleEmailSignup} className={styles.form}>
          <label>
            Full name
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={busy}
              required
            />
          </label>

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={busy}
              required
            />
          </label>

          <label>
            Password
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
                disabled={busy}
                required
              />

              <button
                type="button"
                className={styles.showButton}
                onClick={() => setShowPassword((current) => !current)}
                disabled={busy}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <label>
            Confirm password
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Enter password again"
              autoComplete="new-password"
              disabled={busy}
              required
            />
          </label>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(event) => setAcceptTerms(event.target.checked)}
              disabled={busy}
            />

            <span>
              I agree to the <Link href="/terms">Terms</Link> and{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </span>
          </label>

          <button type="submit" className={styles.submitButton} disabled={busy}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className={styles.loginText}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
