
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoogleLoginButton from "../components/GoogleLoginButton";


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginGuide = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || 'https://guide-voyage-link-1.onrender.com';
    fetch(`${AUTH_BASE_URL}/auth/user`, { credentials: "include" })
      .then((res) => res.ok ? res.json() : null)
      .then((user) => {
        if (user && user.role === "guide") {
          navigate("/dashboard/guide");
        }
      });
  }, [navigate]);
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <form className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-soft">
        <h2 className="text-xl font-bold mb-1">Guide Login</h2>
        <p className="text-sm text-muted-foreground mb-6">Use demo credentials to continue.</p>
        <div className="space-y-4">
          <Input placeholder="Email" type="email" required />
          <Input placeholder="Password" type="password" required />
          <a href="/dashboard/guide"><Button className="w-full" variant="hero">Login</Button></a>
          <div style={{ textAlign: 'center', margin: '16px 0' }}>or</div>
          <GoogleLoginButton role="guide" />
        </div>
      </form>
    </div>
  );
};

export default LoginGuide;


