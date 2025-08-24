import { Card, CardContent } from "@/components/ui/card";
import { 
  Video, 
  DollarSign, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Calculator,
  Shield,
  Globe,
  Clock,
  Star,
  TrendingUp,
  CheckCircle
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Video,
      title: "1:1 Video Consultations",
      description: "Connect face-to-face with verified guides through secure video calls",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "Clear, upfront pricing with secure payment processing",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: Users,
      title: "Verified Community",
      description: "All guides are verified residents with proven success stories",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: BookOpen,
      title: "Expert Blog Content",
      description: "In-depth guides and real experiences from successful migrants",
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      icon: MessageSquare,
      title: "Community Q&A",
      description: "Reddit-style forums with upvoting and expert answers",
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      icon: Calculator,
      title: "Cost Estimator",
      description: "AI-powered tools to estimate living costs in your target country",
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    }
  ];

  const stats = [
    { icon: Globe, label: "Countries Covered", value: "50+", color: "text-primary" },
    { icon: Star, label: "Average Rating", value: "4.9/5", color: "text-accent" },
    { icon: Clock, label: "Response Time", value: "< 2 hrs", color: "text-secondary" },
    { icon: TrendingUp, label: "Success Rate", value: "94%", color: "text-green-500" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold">
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Successful Migration
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From expert consultations to community support, we provide all the tools and resources you need for your migration journey.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover:shadow-glow transition-all duration-300 group border-border/50 hover:border-primary/30"
            >
              <CardContent className="p-6 space-y-4">
                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-3 group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="space-y-1">
                <div className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-card border border-border/50">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Trusted & Secure Platform</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Verified Guide Profiles</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Secure Payment Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};