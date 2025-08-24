import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Mail, Phone, MapPin, Twitter, Linkedin, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Voyageory
              </span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Connecting aspiring migrants with verified guides worldwide. Your journey to global success starts here.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Instagram className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* For Voyagers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">For Voyagers</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Find Guides
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Book Consultations
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Community Q&A
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Cost Estimator
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Success Stories
              </a>
            </div>
          </div>

          {/* For Guides */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">For Guides</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Become a Guide
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Guide Dashboard
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Write Blogs
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Earnings Center
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Guide Resources
              </a>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Support</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@voyageory.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Help Center
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 Voyageory. All rights reserved.
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for aspiring global citizens</span>
          </div>
        </div>
      </div>
    </footer>
  );
};