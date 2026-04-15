import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { getInitials, roleColor, statusColor, formatDate } from "../utils/helpers";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").or(z.literal("")),
  confirmPassword: z.string(),
}).refine((d) => !d.password || d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name || "", password: "", confirmPassword: "" },
  });

  const onSubmit = async ({ name, password }) => {
    setLoading(true);
    try {
      const payload = { name };
      if (password) payload.password = password;
      const { data } = await api.put(`/users/${user.id}`, payload);
      updateUser({ name: data.user.name });
      toast.success("Profile updated!");
      reset({ name: data.user.name, password: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>My Profile</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 2 }}>Manage your account settings</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, maxWidth: 800 }}>
        {/* Info card */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: 24, textAlign: "center", height: "fit-content",
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "var(--accent-dim)", border: "2px solid var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.4rem", fontWeight: 700, color: "var(--accent)",
            margin: "0 auto 14px",
          }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>{user?.name}</div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: 12 }}>{user?.email}</div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
            <Badge variant={roleColor(user?.role)}>{user?.role}</Badge>
            <Badge variant={statusColor(user?.status)}>{user?.status}</Badge>
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            Member since<br />
            <span style={{ color: "var(--text-secondary)" }}>{formatDate(user?.createdAt)}</span>
          </div>
        </div>

        {/* Edit form */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: 28,
        }}>
          <h2 style={{ fontWeight: 700, marginBottom: 6 }}>Edit Profile</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: 22 }}>
            You can update your name and password. Role cannot be changed.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Full Name" error={errors.name?.message} {...register("name")} />
            <Input label="New Password (optional)" type="password" placeholder="Leave blank to keep current"
              error={errors.password?.message} {...register("password")} />
            <Input label="Confirm New Password" type="password" placeholder="••••••••"
              error={errors.confirmPassword?.message} {...register("confirmPassword")} />
            <Button type="submit" loading={loading} style={{ alignSelf: "flex-start" }}>
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;