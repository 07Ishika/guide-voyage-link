// Script to seed production database with demo users
// Run this with production MongoDB URI to ensure demo users exist

const { MongoClient } = require('mongodb');

// Use Atlas URI for production
const uri = process.env.MONGODB_URI || 'mongodb+srv://your-atlas-connection-string';

const demoUsers = [
  {
    googleId: 'demo_migrant_production',
    displayName: 'Sarah Chen',
    email: 'sarah@example.com',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    role: 'migrant',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    googleId: 'demo_guide_production',
    displayName: 'Dr. Michael Rodriguez',
    email: 'michael@example.com',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    role: 'guide',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const demoProfiles = [
  {
    fullName: 'Sarah Chen',
    email: 'sarah@example.com',
    bio: 'Aspiring software engineer looking to relocate to Canada for better opportunities',
    timezone: 'Asia/Kolkata',
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
    fullName: 'Dr. Michael Rodriguez',
    email: 'michael@example.com',
    bio: 'Experienced immigration consultant helping migrants navigate their journey to success',
    timezone: 'America/Toronto',
    role: 'guide',
    specialization: ['Immigration Law & Consulting'],
    yearsExperience: '8+ years',
    hourlyRate: 150,
    availability: 'Available',
    citizenshipCountry: 'Canada',
    residenceCountry: 'Canada',
    targetCountries: ['Canada', 'USA', 'UK', 'Australia'],
    expertiseAreas: ['Student Visas', 'Work Permits', 'Family Sponsorship', 'Express Entry'],
    verifiedStatus: 'verified',
    rating: 4.8,
    totalReviews: 156,
    languages: ['English', 'Spanish'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedProductionDatabase() {
  console.log('🌱 Seeding Production Database with Demo Users...\n');

  if (!uri.includes('mongodb+srv://')) {
    console.log('⚠️  Warning: This doesn\'t look like a production Atlas URI');
    console.log('Current URI:', uri.substring(0, 20) + '...');
    console.log('Make sure to set MONGODB_URI environment variable to your Atlas connection string\n');
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to production MongoDB');
    
    const db = client.db();
    
    // Check existing demo users
    const existingUsers = await db.collection('users').find({
      $or: [
        { email: 'sarah@example.com' },
        { email: 'michael@example.com' }
      ]
    }).toArray();
    
    console.log(`📊 Found ${existingUsers.length} existing demo users`);
    
    // Insert demo users if they don't exist
    for (const user of demoUsers) {
      const existing = await db.collection('users').findOne({ email: user.email });
      
      if (!existing) {
        const result = await db.collection('users').insertOne(user);
        console.log(`✅ Created demo user: ${user.displayName} (${user.role})`);
        
        // Create corresponding profile
        const profile = demoProfiles.find(p => p.email === user.email);
        if (profile) {
          profile.userId = result.insertedId.toString();
          await db.collection('profiles').insertOne(profile);
          console.log(`📋 Created profile for: ${user.displayName}`);
        }
      } else {
        console.log(`⏭️  Demo user already exists: ${user.displayName} (${user.role})`);
        
        // Ensure profile exists
        const existingProfile = await db.collection('profiles').findOne({ 
          userId: existing._id.toString() 
        });
        
        if (!existingProfile) {
          const profile = demoProfiles.find(p => p.email === user.email);
          if (profile) {
            profile.userId = existing._id.toString();
            await db.collection('profiles').insertOne(profile);
            console.log(`📋 Created missing profile for: ${user.displayName}`);
          }
        }
      }
    }
    
    // Verify final state
    const finalUsers = await db.collection('users').find({
      $or: [
        { email: 'sarah@example.com' },
        { email: 'michael@example.com' }
      ]
    }).toArray();
    
    const finalProfiles = await db.collection('profiles').find({
      $or: [
        { email: 'sarah@example.com' },
        { email: 'michael@example.com' }
      ]
    }).toArray();
    
    console.log(`\n🎯 Production Database Status:`);
    console.log(`   👤 Demo users: ${finalUsers.length}`);
    console.log(`   📋 Demo profiles: ${finalProfiles.length}`);
    
    const migrantUsers = finalUsers.filter(u => u.role === 'migrant');
    const guideUsers = finalUsers.filter(u => u.role === 'guide');
    
    console.log(`   🧳 Migrants: ${migrantUsers.length}`);
    console.log(`   🎓 Guides: ${guideUsers.length}`);
    
    if (migrantUsers.length > 0 && guideUsers.length > 0) {
      console.log('\n✅ Production demo login ready!');
      console.log('🚀 Demo users are available for both roles');
      console.log('🌐 Test at: https://your-vercel-app.vercel.app/role');
    } else {
      console.log('\n❌ Demo setup incomplete');
    }
    
  } catch (error) {
    console.error('❌ Error seeding production database:', error.message);
  } finally {
    await client.close();
  }
}

// Run if called directly
if (require.main === module) {
  seedProductionDatabase();
}

module.exports = { seedProductionDatabase };