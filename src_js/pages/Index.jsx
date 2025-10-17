import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { RoleSelection } from "@/components/RoleSelection";
import { CommunitySection } from "@/components/CommunitySection";
import { Footer } from "@/components/Footer";

const Index = () => {
  const { currentUser, isGuide, isMigrant } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect guides from /home to /home/guide, don't redirect if already on correct page
    if (currentUser && currentUser.role === 'guide' && window.location.pathname === '/home') {
      navigate('/home/guide', { replace: true });
    }
  }, [currentUser, navigate]);

  // If user is a migrant, show migrant-specific home page
  if (currentUser && isMigrant) {
    return (
      <div className="min-h-screen bg-background">
        <main>
          <HeroSection />
          <FeaturesSection />
          <CommunitySection />
        </main>
        <Footer />
      </div>
    );
  }

  // Show the original home page for non-authenticated users
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <FeaturesSection />
        {!currentUser && <RoleSelection />}
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
