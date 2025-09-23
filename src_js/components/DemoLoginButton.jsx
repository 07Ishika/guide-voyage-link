import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DemoLoginButton = ({ role }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/auth/demo-login', {
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
        
        // Redirect based on role
        if (role === 'guide') {
          navigate('/home/guide');
        } else {
          navigate('/home');
        }
      } else {
        console.error('Demo login failed');
      }
    } catch (error) {
      console.error('Demo login error:', error);
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

