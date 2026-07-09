import type { ButtonHTMLAttributes, ReactNode } from "react";

type AppShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
};

type Tone = "good" | "warn" | "neutral";

export function AppShell({ eyebrow, title, description, aside, children }: AppShellProps) {
  return (
    <main style={styles.shell}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>{eyebrow}</p>
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.description}>{description}</p>
        </div>
        {aside ? <div style={styles.aside}>{aside}</div> : null}
      </header>
      <div style={styles.content}>{children}</div>
    </main>
  );
}

export function Button({ children, style, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" style={{ ...styles.button, ...style }} {...props}>
      {children}
    </button>
  );
}

export function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article style={styles.metric}>
      <p style={styles.metricLabel}>{label}</p>
      <strong style={styles.metricValue}>{value}</strong>
      <span style={styles.metricDetail}>{detail}</span>
    </article>
  );
}

export function StatusPill({ label, value, tone }: { label: string; value: string; tone: Tone }) {
  const palette = {
    good: { background: "#e7f5dc", color: "#28551b", borderColor: "#bfdcab" },
    warn: { background: "#fff0cf", color: "#744b00", borderColor: "#e6c46f" },
    neutral: { background: "#eef1f3", color: "#3f464d", borderColor: "#d3d9de" }
  }[tone];

  return (
    <span style={{ ...styles.pill, ...palette }} title={`${label}: ${value}`}>
      <span style={styles.pillLabel}>{label}</span>
      <span>{value}</span>
    </span>
  );
}

const styles = {
  shell: {
    width: "min(1120px, calc(100vw - 32px))",
    margin: "0 auto",
    padding: "38px 0"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24,
    paddingBottom: 28
  },
  eyebrow: {
    margin: 0,
    color: "#66705f",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: 0,
    textTransform: "uppercase" as const
  },
  title: {
    margin: "8px 0 0",
    fontSize: "clamp(2.1rem, 5vw, 4.8rem)",
    lineHeight: 0.95,
    letterSpacing: 0
  },
  description: {
    maxWidth: 620,
    margin: "14px 0 0",
    color: "#5e625d",
    fontSize: "1rem",
    lineHeight: 1.6
  },
  aside: {
    flex: "0 0 auto"
  },
  content: {
    display: "grid",
    gap: 14
  },
  button: {
    width: "fit-content",
    minHeight: 42,
    padding: "0 16px",
    border: "1px solid #222522",
    borderRadius: 6,
    background: "#1f241d",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700
  },
  metric: {
    minHeight: 128,
    padding: 18,
    border: "1px solid #ded8cc",
    borderRadius: 8,
    background: "#fff",
    display: "grid",
    alignContent: "space-between"
  },
  metricLabel: {
    margin: 0,
    color: "#626760",
    fontSize: "0.9rem"
  },
  metricValue: {
    display: "block",
    marginTop: 16,
    color: "#1c1d1f",
    fontSize: "2.2rem",
    lineHeight: 1,
    letterSpacing: 0
  },
  metricDetail: {
    color: "#6d6f68",
    fontSize: "0.85rem"
  },
  pill: {
    display: "inline-flex",
    minHeight: 30,
    alignItems: "center",
    gap: 8,
    padding: "0 10px",
    border: "1px solid",
    borderRadius: 999,
    fontSize: "0.82rem",
    fontWeight: 700,
    whiteSpace: "nowrap" as const
  },
  pillLabel: {
    opacity: 0.72
  }
};
