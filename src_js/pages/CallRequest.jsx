import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, DollarSign, MessageCircle, User, MapPin, Star, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "../services/api";
import { useApiMutation, useApiData } from "../hooks/useApi";

const CallRequest = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get guide data from location state
  const guideData = location.state?.guideData;
  
  // Get current user data
  const { data: currentUser, loading: userLoading } = useApiData(
    () => apiService.getCurrentUser(),
    []
  );
  
  const [formData, setFormData] = useState({
    purpose: '',
    additionalDetails: '',
    urgency: 'medium',
    preferredTime: '',
    budget: '',
    timeline: '',
    specificQuestions: ''
  });

  const { loading: submitLoading, error: submitError, success: submitSuccess, mutate: submitRequest, reset: resetSubmit } = useApiMutation();

  // Redirect if no guide data or user not logged in
  useEffect(() => {
    if (!guideData) {
      navigate('/guides');
    }
    if (!userLoading && !currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to request a call with a guide.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [guideData, navigate, currentUser, userLoading, toast]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.purpose.trim()) {
      toast({
        title: "Purpose Required",
        description: "Please specify the purpose of your call.",
        variant: "destructive"
      });
      return;
    }

    // Create session request data for guide_sessions collection
    const sessionData = {
      guideId: guideData.userId || guideData.id, // Use userId for proper matching
      migrantId: currentUser._id.toString(),
      sessionType: 'consultation', // consultation, follow_up, document_review, interview_prep
      scheduledAt: null, // Will be set when guide accepts and schedules
      duration: 60, // Default 60 minutes
      status: 'pending', // pending, scheduled, in_progress, completed, cancelled
      meetingLink: null, // Will be set when scheduled
      notes: formData.additionalDetails,
      rating: null,
      feedback: null,
      
      // Additional request details
      title: `${formData.purpose.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Consultation`,
      purpose: formData.purpose,
      urgency: formData.urgency,
      budget: formData.budget || 'Not specified',
      timeline: formData.timeline || 'Flexible',
      preferredTime: formData.preferredTime || 'Flexible',
      specificQuestions: formData.specificQuestions,
      
      // Guide and migrant info for easy access
      guideName: guideData.fullName || guideData.name,
      guideEmail: guideData.email,
      guideLocation: guideData.residenceCountry || guideData.location,
      guideSpecialization: Array.isArray(guideData.specialization) ? guideData.specialization.join(', ') : guideData.specialization,
      migrantName: currentUser.displayName,
      migrantEmail: currentUser.email,
      
      requestStatus: 'pending', // pending, accepted, declined
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      // Debug: Log the session data being sent
      console.log('🚀 Sending session request:', {
        guideData,
        sessionData,
        currentUser
      });
      
      await submitRequest(() => apiService.createGuideSession(sessionData));
      
      toast({
        title: "✅ Call Request Sent Successfully!",
        description: `Your request has been sent to ${guideData.fullName || guideData.name}. They will respond within 24 hours.`,
      });
      
      // Show success message with guide info
      console.log('📤 Call request sent successfully:', {
        guide: guideData.fullName || guideData.name,
        migrant: currentUser.displayName,
        purpose: formData.purpose,
        urgency: formData.urgency
      });
      
      // Redirect to guides page after successful submission
      setTimeout(() => {
        navigate('/guides');
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Failed to send call request. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!guideData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No Guide Selected</h1>
          <p className="text-muted-foreground mb-6">Please select a guide to request a call.</p>
          <Button onClick={() => navigate('/guides')} variant="hero">
            Browse Guides
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Guides
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">Request a Call</h1>
          <p className="text-muted-foreground">Fill out the form below to request a consultation call with this guide.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Guide Info Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {guideData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{guideData.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {guideData.location}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="w-4 h-4 mr-2" />
                  {guideData.rating} ({guideData.reviews} reviews)
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4 mr-2" />
                  {guideData.price} per session
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  {guideData.responseTime} response time
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Specializations:</h4>
                  <div className="flex flex-wrap gap-1">
                    {guideData.specializations?.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Request Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Call Request Details</CardTitle>
                <CardDescription>
                  Provide details about your consultation needs. The more specific you are, the better the guide can help you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Purpose of Call */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Purpose of Call *
                    </label>
                    <Select value={formData.purpose} onValueChange={(value) => handleInputChange('purpose', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the main purpose of your call" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immigration_consultation">Immigration Consultation</SelectItem>
                        <SelectItem value="visa_application">Visa Application Help</SelectItem>
                        <SelectItem value="document_review">Document Review</SelectItem>
                        <SelectItem value="job_search">Job Search Strategy</SelectItem>
                        <SelectItem value="settlement_planning">Settlement Planning</SelectItem>
                        <SelectItem value="language_requirements">Language Requirements</SelectItem>
                        <SelectItem value="education_pathway">Education Pathway</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Additional Details
                    </label>
                    <Textarea
                      placeholder="Provide more context about your situation, goals, and what you hope to achieve from this call..."
                      value={formData.additionalDetails}
                      onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Urgency Level
                    </label>
                    <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Flexible timing</SelectItem>
                        <SelectItem value="medium">Medium - Within a week</SelectItem>
                        <SelectItem value="high">High - Within 2-3 days</SelectItem>
                        <SelectItem value="urgent">Urgent - Within 24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preferred Time
                    </label>
                    <Input
                      placeholder="e.g., Weekdays 6-8 PM EST, Weekends anytime"
                      value={formData.preferredTime}
                      onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Budget Range
                    </label>
                    <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-50">Under $50</SelectItem>
                        <SelectItem value="50-100">$50 - $100</SelectItem>
                        <SelectItem value="100-200">$100 - $200</SelectItem>
                        <SelectItem value="200-500">$200 - $500</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Timeline
                    </label>
                    <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="When do you need this consultation?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">ASAP</SelectItem>
                        <SelectItem value="1-week">Within 1 week</SelectItem>
                        <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                        <SelectItem value="1-month">Within 1 month</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Specific Questions */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Specific Questions
                    </label>
                    <Textarea
                      placeholder="List any specific questions you'd like to ask during the call..."
                      value={formData.specificQuestions}
                      onChange={(e) => handleInputChange('specificQuestions', e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      <p>• The guide will respond within 24 hours</p>
                      <p>• You can cancel or reschedule if needed</p>
                    </div>
                    <Button 
                      type="submit" 
                      variant="hero" 
                      className="shadow-glow"
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Sending Request...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Send Call Request
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {submitError && (
                  <div className="mt-4 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                    <p className="text-sm text-red-200">
                      Error: {submitError}
                    </p>
                  </div>
                )}

                {submitSuccess && (
                  <div className="mt-4 p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                    <p className="text-sm text-green-200">
                      ✅ Call request sent successfully! Redirecting to guides page...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallRequest;

