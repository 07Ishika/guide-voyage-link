import React from "react";
import { Button } from "@/components/ui/button";

const GoogleLoginButton = ({ role }) => {
  const handleLogin = () => {
    const url = `http://localhost:5000/auth/google?role=${role || ''}`;
    window.location.href = url;
  };

  return (
    <Button
      onClick={handleLogin}
      className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white border-none"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "12px 20px",
        fontSize: "16px",
        fontWeight: "500"
      }}
    >
      <img 
        src="https://developers.google.com/identity/images/g-logo.png" 
        alt="Google logo" 
        style={{ width: 20, height: 20 }} 
      />
      Login with Google
    </Button>
  );
};

export default GoogleLoginButton;
