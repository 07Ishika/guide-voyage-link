// Script to debug session requests in the database

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function debugSessions() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const guideSessionsCollection = db.collection('guide_sessions');
    const usersCollection = db.collection('users');
    
    // Get all users
    const users = await usersCollection.find({}).toArray();
    console.log('\n👥 All Users:');
    users.forEach(user => {
      console.log(`- ${user.displayName} (${user.role}) - ID: ${user._id}`);
    });
    
    // Get all sessions
    const sessions = await guideSessionsCollection.find({}).toArray();
    console.log(`\n📋 All Sessions (${sessions.length} total):`);
    
    if (sessions.length === 0) {
      console.log('❌ No sessions found in database!');
      console.log('This means the call request from Ishika was not saved properly.');
    } else {
      sessions.forEach((session, index) => {
        console.log(`\n${index + 1}. Session ID: ${session._id}`);
        console.log(`   Guide ID: ${session.guideId}`);
        console.log(`   Migrant ID: ${session.migrantId}`);
        console.log(`   Migrant Name: ${session.migrantName}`);
        console.log(`   Guide Name: ${session.guideName}`);
        console.log(`   Title: ${session.title}`);
        console.log(`   Status: ${session.requestStatus || session.status}`);
        console.log(`   Created: ${session.createdAt}`);
      });
    }
    
    // Find Michael's user ID
    const michael = users.find(u => u.displayName.includes('Michael'));
    if (michael) {
      console.log(`\n🔍 Michael's User ID: ${michael._id}`);
      
      // Find sessions for Michael
      const michaelSessions = sessions.filter(s => s.guideId === michael._id.toString());
      console.log(`📊 Sessions for Michael: ${michaelSessions.length}`);
      
      if (michaelSessions.length === 0) {
        console.log('❌ No sessions found for Michael!');
        console.log('Possible issues:');
        console.log('1. Call request was not saved to database');
        console.log('2. guideId in session does not match Michael\'s user ID');
        console.log('3. API endpoint is not working properly');
      }
    }
    
  } catch (error) {
    console.error('Error debugging sessions:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the function
debugSessions().catch(console.error);