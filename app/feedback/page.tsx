"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, MessageSquareHeart, Send, Star } from "lucide-react";
import styles from "./feedback.module.css";

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating) return setError("Please select a rating.");
    setSubmitting(true);
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          category: data.get("category"),
          message: data.get("message"),
          email: data.get("email"),
          website: data.get("website"),
          page: window.location.href,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to send feedback.");
      form.reset();
      setSuccess(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to send feedback.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.glow} />
      <section className={styles.card}>
        <Link className={styles.back} href="/"><ArrowLeft size={17} />Back to Synqo AI</Link>
        {success ? (
          <div className={styles.success}>
            <CheckCircle2 size={48} />
            <span>FEEDBACK RECEIVED</span>
            <h1>Thanks for helping us build better.</h1>
            <p>Your feedback has reached the Synqo AI team and will help shape the next version.</p>
            <div><Link href="/dashboard">Open AI Employee</Link><button type="button" onClick={() => { setSuccess(false); setRating(0); }}>Send more feedback</button></div>
          </div>
        ) : (
          <>
            <div className={styles.heading}><span><MessageSquareHeart size={17} />PRODUCT FEEDBACK</span><h1>Help shape Synqo AI.</h1><p>Tell us what worked, what felt confusing and what your business needs next.</p></div>
            <form onSubmit={submit} className={styles.form}>
              <fieldset><legend>How was your experience?</legend><div className={styles.stars}>{[1,2,3,4,5].map((value) => <button key={value} type="button" onMouseEnter={() => setHovered(value)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(value)} aria-label={"Rate " + value + " out of 5"}><Star fill={(hovered || rating) >= value ? "currentColor" : "none"} /></button>)}</div></fieldset>
              <label>Feedback type<select name="category" defaultValue="" required><option value="" disabled>Select one</option><option>Feature suggestion</option><option>Something is not working</option><option>Design and usability</option><option>Signup or account</option><option>General feedback</option></select></label>
              <label>Your feedback<textarea name="message" rows={7} minLength={5} maxLength={3000} placeholder="Share the details that would help us improve…" required /></label>
              <label>Email <small>(optional, only if you want a reply)</small><input name="email" type="email" placeholder="you@example.com" /></label>
              <input name="website" tabIndex={-1} autoComplete="off" className={styles.honeypot} aria-hidden="true" />
              {error && <div className={styles.error}>{error}</div>}
              <button className={styles.submit} type="submit" disabled={submitting}>{submitting ? <><Loader2 className={styles.spin} />Sending…</> : <>Send feedback<Send size={18} /></>}</button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
