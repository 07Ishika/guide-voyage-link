import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import apiService from "../services/api";
import { useApiData, useApiMutation } from "../hooks/useApi";
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Clock, 
  Languages, 
  Award, 
  Video, 
  MessageSquare, 
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Globe,
  Zap,
  Heart,
  CheckCircle,
  XCircle,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const MigrantRequests = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSpecialization, setFilterSpecialization] = useState("all");

  // Get current user data
  const { data: currentUser, loading: userLoading } = useApiData(
    () => apiService.getCurrentUser(),
    []
  );

  // Fetch session requests for this specific guide
  const { data: requests, loading: requestsLoading, error: requestsError, refetch: refetchRequests } = useApiData(
    () => {
      if (!currentUser?._id) return Promise.resolve([]);
      return apiService.getGuideSessions({ 
        guideId: currentUser._id,
        requestStatus: filterStatus !== 'all' ? filterStatus : undefined
      });
    },
    [currentUser?._id, filterStatus, filterSpecialization]
  );

  // API mutation for creating new requests
  const { loading: createLoading, error: createError, success: createSuccess, mutate: createRequest, reset: resetCreate } = useApiMutation();

  // Mock migrant data
  const mockMigrants = [
    {
      id: "m1",
      name: "Priya Sharma",
      location: "Mumbai, India",
      destination: "Toronto, Canada",
      purpose: "Tech Immigration",
      languages: ["English", "Hindi"],
      experience: "3+ years",
      response: "< 2 hours",
      rating: "4.9",
      reviews: "127",
      success: "89%",
      price: "$50 USD",
      status: "pending",
      urgency: "high",
      budget: "$40-60",
      timeline: "3-6 months"
    },
    {
      id: "m2", 
      name: "Anita Patel",
      location: "Delhi, India", 
      destination: "Sydney, Australia",
      purpose: "Skilled Migration",
      languages: ["English", "Hindi", "Gujarati"],
      experience: "5+ years",
      response: "< 3 hours",
      rating: "4.9",
      reviews: "89",
      success: "67%",
      price: "$60 USD",
      status: "pending",
      urgency: "medium",
      budget: "$50-70",
      timeline: "6-12 months"
    },
    {
      id: "m3",
      name: "Rahul Mehta", 
      location: "Bangalore, India",
      destination: "Berlin, Germany", 
      purpose: "EU Blue Card",
      languages: ["English", "German", "Hindi"],
      experience: "7+ years",
      response: "< 1 hour",
      rating: "4.8",
      reviews: "203",
      success: "156%",
      price: "$45 USD",
      status: "pending",
      urgency: "high",
      budget: "$40-50",
      timeline: "2-4 months"
    },
    {
      id: "m4",
      name: "Sofia Rodriguez",
      location: "Mexico City, Mexico",
      destination: "Vancouver, Canada",
      purpose: "Family Sponsorship",
      languages: ["English", "Spanish"],
      experience: "2+ years",
      response: "< 4 hours",
      rating: "4.7",
      reviews: "45",
      success: "78%",
      price: "$55 USD",
      status: "pending",
      urgency: "medium",
      budget: "$45-65",
      timeline: "8-15 months"
    }
  ];

  const filteredMigrants = mockMigrants.filter(migrant => {
    const matchesSearch = migrant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         migrant.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || migrant.status === filterStatus;
    const matchesSpecialization = filterSpecialization === "all" || migrant.purpose === filterSpecialization;
    
    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "low": return "text-green-500 bg-green-500/10 border-green-500/20";
      default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Migrant{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Requests
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Connect with migrants seeking your expertise. Review requests and start helping people achieve their migration dreams.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              <div className="bg-card border rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">{mockMigrants.length}</div>
                <div className="text-sm text-muted-foreground">Active Requests</div>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="text-2xl font-bold text-secondary">24h</div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="text-2xl font-bold text-accent">$45-60</div>
                <div className="text-sm text-muted-foreground">Price Range</div>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="text-2xl font-bold text-green-500">94%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-6 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name, specialization, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Tech Immigration">Tech Immigration</SelectItem>
                  <SelectItem value="Skilled Migration">Skilled Migration</SelectItem>
                  <SelectItem value="EU Blue Card">EU Blue Card</SelectItem>
                  <SelectItem value="Family Sponsorship">Family Sponsorship</SelectItem>
                </SelectContent>
              </Select>

              {/* Create Session Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Session</DialogTitle>
                    <DialogDescription>
                      Set up a session that migrants can book with you.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Session Title</label>
                      <Input placeholder="e.g., Tech Immigration Consultation" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Specialization</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech">Tech Immigration</SelectItem>
                          <SelectItem value="skilled">Skilled Migration</SelectItem>
                          <SelectItem value="family">Family Sponsorship</SelectItem>
                          <SelectItem value="business">Business Visa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Price per Session</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input placeholder="50" className="pl-8" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea placeholder="Describe what migrants can expect from this session..." />
                    </div>
                    <Button className="w-full">Create Session</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Session Requests Grid */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          {sessionsLoading && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">Loading requests...</div>
            </div>
          )}

          {sessionsError && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-2">Error loading requests: {sessionsError}</div>
              <Button onClick={refetchSessions} variant="outline">Retry</Button>
            </div>
          )}

          {!sessionsLoading && sessions.length === 0 && (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No migrant requests yet</h3>
                <p className="text-muted-foreground">
                  When migrants request consultations with you, they'll appear here.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6">
            {filteredSessions.map((session) => (
              <Card key={session._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {session.migrantName?.split(' ').map(n => n[0]).join('') || 'M'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{session.migrantName || 'Migrant'}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{session.migrantEmail}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={`text-xs ${getStatusColor(session.requestStatus || session.status)}`}>
                        {session.requestStatus || session.status}
                      </Badge>
                      {session.urgency && (
                        <Badge variant="outline" className={`text-xs ${getUrgencyColor(session.urgency)}`}>
                          {session.urgency} priority
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">{session.title}</h4>
                    <p className="text-sm text-muted-foreground">{session.notes || session.purpose}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-medium">{session.budget}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-muted-foreground">Timeline:</span>
                      <span className="font-medium">{session.timeline}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="text-muted-foreground">Preferred:</span>
                      <span className="font-medium">{session.preferredTime || 'Flexible'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{session.duration || 60} min</span>
                    </div>
                  </div>

                  {session.specificQuestions && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <h5 className="text-sm font-medium mb-1">Specific Questions:</h5>
                      <p className="text-sm text-muted-foreground">{session.specificQuestions}</p>
                    </div>
                  )}

                  {session.requestStatus === 'pending' && (
                    <div className="flex space-x-2 pt-4 border-t border-border">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleSessionAction(session._id, 'accepted')}
                        disabled={updateLoading}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSessionAction(session._id, 'declined')}
                        disabled={updateLoading}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  )}

                  {session.requestStatus === 'accepted' && (
                    <div className="flex space-x-2 pt-4 border-t border-border">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
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
        </div>
      </section>
    </div>
  );
};

export default MigrantRequests;


