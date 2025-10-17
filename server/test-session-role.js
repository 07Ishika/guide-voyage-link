const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function testSessionAndRole() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // 1. Check users collection for role data
    console.log('\n📋 USERS WITH ROLES:');
    console.log('=' .repeat(50));
    
    const users = await db.collection('users').find({}).toArray();
    
    users.forEach((user, index) => {
      console.log(`\n👤 User ${index + 1}:`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Name: ${user.displayName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role || 'NO ROLE SET'}`);
      console.log(`   Created: ${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}`);
      console.log(`   Updated: ${user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'N/A'}`);
    });
    
    // 2. Check sessions collection
    console.log('\n\n🔐 ACTIVE SESSIONS:');
    console.log('=' .repeat(50));
    
    const sessions = await db.collection('sessions').find({}).toArray();
    
    if (sessions.length === 0) {
      console.log('❌ No active sessions found');
    } else {
      sessions.forEach((session, index) => {
        console.log(`\n🔐 Session ${index + 1}:`);
        console.log(`   Session ID: ${session._id}`);
        console.log(`   Expires: ${new Date(session.expires).toLocaleString()}`);
        
        // Parse session data
        try {
          const sessionData = JSON.parse(session.session);
          console.log(`   User ID in Session: ${sessionData.passport?.user || 'None'}`);
          console.log(`   Session Data:`, sessionData);
        } catch (e) {
          console.log(`   Session Data: Could not parse`);
        }
      });
    }
    
    // 3. Check for role consistency
    console.log('\n\n🔍 ROLE CONSISTENCY CHECK:');
    console.log('=' .repeat(50));
    
    const usersWithRoles = users.filter(u => u.role);
    const usersWithoutRoles = users.filter(u => !u.role);
    
    console.log(`✅ Users with roles: ${usersWithRoles.length}`);
    console.log(`❌ Users without roles: ${usersWithoutRoles.length}`);
    
    if (usersWithoutRoles.length > 0) {
      console.log('\n⚠️  Users missing roles:');
      usersWithoutRoles.forEach(user => {
        console.log(`   - ${user.displayName} (${user.email})`);
      });
    }
    
    // 4. Summary
    console.log('\n\n📊 SUMMARY:');
    console.log('=' .repeat(50));
    console.log(`👥 Total Users: ${users.length}`);
    console.log(`🔐 Active Sessions: ${sessions.length}`);
    console.log(`✅ Users with Roles: ${usersWithRoles.length}`);
    console.log(`❌ Users without Roles: ${usersWithoutRoles.length}`);
    
    // 5. Recommendations
    console.log('\n\n💡 RECOMMENDATIONS:');
    console.log('=' .repeat(50));
    
    if (usersWithoutRoles.length > 0) {
      console.log('❌ Some users are missing roles - this causes role switching');
      console.log('   Solution: Set roles for all users or handle missing roles in frontend');
    }
    
    if (sessions.length === 0) {
      console.log('❌ No active sessions - users need to login again');
      console.log('   Solution: Login to create a session');
    }
    
    if (sessions.length > 1) {
      console.log('⚠️  Multiple sessions detected - might cause role conflicts');
      console.log('   Solution: Clear old sessions or implement proper session handling');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run the test
testSessionAndRole();