// Verification script to check demo login setup
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function verifyDemoSetup() {
  console.log('🔍 Verifying Demo Login Setup...\n');

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ MongoDB connection successful');
    
    const db = client.db();
    
    // Check if demo users exist
    const users = await db.collection('users').find({}).toArray();
    console.log(`📊 Found ${users.length} users in database`);
    
    const migrantUsers = users.filter(u => u.role === 'migrant');
    const guideUsers = users.filter(u => u.role === 'guide');
    
    console.log(`👤 Migrant users: ${migrantUsers.length}`);
    console.log(`🎓 Guide users: ${guideUsers.length}`);
    
    if (migrantUsers.length > 0) {
      console.log(`   - Sample migrant: ${migrantUsers[0].displayName} (${migrantUsers[0].email})`);
    }
    
    if (guideUsers.length > 0) {
      console.log(`   - Sample guide: ${guideUsers[0].displayName} (${guideUsers[0].email})`);
    }
    
    // Check profiles
    const profiles = await db.collection('profiles').find({}).toArray();
    console.log(`📋 Found ${profiles.length} profiles in database`);
    
    // Check if server files exist
    const fs = require('fs');
    const path = require('path');
    const serverExists = fs.existsSync('./index.js');
    const demoButtonExists = fs.existsSync('../src_js/components/DemoLoginButton.jsx');
    
    console.log(`\n📁 File Check:`);
    console.log(`   - Server file: ${serverExists ? '✅' : '❌'}`);
    console.log(`   - Demo button: ${demoButtonExists ? '✅' : '❌'}`);
    
    // Check environment files
    const envLocalExists = fs.existsSync('../.env.local');
    const envExampleExists = fs.existsSync('../.env.example');
    
    console.log(`   - .env.local: ${envLocalExists ? '✅' : '❌'}`);
    console.log(`   - .env.example: ${envExampleExists ? '✅' : '❌'}`);
    
    console.log(`\n🎯 Demo Login Setup Status:`);
    
    if (migrantUsers.length > 0 && guideUsers.length > 0) {
      console.log('✅ Demo users available for both roles');
    } else {
      console.log('⚠️  Missing demo users - run: node seedData.js');
    }
    
    if (serverExists && demoButtonExists) {
      console.log('✅ Demo login components are in place');
    } else {
      console.log('❌ Missing demo login components');
    }
    
    if (envLocalExists) {
      console.log('✅ Environment configuration ready');
    } else {
      console.log('⚠️  Create .env.local for local development');
    }
    
    console.log('\n🚀 Ready to test demo login!');
    console.log('   1. Start server: node index.js');
    console.log('   2. Start frontend: npm run dev (from parent directory)');
    console.log('   3. Navigate to /role and test demo login buttons');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    await client.close();
  }
}

verifyDemoSetup();