import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-primary)",
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(108,99,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 50%)",
      padding: 16,
    }}>
      <div className="fade-in" style={{
        width: "100%", maxWidth: 400,
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "40px 36px",
        boxShadow: "var(--shadow-lg)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "var(--radius-md)",
            background: "var(--accent)", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 16px",
            boxShadow: "0 0 24px rgba(108,99,255,0.4)",
          }}>
            <ShieldCheck size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Sign in to UserVault</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Email" type="email" placeholder="admin@example.com"
            icon={Mail} error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" placeholder="••••••••"
            icon={Lock} error={errors.password?.message} {...register("password")} />
          <Button type="submit" loading={loading} size="lg" style={{ marginTop: 8, width: "100%" }}>
            Sign In
          </Button>
        </form>

        {/* Test credentials hint */}
        <div style={{
          marginTop: 24, padding: "12px 14px", background: "var(--bg-secondary)",
          borderRadius: "var(--radius-sm)", border: "1px solid var(--border)",
        }}>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Test Credentials</p>
          {[
            { role: "Admin", email: "admin@example.com", pass: "Admin@123" },
            { role: "Manager", email: "manager@example.com", pass: "Manager@123" },
            { role: "User", email: "user@example.com", pass: "User@123" },
          ].map(({ role, email, pass }) => (
            <div key={role} style={{ fontSize: "0.76rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", marginBottom: 2 }}>
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>{role}:</span> {email} / {pass}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;