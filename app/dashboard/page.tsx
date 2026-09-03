"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, CalendarCheck, Check, Clipboard, FileText, LayoutDashboard, ListTodo, Loader2, LogOut, Mail, Megaphone, Menu, MessageSquareText, Plus, ReceiptText, Send, Settings, Sparkles, Trash2, UserRound, WandSparkles, X } from "lucide-react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import styles from "./dashboard.module.css";

type Tool = "reply" | "email" | "followup" | "appointment" | "summary" | "quote" | "social";
type Tone = "professional" | "friendly" | "concise";
type Task = { id: number; title: string; done: boolean };
const tools: Array<{ id: Tool; label: string; description: string; icon: typeof Bot }> = [
  { id: "reply", label: "Customer Reply", description: "Turn an enquiry into a clear response", icon: MessageSquareText },
  { id: "email", label: "Email Writer", description: "Draft a professional business email", icon: Mail },
  { id: "followup", label: "Lead Follow-up", description: "Move a lead toward the next step", icon: UserRound },
  { id: "appointment", label: "Appointment Message", description: "Confirm or reschedule clearly", icon: CalendarCheck },
  { id: "summary", label: "Smart Summary", description: "Convert rough notes into action points", icon: FileText },
  { id: "quote", label: "Quote Note", description: "Prepare a clean estimate message", icon: ReceiptText },
  { id: "social", label: "Social Caption", description: "Create a business-ready post", icon: Megaphone },
];
const prompts: Record<Tool, { title: string; placeholder: string; action: string }> = {
  reply: { title: "Reply to a customer", placeholder: "Paste the customer message here…", action: "Generate reply" },
  email: { title: "Write a business email", placeholder: "Describe the email, recipient and desired outcome…", action: "Draft email" },
  followup: { title: "Follow up with a lead", placeholder: "Add the lead details and your last conversation…", action: "Create follow-up" },
  appointment: { title: "Prepare an appointment message", placeholder: "Add the customer name, date, time and appointment details…", action: "Create message" },
  summary: { title: "Summarize your notes", placeholder: "Paste meeting notes, customer details or a document excerpt…", action: "Create summary" },
  quote: { title: "Prepare a quote message", placeholder: "Describe the service, price, timing and important conditions…", action: "Create quote note" },
  social: { title: "Write a social caption", placeholder: "Describe your business update, offer or announcement…", action: "Create caption" },
};
function getName(user: User | null) { return user?.displayName?.trim().split(" ")[0] || user?.email?.split("@")[0] || "there"; }
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null), [loading, setLoading] = useState(true), [menuOpen, setMenuOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>("reply"), [input, setInput] = useState(""), [output, setOutput] = useState(""), [aiError, setAiError] = useState(""), [generating, setGenerating] = useState(false), [copied, setCopied] = useState(false);
  const [tone, setTone] = useState<Tone>("professional");
  const [taskText, setTaskText] = useState(""), [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    const saved = window.localStorage.getItem("synqo-tasks"); if (saved) { try { setTasks(JSON.parse(saved)); } catch {} }
    return onAuthStateChanged(auth, (currentUser) => { if (!currentUser) return router.replace("/login"); if (!currentUser.emailVerified) return router.replace("/verify-email"); setUser(currentUser); setLoading(false); });
  }, [router]);
  const name = useMemo(() => getName(user), [user]);
  const saveTasks = (next: Task[]) => { setTasks(next); window.localStorage.setItem("synqo-tasks", JSON.stringify(next)); };
  const addTask = () => { if (!taskText.trim()) return; saveTasks([{ id: Date.now(), title: taskText.trim(), done: false }, ...tasks]); setTaskText(""); };
  const generate = async () => {
    if (!input.trim() || !user) return;
    setGenerating(true); setOutput(""); setAiError("");
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ tool: activeTool, tone, input: input.trim() }),
      });
      const data = (await response.json()) as { output?: string; error?: string };
      if (!response.ok || !data.output) throw new Error(data.error || "AI could not complete this request.");
      setOutput(data.output);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally { setGenerating(false); }
  };
  const logout = async () => { await signOut(auth); router.replace("/login"); };
  if (loading) return <main className={styles.loading}><Loader2 className={styles.spin}/><p>Preparing your AI Employee…</p></main>;
  return <main className={styles.shell}>
    <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.brandRow}><Link className={styles.brand} href="/"><span>S</span>SYNQO <strong>AI</strong></Link><button className={styles.close} onClick={()=>setMenuOpen(false)} aria-label="Close menu"><X/></button></div>
      <div className={styles.employeeBadge}><Bot/><div><strong>AI Employee</strong><span>Ready to work</span></div></div>
      <nav className={styles.nav}><a className={styles.active}><LayoutDashboard/>Workspace</a><a href="#assistant"><WandSparkles/>AI tools</a><a href="#tasks"><ListTodo/>Tasks</a><Link href="/feedback"><MessageSquareText/>Feedback</Link><Link href="/settings"><Settings/>Settings</Link></nav>
      <div className={styles.profile}><div className={styles.avatar}>{name[0]?.toUpperCase()}</div><div><strong>{user?.displayName || name}</strong><span>{user?.email}</span></div><button onClick={logout} aria-label="Sign out"><LogOut/></button></div>
    </aside>
    {menuOpen && <button className={styles.overlay} onClick={()=>setMenuOpen(false)} aria-label="Close menu"/>}
    <section className={styles.content}>
      <header className={styles.topbar}><button className={styles.menu} onClick={()=>setMenuOpen(true)} aria-label="Open menu"><Menu/></button><div><span>Synqo AI Employee</span><h1>Good to see you, {name}</h1></div><div className={styles.live}><i/>AI online</div></header>
      <div className={styles.main}>
        <section className={styles.intro}><div><span className={styles.eyebrow}><Sparkles/>YOUR DIGITAL TEAMMATE</span><h2>What can we get done today?</h2><p>Create customer replies, emails, appointments, quote notes and social content—then organize every next action.</p></div><div className={styles.metrics}><article><strong>{tools.length}</strong><span>AI tools</span></article><article><strong>{tasks.length}</strong><span>Tasks</span></article><article><strong>{tasks.filter(t=>t.done).length}</strong><span>Completed</span></article></div></section>
        <section className={styles.workspace} id="assistant">
          <div className={styles.toolRail}><div className={styles.sectionTitle}><span>AI TOOLS</span><h3>Choose a job</h3></div>{tools.map(({id,label,description,icon:Icon})=><button key={id} className={activeTool===id?styles.toolActive:""} onClick={()=>{setActiveTool(id);setOutput("");setAiError("");}}><span className={styles.toolIcon}><Icon/></span><span><strong>{label}</strong><small>{description}</small></span></button>)}</div>
          <div className={styles.composer}><div className={styles.composerHead}><div><span>AI WORKSPACE</span><h3>{prompts[activeTool].title}</h3></div><Bot/></div><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={prompts[activeTool].placeholder}/><div className={styles.composerActions}><div className={styles.toneControl}><span>Tone</span><select value={tone} onChange={e=>setTone(e.target.value as Tone)} aria-label="Writing tone"><option value="professional">Professional</option><option value="friendly">Friendly</option><option value="concise">Concise</option></select></div><button onClick={generate} disabled={!input.trim()||generating}>{generating?<Loader2 className={styles.spin}/>:<Send/>}{generating?"Working…":prompts[activeTool].action}</button></div>
            <div className={`${styles.result} ${output?styles.resultReady:""} ${aiError?styles.resultError:""}`}>{output?<><div className={styles.resultHead}><span><Sparkles/>Synqo AI result</span><button onClick={()=>{navigator.clipboard.writeText(output);setCopied(true);window.setTimeout(()=>setCopied(false),1500);}}>{copied?<Check/>:<Clipboard/>}{copied?"Copied":"Copy"}</button></div><pre>{output}</pre></>:aiError?<div className={styles.errorResult}><Bot/><strong>Couldn’t generate this draft</strong><span>{aiError}</span><button onClick={generate}>Try again</button></div>:<div className={styles.emptyResult}><Bot/><strong>Your AI result will appear here</strong><span>Add the details above and let your AI Employee prepare a custom first draft.</span></div>}</div>
          </div>
        </section>
        <section className={styles.tasks} id="tasks"><div className={styles.sectionTitle}><span>NEXT ACTIONS</span><h3>Business task list</h3></div><div className={styles.taskInput}><input value={taskText} onChange={e=>setTaskText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTask()} placeholder="Add a follow-up or business task…"/><button onClick={addTask}><Plus/>Add task</button></div><div className={styles.taskList}>{tasks.length===0?<p className={styles.noTasks}>No tasks yet. Add your first next action above.</p>:tasks.map(task=><article key={task.id} className={task.done?styles.taskDone:""}><button className={styles.check} onClick={()=>saveTasks(tasks.map(item=>item.id===task.id?{...item,done:!item.done}:item))}>{task.done&&<Check/>}</button><span>{task.title}</span><button className={styles.delete} onClick={()=>saveTasks(tasks.filter(item=>item.id!==task.id))} aria-label="Delete task"><Trash2/></button></article>)}</div></section>
      </div>
    </section>
  </main>;
}
