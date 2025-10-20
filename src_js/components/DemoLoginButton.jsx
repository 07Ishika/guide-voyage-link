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
        console.log('Demo login API response:', user);
        
        // IMPORTANT: Validate that the returned user has the correct role
        // If backend returns wrong role, override with correct demo user data
        let finalUser = user;
        
        if (user.role !== role) {
          console.warn(`⚠️ Backend returned wrong role. Expected: ${role}, Got: ${user.role}`);
          
          // Create correct demo user data based on requested role
          const demoUsers = {
            migrant: {
              _id: user._id || 'demo-migrant-id',
              displayName: 'Sarah Chen',
              email: 'sarah@example.com',
              role: 'migrant',
              photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
            },
            guide: {
              _id: user._id || 'demo-guide-id', 
              displayName: 'Dr. Michael Rodriguez',
              email: 'michael@example.com',
              role: 'guide',
              photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael'
            }
          };
          
          finalUser = demoUsers[role];
          console.log('🔧 Using corrected demo user:', finalUser);
        }
        
        // Update AuthContext with the correct user
        setUser(finalUser);
        
        toast({
          title: "Demo Login Successful!",
          description: `Welcome ${finalUser.displayName} (${role})`,
        });
        
        // Small delay to ensure context is updated
        setTimeout(() => {
          // Redirect based on REQUESTED role, not returned role
          if (role === 'guide') {
            console.log('🎯 Navigating to guide dashboard');
            navigate('/home/guide');
          } else {
            console.log('🎯 Navigating to migrant dashboard');
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

