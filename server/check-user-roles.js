// Script to check and fix user roles in the database

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function checkUserRoles() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    const profilesCollection = db.collection('profiles');
    
    // Get all users
    const users = await usersCollection.find({}).toArray();
    console.log('\n👥 All Users in Database:');
    users.forEach(user => {
      console.log(`- ${user.displayName} | Role: ${user.role} | ID: ${user._id}`);
    });
    
    // Get all profiles
    const profiles = await profilesCollection.find({}).toArray();
    console.log('\n📋 All Profiles in Database:');
    profiles.forEach(profile => {
      console.log(`- ${profile.fullName} | Role: ${profile.role} | UserID: ${profile.userId}`);
    });
    
    // Check for role mismatches
    console.log('\n🔍 Checking for Role Issues:');
    
    const michael = users.find(u => u.displayName.includes('Michael'));
    const sarah = users.find(u => u.displayName.includes('Sarah'));
    const ishika = users.find(u => u.displayName.includes('Ishika'));
    
    if (michael) {
      console.log(`✅ Michael Rodriguez: ${michael.role} (should be 'guide')`);
      if (michael.role !== 'guide') {
        console.log('❌ FIXING: Setting Michael as guide');
        await usersCollection.updateOne(
          { _id: michael._id },
          { $set: { role: 'guide' } }
        );
      }
    }
    
    if (sarah) {
      console.log(`✅ Sarah Chen: ${sarah.role} (should be 'migrant')`);
      if (sarah.role !== 'migrant') {
        console.log('❌ FIXING: Setting Sarah as migrant');
        await usersCollection.updateOne(
          { _id: sarah._id },
          { $set: { role: 'migrant' } }
        );
      }
    }
    
    if (ishika) {
      console.log(`✅ Ishika Sharma: ${ishika.role} (should be 'migrant')`);
      if (ishika.role !== 'migrant') {
        console.log('❌ FIXING: Setting Ishika as migrant');
        await usersCollection.updateOne(
          { _id: ishika._id },
          { $set: { role: 'migrant' } }
        );
      }
    }
    
    // Also fix profiles
    console.log('\n🔧 Fixing Profile Roles:');
    
    if (michael) {
      const michaelProfile = profiles.find(p => p.userId === michael._id.toString());
      if (michaelProfile && michaelProfile.role !== 'guide') {
        console.log('❌ FIXING: Setting Michael profile as guide');
        await profilesCollection.updateOne(
          { userId: michael._id.toString() },
          { $set: { role: 'guide' } }
        );
      }
    }
    
    if (sarah) {
      const sarahProfile = profiles.find(p => p.userId === sarah._id.toString());
      if (sarahProfile && sarahProfile.role !== 'migrant') {
        console.log('❌ FIXING: Setting Sarah profile as migrant');
        await profilesCollection.updateOne(
          { userId: sarah._id.toString() },
          { $set: { role: 'migrant' } }
        );
      }
    }
    
    if (ishika) {
      const ishikaProfile = profiles.find(p => p.userId === ishika._id.toString());
      if (ishikaProfile && ishikaProfile.role !== 'migrant') {
        console.log('❌ FIXING: Setting Ishika profile as migrant');
        await profilesCollection.updateOne(
          { userId: ishika._id.toString() },
          { $set: { role: 'migrant' } }
        );
      }
    }
    
    console.log('\n✅ User roles have been fixed!');
    console.log('\n🎯 Expected Behavior:');
    console.log('- Login as Sarah/Ishika → Should go to /guides (migrant view)');
    console.log('- Login as Michael → Should go to /home/guide (guide view)');
    console.log('- Only Michael should have access to /dashboard-guide');
    console.log('- Sarah/Ishika can only make requests TO Michael');
    
  } catch (error) {
    console.error('Error checking user roles:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the function
checkUserRoles().catch(console.error);