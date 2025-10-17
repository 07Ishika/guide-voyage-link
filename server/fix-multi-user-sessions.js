const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function fixMultiUserSessions() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    console.log('\n🔍 MULTI-USER SESSION ISSUE ANALYSIS:');
    console.log('=' .repeat(60));
    
    console.log('\n❌ CURRENT PROBLEM:');
    console.log('- Browser tabs share the same session cookie');
    console.log('- When you login as different users in different tabs:');
    console.log('  Tab 1: Login as Migrant → Session stores Migrant');
    console.log('  Tab 2: Login as Guide → Session overwrites with Guide');
    console.log('  Tab 1: Now shows Guide (role switched!)');
    
    console.log('\n🔧 SOLUTIONS:');
    console.log('1. Use different browsers (Chrome vs Firefox)');
    console.log('2. Use incognito/private windows');
    console.log('3. Implement user switching in same session');
    console.log('4. Use different ports/domains');
    
    console.log('\n✅ RECOMMENDED APPROACH:');
    console.log('- Add "Switch User" functionality');
    console.log('- Allow quick switching between roles in same browser');
    console.log('- Keep session stable for single user');
    
    // Check current session
    const sessions = await db.collection('sessions').find({}).toArray();
    const activeSessions = sessions.filter(s => {
      try {
        const sessionData = JSON.parse(s.session);
        return sessionData.passport && sessionData.passport.user;
      } catch (e) {
        return false;
      }
    });
    
    console.log('\n📊 CURRENT SESSION STATUS:');
    console.log(`Total sessions: ${sessions.length}`);
    console.log(`Active sessions: ${activeSessions.length}`);
    
    if (activeSessions.length > 0) {
      const sessionData = JSON.parse(activeSessions[0].session);
      const userId = sessionData.passport.user;
      
      // Find the user
      const { ObjectId } = require('mongodb');
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      
      console.log(`Currently logged in: ${user?.displayName} (${user?.role})`);
      console.log('This user will appear in ALL browser tabs');
    }
    
    console.log('\n💡 TESTING INSTRUCTIONS:');
    console.log('1. To test different roles simultaneously:');
    console.log('   - Use Chrome for Migrant');
    console.log('   - Use Firefox/Edge for Guide');
    console.log('   - Or use Chrome + Chrome Incognito');
    console.log('');
    console.log('2. To switch users in same browser:');
    console.log('   - Logout current user');
    console.log('   - Login as different user');
    console.log('   - All tabs will switch to new user');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run the analysis
fixMultiUserSessions();