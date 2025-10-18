const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
    const uri = process.env.MONGODB_URI;
    console.log('Testing connection to:', uri.replace(/:[^:]*@/, ':****@'));
    
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Successfully connected to Atlas!');
        
        const db = client.db('voyagery');
        const collections = await db.listCollections().toArray();
        console.log(`📁 Found ${collections.length} collections`);
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        
        if (error.message.includes('ENOTFOUND')) {
            console.log('\n💡 Suggestions:');
            console.log('1. Check your internet connection');
            console.log('2. Try a different network');
            console.log('3. Disable VPN if using one');
            console.log('4. Get the standard connection string from Atlas');
        }
    } finally {
        await client.close();
    }
}

testConnection();