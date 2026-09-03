"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, googleProvider } from "../lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) return;

    if (user.emailVerified) {
      router.replace("/dashboard");
    } else {
      router.replace("/verify-email");
    }
  }, [router]);

  const loginWithEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoggingIn(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      if (!credential.user.emailVerified) {
        router.replace("/verify-email");
        return;
      }

      router.replace("/dashboard");
    } catch (loginError: unknown) {
      console.error("Login error:", loginError);

      const errorCode =
        typeof loginError === "object" &&
        loginError !== null &&
        "code" in loginError
          ? String(loginError.code)
          : "";

      if (
        errorCode === "auth/invalid-credential" ||
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/user-not-found"
      ) {
        setError("Incorrect email or password.");
      } else if (errorCode === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (errorCode === "auth/too-many-requests") {
        setError("Too many login attempts. Please try again later.");
      } else if (errorCode === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("Unable to log in. Please try again.");
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const loginWithGoogle = async () => {
    setError("");
    setMessage("");
    setGoogleLoading(true);

    try {
      const credential = await signInWithPopup(auth, googleProvider);

      if (!credential.user.emailVerified) {
        router.replace("/verify-email");
        return;
      }

      router.replace("/dashboard");
    } catch (googleError: unknown) {
      console.error("Google login error:", googleError);

      const errorCode =
        typeof googleError === "object" &&
        googleError !== null &&
        "code" in googleError
          ? String(googleError.code)
          : "";

      if (errorCode === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled.");
      } else if (errorCode === "auth/popup-blocked") {
        setError("The Google sign-in popup was blocked by your browser.");
      } else {
        setError("Unable to sign in with Google. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const resetPassword = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Enter your email address first, then click Forgot password.");
      return;
    }

    setResettingPassword(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());

      setMessage(
        "Password reset email sent. Check your inbox and spam folder.",
      );
    } catch (resetError: unknown) {
      console.error("Password reset error:", resetError);

      const errorCode =
        typeof resetError === "object" &&
        resetError !== null &&
        "code" in resetError
          ? String(resetError.code)
          : "";

      if (errorCode === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (errorCode === "auth/too-many-requests") {
        setError("Too many requests. Please wait and try again.");
      } else {
        setError("Unable to send the password reset email.");
      }
    } finally {
      setResettingPassword(false);
    }
  };

  const isBusy = loggingIn || googleLoading || resettingPassword;

  return (
    <main style={styles.page}>
      <div style={styles.backgroundGlowOne} />
      <div style={styles.backgroundGlowTwo} />

      <section style={styles.card}>
        <button
          type="button"
          onClick={() => router.push("/")}
          style={styles.brandButton}
          aria-label="Go to Synqo AI homepage"
        >
          <span style={styles.logo}>S</span>

          <span>
            <span style={styles.brandName}>Synqo AI</span>
            <span style={styles.brandTagline}>Intelligence in sync</span>
          </span>
        </button>

        <div style={styles.headingArea}>
          <p style={styles.eyebrow}>WELCOME BACK</p>
          <h1 style={styles.heading}>Log in to your account</h1>
          <p style={styles.description}>
            Continue building, automating and growing with Synqo AI.
          </p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}
        {message && <div style={styles.successBox}>{message}</div>}

        <button
          type="button"
          onClick={loginWithGoogle}
          disabled={isBusy}
          style={{
            ...styles.googleButton,
            ...(isBusy ? styles.disabledButton : {}),
          }}
        >
          <span style={styles.googleIcon}>G</span>
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>OR CONTINUE WITH EMAIL</span>
          <span style={styles.dividerLine} />
        </div>

        <form onSubmit={loginWithEmail}>
          <label htmlFor="email" style={styles.label}>
            Email address
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isBusy}
            style={styles.input}
          />

          <div style={styles.passwordLabelRow}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>

            <button
              type="button"
              onClick={resetPassword}
              disabled={isBusy}
              style={styles.forgotButton}
            >
              {resettingPassword ? "Sending..." : "Forgot password?"}
            </button>
          </div>

          <div style={styles.passwordWrapper}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isBusy}
              style={styles.passwordInput}
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              disabled={isBusy}
              style={styles.showPasswordButton}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isBusy}
            style={{
              ...styles.primaryButton,
              ...(isBusy ? styles.disabledButton : {}),
            }}
          >
            {loggingIn ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p style={styles.signupText}>
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            disabled={isBusy}
            style={styles.signupButton}
          >
            Create account
          </button>
        </p>

        <p style={styles.footerText}>
          By continuing, you agree to the Synqo AI Terms and Privacy Policy.
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    position: "relative",
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
    padding: "28px 18px",
    color: "#ffffff",
    background:
      "radial-gradient(circle at top, #08295b 0%, #030b1d 46%, #01030a 100%)",
  },

  backgroundGlowOne: {
    position: "absolute",
    top: "-180px",
    left: "-180px",
    width: "440px",
    height: "440px",
    borderRadius: "50%",
    background: "rgba(0, 126, 255, 0.16)",
    filter: "blur(60px)",
    pointerEvents: "none",
  },

  backgroundGlowTwo: {
    position: "absolute",
    right: "-170px",
    bottom: "-210px",
    width: "480px",
    height: "480px",
    borderRadius: "50%",
    background: "rgba(0, 71, 255, 0.13)",
    filter: "blur(70px)",
    pointerEvents: "none",
  },

  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "490px",
    padding: "38px 34px 32px",
    border: "1px solid rgba(58, 147, 255, 0.28)",
    borderRadius: "26px",
    background: "rgba(3, 12, 29, 0.94)",
    boxShadow:
      "0 30px 100px rgba(0, 0, 0, 0.55), 0 0 45px rgba(0, 103, 255, 0.08)",
    backdropFilter: "blur(18px)",
  },

  brandButton: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    margin: "0 auto",
    padding: 0,
    border: 0,
    color: "#ffffff",
    background: "transparent",
    cursor: "pointer",
  },

  logo: {
    width: "50px",
    height: "50px",
    display: "grid",
    placeItems: "center",
    borderRadius: "15px",
    fontSize: "24px",
    fontWeight: 900,
    background: "linear-gradient(135deg, #1597ff, #004bd2)",
    boxShadow: "0 0 28px rgba(0, 132, 255, 0.4)",
  },

  brandName: {
    display: "block",
    textAlign: "left",
    fontSize: "19px",
    fontWeight: 850,
    letterSpacing: "-0.02em",
  },

  brandTagline: {
    display: "block",
    marginTop: "2px",
    color: "#7392b8",
    fontSize: "11px",
    textAlign: "left",
    letterSpacing: "0.05em",
  },

  headingArea: {
    margin: "31px 0 25px",
    textAlign: "center",
  },

  eyebrow: {
    margin: "0 0 10px",
    color: "#4da8ff",
    fontSize: "11px",
    fontWeight: 850,
    letterSpacing: "0.17em",
  },

  heading: {
    margin: 0,
    fontSize: "34px",
    lineHeight: 1.14,
    letterSpacing: "-0.04em",
  },

  description: {
    margin: "13px auto 0",
    maxWidth: "390px",
    color: "#93a5bf",
    fontSize: "14px",
    lineHeight: 1.65,
  },

  errorBox: {
    marginBottom: "18px",
    padding: "13px 14px",
    border: "1px solid rgba(255, 92, 116, 0.34)",
    borderRadius: "12px",
    color: "#ffb9c3",
    background: "rgba(132, 16, 35, 0.24)",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  successBox: {
    marginBottom: "18px",
    padding: "13px 14px",
    border: "1px solid rgba(63, 226, 157, 0.3)",
    borderRadius: "12px",
    color: "#a7f5d0",
    background: "rgba(13, 107, 68, 0.22)",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  googleButton: {
    width: "100%",
    height: "52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "11px",
    border: "1px solid rgba(115, 170, 236, 0.32)",
    borderRadius: "13px",
    color: "#eaf4ff",
    background: "rgba(255, 255, 255, 0.045)",
    fontSize: "14px",
    fontWeight: 750,
    cursor: "pointer",
  },

  googleIcon: {
    width: "25px",
    height: "25px",
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    color: "#111827",
    background: "#ffffff",
    fontSize: "14px",
    fontWeight: 900,
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "23px 0",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    background: "rgba(124, 158, 199, 0.2)",
  },

  dividerText: {
    color: "#637a99",
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: "0.12em",
    whiteSpace: "nowrap",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#c9d9ed",
    fontSize: "13px",
    fontWeight: 700,
  },

  input: {
    width: "100%",
    height: "50px",
    padding: "0 15px",
    border: "1px solid rgba(100, 153, 220, 0.26)",
    borderRadius: "12px",
    outline: "none",
    color: "#ffffff",
    background: "rgba(0, 5, 16, 0.62)",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  passwordLabelRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "18px",
  },

  forgotButton: {
    marginBottom: "8px",
    padding: 0,
    border: 0,
    color: "#47a8ff",
    background: "transparent",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },

  passwordWrapper: {
    position: "relative",
  },

  passwordInput: {
    width: "100%",
    height: "50px",
    padding: "0 70px 0 15px",
    border: "1px solid rgba(100, 153, 220, 0.26)",
    borderRadius: "12px",
    outline: "none",
    color: "#ffffff",
    background: "rgba(0, 5, 16, 0.62)",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  showPasswordButton: {
    position: "absolute",
    top: "50%",
    right: "14px",
    transform: "translateY(-50%)",
    padding: "5px",
    border: 0,
    color: "#60b4ff",
    background: "transparent",
    fontSize: "12px",
    fontWeight: 750,
    cursor: "pointer",
  },

  primaryButton: {
    width: "100%",
    height: "52px",
    marginTop: "23px",
    border: "1px solid #2194ff",
    borderRadius: "13px",
    color: "#ffffff",
    background: "linear-gradient(135deg, #0a86ff, #0049cf)",
    boxShadow: "0 12px 32px rgba(0, 101, 255, 0.24)",
    fontSize: "15px",
    fontWeight: 800,
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.62,
    cursor: "not-allowed",
  },

  signupText: {
    margin: "24px 0 0",
    color: "#8294ae",
    textAlign: "center",
    fontSize: "13px",
  },

  signupButton: {
    padding: 0,
    border: 0,
    color: "#49aaff",
    background: "transparent",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
  },

  footerText: {
    margin: "25px auto 0",
    maxWidth: "360px",
    color: "#526783",
    textAlign: "center",
    fontSize: "10px",
    lineHeight: 1.6,
  },
};
