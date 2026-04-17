import { Search } from "lucide-react";

const UserFilters = ({ filters, onChange }) => (
  <div className="filters-bar">
    <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
      <Search size={14} style={{
        position: "absolute", left: 12, top: "50%",
        transform: "translateY(-50%)", color: "var(--text-muted)",
      }} />
      <input
        placeholder="Search name or email..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
        style={{
          width: "100%", padding: "8px 12px 8px 34px",
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)", color: "var(--text-primary)",
          fontSize: "0.875rem", outline: "none",
        }}
      />
    </div>
    <select
      value={filters.role}
      onChange={(e) => onChange({ ...filters, role: e.target.value, page: 1 })}
      style={{
        padding: "8px 14px", background: "var(--bg-card)",
        border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
        color: "var(--text-primary)", fontSize: "0.875rem",
        cursor: "pointer", outline: "none",
      }}
    >
      <option value="">All Roles</option>
      <option value="admin">Admin</option>
      <option value="manager">Manager</option>
      <option value="user">User</option>
    </select>
    <select
      value={filters.status}
      onChange={(e) => onChange({ ...filters, status: e.target.value, page: 1 })}
      style={{
        padding: "8px 14px", background: "var(--bg-card)",
        border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
        color: "var(--text-primary)", fontSize: "0.875rem",
        cursor: "pointer", outline: "none",
      }}
    >
      <option value="">All Status</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>
);

export default UserFilters;