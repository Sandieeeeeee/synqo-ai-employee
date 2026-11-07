"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BrainCircuit, Bot, Code2, GraduationCap, Layers3, ShieldCheck, Sparkles, Video, Workflow } from "lucide-react";
import InteractiveBackground from "@/components/InteractiveBackground";

const modules = [
  { name: "Synqo Brain", icon: BrainCircuit, detail: "One workspace for AI conversations, model selection and answer comparisons.", status: "In development" },
  { name: "AI Employee", icon: Bot, detail: "Customer enquiries, leads, appointments and follow-ups for growing businesses.", status: "Early access" },
  { name: "AI Studio", icon: Video, detail: "Plan content, draft scripts and create assets with connected creative tools.", status: "Planned" },
  { name: "AI Developer", icon: Code2, detail: "Coding, debugging and website-building assistance.", status: "Planned" },
  { name: "AI Automate", icon: Workflow, detail: "Approval-first workflows across connected business applications.", status: "Planned" },
  { name: "AI Academy", icon: GraduationCap, detail: "Practical AI learning with multilingual guidance.", status: "Planned" },
];

export default function AIHubPage() {
  const [question, setQuestion] = useState("");
  return <main className="products-page min-h-screen overflow-hidden text-white">
    <InteractiveBackground />
    <nav className="inner-navbar"><Link href="/" className="brand"><span className="brand-mark">S</span><span className="brand-text">SYNQO <strong>AI</strong></span></Link><Link href="/" className="inner-back-link">Home <ArrowRight size={16}/></Link></nav>
    <section className="relative mx-auto max-w-7xl px-5 pb-24 pt-24 sm:px-8 lg:px-10">
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-semibold tracking-widest text-cyan-200"><Sparkles size={15}/> INTRODUCING SYNQO AI 3.0 · PRODUCT ROADMAP</div>
        <h1 className="mt-8 text-5xl font-semibold leading-[1.07] tracking-[-.055em] sm:text-7xl">One platform.<br/><span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">Multiple AI minds.</span><br/>Real work done.</h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">We are building a connected AI workspace for conversations, business operations, content creation and automation. Start with Synqo's existing tools while the next generation takes shape.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/signup" className="primary-button">Join early access <ArrowRight size={18}/></Link><Link href="/products" className="secondary-button">Explore current products</Link></div>
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-400"><ShieldCheck size={16} className="text-cyan-300"/> New multi-model features are in development, not yet live.</div>
      </div>
      <section className="mt-20 rounded-[28px] border border-blue-300/15 bg-[#06101f]/85 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-300">Synqo Brain</div><h2 className="mt-2 text-2xl font-semibold">Your future AI command center</h2></div><span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-200">Preview · Not a live chat</span></div>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">{["Ask AI","Compare models","Turn answers into action"].map((x,i)=><div key={x} className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><div className="text-sm text-cyan-300">0{i+1}</div><div className="mt-3 font-semibold">{x}</div><p className="mt-2 text-sm leading-6 text-slate-400">{["Write a question once in your workspace.","Review different perspectives when supported model APIs are connected.","Move from ideas to approved business workflows."][i]}</p></div>)}</div>
        <form onSubmit={e=>{e.preventDefault();if(question.trim())window.location.href="/signup";}} className="mt-6 flex flex-col gap-3 sm:flex-row"><input aria-label="Example question" value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What would you like AI to help you accomplish?" className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#091526] px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"/><button type="submit" className="rounded-xl bg-blue-600 px-6 py-4 font-semibold hover:bg-blue-500">Join to explore <ArrowRight size={17} className="ml-2 inline"/></button></form>
      </section>
      <section className="mt-24"><div className="flex items-center gap-3 text-cyan-300"><Layers3 size={20}/><span className="text-xs font-semibold uppercase tracking-[.2em]">The Synqo ecosystem</span></div><h2 className="mt-4 text-4xl font-semibold tracking-tight">One connected workspace. Six powerful directions.</h2><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{modules.map(({name,icon:Icon,detail,status})=><article key={name} className="rounded-3xl border border-blue-300/15 bg-[#071425]/85 p-7 transition hover:-translate-y-1 hover:border-cyan-300/40"><div className="flex items-center justify-between"><div className="rounded-xl bg-blue-500/15 p-3 text-cyan-300"><Icon size={25}/></div><span className="text-xs text-slate-400">{status}</span></div><h3 className="mt-6 text-xl font-semibold">{name}</h3><p className="mt-3 text-sm leading-7 text-slate-300">{detail}</p></article>)}</div></section>
      <section className="mt-24 rounded-3xl border border-violet-400/20 bg-gradient-to-r from-blue-500/10 to-violet-500/10 p-8 sm:p-12"><h2 className="text-3xl font-semibold">Don't just ask AI. Get work done.</h2><p className="mt-4 max-w-2xl leading-7 text-slate-300">Synqo AI Employee is our practical starting point. Explore the tools already available and help shape the future of Synqo.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/products" className="primary-button">Explore AI Employee <ArrowRight size={18}/></Link><Link href="/contact" className="secondary-button">Talk to Synqo</Link></div></section>
    </section>
  </main>;
}
