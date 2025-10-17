import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../contexts/AuthContext";

const DashboardGuide = () => {
  const { currentUser, loading: userLoading, isGuide } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Debug user authentication
  useEffect(() => {
    console.log('🔍 Dashboard Debug:', {
      currentUser,
      userLoading,
      isAuthenticated: !!currentUser,
      isGuide
    });
  }, [currentUser, userLoading, isGuide]);

  // Simple data fetching without complex hooks
  useEffect(() => {
    const fetchSessions = async () => {
      if (!currentUser?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching sessions for user:', currentUser._id);
        console.log('🔍 Current user object:', currentUser);
        
        // Try fetching by guideId first
        const response = await fetch(`http://localhost:5000/api/guide-sessions?guideId=${currentUser._id}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        let data = await response.json();
        console.log('✅ Sessions fetched by guideId:', data);
        console.log('✅ Number of sessions found by guideId:', data.length);
        
        // If no sessions found by guideId, try by guideName as fallback
        if (data.length === 0) {
          console.log('🔄 No sessions found by guideId, trying by guideName...');
          const nameResponse = await fetch(`http://localhost:5000/api/guide-sessions?guideName=${encodeURIComponent(currentUser.displayName)}`, {
            credentials: 'include'
          });
          
          if (nameResponse.ok) {
            data = await nameResponse.json();
            console.log('✅ Sessions found by guideName:', data.length);
          }
        }
        
        // Also fetch ALL sessions to debug
        const allSessionsResponse = await fetch(`http://localhost:5000/api/guide-sessions`, {
          credentials: 'include'
        });
        const allSessions = await allSessionsResponse.json();
        console.log('🔍 ALL sessions in database:', allSessions);
        console.log('🔍 Looking for guideId:', currentUser._id);
        console.log('🔍 Looking for guideName:', currentUser.displayName);
        
        setSessions(data || []);
        
      } catch (err) {
        console.error('❌ Error fetching sessions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && !userLoading) {
      fetchSessions();
    }
  }, [currentUser, userLoading]);

  // Real-time polling for new session requests
  useEffect(() => {
    if (!currentUser?._id) return;

    const pollForUpdates = setInterval(() => {
      console.log('🔄 Polling for new session requests...');
      // Re-fetch sessions every 10 seconds
      const fetchUpdatedSessions = async () => {
        try {
          // Try by guideId first
          let response = await fetch(`http://localhost:5000/api/guide-sessions?guideId=${currentUser._id}`, {
            credentials: 'include'
          });
          
          if (response.ok) {
            let data = await response.json();
            
            // If no sessions found by guideId, try by guideName
            if (data.length === 0) {
              response = await fetch(`http://localhost:5000/api/guide-sessions?guideName=${encodeURIComponent(currentUser.displayName)}`, {
                credentials: 'include'
              });
              
              if (response.ok) {
                data = await response.json();
              }
            }
            
            setSessions(data || []);
          }
        } catch (err) {
          console.error('❌ Error polling sessions:', err);
        }
      };
      
      fetchUpdatedSessions();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollForUpdates);
  }, [currentUser?._id]);

  // Show loading while user data is being fetched
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if user is not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to access the dashboard.</p>
          <button 
            onClick={() => window.location.href = '/manual-login'}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Show error state if there's an API error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h2>
          <p className="text-muted-foreground mb-6">
            Failed to load dashboard data: {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while fetching sessions
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sessions...</p>
        </div>
      </div>
    );
  }

  // Handle session accept/decline actions
  const handleSessionAction = async (sessionId, requestStatus) => {
    try {
      setUpdating(true);
      
      console.log(`🔄 ${requestStatus === 'declined' ? 'Deleting' : 'Updating'} session ${sessionId} to ${requestStatus}`);
      
      // Check if server is reachable
      try {
        const healthCheck = await fetch('http://localhost:5000/api/guide-sessions', {
          method: 'HEAD',
          credentials: 'include'
        });
        console.log('🔍 Server health check:', healthCheck.status);
      } catch (healthError) {
        console.error('❌ Server not reachable:', healthError);
        throw new Error('Server is not running. Please start the server on port 5000.');
      }
      
      if (requestStatus === 'declined') {
        // Confirm before deleting
        const sessionToDelete = sessions.find(s => s._id === sessionId);
        const migrantName = sessionToDelete?.migrantName || 'the migrant';
        
        const confirmed = window.confirm(
          `Are you sure you want to decline and permanently remove the call request from ${migrantName}?\n\nThis action cannot be undone.`
        );
        
        if (!confirmed) {
          setUpdating(false);
          return;
        }
        
        // DELETE the session from database when declined
        const response = await fetch(`http://localhost:5000/api/guide-sessions/${sessionId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('❌ Delete failed:', response.status, response.statusText, errorData);
          throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorData}`);
        }
        
        console.log('✅ Session deleted from database');
        
        // Remove the session from local state
        setSessions(prevSessions => 
          prevSessions.filter(session => session._id !== sessionId)
        );
        
        // Show success message
        const deletedSession = sessions.find(s => s._id === sessionId);
        const deletedMigrantName = deletedSession?.migrantName || 'the migrant';
        
        alert(`❌ Request declined and removed! The call request from ${deletedMigrantName} has been permanently removed.`);
        
      } else if (requestStatus === 'accepted') {
        // UPDATE the session when accepted
        const updateData = {
          requestStatus: 'accepted',
          status: 'scheduled',
          updatedAt: new Date().toISOString()
        };
        
        const response = await fetch(`http://localhost:5000/api/guide-sessions/${sessionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updateData),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ Session updated:', result);
        
        // Update the local sessions state
        setSessions(prevSessions => 
          prevSessions.map(session => 
            session._id === sessionId 
              ? { ...session, ...updateData }
              : session
          )
        );
        
        // Show success message
        const acceptedSession = sessions.find(s => s._id === sessionId);
        const acceptedMigrantName = acceptedSession?.migrantName || 'the migrant';
        
        alert(`✅ Request accepted! You have accepted the call request from ${acceptedMigrantName}.`);
      }
      
    } catch (error) {
      console.error('❌ Error handling session:', error);
      console.error('❌ Error details:', error.message);
      alert(`❌ Failed to ${requestStatus} the request. Error: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Simple dashboard UI
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Guide Dashboard</h1>
          <p className="text-muted-foreground">
            {currentUser.displayName} • {currentUser.email} • Guide
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {sessions.filter(s => s.requestStatus === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Need response</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {sessions.filter(s => s.requestStatus === 'accepted').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Scheduled</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {sessions.filter(s => s.status === 'completed').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Finished</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>
              New session requests waiting for your response
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.filter(s => s.requestStatus === 'pending').length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-4">
                  No pending requests
                </div>
                <p className="text-sm text-muted-foreground">
                  New session requests from migrants will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.filter(s => s.requestStatus === 'pending').map((session) => (
                  <div key={session._id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            {session.migrantName || 'Unknown Migrant'}
                          </h3>
                          <Badge variant={
                            session.requestStatus === 'pending' ? 'default' :
                            session.requestStatus === 'accepted' ? 'success' : 'destructive'
                          }>
                            {session.requestStatus || 'pending'}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>Purpose:</strong> {session.purpose || 'General consultation'}</p>
                          <p><strong>Budget:</strong> {session.budget || 'Not specified'}</p>
                          <p><strong>Timeline:</strong> {session.timeline || 'Not specified'}</p>
                          <p><strong>Requested:</strong> {new Date(session.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        {session.requestStatus === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleSessionAction(session._id, 'accepted')}
                              disabled={updating}
                            >
                              {updating ? 'Accepting...' : 'Accept'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-300 text-red-600"
                              onClick={() => handleSessionAction(session._id, 'declined')}
                              disabled={updating}
                            >
                              {updating ? 'Removing...' : 'Decline & Remove'}
                            </Button>
                          </>
                        )}
                        {session.requestStatus === 'accepted' && (
                          <Badge variant="success" className="bg-green-100 text-green-800">
                            ✅ Accepted
                          </Badge>
                        )}
                        {session.requestStatus === 'declined' && (
                          <Badge variant="destructive" className="bg-red-100 text-red-800">
                            ❌ Declined
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accepted Sessions */}
        {sessions.filter(s => s.requestStatus === 'accepted').length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Accepted sessions scheduled with migrants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.filter(s => s.requestStatus === 'accepted').map((session) => (
                  <div key={session._id} className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            {session.migrantName || 'Unknown Migrant'}
                          </h3>
                          <Badge variant="success" className="bg-green-100 text-green-800">
                            ✅ Accepted
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>Purpose:</strong> {session.purpose || 'General consultation'}</p>
                          <p><strong>Budget:</strong> {session.budget || 'Not specified'}</p>
                          <p><strong>Timeline:</strong> {session.timeline || 'Not specified'}</p>
                          <p><strong>Accepted:</strong> {new Date(session.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          Contact Migrant
                        </Button>
                        <Button size="sm" variant="outline">
                          Schedule Call
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardGuide;