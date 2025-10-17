const { MongoClient, GridFSBucket, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function downloadDocument(fileId, outputPath) {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    
    // Get file info first
    const fileInfo = await db.collection('uploads.files').findOne({ _id: new ObjectId(fileId) });
    
    if (!fileInfo) {
      console.log('❌ File not found with ID:', fileId);
      return;
    }
    
    console.log('\n📁 File Info:');
    console.log(`   Filename: ${fileInfo.filename}`);
    console.log(`   Size: ${(fileInfo.length / 1024).toFixed(2)} KB`);
    console.log(`   Upload Date: ${new Date(fileInfo.uploadDate).toLocaleString()}`);
    
    // Create downloads directory if it doesn't exist
    const downloadsDir = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }
    
    // Generate output filename
    const outputFilename = outputPath || path.join(downloadsDir, `downloaded_${fileInfo.filename}`);
    
    console.log(`\n⬇️  Downloading to: ${outputFilename}`);
    
    // Create download stream
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    const writeStream = fs.createWriteStream(outputFilename);
    
    downloadStream.pipe(writeStream);
    
    downloadStream.on('error', (error) => {
      console.error('❌ Download error:', error);
    });
    
    writeStream.on('error', (error) => {
      console.error('❌ Write error:', error);
    });
    
    writeStream.on('finish', async () => {
      console.log('✅ File downloaded successfully!');
      console.log(`📂 Location: ${outputFilename}`);
      await client.close();
    });
    
  } catch (error) {
    console.error('❌ Error downloading document:', error);
    await client.close();
  }
}

// Get file ID from command line argument
const fileId = process.argv[2];

if (!fileId) {
  console.log('❌ Please provide a file ID');
  console.log('Usage: node download-document.js <fileId>');
  console.log('\nAvailable file IDs:');
  
  // Show available files
  const { MongoClient } = require('mongodb');
  const client = new MongoClient(MONGODB_URI);
  
  client.connect().then(async () => {
    const db = client.db();
    const files = await db.collection('uploads.files').find({}).toArray();
    
    files.forEach((file, index) => {
      console.log(`${index + 1}. ${file._id} - ${file.filename}`);
    });
    
    await client.close();
  });
} else {
  downloadDocument(fileId);
}