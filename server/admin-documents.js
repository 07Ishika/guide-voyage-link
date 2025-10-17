const express = require('express');
const { MongoClient, GridFSBucket, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voyagery';

let db, bucket;

// Connect to MongoDB
MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('✅ Connected to MongoDB');
    db = client.db();
    bucket = new GridFSBucket(db, { bucketName: 'uploads' });
  })
  .catch(error => {
    console.error('❌ MongoDB connection error:', error);
  });

// Serve static files
app.use(express.static('public'));

// API to list all documents
app.get('/api/documents', async (req, res) => {
  try {
    const documents = await db.collection('documents').find({}).toArray();
    const gridFiles = await db.collection('uploads.files').find({}).toArray();
    
    const documentsWithFiles = documents.map(doc => {
      const gridFile = gridFiles.find(f => f._id.toString() === doc.fileId?.toString());
      return {
        ...doc,
        gridFile: gridFile || null,
        fileSize: gridFile ? gridFile.length : 0,
        gridFilename: gridFile ? gridFile.filename : null
      };
    });
    
    res.json(documentsWithFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to download a file
app.get('/api/download/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;
    
    // Get file info
    const fileInfo = await db.collection('uploads.files').findOne({ _id: new ObjectId(fileId) });
    
    if (!fileInfo) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Set headers
    res.set({
      'Content-Type': fileInfo.contentType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileInfo.filename}"`,
      'Content-Length': fileInfo.length
    });
    
    // Stream the file
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    downloadStream.pipe(res);
    
    downloadStream.on('error', (error) => {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Download failed' });
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the admin interface
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>MongoDB Documents Admin</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; text-align: center; }
            .document { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; background: #fafafa; }
            .document h3 { margin: 0 0 10px 0; color: #2c3e50; }
            .info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 10px 0; }
            .info-item { background: white; padding: 8px; border-radius: 4px; border-left: 3px solid #3498db; }
            .info-label { font-weight: bold; color: #555; font-size: 12px; }
            .info-value { color: #333; }
            .download-btn { background: #27ae60; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; }
            .download-btn:hover { background: #219a52; }
            .status { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
            .status.pending { background: #fff3cd; color: #856404; }
            .status.approved { background: #d4edda; color: #155724; }
            .status.rejected { background: #f8d7da; color: #721c24; }
            .summary { background: #e8f4fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .loading { text-align: center; padding: 50px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📋 MongoDB Documents Admin Panel</h1>
            <div id="summary" class="summary"></div>
            <div id="documents" class="loading">Loading documents...</div>
        </div>

        <script>
            async function loadDocuments() {
                try {
                    const response = await fetch('/api/documents');
                    const documents = await response.json();
                    
                    // Update summary
                    const totalSize = documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
                    const summaryHtml = \`
                        <h3>📊 Summary</h3>
                        <div class="info">
                            <div class="info-item">
                                <div class="info-label">Total Documents</div>
                                <div class="info-value">\${documents.length}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Total Storage</div>
                                <div class="info-value">\${(totalSize / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Pending</div>
                                <div class="info-value">\${documents.filter(d => d.status === 'pending').length}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Approved</div>
                                <div class="info-value">\${documents.filter(d => d.status === 'approved').length}</div>
                            </div>
                        </div>
                    \`;
                    document.getElementById('summary').innerHTML = summaryHtml;
                    
                    // Render documents
                    const documentsHtml = documents.map((doc, index) => \`
                        <div class="document">
                            <h3>📄 Document \${index + 1}: \${doc.originalName || 'Unnamed Document'}</h3>
                            <div class="info">
                                <div class="info-item">
                                    <div class="info-label">Document ID</div>
                                    <div class="info-value">\${doc._id}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">User ID</div>
                                    <div class="info-value">\${doc.userId}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Type</div>
                                    <div class="info-value">\${doc.documentType || 'N/A'}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Country</div>
                                    <div class="info-value">\${doc.country || 'N/A'}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">File Size</div>
                                    <div class="info-value">\${doc.fileSize ? (doc.fileSize / 1024).toFixed(2) + ' KB' : 'N/A'}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Status</div>
                                    <div class="info-value">
                                        <span class="status \${doc.status}">\${doc.status.toUpperCase()}</span>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">Uploaded</div>
                                    <div class="info-value">\${new Date(doc.uploadedAt).toLocaleString()}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-label">GridFS Filename</div>
                                    <div class="info-value" style="font-size: 11px; word-break: break-all;">\${doc.gridFilename || 'N/A'}</div>
                                </div>
                            </div>
                            \${doc.description ? \`<p><strong>Description:</strong> \${doc.description}</p>\` : ''}
                            \${doc.fileId ? \`<a href="/api/download/\${doc.fileId}" class="download-btn">⬇️ Download File</a>\` : '<span style="color: #999;">No file available</span>'}
                        </div>
                    \`).join('');
                    
                    document.getElementById('documents').innerHTML = documentsHtml || '<p>No documents found.</p>';
                    
                } catch (error) {
                    document.getElementById('documents').innerHTML = \`<p style="color: red;">Error loading documents: \${error.message}</p>\`;
                }
            }
            
            // Load documents on page load
            loadDocuments();
            
            // Refresh every 30 seconds
            setInterval(loadDocuments, 30000);
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🌐 MongoDB Documents Admin Panel running at: http://localhost:${PORT}`);
  console.log('📋 View all uploaded documents and download them from the web interface');
});