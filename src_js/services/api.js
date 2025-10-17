// API service for Voyagery backend communication
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  // Generic fetch method with error handling
  async fetchData(url, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ==================== PROFILES API ====================
  async getProfile(userId) {
    return this.fetchData(`/profile/${userId}`);
  }

  async saveProfile(profileData) {
    return this.fetchData('/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  // ==================== MIGRANT REQUESTS API ====================
  async getMigrantRequests(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.fetchData(`/migrant-requests${queryParams ? `?${queryParams}` : ''}`);
  }

  async createMigrantRequest(requestData) {
    return this.fetchData('/migrant-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async updateMigrantRequest(requestId, updateData) {
    return this.fetchData(`/migrant-requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // ==================== GUIDE SESSIONS API ====================
  async getGuideSessions(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.fetchData(`/guide-sessions${queryParams ? `?${queryParams}` : ''}`);
  }

  async createGuideSession(sessionData) {
    return this.fetchData('/guide-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateGuideSession(sessionId, updateData) {
    return this.fetchData(`/guide-sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // ==================== MESSAGES API ====================
  async getMessages(conversationId) {
    return this.fetchData(`/messages/${conversationId}`);
  }

  async sendMessage(messageData) {
    return this.fetchData('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  // ==================== DOCUMENTS API ====================
  async getUserDocuments(userId) {
    return this.fetchData(`/documents/${userId}`);
  }

  async uploadDocument(file, documentData) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', documentData.userId);
    formData.append('documentType', documentData.documentType);
    formData.append('country', documentData.country);
    if (documentData.description) {
      formData.append('description', documentData.description);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for session
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Document upload error:', error);
      throw error;
    }
  }

  async downloadDocument(fileId) {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/download/${fileId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response; // Return the response for blob handling
    } catch (error) {
      console.error('Document download error:', error);
      throw error;
    }
  }

  async deleteDocument(documentId) {
    return this.fetchData(`/documents/${documentId}`, {
      method: 'DELETE',
    });
  }

  // ==================== REVIEWS API ====================
  async getGuideReviews(guideId) {
    return this.fetchData(`/reviews/${guideId}`);
  }

  async createReview(reviewData) {
    return this.fetchData('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // ==================== NOTIFICATIONS API ====================
  async getUserNotifications(userId) {
    return this.fetchData(`/notifications/${userId}`);
  }

  async markNotificationAsRead(notificationId) {
    return this.fetchData(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async createNotification(notificationData) {
    return this.fetchData('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  // ==================== SEARCH & DASHBOARD API ====================
  async searchGuides(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.fetchData(`/guides/search${queryParams ? `?${queryParams}` : ''}`);
  }

  async getDashboardStats(userId) {
    return this.fetchData(`/dashboard/${userId}`);
  }

  // ==================== REAL-TIME API ====================
  async getRealTimeGuideSessions(guideId, lastUpdate = null) {
    const queryParams = lastUpdate ? `?lastUpdate=${lastUpdate}` : '';
    return this.fetchData(`/guide-sessions/realtime/${guideId}${queryParams}`);
  }

  async getSessionById(sessionId) {
    return this.fetchData(`/guide-sessions/${sessionId}`);
  }

  // ==================== AUTHENTICATION API ====================
  async getCurrentUser() {
    try {
      const response = await fetch('http://localhost:5000/auth/user', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Auth API Error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await fetch('http://localhost:5000/auth/user', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get Current User API Error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await fetch('http://localhost:5000/auth/logout', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Logout API Error:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

