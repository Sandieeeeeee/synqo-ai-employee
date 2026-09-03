"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BellRing,
  CheckCircle2,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";

import { auth } from "../lib/firebase";
import styles from "./settings.module.css";

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      if (!currentUser.emailVerified) {
        router.replace("/verify-email");
        return;
      }

      setUser(currentUser);
      setDisplayName(currentUser.displayName ?? "");
      setLoading(false);
    });

    return unsubscribe;
  }, [router]);

  const accountCreated = useMemo(() => {
    if (!user?.metadata.creationTime) return "Not available";

    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(user.metadata.creationTime));
  }, [user]);

  async function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!auth.currentUser) {
      router.replace("/login");
      return;
    }

    const cleanName = displayName.trim();

    if (cleanName.length < 2) {
      setError("Please enter a name with at least 2 characters.");
      setSuccess("");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile(auth.currentUser, {
        displayName: cleanName,
      });

      setUser(auth.currentUser);
      setDisplayName(cleanName);
      setSuccess("Profile updated successfully.");
    } catch {
      setError("We could not update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordReset() {
    if (!user?.email) {
      setError("No email address is connected to this account.");
      setSuccess("");
      return;
    }

    setSendingReset(true);
    setError("");
    setSuccess("");

    try {
      await sendPasswordResetEmail(auth, user.email, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });

      setSuccess("Password reset link sent. Check your inbox and spam folder.");
    } catch {
      setError("We could not send the password reset email. Please try again.");
    } finally {
      setSendingReset(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    setError("");
    setSuccess("");

    try {
      await signOut(auth);
      router.replace("/login");
    } catch {
      setError("We could not sign you out. Please try again.");
      setSigningOut(false);
    }
  }

  if (loading) {
    return (
      <main className={styles.loadingPage}>
        <Loader2 className={styles.spinner} size={36} />
        <p>Loading account settings...</p>
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

      <header className={styles.topbar}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}>S</span>
          <span>
            SYNQO <strong>AI</strong>
          </span>
        </Link>

        <Link className={styles.dashboardLink} href="/dashboard">
          <LayoutDashboard size={17} />
          Dashboard
        </Link>
      </header>

      <section className={styles.content}>
        <motion.div
          className={styles.heading}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Link href="/dashboard">
            <ArrowLeft size={17} />
            Back to dashboard
          </Link>

          <div className={styles.eyebrow}>
            <Sparkles size={15} />
            Account control center
          </div>

          <h1>Settings</h1>

          <p>Manage your profile, account security and Synqo AI preferences.</p>
        </motion.div>

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

        <div className={styles.gridLayout}>
          <motion.section
            className={styles.card}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <UserRound size={21} />
              </div>

              <div>
                <span>Profile</span>
                <h2>Personal information</h2>
              </div>
            </div>

            <form className={styles.form} onSubmit={handleSaveProfile}>
              <label htmlFor="displayName">Full name</label>

              <div className={styles.inputWrap}>
                <UserRound size={18} />
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(event) => {
                    setDisplayName(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Enter your full name"
                  maxLength={60}
                  disabled={saving}
                />
              </div>

              <label htmlFor="email">Email address</label>

              <div className={`${styles.inputWrap} ${styles.disabledInput}`}>
                <Mail size={18} />
                <input
                  id="email"
                  type="email"
                  value={user?.email ?? ""}
                  disabled
                  readOnly
                />
              </div>

              <p className={styles.fieldNote}>
                Your email is managed by Firebase Authentication and cannot be
                changed from this page yet.
              </p>

              <button
                className={styles.primaryButton}
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className={styles.spinner} size={18} />
                    Saving changes...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save profile
                  </>
                )}
              </button>
            </form>
          </motion.section>

          <motion.section
            className={styles.card}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <ShieldCheck size={21} />
              </div>

              <div>
                <span>Security</span>
                <h2>Password and access</h2>
              </div>
            </div>

            <div className={styles.securityBlock}>
              <div className={styles.securityIcon}>
                <KeyRound size={21} />
              </div>

              <div>
                <h3>Reset password</h3>
                <p>
                  We will send a secure reset link to your verified email
                  address.
                </p>
              </div>
            </div>

            <button
              className={styles.secondaryButton}
              type="button"
              onClick={handlePasswordReset}
              disabled={sendingReset}
            >
              {sendingReset ? (
                <>
                  <Loader2 className={styles.spinner} size={18} />
                  Sending reset link...
                </>
              ) : (
                <>
                  <Mail size={18} />
                  Send password reset email
                </>
              )}
            </button>

            <div className={styles.securityStatus}>
              <CheckCircle2 size={18} />
              <div>
                <strong>Email verified</strong>
                <span>Your account email has been successfully verified.</span>
              </div>
            </div>
          </motion.section>

          <motion.section
            className={styles.card}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <Settings size={21} />
              </div>

              <div>
                <span>Account</span>
                <h2>Account details</h2>
              </div>
            </div>

            <div className={styles.detailsList}>
              <div>
                <span>Account status</span>
                <strong>Active</strong>
              </div>

              <div>
                <span>Email verification</span>
                <strong>Verified</strong>
              </div>

              <div>
                <span>Current plan</span>
                <strong>30-day free trial</strong>
              </div>

              <div>
                <span>Account created</span>
                <strong>{accountCreated}</strong>
              </div>
            </div>
          </motion.section>

          <motion.section
            className={`${styles.card} ${styles.preferencesCard}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <BellRing size={21} />
              </div>

              <div>
                <span>Preferences</span>
                <h2>Notifications</h2>
              </div>
            </div>

            <div className={styles.preferenceRow}>
              <div>
                <strong>Product updates</strong>
                <span>
                  Receive important Synqo AI launch and feature announcements.
                </span>
              </div>

              <label className={styles.switch}>
                <input type="checkbox" defaultChecked />
                <span />
              </label>
            </div>

            <div className={styles.preferenceRow}>
              <div>
                <strong>Tips and recommendations</strong>
                <span>
                  Get occasional suggestions to make better use of your tools.
                </span>
              </div>

              <label className={styles.switch}>
                <input type="checkbox" defaultChecked />
                <span />
              </label>
            </div>

            <p className={styles.preferenceNote}>
              These preference controls are currently visual. They can be
              connected to Firestore in the next phase.
            </p>
          </motion.section>
        </div>

        <section className={styles.dangerZone}>
          <div>
            <span>Session</span>
            <h2>Sign out of your account</h2>
            <p>
              You will need to enter your login details again to access your
              dashboard.
            </p>
          </div>

          <button type="button" onClick={handleSignOut} disabled={signingOut}>
            {signingOut ? (
              <>
                <Loader2 className={styles.spinner} size={18} />
                Signing out...
              </>
            ) : (
              <>
                <LogOut size={18} />
                Sign out
              </>
            )}
          </button>
        </section>
      </section>
    </main>
  );
}
