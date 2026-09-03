"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrainCircuit, CalendarDays, Check, ChevronRight, Clipboard, Cloud, FileText, Home, ListTodo, Loader2, LogOut, Menu, Plus, Save, Send, Sparkles, Trash2, WandSparkles, X } from "lucide-react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "../lib/firebase";
import styles from "./lifeAssistant.module.css";

type View = "today" | "tasks" | "notes" | "ai";
type Priority = "High" | "Medium" | "Low";
type Task = { id:number; title:string; due:string; category:string; priority:Priority; done:boolean };
type Note = { id:number; title:string; content:string; updatedAt:string };
type LifeData = { tasks:Task[]; notes:Note[] };
type AITool = "dailyplan" | "study" | "personalnotes";
const emptyData:LifeData={tasks:[],notes:[]};
const labels:Record<View,string>={today:"Today",tasks:"Smart tasks",notes:"Notes",ai:"AI workspace"};
const aiTools=[
  {id:"dailyplan" as AITool,label:"Daily Planner",description:"Turn tasks into a realistic schedule",icon:CalendarDays},
  {id:"study" as AITool,label:"Study Assistant",description:"Explain notes and create review questions",icon:BrainCircuit},
  {id:"personalnotes" as AITool,label:"Smart Notes",description:"Find actions, decisions and deadlines",icon:FileText},
];
const prompts:Record<AITool,string>={dailyplan:"Paste your tasks, deadlines and available hours…",study:"Paste study notes or material you want explained…",personalnotes:"Paste rough notes, messages or meeting details…"};
const today=()=>new Date().toISOString().slice(0,10);
const key=(uid:string)=>`synqo-life-${uid}`;
function validData(value:unknown):value is LifeData{if(!value||typeof value!=="object")return false;const item=value as Partial<LifeData>;return Array.isArray(item.tasks)&&Array.isArray(item.notes)}

export default function LifeAssistantPage(){
  const router=useRouter();
  const [user,setUser]=useState<User|null>(null),[loading,setLoading]=useState(true),[menuOpen,setMenuOpen]=useState(false),[view,setView]=useState<View>("today"),[data,setData]=useState<LifeData>(emptyData),[saveState,setSaveState]=useState<"loading"|"cloud"|"device">("loading");
  const [taskForm,setTaskForm]=useState({title:"",due:today(),category:"Personal",priority:"Medium" as Priority});
  const [noteForm,setNoteForm]=useState({title:"",content:""});
  const [activeTool,setActiveTool]=useState<AITool>("dailyplan"),[input,setInput]=useState(""),[output,setOutput]=useState(""),[error,setError]=useState(""),[generating,setGenerating]=useState(false),[copied,setCopied]=useState(false);

  useEffect(()=>onAuthStateChanged(auth,async current=>{if(!current)return router.replace("/login?next=/life-assistant");if(!current.emailVerified)return router.replace("/verify-email");setUser(current);const local=window.localStorage.getItem(key(current.uid));if(local){try{const parsed=JSON.parse(local);if(validData(parsed))setData(parsed)}catch{}}
    try{const snap=await getDoc(doc(db,"users",current.uid));const remote=snap.data()?.lifeAssistant;if(validData(remote)){setData(remote);window.localStorage.setItem(key(current.uid),JSON.stringify(remote))}setSaveState("cloud")}catch{setSaveState("device")}setLoading(false)}),[router]);
  const name=useMemo(()=>user?.displayName?.split(" ")[0]||user?.email?.split("@")[0]||"there",[user]);
  const open=data.tasks.filter(t=>!t.done),dueToday=open.filter(t=>t.due===today()),overdue=open.filter(t=>t.due&&t.due<today());
  const save=(next:LifeData)=>{setData(next);if(!user)return;window.localStorage.setItem(key(user.uid),JSON.stringify(next));setSaveState("loading");setDoc(doc(db,"users",user.uid),{lifeAssistant:next,lifeAssistantUpdatedAt:serverTimestamp()},{merge:true}).then(()=>setSaveState("cloud")).catch(()=>setSaveState("device"))};
  const choose=(next:View)=>{setView(next);setMenuOpen(false)};
  const addTask=()=>{if(!taskForm.title.trim())return;save({...data,tasks:[{id:Date.now(),title:taskForm.title.trim(),due:taskForm.due,category:taskForm.category.trim()||"Personal",priority:taskForm.priority,done:false},...data.tasks]});setTaskForm({title:"",due:today(),category:"Personal",priority:"Medium"})};
  const addNote=()=>{if(!noteForm.title.trim()||!noteForm.content.trim())return;save({...data,notes:[{id:Date.now(),title:noteForm.title.trim(),content:noteForm.content.trim(),updatedAt:new Date().toLocaleString()},...data.notes]});setNoteForm({title:"",content:""})};
  const planMyDay=()=>{setActiveTool("dailyplan");setInput(open.map(t=>`${t.priority} priority — ${t.title} (${t.category}, due ${t.due||"no date"})`).join("\n"));setOutput("");setError("");choose("ai")};
  const generate=async()=>{if(!input.trim()||!user)return;setGenerating(true);setOutput("");setError("");try{const token=await user.getIdToken();const response=await fetch("/api/ai",{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${token}`},body:JSON.stringify({tool:activeTool,tone:"concise",input:input.trim()})});const result=await response.json() as {output?:string;error?:string};if(!response.ok||!result.output)throw new Error(result.error||"AI could not complete this request.");setOutput(result.output)}catch(reason){setError(reason instanceof Error?reason.message:"Something went wrong.")}finally{setGenerating(false)}};
  const logout=async()=>{await signOut(auth);router.replace("/")};
  if(loading)return <main className={styles.loading}><Loader2/><p>Opening Synqo Life Assistant…</p></main>;
  const nav=[{id:"today" as View,label:"Today",icon:Home},{id:"tasks" as View,label:"Smart tasks",icon:ListTodo},{id:"notes" as View,label:"Notes",icon:FileText},{id:"ai" as View,label:"Ask Synqo AI",icon:WandSparkles}];
  return <main className={styles.shell}>
    <aside className={`${styles.sidebar} ${menuOpen?styles.open:""}`}><div className={styles.brandRow}><Link href="/" className={styles.brand}><span>S</span><div>SYNQO <strong>AI</strong><small>LIFE ASSISTANT</small></div></Link><button onClick={()=>setMenuOpen(false)}><X/></button></div><div className={styles.status}><Sparkles/><div><strong>Your personal AI</strong><span>Simple. Smart. Connected.</span></div></div><nav>{nav.map(({id,label,icon:Icon})=><button key={id} className={view===id?styles.active:""} onClick={()=>choose(id)}><Icon/><span>{label}</span><ChevronRight/></button>)}</nav><div className={styles.profile}><div>{name[0]?.toUpperCase()}</div><span><strong>{name}</strong><small>{user?.email}</small></span><button onClick={logout}><LogOut/></button></div></aside>
    {menuOpen&&<button className={styles.overlay} onClick={()=>setMenuOpen(false)}/>}<section className={styles.content}><header className={styles.topbar}><button className={styles.menu} onClick={()=>setMenuOpen(true)}><Menu/></button><div><small>SYNQO LIFE ASSISTANT</small><h1>{labels[view]}</h1></div><span className={styles.saved}>{saveState==="loading"?<Loader2/>:saveState==="cloud"?<Cloud/>:<Save/>}{saveState==="loading"?"Saving":saveState==="cloud"?"Cloud saved":"Device saved"}</span></header><div className={styles.main}>
      {view==="today"&&<><section className={styles.welcome}><div><span><Sparkles/>YOUR DAY, INTELLIGENTLY SYNCHRONIZED</span><h2>Hey {name}, let’s make today count.</h2><p>One calm view for your priorities, deadlines and next actions.</p></div><button onClick={planMyDay} disabled={!open.length}><WandSparkles/>Plan my day</button></section><section className={styles.metrics}><article><span>Due today</span><strong>{dueToday.length}</strong><small>Tasks for {new Date().toLocaleDateString(undefined,{month:"short",day:"numeric"})}</small></article><article><span>Open tasks</span><strong>{open.length}</strong><small>Across every category</small></article><article><span>Overdue</span><strong>{overdue.length}</strong><small>Needs attention</small></article><article><span>Smart notes</span><strong>{data.notes.length}</strong><small>Saved in your workspace</small></article></section><section className={styles.todayGrid}><Panel title="Today’s priorities" eyebrow="FOCUS"><TaskList tasks={dueToday.length?dueToday:open.slice(0,5)} data={data} save={save}/></Panel><Panel title="Quick capture" eyebrow="ADD A TASK"><TaskForm value={taskForm} setValue={setTaskForm} submit={addTask}/></Panel></section></>}
      {view==="tasks"&&<Panel title="Smart tasks" eyebrow="PLAN & PRIORITIZE"><TaskForm value={taskForm} setValue={setTaskForm} submit={addTask}/><TaskList tasks={data.tasks} data={data} save={save}/></Panel>}
      {view==="notes"&&<Panel title="Notes that turn into action" eyebrow="SMART NOTES"><div className={styles.noteForm}><input value={noteForm.title} onChange={e=>setNoteForm({...noteForm,title:e.target.value})} placeholder="Note title"/><textarea value={noteForm.content} onChange={e=>setNoteForm({...noteForm,content:e.target.value})} placeholder="Paste class notes, ideas, messages or meeting details…"/><button onClick={addNote}><Plus/>Save note</button></div><div className={styles.notes}>{data.notes.map(note=><article key={note.id}><FileText/><div><h3>{note.title}</h3><p>{note.content}</p><small>{note.updatedAt}</small></div><div><button onClick={()=>{setActiveTool("personalnotes");setInput(`${note.title}\n\n${note.content}`);choose("ai")}}><WandSparkles/>Analyze</button><button onClick={()=>save({...data,notes:data.notes.filter(n=>n.id!==note.id)})}><Trash2/></button></div></article>)}{!data.notes.length&&<Empty text="Save your first note, then let Synqo find actions and deadlines."/>}</div></Panel>}
      {view==="ai"&&<section className={styles.aiGrid}><div className={styles.tools}>{aiTools.map(({id,label,description,icon:Icon})=><button key={id} className={activeTool===id?styles.activeTool:""} onClick={()=>{setActiveTool(id);setOutput("");setError("")}}><Icon/><span><strong>{label}</strong><small>{description}</small></span></button>)}</div><div className={styles.composer}><div><span>AI WORKSPACE</span><h2>{aiTools.find(t=>t.id===activeTool)?.label}</h2></div><textarea maxLength={6000} value={input} onChange={e=>setInput(e.target.value)} placeholder={prompts[activeTool]}/><button onClick={generate} disabled={!input.trim()||generating}>{generating?<Loader2/>:<Send/>}{generating?"Thinking…":"Generate"}</button><div className={`${styles.result} ${error?styles.error:""}`}>{output?<><header><span><Sparkles/>Synqo AI result</span><button onClick={()=>{navigator.clipboard.writeText(output);setCopied(true);setTimeout(()=>setCopied(false),1400)}}>{copied?<Check/>:<Clipboard/>}{copied?"Copied":"Copy"}</button></header><pre>{output}</pre></>:error?<p>{error}</p>:<Empty text="Add your details above. Synqo will create a useful, organized result."/>}</div></div></section>}
    </div></section>
  </main>;
}

function Panel({title,eyebrow,children}:{title:string;eyebrow:string;children:React.ReactNode}){return <section className={styles.panel}><header><span>{eyebrow}</span><h2>{title}</h2></header>{children}</section>}
function TaskForm({value,setValue,submit}:{value:{title:string;due:string;category:string;priority:Priority};setValue:(v:{title:string;due:string;category:string;priority:Priority})=>void;submit:()=>void}){return <div className={styles.taskForm}><input value={value.title} onChange={e=>setValue({...value,title:e.target.value})} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="What needs to get done?"/><div><input type="date" value={value.due} onChange={e=>setValue({...value,due:e.target.value})}/><input value={value.category} onChange={e=>setValue({...value,category:e.target.value})} placeholder="Category"/><select value={value.priority} onChange={e=>setValue({...value,priority:e.target.value as Priority})}><option>High</option><option>Medium</option><option>Low</option></select></div><button onClick={submit}><Plus/>Add task</button></div>}
function TaskList({tasks,data,save}:{tasks:Task[];data:LifeData;save:(v:LifeData)=>void}){return <div className={styles.taskList}>{tasks.map(task=><article key={task.id} className={task.done?styles.done:""}><button className={styles.check} onClick={()=>save({...data,tasks:data.tasks.map(t=>t.id===task.id?{...t,done:!t.done}:t)})}>{task.done&&<Check/>}</button><div><strong>{task.title}</strong><span>{task.category} · Due {task.due||"anytime"}</span></div><b data-priority={task.priority}>{task.priority}</b><button className={styles.delete} onClick={()=>save({...data,tasks:data.tasks.filter(t=>t.id!==task.id)})}><Trash2/></button></article>)}{!tasks.length&&<Empty text="Nothing here yet. Add your first task and Synqo will keep it organized."/>}</div>}
function Empty({text}:{text:string}){return <div className={styles.empty}><Sparkles/><strong>Ready when you are</strong><span>{text}</span></div>}
