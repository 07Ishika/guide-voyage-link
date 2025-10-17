import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import apiService from '../services/api'
import { useApiData, useApiMutation } from '../hooks/useApi'
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Edit3,
  Save,
  X,
  Award,
  Target,
  TrendingUp,
  Clock,
  Star,
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Crown,
  CreditCard,
  Plane,
  Languages,
  DollarSign,
  Users,
  Zap,
  Heart,
  Building,
  Briefcase,
  GraduationCap,
  Globe2,
  Navigation,
  FileText,
  CheckCircle,
  AlertCircle,
  Upload,
  Phone,
  Video,
  UserCheck,
} from 'lucide-react'

const Profile = () => {
  const location = useLocation()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [currentLocation, setCurrentLocation] = useState(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationAddress, setLocationAddress] = useState(null)
  const [editableProfileData, setEditableProfileData] = useState(null)
  // Get current authenticated user
  const { data: currentUser, loading: userLoading } = useApiData(
    () => apiService.getCurrentUser(),
    []
  );

  // Debug: Log current user data
  useEffect(() => {
    if (currentUser) {
      console.log('Current logged-in user from session:', currentUser);
    } else if (!userLoading) {
      console.log('No current user found, userLoading:', userLoading);
    }
  }, [currentUser, userLoading]);

  // Detect if user is guide or migrant based on route
  const isGuide = location.pathname === '/guide' || location.pathname === '/home/guide' || location.pathname === '/migrant-requests' || location.pathname === '/guide/profile';
  const isMigrant = !isGuide;
  
  // If no current user data, try to get from localStorage or show demo data
  const displayUser = currentUser || {
    _id: 'demo_user',
    displayName: isGuide ? 'Demo Guide' : 'Demo Migrant',
    email: isGuide ? 'demo.guide@example.com' : 'demo.migrant@example.com',
    role: isGuide ? 'guide' : 'migrant',
    photo: null
  };

  // Create demo profile data if API fails
  const demoProfileData = {
    userId: displayUser._id,
    fullName: displayUser.displayName,
    email: displayUser.email,
    role: displayUser.role,
    bio: isGuide ? 'Experienced immigration guide helping migrants with their journey' : 'Looking for guidance on my immigration journey',
    timezone: 'UTC',
    citizenshipCountry: isGuide ? 'Canada' : 'India',
    residenceCountry: isGuide ? 'Canada' : 'India',
    targetCountries: isGuide ? ['Canada'] : ['Canada', 'USA'],
    languages: ['English', 'Hindi'],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Use current user's ID
  const actualUserId = displayUser?._id;

  // Fetch profile data from API (only if user is logged in)
  const { data: profileData, loading: profileLoading, error: profileError, refetch: refetchProfile } = useApiData(
    () => actualUserId ? apiService.getProfile(actualUserId) : Promise.resolve(null),
    [actualUserId]
  );

  // Use demo data if API fails or no profile data, but always use current user's email and role from session
  const finalProfileData = {
    ...(profileData || demoProfileData),
    // Always use the current logged-in user's email and role from session
    email: displayUser.email,
    role: displayUser.role,
    fullName: displayUser.displayName || (profileData?.fullName || demoProfileData.fullName)
  };

  // Debug: Log final profile data
  useEffect(() => {
    if (finalProfileData) {
      console.log('Final profile data with session info:', finalProfileData);
    }
  }, [finalProfileData]);

  // Initialize editable profile data when finalProfileData changes
  useEffect(() => {
    if (finalProfileData && !editableProfileData) {
      setEditableProfileData(finalProfileData);
    }
  }, [finalProfileData, editableProfileData]);

  // Fetch dashboard stats from API (only if user is logged in)
  const { data: dashboardStats, loading: statsLoading } = useApiData(
    () => actualUserId ? apiService.getDashboardStats(actualUserId) : Promise.resolve(null),
    [actualUserId]
  );

  // API mutation for saving profile
  const { loading: saveLoading, error: saveError, success: saveSuccess, mutate: saveProfile, reset: resetSave } = useApiMutation();

  // Local state for form data
  const [formData, setFormData] = useState({})

  // Update form data when profile data is loaded
  useEffect(() => {
    if (finalProfileData) {
      setFormData(finalProfileData);
    }
  }, [finalProfileData]);

  // Function to reverse geocode coordinates to address
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`
      )
      const data = await response.json()
      
      if (data && data.display_name) {
        // Extract key parts of the address
        const address = data.address || {}
        const city = address.city || address.town || address.village || address.municipality || ''
        const state = address.state || address.province || ''
        const country = address.country || ''
        
        // Create a readable address
        let readableAddress = ''
        if (city) readableAddress += city
        if (state && state !== city) readableAddress += `, ${state}`
        if (country) readableAddress += `, ${country}`
        
        return readableAddress || data.display_name
      }
      return null
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return null
    }
  }

  // Location detection - only try once and don't auto-request
  useEffect(() => {
    // Don't automatically request location to avoid permission prompts
    // User can manually click the location button if they want
  }, [isMigrant])

  const [preferences, setPreferences] = useState({
    email_notifications: true,
    push_notifications: true,
    weekly_digest: true,
    mentor_suggestions: true,
    social_updates: true,
    task_reminders: true,
    call_reminders: true,
    theme: 'light',
    language: 'en',
  })

  const mentors = [
    {
      id: 'ben_tossell',
      name: 'Ben Tossell',
      avatar: '💼',
      specialty: 'No-Code & AI Tools',
    },
    {
      id: 'addy_osmani',
      name: 'Addy Osmani',
      avatar: '⚙️',
      specialty: 'Technical Excellence',
    },
    {
      id: 'pieter_levels',
      name: 'Pieter Levels',
      avatar: '🏝️',
      specialty: 'Indie Hacking',
    },
    {
      id: 'logan_kilpatrick',
      name: 'Logan Kilpatrick',
      avatar: '🤖',
      specialty: 'AI & Developer Relations',
    },
    {
      id: 'alex_albert',
      name: 'Alex Albert',
      avatar: '🚀',
      specialty: 'Product & Growth',
    },
    {
      id: 'miguel_carranza',
      name: 'Miguel Carranza',
      avatar: '💡',
      specialty: 'Strategy & Innovation',
    },
    {
      id: 'jason_calacanis',
      name: 'Jason Calacanis',
      avatar: '💰',
      specialty: 'Angel Investing',
    },
    {
      id: 'angie_jones',
      name: 'Angie Jones',
      avatar: '🔧',
      specialty: 'Engineering & Testing',
    },
    {
      id: 'brianne_kimmel',
      name: 'Brianne Kimmel',
      avatar: '🌟',
      specialty: 'Future of Work',
    },
    {
      id: 'sarah_guo',
      name: 'Sarah Guo',
      avatar: '🤖',
      specialty: 'AI & Investment',
    },
  ]

  // User-type specific achievements
  const migrantAchievements = [
    {
      id: 1,
      title: 'First Step',
      description: 'Started your migration journey',
      icon: '🚀',
      earned: true,
    },
    {
      id: 2,
      title: 'Document Master',
      description: 'Completed all required documents',
      icon: '📋',
      earned: true,
    },
    {
      id: 3,
      title: 'Guide Connect',
      description: 'Connected with your first guide',
      icon: '🤝',
      earned: true,
    },
    {
      id: 4,
      title: 'Language Pro',
      description: 'Achieved required language scores',
      icon: '🗣️',
      earned: false,
    },
    {
      id: 5,
      title: 'Visa Ready',
      description: 'Visa application submitted',
      icon: '✈️',
      earned: false,
    },
    {
      id: 6,
      title: 'Settlement Star',
      description: 'Successfully settled in new country',
      icon: '🏠',
      earned: false,
    },
  ]

  const guideAchievements = [
    {
      id: 1,
      title: 'First Client',
      description: 'Helped your first migrant',
      icon: '👥',
      earned: true,
    },
    {
      id: 2,
      title: 'Success Story',
      description: 'Achieved 90%+ success rate',
      icon: '🏆',
      earned: true,
    },
    {
      id: 3,
      title: 'Expert Guide',
      description: 'Completed 100+ consultations',
      icon: '💎',
      earned: true,
    },
    {
      id: 4,
      title: 'Language Master',
      description: 'Speak 3+ languages fluently',
      icon: '🌍',
      earned: true,
    },
    {
      id: 5,
      title: 'Top Rated',
      description: 'Received 5-star rating',
      icon: '⭐',
      earned: false,
    },
    {
      id: 6,
      title: 'Mentor Leader',
      description: 'Trained 10+ new guides',
      icon: '👨‍🏫',
      earned: false,
    },
  ]

  const achievements = isGuide ? guideAchievements : migrantAchievements

  // Generate stats from API data
  const getStats = () => {
    if (!dashboardStats) return [];

    if (isMigrant) {
      return [
        {
          label: 'Requests',
          value: dashboardStats.requests || 0,
          icon: Target,
          color: 'text-blue-600',
        },
        {
          label: 'Sessions',
          value: dashboardStats.sessions || 0,
          icon: Calendar,
          color: 'text-emerald-600',
        },
        {
          label: 'Documents',
          value: dashboardStats.documents || 0,
          icon: FileText,
          color: 'text-purple-600',
        },
        { 
          label: 'Progress', 
          value: Math.min(100, ((dashboardStats.documents || 0) * 10) + ((dashboardStats.sessions || 0) * 15)), 
          icon: Users, 
          color: 'text-orange-600' 
        },
      ];
    } else {
      return [
        {
          label: 'Success Rate',
          value: `${dashboardStats.rating || 0}%`,
          icon: Award,
          color: 'text-green-600',
        },
        {
          label: 'Total Clients',
          value: dashboardStats.clients || 0,
          icon: Users,
          color: 'text-blue-600',
        },
        {
          label: 'Sessions',
          value: dashboardStats.sessions || 0,
          icon: Clock,
          color: 'text-purple-600',
        },
        { 
          label: 'Reviews', 
          value: dashboardStats.reviews || 0, 
          icon: DollarSign, 
          color: 'text-emerald-600' 
        },
      ];
    }
  };

  const stats = getStats();

  const subscriptionDetails = {
    plan: 'free',
    status: 'active',
    renewalDate: 'N/A',
    paymentMethod: 'N/A',
    billingCycle: 'N/A',
  }

  const paymentHistory = [
    { id: 'pay_123456', date: '2024-01-15', amount: 29, status: 'Paid' },
    { id: 'pay_123457', date: '2023-12-15', amount: 29, status: 'Paid' },
    { id: 'pay_123458', date: '2023-11-15', amount: 29, status: 'Paid' },
  ]

  const handleSave = async () => {
    try {
      await saveProfile(() => apiService.saveProfile({
        userId: actualUserId,
        ...formData
      }));
      setIsEditing(false);
      refetchProfile(); // Refresh profile data
      resetSave(); // Reset success/error states
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData(profileData || {});
    setIsEditing(false);
    resetSave();
  }

  const handleDocumentUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      // For now, we'll simulate file upload by adding to the documents list
      // In a real app, you'd upload to a file storage service
      const newDocuments = files.map(file => ({
        name: file.name,
        type: formData.documentType || 'document',
        fileType: file.type,
        size: file.size,
        country: formData.documentCountry || 'Unknown',
        uploadedAt: new Date().toISOString(),
        status: 'pending' // All new uploads start as pending
      }));

      // Update the profile data with new documents
      const updatedDocuments = [...(finalProfileData.verificationDocuments || []), ...newDocuments];
      
      setFormData({
        ...formData,
        verificationDocuments: updatedDocuments
      });

      // Show success message
      console.log('Documents uploaded successfully:', newDocuments);
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Failed to upload documents:', error);
    }
  }

  const selectedMentor = profileData ? mentors.find((m) => m.id === finalProfileData.mentor_match) : null

  const [migrantFeed, setMigrantFeed] = useState([
    { text: 'Arrived in Toronto! Excited to start my new journey.', date: '2024-08-25 10:00' },
    { text: 'Any tips for finding affordable housing in Canada?', date: '2024-08-24 18:30' },
  ]);
  const [newMigrantPost, setNewMigrantPost] = useState('');
  const [guideFeed, setGuideFeed] = useState([
    { text: 'Offering a free Q&A session for new migrants this Friday!', date: '2024-08-25 09:00' },
    { text: '5-star testimonial from Priya: "Helped me get my work permit fast!"', date: '2024-08-24 15:20' },
  ]);
  const [newGuidePost, setNewGuidePost] = useState('');

  // Show loading state
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show loading state while fetching user data
  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground mb-4">Loading profile...</div>
        </div>
      </div>
    );
  }

  // Show error state only if we have no demo data to fall back to
  if (profileError && !demoProfileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">❌</div>
          <p className="text-red-500 mb-4">Failed to load profile</p>
          <p className="text-sm text-muted-foreground mb-4">Error: {profileError}</p>
          <button 
            onClick={refetchProfile}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show message if no profile data (this should rarely happen now with demo data)
  if (!finalProfileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 mb-4">⚠️</div>
          <p className="text-yellow-500 mb-4">No profile data found</p>
          <button 
            onClick={refetchProfile}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
                         <div>
               <h1 className="text-3xl font-bold text-foreground">
                 {isGuide ? 'Guide Profile' : 'Migrant Profile'} Settings
               </h1>
               <p className="mt-1 text-muted-foreground">
                 {isGuide ? 'Manage your guide profile and services' : 'Manage your migration journey and preferences'}
               </p>
             </div>

            {activeTab === 'profile' && (
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCancel}
                      className="px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </motion.button>
                )}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="rounded-xl shadow-sm border bg-card">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'preferences', label: 'Preferences', icon: Settings },
                  { id: 'security', label: 'Security', icon: Shield },
                  { id: 'billing', label: 'Billing', icon: CreditCard },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  )
                })}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  {/* Profile Header */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${finalProfileData.email}`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      {isEditing && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full shadow-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>

                                         <div className="flex-1">
                       <h2 className="text-2xl font-bold text-foreground">
                         {formData.fullName || 'Your Name'}
                       </h2>
                       <p className="text-muted-foreground">
                         {formData.email}
                       </p>
                       <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                         {formData.role ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1) : 'User'}
                         {currentUser ? ' (Live Session)' : ' (Demo Data)'}
                       </p>
                       <div className="flex items-center space-x-4 mt-2">
                         {isMigrant ? (
                           <>
                             <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                               <MapPin className="w-4 h-4" />
                               <span className="text-sm font-medium">
                                 {formData.currentLocation}
                               </span>
                             </div>
                             <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                               <Plane className="w-4 h-4" />
                               <span className="text-sm font-medium">
                                 → {formData.targetCity}, {formData.targetCountry}
                               </span>
                             </div>
                           </>
                         ) : (
                                                       <>
                              <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400">
                                <Briefcase className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  {finalProfileData.specialization}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                                <Star className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  {finalProfileData.rating || 'N/A'} Success Rate
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                                {finalProfileData.verifiedStatus === 'verified' ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : finalProfileData.verifiedStatus === 'rejected' ? (
                                  <AlertCircle className="w-4 h-4" />
                                ) : (
                                  <Clock className="w-4 h-4" />
                                )}
                                <span className="text-sm font-medium">
                                  {finalProfileData.verified_status === 'verified' ? 'Verified Guide' : 
                                   finalProfileData.verified_status === 'rejected' ? 'Verification Failed' : 
                                   'Verification Pending'}
                                </span>
                              </div>
                            </>
                         )}
                       </div>
                     </div>
                  </div>

                                                         {/* Location Detection for Migrants */}
                    {isMigrant && currentLocation && (
                      <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-700/50">
                        <div className="flex items-center space-x-2 mb-2">
                          <Navigation className="w-5 h-5 text-blue-400" />
                          <h3 className="text-lg font-semibold text-blue-300">Current Location Detected</h3>
                        </div>
                        
                        {locationAddress ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-100 font-medium">{locationAddress}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs text-blue-300">
                              <div>
                                <span className="text-blue-400">Lat:</span>
                                <span className="ml-1">{currentLocation.latitude.toFixed(6)}</span>
                              </div>
                              <div>
                                <span className="text-blue-400">Lng:</span>
                                <span className="ml-1">{currentLocation.longitude.toFixed(6)}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-blue-200">Latitude:</span>
                              <span className="ml-2 text-blue-100">{currentLocation.latitude.toFixed(6)}</span>
                            </div>
                            <div>
                              <span className="text-blue-200">Longitude:</span>
                              <span className="ml-2 text-blue-100">{currentLocation.longitude.toFixed(6)}</span>
                            </div>
                          </div>
                        )}
                        
                        <p className="text-blue-200 text-xs mt-2">
                          💡 Use this to verify your current location or update manually above
                        </p>
                      </div>
                    )}

                    {/* Verification Status for Guides */}
                    {isGuide && (
                      <div className={`p-4 rounded-lg border ${
                        finalProfileData.verified_status === 'verified' 
                          ? 'bg-green-900/20 border-green-700/50' 
                          : finalProfileData.verified_status === 'rejected'
                          ? 'bg-red-900/20 border-red-700/50'
                          : 'bg-yellow-900/20 border-yellow-700/50'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {finalProfileData.verified_status === 'verified' ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : finalProfileData.verified_status === 'rejected' ? (
                              <AlertCircle className="w-5 h-5 text-red-400" />
                            ) : (
                              <Clock className="w-5 h-5 text-yellow-400" />
                            )}
                            <h3 className="text-lg font-semibold text-foreground">
                              {finalProfileData.verified_status === 'verified' ? 'Verification Complete' : 
                               finalProfileData.verified_status === 'rejected' ? 'Verification Failed' : 
                               'Verification in Progress'}
                            </h3>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            finalProfileData.verified_status === 'verified' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                              : finalProfileData.verified_status === 'rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                          }`}>
                            {finalProfileData.verifiedStatus?.toUpperCase() || 'PENDING'}
                          </div>
                        </div>
                        
                        {/* Document Upload Section - Only visible when editing */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-md font-semibold text-foreground">Citizenship Documents</h4>
                            {isEditing && (
                              <button 
                                onClick={() => document.getElementById('document-upload').click()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                              >
                                <Upload className="w-4 h-4 inline mr-2" />
                                Upload Document
                              </button>
                            )}
                          </div>
                          
                          {isEditing && (
                            <>
                              <input
                                id="document-upload"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                multiple
                                className="hidden"
                                onChange={(e) => handleDocumentUpload(e)}
                              />
                              
                              {/* Document Type and Country Selector */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-sm font-medium mb-2 text-foreground">
                                    Document Type
                                  </label>
                                  <select 
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border"
                                    value={formData.documentType || ''}
                                    onChange={(e) => setFormData({...formData, documentType: e.target.value})}
                                  >
                                    <option value="">Select document type</option>
                                    <option value="passport">Passport</option>
                                    <option value="visa">Visa</option>
                                    <option value="citizenship">Citizenship Certificate</option>
                                    <option value="birth_certificate">Birth Certificate</option>
                                    <option value="driver_license">Driver's License</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2 text-foreground">
                                    Country
                                  </label>
                                  <select 
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border"
                                    value={formData.documentCountry || ''}
                                    onChange={(e) => setFormData({...formData, documentCountry: e.target.value})}
                                  >
                                    <option value="">Select country</option>
                                    <option value="Canada">Canada</option>
                                    <option value="USA">United States</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Germany">Germany</option>
                                    <option value="France">France</option>
                                    <option value="India">India</option>
                                    <option value="China">China</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>
                              </div>
                            </>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(finalProfileData.verificationDocuments || []).map((doc, index) => (
                              <div key={index} className="flex items-center justify-between p-3 rounded bg-muted/50 border border-border">
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-blue-500" />
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-foreground">{doc.name || doc}</span>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        doc.status === 'verified' 
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                          : doc.status === 'rejected'
                                          ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                      }`}>
                                        {doc.status === 'verified' ? '✓ Verified' : 
                                         doc.status === 'rejected' ? '✗ Rejected' : 
                                         '⏳ Pending'}
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {doc.type || 'Document'} • {doc.country || 'Citizenship'}
                                    </p>
                                    {doc.uploadedAt && (
                                      <p className="text-xs text-muted-foreground">
                                        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {isEditing && (
                                  <div className="flex items-center space-x-2">
                                    <button className="text-blue-500 hover:text-blue-600 text-sm">
                                      View
                                    </button>
                                    <button className="text-red-500 hover:text-red-600 text-sm">
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {(!finalProfileData.verificationDocuments || finalProfileData.verificationDocuments.length === 0) && isEditing && (
                            <div className="text-center py-6 border-2 border-dashed border-border rounded-lg">
                              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground mb-2">
                                Upload your citizenship documents (passport, visa, etc.)
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Supported formats: PDF, JPG, PNG, DOC, DOCX
                              </p>
                            </div>
                          )}
                          
                          {(!finalProfileData.verificationDocuments || finalProfileData.verificationDocuments.length === 0) && !isEditing && (
                            <div className="text-center py-6 border border-border rounded-lg bg-muted/30">
                              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground mb-2">
                                No documents uploaded yet
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Click "Edit Profile" to upload citizenship documents
                              </p>
                            </div>
                          )}
                          
                          {finalProfileData.verifiedStatus === 'pending' && (
                            <div className="p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                              <p className="text-sm text-yellow-200">
                                📋 <strong>Verification Required:</strong> Please upload documents for all countries you claim citizenship in to complete verification.
                              </p>
                            </div>
                          )}
                        </div>

                        {finalProfileData.verified_status === 'verified' && (
                          <div className="space-y-2">
                            <p className="text-sm text-green-200">
                              ✅ Your profile has been verified. Migrants can now contact you with confidence.
                            </p>
                            {finalProfileData.verification_date && (
                              <p className="text-xs text-green-300">
                                Verified on: {finalProfileData.verification_date}
                              </p>
                            )}
                          </div>
                        )}

                        {finalProfileData.verified_status === 'rejected' && (
                          <div className="space-y-2">
                            <p className="text-sm text-red-200">
                              ❌ Your verification was rejected. Please review and resubmit your documents.
                            </p>
                            <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors">
                              Resubmit Documents
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                   {/* Stats */}
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => {
                      const Icon = stat.icon
                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="rounded-lg p-4 text-center bg-muted/50"
                        >
                          <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                          <div className="text-2xl font-bold text-foreground">
                            {stat.value}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stat.label}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                                     {/* Profile Form */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Common Fields */}
                     <div>
                       <label className="block text-sm font-medium mb-2 text-foreground">
                         Full Name
                       </label>
                       <input
                         type="text"
                         value={formData.fullName || ''}
                         onChange={(e) =>
                           setFormData({
                             ...formData,
                             fullName: e.target.value,
                           })
                         }
                         disabled={!isEditing}
                         className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-muted disabled:text-muted-foreground bg-background border-border"
                       />
                     </div>

                     <div>
                       <label className="block text-sm font-medium mb-2 text-foreground">
                         Email {currentUser ? '(From Session)' : '(Demo Data)'}
                       </label>
                       <input
                         type="email"
                         value={formData.email || ''}
                         disabled
                         className="w-full px-3 py-2 border rounded-lg bg-muted border-border text-muted-foreground"
                       />
                     </div>

                     <div>
                       <label className="block text-sm font-medium mb-2 text-foreground">
                         Role {currentUser ? '(From Session)' : '(Demo Data)'}
                       </label>
                       <input
                         type="text"
                         value={formData.role ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1) : ''}
                         disabled
                         className="w-full px-3 py-2 border rounded-lg bg-muted border-border text-muted-foreground"
                       />
                     </div>

                     <div className="md:col-span-2">
                       <label className="block text-sm font-medium mb-2 text-foreground">
                         Bio
                       </label>
                       <textarea
                         value={formData.bio || ''}
                         onChange={(e) =>
                           setFormData({ ...formData, bio: e.target.value })
                         }
                         disabled={!isEditing}
                         rows={3}
                         placeholder={isMigrant ? "Tell us about your migration goals..." : "Tell us about your expertise and services..."}
                         className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-background border-border disabled:bg-muted disabled:text-muted-foreground"
                       />
                     </div>

                     {/* Migrant-specific fields */}
                     {isMigrant && (
                       <>
                         <div>
                           <label className="block text-sm font-medium mb-2 text-foreground">
                             Current Location
                             <span className="text-xs text-muted-foreground ml-2">
                               (Click "Get Location" to allow browser to detect your location)
                             </span>
                           </label>
                           <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                             <p className="text-xs text-yellow-800">
                               <strong>Location blocked?</strong> Click the lock/tune icon next to the URL → Site settings → Location → Allow, then refresh the page.
                             </p>
                           </div>
                           <div className="flex space-x-2">
                             <input
                               type="text"
                               value={editableProfileData?.current_location || ''}
                               onChange={(e) =>
                                 setEditableProfileData({
                                   ...editableProfileData,
                                   current_location: e.target.value,
                                 })
                               }
                               disabled={!isEditing}
                               placeholder="City, Country"
                               className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border disabled:bg-muted disabled:text-muted-foreground"
                             />
                             <button
                               onClick={async () => {
                                 if (navigator.geolocation) {
                                   setIsLoadingLocation(true)
                                   
                                   // Request location permission with user-friendly options
                                   navigator.geolocation.getCurrentPosition(
                                     async (position) => {
                                       const { latitude, longitude } = position.coords
                                       setCurrentLocation({ latitude, longitude })
                                       
                                       // Reverse geocode to get address
                                       const address = await reverseGeocode(latitude, longitude)
                                       setLocationAddress(address)
                                       
                                       // Update the input field with the address
                                       setEditableProfileData({
                                         ...editableProfileData,
                                         current_location: address || `${latitude}, ${longitude}`
                                       })
                                       
                                       setIsLoadingLocation(false)
                                       alert('Location detected successfully!')
                                     },
                                     (error) => {
                                       console.log('Location error:', error)
                                       setIsLoadingLocation(false)
                                       
                                       // Show specific messages based on error type
                                       if (error.code === 1) {
                                         alert(`Location access denied or blocked. 

To reset geolocation permissions:
1. Click the lock/tune icon next to the URL in your browser
2. Click "Site settings" or "Permissions"
3. Find "Location" and change it to "Allow"
4. Refresh the page and try again

Or manually enter your location in the text field below.`)
                                       } else if (error.code === 2) {
                                         alert('Location unavailable. Please check your internet connection and GPS settings.')
                                       } else if (error.code === 3) {
                                         alert('Location request timed out. Please try again.')
                                       } else {
                                         alert('Unable to get your location. Please try again or enter your location manually.')
                                       }
                                     },
                                     {
                                       enableHighAccuracy: true,
                                       timeout: 15000,
                                       maximumAge: 0 // Always get fresh location
                                     }
                                   )
                                 } else {
                                   alert('Geolocation is not supported by this browser.')
                                 }
                               }}
                               disabled={isLoadingLocation}
                               className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                             >
                               {isLoadingLocation ? (
                                 <>
                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                   <span>Detecting...</span>
                                 </>
                               ) : (
                                 <>
                                   <span>📍</span>
                                   <span>Get Location</span>
                                 </>
                               )}
                             </button>
                             <button
                               onClick={() => {
                                 alert(`To reset location permissions:

1. Click the lock/tune icon (🔒) next to the URL in your browser address bar
2. Click "Site settings" or "Permissions" 
3. Find "Location" in the list
4. Change it from "Block" to "Allow"
5. Refresh this page and try the location button again

Alternatively, you can manually type your location in the text field above.`)
                               }}
                               className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                               title="Help with location permissions"
                             >
                               🔧 Reset Permissions
                             </button>
                           </div>
                         </div>

                         <div>
                           <label className="block text-sm font-medium mb-2 text-foreground">
                             Target Country
                           </label>
                           <input
                             type="text"
                             value={finalProfileData.target_country}
                             onChange={(e) =>
                               setEditableProfileData({
                                 ...profileData,
                                 target_country: e.target.value,
                               })
                             }
                             disabled={!isEditing}
                             placeholder="e.g., Canada"
                             className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border disabled:bg-muted disabled:text-muted-foreground"
                           />
                         </div>

                         <div>
                           <label className="block text-sm font-medium mb-2 text-foreground">
                             Visa Type
                           </label>
                           <select
                             value={finalProfileData.visa_type}
                             onChange={(e) =>
                               setEditableProfileData({
                                 ...profileData,
                                 visa_type: e.target.value,
                               })
                             }
                             disabled={!isEditing}
                             className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border disabled:bg-muted disabled:text-muted-foreground"
                           >
                             <option value="Student Visa">Student Visa</option>
                             <option value="Work Visa">Work Visa</option>
                             <option value="Family Visa">Family Visa</option>
                             <option value="Business Visa">Business Visa</option>
                           </select>
                         </div>

                         <div>
                           <label className="block text-sm font-medium mb-2 text-foreground">
                             Budget Range
                           </label>
                           <input
                             type="text"
                             value={finalProfileData.budget_range}
                             onChange={(e) =>
                               setEditableProfileData({
                                 ...profileData,
                                 budget_range: e.target.value,
                               })
                             }
                             disabled={!isEditing}
                             placeholder="e.g., $15,000 - $25,000"
                             className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border disabled:bg-muted disabled:text-muted-foreground"
                           />
                         </div>
                       </>
                     )}

                                           {/* Guide-specific fields */}
                      {isGuide && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">
                              Specialization
                            </label>
                            <input
                              type="text"
                              value={finalProfileData.specialization}
                              onChange={(e) =>
                                setEditableProfileData({
                                  ...profileData,
                                  specialization: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              placeholder="e.g., Immigration Law"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border disabled:bg-muted disabled:text-muted-foreground"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">
                              Years of Experience
                            </label>
                            <input
                              type="text"
                              value={finalProfileData.years_experience}
                              onChange={(e) =>
                                setEditableProfileData({
                                  ...profileData,
                                  years_experience: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              placeholder="e.g., 8+ years"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border disabled:bg-muted disabled:text-muted-foreground"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">
                              Hourly Rate
                            </label>
                            <input
                              type="text"
                              value={finalProfileData.hourly_rate}
                              onChange={(e) =>
                                setEditableProfileData({
                                  ...profileData,
                                  hourly_rate: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              placeholder="e.g., $150"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border disabled:bg-muted disabled:text-muted-foreground"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">
                              Availability
                            </label>
                            <input
                              type="text"
                              value={finalProfileData.availability}
                              onChange={(e) =>
                                setEditableProfileData({
                                  ...profileData,
                                  availability: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              placeholder="e.g., Mon-Fri, 9 AM - 6 PM EST"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border disabled:bg-muted disabled:text-muted-foreground"
                            />
                          </div>

                          {/* New verification fields */}
                          <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">
                              Citizenship Country
                            </label>
                            <input
                              type="text"
                              value={finalProfileData.citizenship_country}
                              onChange={(e) =>
                                setEditableProfileData({
                                  ...profileData,
                                  citizenship_country: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              placeholder="e.g., Canada"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border disabled:bg-muted disabled:text-muted-foreground"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">
                              Residence Country
                            </label>
                            <input
                              type="text"
                              value={finalProfileData.residence_country}
                              onChange={(e) =>
                                setEditableProfileData({
                                  ...profileData,
                                  residence_country: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              placeholder="e.g., Canada"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border disabled:bg-muted disabled:text-muted-foreground"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-foreground">
                              Target Countries (Where you can help migrants)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {['Canada', 'USA', 'UK', 'Australia', 'Germany', 'New Zealand'].map((country) => (
                                <label key={country} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={finalProfileData.targetCountries?.includes(country) || false}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setEditableProfileData({
                                          ...profileData,
                                          targetCountries: [...(finalProfileData.targetCountries || []), country]
                                        })
                                      } else {
                                        setEditableProfileData({
                                          ...profileData,
                                          targetCountries: (finalProfileData.targetCountries || []).filter(c => c !== country)
                                        })
                                      }
                                    }}
                                    disabled={!isEditing}
                                    className="rounded border-border focus:ring-2 focus:ring-purple-500"
                                  />
                                  <span className="text-sm text-muted-foreground">{country}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-foreground">
                              Professional Licenses & Certifications
                            </label>
                            <textarea
                              value={(finalProfileData.professionalLicenses || []).join('\n')}
                              onChange={(e) =>
                                setEditableProfileData({
                                  ...profileData,
                                  professionalLicenses: e.target.value.split('\n').filter(line => line.trim())
                                })
                              }
                              disabled={!isEditing}
                              rows={3}
                              placeholder="Enter each license/certification on a new line&#10;e.g., Immigration Consultant License - ICCRC&#10;Law Degree - University of Toronto"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-background border-border disabled:bg-muted disabled:text-muted-foreground"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-foreground">
                              Expertise Areas
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {['Student Visas', 'Work Permits', 'Family Sponsorship', 'Express Entry', 'Business Visas', 'Refugee Claims'].map((area) => (
                                <label key={area} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={finalProfileData.expertiseAreas?.includes(area) || false}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setEditableProfileData({
                                          ...profileData,
                                          expertiseAreas: [...(finalProfileData.expertiseAreas || []), area]
                                        })
                                      } else {
                                        setEditableProfileData({
                                          ...profileData,
                                          expertiseAreas: (finalProfileData.expertiseAreas || []).filter(a => a !== area)
                                        })
                                      }
                                    }}
                                    disabled={!isEditing}
                                    className="rounded border-border focus:ring-2 focus:ring-purple-500"
                                  />
                                  <span className="text-sm text-muted-foreground">{area}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-foreground">
                              Consultation Types
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {['Initial Assessment', 'Document Review', 'Application Filing', 'Interview Preparation', 'Appeal Support', 'Settlement Guidance'].map((type) => (
                                <label key={type} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={finalProfileData.consultationTypes?.includes(type) || false}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setEditableProfileData({
                                          ...profileData,
                                          consultationTypes: [...(finalProfileData.consultationTypes || []), type]
                                        })
                                      } else {
                                        setEditableProfileData({
                                          ...profileData,
                                          consultationTypes: (finalProfileData.consultationTypes || []).filter(t => t !== type)
                                        })
                                      }
                                    }}
                                    disabled={!isEditing}
                                    className="rounded border-border focus:ring-2 focus:ring-purple-500"
                                  />
                                  <span className="text-sm text-muted-foreground">{type}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-foreground">
                              Service Options
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={finalProfileData.remote_consultation}
                                  onChange={(e) =>
                                    setEditableProfileData({
                                      ...profileData,
                                      remote_consultation: e.target.checked
                                    })
                                  }
                                  disabled={!isEditing}
                                  className="rounded border-border focus:ring-2 focus:ring-purple-500"
                                />
                                <div className="flex items-center space-x-1">
                                  <Video className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm text-muted-foreground">Remote</span>
                                </div>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={finalProfileData.in_person_consultation}
                                  onChange={(e) =>
                                    setEditableProfileData({
                                      ...profileData,
                                      in_person_consultation: e.target.checked
                                    })
                                  }
                                  disabled={!isEditing}
                                  className="rounded border-border focus:ring-2 focus:ring-purple-500"
                                />
                                <div className="flex items-center space-x-1">
                                  <UserCheck className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-muted-foreground">In-Person</span>
                                </div>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={finalProfileData.emergency_support}
                                  onChange={(e) =>
                                    setEditableProfileData({
                                      ...profileData,
                                      emergency_support: e.target.checked
                                    })
                                  }
                                  disabled={!isEditing}
                                  className="rounded border-border focus:ring-2 focus:ring-purple-500"
                                />
                                <div className="flex items-center space-x-1">
                                  <Phone className="w-4 h-4 text-red-500" />
                                  <span className="text-sm text-muted-foreground">Emergency</span>
                                </div>
                              </label>
                            </div>
                          </div>
                        </>
                      )}

                     {/* Common fields for both */}
                     <div>
                       <label className="block text-sm font-medium mb-2 text-foreground">
                         Website
                       </label>
                       <input
                         type="url"
                         value={finalProfileData.website}
                         onChange={(e) =>
                           setEditableProfileData({
                             ...profileData,
                             website: e.target.value,
                           })
                         }
                         disabled={!isEditing}
                         placeholder="https://yourwebsite.com"
                         className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border disabled:bg-muted disabled:text-muted-foreground"
                       />
                     </div>

                     <div>
                       <label className="block text-sm font-medium mb-2 text-foreground">
                         LinkedIn
                       </label>
                       <input
                         type="text"
                         value={finalProfileData.linkedin}
                         onChange={(e) =>
                           setEditableProfileData({
                             ...profileData,
                             linkedin: e.target.value,
                           })
                         }
                         disabled={!isEditing}
                         placeholder="username"
                         className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border disabled:bg-muted disabled:text-muted-foreground"
                       />
                     </div>

                     <div>
                       <label className="block text-sm font-medium mb-2 text-foreground">
                         Timezone
                       </label>
                       <select
                         value={finalProfileData.timezone}
                         onChange={(e) =>
                           setEditableProfileData({
                             ...profileData,
                             timezone: e.target.value,
                           })
                         }
                         disabled={!isEditing}
                         className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border disabled:bg-muted disabled:text-muted-foreground"
                       >
                         <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                         <option value="America/New_York">America/New_York (EST)</option>
                         <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                         <option value="Europe/London">Europe/London (GMT)</option>
                         <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                       </select>
                     </div>
                   </div>

                  {/* Achievements */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-foreground">
                      Achievements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {achievements.map((achievement) => (
                        <motion.div
                          key={achievement.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            achievement.earned
                              ? 'border-green-700 bg-green-900/20'
                              : 'border-border bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`text-2xl ${
                                achievement.earned ? '' : 'grayscale opacity-50'
                              }`}
                            >
                              {achievement.icon}
                            </div>
                            <div>
                              <h4
                                className={`font-semibold ${
                                  achievement.earned
                                    ? 'text-green-300'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {achievement.title}
                              </h4>
                              <p
                                className={`text-sm ${
                                  achievement.earned
                                    ? 'text-green-400'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {achievement.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-foreground">
                      Notifications
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          key: 'email_notifications',
                          label: 'Email Notifications',
                          description: 'Receive updates via email',
                        },
                        {
                          key: 'push_notifications',
                          label: 'Push Notifications',
                          description: 'Browser and mobile notifications',
                        },
                        {
                          key: 'weekly_digest',
                          label: 'Weekly Digest',
                          description: 'Weekly summary of your progress',
                        },
                        {
                          key: 'mentor_suggestions',
                          label: 'AI Mentor Suggestions',
                          description: 'Get AI-powered task and call suggestions',
                        },
                        {
                          key: 'social_updates',
                          label: 'Social Updates',
                          description: 'Notifications from your network',
                        },
                        {
                          key: 'task_reminders',
                          label: 'Task Reminders',
                          description: 'Reminders for upcoming deadlines',
                        },
                        {
                          key: 'call_reminders',
                          label: 'Call Reminders',
                          description: 'Reminders for scheduled AI calls',
                        },
                      ].map((pref) => (
                        <div
                          key={pref.key}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                        >
                          <div>
                            <h4 className="font-medium text-foreground">
                              {pref.label}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {pref.description}
                            </p>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              setPreferences({
                                ...preferences,
                                [pref.key]: !preferences[pref.key],
                              })
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              preferences[pref.key]
                                ? 'bg-purple-500'
                                : 'bg-muted'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preferences[pref.key]
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-foreground">
                      Appearance
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                          <h4 className="font-medium text-foreground">
                            Theme
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Choose your preferred theme
                          </p>
                        </div>
                        <select
                          value={preferences.theme}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              theme: e.target.value,
                            })
                          }
                          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                          <h4 className="font-medium text-foreground">
                            Language
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Choose your preferred language
                          </p>
                        </div>
                        <select
                          value={preferences.language}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              language: e.target.value,
                            })
                          }
                          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background border-border"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="hi">Hindi</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-foreground">
                      Account Security
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">
                              Password
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Last changed 30 days ago
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 rounded-lg transition-colors bg-purple-500 text-white hover:bg-purple-600"
                          >
                            Change Password
                          </motion.button>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">
                              Two-Factor Authentication
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 rounded-lg transition-colors bg-green-500 text-white hover:bg-green-600"
                          >
                            Enable 2FA
                          </motion.button>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">
                              Active Sessions
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Manage your active sessions
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="font-medium text-purple-600 hover:text-purple-700"
                          >
                            View Sessions
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-foreground">
                      Data & Privacy
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">
                              Download Your Data
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Get a copy of your data
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="font-medium text-purple-600 hover:text-purple-700"
                          >
                            Download
                          </motion.button>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border bg-red-900/20 border-red-700/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-red-300">
                              Delete Account
                            </h4>
                            <p className="text-sm text-red-400">
                              Permanently delete your account and data
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 rounded-lg transition-colors bg-red-700 text-white hover:bg-red-600"
                          >
                            Delete Account
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6">
                  {/* Current Plan */}
                  <div className="p-6 rounded-xl border bg-muted/50 border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        Current Plan
                      </h3>
                      <div className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        FREE
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Status
                        </div>
                        <div className="font-medium text-green-600 dark:text-green-400">
                          Active
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">
                          Renewal Date
                        </div>
                        <div className="font-medium text-foreground">
                          N/A
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">
                          Billing Cycle
                        </div>
                        <div className="font-medium text-foreground">
                          N/A
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upgrade Section */}
                  <div className="p-6 rounded-xl border bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-700/50">
                    <h3 className="text-lg font-semibold mb-4 text-blue-300">
                      Upgrade Your Plan
                    </h3>
                    <p className="mb-4 text-blue-200">
                      Get access to premium features and unlimited AI mentor calls
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                    >
                      <Crown className="w-4 h-4 inline mr-2" />
                      Upgrade Now
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
