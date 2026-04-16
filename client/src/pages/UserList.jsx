import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import UserTable from "../components/users/UserTable";
import UserFilters from "../components/users/UserFilters";
import UserForm from "../components/users/UserForm";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";

const UserList = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [filters, setFilters] = useState({ search: "", role: "", status: "", page: 1, limit: 10 });
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));
      const { data } = await api.get(`/users?${params}`);
      setUsers(data.users);
      setMeta({ total: data.total, pages: data.pages });
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreate = async (formData) => {
    setFormLoading(true);
    try {
      await api.post("/users", formData);
      toast.success("User created successfully");
      setCreateModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
  setFormLoading(true);
  try {
    const payload = { ...formData };

    // Remove empty password always
    if (!payload.password) delete payload.password;

    // Manager should never send status or password
    if (currentUser?.role === "manager") {
      delete payload.status;
      delete payload.password;
    }

    await api.put(`/users/${editModal._id}`, payload);
    toast.success("User updated successfully");
    setEditModal(null);
    fetchUsers();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update user");
  } finally {
    setFormLoading(false);
  }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Deactivate ${user.name}?`)) return;
    try {
      await api.delete(`/users/${user._id}`);
      toast.success("User deactivated");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to deactivate user");
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Users</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 2 }}>
            {meta.total} total users
          </p>
        </div>
        {currentUser?.role === "admin" && (
          <Button onClick={() => setCreateModal(true)}>
            <Plus size={16} /> Add User
          </Button>
        )}
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <UserFilters filters={filters} onChange={setFilters} />
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
            <Spinner size={28} />
          </div>
        ) : (
          <UserTable
            users={users}
            onView={(u) => navigate(`/users/${u._id}`)}
            onEdit={(u) => setEditModal(u)}
            onDelete={handleDelete}
          />
        )}

        {/* Pagination */}
        {meta.pages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid var(--border)" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Page {filters.page} of {meta.pages}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="secondary" size="sm" disabled={filters.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}>
                Previous
              </Button>
              <Button variant="secondary" size="sm" disabled={filters.page >= meta.pages}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create New User">
        <UserForm onSubmit={handleCreate} loading={formLoading} />
      </Modal>

      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title="Edit User">
        <UserForm onSubmit={handleUpdate} initialData={editModal} loading={formLoading} />
      </Modal>
    </div>
  );
};

export default UserList;