// Script to create test users for real-time session flow testing

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function createTestUsers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    const profilesCollection = db.collection('profiles');
    
    // Create test users
    const testUsers = [
      {
        googleId: 'guide_michael_123',
        displayName: 'Dr. Michael Rodriguez',
        email: 'michael@example.com',
        role: 'guide',
        photo: null
      },
      {
        googleId: 'migrant_ishika_123',
        displayName: 'Ishika Sharma',
        email: 'ishika@example.com',
        role: 'migrant',
        photo: null
      },
      {
        googleId: 'migrant_sarah_123',
        displayName: 'Sarah Chen',
        email: 'sarah@example.com',
        role: 'migrant',
        photo: null
      }
    ];
    
    // Clear existing test users
    await usersCollection.deleteMany({ 
      googleId: { $in: testUsers.map(u => u.googleId) }
    });
    
    // Insert test users
    const userResults = await usersCollection.insertMany(testUsers);
    console.log(`✅ Created ${userResults.insertedCount} test users`);
    
    // Get inserted users with their IDs
    const insertedUsers = await usersCollection.find({ 
      googleId: { $in: testUsers.map(u => u.googleId) }
    }).toArray();
    
    // Create profiles for users
    const profiles = [];
    
    // Guide profile
    const guideUser = insertedUsers.find(u => u.role === 'guide');
    profiles.push({
      userId: guideUser._id.toString(),
      fullName: guideUser.displayName,
      email: guideUser.email,
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
      bio: 'Experienced immigration consultant specializing in Canadian immigration.',
      education: 'Master of Laws (Immigration Law), University of Toronto',
      certifications: ['RCIC - Regulated Canadian Immigration Consultant', 'CAPIC Member'],
      successRate: 94,
      responseTime: '< 2 hours',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Migrant profiles
    const migrantUsers = insertedUsers.filter(u => u.role === 'migrant');
    migrantUsers.forEach(user => {
      profiles.push({
        userId: user._id.toString(),
        fullName: user.displayName,
        email: user.email,
        role: 'migrant',
        currentCountry: user.displayName.includes('Ishika') ? 'India' : 'China',
        targetCountries: ['Canada', 'Australia'],
        profession: user.displayName.includes('Ishika') ? 'Software Engineer' : 'Data Scientist',
        experience: '5+ years',
        education: 'Bachelor of Technology - Computer Science',
        languages: user.displayName.includes('Ishika') ? ['English', 'Hindi'] : ['English', 'Mandarin'],
        immigrationGoals: ['Permanent Residence', 'Work Permit'],
        timeline: '6-12 months',
        budget: '$50-80 per session',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    // Clear existing profiles
    await profilesCollection.deleteMany({ 
      userId: { $in: insertedUsers.map(u => u._id.toString()) }
    });
    
    // Insert profiles
    const profileResults = await profilesCollection.insertMany(profiles);
    console.log(`✅ Created ${profileResults.insertedCount} test profiles`);
    
    console.log('\n📋 Test users created:');
    insertedUsers.forEach(user => {
      console.log(`- ${user.displayName} (${user.role}) - ID: ${user._id}`);
    });
    
    console.log('\n🎯 Test Flow:');
    console.log('1. Login as Ishika Sharma (migrant) - go to /guides');
    console.log('2. Find Dr. Michael Rodriguez and click "Book Call"');
    console.log('3. Fill out the call request form and submit');
    console.log('4. Login as Dr. Michael Rodriguez (guide) - go to /dashboard-guide');
    console.log('5. See the new session request and accept/decline it');
    
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the function
createTestUsers().catch(console.error);