
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoogleLoginButton from "../components/GoogleLoginButton";


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginMigrant = () => {
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:5000/auth/user", { credentials: "include" })
      .then((res) => res.ok ? res.json() : null)
      .then((user) => {
        if (user && user.role === "migrant") {
          navigate("/dashboard/migrant");
        }
      });
  }, [navigate]);
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <form className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-soft">
        <h2 className="text-xl font-bold mb-1">Migrant Login</h2>
        <p className="text-sm text-muted-foreground mb-6">Use demo credentials to continue.</p>
        <div className="space-y-4">
          <Input placeholder="Email" type="email" required />
          <Input placeholder="Password" type="password" required />
          <a href="/dashboard/migrant"><Button className="w-full" variant="hero">Login</Button></a>
          <div style={{ textAlign: 'center', margin: '16px 0' }}>or</div>
          <GoogleLoginButton role="migrant" />
        </div>
      </form>
    </div>
  );
};

export default LoginMigrant;


