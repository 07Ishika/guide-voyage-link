const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function listFiles() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db();
    
    // Get all documents with their metadata
    const documents = await db.collection('documents').find({}).toArray();
    const gridFiles = await db.collection('uploads.files').find({}).toArray();
    
    console.log('📋 UPLOADED DOCUMENTS:');
    console.log('=' .repeat(60));
    
    if (documents.length === 0) {
      console.log('❌ No documents found');
      return;
    }
    
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      const gridFile = gridFiles.find(f => f._id.toString() === doc.fileId?.toString());
      
      console.log(`\n📄 Document ${i + 1}:`);
      console.log(`   📋 Metadata ID: ${doc._id}`);
      console.log(`   👤 User ID: ${doc.userId}`);
      console.log(`   📝 Original Name: ${doc.originalName || 'N/A'}`);
      console.log(`   📂 Document Type: ${doc.documentType || 'N/A'}`);
      console.log(`   🌍 Country: ${doc.country || 'N/A'}`);
      console.log(`   📁 File ID: ${doc.fileId || 'N/A'}`);
      console.log(`   📊 Status: ${doc.status}`);
      console.log(`   📅 Uploaded: ${new Date(doc.uploadedAt).toLocaleString()}`);
      
      if (gridFile) {
        console.log(`   💾 File Size: ${(gridFile.length / 1024).toFixed(2)} KB`);
        console.log(`   🗂️  GridFS Filename: ${gridFile.filename}`);
        console.log(`   🧩 Chunks: ${Math.ceil(gridFile.length / (gridFile.chunkSize || 261120))}`);
      } else {
        console.log(`   ❌ GridFS file not found`);
      }
      
      if (doc.description) {
        console.log(`   📝 Description: ${doc.description}`);
      }
    }
    
    console.log('\n\n📊 SUMMARY:');
    console.log('=' .repeat(60));
    console.log(`📋 Total Documents: ${documents.length}`);
    console.log(`📁 GridFS Files: ${gridFiles.length}`);
    
    const totalSize = gridFiles.reduce((sum, file) => sum + file.length, 0);
    console.log(`💾 Total Storage: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Show collections info
    console.log('\n🗄️  DATABASE COLLECTIONS:');
    console.log('=' .repeat(60));
    console.log(`📋 documents: ${documents.length} records`);
    console.log(`📁 uploads.files: ${gridFiles.length} records`);
    
    const chunksCount = await db.collection('uploads.chunks').countDocuments();
    console.log(`🧩 uploads.chunks: ${chunksCount} records`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

listFiles();