// Test MongoDB connection and collections
const { MongoClient, GridFSBucket } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function testMongoDB() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db();
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Test collections
    const collections = ['users', 'profiles', 'documents', 'migrant_requests', 'guide_sessions'];
    
    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      console.log(`📊 ${collectionName}: ${count} documents`);
    }
    
    // Test GridFS
    const gridFSBucket = new GridFSBucket(db, { bucketName: 'uploads' });
    const files = await gridFSBucket.find({}).toArray();
    console.log(`📁 GridFS uploads: ${files.length} files`);
    
    // List recent documents
    const documentsCollection = db.collection('documents');
    const recentDocs = await documentsCollection
      .find({})
      .sort({ uploadedAt: -1 })
      .limit(5)
      .toArray();
    
    console.log('\n📋 Recent documents:');
    recentDocs.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.originalName} (${doc.documentType}) - ${doc.status}`);
    });
    
    await client.close();
    console.log('\n✅ MongoDB test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error);
  }
}

testMongoDB();