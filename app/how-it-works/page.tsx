import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarCheck, Inbox, MessageSquareText, Workflow } from "lucide-react";

import InteractiveBackground from "@/components/InteractiveBackground";
import styles from "../insightPages.module.css";

export const metadata: Metadata = {
  title: "How Synqo AI Employee Works",
  description: "See how Synqo AI Employee receives enquiries, understands requests, takes approved business actions and keeps every lead and follow-up organized.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  { icon: Inbox, title: "Receive", text: "A customer enquiry arrives through your connected business channel." },
  { icon: MessageSquareText, title: "Understand", text: "Synqo identifies the request and responds using your approved business information." },
  { icon: CalendarCheck, title: "Act", text: "It captures lead details, helps book an appointment or creates the next follow-up." },
  { icon: Workflow, title: "Organize", text: "Every conversation and action stays visible in one business workspace." },
];

export default function HowItWorksPage() {
  return <main className={styles.page}>
    <InteractiveBackground />
    <nav className="inner-navbar"><Link href="/" className="brand"><span className="brand-mark">S</span><span className="brand-text">SYNQO <strong>AI</strong></span></Link><Link href="/" className="inner-back-link"><ArrowLeft size={16}/>Home</Link></nav>
    <section className={styles.shell}>
      <header className={styles.centerHero}><span className="section-label">PUBLIC PRODUCT TOUR · NO LOGIN REQUIRED</span><h1>From enquiry to action.<br/><span>One intelligent workflow.</span></h1><p>Explore how Synqo AI Employee supports everyday business work before you create an account.</p></header>
      <section className={styles.timeline}>
        {steps.map(({icon: Icon,title,text}, index) => <article className={styles.step} key={title}><span className={styles.stepNumber}>{String(index+1).padStart(2,"0")}</span><div className={styles.icon}><Icon size={25}/></div><h2>{title}</h2><p>{text}</p></article>)}
      </section>
      <section className={styles.statement}><span>BUILT FOR REAL BUSINESS WORK</span><h2>Customer enquiries, lead capture, appointments and follow-ups—working together.</h2><p>Website chat and email are available first. WhatsApp, Facebook and Instagram integrations are planned next and will require each business to connect its own approved accounts.</p><div className="hero-actions"><Link className="primary-button" href="/pricing">View pricing<ArrowRight size={18}/></Link><Link className="secondary-button" href="/contact">Request a demo</Link></div></section>
    </section>
  </main>;
}
