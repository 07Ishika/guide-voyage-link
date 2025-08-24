import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Globe, Heart, DollarSign, Users, BookOpen, MessageCircle, ArrowRight } from "lucide-react";

export const RoleSelection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Journey Path
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're seeking guidance or sharing your expertise, Voyageory connects you with the right community.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Voyager Card */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
            <CardHeader className="relative z-10 pb-6">
              <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">I'm a Voyager</CardTitle>
              <CardDescription className="text-base">
                Aspiring migrant seeking expert guidance and community support for my journey abroad.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Book 1:1 video consultations with verified guides</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Access community Q&A and expert blogs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Use AI-powered cost estimators and tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Connect with other aspiring migrants</span>
                </div>
              </div>
              
              <div className="pt-4">
                <a href="/guides">
                  <Button variant="hero" className="w-full shadow-glow group">
                    Start as Voyager
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Guide Card */}
          <Card className="relative overflow-hidden border-2 hover:border-secondary/50 transition-all duration-300 hover:shadow-glow group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
            <CardHeader className="relative z-10 pb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">I'm a Guide</CardTitle>
              <CardDescription className="text-base">
                Successful migrant abroad, ready to share my experience and help others succeed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-secondary" />
                  <span>Earn money through paid consultation calls</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-secondary" />
                  <span>Write blogs and share your expertise</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-secondary" />
                  <span>Build your reputation and client base</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-secondary" />
                  <span>Help others achieve their migration dreams</span>
                </div>
              </div>
              
              <div className="pt-4">
                <a href="/guides">
                  <Button variant="secondary" className="w-full shadow-glow group">
                    Become a Guide
                    <DollarSign className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Community Driven</h3>
            <p className="text-muted-foreground">Join thousands of migrants sharing experiences and supporting each other.</p>
          </div>
          
          <div className="text-center space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold">Expert Knowledge</h3>
            <p className="text-muted-foreground">Access curated blogs, guides, and real experiences from successful migrants.</p>
          </div>
          
          <div className="text-center space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold">1:1 Support</h3>
            <p className="text-muted-foreground">Get personalized advice through video calls with verified experts.</p>
          </div>
        </div>
      </div>
    </section>
  );
};