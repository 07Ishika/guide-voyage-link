// Simple migration from local to Atlas
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Local connection
const localUri = 'mongodb://localhost:27017/voyagery';

// Atlas connection - using standard format to avoid DNS issues
const atlasUri = 'mongodb://anamishika9_db_user:Ishika2907@voyagery-cluster-shard-00-00.dbtsvz.mongodb.net:27017,voyagery-cluster-shard-00-01.dbtsvz.mongodb.net:27017,voyagery-cluster-shard-00-02.dbtsvz.mongodb.net:27017/voyagery?ssl=true&replicaSet=atlas-123abc-shard-0&authSource=admin&retryWrites=true&w=majority';

async function migrateData() {
    console.log('🔄 Starting migration from local to Atlas...');
    
    const localClient = new MongoClient(localUri);
    const atlasClient = new MongoClient(atlasUri);

    try {
        // Connect to both
        await localClient.connect();
        console.log('✅ Connected to local MongoDB');
        
        await atlasClient.connect();
        console.log('✅ Connected to Atlas');

        const localDb = localClient.db('voyagery');
        const atlasDb = atlasClient.db('voyagery');

        // Get collections from local
        const collections = await localDb.listCollections().toArray();
        console.log(`📋 Found ${collections.length} collections to migrate`);
        
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            console.log(`\n🔄 Migrating: ${collectionName}`);
            
            // Get documents from local
            const localCollection = localDb.collection(collectionName);
            const documents = await localCollection.find({}).toArray();
            
            if (documents.length > 0) {
                // Clear existing data in Atlas (optional)
                const atlasCollection = atlasDb.collection(collectionName);
                await atlasCollection.deleteMany({});
                
                // Insert into Atlas
                await atlasCollection.insertMany(documents);
                console.log(`✅ Migrated ${documents.length} documents to ${collectionName}`);
            } else {
                console.log(`⚠️  No documents in ${collectionName}`);
            }
        }
        
        console.log('\n🎉 Migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await localClient.close();
        await atlasClient.close();
    }
}

migrateData();