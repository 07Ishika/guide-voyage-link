const { MongoClient, GridFSBucket } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function viewDocuments() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // 1. View Documents Collection (metadata)
    console.log('\n📋 DOCUMENTS COLLECTION (Metadata):');
    console.log('=' .repeat(50));
    
    const documents = await db.collection('documents').find({}).toArray();
    
    if (documents.length === 0) {
      console.log('❌ No documents found in documents collection');
    } else {
      documents.forEach((doc, index) => {
        console.log(`\n📄 Document ${index + 1}:`);
        console.log(`   ID: ${doc._id}`);
        console.log(`   User ID: ${doc.userId}`);
        console.log(`   Original Name: ${doc.originalName}`);
        console.log(`   Document Type: ${doc.documentType}`);
        console.log(`   Country: ${doc.country}`);
        console.log(`   File ID: ${doc.fileId}`);
        console.log(`   Size: ${(doc.size / 1024).toFixed(2)} KB`);
        console.log(`   Status: ${doc.status}`);
        console.log(`   Uploaded: ${new Date(doc.uploadedAt).toLocaleString()}`);
        if (doc.description) {
          console.log(`   Description: ${doc.description}`);
        }
      });
    }
    
    // 2. View GridFS Files (actual file storage)
    console.log('\n\n🗂️  GRIDFS FILES (uploads.files):');
    console.log('=' .repeat(50));
    
    const gridFSFiles = await db.collection('uploads.files').find({}).toArray();
    
    if (gridFSFiles.length === 0) {
      console.log('❌ No files found in GridFS uploads.files collection');
    } else {
      gridFSFiles.forEach((file, index) => {
        console.log(`\n📁 GridFS File ${index + 1}:`);
        console.log(`   File ID: ${file._id}`);
        console.log(`   Filename: ${file.filename}`);
        console.log(`   Size: ${(file.length / 1024).toFixed(2)} KB`);
        console.log(`   Content Type: ${file.contentType || 'N/A'}`);
        console.log(`   Upload Date: ${new Date(file.uploadDate).toLocaleString()}`);
        console.log(`   Chunks: ${file.chunkSize ? Math.ceil(file.length / file.chunkSize) : 'N/A'}`);
      });
    }
    
    // 3. View GridFS Chunks (file data pieces)
    console.log('\n\n🧩 GRIDFS CHUNKS (uploads.chunks):');
    console.log('=' .repeat(50));
    
    const chunksCount = await db.collection('uploads.chunks').countDocuments();
    console.log(`Total chunks stored: ${chunksCount}`);
    
    if (chunksCount > 0) {
      const sampleChunks = await db.collection('uploads.chunks').find({}).limit(3).toArray();
      sampleChunks.forEach((chunk, index) => {
        console.log(`\n🧩 Chunk ${index + 1}:`);
        console.log(`   Chunk ID: ${chunk._id}`);
        console.log(`   File ID: ${chunk.files_id}`);
        console.log(`   Chunk Number: ${chunk.n}`);
        console.log(`   Data Size: ${chunk.data ? chunk.data.length : 0} bytes`);
      });
      
      if (chunksCount > 3) {
        console.log(`\n... and ${chunksCount - 3} more chunks`);
      }
    }
    
    // 4. Summary
    console.log('\n\n📊 SUMMARY:');
    console.log('=' .repeat(50));
    console.log(`📋 Documents (metadata): ${documents.length}`);
    console.log(`📁 GridFS Files: ${gridFSFiles.length}`);
    console.log(`🧩 GridFS Chunks: ${chunksCount}`);
    
    const totalSize = gridFSFiles.reduce((sum, file) => sum + file.length, 0);
    console.log(`💾 Total Storage Used: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('❌ Error viewing documents:', error);
  } finally {
    await client.close();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run the script
viewDocuments();