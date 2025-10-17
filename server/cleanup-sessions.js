const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function cleanupSessions() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // Get current session count
    const totalSessions = await db.collection('sessions').countDocuments();
    console.log(`📊 Total sessions before cleanup: ${totalSessions}`);
    
    // Find sessions without user data (empty sessions)
    const emptySessions = await db.collection('sessions').find({
      $or: [
        { 'session': { $not: { $regex: 'passport' } } },
        { 'session': { $regex: '"passport":\\s*{}' } }
      ]
    }).toArray();
    
    console.log(`🗑️  Empty sessions found: ${emptySessions.length}`);
    
    // Find sessions with user data (active sessions)
    const activeSessions = await db.collection('sessions').find({
      'session': { $regex: '"passport":\\s*{\\s*"user"' }
    }).toArray();
    
    console.log(`✅ Active sessions found: ${activeSessions.length}`);
    
    if (activeSessions.length > 0) {
      console.log('\n👤 Active sessions:');
      activeSessions.forEach((session, index) => {
        try {
          const sessionData = JSON.parse(session.session);
          console.log(`   ${index + 1}. User ID: ${sessionData.passport?.user || 'Unknown'}`);
        } catch (e) {
          console.log(`   ${index + 1}. Could not parse session data`);
        }
      });
    }
    
    // Delete empty sessions
    if (emptySessions.length > 0) {
      const result = await db.collection('sessions').deleteMany({
        $or: [
          { 'session': { $not: { $regex: 'passport' } } },
          { 'session': { $regex: '"passport":\\s*{}' } }
        ]
      });
      
      console.log(`\n🗑️  Deleted ${result.deletedCount} empty sessions`);
    }
    
    // Get final session count
    const finalSessions = await db.collection('sessions').countDocuments();
    console.log(`📊 Total sessions after cleanup: ${finalSessions}`);
    
    console.log('\n✅ Session cleanup completed!');
    console.log('💡 This should fix role switching between tabs');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await client.close();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run the cleanup
cleanupSessions();