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
        // Custom dropdown arrow to replace the native one removed by appearance: "none"
        backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23888%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px top 50%",
        backgroundSize: "10px auto",
        paddingRight: "30px", // Adds inner spacing to prevent text from overlapping the arrow
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