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

  async uploadDocument(documentData) {
    return this.fetchData('/documents', {
      method: 'POST',
      body: JSON.stringify(documentData),
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

