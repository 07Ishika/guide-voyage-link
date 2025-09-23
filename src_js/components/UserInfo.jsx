import React, { useEffect, useState } from "react";

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/auth/user", {
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading user info...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div style={{ margin: '16px 0', padding: '12px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>Logged in as:</h3>
      <div><b>Name:</b> {user.displayName}</div>
      <div><b>Email:</b> {user.email}</div>
      <div><b>Role:</b> {user.role || 'N/A'}</div>
      {user.photo && <img src={user.photo} alt="User" style={{ width: 48, borderRadius: '50%' }} />}
    </div>
  );
};

export default UserInfo;
