import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";

export const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
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
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Voyageory
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-smooth">
              Features
            </a>
            <a href="#community" className="text-muted-foreground hover:text-primary transition-smooth">
              Community
            </a>
            <a href="#guides" className="text-muted-foreground hover:text-primary transition-smooth">
              For Guides
            </a>
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
              <Button variant="hero" className="shadow-glow">
                Get Started
              </Button>
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
              <a href="#features" className="text-muted-foreground hover:text-primary transition-smooth py-2">
                Features
              </a>
              <a href="#community" className="text-muted-foreground hover:text-primary transition-smooth py-2">
                Community
              </a>
              <a href="#guides" className="text-muted-foreground hover:text-primary transition-smooth py-2">
                For Guides
              </a>
              <div className="pt-4 space-y-3">
                <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary">
                  Sign In
                </Button>
                <Button variant="hero" className="w-full shadow-glow">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};