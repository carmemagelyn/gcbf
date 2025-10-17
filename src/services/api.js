// API Service for GCBF Church Management System
// Handles all communication with Cloudflare backend

const API_URL = import.meta.env.PROD 
  ? 'https://gcbf-church-portal.pages.dev/api' 
  : '/api' // Local development will proxy to Cloudflare

class ApiService {
  constructor() {
    this.baseUrl = API_URL
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }
      
      return data
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  // Authentication
  async login(email, password) {
    return this.request('auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData) {
    return this.request('auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // Prayers
  async getPrayers(userId = null, visibility = null) {
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId)
    if (visibility) params.append('visibility', visibility)
    
    return this.request(`prayers?${params.toString()}`)
  }

  async createPrayer(prayerData) {
    return this.request('prayers', {
      method: 'POST',
      body: JSON.stringify(prayerData),
    })
  }

  async updatePrayer(prayerId, updates) {
    return this.request(`prayers/${prayerId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deletePrayer(prayerId) {
    return this.request(`prayers/${prayerId}`, {
      method: 'DELETE',
    })
  }

  // Newsletters
  async getNewsletters() {
    return this.request('newsletters')
  }

  async createNewsletter(newsletterData) {
    return this.request('newsletters', {
      method: 'POST',
      body: JSON.stringify(newsletterData),
    })
  }

  async deleteNewsletter(newsletterId) {
    return this.request(`newsletters/${newsletterId}`, {
      method: 'DELETE',
    })
  }

  // Ministries
  async getMinistries() {
    return this.request('ministries')
  }

  async createMinistry(ministryData) {
    return this.request('ministries', {
      method: 'POST',
      body: JSON.stringify(ministryData),
    })
  }

  async getAttendance(ministryId) {
    return this.request(`ministries/${ministryId}/attendance`)
  }

  async addAttendance(ministryId, attendanceData) {
    return this.request(`ministries/${ministryId}/attendance`, {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    })
  }

  // Finances
  async getIncome() {
    return this.request('finances/income')
  }

  async addIncome(incomeData) {
    return this.request('finances/income', {
      method: 'POST',
      body: JSON.stringify(incomeData),
    })
  }

  async getExpenses() {
    return this.request('finances/expenses')
  }

  async addExpense(expenseData) {
    return this.request('finances/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    })
  }

  // Pledges
  async getPledges(userId = null) {
    const params = userId ? `?userId=${userId}` : ''
    return this.request(`pledges${params}`)
  }

  async createPledge(pledgeData) {
    return this.request('pledges', {
      method: 'POST',
      body: JSON.stringify(pledgeData),
    })
  }

  // Bible Reading
  async getBibleReading(userId) {
    return this.request(`bible-reading?userId=${userId}`)
  }

  async addBibleReading(readingData) {
    return this.request('bible-reading', {
      method: 'POST',
      body: JSON.stringify(readingData),
    })
  }
}

// Export singleton instance
export const api = new ApiService()
export default api
