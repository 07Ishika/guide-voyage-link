import React from 'react';
import { Button } from "@/components/ui/button";
import { Calculator } from 'lucide-react';
import { useCalculator } from '../contexts/CalculatorContext';

const FloatingCalculatorButton = () => {
  const { toggleCalculator } = useCalculator();

  return (
    <Button
      onClick={toggleCalculator}
      className="fixed bottom-6 left-6 z-40 rounded-full w-12 h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
      size="icon"
    >
      <Calculator className="h-5 w-5 text-white" />
    </Button>
  );
};

export default FloatingCalculatorButton;

