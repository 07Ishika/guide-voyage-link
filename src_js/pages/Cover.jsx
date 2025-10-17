import { Button } from "@/components/ui/button";
import { Users, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import ExploreNowButton from "../components/GoogleLoginCover";
import ThemeToggle from "../components/ThemeToggle";

const Cover = () => {

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f6f8ff] via-[#eef2ff] to-white dark:from-[#0b0620] dark:via-[#14112d] dark:to-[#1a1240]">
      {/* Subtle gradient blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[26rem] h-[26rem] sm:w-[34rem] sm:h-[34rem] lg:w-[40rem] lg:h-[40rem] rounded-full bg-primary/15 dark:bg-primary/20 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[30rem] h-[30rem] sm:w-[40rem] sm:h-[40rem] lg:w-[50rem] lg:h-[50rem] rounded-full bg-secondary/8 dark:bg-secondary/20 blur-3xl"></div>
      {/* Light-mode purple accent circles to match reference */}
      <div className="pointer-events-none absolute top-16 right-6 w-[28rem] h-[28rem] rounded-full bg-[#a78bfa]/30 blur-2xl dark:hidden"></div>
      <div className="pointer-events-none absolute top-1/2 left-8 -translate-y-1/2 w-[22rem] h-[22rem] rounded-full bg-[#c4b5fd]/30 blur-2xl dark:hidden"></div>
      <div className="pointer-events-none absolute -top-10 right-1/4 w-[34rem] h-[34rem] rounded-full bg-[#93c5fd]/20 blur-2xl dark:hidden"></div>

      {/* Top-right controls (glassmorphism) */}
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6 z-20">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-10 md:py-14 lg:py-20 relative z-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12 items-start">
          {/* Left: Headline */}
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">AI + Human guidance for migrants</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
              Welcome to <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Voyagery</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Meet verified guides abroad, get personalized 1:1 help, and make confident steps in your migration journey.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <a href="/home">
                <Button variant="hero" size="lg" className="shadow-glow group">
                  Continue to App
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="/guides">
                <Button variant="outline" size="lg" className="border-primary/20 hover:border-primary/40">
                  Explore Guides
                </Button>
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-card/60 border border-border rounded-xl p-5">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Expert Guides</div>
              </div>
              <div className="bg-card/60 border border-border rounded-xl p-5">
                <div className="text-2xl font-bold text-secondary">50+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div className="bg-card/60 border border-border rounded-xl p-5">
                <div className="text-2xl font-bold text-accent">25K+</div>
                <div className="text-sm text-muted-foreground">Success Stories</div>
              </div>
            </div>
          </div>

          {/* Right: Get Started Card */}
          <aside className="w-full max-w-md mx-auto lg:mx-0 bg-white/70 dark:bg-card/60 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-foreground">Get Started</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Explore the app and choose your role to get started.
            </p>

            <div className="mt-6 space-y-3">
              <ExploreNowButton />
              <a href="/home" className="block">
                <Button className="w-full" variant="outline">
                  View Pricing Plans
                </Button>
              </a>
            </div>

            <div className="mt-6 rounded-lg border border-border p-3 bg-background/60">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <div>
                  <div className="text-sm font-medium">Demo Mode Available</div>
                  <div className="text-xs text-muted-foreground">Try the app with demo data or sign in with Google.</div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground">Trusted by migrants worldwide</p>
              <div className="mt-3 flex items-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 500+ Guides</span>
                <span>85% Success Rate</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cover;


