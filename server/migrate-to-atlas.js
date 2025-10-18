const { MongoClient } = require('mongodb');

// Local MongoDB connection
const localUri = 'mongodb://localhost:27017';
const localDbName = 'voyagery'; // Your local database name

// Atlas connection
const atlasUri = 'mongodb+srv://anamishika9_db_user:Ishika2907@voyagery-cluster.dbtsvz.mongodb.net/';
const atlasDbName = 'voyagery'; // Your Atlas database name

async function migrateData() {
    const localClient = new MongoClient(localUri);
    const atlasClient = new MongoClient(atlasUri);

    try {
        // Connect to both databases
        await localClient.connect();
        await atlasClient.connect();

        const localDb = localClient.db(localDbName);
        const atlasDb = atlasClient.db(atlasDbName);

        // Get all collections from local database
        const collections = await localDb.listCollections().toArray();
        
        console.log(`Found ${collections.length} collections to migrate:`);
        
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            console.log(`\nMigrating collection: ${collectionName}`);
            
            // Get all documents from local collection
            const localCollection = localDb.collection(collectionName);
            const documents = await localCollection.find({}).toArray();
            
            if (documents.length > 0) {
                // Insert documents into Atlas collection
                const atlasCollection = atlasDb.collection(collectionName);
                await atlasCollection.insertMany(documents);
                console.log(`✅ Migrated ${documents.length} documents to ${collectionName}`);
            } else {
                console.log(`⚠️  No documents found in ${collectionName}`);
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

// Run migration
migrateData();