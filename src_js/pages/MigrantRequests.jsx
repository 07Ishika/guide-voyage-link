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
  Heart
} from "lucide-react";

const MigrantRequests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSpecialization, setFilterSpecialization] = useState("all");

  // Fetch migrant requests from API
  const { data: requests, loading: requestsLoading, error: requestsError, refetch: refetchRequests } = useApiData(
    () => apiService.getMigrantRequests({
      status: filterStatus !== 'all' ? filterStatus : undefined,
      specialization: filterSpecialization !== 'all' ? filterSpecialization : undefined
    }),
    [filterStatus, filterSpecialization]
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

      {/* Requests Grid */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMigrants.map((migrant) => (
              <Card key={migrant.id} className="bg-card border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {migrant.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-foreground text-lg">{migrant.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`px-2 py-1 text-xs ${getUrgencyColor(migrant.urgency)}`}>
                        {migrant.urgency} priority
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {migrant.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{migrant.location} → {migrant.destination}</span>
                    </div>
                    
                    <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                      <span className="text-primary font-medium">{migrant.purpose}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Languages className="w-4 h-4 text-secondary" />
                        <span>{migrant.languages.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-accent" />
                        <span>{migrant.response}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Budget and Timeline */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-foreground">Budget</span>
                      </div>
                      <span className="text-muted-foreground">{migrant.budget}</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-foreground">Timeline</span>
                      </div>
                      <span className="text-muted-foreground">{migrant.timeline}</span>
                    </div>
                  </div>

                  {/* Guide Performance */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-foreground font-medium">{migrant.rating}</span>
                        <span className="text-muted-foreground">({migrant.reviews})</span>
                      </div>
                      <div className="text-green-600 dark:text-green-400 font-medium">{migrant.success} success</div>
                    </div>
                    <div className="text-right">
                      <div className="text-foreground font-bold">{migrant.price}</div>
                      <div className="text-muted-foreground text-sm">per session</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90 text-white" 
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Accept Call
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-border text-foreground hover:bg-muted"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMigrants.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-2">No requests found</div>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MigrantRequests;


