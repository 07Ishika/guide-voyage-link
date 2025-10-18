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
  const [tabId, setTabId] = useState(null);

  // Generate or get tab ID
  const getTabId = () => {
    let currentTabId = sessionStorage.getItem('tabId');
    if (!currentTabId) {
      currentTabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('tabId', currentTabId);
    }
    return currentTabId;
  };

  // Load tab-specific user
  const loadTabUser = () => {
    if (!tabId) return null;
    
    const storedUser = localStorage.getItem(`tabUser_${tabId}`);
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem(`tabUser_${tabId}`);
      }
    }
    return null;
  };

  // Save tab-specific user
  const saveTabUser = (user) => {
    if (!tabId) return;
    
    if (user) {
      localStorage.setItem(`tabUser_${tabId}`, JSON.stringify(user));
    } else {
      localStorage.removeItem(`tabUser_${tabId}`);
    }
  };

  const fetchUser = async () => {
    try {
      // Don't auto-load user if we're on role selection page (after logout)
      if (window.location.pathname === '/role') {
        console.log('🔍 AuthContext: On role page, not auto-loading user');
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      // First check if there's a tab-specific user
      const tabUser = loadTabUser();
      if (tabUser) {
        console.log('🔍 AuthContext: Loaded tab user:', tabUser?.displayName, 'Role:', tabUser?.role);
        setCurrentUser(tabUser);
        setLoading(false);
        return;
      }

      // If no tab user, check server session
      const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || 'https://guide-voyage-link-1.onrender.com';
      const response = await fetch(`${AUTH_BASE_URL}/auth/user`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const user = await response.json();
        console.log('🔍 AuthContext: Fetched server user:', user?.displayName, 'Role:', user?.role);
        setCurrentUser(user);
        saveTabUser(user); // Save to tab storage
      } else {
        console.log('🔍 AuthContext: No authenticated user');
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('❌ AuthContext: Error fetching user:', error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🔍 AuthContext: Logging out tab:', tabId);
      // Clear current user state
      setCurrentUser(null);
      // Clear tab-specific storage
      saveTabUser(null);
      // Also clear any cached data
      if (tabId) {
        localStorage.removeItem(`tabUser_${tabId}`);
        console.log('🔍 AuthContext: Cleared tab storage for:', tabId);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  const clearTabSession = () => {
    console.log('🔍 AuthContext: Clearing complete tab session');
    setCurrentUser(null);
    if (tabId) {
      localStorage.removeItem(`tabUser_${tabId}`);
    }
  };

  const setUser = (user) => {
    console.log('🔍 AuthContext: Setting tab user:', user?.displayName, 'Role:', user?.role, 'Tab:', tabId);
    setCurrentUser(user);
    saveTabUser(user);
  };

  useEffect(() => {
    const currentTabId = getTabId();
    setTabId(currentTabId);
  }, []);

  useEffect(() => {
    if (tabId) {
      fetchUser();
    }
  }, [tabId]);

  const value = {
    currentUser,
    loading,
    logout,
    refreshUser,
    setUser,
    clearTabSession,
    tabId,
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