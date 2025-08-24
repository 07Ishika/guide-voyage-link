import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Footer } from "@/components/Footer";
import {
  MapPin, 
  Star, 
  DollarSign, 
  Video, 
  MessageCircle, 
  Filter,
  Search,
  Calendar,
  Globe,
  Award,
  Users
} from "lucide-react";

interface Guide {
  id: number;
  name: string;
  country: string;
  city: string;
  specialization: string[];
  rating: number;
  reviews: number;
  price: number;
  currency: string;
  avatar: string;
  languages: string[];
  experience: string;
  successStories: number;
  responseTime: string;
  availability: "Available" | "Busy" | "Offline";
  verified: boolean;
}

export const Guides = () => {
  const [guides] = useState<Guide[]>([
    {
      id: 1,
      name: "Priya Sharma",
      country: "Canada",
      city: "Toronto",
      specialization: ["Tech Immigration", "Express Entry", "Job Search"],
      rating: 4.9,
      reviews: 127,
      price: 50,
      currency: "USD",
      avatar: "PS",
      languages: ["English", "Hindi"],
      experience: "5+ years",
      successStories: 89,
      responseTime: "< 2 hours",
      availability: "Available",
      verified: true
    },
    {
      id: 2,
      name: "Rahul Mehta",
      country: "Germany",
      city: "Berlin",
      specialization: ["EU Blue Card", "German Language", "Startup Visa"],
      rating: 4.8,
      reviews: 203,
      price: 45,
      currency: "USD",
      avatar: "RM",
      languages: ["English", "German", "Hindi"],
      experience: "7+ years",
      successStories: 156,
      responseTime: "< 1 hour",
      availability: "Available",
      verified: true
    },
    {
      id: 3,
      name: "Anita Patel",
      country: "Australia",
      city: "Sydney",
      specialization: ["Skilled Migration", "Healthcare Visa", "Family Visa"],
      rating: 4.9,
      reviews: 89,
      price: 60,
      currency: "USD",
      avatar: "AP",
      languages: ["English", "Hindi", "Gujarati"],
      experience: "6+ years",
      successStories: 67,
      responseTime: "< 3 hours",
      availability: "Busy",
      verified: true
    },
    {
      id: 4,
      name: "Vikram Singh",
      country: "United Kingdom",
      city: "London",
      specialization: ["Skilled Worker Visa", "Global Talent", "Investment"],
      rating: 4.7,
      reviews: 156,
      price: 55,
      currency: "USD",
      avatar: "VS",
      languages: ["English", "Hindi", "Punjabi"],
      experience: "4+ years",
      successStories: 98,
      responseTime: "< 4 hours",
      availability: "Available",
      verified: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"rating" | "price" | "reviews">("rating");

  const countries = ["All", "Canada", "Germany", "Australia", "United Kingdom"];

  const filteredGuides = guides
    .filter(guide => 
      (selectedCountry === "All" || guide.country === selectedCountry) &&
      (guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       guide.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price":
          return a.price - b.price;
        case "reviews":
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "text-green-500 bg-green-100 dark:bg-green-900/20";
      case "Busy":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20";
      case "Offline":
        return "text-red-500 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-lg sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">Find Your Guide</h1>
              <p className="text-muted-foreground">Connect with verified migration experts from around the world</p>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search guides by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price">Lowest Price</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Verified Guides</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Globe className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary">50+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent">94%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-500">4.8</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <Card key={guide.id} className="hover:shadow-glow transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {guide.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{guide.name}</h3>
                        {guide.verified && (
                          <Badge className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {guide.city}, {guide.country}
                      </div>
                    </div>
                  </div>
                  
                  <Badge className={`text-xs ${getAvailabilityColor(guide.availability)}`}>
                    {guide.availability}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Specializations */}
                <div>
                  <div className="text-sm font-medium mb-2">Specializations:</div>
                  <div className="flex flex-wrap gap-1">
                    {guide.specialization.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{guide.rating}</span>
                    <span className="text-muted-foreground">({guide.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4 text-green-500" />
                    <span className="font-medium">{guide.successStories}</span>
                    <span className="text-muted-foreground">success</span>
                  </div>
                </div>

                {/* Languages & Experience */}
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Languages: </span>
                    <span>{guide.languages.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Experience: </span>
                    <span>{guide.experience}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Response: </span>
                    <span>{guide.responseTime}</span>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-accent" />
                      <span className="text-lg font-bold text-accent">
                        {guide.price} {guide.currency}
                      </span>
                      <span className="text-sm text-muted-foreground">/session</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="hero" className="flex-1 group-hover:shadow-glow">
                      <Video className="w-4 h-4 mr-2" />
                      Book Call
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No guides found matching your criteria.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Guides;