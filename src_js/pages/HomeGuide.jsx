import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { CommunitySection } from "@/components/CommunitySection";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Heart, DollarSign, Users, BookOpen, MessageCircle, ArrowRight, Calendar, Star, TrendingUp, MapPin, Clock, Languages, Award, Video, MessageSquare, Plane, Globe, Orbit } from "lucide-react";
import { readBookings, updateBooking } from "@/lib/storage";
import { motion } from "framer-motion";

const HomeGuide = () => {
  const [requests, setRequests] = useState([]);
  const refresh = () => setRequests(readBookings());
  useEffect(() => { refresh(); }, []);

  const act = (id, status) => {
    updateBooking(id, { status });
    refresh();
  };

  // Mock migrant data for demonstration
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
      status: "pending"
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
      status: "pending"
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
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background dark:bg-gradient-to-br dark:from-[#0d1117] dark:via-[#161b22] dark:to-[#21262d]">
      {/* Futuristic Background Elements (only in dark mode) */}
      <div className="absolute inset-0 pointer-events-none hidden dark:block">
        {/* Glowing journey paths */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 rounded-full bg-green-500/10 blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        {/* Journey connection lines */}
        <div className="absolute top-32 left-1/3 w-px h-32 bg-gradient-to-b from-blue-400/30 to-transparent"></div>
        <div className="absolute top-48 right-1/4 w-px h-24 bg-gradient-to-b from-purple-400/30 to-transparent"></div>
        <div className="absolute bottom-32 left-1/2 w-px h-28 bg-gradient-to-b from-green-400/30 to-transparent"></div>
      </div>
      
      <main className="relative z-10">
        {/* Hero Section - GitHub Style */}
        <section className="py-20 px-6">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6">
                Let's build{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                  dreams
                </span>{" "}
                together
              </h1>
              {/* Planets scene with animated flight */}
              <div className="relative h-36 mt-8 hidden md:block">
                {/* Curved flight path */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="flightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35"/>
                      <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.35"/>
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M 10 65 Q 50 25 90 65"
                    stroke="url(#flightGradient)"
                    strokeWidth="1.6"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.6, ease: "easeOut" }}
                  />
                </svg>

                {/* Planets */}
                <motion.div
                  className="absolute left-[8%] top-[60%] -translate-y-1/2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="w-14 h-14 rounded-full gradient-card shadow-glow flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-500" />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  <div className="w-16 h-16 rounded-full gradient-card shadow-glow flex items-center justify-center">
                    <Orbit className="w-7 h-7 text-purple-500" />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute right-[8%] top-[60%] -translate-y-1/2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="w-12 h-12 rounded-full gradient-card shadow-glow flex items-center justify-center">
                    <Globe className="w-5 h-5 text-green-500" />
                  </div>
                </motion.div>

                {/* First airplane - stays where it is */}
                <motion.div
                  className="absolute"
                  style={{ left: 0, top: 0 }}
                  initial={{ x: "10%", y: "65%" }}
                  animate={{
                    x: ["10%", "50%", "90%"],
                    y: ["65%", "30%", "65%"],
                    rotate: [10, -5, 10]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="p-2 rounded-full bg-card border shadow-soft">
                    <Plane className="w-5 h-5 text-primary" />
                  </div>
                </motion.div>

                {/* Second airplane - top right */}
                <motion.div
                  className="absolute"
                  style={{ left: 0, top: 0 }}
                  initial={{ x: "85%", y: "15%" }}
                  animate={{
                    x: ["85%", "90%", "80%", "85%"],
                    y: ["15%", "25%", "20%", "15%"],
                    rotate: [-10, 15, -5, -10]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="p-2 rounded-full bg-card border shadow-soft">
                    <Plane className="w-4 h-4 text-secondary" />
                  </div>
                </motion.div>

                {/* Third airplane - bottom right */}
                <motion.div
                  className="absolute"
                  style={{ left: 0, top: 0 }}
                  initial={{ x: "85%", y: "85%" }}
                  animate={{
                    x: ["85%", "90%", "80%", "85%"],
                    y: ["85%", "75%", "80%", "85%"],
                    rotate: [0, -15, 20, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                  <div className="p-2 rounded-full bg-card border shadow-soft">
                    <Plane className="w-4 h-4 text-accent" />
                  </div>
                </motion.div>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Harnessed for guidance. Designed for success. Celebrated for helping migrants achieve their goals. Welcome to the platform guides love.
              </p>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                <div className="bg-card backdrop-blur-sm border rounded-xl p-6">
                  <div className="text-3xl font-bold text-blue-400">500+</div>
                  <div className="text-muted-foreground">Verified Guides</div>
                </div>
                <div className="bg-card backdrop-blur-sm border rounded-xl p-6">
                  <div className="text-3xl font-bold text-purple-400">50+</div>
                  <div className="text-muted-foreground">Countries</div>
                </div>
                <div className="bg-card backdrop-blur-sm border rounded-xl p-6">
                  <div className="text-3xl font-bold text-green-400">94%</div>
                  <div className="text-muted-foreground">Success Rate</div>
                </div>
                <div className="bg-card backdrop-blur-sm border rounded-xl p-6">
                  <div className="text-3xl font-bold text-yellow-400">4.8</div>
                  <div className="text-muted-foreground">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Migrant Requests Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Session Requests from Migrants
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Review and respond to consultation requests from migrants seeking your expertise.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {mockMigrants.map((migrant) => (
                <Card key={migrant.id} className="bg-card backdrop-blur-sm border hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <span className="text-foreground font-semibold text-lg">
                            {migrant.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-foreground text-lg">{migrant.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-muted-foreground">Verified</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        migrant.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                        migrant.status === 'accepted' ? 'bg-green-500/20 text-green-400' : 
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {migrant.status}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span>{migrant.location} → {migrant.destination}</span>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
                        <span className="text-blue-400 font-medium">{migrant.purpose}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Languages className="w-4 h-4 text-purple-400" />
                        <span>{migrant.languages.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-green-400" />
                        <span>{migrant.response}</span>
                      </div>
                    </div>

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

                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" 
                        onClick={() => act(migrant.id, "accepted")}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Accept Call
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-border text-foreground hover:bg-muted"
                        onClick={() => act(migrant.id, "declined")}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
};

export default HomeGuide;
