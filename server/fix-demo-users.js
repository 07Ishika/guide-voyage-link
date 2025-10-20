// Script to fix demo users in production database
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Use your Atlas connection string
const uri = process.env.MONGODB_URI || 'mongodb+srv://your-atlas-connection-string';

async function fixDemoUsers() {
  console.log('🔧 Fixing Demo Users in Production Database...\n');

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to production MongoDB');
    
    const db = client.db();
    
    // First, let's see what demo users currently exist
    console.log('📊 Current demo users:');
    const existingUsers = await db.collection('users').find({
      $or: [
        { email: 'sarah@example.com' },
        { email: 'michael@example.com' },
        { displayName: 'Sarah Chen' },
        { displayName: 'Dr. Michael Rodriguez' }
      ]
    }).toArray();
    
    console.log(`Found ${existingUsers.length} existing demo users:`);
    existingUsers.forEach(user => {
      console.log(`   - ${user.displayName} (${user.email}) - Role: ${user.role}`);
    });
    
    // Remove any duplicate or incorrect demo users
    console.log('\n🧹 Cleaning up existing demo users...');
    const deleteResult = await db.collection('users').deleteMany({
      $or: [
        { email: 'sarah@example.com' },
        { email: 'michael@example.com' }
      ]
    });
    
    // Also clean up their profiles
    const deleteProfileResult = await db.collection('profiles').deleteMany({
      $or: [
        { email: 'sarah@example.com' },
        { email: 'michael@example.com' }
      ]
    });
    
    console.log(`✅ Deleted ${deleteResult.deletedCount} users and ${deleteProfileResult.deletedCount} profiles`);
    
    // Create fresh demo users with correct roles
    console.log('\n👥 Creating fresh demo users...');
    
    const demoUsers = [
      {
        googleId: 'demo_migrant_production_fixed',
        displayName: 'Sarah Chen',
        email: 'sarah@example.com',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        role: 'migrant',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        googleId: 'demo_guide_production_fixed',
        displayName: 'Dr. Michael Rodriguez',
        email: 'michael@example.com',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
        role: 'guide',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insert the demo users
    const userResults = await db.collection('users').insertMany(demoUsers);
    console.log('✅ Created demo users');
    
    // Create corresponding profiles
    const demoProfiles = [
      {
        userId: userResults.insertedIds[0].toString(),
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
        userId: userResults.insertedIds[1].toString(),
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
    
    await db.collection('profiles').insertMany(demoProfiles);
    console.log('✅ Created demo profiles');
    
    // Verify the final state
    console.log('\n🎯 Final verification:');
    const finalUsers = await db.collection('users').find({
      $or: [
        { email: 'sarah@example.com' },
        { email: 'michael@example.com' }
      ]
    }).toArray();
    
    finalUsers.forEach(user => {
      console.log(`   ✅ ${user.displayName} (${user.email}) - Role: ${user.role}`);
    });
    
    const finalProfiles = await db.collection('profiles').find({
      $or: [
        { email: 'sarah@example.com' },
        { email: 'michael@example.com' }
      ]
    }).toArray();
    
    console.log(`\n📋 Profiles created: ${finalProfiles.length}`);
    
    if (finalUsers.length === 2 && finalProfiles.length === 2) {
      console.log('\n🎉 Demo users fixed successfully!');
      console.log('✅ Sarah Chen (migrant) - ready for demo');
      console.log('✅ Dr. Michael Rodriguez (guide) - ready for demo');
      console.log('\n🚀 Test at: https://guide-voyage-link.vercel.app/role');
    } else {
      console.log('\n❌ Something went wrong with the fix');
    }
    
  } catch (error) {
    console.error('❌ Error fixing demo users:', error.message);
  } finally {
    await client.close();
  }
}

// Run if called directly
if (require.main === module) {
  fixDemoUsers();
}

module.exports = { fixDemoUsers };