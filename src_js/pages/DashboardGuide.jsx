import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Clock, 
  MapPin, 
  DollarSign, 
  MessageCircle, 
  Calendar,
  User,
  Star,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "../services/api";
import { useApiData, useApiMutation } from "../hooks/useApi";

const DashboardGuide = () => {
  const { toast } = useToast();
  
  // Get current user data
  const { data: currentUser, loading: userLoading } = useApiData(
    () => apiService.getCurrentUser(),
    []
  );

  // Fetch requests for this guide
  const { data: requests = [], loading: requestsLoading, error: requestsError, refetch: refetchRequests } = useApiData(
    () => apiService.getMigrantRequests({ guideId: currentUser?._id }),
    [currentUser?._id]
  );

  // API mutation for updating request status
  const { loading: updateLoading, mutate: updateRequest } = useApiMutation();

  const handleRequestAction = async (requestId, status) => {
    try {
      await updateRequest(() => apiService.updateMigrantRequest(requestId, { status }));
      
      toast({
        title: `Request ${status === 'accepted' ? 'Accepted' : 'Declined'}`,
        description: `You have ${status === 'accepted' ? 'accepted' : 'declined'} the request.`,
      });
      
      refetchRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update request status.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'accepted':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'declined':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'completed':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'low':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  if (userLoading || requestsLoading) {
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="text-center">
          <div className="text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please log in to access the guide dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Guide Dashboard</h1>
          <p className="text-muted-foreground">Manage your consultation requests and sessions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{requests.length}</div>
              <div className="text-sm text-muted-foreground">Total Requests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                {requests.filter(r => r.status === 'accepted').length}
              </div>
              <div className="text-sm text-muted-foreground">Accepted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {requests.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">
                {requests.filter(r => r.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Requests Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Consultation Requests</h2>
            <Badge variant="outline" className="text-sm">
              {requests.length} request{requests.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {requestsError && (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">Error loading requests: {requestsError}</div>
              <Button onClick={refetchRequests} variant="outline">Retry</Button>
            </div>
          )}

          {requests.length === 0 && !requestsLoading && (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
                <p className="text-muted-foreground">
                  When migrants request consultations with you, they'll appear here.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {requests.map((request) => (
              <Card key={request._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {request.migrantName?.split(' ').map(n => n[0]).join('') || 'M'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{request.migrantName || 'Migrant'}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{request.migrantEmail}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                        {request.status}
                      </Badge>
                      {request.urgency && (
                        <Badge variant="outline" className={`text-xs ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency} priority
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">{request.title}</h4>
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-medium">{request.budget}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-muted-foreground">Timeline:</span>
                      <span className="font-medium">{request.timeline}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="text-muted-foreground">Preferred:</span>
                      <span className="font-medium">{request.preferredTime || 'Flexible'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{request.guideLocation}</span>
                    </div>
                  </div>

                  {request.specificQuestions && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <h5 className="text-sm font-medium mb-1">Specific Questions:</h5>
                      <p className="text-sm text-muted-foreground">{request.specificQuestions}</p>
                    </div>
                  )}

                  {request.status === 'pending' && (
                    <div className="flex space-x-2 pt-4 border-t border-border">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleRequestAction(request._id, 'accepted')}
                        disabled={updateLoading}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRequestAction(request._id, 'declined')}
                        disabled={updateLoading}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  )}

                  {request.status === 'accepted' && (
                    <div className="flex space-x-2 pt-4 border-t border-border">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardGuide;


