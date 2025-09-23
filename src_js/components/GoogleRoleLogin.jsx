import React from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";

const GoogleRoleLogin = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', marginTop: 32 }}>
    <GoogleLoginButton role="migrant" />
    <GoogleLoginButton role="guide" />
  </div>
);

export default GoogleRoleLogin;
