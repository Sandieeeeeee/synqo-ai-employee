"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bot, CalendarCheck, Camera, Check, Mail, MessageCircle, MessagesSquare, Share2, ShieldCheck, Sparkles, Users, Workflow } from "lucide-react";
import Link from "next/link";
import InteractiveBackground from "@/components/InteractiveBackground";
import styles from "./receptionistPricing.module.css";

const plans = [
  { name: "Starter", price: "49", description: "For one location ready to capture and organize every new enquiry.", features: ["AI website receptionist", "Customer enquiry inbox", "Lead capture and CRM", "Appointment booking", "Daily business summary", "Email support"], featured: false },
  { name: "Growth", price: "99", description: "For growing businesses that want automated follow-ups and connected channels.", features: ["Everything in Starter", "Automated lead follow-ups", "Advanced business analytics", "Team handoff and assignment", "Custom AI knowledge base", "Priority onboarding"], featured: true },
];

const integrations = [
  { name: "Website Chat", icon: MessagesSquare, status: "Available" },
  { name: "Business Email", icon: Mail, status: "Available" },
  { name: "WhatsApp", icon: MessageCircle, status: "Coming next" },
  { name: "Facebook", icon: Share2, status: "Coming next" },
  { name: "Instagram", icon: Camera, status: "Coming next" },
];

export default function PricingPage() {
  return <main className={styles.page}>
    <InteractiveBackground />
    <nav className="inner-navbar"><Link href="/" className="brand"><span className="brand-mark">S</span><span className="brand-text">SYNQO <strong>AI</strong></span></Link><Link href="/" className="inner-back-link"><ArrowLeft size={16} />Home</Link></nav>

    <section className={styles.hero}><motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
      <span className={styles.eyebrow}><Sparkles size={16} /> Synqo AI Receptionist</span>
      <h1>Your front desk.<br /><span>Now powered by AI.</span></h1>
      <p>Answer enquiries, capture leads, book appointments and keep every opportunity moving from one intelligent business workspace.</p>
      <div className={styles.heroActions}><Link className="primary-button" href="/signup">Start Free Trial <ArrowRight size={18} /></Link><Link className="secondary-button" href="/contact">Book a Demo</Link></div>
    </motion.div></section>

    <section className={styles.pricingSection}>
      <div className={styles.sectionHeading}><span>Simple early-access pricing</span><h2>Start small. Upgrade when your business grows.</h2><p>All prices are in Canadian dollars. No long-term contract during early access.</p></div>
      <div className={styles.planGrid}>{plans.map((plan, index) => <motion.article key={plan.name} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: index * 0.1 }} className={`${styles.planCard} ${plan.featured ? styles.featured : ""}`}>
        {plan.featured ? <span className={styles.badge}>MOST POPULAR</span> : null}
        <div className={styles.planIcon}>{plan.featured ? <Bot size={25} /> : <Workflow size={25} />}</div><h3>{plan.name}</h3><p>{plan.description}</p>
        <div className={styles.price}><small>CAD</small><strong>${plan.price}</strong><span>/month</span></div><span className={styles.trial}>14-day free trial</span>
        <div className={styles.features}>{plan.features.map((feature) => <div key={feature}><Check size={17} /><span>{feature}</span></div>)}</div>
        <Link className={plan.featured ? "primary-button" : "secondary-button"} href="/signup">Start Free Trial <ArrowRight size={17} /></Link>
      </motion.article>)}</div>
    </section>

    <section className={styles.integrationsSection}>
      <div className={styles.sectionHeading}><span>Connected business</span><h2>One inbox for every customer channel.</h2><p>Start with website chat and business email. Meta channels will activate after business verification and integration approval.</p></div>
      <div className={styles.integrationGrid}>{integrations.map(({ name, icon: Icon, status }) => <article key={name}><div><Icon size={22} /><strong>{name}</strong></div><span className={status === "Available" ? styles.available : styles.next}>{status}</span></article>)}</div>
    </section>

    <section className={styles.capabilities}>{[
      [CalendarCheck, "Books appointments", "Keeps availability and customer details organized."],
      [Users, "Captures every lead", "Turns conversations into actionable customer records."],
      [Bot, "Replies with context", "Uses your business information to answer consistently."],
      [ShieldCheck, "Keeps you in control", "Hands conversations to your team whenever needed."],
    ].map(([Icon, title, description]) => { const FeatureIcon = Icon as typeof Bot; return <article key={title as string}><FeatureIcon size={23} /><h3>{title as string}</h3><p>{description as string}</p></article>; })}</section>

    <section className={styles.cta}><span>EARLY ACCESS</span><h2>Put your first AI employee to work.</h2><p>Tell us about your business and we will help configure the right workflow.</p><div className={styles.heroActions}><Link className="primary-button" href="/signup">Start Free Trial <ArrowRight size={18} /></Link><Link className="secondary-button" href="/contact">Talk to Synqo AI</Link></div></section>
  </main>;
}
