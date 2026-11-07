"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { onAuthStateChanged,type User } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { ArrowLeft, BrainCircuit, Loader2, Send, Trash2 } from "lucide-react";
type Message={role:"user"|"assistant";content:string};
export default function SynqoChat(){
 const [user,setUser]=useState<User|null>(null),[loadingAuth,setLoadingAuth]=useState(true);
 const [messages,setMessages]=useState<Message[]>([]),[input,setInput]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState("");
 useEffect(()=>onAuthStateChanged(auth,u=>{setUser(u);setLoadingAuth(false)}),[]);
 async function send(e:React.FormEvent){e.preventDefault();if(!user||busy||!input.trim())return;
 const next=[...messages,{role:"user" as const,content:input.trim()}].slice(-12);setMessages(next);setInput("");setBusy(true);setError("");
 try{const token=await user.getIdToken();const r=await fetch("/api/brain/chat",{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+token},body:JSON.stringify({model:"synqo-default",messages:next})});const data=await r.json();if(!r.ok)throw Error(data.error||"Request failed");setMessages([...next,{role:"assistant",content:data.answer}]);}
 catch(err){setError(err instanceof Error?err.message:"Something went wrong");}finally{setBusy(false);}
 }
 return <main className="min-h-screen bg-[#050b17] px-4 py-8 text-white"><div className="mx-auto max-w-4xl">
 <div className="mb-8 flex items-center justify-between"><Link href="/ai-hub" className="flex items-center gap-2 text-sm text-cyan-300"><ArrowLeft size={16}/> AI Hub</Link><span className="rounded-full border border-cyan-500/30 px-3 py-2 text-xs text-cyan-200">Synqo Brain · Beta</span></div>
 <div className="mb-6 flex items-center gap-3"><BrainCircuit className="text-cyan-300" size={32}/><div><h1 className="text-3xl font-semibold">Synqo Brain</h1><p className="text-sm text-slate-400">Single-model beta chat · Conversations are not saved</p></div></div>
 {loadingAuth?<p>Checking your account…</p>:!user?<div className="rounded-2xl border border-white/10 bg-white/5 p-8"><p>Sign in to use Synqo Brain.</p><Link className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3" href="/login">Sign in</Link></div>:!user.emailVerified?<p>Please verify your email before using Synqo Brain.</p>:<>
 <div aria-live="polite" className="mb-4 min-h-[380px] space-y-4 rounded-2xl border border-white/10 bg-[#091426] p-5">{messages.length===0?<p className="text-slate-400">Ask a question to start. Synqo currently uses one configured AI model; multi-model comparison is coming later.</p>:messages.map((m,i)=><div key={i} className={m.role==="user"?"ml-auto max-w-[85%] rounded-2xl bg-blue-600/30 p-4":"mr-auto max-w-[90%] whitespace-pre-wrap rounded-2xl bg-white/10 p-4"}><div className="mb-2 text-xs font-semibold text-cyan-300">{m.role==="user"?"You":"Synqo Brain"}</div>{m.content}</div>)}{busy&&<div className="flex items-center gap-2 text-slate-300"><Loader2 size={17} className="animate-spin"/> Thinking…</div>}</div>
 {error&&<p role="alert" className="mb-3 text-rose-300">{error}</p>}
 <form onSubmit={send} className="flex gap-2"><textarea aria-label="Your message" value={input} maxLength={3000} rows={2} onChange={e=>setInput(e.target.value)} placeholder="Ask Synqo anything…" className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#101d32] p-4 outline-none focus:border-cyan-400"/><button disabled={busy||!input.trim()} className="rounded-xl bg-blue-600 px-5 disabled:opacity-50" aria-label="Send message"><Send size={20}/></button></form>
 <button onClick={()=>{setMessages([]);setError("")}} className="mt-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white"><Trash2 size={15}/> Clear this chat</button>
 <p className="mt-5 text-xs text-slate-500">Beta: Do not enter sensitive personal or business information. Provider usage and access are subject to configuration and limits.</p>
 </>}
 </div></main>
}
