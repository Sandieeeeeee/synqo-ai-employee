"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AtSign,
  Bot,
  Check,
  Clipboard,
  Gauge,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquareText,
  Plus,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  WandSparkles,
  X,
} from "lucide-react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "../../lib/firebase";
import styles from "./socialAgentApp.module.css";

type Platform = "Instagram" | "Facebook";
type MessageKind = "Comment" | "DM";
type MessageStatus = "Needs reply" | "Suggested" | "Approved";
type Tone = "professional" | "friendly" | "concise";
type View = "inbox" | "replies" | "settings";

type CommunityMessage = {
  id: number;
  platform: Platform;
  kind: MessageKind;
  author: string;
  handle: string;
  message: string;
  receivedAt: string;
  status: MessageStatus;
  suggestedReply: string;
  demo?: boolean;
};

type SocialWorkspace = {
  messages: CommunityMessage[];
  repliesUsed: number;
  tone: Tone;
  brandContext: string;
};

const FREE_LIMIT = 5;
const demoMessages: CommunityMessage[] = [
  {
    id: 101,
    platform: "Instagram",
    kind: "Comment",
    author: "Maya Patel",
    handle: "@mayap",
    message: "This looks useful. Does it work for a small salon?",
    receivedAt: "Demo · 2 min ago",
    status: "Needs reply",
    suggestedReply: "",
    demo: true,
  },
  {
    id: 102,
    platform: "Facebook",
    kind: "DM",
    author: "Daniel Lee",
    handle: "Facebook Messenger",
    message: "Can I book a demo for my restaurant this week?",
    receivedAt: "Demo · 8 min ago",
    status: "Needs reply",
    suggestedReply: "",
    demo: true,
  },
  {
    id: 103,
    platform: "Instagram",
    kind: "Comment",
    author: "Aman Kaur",
    handle: "@amank",
    message: "Love the idea 🙌",
    receivedAt: "Demo · 18 min ago",
    status: "Approved",
    suggestedReply: "Thank you, Aman! We really appreciate the support 🙌",
    demo: true,
  },
];

const emptyWorkspace: SocialWorkspace = {
  messages: demoMessages,
  repliesUsed: 0,
  tone: "friendly",
  brandContext: "Helpful, confident and human. Keep replies short, practical and easy to understand.",
};

function validWorkspace(value: unknown): value is SocialWorkspace {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SocialWorkspace>;
  return (
    Array.isArray(candidate.messages) &&
    typeof candidate.repliesUsed === "number" &&
    typeof candidate.brandContext === "string" &&
    ["professional", "friendly", "concise"].includes(candidate.tone || "")
  );
}

function storageKey(uid: string) {
  return `synqo-social-agent-${uid}`;
}

function firstName(user: User | null) {
  return user?.displayName?.trim().split(" ")[0] || user?.email?.split("@")[0] || "there";
}

export default function SocialAgentAppPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState<SocialWorkspace>(emptyWorkspace);
  const [view, setView] = useState<View>("inbox");
  const [selectedId, setSelectedId] = useState<number>(demoMessages[0].id);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saveState, setSaveState] = useState<"loading" | "cloud" | "device">("loading");
  const [form, setForm] = useState({
    platform: "Instagram" as Platform,
    kind: "Comment" as MessageKind,
    author: "",
    handle: "",
    message: "",
  });

  useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      if (!currentUser.emailVerified) {
        router.replace("/verify-email");
        return;
      }

      setUser(currentUser);
      let next = emptyWorkspace;
      const local = window.localStorage.getItem(storageKey(currentUser.uid));
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (validWorkspace(parsed)) next = parsed;
        } catch {}
      }

      try {
        const snapshot = await getDoc(doc(db, "users", currentUser.uid));
        const remote = snapshot.data()?.socialAgentWorkspace;
        if (validWorkspace(remote)) {
          next = remote;
          window.localStorage.setItem(storageKey(currentUser.uid), JSON.stringify(remote));
        }
        setSaveState("cloud");
      } catch {
        setSaveState("device");
      }

      setWorkspace(next);
      setSelectedId(next.messages[0]?.id || 0);
      setLoading(false);
    });
  }, [router]);

  const saveWorkspace = (next: SocialWorkspace) => {
    setWorkspace(next);
    if (!user) return;
    window.localStorage.setItem(storageKey(user.uid), JSON.stringify(next));
    setSaveState("loading");
    setDoc(
      doc(db, "users", user.uid),
      { socialAgentWorkspace: next, socialAgentUpdatedAt: serverTimestamp() },
      { merge: true },
    )
      .then(() => setSaveState("cloud"))
      .catch(() => setSaveState("device"));
  };

  const selected = workspace.messages.find((message) => message.id === selectedId) || null;
  const remaining = Math.max(0, FREE_LIMIT - workspace.repliesUsed);
  const needsReply = workspace.messages.filter((message) => message.status === "Needs reply").length;
  const approved = workspace.messages.filter((message) => message.status === "Approved").length;
  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();
    return workspace.messages.filter((message) => {
      if (view === "replies" && message.status === "Needs reply") return false;
      if (!query) return true;
      return `${message.author} ${message.handle} ${message.message} ${message.platform}`.toLowerCase().includes(query);
    });
  }, [search, view, workspace.messages]);

  const selectView = (next: View) => {
    setView(next);
    setMenuOpen(false);
    setError("");
    setNotice("");
  };

  const addMessage = () => {
    if (!form.author.trim() || !form.message.trim()) {
      setError("Add the customer name and their message.");
      return;
    }
    const newMessage: CommunityMessage = {
      id: Date.now(),
      platform: form.platform,
      kind: form.kind,
      author: form.author.trim(),
      handle: form.handle.trim() || form.platform,
      message: form.message.trim(),
      receivedAt: new Date().toLocaleString(),
      status: "Needs reply",
      suggestedReply: "",
    };
    saveWorkspace({ ...workspace, messages: [newMessage, ...workspace.messages] });
    setSelectedId(newMessage.id);
    setForm({ platform: "Instagram", kind: "Comment", author: "", handle: "", message: "" });
    setAdding(false);
    setError("");
    setNotice("Message added to the approval inbox.");
  };

  const generateReply = async () => {
    if (!selected || !user || generating) return;
    if (remaining === 0) {
      setError("Your five free AI replies are used. Contact Synqo AI to continue the beta.");
      return;
    }

    setGenerating(true);
    setError("");
    setNotice("");
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({
          tool: "community",
          tone: workspace.tone,
          input: `Platform: ${selected.platform}\nType: ${selected.kind}\nCustomer: ${selected.author}\nCustomer message: ${selected.message}\nBrand context: ${workspace.brandContext}`,
        }),
      });
      const data = (await response.json()) as { output?: string; error?: string };
      if (!response.ok || !data.output) throw new Error(data.error || "AI could not prepare a reply.");

      const nextMessages = workspace.messages.map((message) =>
        message.id === selected.id
          ? { ...message, suggestedReply: data.output || "", status: "Suggested" as MessageStatus }
          : message,
      );
      saveWorkspace({ ...workspace, messages: nextMessages, repliesUsed: workspace.repliesUsed + 1 });
      setNotice("AI reply is ready for your approval.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const updateDraft = (value: string) => {
    if (!selected) return;
    saveWorkspace({
      ...workspace,
      messages: workspace.messages.map((message) =>
        message.id === selected.id
          ? { ...message, suggestedReply: value, status: value ? "Suggested" : "Needs reply" }
          : message,
      ),
    });
  };

  const approveAndCopy = async () => {
    if (!selected?.suggestedReply.trim()) return;
    await navigator.clipboard.writeText(selected.suggestedReply.trim());
    saveWorkspace({
      ...workspace,
      messages: workspace.messages.map((message) =>
        message.id === selected.id ? { ...message, status: "Approved" } : message,
      ),
    });
    setNotice("Approved and copied. Paste it into Instagram or Facebook.");
  };

  const removeMessage = () => {
    if (!selected) return;
    const nextMessages = workspace.messages.filter((message) => message.id !== selected.id);
    saveWorkspace({ ...workspace, messages: nextMessages });
    setSelectedId(nextMessages[0]?.id || 0);
    setNotice("Conversation removed.");
  };

  const saveSettings = () => {
    saveWorkspace(workspace);
    setNotice("Brand voice saved.");
  };

  const logout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  if (loading) {
    return (
      <main className={styles.loading}>
        <Loader2 className={styles.spin} />
        <p>Opening Synqo Social Agent…</p>
      </main>
    );
  }

  return (
    <main className={styles.shell}>
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brandRow}>
          <Link className={styles.brand} href="/">
            <span>S</span>
            SYNQO <strong>AI</strong>
          </Link>
          <button className={styles.closeMenu} onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
        </div>

        <div className={styles.agentBadge}>
          <span><AtSign /></span>
          <div><strong>Social Agent</strong><small>Approval mode active</small></div>
        </div>

        <nav className={styles.nav} aria-label="Social Agent navigation">
          <button className={view === "inbox" ? styles.active : ""} onClick={() => selectView("inbox")}><Inbox /><span>Community inbox</span>{needsReply > 0 && <b>{needsReply}</b>}</button>
          <button className={view === "replies" ? styles.active : ""} onClick={() => selectView("replies")}><MessageSquareText /><span>AI replies</span>{approved > 0 && <b>{approved}</b>}</button>
          <button className={view === "settings" ? styles.active : ""} onClick={() => selectView("settings")}><Settings2 /><span>Brand voice</span></button>
        </nav>

        <div className={styles.sideLinks}>
          <Link href="/dashboard"><LayoutDashboard />AI Employee</Link>
          <Link href="/social-agent"><Sparkles />About Social Agent</Link>
        </div>

        <div className={styles.quotaCard}>
          <div><span>FREE BETA</span><strong>{remaining} replies left</strong></div>
          <div className={styles.quotaTrack}><span style={{ width: `${(workspace.repliesUsed / FREE_LIMIT) * 100}%` }} /></div>
          <small>{workspace.repliesUsed} of {FREE_LIMIT} AI replies used</small>
        </div>

        <div className={styles.profile}>
          <span className={styles.avatar}>{firstName(user)[0]?.toUpperCase()}</span>
          <div><strong>{user?.displayName || firstName(user)}</strong><small>{user?.email}</small></div>
          <button onClick={logout} aria-label="Sign out"><LogOut /></button>
        </div>
      </aside>

      {menuOpen && <button className={styles.overlay} onClick={() => setMenuOpen(false)} aria-label="Close menu" />}

      <section className={styles.content}>
        <header className={styles.topbar}>
          <button className={styles.menuButton} onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button>
          <div><span>SYNQO SOCIAL AGENT</span><h1>{view === "settings" ? "Brand voice" : view === "replies" ? "AI replies" : "Community inbox"}</h1></div>
          <div className={styles.topActions}>
            <span className={styles.saveState}>{saveState === "loading" ? <Loader2 className={styles.spin} /> : <Check />}{saveState === "loading" ? "Saving" : saveState === "cloud" ? "Saved" : "On device"}</span>
            <button className={styles.connectButton} onClick={() => setShowConnect((value) => !value)}><AtSign />Connect accounts</button>
          </div>
        </header>

        <div className={styles.main}>
          {showConnect && (
            <section className={styles.connectPanel}>
              <div className={styles.connectIcon}><ShieldCheck /></div>
              <div>
                <span>META CONNECTION</span>
                <h2>Account connection requires Meta approval</h2>
                <p>The AI reply workspace works now in approval-and-copy mode. Direct Instagram/Facebook syncing and auto-posting will switch on after the Synqo Meta app is reviewed and your business accounts authorize access.</p>
              </div>
              <Link href="/contact">Request setup</Link>
              <button onClick={() => setShowConnect(false)} aria-label="Close connection information"><X /></button>
            </section>
          )}

          {notice && <div className={styles.notice} role="status"><Check />{notice}<button onClick={() => setNotice("")}><X /></button></div>}
          {error && <div className={styles.error} role="alert"><ShieldCheck />{error}<button onClick={() => setError("")}><X /></button></div>}

          {view !== "settings" && (
            <section className={styles.metrics}>
              <article><span><Inbox />Needs reply</span><strong>{needsReply}</strong><small>Waiting in your inbox</small></article>
              <article><span><WandSparkles />AI prepared</span><strong>{workspace.messages.filter((item) => item.status === "Suggested").length}</strong><small>Ready to review</small></article>
              <article><span><Check />Approved</span><strong>{approved}</strong><small>Ready or already posted</small></article>
              <article><span><Gauge />Free replies</span><strong>{remaining}</strong><small>Remaining in beta</small></article>
            </section>
          )}

          {view === "settings" ? (
            <section className={styles.settingsGrid}>
              <article className={styles.settingsCard}>
                <div className={styles.cardHeading}><span><Bot /></span><div><small>AI PERSONALITY</small><h2>Choose your reply tone</h2></div></div>
                <div className={styles.toneGrid}>
                  {(["professional", "friendly", "concise"] as Tone[]).map((tone) => (
                    <button key={tone} className={workspace.tone === tone ? styles.toneActive : ""} onClick={() => saveWorkspace({ ...workspace, tone })}>
                      <strong>{tone[0].toUpperCase() + tone.slice(1)}</strong>
                      <small>{tone === "professional" ? "Polished and business-ready" : tone === "friendly" ? "Warm, natural and human" : "Short and straight to the point"}</small>
                    </button>
                  ))}
                </div>
              </article>

              <article className={styles.settingsCard}>
                <div className={styles.cardHeading}><span><Sparkles /></span><div><small>BRAND CONTEXT</small><h2>Teach Synqo how you speak</h2></div></div>
                <label htmlFor="brandContext">Reply instructions</label>
                <textarea id="brandContext" maxLength={700} value={workspace.brandContext} onChange={(event) => setWorkspace({ ...workspace, brandContext: event.target.value })} placeholder="Describe your brand voice, services and important reply rules…" />
                <div className={styles.settingsActions}><small>{workspace.brandContext.length}/700</small><button onClick={saveSettings}><Check />Save voice</button></div>
              </article>

              <article className={`${styles.settingsCard} ${styles.automationCard}`}>
                <div className={styles.cardHeading}><span><Send /></span><div><small>AUTOMATION</small><h2>Human approval is on</h2></div></div>
                <p>Every AI response stays editable until you approve it. Direct auto-posting remains locked until Meta reviews the Synqo app and your account is securely connected.</p>
                <div className={styles.lockedMode}><ShieldCheck /><div><strong>Approval-first mode</strong><small>Recommended for beta</small></div><span>ACTIVE</span></div>
              </article>
            </section>
          ) : (
            <section className={styles.workspace}>
              <div className={styles.inboxPanel}>
                <div className={styles.inboxHead}>
                  <div><span>{view === "replies" ? "REPLY HISTORY" : "INBOX"}</span><h2>{view === "replies" ? "Prepared conversations" : "Comments & DMs"}</h2></div>
                  <button onClick={() => setAdding((value) => !value)}><Plus />Add message</button>
                </div>

                {adding && (
                  <div className={styles.addForm}>
                    <div className={styles.formRow}>
                      <select value={form.platform} onChange={(event) => setForm({ ...form, platform: event.target.value as Platform })}><option>Instagram</option><option>Facebook</option></select>
                      <select value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value as MessageKind })}><option>Comment</option><option>DM</option></select>
                    </div>
                    <div className={styles.formRow}>
                      <input value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} placeholder="Customer name" />
                      <input value={form.handle} onChange={(event) => setForm({ ...form, handle: event.target.value })} placeholder="@handle (optional)" />
                    </div>
                    <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Paste the comment or direct message…" />
                    <div className={styles.formActions}><button onClick={() => setAdding(false)}>Cancel</button><button onClick={addMessage}><Plus />Add to inbox</button></div>
                  </div>
                )}

                <label className={styles.searchBox}><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations" /></label>

                <div className={styles.messageList}>
                  {filteredMessages.length === 0 ? (
                    <div className={styles.empty}><Inbox /><strong>No conversations here</strong><span>Add a comment or DM to create an AI reply.</span></div>
                  ) : filteredMessages.map((message) => (
                    <button key={message.id} className={message.id === selectedId ? styles.messageActive : ""} onClick={() => { setSelectedId(message.id); setError(""); setNotice(""); }}>
                      <span className={`${styles.platformIcon} ${message.platform === "Instagram" ? styles.instagram : styles.facebook}`}>{message.platform === "Instagram" ? <AtSign /> : <MessageCircle />}</span>
                      <span className={styles.messageBody}><span><strong>{message.author}</strong>{message.demo && <em>DEMO</em>}</span><small>{message.handle} · {message.kind}</small><p>{message.message}</p></span>
                      <span className={`${styles.status} ${message.status === "Approved" ? styles.approved : message.status === "Suggested" ? styles.suggested : ""}`}>{message.status}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.replyPanel}>
                {!selected ? (
                  <div className={styles.empty}><MessageSquareText /><strong>Select a conversation</strong><span>Choose a comment or DM from the inbox.</span></div>
                ) : (
                  <>
                    <div className={styles.replyHead}>
                      <div><span>{selected.platform} · {selected.kind}</span><h2>{selected.author}</h2><small>{selected.receivedAt}</small></div>
                      <button onClick={removeMessage} aria-label="Delete conversation"><Trash2 /></button>
                    </div>
                    <blockquote>{selected.message}</blockquote>

                    <div className={styles.replyLabel}><span><Sparkles />AI reply</span><small>{workspace.tone} tone</small></div>
                    <textarea className={styles.replyDraft} value={selected.suggestedReply} onChange={(event) => updateDraft(event.target.value)} placeholder="Generate a reply or write your own…" />

                    <div className={styles.replyActions}>
                      <button className={styles.generateButton} onClick={generateReply} disabled={generating || remaining === 0}>
                        {generating ? <Loader2 className={styles.spin} /> : <WandSparkles />}
                        {generating ? "Writing reply…" : selected.suggestedReply ? "Regenerate" : "Generate AI reply"}
                      </button>
                      <button className={styles.approveButton} onClick={approveAndCopy} disabled={!selected.suggestedReply.trim()}><Clipboard />Approve & copy</button>
                    </div>

                    <div className={styles.safetyNote}><ShieldCheck /><p><strong>You stay in control.</strong> Review important, negative, payment, legal or sensitive conversations before posting.</p></div>
                  </>
                )}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
