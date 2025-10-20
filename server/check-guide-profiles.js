// Script to check and fix guide profiles for the search endpoint
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function checkGuideProfiles() {
  console.log('🔍 Checking Guide Profiles...\n');

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // Check all profiles
    console.log('📊 All profiles:');
    const allProfiles = await db.collection('profiles').find({}).toArray();
    console.log(`Found ${allProfiles.length} profiles total`);
    
    allProfiles.forEach(profile => {
      console.log(`   - ${profile.fullName} (${profile.email}) - Role: ${profile.role}`);
    });
    
    // Check guide profiles specifically
    console.log('\n🎓 Guide profiles:');
    const guideProfiles = await db.collection('profiles').find({ role: 'guide' }).toArray();
    console.log(`Found ${guideProfiles.length} guide profiles`);
    
    if (guideProfiles.length > 0) {
      guideProfiles.forEach(guide => {
        console.log(`   ✅ ${guide.fullName} - ${guide.specialization || 'No specialization'}`);
        console.log(`      - Rating: ${guide.rating || 'No rating'}`);
        console.log(`      - Countries: ${guide.targetCountries || 'No countries'}`);
        console.log(`      - Hourly Rate: $${guide.hourlyRate || 'No rate'}`);
      });
    } else {
      console.log('❌ No guide profiles found!');
      
      // Let's check if there are users with guide role but no profiles
      const guideUsers = await db.collection('users').find({ role: 'guide' }).toArray();
      console.log(`\n👥 Found ${guideUsers.length} guide users:`);
      
      for (const user of guideUsers) {
        console.log(`   - ${user.displayName} (${user.email})`);
        
        // Check if this user has a profile
        const existingProfile = await db.collection('profiles').findOne({ 
          userId: user._id.toString() 
        });
        
        if (!existingProfile) {
          console.log(`     ❌ No profile found - creating one...`);
          
          // Create a guide profile
          const guideProfile = {
            userId: user._id.toString(),
            fullName: user.displayName,
            email: user.email,
            role: 'guide',
            specialization: ['Immigration Law & Consulting'],
            residenceCountry: 'Canada',
            targetCountries: ['Canada', 'USA', 'UK', 'Australia'],
            expertiseAreas: ['Student Visas', 'Work Permits', 'Family Sponsorship', 'Express Entry'],
            rating: 4.8,
            totalReviews: 156,
            hourlyRate: 150,
            languages: ['English', 'Spanish'],
            yearsExperience: '8+ years',
            availability: 'Available',
            verifiedStatus: 'verified',
            bio: 'Experienced immigration consultant helping migrants navigate their journey to success',
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          await db.collection('profiles').insertOne(guideProfile);
          console.log(`     ✅ Created guide profile for ${user.displayName}`);
        } else {
          console.log(`     ✅ Profile exists`);
          
          // Update profile to ensure it has all required fields
          const updateFields = {};
          
          if (!existingProfile.specialization) {
            updateFields.specialization = ['Immigration Law & Consulting'];
          }
          if (!existingProfile.targetCountries) {
            updateFields.targetCountries = ['Canada', 'USA', 'UK', 'Australia'];
          }
          if (!existingProfile.rating) {
            updateFields.rating = 4.8;
          }
          if (!existingProfile.hourlyRate) {
            updateFields.hourlyRate = 150;
          }
          if (!existingProfile.availability) {
            updateFields.availability = 'Available';
          }
          if (!existingProfile.verifiedStatus) {
            updateFields.verifiedStatus = 'verified';
          }
          
          if (Object.keys(updateFields).length > 0) {
            await db.collection('profiles').updateOne(
              { _id: existingProfile._id },
              { $set: updateFields }
            );
            console.log(`     🔧 Updated profile with missing fields`);
          }
        }
      }
    }
    
    // Final verification
    console.log('\n🎯 Final verification:');
    const finalGuideProfiles = await db.collection('profiles').find({ role: 'guide' }).toArray();
    console.log(`✅ Total guide profiles: ${finalGuideProfiles.length}`);
    
    if (finalGuideProfiles.length > 0) {
      console.log('🎉 Guide profiles are ready for search!');
      finalGuideProfiles.forEach(guide => {
        console.log(`   - ${guide.fullName}: $${guide.hourlyRate}/hr, ${guide.rating}⭐`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking guide profiles:', error.message);
  } finally {
    await client.close();
  }
}

checkGuideProfiles();