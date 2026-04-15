const variants = {
  success: { bg: "var(--success-dim)", color: "var(--success)" },
  danger:  { bg: "var(--danger-dim)",  color: "var(--danger)"  },
  warning: { bg: "var(--warning-dim)", color: "var(--warning)" },
  info:    { bg: "var(--info-dim)",    color: "var(--info)"    },
  default: { bg: "var(--bg-hover)",    color: "var(--text-secondary)" },
};

const Badge = ({ children, variant = "default" }) => {
  const s = variants[variant] || variants.default;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 10px", borderRadius: "99px", fontSize: "0.75rem",
      fontWeight: 600, letterSpacing: "0.03em",
      backgroundColor: s.bg, color: s.color,
      textTransform: "capitalize",
    }}>
      {children}
    </span>
  );
};

export default Badge;