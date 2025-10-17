import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TabLogin = () => {
  const { 
    currentUser, 
    loading, 
    setUser,
    tabId,
    isAuthenticated,
    isGuide,
    isMigrant 
  } = useAuth();
  
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  const fetchAvailableUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/demo-users', {
        credentials: 'include'
      });
      if (response.ok) {
        const users = await response.json();
        setAvailableUsers(users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogin = async (userId) => {
    setLoggingIn(true);
    try {
      const response = await fetch('http://localhost:5000/auth/demo-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const user = await response.json();
        setUser(user);
        setShowLogin(false);
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowLogin(false);
  };

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[200px]">
        <div className="text-xs text-muted-foreground mb-2">
          Tab: {tabId?.slice(-8) || 'Loading...'}
        </div>
        
        {isAuthenticated ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{currentUser.displayName}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 py-1 rounded text-xs ${
                isGuide 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
              }`}>
                {currentUser.role}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogin(!showLogin)}
              >
                Switch
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-3 h-3 mr-1" />
              Logout
            </Button>
          </div>
        ) : (
          <div>
            <div className="text-sm font-medium mb-2">Not logged in</div>
            <Button
              variant="hero"
              size="sm"
              className="w-full"
              onClick={() => setShowLogin(!showLogin)}
            >
              <LogIn className="w-3 h-3 mr-1" />
              Login
            </Button>
          </div>
        )}

        {showLogin && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Login as:</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {availableUsers.map(user => (
                <Button
                  key={user._id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => handleLogin(user._id)}
                  disabled={loggingIn}
                >
                  <div className="flex items-center gap-2">
                    <span>{user.displayName}</span>
                    <span className={`px-1 py-0.5 rounded text-xs ${
                      user.role === 'guide' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabLogin;