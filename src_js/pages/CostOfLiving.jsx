import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Home,
  Utensils,
  Car,
  ShoppingCart,
  Wifi,
  Zap,
  Droplets,
  MapPin,
  Calculator,
  BarChart3,
  Globe,
  ArrowUpDown,
  Info,
  PieChart as PieChartIcon,
  Radar as RadarIcon
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import { useCalculator } from '../contexts/CalculatorContext';

const CostOfLiving = () => {
  const [selectedCountry, setSelectedCountry] = useState('canada');
  const [selectedCity, setSelectedCity] = useState('toronto');
  const [comparisonCountry, setComparisonCountry] = useState('india');
  const [comparisonCity, setComparisonCity] = useState('mumbai');
  const { openCalculator } = useCalculator();

  // Glassmorphism tooltip styles
  const tooltipStyles = {
    backgroundColor: 'rgba(15, 23, 42, 0.1)', // Very transparent
    border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle white border
    borderRadius: '16px',
    color: '#ffffff',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(20px)',
    padding: '12px 16px'
  };

  // Custom tooltip content formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={tooltipStyles}>
          <p className="text-sm font-medium text-white/90 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-white/80">
              <span style={{ color: entry.color }}>{entry.dataKey}</span>: ${entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const axisStyles = {
    tick: { fill: '#e2e8f0', fontSize: 12, fontWeight: 500 },
    axisLine: { stroke: 'rgba(148, 163, 184, 0.4)' },
    tickLine: { stroke: 'rgba(148, 163, 184, 0.4)' }
  };

  // Animation variants for smooth fade-up effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // Sample cost of living data (in USD)
  const costData = {
    canada: {
      toronto: {
        name: 'Toronto',
        rent: { studio: 1800, oneBedroom: 2200, twoBedroom: 2800, threeBedroom: 3500 },
        food: { groceries: 400, restaurant: 200, fastFood: 80 },
        transport: { public: 120, gas: 200, car: 500 },
        utilities: { electricity: 80, water: 40, internet: 60, phone: 50 },
        other: { healthcare: 100, entertainment: 150, clothing: 100, fitness: 60 }
      },
      vancouver: {
        name: 'Vancouver',
        rent: { studio: 2000, oneBedroom: 2400, twoBedroom: 3000, threeBedroom: 3800 },
        food: { groceries: 450, restaurant: 220, fastFood: 90 },
        transport: { public: 130, gas: 220, car: 550 },
        utilities: { electricity: 90, water: 45, internet: 65, phone: 55 },
        other: { healthcare: 110, entertainment: 160, clothing: 110, fitness: 70 }
      }
    },
    usa: {
      newyork: {
        name: 'New York',
        rent: { studio: 2500, oneBedroom: 3200, twoBedroom: 4200, threeBedroom: 5500 },
        food: { groceries: 500, restaurant: 300, fastFood: 120 },
        transport: { public: 150, gas: 250, car: 600 },
        utilities: { electricity: 100, water: 50, internet: 70, phone: 60 },
        other: { healthcare: 200, entertainment: 200, clothing: 150, fitness: 80 }
      },
      sanfrancisco: {
        name: 'San Francisco',
        rent: { studio: 2800, oneBedroom: 3500, twoBedroom: 4500, threeBedroom: 6000 },
        food: { groceries: 550, restaurant: 350, fastFood: 140 },
        transport: { public: 160, gas: 280, car: 650 },
        utilities: { electricity: 110, water: 55, internet: 75, phone: 65 },
        other: { healthcare: 220, entertainment: 220, clothing: 160, fitness: 90 }
      }
    },
    uk: {
      london: {
        name: 'London',
        rent: { studio: 1800, oneBedroom: 2200, twoBedroom: 2800, threeBedroom: 3500 },
        food: { groceries: 350, restaurant: 250, fastFood: 100 },
        transport: { public: 140, gas: 300, car: 500 },
        utilities: { electricity: 90, water: 50, internet: 50, phone: 40 },
        other: { healthcare: 0, entertainment: 180, clothing: 120, fitness: 70 }
      }
    },
    australia: {
      sydney: {
        name: 'Sydney',
        rent: { studio: 1600, oneBedroom: 2000, twoBedroom: 2600, threeBedroom: 3200 },
        food: { groceries: 400, restaurant: 200, fastFood: 80 },
        transport: { public: 120, gas: 180, car: 450 },
        utilities: { electricity: 100, water: 60, internet: 70, phone: 50 },
        other: { healthcare: 0, entertainment: 150, clothing: 100, fitness: 60 }
      }
    },
    india: {
      mumbai: {
        name: 'Mumbai',
        rent: { studio: 400, oneBedroom: 600, twoBedroom: 900, threeBedroom: 1200 },
        food: { groceries: 150, restaurant: 80, fastFood: 30 },
        transport: { public: 20, gas: 60, car: 200 },
        utilities: { electricity: 30, water: 10, internet: 15, phone: 10 },
        other: { healthcare: 20, entertainment: 50, clothing: 30, fitness: 25 }
      },
      delhi: {
        name: 'Delhi',
        rent: { studio: 300, oneBedroom: 450, twoBedroom: 700, threeBedroom: 950 },
        food: { groceries: 120, restaurant: 60, fastFood: 25 },
        transport: { public: 15, gas: 50, car: 180 },
        utilities: { electricity: 25, water: 8, internet: 12, phone: 8 },
        other: { healthcare: 15, entertainment: 40, clothing: 25, fitness: 20 }
      }
    }
  };

  const countries = [
    { value: 'canada', label: 'Canada', cities: ['toronto', 'vancouver'] },
    { value: 'usa', label: 'United States', cities: ['newyork', 'sanfrancisco'] },
    { value: 'uk', label: 'United Kingdom', cities: ['london'] },
    { value: 'australia', label: 'Australia', cities: ['sydney'] },
    { value: 'india', label: 'India', cities: ['mumbai', 'delhi'] }
  ];

  const getCityData = (country, city) => {
    return costData[country]?.[city] || null;
  };

  const calculateTotalMonthly = (cityData) => {
    if (!cityData) return 0;
    const { rent, food, transport, utilities, other } = cityData;
    return rent.oneBedroom + food.groceries + food.restaurant + transport.public +
      utilities.electricity + utilities.water + utilities.internet + utilities.phone +
      other.healthcare + other.entertainment + other.clothing + other.fitness;
  };

  const currentCityData = getCityData(selectedCountry, selectedCity);
  const comparisonCityData = getCityData(comparisonCountry, comparisonCity);

  const currentTotal = calculateTotalMonthly(currentCityData);
  const comparisonTotal = calculateTotalMonthly(comparisonCityData);
  const difference = currentTotal - comparisonTotal;
  const percentageDiff = comparisonTotal > 0 ? ((difference / comparisonTotal) * 100) : 0;

  // Analytics data preparation
  const getAnalyticsData = () => {
    if (!currentCityData || !comparisonCityData) return null;

    // Calculate category totals
    const currentHousing = currentCityData.rent.oneBedroom;
    const currentFood = currentCityData.food.groceries + currentCityData.food.restaurant;
    const currentTransport = currentCityData.transport.public + currentCityData.transport.gas;
    const currentUtilities = currentCityData.utilities.electricity + currentCityData.utilities.water +
      currentCityData.utilities.internet + currentCityData.utilities.phone;

    const comparisonHousing = comparisonCityData.rent.oneBedroom;
    const comparisonFood = comparisonCityData.food.groceries + comparisonCityData.food.restaurant;
    const comparisonTransport = comparisonCityData.transport.public + comparisonCityData.transport.gas;
    const comparisonUtilities = comparisonCityData.utilities.electricity + comparisonCityData.utilities.water +
      comparisonCityData.utilities.internet + comparisonCityData.utilities.phone;

    // Bar chart data
    const barData = [
      {
        category: 'Housing',
        [currentCityData.name]: currentHousing,
        [comparisonCityData.name]: comparisonHousing
      },
      {
        category: 'Food & Dining',
        [currentCityData.name]: currentFood,
        [comparisonCityData.name]: comparisonFood
      },
      {
        category: 'Transportation',
        [currentCityData.name]: currentTransport,
        [comparisonCityData.name]: comparisonTransport
      },
      {
        category: 'Utilities',
        [currentCityData.name]: currentUtilities,
        [comparisonCityData.name]: comparisonUtilities
      }
    ];

    // Enhanced color palette for dark theme
    const colorPalette = {
      housing: '#6366f1', // Indigo - more vibrant
      food: '#10b981', // Emerald - keep as is
      transport: '#f59e0b', // Amber - keep as is  
      utilities: '#ef4444' // Red - keep as is
    };

    // Pie chart data for current city
    const currentPieData = [
      { name: 'Housing', value: currentHousing, color: colorPalette.housing },
      { name: 'Food & Dining', value: currentFood, color: colorPalette.food },
      { name: 'Transportation', value: currentTransport, color: colorPalette.transport },
      { name: 'Utilities', value: currentUtilities, color: colorPalette.utilities }
    ];

    // Pie chart data for comparison city
    const comparisonPieData = [
      { name: 'Housing', value: comparisonHousing, color: colorPalette.housing },
      { name: 'Food & Dining', value: comparisonFood, color: colorPalette.food },
      { name: 'Transportation', value: comparisonTransport, color: colorPalette.transport },
      { name: 'Utilities', value: comparisonUtilities, color: colorPalette.utilities }
    ];

    // Radar chart data (percentage differences)
    const radarData = [
      {
        category: 'Housing',
        difference: comparisonHousing > 0 ? ((currentHousing - comparisonHousing) / comparisonHousing * 100) : 0
      },
      {
        category: 'Food & Dining',
        difference: comparisonFood > 0 ? ((currentFood - comparisonFood) / comparisonFood * 100) : 0
      },
      {
        category: 'Transportation',
        difference: comparisonTransport > 0 ? ((currentTransport - comparisonTransport) / comparisonTransport * 100) : 0
      },
      {
        category: 'Utilities',
        difference: comparisonUtilities > 0 ? ((currentUtilities - comparisonUtilities) / comparisonUtilities * 100) : 0
      }
    ];

    return {
      barData,
      currentPieData,
      comparisonPieData,
      radarData
    };
  };

  const analyticsData = getAnalyticsData();

  return (
    <>
      <style>{`
        .recharts-tooltip-wrapper .recharts-default-tooltip {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(6, 182, 212, 0.9)) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 16px !important;
          backdrop-filter: blur(20px) !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset !important;
          color: #ffffff !important;
          padding: 16px 20px !important;
          font-weight: 500 !important;
        }
        .recharts-tooltip-label {
          color: #f1f5f9 !important;
          font-weight: 600 !important;
          margin-bottom: 10px !important;
          font-size: 14px !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
        }
        .recharts-tooltip-item {
          color: #e2e8f0 !important;
          font-weight: 500 !important;
          font-size: 13px !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
        }
        .recharts-tooltip-item-name {
          color: #cbd5e1 !important;
        }
        .recharts-active-bar {
          filter: brightness(1.1) !important;
        }
        .recharts-bar-rectangle:hover {
          filter: brightness(1.2) drop-shadow(0 0 10px rgba(99, 102, 241, 0.4)) !important;
        }
        .recharts-cartesian-grid-horizontal line,
        .recharts-cartesian-grid-vertical line {
          stroke: rgba(148, 163, 184, 0.2) !important;
        }
        .recharts-tooltip-cursor {
          fill: rgba(99, 102, 241, 0.1) !important;
          stroke: rgba(99, 102, 241, 0.3) !important;
          stroke-width: 1px !important;
        }
      `}</style>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f6f8ff] via-[#eef2ff] to-white dark:from-[#0b0620] dark:via-[#14112d] dark:to-[#1a1240]">
        {/* Background elements */}
        <div className="pointer-events-none absolute -top-32 -right-32 w-[26rem] h-[26rem] sm:w-[34rem] sm:h-[34rem] lg:w-[40rem] lg:h-[40rem] rounded-full bg-primary/15 dark:bg-primary/20 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-40 -left-40 w-[30rem] h-[30rem] sm:w-[40rem] sm:h-[40rem] lg:w-[50rem] lg:h-[50rem] rounded-full bg-secondary/8 dark:bg-secondary/20 blur-3xl"></div>

        {/* Theme Toggle */}
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6 z-20">
          <ThemeToggle />
        </div>

        <div className="container mx-auto px-6 py-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Cost of Living Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compare living costs between cities worldwide. Get accurate estimates for rent, food, transport, and more.
            </p>
          </div>

          {/* Comparison Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Current City */}
            <Card className="bg-card/60 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Current Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Country</label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">City</label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.find(c => c.value === selectedCountry)?.cities.map(city => (
                          <SelectItem key={city} value={city}>
                            {costData[selectedCountry]?.[city]?.name || city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {currentCityData && (
                  <div className="pt-4">
                    <div className="text-2xl font-bold text-primary mb-2">
                      ${currentTotal.toLocaleString()}/month
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Estimated monthly cost for a single person
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comparison City */}
            <Card className="bg-card/60 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5 text-secondary" />
                  Compare With
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Country</label>
                    <Select value={comparisonCountry} onValueChange={setComparisonCountry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">City</label>
                    <Select value={comparisonCity} onValueChange={setComparisonCity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.find(c => c.value === comparisonCountry)?.cities.map(city => (
                          <SelectItem key={city} value={city}>
                            {costData[comparisonCountry]?.[city]?.name || city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {comparisonCityData && (
                  <div className="pt-4">
                    <div className="text-2xl font-bold text-secondary mb-2">
                      ${comparisonTotal.toLocaleString()}/month
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Estimated monthly cost for a single person
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Comparison Result */}
          {currentCityData && comparisonCityData && (
            <Card className="bg-card/60 backdrop-blur-sm border-border mb-12">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Cost Comparison</h3>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {currentCityData.name}
                      </div>
                      <div className="text-sm text-muted-foreground">Current</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold flex items-center gap-1 ${difference > 0 ? 'text-red-500' : 'text-green-500'
                        }`}>
                        {difference > 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                        ${Math.abs(difference).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.abs(percentageDiff).toFixed(1)}% {difference > 0 ? 'more' : 'less'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">
                        {comparisonCityData.name}
                      </div>
                      <div className="text-sm text-muted-foreground">Comparison</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Breakdown */}
          {currentCityData && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Rent */}
              <Card className="bg-card/60 backdrop-blur-sm border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    Housing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Studio</span>
                    <span className="font-medium">${currentCityData.rent.studio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">1 Bedroom</span>
                    <span className="font-medium">${currentCityData.rent.oneBedroom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">2 Bedroom</span>
                    <span className="font-medium">${currentCityData.rent.twoBedroom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">3 Bedroom</span>
                    <span className="font-medium">${currentCityData.rent.threeBedroom}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Food */}
              <Card className="bg-card/60 backdrop-blur-sm border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    Food & Dining
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Groceries</span>
                    <span className="font-medium">${currentCityData.food.groceries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Restaurant</span>
                    <span className="font-medium">${currentCityData.food.restaurant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Fast Food</span>
                    <span className="font-medium">${currentCityData.food.fastFood}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Transport */}
              <Card className="bg-card/60 backdrop-blur-sm border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    Transportation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Public Transport</span>
                    <span className="font-medium">${currentCityData.transport.public}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Gas</span>
                    <span className="font-medium">${currentCityData.transport.gas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Car Payment</span>
                    <span className="font-medium">${currentCityData.transport.car}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Utilities */}
              <Card className="bg-card/60 backdrop-blur-sm border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Utilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Electricity</span>
                    <span className="font-medium">${currentCityData.utilities.electricity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Water</span>
                    <span className="font-medium">${currentCityData.utilities.water}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Internet</span>
                    <span className="font-medium">${currentCityData.utilities.internet}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Phone</span>
                    <span className="font-medium">${currentCityData.utilities.phone}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analytics Section */}
          {analyticsData && (
            <motion.div
              className="mb-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="text-center mb-8"
                variants={cardVariants}
              >
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Cost Analytics
                </h2>
                <p className="text-lg text-muted-foreground">
                  Visual comparison of living costs between {currentCityData.name} and {comparisonCityData.name}
                </p>
              </motion.div>

              {/* Grouped Bar Chart */}
              <motion.div variants={cardVariants}>
                <Card className="bg-card/60 backdrop-blur-sm border-border mb-8 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-indigo-400" />
                      Category Comparison
                    </CardTitle>
                    <CardDescription>
                      Side-by-side comparison of major expense categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <defs>
                            <linearGradient id="colorGradient1" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
                            </linearGradient>
                            <linearGradient id="colorGradient2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                              <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                          <XAxis
                            dataKey="category"
                            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                            axisLine={{ stroke: 'hsl(var(--border))' }}
                            tickLine={{ stroke: 'hsl(var(--border))' }}
                          />
                          <YAxis
                            className="text-sm"
                            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                            axisLine={{ stroke: 'hsl(var(--border))' }}
                            tickLine={{ stroke: 'hsl(var(--border))' }}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--card-foreground))'
                            }}
                            formatter={(value, name) => [`$${value}`, name]}
                          />
                          <Legend />
                          <Bar
                            dataKey={currentCityData.name}
                            fill="url(#colorGradient1)"
                            radius={[4, 4, 0, 0]}
                            name={currentCityData.name}
                          />
                          <Bar
                            dataKey={comparisonCityData.name}
                            fill="url(#colorGradient2)"
                            radius={[4, 4, 0, 0]}
                            name={comparisonCityData.name}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Donut Charts */}
              <motion.div
                className="grid md:grid-cols-2 gap-8 mb-8"
                variants={cardVariants}
              >
                {/* Current City Donut */}
                <motion.div
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Card className="bg-card/60 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5 text-emerald-400" />
                        {currentCityData.name} Breakdown
                      </CardTitle>
                      <CardDescription>
                        Expense distribution by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analyticsData.currentPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={120}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {analyticsData.currentPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                color: 'hsl(var(--card-foreground))'
                              }}
                              formatter={(value, name) => [`$${value}`, name]}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Comparison City Donut */}
                <motion.div
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Card className="bg-card/60 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5 text-amber-400" />
                        {comparisonCityData.name} Breakdown
                      </CardTitle>
                      <CardDescription>
                        Expense distribution by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analyticsData.comparisonPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={120}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {analyticsData.comparisonPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                color: 'hsl(var(--card-foreground))'
                              }}
                              formatter={(value, name) => [`$${value}`, name]}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Radar Chart */}
              <motion.div variants={cardVariants}>
                <Card className="bg-card/60 backdrop-blur-sm border-border mb-8 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RadarIcon className="h-5 w-5 text-violet-400" />
                      Cost Difference Analysis
                    </CardTitle>
                    <CardDescription>
                      Percentage difference in each category ({currentCityData.name} vs {comparisonCityData.name})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={analyticsData.radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                          <defs>
                            <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.1} />
                            </radialGradient>
                          </defs>
                          <PolarGrid stroke="rgba(148, 163, 184, 0.3)" />
                          <PolarAngleAxis
                            dataKey="category"
                            tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 500 }}
                          />
                          <PolarRadiusAxis
                            angle={90}
                            domain={[-100, 200]}
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                            tickFormatter={(value) => `${value}%`}
                          />
                          <Radar
                            name="% Difference"
                            dataKey="difference"
                            stroke="#6366f1"
                            fill="url(#radarGradient)"
                            fillOpacity={0.4}
                            strokeWidth={3}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--card-foreground))'
                            }}
                            formatter={(value) => [`${value.toFixed(1)}%`, 'Difference']}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                      Positive values indicate {currentCityData.name} is more expensive, negative values indicate it's cheaper
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Calculator Toggle */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={openCalculator}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Open Personal Calculator
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CostOfLiving;
