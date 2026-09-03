"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";

export default function Topbar() {
  const router = useRouter();

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Welcome back to Synqo AI</p>
      </div>

      <div style={styles.right}>
        <div style={styles.user}>{auth.currentUser?.displayName || "User"}</div>

        <button onClick={logout} style={styles.button}>
          Logout
        </button>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
    borderBottom: "1px solid rgba(255,255,255,.08)",
    background: "#081523",
  },

  title: {
    margin: 0,
    color: "#fff",
    fontSize: 28,
    fontWeight: 800,
  },

  subtitle: {
    margin: "4px 0 0",
    color: "#7fa6c8",
    fontSize: 14,
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },

  user: {
    color: "#fff",
    fontWeight: 600,
  },

  button: {
    padding: "10px 18px",
    border: "none",
    borderRadius: 10,
    background: "#1188ff",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
};
