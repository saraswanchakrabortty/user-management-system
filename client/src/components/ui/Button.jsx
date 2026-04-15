import Spinner from "./Spinner";

const styles = {
  primary: {
    background: "var(--accent)", color: "#fff",
    border: "1px solid transparent",
  },
  secondary: {
    background: "var(--bg-hover)", color: "var(--text-primary)",
    border: "1px solid var(--border)",
  },
  danger: {
    background: "var(--danger-dim)", color: "var(--danger)",
    border: "1px solid rgba(239,68,68,0.3)",
  },
  ghost: {
    background: "transparent", color: "var(--text-secondary)",
    border: "1px solid transparent",
  },
};

const Button = ({
  children, variant = "primary", loading = false,
  disabled, size = "md", style: extraStyle, ...props
}) => {
  const padding = size === "sm" ? "6px 14px" : size === "lg" ? "12px 28px" : "9px 20px";
  const fontSize = size === "sm" ? "0.8rem" : size === "lg" ? "1rem" : "0.875rem";

  return (
    <button
      disabled={disabled || loading}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: 8, padding, fontSize, fontWeight: 600,
        borderRadius: "var(--radius-sm)", cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1, transition: "all 0.15s ease",
        fontFamily: "var(--font-sans)",
        ...styles[variant],
        ...extraStyle,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) e.currentTarget.style.opacity = "0.85";
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) e.currentTarget.style.opacity = "1";
      }}
      {...props}
    >
      {loading && <Spinner size={14} color="currentColor" />}
      {children}
    </button>
  );
};

export default Button;