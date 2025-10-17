// Script to seed the database with sample guide profiles for testing

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function seedProfiles() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const profilesCollection = db.collection('profiles');
    const usersCollection = db.collection('users');
    
    // Find users
    const guide = await usersCollection.findOne({ displayName: /Michael Rodriguez/i });
    const migrant = await usersCollection.findOne({ displayName: /Sarah Chen/i });
    
    if (!guide || !migrant) {
      console.log('Users not found. Please run seed-sessions.js first.');
      return;
    }
    
    // Create guide profile
    const guideProfile = {
      userId: guide._id.toString(),
      fullName: guide.displayName,
      email: guide.email,
      role: 'guide',
      specialization: ['Tech Immigration', 'Express Entry', 'Provincial Nominee Program'],
      residenceCountry: 'Canada',
      targetCountries: ['Canada'],
      expertiseAreas: ['Immigration Law', 'Visa Processing', 'Express Entry', 'PNP', 'Family Sponsorship'],
      rating: 4.8,
      totalReviews: 127,
      hourlyRate: 65,
      languages: ['English', 'Spanish', 'French'],
      yearsExperience: '8+ years',
      availability: 'Available',
      verifiedStatus: 'verified',
      bio: 'Experienced immigration consultant specializing in Canadian immigration. I have helped over 500 clients successfully navigate the immigration process.',
      education: 'Master of Laws (Immigration Law), University of Toronto',
      certifications: ['RCIC - Regulated Canadian Immigration Consultant', 'CAPIC Member'],
      successRate: 94,
      responseTime: '< 2 hours',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create migrant profile
    const migrantProfile = {
      userId: migrant._id.toString(),
      fullName: migrant.displayName,
      email: migrant.email,
      role: 'migrant',
      currentCountry: 'India',
      targetCountries: ['Canada', 'Australia'],
      profession: 'Software Engineer',
      experience: '5+ years',
      education: 'Bachelor of Technology - Computer Science',
      languages: ['English', 'Hindi', 'Mandarin'],
      immigrationGoals: ['Permanent Residence', 'Work Permit'],
      timeline: '6-12 months',
      budget: '$50-80 per session',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Clear existing profiles
    await profilesCollection.deleteMany({ 
      userId: { $in: [guide._id.toString(), migrant._id.toString()] }
    });
    
    // Insert profiles
    const result = await profilesCollection.insertMany([guideProfile, migrantProfile]);
    console.log(`✅ Created profiles for ${result.insertedCount} users`);
    
    console.log('\n📋 Profiles created:');
    console.log(`1. Guide: ${guideProfile.fullName} - ${guideProfile.specialization.join(', ')}`);
    console.log(`2. Migrant: ${migrantProfile.fullName} - ${migrantProfile.profession}`);
    
  } catch (error) {
    console.error('Error seeding profiles:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the seeding function
seedProfiles().catch(console.error);