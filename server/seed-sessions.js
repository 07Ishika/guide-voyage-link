// Script to seed the database with sample guide sessions for testing

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function seedSessions() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const guideSessionsCollection = db.collection('guide_sessions');
    const usersCollection = db.collection('users');
    
    // Find Dr. Michael Rodriguez (guide) and Sarah Chen (migrant)
    const guide = await usersCollection.findOne({ displayName: /Michael Rodriguez/i });
    const migrant = await usersCollection.findOne({ displayName: /Sarah Chen/i });
    
    if (!guide) {
      console.log('Guide not found. Creating Dr. Michael Rodriguez...');
      const newGuide = {
        googleId: 'guide_123',
        displayName: 'Dr. Michael Rodriguez',
        email: 'michael@example.com',
        role: 'guide',
        photo: null
      };
      const result = await usersCollection.insertOne(newGuide);
      console.log('Created guide with ID:', result.insertedId);
    }
    
    if (!migrant) {
      console.log('Migrant not found. Creating Sarah Chen...');
      const newMigrant = {
        googleId: 'migrant_123',
        displayName: 'Sarah Chen',
        email: 'sarah@example.com',
        role: 'migrant',
        photo: null
      };
      const result = await usersCollection.insertOne(newMigrant);
      console.log('Created migrant with ID:', result.insertedId);
    }
    
    // Get updated user data
    const guideUser = await usersCollection.findOne({ displayName: /Michael Rodriguez/i });
    const migrantUser = await usersCollection.findOne({ displayName: /Sarah Chen/i });
    
    // Sample session requests for the guide
    const sampleSessions = [
      {
        guideId: guideUser._id.toString(),
        migrantId: migrantUser._id.toString(),
        migrantName: migrantUser.displayName,
        migrantEmail: migrantUser.email,
        title: 'Tech Immigration to Canada - Express Entry',
        purpose: 'I need guidance on the Express Entry process for software engineers',
        notes: 'I have 5 years of experience as a full-stack developer and want to immigrate to Canada through the Express Entry system. I need help understanding the CRS score calculation and document requirements.',
        budget: '$50-70',
        timeline: '3-6 months',
        urgency: 'high',
        preferredTime: 'Weekday evenings (EST)',
        duration: 60,
        specificQuestions: 'What documents do I need for work experience verification? How can I improve my CRS score?',
        requestStatus: 'pending',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        guideId: guideUser._id.toString(),
        migrantId: migrantUser._id.toString(),
        migrantName: 'Priya Sharma',
        migrantEmail: 'priya@example.com',
        title: 'Provincial Nominee Program (PNP) Consultation',
        purpose: 'Seeking advice on Ontario PNP for healthcare professionals',
        notes: 'I am a registered nurse with 7 years of experience in India. I want to understand the Ontario PNP process and licensing requirements for nurses in Canada.',
        budget: '$40-60',
        timeline: '6-12 months',
        urgency: 'medium',
        preferredTime: 'Weekend mornings',
        duration: 90,
        specificQuestions: 'What are the licensing requirements for nurses in Ontario? How long does the PNP process typically take?',
        requestStatus: 'pending',
        status: 'pending',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        guideId: guideUser._id.toString(),
        migrantId: migrantUser._id.toString(),
        migrantName: 'Ahmed Hassan',
        migrantEmail: 'ahmed@example.com',
        title: 'Family Sponsorship Application Review',
        purpose: 'Need help with spouse sponsorship application',
        notes: 'My wife and I are preparing our spouse sponsorship application. We want to ensure all documents are complete and properly prepared before submission.',
        budget: '$60-80',
        timeline: '2-4 months',
        urgency: 'high',
        preferredTime: 'Flexible',
        duration: 75,
        specificQuestions: 'What are the most common reasons for spouse sponsorship rejections? How can we strengthen our application?',
        requestStatus: 'accepted',
        status: 'scheduled',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)  // 12 hours ago
      },
      {
        guideId: guideUser._id.toString(),
        migrantId: migrantUser._id.toString(),
        migrantName: 'Maria Gonzalez',
        migrantEmail: 'maria@example.com',
        title: 'Study Permit and Post-Graduation Work Permit',
        purpose: 'Guidance on study permit application and future work opportunities',
        notes: 'I want to pursue a Master\'s degree in Computer Science in Canada. I need guidance on the study permit process and understanding the post-graduation work permit pathway.',
        budget: '$45-65',
        timeline: '8-12 months',
        urgency: 'low',
        preferredTime: 'Weekday afternoons',
        duration: 60,
        specificQuestions: 'Which universities have the best programs for international students? What are the job prospects after graduation?',
        requestStatus: 'pending',
        status: 'pending',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      {
        guideId: guideUser._id.toString(),
        migrantId: migrantUser._id.toString(),
        migrantName: 'David Kim',
        migrantEmail: 'david@example.com',
        title: 'Business Immigration - Start-up Visa Program',
        purpose: 'Consultation on Start-up Visa Program requirements',
        notes: 'I have a tech startup idea and want to explore the Start-up Visa Program. I need to understand the requirements for designated organizations and business plan preparation.',
        budget: '$70-100',
        timeline: '12-18 months',
        urgency: 'medium',
        preferredTime: 'Evening calls preferred',
        duration: 120,
        specificQuestions: 'How do I find designated organizations? What makes a strong business plan for this program?',
        requestStatus: 'completed',
        status: 'completed',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)   // 5 days ago
      }
    ];
    
    // Clear existing sessions for this guide
    await guideSessionsCollection.deleteMany({ guideId: guideUser._id.toString() });
    
    // Insert sample sessions
    const result = await guideSessionsCollection.insertMany(sampleSessions);
    console.log(`✅ Inserted ${result.insertedCount} sample sessions for guide: ${guideUser.displayName}`);
    
    // Display the sessions
    const sessions = await guideSessionsCollection.find({ guideId: guideUser._id.toString() }).toArray();
    console.log('\n📋 Sample sessions created:');
    sessions.forEach((session, index) => {
      console.log(`${index + 1}. ${session.title} - ${session.requestStatus} (${session.migrantName})`);
    });
    
  } catch (error) {
    console.error('Error seeding sessions:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the seeding function
seedSessions().catch(console.error);