"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, Check, Clipboard, FileText, LayoutDashboard, ListTodo, Loader2, LogOut, Mail, Menu, MessageSquareText, Plus, Send, Settings, Sparkles, Trash2, UserRound, WandSparkles, X } from "lucide-react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import styles from "./dashboard.module.css";

type Tool = "reply" | "email" | "followup" | "summary";
type Task = { id: number; title: string; done: boolean };
const tools: Array<{ id: Tool; label: string; description: string; icon: typeof Bot }> = [
  { id: "reply", label: "Customer Reply", description: "Turn an enquiry into a clear response", icon: MessageSquareText },
  { id: "email", label: "Email Writer", description: "Draft a professional business email", icon: Mail },
  { id: "followup", label: "Lead Follow-up", description: "Move a lead toward the next step", icon: UserRound },
  { id: "summary", label: "Smart Summary", description: "Convert rough notes into action points", icon: FileText },
];
const prompts: Record<Tool, { title: string; placeholder: string; action: string }> = {
  reply: { title: "Reply to a customer", placeholder: "Paste the customer message here…", action: "Generate reply" },
  email: { title: "Write a business email", placeholder: "Describe the email, recipient and desired outcome…", action: "Draft email" },
  followup: { title: "Follow up with a lead", placeholder: "Add the lead details and your last conversation…", action: "Create follow-up" },
  summary: { title: "Summarize your notes", placeholder: "Paste meeting notes, customer details or a document excerpt…", action: "Create summary" },
};
function getName(user: User | null) { return user?.displayName?.trim().split(" ")[0] || user?.email?.split("@")[0] || "there"; }
function createOutput(tool: Tool, input: string) {
  const clean = input.trim();
  if (tool === "reply") return `Hi,\n\nThank you for reaching out. I understand you’re contacting us about ${clean}. We’d be happy to help. Please share any remaining details or your preferred time to connect, and we’ll take care of the next step.\n\nBest regards,\nYour team`;
  if (tool === "email") return `Subject: Following up on your request\n\nHi,\n\nI’m reaching out regarding ${clean}. We’ve reviewed the details and would be glad to help you move forward. Please let me know a convenient time to discuss the next steps.\n\nBest regards,\nYour team`;
  if (tool === "followup") return `Hi, just following up regarding ${clean}. I wanted to check whether you had any questions and see if you’d like to move ahead. I’m happy to help with the next step whenever you’re ready.`;
  return `Summary\n\n${clean}\n\nRecommended next actions:\n• Confirm the key requirement\n• Assign an owner and deadline\n• Send a clear follow-up\n• Record the outcome in the workspace`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null), [loading, setLoading] = useState(true), [menuOpen, setMenuOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>("reply"), [input, setInput] = useState(""), [output, setOutput] = useState(""), [generating, setGenerating] = useState(false), [copied, setCopied] = useState(false);
  const [taskText, setTaskText] = useState(""), [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    const saved = window.localStorage.getItem("synqo-tasks"); if (saved) { try { setTasks(JSON.parse(saved)); } catch {} }
    return onAuthStateChanged(auth, (currentUser) => { if (!currentUser) return router.replace("/login"); if (!currentUser.emailVerified) return router.replace("/verify-email"); setUser(currentUser); setLoading(false); });
  }, [router]);
  const name = useMemo(() => getName(user), [user]);
  const saveTasks = (next: Task[]) => { setTasks(next); window.localStorage.setItem("synqo-tasks", JSON.stringify(next)); };
  const addTask = () => { if (!taskText.trim()) return; saveTasks([{ id: Date.now(), title: taskText.trim(), done: false }, ...tasks]); setTaskText(""); };
  const generate = () => { if (!input.trim()) return; setGenerating(true); setOutput(""); window.setTimeout(() => { setOutput(createOutput(activeTool, input)); setGenerating(false); }, 650); };
  const logout = async () => { await signOut(auth); router.replace("/login"); };
  if (loading) return <main className={styles.loading}><Loader2 className={styles.spin}/><p>Preparing your AI Employee…</p></main>;
  return <main className={styles.shell}>
    <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.brandRow}><Link className={styles.brand} href="/"><span>S</span>SYNQO <strong>AI</strong></Link><button className={styles.close} onClick={()=>setMenuOpen(false)} aria-label="Close menu"><X/></button></div>
      <div className={styles.employeeBadge}><Bot/><div><strong>AI Employee</strong><span>Ready to work</span></div></div>
      <nav className={styles.nav}><a className={styles.active}><LayoutDashboard/>Workspace</a><a href="#assistant"><WandSparkles/>AI tools</a><a href="#tasks"><ListTodo/>Tasks</a><Link href="/settings"><Settings/>Settings</Link></nav>
      <div className={styles.profile}><div className={styles.avatar}>{name[0]?.toUpperCase()}</div><div><strong>{user?.displayName || name}</strong><span>{user?.email}</span></div><button onClick={logout} aria-label="Sign out"><LogOut/></button></div>
    </aside>
    {menuOpen && <button className={styles.overlay} onClick={()=>setMenuOpen(false)} aria-label="Close menu"/>}
    <section className={styles.content}>
      <header className={styles.topbar}><button className={styles.menu} onClick={()=>setMenuOpen(true)} aria-label="Open menu"><Menu/></button><div><span>Synqo AI Employee</span><h1>Good to see you, {name}</h1></div><div className={styles.live}><i/>MVP live</div></header>
      <div className={styles.main}>
        <section className={styles.intro}><div><span className={styles.eyebrow}><Sparkles/>YOUR DIGITAL TEAMMATE</span><h2>What can we get done today?</h2><p>Create customer replies, emails and follow-ups, then keep every next action organized.</p></div><div className={styles.metrics}><article><strong>4</strong><span>AI tools</span></article><article><strong>{tasks.length}</strong><span>Tasks</span></article><article><strong>{tasks.filter(t=>t.done).length}</strong><span>Completed</span></article></div></section>
        <section className={styles.workspace} id="assistant">
          <div className={styles.toolRail}><div className={styles.sectionTitle}><span>AI TOOLS</span><h3>Choose a job</h3></div>{tools.map(({id,label,description,icon:Icon})=><button key={id} className={activeTool===id?styles.toolActive:""} onClick={()=>{setActiveTool(id);setOutput("");}}><span className={styles.toolIcon}><Icon/></span><span><strong>{label}</strong><small>{description}</small></span></button>)}</div>
          <div className={styles.composer}><div className={styles.composerHead}><div><span>AI WORKSPACE</span><h3>{prompts[activeTool].title}</h3></div><Bot/></div><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={prompts[activeTool].placeholder}/><div className={styles.composerActions}><span>{input.length} characters</span><button onClick={generate} disabled={!input.trim()||generating}>{generating?<Loader2 className={styles.spin}/>:<Send/>}{generating?"Working…":prompts[activeTool].action}</button></div>
            <div className={`${styles.result} ${output?styles.resultReady:""}`}>{output?<><div className={styles.resultHead}><span><Sparkles/>Synqo result</span><button onClick={()=>{navigator.clipboard.writeText(output);setCopied(true);window.setTimeout(()=>setCopied(false),1500);}}>{copied?<Check/>:<Clipboard/>}{copied?"Copied":"Copy"}</button></div><pre>{output}</pre></>:<div className={styles.emptyResult}><Bot/><strong>Your result will appear here</strong><span>Add the details above and let your AI Employee prepare the first draft.</span></div>}</div>
          </div>
        </section>
        <section className={styles.tasks} id="tasks"><div className={styles.sectionTitle}><span>NEXT ACTIONS</span><h3>Business task list</h3></div><div className={styles.taskInput}><input value={taskText} onChange={e=>setTaskText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTask()} placeholder="Add a follow-up or business task…"/><button onClick={addTask}><Plus/>Add task</button></div><div className={styles.taskList}>{tasks.length===0?<p className={styles.noTasks}>No tasks yet. Add your first next action above.</p>:tasks.map(task=><article key={task.id} className={task.done?styles.taskDone:""}><button className={styles.check} onClick={()=>saveTasks(tasks.map(item=>item.id===task.id?{...item,done:!item.done}:item))}>{task.done&&<Check/>}</button><span>{task.title}</span><button className={styles.delete} onClick={()=>saveTasks(tasks.filter(item=>item.id!==task.id))} aria-label="Delete task"><Trash2/></button></article>)}</div></section>
      </div>
    </section>
  </main>;
}
