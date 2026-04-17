import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import { formatDate, getInitials, roleColor, statusColor } from "../utils/helpers";

const Field = ({ label, value }) => (
  <div style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)", padding: "12px 16px" }}>
    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>{value || "—"}</div>
  </div>
);

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/users/${id}`);
        setUser(data.user);
      } catch {
        toast.error("User not found");
        navigate("/users");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}><Spinner size={28} /></div>;
  if (!user) return null;

  return (
    <div className="fade-in">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} style={{ marginBottom: 20, gap: 6 }}>
        <ArrowLeft size={15} /> Back
      </Button>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        {/* Header */}
        <div className="detail-header">
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "var(--accent-dim)", border: "2px solid var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem", fontWeight: 700, color: "var(--accent)",
          }}>
            {getInitials(user.name)}
          </div>
          <div>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 700 }}>{user.name}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{user.email}</p>
            <div className="badge-row" style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Badge variant={roleColor(user.role)}>{user.role}</Badge>
              <Badge variant={statusColor(user.status)}>{user.status}</Badge>
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: 28 }}>
          <h2 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Account Details</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 28 }}>
            <Field label="Full Name" value={user.name} />
            <Field label="Email" value={user.email} />
            <Field label="Role" value={user.role} />
            <Field label="Status" value={user.status} />
          </div>

          <h2 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Audit Information</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            <Field label="Created At" value={formatDate(user.createdAt)} />
            <Field label="Updated At" value={formatDate(user.updatedAt)} />
            <Field label="Created By" value={user.createdBy?.name || "Self-registered"} />
            <Field label="Last Updated By" value={user.updatedBy?.name || "—"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;