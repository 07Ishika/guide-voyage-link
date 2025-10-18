import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";

const ManualLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    name: ''
  });

  const handleLogin = async (field, value) => {
    if (!value.trim()) {
      toast({
        title: "Input Required",
        description: `Please enter ${field}`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || 'https://guide-voyage-link-1.onrender.com';
      const response = await fetch(`${AUTH_BASE_URL}/auth/manual-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ [field]: value }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Login Successful!",
          description: `Welcome ${data.user.displayName} (${data.user.role})`,
        });

        // Update AuthContext immediately
        setUser(data.user);

        // Small delay to ensure context is updated
        setTimeout(() => {
          // Redirect based on role
          if (data.user.role === 'guide') {
            navigate('/home/guide');
          } else {
            navigate('/home'); // Migrants go to home page first
          }
        }, 100);
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "User not found in database",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Failed to connect to server",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Manual Login</CardTitle>
          <CardDescription>
            Login as any user from the database for testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Login by Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Login by Email</label>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter email (e.g., michael@example.com)"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                disabled={loading}
              />
              <Button 
                onClick={() => handleLogin('email', loginData.email)}
                disabled={loading || !loginData.email.trim()}
                variant="outline"
              >
                Login
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">OR</div>

          {/* Login by Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Login by Name</label>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter name (e.g., Dr. Michael Rodriguez)"
                value={loginData.name}
                onChange={(e) => setLoginData(prev => ({ ...prev, name: e.target.value }))}
                disabled={loading}
              />
              <Button 
                onClick={() => handleLogin('name', loginData.name)}
                disabled={loading || !loginData.name.trim()}
                variant="outline"
              >
                Login
              </Button>
            </div>
          </div>

          {/* Quick Login Buttons */}
          <div className="space-y-3 pt-4 border-t">
            <div className="text-sm font-medium text-center">Quick Login</div>
            <div className="space-y-2">
              <Button 
                onClick={() => handleLogin('name', 'Dr. Michael Rodriguez')}
                disabled={loading}
                variant="hero"
                className="w-full"
              >
                Login as Dr. Michael Rodriguez (Guide)
              </Button>
              <Button 
                onClick={() => handleLogin('name', 'Sarah Chen')}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Login as Sarah Chen (Migrant)
              </Button>
            </div>
          </div>

          {loading && (
            <div className="text-center text-sm text-muted-foreground">
              Checking database...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualLogin;