import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/user', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', { 
        credentials: 'include' 
      });
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const refreshUser = () => {
    setLoading(true);
    fetchUser();
  };

  const setUser = (user) => {
    setCurrentUser(user);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    currentUser,
    loading,
    logout,
    refreshUser,
    setUser,
    isAuthenticated: !!currentUser,
    isGuide: currentUser?.role === 'guide',
    isMigrant: currentUser?.role === 'migrant'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};