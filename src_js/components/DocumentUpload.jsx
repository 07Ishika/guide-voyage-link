import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, Download, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import apiService from '../services/api';

const DocumentUpload = ({ userId, onUploadSuccess, existingDocuments = [], isEditing = false }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentType, setDocumentType] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [documents, setDocuments] = useState(existingDocuments);
  const fileInputRef = useRef(null);

  const documentTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'visa', label: 'Visa' },
    { value: 'work_permit', label: 'Work Permit' },
    { value: 'birth_certificate', label: 'Birth Certificate' },
    { value: 'marriage_certificate', label: 'Marriage Certificate' },
    { value: 'education_certificate', label: 'Education Certificate' },
    { value: 'language_test', label: 'Language Test Results' },
    { value: 'medical_exam', label: 'Medical Examination' },
    { value: 'police_clearance', label: 'Police Clearance' },
    { value: 'financial_proof', label: 'Financial Proof' },
    { value: 'other', label: 'Other Document' }
  ];

  const countries = [
    'Canada', 'United States', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'India', 'China', 'Japan', 'Brazil', 'Mexico', 'Other'
  ];

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleUpload = async (file) => {
    if (!documentType || !country) {
      alert('Please select document type and country before uploading.');
      return;
    }

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPG, PNG, DOC, and DOCX files are allowed.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const documentData = {
        userId,
        documentType,
        country,
        description
      };

      const result = await apiService.uploadDocument(file, documentData);
      
      // Add the new document to the list
      const newDocument = {
        _id: result.documentId,
        fileId: result.fileId,
        filename: result.filename,
        originalName: file.name,
        documentType,
        country,
        description,
        mimetype: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'pending'
      };

      setDocuments(prev => [newDocument, ...prev]);
      
      // Reset form
      setDocumentType('');
      setCountry('');
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onUploadSuccess) {
        onUploadSuccess(newDocument);
      }

      alert('Document uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async (document) => {
    try {
      const response = await apiService.downloadDocument(document.fileId);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download document.');
    }
  };

  const handleDelete = async (documentId) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await apiService.deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc._id !== documentId));
      alert('Document deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete document.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Form - Only show when editing */}
      {isEditing && (
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Document
          </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Document Type *</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full p-2 border rounded-lg bg-background"
              required
            >
              <option value="">Select document type</option>
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Country *</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 border rounded-lg bg-background"
              required
            >
              <option value="">Select country</option>
              {countries.map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any additional notes about this document..."
            className="w-full p-2 border rounded-lg bg-background"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select File *</label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="w-full p-2 border rounded-lg bg-background"
            disabled={uploading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
          </p>
        </div>

        {uploading && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
        </div>
      )}

      {/* Documents List */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <File className="w-5 h-5" />
          Uploaded Documents ({documents.length})
        </h3>

        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No documents uploaded yet</p>
            <p className="text-sm">
              {isEditing ? 'Upload your first document to get started' : 'Click "Edit Profile" to upload documents'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((document) => (
              <motion.div
                key={document._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3 flex-1">
                  <File className="w-8 h-8 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{document.originalName}</h4>
                      {getStatusIcon(document.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                        {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>{documentTypes.find(t => t.value === document.documentType)?.label || document.documentType}</span>
                      <span className="mx-2">•</span>
                      <span>{document.country}</span>
                      <span className="mx-2">•</span>
                      <span>{formatFileSize(document.size)}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    {document.description && (
                      <p className="text-sm text-muted-foreground mt-1">{document.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(document)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  {isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(document._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;