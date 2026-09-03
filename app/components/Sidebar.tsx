"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { name: "Dashboard", href: "/dashboard", icon: "🏠" },
  { name: "AI Tools", href: "/dashboard/ai-tools", icon: "🤖" },
  { name: "Profile", href: "/dashboard/profile", icon: "👤" },
  { name: "Billing", href: "/dashboard/billing", icon: "💳" },
  { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoSection}>
        <div style={styles.logo}>S</div>

        <div>
          <h2 style={styles.title}>Synqo AI</h2>
          <p style={styles.subtitle}>Dashboard</p>
        </div>
      </div>

      <nav style={styles.nav}>
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...styles.link,
                ...(active ? styles.activeLink : {}),
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 270,
    minHeight: "100vh",
    background: "#071321",
    borderRight: "1px solid rgba(255,255,255,.08)",
    padding: 24,
    boxSizing: "border-box",
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 40,
  },

  logo: {
    width: 50,
    height: 50,
    borderRadius: 14,
    background: "linear-gradient(135deg,#1ea4ff,#005dff)",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    color: "#fff",
    fontSize: 24,
  },

  title: {
    margin: 0,
    color: "#fff",
    fontSize: 20,
  },

  subtitle: {
    margin: 0,
    color: "#7fa6c8",
    fontSize: 13,
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    borderRadius: 12,
    color: "#b7c9db",
    textDecoration: "none",
    transition: "0.2s",
  },

  activeLink: {
    background: "#1188ff",
    color: "#fff",
    boxShadow: "0 0 20px rgba(17,136,255,.35)",
  },

  icon: {
    fontSize: 18,
  },
};
