import { forwardRef } from "react";

const Input = forwardRef(({ label, error, icon: Icon, ...props }, ref) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && (
      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </label>
    )}
    <div style={{ position: "relative" }}>
      {Icon && (
        <Icon size={15} style={{
          position: "absolute", left: 12, top: "50%",
          transform: "translateY(-50%)", color: "var(--text-muted)",
        }} />
      )}
      <input
        ref={ref}
        style={{
          width: "100%", padding: Icon ? "10px 14px 10px 36px" : "10px 14px",
          background: "var(--bg-secondary)", border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
          borderRadius: "var(--radius-sm)", color: "var(--text-primary)",
          fontSize: "0.9rem", outline: "none", transition: "border-color 0.15s",
        }}
        onFocus={(e) => e.target.style.borderColor = error ? "var(--danger)" : "var(--accent)"}
        onBlur={(e) => e.target.style.borderColor = error ? "var(--danger)" : "var(--border)"}
        {...props}
      />
    </div>
    {error && <span style={{ fontSize: "0.78rem", color: "var(--danger)" }}>{error}</span>}
  </div>
));

Input.displayName = "Input";
export default Input;