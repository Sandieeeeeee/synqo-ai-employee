"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bot, Building2, Globe2, Lightbulb, ShieldCheck, Target, Workflow } from "lucide-react";
import InteractiveBackground from "@/components/InteractiveBackground";

const principles = [
  { icon: Target, title: "Solve Real Business Problems", description: "We focus on practical business pain points instead of adding AI where it does not create meaningful value." },
  { icon: Workflow, title: "Reduce Repetitive Work", description: "Our products and services automate routine work so teams can focus on customers, decisions and growth." },
  { icon: ShieldCheck, title: "Keep Businesses in Control", description: "AI should support people, not remove visibility. Businesses should understand and control how their systems operate." },
];

export default function AboutPage() {
  return <main className="products-page">
    <InteractiveBackground />
    <nav className="inner-navbar"><Link href="/" className="brand"><span className="brand-mark">S</span><span className="brand-text">SYNQO <strong>AI</strong></span></Link><Link href="/" className="inner-back-link"><ArrowLeft size={16}/>Home</Link></nav>
    <section className="products-page-hero">
      <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:.65}} className="products-page-heading">
        <span className="section-label">ABOUT SYNQO AI</span><h1>Building practical AI<br/><span>for modern businesses.</span></h1>
        <p>Synqo AI is a technology company focused on intelligent software and automation that helps businesses reduce repetitive work and operate more efficiently.</p>
        <div className="hero-actions"><Link className="primary-button" href="/dashboard">Open AI Employee<ArrowRight size={18}/></Link><Link className="secondary-button" href="/contact">Work With Synqo AI</Link></div>
      </motion.div>

      <motion.section initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.12}} className="founder-panel">
        <div className="founder-photo"><img src="/team/sandeep-sharma-founder.png" alt="Sandeep Sharma, Founder and Director of Synqo AI" width="1254" height="1254" loading="eager"/></div>
        <div className="founder-copy"><span className="section-label">FOUNDER</span><h2>Sandeep Sharma</h2><strong>Founder &amp; Director, Synqo AI</strong><p>Building Synqo AI across Canada and India with one clear goal: make powerful AI practical, affordable and useful for everyday business operations.</p><blockquote>“Technology should save people time, simplify work and help businesses grow with confidence.”</blockquote><div className="founder-tags"><span>Canada × India</span><span>AI Software</span><span>Business Automation</span></div></div>
      </motion.section>

      <section style={{paddingTop:"100px"}}><div className="section-heading"><div><span className="section-label">WHAT WE ARE BUILDING</span><h2>Products first. Services where businesses need custom solutions.</h2></div><p>Synqo AI combines its own software products with implementation services for businesses that need tailored automation or custom systems.</p></div><div className="feature-grid">
        <article className="feature-card"><span className="feature-number">01</span><div className="feature-icon"><Bot size={25}/></div><h3>Synqo AI Employee</h3><p>Our flagship AI product for customer enquiries, leads, appointments, follow-ups and everyday business workflows.</p><Link href="/dashboard">Open product<ArrowRight size={16}/></Link></article>
        <article className="feature-card"><span className="feature-number">02</span><div className="feature-icon"><Lightbulb size={25}/></div><h3>AI &amp; Automation Services</h3><p>Custom AI automation, business systems and software for organizations with specific operational needs.</p><Link href="/services">Explore services<ArrowRight size={16}/></Link></article>
        <article className="feature-card"><span className="feature-number">03</span><div className="feature-icon"><Globe2 size={25}/></div><h3>Global Business Focus</h3><p>Synqo AI is being built to serve modern businesses with scalable technology and practical implementation.</p><Link href="/contact">Contact us<ArrowRight size={16}/></Link></article>
      </div></section>

      <section style={{paddingTop:"110px"}}><div className="section-heading"><div><span className="section-label">HOW WE THINK</span><h2>Simple principles behind every Synqo AI system.</h2></div><p>The outcome should be simple: less repetitive work, better customer experience and more organized business operations.</p></div><div className="feature-grid">{principles.map((item,index)=>{const Icon=item.icon;return <article key={item.title} className="feature-card"><span className="feature-number">{String(index+1).padStart(2,"0")}</span><div className="feature-icon"><Icon size={25}/></div><h3>{item.title}</h3><p>{item.description}</p></article>})}</div></section>

      <motion.section initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="product-panel" style={{marginTop:"110px"}}><div className="product-copy"><span className="section-label">COMPANY DIRECTION</span><h2>Software company at the core.</h2><p>Synqo AI is being developed as a long-term AI software company. Our products remain the core focus, while services help us solve real business problems and learn from real workflows.</p><Link className="primary-button" href="/dashboard">Try Synqo AI Employee<ArrowRight size={18}/></Link></div><div className="product-list">{[["01","AI Software Products",Bot],["02","Business Automation",Workflow],["03","Custom AI Implementation",Lightbulb],["04","Scalable Business Systems",Building2]].map(([number,title,Icon]:any)=><div key={number} className="product-item premium-product-item"><span>{number}</span><strong>{title}</strong><Icon size={17}/></div>)}</div></motion.section>
    </section>
  </main>;
}
