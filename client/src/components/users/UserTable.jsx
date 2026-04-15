import { Eye, Pencil, Trash2 } from "lucide-react";
import Badge from "../ui/Badge";
import { formatDate, roleColor, statusColor, getInitials } from "../../utils/helpers";
import useAuth from "../../hooks/useAuth";

const UserTable = ({ users, onView, onEdit, onDelete }) => {
  const { user: currentUser } = useAuth();

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["User", "Role", "Status", "Created", "Actions"].map((h) => (
              <th key={h} style={{
                padding: "10px 14px", textAlign: "left",
                fontSize: "0.72rem", fontWeight: 700,
                color: "var(--text-muted)", letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <td style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "var(--accent-dim)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.72rem", fontWeight: 700, color: "var(--accent)", flexShrink: 0,
                  }}>
                    {getInitials(u.name)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{u.name}</div>
                    <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{u.email}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: "12px 14px" }}>
                <Badge variant={roleColor(u.role)}>{u.role}</Badge>
              </td>
              <td style={{ padding: "12px 14px" }}>
                <Badge variant={statusColor(u.status)}>{u.status}</Badge>
              </td>
              <td style={{ padding: "12px 14px", fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                {formatDate(u.createdAt)}
              </td>
              <td style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {[
                    { icon: Eye, action: onView, title: "View" },
                    { icon: Pencil, action: onEdit, title: "Edit", hide: currentUser?.role === "user" },
                    { icon: Trash2, action: onDelete, title: "Delete", color: "var(--danger)", hide: currentUser?.role !== "admin" || u._id === currentUser?._id },
                  ].filter(b => !b.hide).map(({ icon: Icon, action, title, color }) => (
                    <button key={title} title={title} onClick={() => action(u)}
                      style={{
                        background: "var(--bg-hover)", border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)", padding: "5px 8px",
                        cursor: "pointer", color: color || "var(--text-secondary)",
                        display: "flex", alignItems: "center", transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = color || "var(--accent)"; e.currentTarget.style.color = color || "var(--accent)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = color || "var(--text-secondary)"; }}
                    >
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}>
          No users found.
        </div>
      )}
    </div>
  );
};

export default UserTable;