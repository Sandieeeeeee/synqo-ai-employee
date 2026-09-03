"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, CalendarCheck, Check, ChevronRight, Clipboard, Cloud, FileText, Inbox, LayoutDashboard, ListTodo, Loader2, LogOut, Mail, Megaphone, Menu, MessageSquareText, Plus, ReceiptText, Save, Send, Settings, Sparkles, Trash2, UserRound, UsersRound, WandSparkles, X } from "lucide-react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import styles from "./dashboard.module.css";

type View = "overview" | "assistant" | "inbox" | "leads" | "appointments" | "tasks";
type Tool = "reply" | "email" | "followup" | "appointment" | "summary" | "quote" | "social";
type Tone = "professional" | "friendly" | "concise";
type LeadStatus = "New" | "Contacted" | "Qualified" | "Won";
type Lead = { id: number; name: string; contact: string; need: string; status: LeadStatus; createdAt: string };
type Appointment = { id: number; customer: string; date: string; time: string; note: string; status: "Upcoming" | "Completed" };
type Task = { id: number; title: string; due: string; done: boolean };
type CustomerMessage = { id: number; customer: string; message: string; receivedAt: string; replied: boolean };
type WorkspaceData = { leads: Lead[]; appointments: Appointment[]; tasks: Task[]; messages: CustomerMessage[] };

const emptyWorkspace: WorkspaceData = { leads: [], appointments: [], tasks: [], messages: [] };
const tools: Array<{ id: Tool; label: string; description: string; icon: typeof Bot }> = [
  { id: "reply", label: "Customer Reply", description: "Answer an enquiry clearly", icon: MessageSquareText },
  { id: "email", label: "Email Writer", description: "Draft a professional email", icon: Mail },
  { id: "followup", label: "Lead Follow-up", description: "Move a lead forward", icon: UserRound },
  { id: "appointment", label: "Appointment", description: "Confirm or reschedule", icon: CalendarCheck },
  { id: "summary", label: "Smart Summary", description: "Turn notes into actions", icon: FileText },
  { id: "quote", label: "Quote Note", description: "Prepare an estimate message", icon: ReceiptText },
  { id: "social", label: "Social Caption", description: "Create a business post", icon: Megaphone },
];
const prompts: Record<Tool, { title: string; placeholder: string; action: string }> = {
  reply: { title: "Reply to a customer", placeholder: "Paste the customer message here…", action: "Generate reply" },
  email: { title: "Write a business email", placeholder: "Describe the recipient, context and desired outcome…", action: "Draft email" },
  followup: { title: "Follow up with a lead", placeholder: "Add the lead details and your last conversation…", action: "Create follow-up" },
  appointment: { title: "Prepare an appointment message", placeholder: "Add the customer name, date, time and details…", action: "Create message" },
  summary: { title: "Summarize your notes", placeholder: "Paste meeting notes or customer details…", action: "Create summary" },
  quote: { title: "Prepare a quote message", placeholder: "Describe the service, price, timing and conditions…", action: "Create quote" },
  social: { title: "Write a social caption", placeholder: "Describe your update, offer or announcement…", action: "Create caption" },
};
const viewLabels: Record<View, string> = { overview: "Command centre", assistant: "AI tools", inbox: "Customer inbox", leads: "Leads & CRM", appointments: "Appointments", tasks: "Tasks" };
function getName(user: User | null) { return user?.displayName?.trim().split(" ")[0] || user?.email?.split("@")[0] || "there"; }
function today() { return new Date().toISOString().slice(0, 10); }
function workspaceKey(uid: string) { return `synqo-workspace-${uid}`; }
function validWorkspace(value: unknown): value is WorkspaceData { if (!value || typeof value !== "object") return false; const item = value as Partial<WorkspaceData>; return Array.isArray(item.leads) && Array.isArray(item.appointments) && Array.isArray(item.tasks) && Array.isArray(item.messages); }

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null), [loading, setLoading] = useState(true), [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState<View>("overview"), [workspace, setWorkspace] = useState<WorkspaceData>(emptyWorkspace), [saveState, setSaveState] = useState<"loading" | "cloud" | "device">("loading");
  const [activeTool, setActiveTool] = useState<Tool>("reply"), [tone, setTone] = useState<Tone>("professional");
  const [input, setInput] = useState(""), [output, setOutput] = useState(""), [aiError, setAiError] = useState(""), [generating, setGenerating] = useState(false), [copied, setCopied] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", contact: "", need: "" });
  const [appointmentForm, setAppointmentForm] = useState({ customer: "", date: today(), time: "10:00", note: "" });
  const [taskForm, setTaskForm] = useState({ title: "", due: today() });
  const [messageForm, setMessageForm] = useState({ customer: "", message: "" });

  useEffect(() => onAuthStateChanged(auth, async currentUser => {
    if (!currentUser) return router.replace("/login");
    if (!currentUser.emailVerified) return router.replace("/verify-email");
    setUser(currentUser);
    const local = window.localStorage.getItem(workspaceKey(currentUser.uid));
    if (local) { try { const parsed = JSON.parse(local); if (validWorkspace(parsed)) setWorkspace(parsed); } catch {} }
    try {
      const snapshot = await getDoc(doc(db, "users", currentUser.uid));
      const remote = snapshot.data()?.workspace;
      if (validWorkspace(remote)) { setWorkspace(remote); window.localStorage.setItem(workspaceKey(currentUser.uid), JSON.stringify(remote)); }
      setSaveState("cloud");
    } catch { setSaveState("device"); }
    setLoading(false);
  }), [router]);

  const name = useMemo(() => getName(user), [user]);
  const openTasks = workspace.tasks.filter(task => !task.done).length;
  const activeLeads = workspace.leads.filter(lead => lead.status !== "Won").length;
  const upcoming = workspace.appointments.filter(item => item.status === "Upcoming" && item.date >= today()).length;
  const unanswered = workspace.messages.filter(message => !message.replied).length;
  const saveWorkspace = (next: WorkspaceData) => {
    setWorkspace(next); if (!user) return;
    window.localStorage.setItem(workspaceKey(user.uid), JSON.stringify(next)); setSaveState("loading");
    setDoc(doc(db, "users", user.uid), { workspace: next, workspaceUpdatedAt: serverTimestamp() }, { merge: true }).then(() => setSaveState("cloud")).catch(() => setSaveState("device"));
  };
  const chooseView = (next: View) => { setView(next); setMenuOpen(false); };
  const addLead = () => { if (!leadForm.name.trim() || !leadForm.contact.trim()) return; saveWorkspace({ ...workspace, leads: [{ id: Date.now(), name: leadForm.name.trim(), contact: leadForm.contact.trim(), need: leadForm.need.trim(), status: "New", createdAt: today() }, ...workspace.leads] }); setLeadForm({ name: "", contact: "", need: "" }); };
  const addAppointment = () => { if (!appointmentForm.customer.trim() || !appointmentForm.date || !appointmentForm.time) return; saveWorkspace({ ...workspace, appointments: [{ id: Date.now(), customer: appointmentForm.customer.trim(), date: appointmentForm.date, time: appointmentForm.time, note: appointmentForm.note.trim(), status: "Upcoming" }, ...workspace.appointments] }); setAppointmentForm({ customer: "", date: today(), time: "10:00", note: "" }); };
  const addTask = () => { if (!taskForm.title.trim()) return; saveWorkspace({ ...workspace, tasks: [{ id: Date.now(), title: taskForm.title.trim(), due: taskForm.due, done: false }, ...workspace.tasks] }); setTaskForm({ title: "", due: today() }); };
  const addMessage = () => { if (!messageForm.customer.trim() || !messageForm.message.trim()) return; saveWorkspace({ ...workspace, messages: [{ id: Date.now(), customer: messageForm.customer.trim(), message: messageForm.message.trim(), receivedAt: new Date().toLocaleString(), replied: false }, ...workspace.messages] }); setMessageForm({ customer: "", message: "" }); };
  const replyToMessage = (message: CustomerMessage) => { setActiveTool("reply"); setInput(`Customer: ${message.customer}\nMessage: ${message.message}`); setOutput(""); setAiError(""); chooseView("assistant"); };
  const generate = async () => {
    if (!input.trim() || !user) return; setGenerating(true); setOutput(""); setAiError("");
    try { const token = await user.getIdToken(); const response = await fetch("/api/ai", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ tool: activeTool, tone, input: input.trim() }) }); const data = (await response.json()) as { output?: string; error?: string }; if (!response.ok || !data.output) throw new Error(data.error || "AI could not complete this request."); setOutput(data.output); }
    catch (error) { setAiError(error instanceof Error ? error.message : "Something went wrong. Please try again."); } finally { setGenerating(false); }
  };
  const logout = async () => { await signOut(auth); router.replace("/login"); };
  if (loading) return <main className={styles.loading}><Loader2 className={styles.spin}/><p>Opening your AI Employee…</p></main>;
  const navigation: Array<{ id: View; label: string; icon: typeof Bot; badge?: number }> = [
    { id: "overview", label: "Command centre", icon: LayoutDashboard }, { id: "assistant", label: "AI tools", icon: WandSparkles }, { id: "inbox", label: "Customer inbox", icon: Inbox, badge: unanswered }, { id: "leads", label: "Leads & CRM", icon: UsersRound, badge: activeLeads }, { id: "appointments", label: "Appointments", icon: CalendarCheck, badge: upcoming }, { id: "tasks", label: "Tasks", icon: ListTodo, badge: openTasks },
  ];

  return <main className={styles.shell}>
    <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.brandRow}><Link className={styles.brand} href="/"><span>S</span>SYNQO <strong>AI</strong></Link><button className={styles.close} onClick={()=>setMenuOpen(false)} aria-label="Close menu"><X/></button></div>
      <div className={styles.employeeBadge}><Bot/><div><strong>AI Employee</strong><span>Online and ready</span></div></div>
      <nav className={styles.nav}>{navigation.map(({ id, label, icon: Icon, badge }) => <button key={id} className={view===id?styles.active:""} onClick={()=>chooseView(id)}><Icon/><span>{label}</span>{Boolean(badge)&&<b>{badge}</b>}</button>)}</nav>
      <div className={styles.sideLinks}><Link href="/life-assistant"><Sparkles/>Life Assistant</Link><Link href="/feedback"><MessageSquareText/>Feedback</Link><Link href="/settings"><Settings/>Settings</Link></div>
      <div className={styles.profile}><div className={styles.avatar}>{name[0]?.toUpperCase()}</div><div><strong>{user?.displayName || name}</strong><span>{user?.email}</span></div><button onClick={logout} aria-label="Sign out"><LogOut/></button></div>
    </aside>
    {menuOpen && <button className={styles.overlay} onClick={()=>setMenuOpen(false)} aria-label="Close menu"/>}
    <section className={styles.content}>
      <header className={styles.topbar}><button className={styles.menu} onClick={()=>setMenuOpen(true)} aria-label="Open menu"><Menu/></button><div><span>Synqo AI Employee</span><h1>{viewLabels[view]}</h1></div><div className={styles.saveState}>{saveState==="loading"?<Loader2 className={styles.spin}/>:saveState==="cloud"?<Cloud/>:<Save/>}{saveState==="loading"?"Saving…":saveState==="cloud"?"Saved":"Saved on device"}</div></header>
      <div className={styles.main}>
        {view === "overview" && <><section className={styles.welcome}><div><span className={styles.eyebrow}><Sparkles/>YOUR BUSINESS WORKSPACE</span><h2>Good to see you, {name}.</h2><p>Messages, leads, appointments and follow-ups—organized in one place.</p></div><button onClick={()=>chooseView("assistant")}><WandSparkles/>Ask AI Employee</button></section>
          <section className={styles.metricsGrid}><Metric icon={Inbox} label="Inbox" value={unanswered} text="Need a reply" onClick={()=>chooseView("inbox")}/><Metric icon={UsersRound} label="Active leads" value={activeLeads} text="In your pipeline" onClick={()=>chooseView("leads")}/><Metric icon={CalendarCheck} label="Appointments" value={upcoming} text="Upcoming" onClick={()=>chooseView("appointments")}/><Metric icon={ListTodo} label="Open tasks" value={openTasks} text="Next actions" onClick={()=>chooseView("tasks")}/></section>
          <section className={styles.overviewGrid}><article className={styles.panel}><div className={styles.panelHead}><div><span>QUICK START</span><h3>Put your AI Employee to work</h3></div></div><div className={styles.quickGrid}>{tools.slice(0,6).map(({id,label,icon:Icon})=><button key={id} onClick={()=>{setActiveTool(id);chooseView("assistant");}}><Icon/><span>{label}</span><ChevronRight/></button>)}</div></article><article className={styles.panel}><div className={styles.panelHead}><div><span>PIPELINE</span><h3>Lead progress</h3></div><button onClick={()=>chooseView("leads")}>Open CRM</button></div><div className={styles.pipeline}>{(["New","Contacted","Qualified","Won"] as LeadStatus[]).map(status=><div key={status}><span>{status}</span><strong>{workspace.leads.filter(lead=>lead.status===status).length}</strong></div>)}</div>{workspace.leads.length===0&&<Empty icon={UsersRound} title="No leads yet" text="Add your first customer opportunity in the CRM."/>}</article></section></>}

        {view === "assistant" && <section className={styles.workspace}><div className={styles.toolRail}><div className={styles.sectionTitle}><span>AI TOOLS</span><h3>Choose a job</h3></div>{tools.map(({id,label,description,icon:Icon})=><button key={id} className={activeTool===id?styles.toolActive:""} onClick={()=>{setActiveTool(id);setOutput("");setAiError("");}}><span className={styles.toolIcon}><Icon/></span><span><strong>{label}</strong><small>{description}</small></span></button>)}</div><div className={styles.composer}><div className={styles.composerHead}><div><span>AI WORKSPACE</span><h3>{prompts[activeTool].title}</h3></div><Bot/></div><textarea maxLength={6000} value={input} onChange={e=>setInput(e.target.value)} placeholder={prompts[activeTool].placeholder}/><div className={styles.composerActions}><div className={styles.toneControl}><span>Tone</span><select value={tone} onChange={e=>setTone(e.target.value as Tone)}><option value="professional">Professional</option><option value="friendly">Friendly</option><option value="concise">Concise</option></select></div><button onClick={generate} disabled={!input.trim()||generating}>{generating?<Loader2 className={styles.spin}/>:<Send/>}{generating?"Working…":prompts[activeTool].action}</button></div><div className={`${styles.result} ${output?styles.resultReady:""} ${aiError?styles.resultError:""}`}>{output?<><div className={styles.resultHead}><span><Sparkles/>Synqo AI result</span><button onClick={()=>{navigator.clipboard.writeText(output);setCopied(true);setTimeout(()=>setCopied(false),1500);}}>{copied?<Check/>:<Clipboard/>}{copied?"Copied":"Copy"}</button></div><pre>{output}</pre></>:aiError?<div className={styles.errorResult}><Bot/><strong>Couldn’t generate this draft</strong><span>{aiError}</span><button onClick={generate}>Try again</button></div>:<Empty icon={Bot} title="Ready when you are" text="Add the details above to create a custom business draft."/>}</div></div></section>}

        {view === "inbox" && <Module title="Customer inbox" subtitle="Add an enquiry and turn it into a ready-to-send AI reply."><div className={styles.entryForm}><input value={messageForm.customer} onChange={e=>setMessageForm({...messageForm,customer:e.target.value})} placeholder="Customer name"/><textarea value={messageForm.message} onChange={e=>setMessageForm({...messageForm,message:e.target.value})} placeholder="Paste customer message…"/><button onClick={addMessage}><Plus/>Add enquiry</button></div><div className={styles.recordList}>{workspace.messages.length===0?<Empty icon={Inbox} title="Inbox is clear" text="Add a customer enquiry to start a reply."/>:workspace.messages.map(message=><article key={message.id}><div className={styles.recordIcon}><MessageSquareText/></div><div><strong>{message.customer}</strong><p>{message.message}</p><small>{message.receivedAt} · {message.replied?"Replied":"Needs reply"}</small></div><div className={styles.recordActions}><button onClick={()=>replyToMessage(message)}><WandSparkles/>AI reply</button><button className={styles.iconButton} onClick={()=>saveWorkspace({...workspace,messages:workspace.messages.filter(item=>item.id!==message.id)})} aria-label="Delete enquiry"><Trash2/></button></div></article>)}</div></Module>}
        {view === "leads" && <Module title="Leads & CRM" subtitle="Keep every opportunity organized from first contact to won."><div className={styles.entryFormThree}><input value={leadForm.name} onChange={e=>setLeadForm({...leadForm,name:e.target.value})} placeholder="Customer or business name"/><input value={leadForm.contact} onChange={e=>setLeadForm({...leadForm,contact:e.target.value})} placeholder="Phone or email"/><input value={leadForm.need} onChange={e=>setLeadForm({...leadForm,need:e.target.value})} placeholder="What do they need?"/><button onClick={addLead}><Plus/>Add lead</button></div><div className={styles.recordList}>{workspace.leads.length===0?<Empty icon={UsersRound} title="No leads yet" text="Add your first customer opportunity above."/>:workspace.leads.map(lead=><article key={lead.id}><div className={styles.recordIcon}><UserRound/></div><div><strong>{lead.name}</strong><p>{lead.need||"No requirement added"}</p><small>{lead.contact} · Added {lead.createdAt}</small></div><div className={styles.recordActions}><select value={lead.status} onChange={e=>saveWorkspace({...workspace,leads:workspace.leads.map(item=>item.id===lead.id?{...item,status:e.target.value as LeadStatus}:item)})}>{(["New","Contacted","Qualified","Won"] as LeadStatus[]).map(status=><option key={status}>{status}</option>)}</select><button className={styles.iconButton} onClick={()=>saveWorkspace({...workspace,leads:workspace.leads.filter(item=>item.id!==lead.id)})} aria-label="Delete lead"><Trash2/></button></div></article>)}</div></Module>}
        {view === "appointments" && <Module title="Appointments" subtitle="Book customer meetings and keep upcoming work visible."><div className={styles.entryFormFour}><input value={appointmentForm.customer} onChange={e=>setAppointmentForm({...appointmentForm,customer:e.target.value})} placeholder="Customer name"/><input type="date" value={appointmentForm.date} onChange={e=>setAppointmentForm({...appointmentForm,date:e.target.value})}/><input type="time" value={appointmentForm.time} onChange={e=>setAppointmentForm({...appointmentForm,time:e.target.value})}/><input value={appointmentForm.note} onChange={e=>setAppointmentForm({...appointmentForm,note:e.target.value})} placeholder="Service or note"/><button onClick={addAppointment}><Plus/>Book</button></div><div className={styles.recordList}>{workspace.appointments.length===0?<Empty icon={CalendarCheck} title="No appointments" text="Book the first customer appointment above."/>:workspace.appointments.map(item=><article key={item.id}><div className={styles.recordIcon}><CalendarCheck/></div><div><strong>{item.customer}</strong><p>{item.note||"Customer appointment"}</p><small>{item.date} at {item.time} · {item.status}</small></div><div className={styles.recordActions}><button onClick={()=>saveWorkspace({...workspace,appointments:workspace.appointments.map(entry=>entry.id===item.id?{...entry,status:entry.status==="Upcoming"?"Completed":"Upcoming"}:entry)})}><Check/>{item.status==="Upcoming"?"Complete":"Reopen"}</button><button className={styles.iconButton} onClick={()=>saveWorkspace({...workspace,appointments:workspace.appointments.filter(entry=>entry.id!==item.id)})} aria-label="Delete appointment"><Trash2/></button></div></article>)}</div></Module>}
        {view === "tasks" && <Module title="Business tasks" subtitle="Track every follow-up and next action without losing the details."><div className={styles.entryFormTask}><input value={taskForm.title} onChange={e=>setTaskForm({...taskForm,title:e.target.value})} onKeyDown={e=>e.key==="Enter"&&addTask()} placeholder="Add a follow-up or task…"/><input type="date" value={taskForm.due} onChange={e=>setTaskForm({...taskForm,due:e.target.value})}/><button onClick={addTask}><Plus/>Add task</button></div><div className={styles.recordList}>{workspace.tasks.length===0?<Empty icon={ListTodo} title="Nothing pending" text="Add your first business task above."/>:workspace.tasks.map(task=><article key={task.id} className={task.done?styles.completedRecord:""}><button className={styles.taskCheck} onClick={()=>saveWorkspace({...workspace,tasks:workspace.tasks.map(item=>item.id===task.id?{...item,done:!item.done}:item)})}>{task.done&&<Check/>}</button><div><strong>{task.title}</strong><small>Due {task.due||"anytime"} · {task.done?"Completed":"Open"}</small></div><div className={styles.recordActions}><button className={styles.iconButton} onClick={()=>saveWorkspace({...workspace,tasks:workspace.tasks.filter(item=>item.id!==task.id)})} aria-label="Delete task"><Trash2/></button></div></article>)}</div></Module>}
      </div>
    </section>
  </main>;
}

function Metric({ icon: Icon, label, value, text, onClick }: { icon: typeof Bot; label: string; value: number; text: string; onClick: () => void }) { return <button onClick={onClick}><span><Icon/>{label}</span><strong>{value}</strong><small>{text}</small></button>; }
function Module({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <section className={styles.module}><div className={styles.moduleHead}><div><span>AI EMPLOYEE WORKSPACE</span><h2>{title}</h2><p>{subtitle}</p></div></div>{children}</section>; }
function Empty({ icon: Icon, title, text }: { icon: typeof Bot; title: string; text: string }) { return <div className={styles.emptyResult}><Icon/><strong>{title}</strong><span>{text}</span></div>; }
