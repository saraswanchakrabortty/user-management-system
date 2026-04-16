import { forwardRef } from "react";

const Select = forwardRef(({ label, error, disabled, style: extraStyle, children, ...props }, ref) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && (
      <label style={{
        fontSize: "0.8rem", fontWeight: 600,
        color: "var(--text-secondary)", letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}>
        {label}
      </label>
    )}
    <select
      ref={ref}
      disabled={disabled}
      style={{
        width: "100%", padding: "10px 14px",
        background: "var(--bg-secondary)",
        border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
        borderRadius: "var(--radius-sm)", color: "var(--text-primary)",
        fontSize: "0.9rem", outline: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        appearance: "none",
        ...extraStyle,
      }}
      {...props}
    >
      {children}
    </select>
    {error && (
      <span style={{ fontSize: "0.78rem", color: "var(--danger)" }}>{error}</span>
    )}
  </div>
));

Select.displayName = "Select";
export default Select;