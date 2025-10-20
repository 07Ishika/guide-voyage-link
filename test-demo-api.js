// Quick test script for demo login API
const https = require('https');

const BACKEND_URL = 'https://guide-voyage-link-1.onrender.com';

function testDemoLogin(role) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ role });
    
    const options = {
      hostname: 'guide-voyage-link-1.onrender.com',
      port: 443,
      path: '/auth/demo-login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Demo Login API...\n');

  try {
    // Test migrant demo login
    console.log('1. Testing Migrant Demo Login...');
    const migrantResult = await testDemoLogin('migrant');
    
    if (migrantResult.status === 200) {
      console.log('✅ Migrant demo login successful');
      console.log(`   Name: ${migrantResult.data.displayName}`);
      console.log(`   Email: ${migrantResult.data.email}`);
      console.log(`   Role: ${migrantResult.data.role}`);
    } else {
      console.log('❌ Migrant demo login failed');
      console.log(`   Status: ${migrantResult.status}`);
      console.log(`   Response: ${JSON.stringify(migrantResult.data)}`);
    }

    console.log('');

    // Test guide demo login
    console.log('2. Testing Guide Demo Login...');
    const guideResult = await testDemoLogin('guide');
    
    if (guideResult.status === 200) {
      console.log('✅ Guide demo login successful');
      console.log(`   Name: ${guideResult.data.displayName}`);
      console.log(`   Email: ${guideResult.data.email}`);
      console.log(`   Role: ${guideResult.data.role}`);
    } else {
      console.log('❌ Guide demo login failed');
      console.log(`   Status: ${guideResult.status}`);
      console.log(`   Response: ${JSON.stringify(guideResult.data)}`);
    }

    console.log('\n🎯 Test Summary:');
    
    if (migrantResult.status === 200 && guideResult.status === 200) {
      const migrantRole = migrantResult.data.role;
      const guideRole = guideResult.data.role;
      
      if (migrantRole === 'migrant' && guideRole === 'guide') {
        console.log('🎉 All tests passed! Demo login is working correctly.');
      } else {
        console.log('⚠️  Role mismatch detected:');
        console.log(`   Migrant login returned role: ${migrantRole}`);
        console.log(`   Guide login returned role: ${guideRole}`);
      }
    } else {
      console.log('❌ Some tests failed. Check the responses above.');
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

runTests();