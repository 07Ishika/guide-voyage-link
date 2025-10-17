import { useAuth } from '../contexts/AuthContext';

const AuthDebug = () => {
  const { currentUser, loading, isAuthenticated, isGuide, isMigrant } = useAuth();

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h4 className="font-bold mb-2">🔍 Auth Debug</h4>
      <div className="space-y-1">
        <div>Loading: {loading ? '✅' : '❌'}</div>
        <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
        <div>Is Guide: {isGuide ? '✅' : '❌'}</div>
        <div>Is Migrant: {isMigrant ? '✅' : '❌'}</div>
        <div>User Role: {currentUser?.role || 'None'}</div>
        <div>User Name: {currentUser?.displayName || 'None'}</div>
        <div>User ID: {currentUser?._id || 'None'}</div>
      </div>
    </div>
  );
};

export default AuthDebug;