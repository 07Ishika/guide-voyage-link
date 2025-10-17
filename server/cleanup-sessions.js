// Script to clean up duplicate sessions and sync with migrant_requests

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

async function cleanupSessions() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const migrantRequestsCollection = db.collection('migrant_requests');
    const guideSessionsCollection = db.collection('guide_sessions');
    
    // Get all migrant requests
    const migrantRequests = await migrantRequestsCollection.find({}).toArray();
    console.log(`\n📋 Found ${migrantRequests.length} migrant requests`);
    
    // Get all guide sessions
    const guideSessions = await guideSessionsCollection.find({}).toArray();
    console.log(`📋 Found ${guideSessions.length} guide sessions`);
    
    // Clear all guide sessions (we'll recreate from migrant_requests)
    await guideSessionsCollection.deleteMany({});
    console.log('🗑️ Cleared all guide sessions');
    
    // Create guide sessions from migrant requests
    for (const request of migrantRequests) {
      const sessionData = {
        guideId: request.targetGuideId || request.guideId,
        migrantId: request.migrantId,
        migrantName: request.migrantName || 'Unknown Migrant',
        migrantEmail: request.migrantEmail || '',
        guideName: request.guideName || 'Unknown Guide',
        title: request.title || 'Migration Consultation',
        purpose: request.description || request.purpose || 'General consultation',
        urgency: request.urgency || 'medium',
        budget: request.budget || 'Not specified',
        timeline: request.timeline || 'Flexible',
        preferredTime: request.preferredTime || 'Flexible',
        specificQuestions: request.specificQuestions || '',
        requestStatus: 'pending',
        status: 'pending',
        createdAt: request.createdAt || new Date(),
        updatedAt: new Date()
      };
      
      await guideSessionsCollection.insertOne(sessionData);
      console.log(`✅ Created session for: ${sessionData.migrantName} → ${sessionData.guideName}`);
    }
    
    console.log(`\n🎯 Synchronized ${migrantRequests.length} sessions with migrant requests`);
    
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the function
cleanupSessions().catch(console.error);