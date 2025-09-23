import React from "react";


const GoogleLoginButton = ({ role }) => {
  const handleLogin = () => {
    const url = `http://localhost:5000/auth/google?role=${role || ''}`;
    window.location.href = url;
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        background: "#4285F4",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "4px",
        fontSize: "16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
    >
      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" style={{ width: 20, height: 20 }} />
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
