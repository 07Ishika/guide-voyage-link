import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { RoleSelection } from "@/components/RoleSelection";
import { CommunitySection } from "@/components/CommunitySection";
import { Footer } from "@/components/Footer";

const Index = () => {
  const { currentUser, isGuide } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect guides to their specific dashboard
    if (currentUser && isGuide) {
      navigate('/home/guide');
    }
  }, [currentUser, isGuide, navigate]);

  // Show the beautiful original home page for both authenticated migrants and non-authenticated users
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
