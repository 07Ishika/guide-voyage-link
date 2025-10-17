import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Users, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserSwitcher = () => {
  const { currentUser, logout } = useAuth();
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [switching, setSwitching] = useState(false);

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

  const switchUser = async (userId) => {
    setSwitching(true);
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
        // Reload the page to refresh all contexts
        window.location.reload();
      } else {
        console.error('Failed to switch user');
      }
    } catch (error) {
      console.error('Error switching user:', error);
    } finally {
      setSwitching(false);
      setShowSwitcher(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  if (!currentUser) return null;

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">{currentUser.displayName}</span>
          <span className={`px-2 py-1 rounded text-xs ${
            currentUser.role === 'guide' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
              : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
          }`}>
            {currentUser.role}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSwitcher(!showSwitcher)}
            disabled={switching}
          >
            <Users className="w-3 h-3 mr-1" />
            Switch
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="w-3 h-3 mr-1" />
            Logout
          </Button>
        </div>

        {showSwitcher && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Switch to:</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {availableUsers
                .filter(user => user._id !== currentUser._id)
                .map(user => (
                <Button
                  key={user._id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => switchUser(user._id)}
                  disabled={switching}
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

export default UserSwitcher;