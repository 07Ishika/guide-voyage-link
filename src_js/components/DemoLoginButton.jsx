import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const DemoLoginButton = ({ role }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { toast } = useToast();

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || 'https://guide-voyage-link-1.onrender.com';
      const response = await fetch(`${AUTH_BASE_URL}/auth/demo-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        const user = await response.json();
        console.log('Demo login successful:', user);
        
        // Update AuthContext
        setUser(user);
        
        toast({
          title: "Demo Login Successful!",
          description: `Welcome ${user.displayName} (${role})`,
        });
        
        // Small delay to ensure context is updated
        setTimeout(() => {
          // Redirect based on role
          if (role === 'guide') {
            navigate('/home/guide');
          } else {
            navigate('/home');
          }
        }, 100);
      } else {
        const errorData = await response.json();
        console.error('Demo login failed:', errorData);
        toast({
          title: "Demo Login Failed",
          description: errorData.error || "Failed to login",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Demo login error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to server",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDemoLogin}
      disabled={loading}
      variant="outline"
      className="w-full"
    >
      {loading ? 'Logging in...' : `Demo Login as ${role === 'guide' ? 'Guide' : 'Migrant'}`}
    </Button>
  );
};

export default DemoLoginButton;

