// Sample data seeding script for Voyagery database
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

const sampleData = {
  users: [
    {
      googleId: 'google_123456789',
      displayName: 'Sarah Chen',
      email: 'sarah@example.com',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      role: 'migrant',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      googleId: 'google_987654321',
      displayName: 'Dr. Michael Rodriguez',
      email: 'michael@example.com',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
      role: 'guide',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      googleId: 'google_456789123',
      displayName: 'Priya Sharma',
      email: 'priya@example.com',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
      role: 'migrant',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  
  profiles: [
    {
      userId: 'user_1', // Will be updated with actual ObjectId
      fullName: 'Sarah Chen',
      email: 'sarah@example.com',
      bio: 'Aspiring software engineer looking to relocate to Canada for better opportunities',
      timezone: 'Asia/Kolkata',
      website: 'https://sarahchen.dev',
      linkedin: 'sarahchen',
      role: 'migrant',
      currentLocation: 'Mumbai, India',
      targetCountry: 'Canada',
      targetCity: 'Toronto',
      visaType: 'Student Visa',
      educationLevel: 'Bachelor\'s Degree',
      fieldOfStudy: 'Computer Science',
      workExperience: '2 years',
      languages: ['English', 'Hindi', 'Mandarin'],
      budgetRange: '$15,000 - $25,000',
      timeline: '6-12 months',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: 'user_2', // Will be updated with actual ObjectId
      fullName: 'Dr. Michael Rodriguez',
      email: 'michael@example.com',
      bio: 'Experienced immigration consultant helping migrants navigate their journey to success',
      timezone: 'America/Toronto',
      website: 'https://michaelrodriguez.com',
      linkedin: 'michaelrodriguez',
      role: 'guide',
      specialization: 'Immigration Law & Consulting',
      yearsExperience: '8+ years',
      hourlyRate: '$150',
      availability: 'Mon-Fri, 9 AM - 6 PM EST',
      citizenshipCountry: 'Canada',
      residenceCountry: 'Canada',
      targetCountries: ['Canada', 'USA', 'UK', 'Australia'],
      professionalLicenses: ['Immigration Consultant License - ICCRC', 'Law Degree - University of Toronto'],
      verificationDocuments: ['Passport', 'Professional License', 'University Degree', 'Work Permit'],
      verifiedStatus: 'verified',
      verificationDate: new Date(),
      expertiseAreas: ['Student Visas', 'Work Permits', 'Family Sponsorship', 'Express Entry'],
      consultationTypes: ['Initial Assessment', 'Document Review', 'Application Filing', 'Interview Preparation'],
      remoteConsultation: true,
      inPersonConsultation: true,
      emergencySupport: true,
      rating: 4.8,
      totalReviews: 156,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: 'user_3', // Will be updated with actual ObjectId
      fullName: 'Priya Sharma',
      email: 'priya@example.com',
      bio: 'Marketing professional seeking opportunities in the UK',
      timezone: 'Asia/Kolkata',
      role: 'migrant',
      currentLocation: 'Delhi, India',
      targetCountry: 'United Kingdom',
      targetCity: 'London',
      visaType: 'Work Visa',
      educationLevel: 'Master\'s Degree',
      fieldOfStudy: 'Marketing',
      workExperience: '5 years',
      languages: ['English', 'Hindi', 'Punjabi'],
      budgetRange: '$20,000 - $30,000',
      timeline: '3-6 months',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  
  migrantRequests: [
    {
      migrantId: 'user_1',
      title: 'Student Visa Application Help',
      description: 'I need assistance with my student visa application for Canada. Looking for guidance on document preparation and interview preparation.',
      urgency: 'high',
      budget: 500,
      timeline: '2 weeks',
      specialization: ['Student Visas', 'Document Review'],
      targetCountry: 'Canada',
      visaType: 'Student Visa',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      migrantId: 'user_3',
      title: 'Work Visa Consultation',
      description: 'Need help with UK work visa process and finding job opportunities in marketing field.',
      urgency: 'medium',
      budget: 800,
      timeline: '1 month',
      specialization: ['Work Permits', 'Job Search'],
      targetCountry: 'United Kingdom',
      visaType: 'Work Visa',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  
  guideSessions: [
    {
      guideId: 'user_2',
      migrantId: 'user_1',
      requestId: 'request_1',
      sessionType: 'initial',
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      duration: 60,
      status: 'scheduled',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      notes: 'Initial consultation for student visa application',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  
  messages: [
    {
      conversationId: 'conv_user_1_user_2',
      senderId: 'user_1',
      receiverId: 'user_2',
      message: 'Hi Dr. Rodriguez, I\'m interested in your consultation services for my student visa application.',
      messageType: 'text',
      read: true,
      readAt: new Date(),
      createdAt: new Date()
    },
    {
      conversationId: 'conv_user_1_user_2',
      senderId: 'user_2',
      receiverId: 'user_1',
      message: 'Hello Sarah! I\'d be happy to help you with your student visa application. Let\'s schedule a consultation.',
      messageType: 'text',
      read: false,
      createdAt: new Date()
    }
  ],
  
  documents: [
    {
      userId: 'user_1',
      fileName: 'passport.pdf',
      fileType: 'passport',
      fileUrl: '/uploads/passport_user_1.pdf',
      fileSize: 2048576,
      mimeType: 'application/pdf',
      status: 'approved',
      verifiedBy: 'admin_1',
      verifiedAt: new Date(),
      uploadedAt: new Date()
    },
    {
      userId: 'user_2',
      fileName: 'professional_license.pdf',
      fileType: 'license',
      fileUrl: '/uploads/license_user_2.pdf',
      fileSize: 1536000,
      mimeType: 'application/pdf',
      status: 'approved',
      verifiedBy: 'admin_1',
      verifiedAt: new Date(),
      uploadedAt: new Date()
    }
  ],
  
  reviews: [
    {
      guideId: 'user_2',
      migrantId: 'user_1',
      sessionId: 'session_1',
      rating: 5,
      title: 'Excellent guidance!',
      review: 'Dr. Rodriguez provided excellent guidance for my visa application. Very professional and knowledgeable.',
      categories: {
        communication: 5,
        expertise: 5,
        punctuality: 5,
        helpfulness: 5
      },
      verified: true,
      createdAt: new Date()
    }
  ],
  
  notifications: [
    {
      userId: 'user_1',
      type: 'request',
      title: 'New Guide Response',
      message: 'Dr. Michael Rodriguez has responded to your consultation request.',
      data: { guideId: 'user_2', requestId: 'request_1' },
      read: false,
      createdAt: new Date()
    },
    {
      userId: 'user_2',
      type: 'message',
      title: 'New Message',
      message: 'You have a new message from Sarah Chen.',
      data: { migrantId: 'user_1', conversationId: 'conv_user_1_user_2' },
      read: false,
      createdAt: new Date()
    }
  ]
};

async function seedDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Clear existing data (optional - remove if you want to keep existing data)
    console.log('Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('profiles').deleteMany({});
    await db.collection('migrant_requests').deleteMany({});
    await db.collection('guide_sessions').deleteMany({});
    await db.collection('messages').deleteMany({});
    await db.collection('documents').deleteMany({});
    await db.collection('reviews').deleteMany({});
    await db.collection('notifications').deleteMany({});
    
    // Insert users first
    console.log('Inserting users...');
    const userResult = await db.collection('users').insertMany(sampleData.users);
    const userIds = Object.values(userResult.insertedIds);
    
    // Update profile userIds with actual ObjectIds
    sampleData.profiles.forEach((profile, index) => {
      profile.userId = userIds[index].toString();
    });
    
    // Update other collections with actual userIds
    sampleData.migrantRequests.forEach((request, index) => {
      request.migrantId = userIds[index % userIds.length].toString();
    });
    
    sampleData.guideSessions.forEach((session) => {
      session.guideId = userIds[1].toString(); // Dr. Michael Rodriguez
      session.migrantId = userIds[0].toString(); // Sarah Chen
    });
    
    sampleData.messages.forEach((message) => {
      message.senderId = message.senderId === 'user_1' ? userIds[0].toString() : userIds[1].toString();
      message.receiverId = message.receiverId === 'user_1' ? userIds[0].toString() : userIds[1].toString();
    });
    
    sampleData.documents.forEach((doc, index) => {
      doc.userId = userIds[index].toString();
    });
    
    sampleData.reviews.forEach((review) => {
      review.guideId = userIds[1].toString();
      review.migrantId = userIds[0].toString();
    });
    
    sampleData.notifications.forEach((notification) => {
      notification.userId = notification.userId === 'user_1' ? userIds[0].toString() : userIds[1].toString();
    });
    
    // Insert all collections
    console.log('Inserting profiles...');
    await db.collection('profiles').insertMany(sampleData.profiles);
    
    console.log('Inserting migrant requests...');
    await db.collection('migrant_requests').insertMany(sampleData.migrantRequests);
    
    console.log('Inserting guide sessions...');
    await db.collection('guide_sessions').insertMany(sampleData.guideSessions);
    
    console.log('Inserting messages...');
    await db.collection('messages').insertMany(sampleData.messages);
    
    console.log('Inserting documents...');
    await db.collection('documents').insertMany(sampleData.documents);
    
    console.log('Inserting reviews...');
    await db.collection('reviews').insertMany(sampleData.reviews);
    
    console.log('Inserting notifications...');
    await db.collection('notifications').insertMany(sampleData.notifications);
    
    console.log('✅ Database seeded successfully!');
    console.log(`Inserted ${userIds.length} users, ${sampleData.profiles.length} profiles, and related data.`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleData };

