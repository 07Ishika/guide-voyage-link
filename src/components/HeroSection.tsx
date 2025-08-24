import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, Video } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const HeroSection = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-hero opacity-5"></div>
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-secondary/10 blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Trusted by 10,000+ migrants</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Your Journey to{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Global Success
                </span>
                {" "}Starts Here
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Connect with verified guides abroad for personalized 1:1 consultations, community insights, and expert advice for your migration journey.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="shadow-glow group">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="lg" className="group border-primary/20 hover:border-primary/40">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Expert Guides</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">50+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">25K+</div>
                <div className="text-sm text-muted-foreground">Success Stories</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Global migration consultation platform"
                className="w-full rounded-2xl shadow-soft hover:shadow-glow transition-all duration-500"
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-card border border-border rounded-xl p-4 shadow-soft animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium">Live Call</div>
                  <div className="text-xs text-muted-foreground">Guide Available</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-soft animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-secondary font-bold text-sm">98%</span>
                </div>
                <div>
                  <div className="text-sm font-medium">Success Rate</div>
                  <div className="text-xs text-muted-foreground">Visa Approval</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};