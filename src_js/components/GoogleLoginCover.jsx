import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ExploreNowButton = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    // Navigate to role selection page
    navigate('/role');
  };

  return (
    <div style={{ marginTop: 16, textAlign: 'center' }}>
      <Button
        onClick={handleExploreClick}
        className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white border-none"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "12px 20px",
          fontSize: "16px",
          fontWeight: "500"
        }}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        Explore Now
      </Button>
    </div>
  );
};

export default ExploreNowButton;
