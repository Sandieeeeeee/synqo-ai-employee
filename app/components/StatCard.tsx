"use client";

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
}: StatCardProps) {
  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div style={styles.icon}>{icon}</div>

        <div>
          <p style={styles.title}>{title}</p>
          <h2 style={styles.value}>{value}</h2>
        </div>
      </div>

      <p style={styles.subtitle}>{subtitle}</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#0b1828",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 18,
    padding: 22,
    color: "#fff",
    transition: "0.25s",
    boxShadow: "0 10px 30px rgba(0,0,0,.25)",
  },

  top: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },

  icon: {
    width: 58,
    height: 58,
    borderRadius: 14,
    background: "linear-gradient(135deg,#1ea4ff,#005dff)",
    display: "grid",
    placeItems: "center",
    fontSize: 28,
  },

  title: {
    margin: 0,
    color: "#8fb4d5",
    fontSize: 14,
  },

  value: {
    margin: "6px 0 0",
    fontSize: 32,
    color: "#fff",
  },

  subtitle: {
    marginTop: 18,
    color: "#6f8ca8",
    fontSize: 13,
    lineHeight: 1.6,
  },
};
