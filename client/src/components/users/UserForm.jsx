import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

const schema = (isEdit) => z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: isEdit
    ? z.string().optional().or(z.literal(""))
    : z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "manager", "user"]),
  status: z.enum(["active", "inactive"]),
});

const UserForm = ({ onSubmit, initialData, loading }) => {
  const isEdit = !!initialData;
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema(isEdit)),
    defaultValues: {
      name: "", email: "", password: "",
      role: "user", status: "active",
    },
  });

  useEffect(() => {
    if (initialData) reset({ ...initialData, password: "" });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register("name")} />
      <Input label="Email" type="email" placeholder="john@example.com" error={errors.email?.message} {...register("email")} />
      <Input
        label={isEdit ? "New Password (leave blank to keep)" : "Password"}
        type="password" placeholder="••••••••"
        error={errors.password?.message} {...register("password")}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Select label="Role" error={errors.role?.message} {...register("role")}>
          <option value="user">User</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </Select>
        <Select label="Status" error={errors.status?.message} {...register("status")}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>
      <Button type="submit" loading={loading} style={{ marginTop: 8 }}>
        {isEdit ? "Update User" : "Create User"}
      </Button>
    </form>
  );
};

export default UserForm;