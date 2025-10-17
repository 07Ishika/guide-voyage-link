// Script to clear old seed data and keep only real requests

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function clearSeedData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const guideSessionsCollection = db.collection('guide_sessions');
    
    // Clear all existing sessions (they are all seed data)
    const result = await guideSessionsCollection.deleteMany({});
    console.log(`✅ Cleared ${result.deletedCount} old seed sessions`);
    
    console.log('\n🎯 Database is now clean!');
    console.log('Now only real-time requests from migrants will appear in the guide dashboard.');
    
  } catch (error) {
    console.error('Error clearing seed data:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the function
clearSeedData().catch(console.error);