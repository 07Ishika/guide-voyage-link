import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Header = () => {
  const location = useLocation();
  const { currentUser, logout, isGuide, isMigrant } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  

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
            {isGuide && (
              <a href="/dashboard-guide" className="text-muted-foreground hover:text-primary transition-smooth">
                Dashboard
              </a>
            )}
            <a href={isGuide ? "/guide/community" : "/community"} className="text-muted-foreground hover:text-primary transition-smooth">
              Community
            </a>
            {isGuide ? (
              <a href="/migrant-requests" className="text-muted-foreground hover:text-primary transition-smooth">
                Find Migrants
              </a>
            ) : (
              <a href="/guides" className="text-muted-foreground hover:text-primary transition-smooth">
                Find Guides
              </a>
            )}
            {!isGuide && (
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
              {currentUser ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {currentUser.displayName}
                  </span>
                  <Link to={isGuide ? "/guide/profile" : "/profile"}>
                    <Button variant="hero" className="shadow-glow">
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-muted-foreground hover:text-primary"
                    onClick={async () => {
                      await logout();
                      window.location.href = '/';
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/role">
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/role">
                    <Button variant="hero" className="shadow-glow">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
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
              {isGuide && (
                <a href="/dashboard-guide" className="text-muted-foreground hover:text-primary transition-smooth py-2">
                  Dashboard
                </a>
              )}
              <a href={isGuide ? "/guide/community" : "/community"} className="text-muted-foreground hover:text-primary transition-smooth py-2">
                Community
              </a>
              {isGuide ? (
                <a href="/migrant-requests" className="text-muted-foreground hover:text-primary transition-smooth py-2">
                  Find Migrants
                </a>
              ) : (
                <a href="/guides" className="text-muted-foreground hover:text-primary transition-smooth py-2">
                  Find Guides
                </a>
              )}
              {!isGuide && (
                <a href="/cost-of-living" className="text-muted-foreground hover:text-primary transition-smooth py-2">
                  Costlytic
                </a>
              )}
              <div className="pt-4 space-y-3">
                {currentUser ? (
                  <>
                    <div className="text-sm text-muted-foreground text-center py-2">
                      {currentUser.displayName}
                    </div>
                    <Link to={isGuide ? "/guide/profile" : "/profile"}>
                      <Button variant="hero" className="w-full shadow-glow">
                        Profile
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full text-muted-foreground hover:text-primary"
                      onClick={async () => {
                        await logout();
                        window.location.href = '/';
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/role">
                      <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/role">
                      <Button variant="hero" className="w-full shadow-glow">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
