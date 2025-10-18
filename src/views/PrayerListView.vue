<template>
  <div class="prayer-list-page">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card bg-church-purple text-white border-0">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h2 class="fw-bold mb-2">
                    <i class="bi bi-hands-clapping me-2"></i>
                    Prayer Requests
                  </h2>
                  <p class="mb-0 opacity-75">
                    Share your prayer requests and pray for others in our community
                  </p>
                </div>
                <div class="col-md-4 text-end">
                  <button class="btn btn-light btn-lg" @click="showAddModal = true">
                    <i class="bi bi-plus-circle me-2"></i>
                    Add Prayer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Prayer Statistics -->
      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-heart-fill display-4 church-purple"></i>
              <h5 class="mt-2 mb-0">{{ myPrayers.length }}</h5>
              <small class="text-muted">My Requests</small>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-people-fill display-4 church-purple"></i>
              <h5 class="mt-2 mb-0">{{ communityPrayers.length }}</h5>
              <small class="text-muted">Community Prayers</small>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-check-circle-fill display-4 text-success"></i>
              <h5 class="mt-2 mb-0">{{ answeredPrayers }}</h5>
              <small class="text-muted">Answered Prayers</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Prayer Tabs -->
      <div class="row">
        <div class="col-12">
          <ul class="nav nav-tabs mb-4" role="tablist">
            <li class="nav-item">
              <button 
                class="nav-link"
                :class="{ active: activeTab === 'my' }"
                @click="activeTab = 'my'"
              >
                My Prayers ({{ myPrayers.length }})
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link"
                :class="{ active: activeTab === 'community' }"
                @click="activeTab = 'community'"
              >
                Community Prayers ({{ communityPrayers.length }})
              </button>
            </li>
            <li v-if="user?.userType === 'pastor'" class="nav-item">
              <button 
                class="nav-link"
                :class="{ active: activeTab === 'confidential' }"
                @click="activeTab = 'confidential'"
              >
                Confidential ({{ confidentialPrayers.length }})
              </button>
            </li>
            <li v-if="user?.userType === 'admin' || user?.userType === 'pastor'" class="nav-item">
              <button 
                class="nav-link"
                :class="{ active: activeTab === 'pending' }"
                @click="activeTab = 'pending'"
              >
                Pending Approval
                <span v-if="pendingPrayers.length > 0" class="badge bg-danger ms-1">{{ pendingPrayers.length }}</span>
              </button>
            </li>
          </ul>

          <!-- Prayer Content -->
          <div class="tab-content">
            <!-- My Prayers Tab -->
            <div v-if="activeTab === 'my'" class="tab-pane fade show active">
              <div v-if="myPrayers.length === 0" class="text-center py-5">
                <i class="bi bi-heart display-1 opacity-25"></i>
                <h4 class="mt-3 text-muted">No prayer requests yet</h4>
                <p class="text-muted">Add your first prayer request to get started</p>
                <button class="btn btn-primary" @click="showAddModal = true">
                  Add Prayer Request
                </button>
              </div>

              <div v-else class="row g-4">
                <div v-for="prayer in myPrayers" :key="prayer.id" class="col-lg-6">
                  <div class="prayer-card card border-0 shadow-sm" :class="{ 'answered-prayer-card': prayer.status === 'answered' }">
                    <!-- Answered Prayer Banner -->
                    <div v-if="prayer.status === 'answered'" class="answered-banner bg-success text-white px-3 py-2">
                      <i class="bi bi-check-circle-fill me-2"></i>
                      <strong>Prayer Answered!</strong>
                      <small class="ms-2 opacity-75">Praise God for answered prayer!</small>
                    </div>
                    
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <span class="badge me-2" :class="getCategoryBadgeClass(prayer.category)">
                            {{ prayer.category }}
                          </span>
                          <span class="badge me-2" :class="getVisibilityBadgeClass(prayer.visibility)">
                            <i :class="getVisibilityIcon(prayer.visibility)" class="me-1"></i>
                            {{ capitalizeFirst(prayer.visibility) }}
                          </span>
                          <span v-if="prayer.approved === false && prayer.visibility === 'public'" class="badge bg-warning text-dark">
                            <i class="bi bi-clock-history me-1"></i>
                            Pending Approval
                          </span>
                          <span v-else-if="prayer.approved === true && prayer.status !== 'answered'" class="badge bg-success">
                            <i class="bi bi-check-circle me-1"></i>
                            Approved
                          </span>
                        </div>
                        <div class="d-flex flex-column align-items-end">
                          <div v-if="prayer.status === 'answered'" class="text-success small mb-2">
                            <i class="bi bi-check-circle-fill me-1"></i>
                            {{ formatDate(prayer.dateAnswered) }}
                          </div>
                          <div class="dropdown">
                            <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown">
                              <i class="bi bi-three-dots"></i>
                            </button>
                            <ul class="dropdown-menu">
                              <li><a class="dropdown-item" href="#" @click="editPrayer(prayer)">Edit</a></li>
                              <li><a class="dropdown-item" href="#" @click="toggleAnswered(prayer)">
                                {{ prayer.status === 'answered' ? 'Mark as Ongoing' : 'Mark as Answered' }}
                              </a></li>
                              <li><a class="dropdown-item text-danger" href="#" @click="deletePrayer(prayer.id)">Delete</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <p class="card-text mb-3">{{ prayer.request }}</p>

                      <div class="prayer-meta">
                        <small class="text-muted d-block">
                          <i class="bi bi-calendar me-1"></i>
                          Requested: {{ formatDate(prayer.dateRequested) }}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Community Prayers Tab -->
            <div v-if="activeTab === 'community'" class="tab-pane fade show active">
              <div v-if="communityPrayers.length === 0" class="text-center py-5">
                <i class="bi bi-people display-1 opacity-25"></i>
                <h4 class="mt-3 text-muted">No community prayers</h4>
                <p class="text-muted">Be the first to share a prayer request with the community</p>
              </div>

              <div v-else class="row g-4">
                <div v-for="prayer in communityPrayers" :key="prayer.id" class="col-lg-6">
                  <div class="prayer-card card border-0 shadow-sm" :class="{ 'answered-prayer-card': prayer.status === 'answered' }">
                    <!-- Answered Prayer Banner -->
                    <div v-if="prayer.status === 'answered'" class="answered-banner bg-success text-white px-3 py-2">
                      <i class="bi bi-check-circle-fill me-2"></i>
                      <strong>Prayer Answered!</strong>
                      <small class="ms-2 opacity-75">Praise God for answered prayer!</small>
                    </div>
                    
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start mb-3">
                        <span class="badge" :class="getCategoryBadgeClass(prayer.category)">
                          {{ prayer.category }}
                        </span>
                        <div class="d-flex flex-column align-items-end">
                          <div v-if="prayer.status === 'answered'" class="text-success small mb-2">
                            <i class="bi bi-check-circle-fill me-1"></i>
                            {{ formatDate(prayer.dateAnswered) }}
                          </div>
                          <button 
                            class="btn btn-sm"
                            :class="prayer.status === 'answered' ? 'btn-secondary' : 'btn-outline-primary'"
                            @click="prayer.status !== 'answered' && togglePraying(prayer.id)"
                            :disabled="prayer.status === 'answered'"
                          >
                            <i class="bi bi-heart me-1"></i>
                            {{ isPraying(prayer.id) ? 'Prayed' : 'Pray' }}
                          </button>
                        </div>
                      </div>

                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-person-circle me-2 church-purple"></i>
                        <strong>{{ prayer.requestedBy }}</strong>
                      </div>

                      <p class="card-text mb-3">{{ prayer.request }}</p>

                      <div class="prayer-meta">
                        <small class="text-muted d-block mb-1">
                          <i class="bi bi-calendar me-1"></i>
                          Requested: {{ formatDate(prayer.dateRequested) }}
                        </small>
                        <small class="text-muted d-block">
                          <i class="bi bi-heart me-1"></i>
                          {{ getPrayingCount(prayer.id) }} people prayed
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Confidential Prayers Tab (Pastor Only) -->
            <div v-if="activeTab === 'confidential' && user?.userType === 'pastor'" class="tab-pane fade show active">
              <div v-if="confidentialPrayers.length === 0" class="text-center py-5">
                <i class="bi bi-shield-lock display-1 opacity-25"></i>
                <h4 class="mt-3 text-muted">No confidential prayers</h4>
                <p class="text-muted">Confidential prayer requests will appear here</p>
              </div>

              <div v-else class="row g-4">
                <div v-for="prayer in confidentialPrayers" :key="prayer.id" class="col-lg-6">
                  <div class="prayer-card card border-0 shadow-sm border-warning" :class="{ 'answered-prayer-card': prayer.status === 'answered' }">
                    <!-- Answered Prayer Banner -->
                    <div v-if="prayer.status === 'answered'" class="answered-banner bg-success text-white px-3 py-2">
                      <i class="bi bi-check-circle-fill me-2"></i>
                      <strong>Prayer Answered!</strong>
                      <small class="ms-2 opacity-75">Praise God for answered prayer!</small>
                    </div>
                    
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start mb-3">
                        <span class="badge bg-warning text-dark">
                          <i class="bi bi-shield-lock me-1"></i>
                          Confidential
                        </span>
                        <div v-if="prayer.status === 'answered'" class="text-success small">
                          <i class="bi bi-check-circle-fill me-1"></i>
                          {{ formatDate(prayer.dateAnswered) }}
                        </div>
                      </div>

                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-person-circle me-2 church-purple"></i>
                        <strong>{{ prayer.requestedBy }}</strong>
                      </div>

                      <p class="card-text mb-3">{{ prayer.request }}</p>

                      <div class="prayer-meta">
                        <small class="text-muted d-block">
                          <i class="bi bi-calendar me-1"></i>
                          Requested: {{ formatDate(prayer.dateRequested) }}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pending Approval Tab (Admin/Pastor Only) -->
            <div v-if="activeTab === 'pending' && (user?.userType === 'admin' || user?.userType === 'pastor')" class="tab-pane fade show active">
              <div v-if="pendingPrayers.length === 0" class="text-center py-5">
                <i class="bi bi-clock-history display-1 opacity-25"></i>
                <h4 class="mt-3 text-muted">No pending prayers</h4>
                <p class="text-muted">Prayer requests awaiting approval will appear here</p>
              </div>

              <div v-else class="row g-4">
                <div v-for="prayer in pendingPrayers" :key="prayer.id" class="col-lg-6">
                  <div class="prayer-card card border-0 shadow-sm border-warning">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <span class="badge me-2" :class="getCategoryBadgeClass(prayer.category)">
                            {{ prayer.category }}
                          </span>
                          <span class="badge bg-warning text-dark">
                            <i class="bi bi-clock-history me-1"></i>
                            Pending Approval
                          </span>
                        </div>
                      </div>

                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-person-circle me-2 church-purple"></i>
                        <strong>{{ prayer.requestedBy }}</strong>
                      </div>

                      <p class="card-text mb-3">{{ prayer.request }}</p>

                      <div class="prayer-meta mb-3">
                        <small class="text-muted d-block mb-1">
                          <i class="bi bi-calendar me-1"></i>
                          Submitted: {{ formatDate(prayer.dateRequested) }}
                        </small>
                        <small class="text-muted d-block">
                          <i class="bi bi-eye me-1"></i>
                          Visibility: {{ capitalizeFirst(prayer.visibility) }}
                        </small>
                      </div>

                      <div class="d-flex gap-2">
                        <button 
                          class="btn btn-success btn-sm flex-fill"
                          @click="approvePrayer(prayer)"
                        >
                          <i class="bi bi-check-circle me-1"></i>
                          Approve
                        </button>
                        <button 
                          class="btn btn-danger btn-sm flex-fill"
                          @click="rejectPrayer(prayer)"
                        >
                          <i class="bi bi-x-circle me-1"></i>
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Prayer Modal -->
    <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1" @click="closeModal">
      <div class="modal-dialog modal-lg" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingPrayer ? 'Edit Prayer Request' : 'Add Prayer Request' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePrayer">
              <div class="mb-3">
                <label for="prayerCategory" class="form-label">Category</label>
                <select class="form-select" id="prayerCategory" v-model="prayerForm.category" required>
                  <option value="">Select category</option>
                  <option value="Health">Health & Healing</option>
                  <option value="Family">Family & Relationships</option>
                  <option value="Work">Work & Career</option>
                  <option value="Financial">Financial</option>
                  <option value="Spiritual">Spiritual Growth</option>
                  <option value="Church">Church Ministry</option>
                  <option value="Discipleship">Small Groups</option>
                  <option value="Missions">Missions & Evangelism</option>
                  <option value="Thanksgiving">Thanksgiving & Praise</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="prayerRequest" class="form-label">Prayer Request</label>
                <textarea
                  class="form-control"
                  id="prayerRequest"
                  v-model="prayerForm.request"
                  rows="4"
                  required
                  placeholder="Share your prayer request..."
                ></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label">Visibility</label>
                <div class="mt-2">
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="radio" 
                      name="prayerVisibility" 
                      id="visibilityPersonal"
                      value="personal" 
                      v-model="prayerForm.visibility"
                      required
                    >
                    <label class="form-check-label" for="visibilityPersonal">
                      <strong>Personal</strong> - Only visible to you
                    </label>
                  </div>
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="radio" 
                      name="prayerVisibility" 
                      id="visibilityPastor"
                      value="pastor" 
                      v-model="prayerForm.visibility"
                      required
                    >
                    <label class="form-check-label" for="visibilityPastor">
                      <strong>Pastor Only</strong> - Confidential, only pastor can see
                    </label>
                  </div>
                  <div class="alert alert-info mt-3 mb-0">
                    <i class="bi bi-info-circle me-2"></i>
                    <small>Community prayers are managed by church administrators only.</small>
                  </div>
                </div>
              </div>

              <div v-if="error" class="alert alert-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-heart-fill me-2"></i>
                  {{ loading ? 'Saving...' : (editingPrayer ? 'Update Prayer' : 'Add Prayer') }}
                </button>
                <button type="button" class="btn btn-secondary" @click="closeModal">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showAddModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCurrentUser } from '../utils/auth'

const user = getCurrentUser()

const prayers = ref([])
const prayingFor = ref([])
const activeTab = ref('my')
const showAddModal = ref(false)
const editingPrayer = ref(null)
const loading = ref(false)
const error = ref('')

const prayerForm = ref({
  category: '',
  request: '',
  visibility: 'personal'
})

const myPrayers = computed(() => {
  const filtered = prayers.value.filter(p => p.userId === user?.id)
  // Sort: active prayers first, answered prayers last
  return filtered.sort((a, b) => {
    if (a.status === 'answered' && b.status !== 'answered') return 1
    if (a.status !== 'answered' && b.status === 'answered') return -1
    return new Date(b.dateRequested) - new Date(a.dateRequested)
  })
})

const communityPrayers = computed(() => {
  const filtered = prayers.value.filter(p => p.visibility === 'public' && p.userId !== user?.id && p.approved === true)
  // Sort: active prayers first, answered prayers last
  return filtered.sort((a, b) => {
    if (a.status === 'answered' && b.status !== 'answered') return 1
    if (a.status !== 'answered' && b.status === 'answered') return -1
    return new Date(b.dateRequested) - new Date(a.dateRequested)
  })
})

const confidentialPrayers = computed(() => {
  const filtered = prayers.value.filter(p => p.visibility === 'pastor')
  // Sort: active prayers first, answered prayers last
  return filtered.sort((a, b) => {
    if (a.status === 'answered' && b.status !== 'answered') return 1
    if (a.status !== 'answered' && b.status === 'answered') return -1
    return new Date(b.dateRequested) - new Date(a.dateRequested)
  })
})

const answeredPrayers = computed(() => {
  return prayers.value.filter(p => p.status === 'answered').length
})

const pendingPrayers = computed(() => {
  if (user?.userType !== 'admin' && user?.userType !== 'pastor') return []
  return prayers.value.filter(p => p.approved === false)
})

onMounted(() => {
  // Initialize sample prayers for demo users
  initializeSamplePrayers()
  loadPrayers()
  loadPrayingFor()
})

const initializeSamplePrayers = () => {
  // Sample prayer initialization removed - no demo user prayers needed
}

const loadPrayers = () => {
  // Load prayers from all users for community view
  const allUsers = JSON.parse(localStorage.getItem('gcbf_users') || '[]')
  const allPrayers = []

  allUsers.forEach(user => {
    let userPrayers = JSON.parse(localStorage.getItem(`gcbf_prayers_${user.id}`) || '[]')
    
    // Migration: Add approval fields to existing prayers if they don't have them
    let needsUpdate = false
    userPrayers = userPrayers.map(prayer => {
      if (prayer.approved === undefined) {
        needsUpdate = true
        return {
          ...prayer,
          approved: false,
          approvedBy: null,
          approvedAt: null
        }
      }
      return prayer
    })
    
    // Save migrated data back to localStorage
    if (needsUpdate) {
      localStorage.setItem(`gcbf_prayers_${user.id}`, JSON.stringify(userPrayers))
    }
    
    userPrayers.forEach(prayer => {
      allPrayers.push({
        ...prayer,
        requestedBy: user.name,
        userEmail: user.email
      })
    })
  })

  prayers.value = allPrayers.sort((a, b) => new Date(b.dateRequested) - new Date(a.dateRequested))
}

const loadPrayingFor = () => {
  const userId = user?.id
  if (!userId) return
  
  const saved = localStorage.getItem(`gcbf_praying_for_${userId}`)
  if (saved) {
    prayingFor.value = JSON.parse(saved)
  }
}

const savePrayingFor = () => {
  const userId = user?.id
  if (!userId) return
  
  localStorage.setItem(`gcbf_praying_for_${userId}`, JSON.stringify(prayingFor.value))
}

const savePrayer = () => {
  loading.value = true
  error.value = ''

  try {
    const userId = user?.id
    if (!userId) throw new Error('User not authenticated')

    let userPrayers = JSON.parse(localStorage.getItem(`gcbf_prayers_${userId}`) || '[]')

    if (editingPrayer.value) {
      // Update existing prayer
      const index = userPrayers.findIndex(p => p.id === editingPrayer.value.id)
      if (index !== -1) {
        userPrayers[index] = {
          ...userPrayers[index],
          ...prayerForm.value,
          updatedAt: new Date().toISOString()
        }
      }
    } else {
      // Add new prayer
      const newPrayer = {
        id: Date.now().toString(),
        ...prayerForm.value,
        userId: userId,
        dateRequested: new Date().toISOString().split('T')[0],
        status: 'active',
        approved: false,
        approvedBy: null,
        approvedAt: null,
        createdAt: new Date().toISOString()
      }
      userPrayers.push(newPrayer)
      
      // Note: Community prayers are now managed by admins only
      // Users can only create personal or pastor-only prayers
    }

    localStorage.setItem(`gcbf_prayers_${userId}`, JSON.stringify(userPrayers))
    loadPrayers() // Reload all prayers
    closeModal()

  } catch (err) {
    error.value = 'Failed to save prayer request. Please try again.'
  } finally {
    loading.value = false
  }
}

const editPrayer = (prayer) => {
  editingPrayer.value = prayer
  prayerForm.value = {
    category: prayer.category,
    request: prayer.request,
    visibility: prayer.visibility
  }
  showAddModal.value = true
}

const deletePrayer = (prayerId) => {
  if (!confirm('Are you sure you want to delete this prayer request?')) return

  const userId = user?.id
  if (!userId) return

  let userPrayers = JSON.parse(localStorage.getItem(`gcbf_prayers_${userId}`) || '[]')
  userPrayers = userPrayers.filter(p => p.id !== prayerId)
  localStorage.setItem(`gcbf_prayers_${userId}`, JSON.stringify(userPrayers))
  loadPrayers()
}

const toggleAnswered = (prayer) => {
  const userId = user?.id
  if (!userId || prayer.userId !== userId) return

  let userPrayers = JSON.parse(localStorage.getItem(`gcbf_prayers_${userId}`) || '[]')
  const index = userPrayers.findIndex(p => p.id === prayer.id)
  
  if (index !== -1) {
    if (userPrayers[index].status === 'answered') {
      userPrayers[index].status = 'active'
      delete userPrayers[index].dateAnswered
      delete userPrayers[index].testimony
    } else {
      userPrayers[index].status = 'answered'
      userPrayers[index].dateAnswered = new Date().toISOString().split('T')[0]
      // Could add testimony input here
    }
    
    localStorage.setItem(`gcbf_prayers_${userId}`, JSON.stringify(userPrayers))
    loadPrayers()
  }
}

const togglePraying = (prayerId) => {
  const index = prayingFor.value.indexOf(prayerId)
  
  if (index !== -1) {
    prayingFor.value.splice(index, 1)
  } else {
    prayingFor.value.push(prayerId)
  }
  
  savePrayingFor()
}

const isPraying = (prayerId) => {
  return prayingFor.value.includes(prayerId)
}

const getPrayingCount = (prayerId) => {
  // In a real app, this would count across all users
  // For demo, return a random number between 1-10
  return Math.floor(Math.random() * 10) + 1
}

const approvePrayer = (prayer) => {
  if (!user || (user.userType !== 'admin' && user.userType !== 'pastor')) return
  
  const prayerUserId = prayer.userId
  let userPrayers = JSON.parse(localStorage.getItem(`gcbf_prayers_${prayerUserId}`) || '[]')
  const index = userPrayers.findIndex(p => p.id === prayer.id)
  
  if (index !== -1) {
    userPrayers[index].approved = true
    userPrayers[index].approvedBy = user.name
    userPrayers[index].approvedAt = new Date().toISOString()
    
    localStorage.setItem(`gcbf_prayers_${prayerUserId}`, JSON.stringify(userPrayers))
    loadPrayers()
  }
}

const rejectPrayer = (prayer) => {
  if (!user || (user.userType !== 'admin' && user.userType !== 'pastor')) return
  if (!confirm('Are you sure you want to reject this prayer request? The user will be notified.')) return
  
  const prayerUserId = prayer.userId
  let userPrayers = JSON.parse(localStorage.getItem(`gcbf_prayers_${prayerUserId}`) || '[]')
  
  // Remove the prayer entirely or you could mark it as rejected
  userPrayers = userPrayers.filter(p => p.id !== prayer.id)
  
  localStorage.setItem(`gcbf_prayers_${prayerUserId}`, JSON.stringify(userPrayers))
  loadPrayers()
}

const closeModal = () => {
  showAddModal.value = false
  editingPrayer.value = null
  prayerForm.value = {
    category: '',
    request: '',
    visibility: 'personal'
  }
  error.value = ''
}

const getCategoryBadgeClass = (category) => {
  const classes = {
    'Health': 'bg-danger',
    'Family': 'bg-primary',
    'Work': 'bg-info',
    'Financial': 'bg-success',
    'Spiritual': 'bg-warning text-dark',
    'Church': 'bg-purple',
    'Community': 'bg-secondary',
    'Missions': 'bg-dark',
    'Thanksgiving': 'bg-success',
    'Other': 'bg-light text-dark'
  }
  return classes[category] || 'bg-secondary'
}

const getVisibilityBadgeClass = (visibility) => {
  if (visibility === 'public') return 'bg-success'
  if (visibility === 'personal') return 'bg-info'
  return 'bg-warning text-dark' // pastor
}

const getVisibilityIcon = (visibility) => {
  if (visibility === 'public') return 'bi bi-people'
  if (visibility === 'personal') return 'bi bi-lock'
  return 'bi bi-shield-lock' // pastor
}

const capitalizeFirst = (str) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>

<style scoped>
.prayer-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.prayer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
}

.answered-prayer-card {
  border-left: 4px solid #198754 !important;
}

.answered-banner {
  font-size: 0.9rem;
  border-radius: 0;
  display: flex;
  align-items: center;
}

.nav-tabs .nav-link {
  border: none;
  color: #6c757d;
  font-weight: 500;
}

.nav-tabs .nav-link.active {
  background-color: #C96868;
  color: white;
  border-radius: 8px 8px 0 0;
}

.nav-tabs .nav-link:hover {
  border: none;
  color: #C96868;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.bg-purple {
  background-color: #C96868 !important;
}

.prayer-meta {
  border-top: 1px solid #e9ecef;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
}

.form-control:focus,
.form-select:focus {
  box-shadow: 0 0 0 0.2rem rgba(201, 104, 104, 0.25);
  border-color: #C96868;
}
</style>