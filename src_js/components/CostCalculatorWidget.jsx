import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calculator, 
  X, 
  DollarSign, 
  Home, 
  Utensils, 
  Car, 
  Zap, 
  ShoppingCart,
  Heart,
  Book,
  Gamepad2,
  Shirt,
  Dumbbell,
  Plus,
  Minus
} from 'lucide-react';
import { useCalculator } from '../contexts/CalculatorContext';

const CostCalculatorWidget = () => {
  const { isCalculatorOpen, closeCalculator } = useCalculator();
  const [expenses, setExpenses] = useState({
    rent: 0,
    groceries: 0,
    transport: 0,
    utilities: 0,
    entertainment: 0,
    healthcare: 0,
    education: 0,
    clothing: 0,
    fitness: 0,
    other: 0
  });

  const [currency, setCurrency] = useState('USD');
  const [isMinimized, setIsMinimized] = useState(false);

  const currencies = [
    { value: 'USD', label: 'USD ($)', symbol: '$' },
    { value: 'CAD', label: 'CAD (C$)', symbol: 'C$' },
    { value: 'EUR', label: 'EUR (€)', symbol: '€' },
    { value: 'GBP', label: 'GBP (£)', symbol: '£' },
    { value: 'AUD', label: 'AUD (A$)', symbol: 'A$' },
    { value: 'INR', label: 'INR (₹)', symbol: '₹' }
  ];

  const expenseCategories = [
    { key: 'rent', label: 'Rent/Mortgage', icon: Home, color: 'text-blue-500' },
    { key: 'groceries', label: 'Groceries', icon: Utensils, color: 'text-green-500' },
    { key: 'transport', label: 'Transportation', icon: Car, color: 'text-purple-500' },
    { key: 'utilities', label: 'Utilities', icon: Zap, color: 'text-yellow-500' },
    { key: 'entertainment', label: 'Entertainment', icon: Gamepad2, color: 'text-pink-500' },
    { key: 'healthcare', label: 'Healthcare', icon: Heart, color: 'text-red-500' },
    { key: 'education', label: 'Education', icon: Book, color: 'text-indigo-500' },
    { key: 'clothing', label: 'Clothing', icon: Shirt, color: 'text-orange-500' },
    { key: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'text-teal-500' },
    { key: 'other', label: 'Other', icon: ShoppingCart, color: 'text-gray-500' }
  ];

  const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  const currentCurrency = currencies.find(c => c.value === currency);

  const handleExpenseChange = (key, value) => {
    setExpenses(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetCalculator = () => {
    setExpenses({
      rent: 0,
      groceries: 0,
      transport: 0,
      utilities: 0,
      entertainment: 0,
      healthcare: 0,
      education: 0,
      clothing: 0,
      fitness: 0,
      other: 0
    });
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('costCalculator', JSON.stringify({
      expenses,
      currency,
      timestamp: new Date().toISOString()
    }));
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('costCalculator');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setExpenses(data.expenses || expenses);
        setCurrency(data.currency || currency);
      } catch (error) {
        console.error('Error loading saved calculator data:', error);
      }
    }
  };

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    saveToLocalStorage();
  }, [expenses, currency]);

  if (!isCalculatorOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-80 bg-card/95 backdrop-blur-sm border-border shadow-2xl transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-auto'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              {isMinimized ? 'Calculator' : 'Cost Calculator'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0"
              >
                {isMinimized ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeCalculator}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {!isMinimized && (
            <CardDescription>
              Calculate your monthly expenses
            </CardDescription>
          )}
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="space-y-4">
            {/* Currency Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Currency</label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(curr => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Expense Categories */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {expenseCategories.map(({ key, label, icon: Icon, color }) => (
                <div key={key} className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <div className="flex-1">
                    <label className="text-sm font-medium">{label}</label>
                    <Input
                      type="number"
                      value={expenses[key]}
                      onChange={(e) => handleExpenseChange(key, e.target.value)}
                      placeholder="0"
                      className="w-full mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">Total Monthly:</span>
                <span className="text-lg font-bold text-primary">
                  {currentCurrency?.symbol}{totalExpenses.toLocaleString()}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetCalculator}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={saveToLocalStorage}
                  className="flex-1"
                >
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default CostCalculatorWidget;
