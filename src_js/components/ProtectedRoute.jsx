import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireRole = null, redirectTo = '/role' }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        // User not authenticated, redirect to role selection
        navigate(redirectTo);
      } else if (requireRole && currentUser.role !== requireRole) {
        // User doesn't have required role, show access denied or redirect
        if (requireRole === 'guide' && currentUser.role === 'migrant') {
          navigate('/home'); // Redirect migrants to their home page
        } else if (requireRole === 'migrant' && currentUser.role === 'guide') {
          navigate('/home/guide'); // Redirect guides to their home
        } else {
          navigate(redirectTo);
        }
      }
    }
  }, [currentUser, loading, requireRole, navigate, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  if (requireRole && currentUser.role !== requireRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-muted-foreground">
            Required role: {requireRole}, Your role: {currentUser.role}
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;