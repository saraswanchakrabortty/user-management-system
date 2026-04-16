import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import useAuth from "../../hooks/useAuth";

const buildSchema = (isEdit, isManager) =>
  z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    // password only required for admin creating a new user
    password: isEdit || isManager
      ? z.string().optional().or(z.literal(""))
      : z.string().min(6, "Password must be at least 6 characters"),
    // role and status are stripped from manager payloads, so they must be optional in validation
    role: isManager 
      ? z.enum(["admin", "manager", "user"]).optional() 
      : z.enum(["admin", "manager", "user"]),
    status: isManager 
      ? z.enum(["active", "inactive"]).optional() 
      : z.enum(["active", "inactive"]),
  });

const UserForm = ({ onSubmit, initialData, loading }) => {
  const { user: currentUser } = useAuth();
  const isEdit = !!initialData;
  const isManager = currentUser?.role === "manager";
  const isAdmin = currentUser?.role === "admin";

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(buildSchema(isEdit, isManager)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      status: "active",
    },
  });

  useEffect(() => {
    if (initialData) reset({ ...initialData, password: "" });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Name — everyone can edit */}
      <Input
        label="Full Name"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register("name")}
      />

      {/* Email — everyone can edit */}
      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      {/* Password — only shown to admin */}
      {isAdmin && (
        <Input
          label={isEdit ? "New Password (leave blank to keep)" : "Password"}
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

        {/* Role dropdown — only admin can change, manager sees it disabled */}
        <Select
          label="Role"
          error={errors.role?.message}
          disabled={isManager}
          {...register("role", { disabled: isManager })}
        >
          {isAdmin && <option value="admin">Admin</option>}
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </Select>

        {/* Status — only admin can change, manager sees it disabled */}
        <Select
          label="Status"
          error={errors.status?.message}
          disabled={isManager}
          {...register("status", { disabled: isManager })}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>

      </div>

      {/* Helper text for manager */}
      {isManager && (
        <p style={{
          fontSize: "0.76rem",
          color: "var(--text-muted)",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "8px 12px",
        }}>
          ℹ️ As a manager you can only update the name and email. Role, status, and password changes require admin access.
        </p>
      )}

      <Button type="submit" loading={loading} style={{ marginTop: 8 }}>
        {isEdit ? "Update User" : "Create User"}
      </Button>
    </form>
  );
};

export default UserForm;