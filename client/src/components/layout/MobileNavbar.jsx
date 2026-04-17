import { Menu, ShieldCheck } from "lucide-react";

const MobileNavbar = ({ onMenuClick }) => (
  <nav className="mobile-navbar">
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 28, height: 28, borderRadius: "var(--radius-sm)",
        background: "var(--accent)", display: "flex",
        alignItems: "center", justifyContent: "center",
      }}>
        <ShieldCheck size={16} color="#fff" />
      </div>
      <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>UserVault</span>
    </div>
    <button
      onClick={onMenuClick}
      style={{
        background: "var(--bg-hover)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)", padding: "7px 9px",
        cursor: "pointer", color: "var(--text-primary)",
        display: "flex", alignItems: "center",
      }}
    >
      <Menu size={18} />
    </button>
  </nav>
);

export default MobileNavbar;