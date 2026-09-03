"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import styles from "./BusinessAssistant.module.css";

type Message = { id: number; role: "assistant" | "user"; text: string };

const starters = [
  "What can Synqo AI do?",
  "How do I get started?",
  "I want to share feedback",
];

function replyTo(message: string) {
  const text = message.toLowerCase();
  if (text.includes("price") || text.includes("pricing") || text.includes("cost")) {
    return "You can review the current plans on our Pricing page. For a custom business workflow, use Early Access and tell us what you want to automate.";
  }
  if (text.includes("sign") || text.includes("account") || text.includes("start")) {
    return "Create an account to open your AI Employee workspace. You can use email or Google sign-in, then verify your email if prompted.";
  }
  if (text.includes("feedback") || text.includes("suggest") || text.includes("problem")) {
    return "We would genuinely value it. Open the Feedback page to rate your experience, report an issue or suggest a feature.";
  }
  if (text.includes("contact") || text.includes("human") || text.includes("team")) {
    return "Use the Contact page to tell the Synqo AI team about your business. Include the repetitive work you want your AI Employee to handle.";
  }
  if (text.includes("appointment") || text.includes("lead") || text.includes("email") || text.includes("customer")) {
    return "Synqo AI Employee helps prepare customer replies, business emails, lead follow-ups, appointment confirmations and organized next actions from one workspace.";
  }
  if (text.includes("what") || text.includes("do") || text.includes("help")) {
    return "I can explain Synqo AI Employee, guide you to the right page, help you start an account and collect feedback. Ask me about features, pricing, signup or early access.";
  }
  return "Thanks for your message. I can help with Synqo AI features, signup, pricing, early access and feedback. For a specific business request, the Contact page is the fastest route.";
}

export default function BusinessAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", text: "Hi, I’m Synqo Business Assistant. How can I help your business today?" },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean || typing) return;
    setMessages((current) => [...current, { id: Date.now(), role: "user", text: clean }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, { id: Date.now() + 1, role: "assistant", text: replyTo(clean) }]);
      setTyping(false);
    }, 450);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    send(input);
  }

  return (
    <div className={styles.root}>
      {open && (
        <section className={styles.panel} aria-label="Synqo Business Assistant">
          <header className={styles.header}>
            <div className={styles.identity}>
              <span className={styles.avatar}><Bot size={21} /></span>
              <div><strong>Synqo Business Assistant</strong><span><i />Online</span></div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant"><X size={20} /></button>
          </header>

          <div className={styles.messages} aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={message.role === "assistant" ? styles.assistantMessage : styles.userMessage}>
                {message.text}
              </div>
            ))}
            {typing && <div className={styles.typing}><span /><span /><span /></div>}
            <div ref={endRef} />
          </div>

          {messages.length < 3 && (
            <div className={styles.starters}>
              {starters.map((starter) => <button key={starter} type="button" onClick={() => send(starter)}>{starter}</button>)}
            </div>
          )}

          <div className={styles.quickLinks}>
            <Link href="/signup" onClick={() => setOpen(false)}>Create account</Link>
            <Link href="/feedback" onClick={() => setOpen(false)}>Send feedback</Link>
          </div>

          <form className={styles.composer} onSubmit={submit}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about Synqo AI…" aria-label="Message" />
            <button type="submit" disabled={!input.trim() || typing} aria-label="Send message"><Send size={18} /></button>
          </form>
          <p className={styles.note}><Sparkles size={13} />Product guide · No sensitive information</p>
        </section>
      )}
      <button className={styles.launcher} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close Synqo Business Assistant" : "Open Synqo Business Assistant"}>
        {open ? <X size={23} /> : <MessageCircle size={24} />}
        {!open && <span>Ask Synqo</span>}
      </button>
    </div>
  );
}
