import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BrainCircuit, Network, Rocket, Sparkles } from "lucide-react";

import InteractiveBackground from "@/components/InteractiveBackground";
import NeuralCore3D from "@/components/NeuralCore3D";
import styles from "../insightPages.module.css";

export const metadata: Metadata = {
  title: "Our Vision — Smart Synchronization Powered by AI",
  description: "Synqo AI's vision is to make practical AI simple, affordable and accessible, helping small businesses automate repetitive work and grow with confidence.",
  alternates: { canonical: "/vision" },
};

const pillars = [
  { icon: Network, title: "Connect", text: "Bring customer conversations, leads, appointments and follow-ups into one intelligent system." },
  { icon: BrainCircuit, title: "Understand", text: "Use practical AI to understand everyday business needs and turn information into useful action." },
  { icon: Rocket, title: "Grow", text: "Give small teams more time, faster response and organized operations without enterprise-level complexity." },
];

export default function VisionPage() {
  return <main className={styles.page}>
    <InteractiveBackground />
    <nav className="inner-navbar"><Link href="/" className="brand"><span className="brand-mark">S</span><span className="brand-text">SYNQO <strong>AI</strong></span></Link><Link href="/" className="inner-back-link"><ArrowLeft size={16}/>Home</Link></nav>
    <section className={styles.shell}>
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className="section-label">SMART SYNCHRONIZATION POWERED BY AI</span>
          <h1>Simple. Smart.<br/><span>Connected.</span></h1>
          <p>Synqo means bringing everything together intelligently. We are building AI employees that help millions of small businesses save time, automate repetitive work and grow with confidence.</p>
          <div className="hero-actions"><Link className="primary-button" href="/products">Explore AI Employee<ArrowRight size={18}/></Link><Link className="secondary-button" href="/how-it-works">How it works</Link></div>
        </div>
        <div className={styles.visual}><NeuralCore3D /></div>
      </div>

      <section className={styles.statement}>
        <span>OUR VISION</span>
        <h2>Make practical AI simple, affordable and accessible for every small business.</h2>
        <p>Powerful technology should feel useful from day one—not complicated, disconnected or built only for large companies.</p>
      </section>

      <section className={styles.cards}>
        {pillars.map(({icon: Icon,title,text}, index) => <article className={styles.card} key={title}><span className={styles.number}>0{index+1}</span><Icon size={28}/><h3>{title}</h3><p>{text}</p></article>)}
      </section>

      <section className={styles.quote}>
        <Sparkles size={26}/><blockquote>“Build useful technology. Keep it simple. Improve it with real people.”</blockquote><p>Sandeep Sharma · Founder &amp; Director, Synqo AI</p>
      </section>
    </section>
  </main>;
}
