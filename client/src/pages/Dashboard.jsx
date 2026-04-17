import { useEffect, useState } from "react";
import { Users, UserCheck, UserX, ShieldCheck } from "lucide-react";
import useAuth from "../hooks/useAuth";
import api from "../api/axios";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div style={{
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)", padding: "22px 24px",
    display: "flex", alignItems: "center", gap: 16,
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: "var(--radius-md)",
      background: `${color}20`, display: "flex",
      alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <Icon size={20} color={color} />
    </div>
    <div>
      <div style={{ fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.2 }}>{value ?? "—"}</div>
      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/users?limit=1000");
        const users = data.users;
        setStats({
          total: data.total,
          active: users.filter((u) => u.status === "active").length,
          inactive: users.filter((u) => u.status === "inactive").length,
          admins: users.filter((u) => u.role === "admin").length,
        });
      } catch {
        setStats({ total: "—", active: "—", inactive: "—", admins: "—" });
      }
    };
    if (["admin", "manager"].includes(user?.role)) fetchStats();
  }, [user]);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Good day, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: "0.875rem" }}>
          Here's what's happening in your system.
        </p>
      </div>

      {["admin", "manager"].includes(user?.role) && (
        <div className="stats-grid">
          <StatCard icon={Users} label="Total Users" value={stats?.total} color="var(--accent)" />
          <StatCard icon={UserCheck} label="Active Users" value={stats?.active} color="var(--success)" />
          <StatCard icon={UserX} label="Inactive Users" value={stats?.inactive} color="var(--danger)" />
          <StatCard icon={ShieldCheck} label="Admins" value={stats?.admins} color="var(--warning)" />
        </div>
      )}

      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "28px",
      }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 6 }}>Your Account</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: 20 }}>
          Your current session details.
        </p>
        <div className="info-grid">
          {[
            { label: "Name", value: user?.name },
            { label: "Email", value: user?.email },
            { label: "Role", value: user?.role },
            { label: "Status", value: user?.status },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-sm)", padding: "12px 16px",
            }}>
              <div style={{
                fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4,
              }}>
                {label}
              </div>
              <div style={{ fontWeight: 600, textTransform: "capitalize", fontSize: "0.9rem" }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;