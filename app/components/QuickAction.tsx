"use client";

type QuickActionProps = {
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
};

export default function QuickAction({
  title,
  description,
  buttonText,
  onClick,
}: QuickActionProps) {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{title}</h3>

      <p style={styles.description}>{description}</p>

      <button onClick={onClick} style={styles.button}>
        {buttonText}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#0b1828",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 18,
    padding: 24,
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 180,
    boxShadow: "0 10px 30px rgba(0,0,0,.25)",
  },

  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
  },

  description: {
    margin: "14px 0 24px",
    color: "#8fb4d5",
    lineHeight: 1.6,
    fontSize: 14,
  },

  button: {
    alignSelf: "flex-start",
    padding: "12px 22px",
    border: "none",
    borderRadius: 12,
    background: "linear-gradient(135deg,#1ea4ff,#005dff)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    boxShadow: "0 0 20px rgba(30,164,255,.35)",
  },
};
