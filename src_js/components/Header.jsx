import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

export const Header = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine if user is a guide or migrant based on route
  const isGuide = location.pathname === '/guide' || location.pathname === '/home/guide' || location.pathname === '/migrant-requests' || location.pathname === '/guide/profile' || location.pathname === '/guide/community';
  const isMigrant = !isGuide;
  

  // Initialize theme on mount
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <a 
                href="/" 
                className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform"
              >
                Voyagery
              </a>
            </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href={isGuide ? "/guide/community" : "/community"} className="text-muted-foreground hover:text-primary transition-smooth">
              Community
            </a>
            {isGuide ? (
              <a href="/migrant-requests" className="text-muted-foreground hover:text-primary transition-smooth">
                Migrant Requests
              </a>
            ) : (
              <a href="/guides" className="text-muted-foreground hover:text-primary transition-smooth">
                Find Guides
              </a>
            )}
            {isGuide ? (
              <a href="#features" className="text-muted-foreground hover:text-primary transition-smooth">
                Features
              </a>
            ) : (
              <a href="/cost-of-living" className="text-muted-foreground hover:text-primary transition-smooth">
                Costlytic
              </a>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-muted"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                Sign In
              </Button>
              <Link to={isGuide ? "/guide/profile" : "/profile"}>
                <Button variant="hero" className="shadow-glow">
                  Profile
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-up">
            <nav className="flex flex-col space-y-4">
              <a href={isGuide ? "/guide/community" : "/community"} className="text-muted-foreground hover:text-primary transition-smooth py-2">
                Community
              </a>
              {isGuide ? (
                <a href="/migrant-requests" className="text-muted-foreground hover:text-primary transition-smooth py-2">
                  Migrant Requests
                </a>
              ) : (
                <a href="/guides" className="text-muted-foreground hover:text-primary transition-smooth py-2">
                  Find Guides
                </a>
              )}
              {isGuide ? (
                <a href="#features" className="text-muted-foreground hover:text-primary transition-smooth py-2">
                  Features
                </a>
              ) : (
                <a href="/cost-of-living" className="text-muted-foreground hover:text-primary transition-smooth py-2">
                  Costlytic
                </a>
              )}
              <div className="pt-4 space-y-3">
                <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary">
                  Sign In
                </Button>
                <Link to={isGuide ? "/guide/profile" : "/profile"}>
                  <Button variant="hero" className="w-full shadow-glow">
                    Profile
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
