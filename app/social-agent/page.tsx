"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  Instagram,
  MessageCircle,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import InteractiveBackground from "@/components/InteractiveBackground";

const features = [
  { icon: MessagesSquare, title: "AI Comment Replies", text: "Turn incoming comments into fast, natural replies that match your brand voice." },
  { icon: MessageCircle, title: "DM Assistance", text: "Keep conversations moving with AI-assisted responses for common customer questions." },
  { icon: WandSparkles, title: "Your Brand Tone", text: "Choose friendly, professional, casual or a custom tone for every conversation." },
  { icon: ShieldCheck, title: "Human Control", text: "Keep sensitive, negative or important conversations pending for manual approval." },
  { icon: BarChart3, title: "Community Analytics", text: "See replies, pending conversations and engagement activity from one dashboard." },
  { icon: Bot, title: "Smart Automation", text: "Automate the repetitive replies while you stay focused on your content and business." },
];

const sampleComments = [
  ["Neha Verma", "Loved this! ❤️", "AI replied"],
  ["Rohit Singh", "Do you offer Canada PR consultancy?", "Pending"],
  ["Simran Kaur", "Which city is best for students?", "AI replied"],
];

export default function SocialAgentPage() {
  return (
    <main className="products-page min-h-screen overflow-hidden">
      <InteractiveBackground />
      <nav className="inner-navbar">
        <Link href="/" className="brand"><span className="brand-mark">S</span><span className="brand-text">SYNQO <strong>AI</strong></span></Link>
        <Link href="/products" className="inner-back-link"><ArrowLeft size={16} /> Products</Link>
      </nav>

      <section className="mx-auto w-full max-w-7xl px-5 pb-24 pt-24 sm:px-8 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <span className="section-label">SYNQO SOCIAL AGENT · FREE BETA</span>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">Your AI Community Manager.<br/><span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">Built for conversations.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">Connect Instagram and Facebook, let AI help reply to comments and DMs in your voice, and keep every conversation under your control.</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-violet-400/25 bg-violet-500/10 px-5 py-4 shadow-[0_0_45px_rgba(139,92,246,.12)]"><div className="text-sm font-semibold text-violet-200">5 Community Messages Free</div><div className="mt-1 text-xs text-slate-400">No credit card required</div></div>
              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-5 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-100"><Instagram size={16} /> Instagram</div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400"><span className="grid h-4 w-4 place-items-center rounded bg-blue-500 text-[9px] font-bold text-white">f</span> Facebook</div>
              </div>
            </div>

            <div className="hero-actions mt-8"><Link className="primary-button" href="/signup">Start Free <ArrowRight size={18} /></Link><a className="secondary-button" href="#preview">See Dashboard</a></div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">{["Connect in minutes", "AI replies in your tone", "Approval mode included"].map((item)=><span key={item} className="flex items-center gap-2"><Check size={15} className="text-cyan-300" /> {item}</span>)}</div>
          </motion.div>

          <motion.div id="preview" initial={{ opacity: 0, scale: 0.96, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }} className="relative">
            <div className="absolute -inset-12 -z-10 rounded-full bg-violet-500/10 blur-[90px]" />
            <div className="rounded-[28px] border border-blue-300/15 bg-[#06101f]/85 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-5"><div><div className="text-xs uppercase tracking-[0.22em] text-blue-300">Social Agent</div><div className="mt-2 text-2xl font-semibold text-white">Good evening, Sandeep 👋</div></div><div className="rounded-xl border border-violet-400/20 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-200">5 / 5 Free</div></div>
              <div className="grid grid-cols-2 gap-3 py-5 sm:grid-cols-4">{[["48","Comments"],["12","DMs"],["41","AI Replies"],["96%","Positive"]].map(([value,label])=><div key={label} className="rounded-2xl border border-white/5 bg-white/[0.035] p-4"><div className="text-2xl font-semibold text-white">{value}</div><div className="mt-1 text-xs text-slate-400">{label}</div></div>)}</div>
              <div className="rounded-2xl border border-white/5 bg-black/10 p-3"><div className="mb-3 flex items-center justify-between px-2"><span className="text-sm font-semibold text-white">Recent community</span><Sparkles size={16} className="text-violet-300" /></div>{sampleComments.map(([name,comment,status])=><div key={name} className="mb-2 flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.025] px-4 py-3 last:mb-0"><div className="min-w-0"><div className="text-sm font-semibold text-slate-100">{name}</div><div className="truncate text-xs text-slate-400">{comment}</div></div><span className={status === "AI replied" ? "rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300" : "rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-300"}>{status}</span></div>)}</div>
              <div className="mt-4 rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-5"><div className="flex items-center gap-2 text-sm font-semibold text-violet-200"><Sparkles size={16} /> AI Suggested Reply</div><p className="mt-3 text-sm leading-6 text-slate-300">Thanks for reaching out! Send us a DM and we’ll help you with the details 😊</p><div className="mt-4 flex gap-2"><span className="rounded-lg bg-violet-500 px-3 py-2 text-xs font-semibold text-white">Post Reply</span><span className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300">Edit</span></div></div>
            </div>
          </motion.div>
        </div>

        <section className="pt-28"><div className="section-heading"><div><span className="section-label">BUILT FOR YOUR COMMUNITY</span><h2>One place for comments, DMs and AI replies.</h2></div><p>Start small with five free community messages, test the experience, then scale when your audience grows.</p></div><div className="products-page-grid mt-12">{features.map((feature,index)=>{const Icon=feature.icon;return <motion.article key={feature.title} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.5,delay:index*.07}} whileHover={{y:-7}} className="product-detail-card"><div className="product-detail-icon"><Icon size={24}/></div><h2 className="mt-5">{feature.title}</h2><p>{feature.text}</p></motion.article>})}</div></section>

        <motion.section initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="cta-section mt-28 !w-full"><div className="cta-glow"/><span className="section-label">FREE BETA</span><h2>Try your first 5 community messages free.</h2><p>No credit card. Connect your social accounts, choose your tone and see how Synqo Social Agent can help manage your community.</p><div className="hero-actions"><Link className="primary-button" href="/signup">Get Started Free <ArrowRight size={18}/></Link><Link className="secondary-button" href="/contact">Contact Synqo AI</Link></div></motion.section>
      </section>
    </main>
  );
}
