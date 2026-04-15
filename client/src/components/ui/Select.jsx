import { forwardRef } from "react";

const Select = forwardRef(({ label, error, children, ...props }, ref) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && (
      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </label>
    )}
    <select
      ref={ref}
      style={{
        width: "100%", padding: "10px 14px",
        background: "var(--bg-secondary)", border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
        borderRadius: "var(--radius-sm)", color: "var(--text-primary)",
        fontSize: "0.9rem", outline: "none", cursor: "pointer",
        appearance: "none",
      }}
      {...props}
    >
      {children}
    </select>
    {error && <span style={{ fontSize: "0.78rem", color: "var(--danger)" }}>{error}</span>}
  </div>
));

Select.displayName = "Select";
export default Select;