import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, UserCircle, LogOut, ShieldCheck } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { getInitials } from "../../utils/helpers";

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink to={to} style={({ isActive }) => ({
    display: "flex", alignItems: "center", gap: 10,
    padding: "9px 14px", borderRadius: "var(--radius-sm)",
    fontSize: "0.875rem", fontWeight: 500, transition: "all 0.15s",
    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
    background: isActive ? "var(--bg-hover)" : "transparent",
    borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
  })}>
    <Icon size={16} />
    {label}
  </NavLink>
);

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside style={{
      width: "var(--sidebar-width)", height: "100vh",
      background: "var(--bg-secondary)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: "20px 18px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "var(--radius-sm)",
          background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <ShieldCheck size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, lineHeight: 1.2 }}>UserVault</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Management System</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        {["admin", "manager"].includes(user?.role) && (
          <NavItem to="/users" icon={Users} label="Users" />
        )}
        <NavItem to="/profile" icon={UserCircle} label="My Profile" />
      </nav>

      {/* User footer */}
      <div style={{ padding: "14px 10px", borderTop: "1px solid var(--border)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", borderRadius: "var(--radius-sm)",
          background: "var(--bg-hover)",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--accent-dim)", border: "1px solid var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", flexShrink: 0,
          }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "capitalize" }}>{user?.role}</div>
          </div>
          <button onClick={handleLogout} title="Logout" style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-muted)", padding: 4, borderRadius: 4,
            display: "flex", alignItems: "center", transition: "color 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--danger)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;