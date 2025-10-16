<template>
  <div class="dashboard">
    <div class="container py-4">
      <!-- Welcome Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card bg-church-purple text-white border-0">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h2 class="fw-bold mb-2">
                    Welcome back, {{ user?.name }}!
                  </h2>
                  <p class="mb-0 opacity-75">
                    <i class="bi bi-person-badge me-2"></i>
                    {{ capitalizeFirst(user?.userType || '') }} since {{ formatDate(user?.joinDate) }}
                  </p>
                </div>
                <div class="col-md-4 text-end">
                  <i class="bi bi-person-circle display-3 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="row g-4 mb-4">
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-cash display-4 church-purple"></i>
              <h5 class="mt-2 mb-0">₱{{ totalGiven }}</h5>
              <small class="text-muted">Total Given</small>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-book display-4 church-purple"></i>
              <h5 class="mt-2 mb-0">{{ bibleProgress }}%</h5>
              <small class="text-muted">Bible Progress</small>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-heart display-4 church-purple"></i>
              <h5 class="mt-2 mb-0">{{ prayerRequestsCount }}</h5>
              <small class="text-muted">Prayer Requests</small>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-calendar-event display-4 church-purple"></i>
              <h5 class="mt-2 mb-0">{{ attendanceStreak }}</h5>
              <small class="text-muted">Week Streak</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row g-4 mb-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 pb-0">
              <h5 class="fw-bold mb-0">Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-4">
                  <router-link to="/giving" class="btn btn-outline-primary w-100 p-3 text-start">
                    <i class="me-3">💵</i>
                    <strong>Giving</strong>
                  </router-link>
                </div>
                <div class="col-md-4">
                  <router-link to="/bible-reading" class="btn btn-outline-primary w-100 p-3 text-start">
                    <i class="me-3">📖</i>
                    <strong>Bible Reading</strong>
                   
                  </router-link>
                </div>
                <div class="col-md-4">
                  <router-link to="/prayer-list" class="btn btn-outline-primary w-100 p-3 text-start">
                    <i class="me-3">🙏</i>
                    <strong>Prayer List</strong>
                   
                  </router-link>
                </div>
              </div>
              
              <div v-if="user?.userType === 'member'" class="mt-3">
                <router-link to="/church-portal" class="btn btn-primary w-100 p-3 text-start">
                  <i class="bi bi-building fs-4 d-block mb-2"></i>
                  <strong>Church Portal</strong>
                  <small class="d-block">Access member resources</small>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 pb-0">
              <h5 class="fw-bold mb-0">Upcoming Events</h5>
            </div>
            <div class="card-body">
              <div v-for="event in upcomingEvents" :key="event.id" class="d-flex align-items-center mb-3">
                <div class="event-date bg-light rounded text-center p-2 me-3" style="min-width: 60px;">
                  <strong class="d-block church-purple">{{ event.day }}</strong>
                  <small class="text-muted">{{ event.month }}</small>
                </div>
                <div class="flex-grow-1">
                  <h6 class="mb-1 fw-bold">{{ event.title }}</h6>
                  <small class="text-muted">{{ event.time }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity & Prayer Requests -->
      <div class="row g-4">
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 pb-0">
              <h5 class="fw-bold mb-0">Recent Activity</h5>
            </div>
            <div class="card-body">
              <div v-for="activity in recentActivity" :key="activity.id" class="d-flex align-items-start mb-3">
                <div class="activity-icon me-3">
                  <i :class="activity.icon" class="church-purple"></i>
                </div>
                <div class="flex-grow-1">
                  <p class="mb-1">{{ activity.description }}</p>
                  <small class="text-muted">{{ formatDateTime(activity.timestamp) }}</small>
                </div>
              </div>
              <div v-if="recentActivity.length === 0" class="text-center text-muted py-3">
                <i class="bi bi-clock-history display-4 opacity-25"></i>
                <p class="mt-2 mb-0">No recent activity</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 pb-0 d-flex justify-content-between align-items-center">
              <h5 class="fw-bold mb-0">Community Prayers</h5>
              <router-link to="/prayer-list" class="btn btn-sm btn-outline-primary">View All</router-link>
            </div>
            <div class="card-body">
              <div v-for="prayer in communityPrayers.slice(0, 3)" :key="prayer.id" class="mb-3">
                <div class="d-flex justify-content-between align-items-start mb-1">
                  <strong class="text-muted small">{{ prayer.requestedBy }}</strong>
                  <span class="badge bg-secondary">{{ prayer.category }}</span>
                </div>
                <p class="mb-1">{{ truncateText(prayer.request, 80) }}</p>
                <small class="text-muted">{{ formatDate(prayer.dateRequested) }}</small>
              </div>
              <div v-if="communityPrayers.length === 0" class="text-center text-muted py-3">
                <i class="bi bi-heart display-4 opacity-25"></i>
                <p class="mt-2 mb-0">No community prayer requests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCurrentUser } from '../utils/auth'

const user = computed(() => getCurrentUser())

// Dashboard data
const totalGiven = ref(0)
const bibleProgress = ref(0)
const prayerRequestsCount = ref(0)
const attendanceStreak = ref(0)
const recentActivity = ref([])
const communityPrayers = ref([])

const upcomingEvents = ref([
  {
    id: 1,
    title: 'Sunday Worship',
    day: '20',
    month: 'Oct',
    time: '10:00 AM'
  },
  {
    id: 2,
    title: 'Bible Night Class',
    day: '23',
    month: 'Oct',
    time: '7:00 PM'
  },
  {
    id: 3,
    title: 'Campus Ministry',
    day: '25',
    month: 'Oct',
    time: '6:30 PM'
  },
  {
    id: 4,
    title: "Couple's Fellowship",
    day: '27',
    month: 'Oct',
    time: '6:00 PM'
  }
])

onMounted(() => {
  loadDashboardData()
})

const loadDashboardData = () => {
  // Load user-specific data from localStorage
  const userId = user.value?.id
  if (!userId) return

  // Load gifts
  const gifts = JSON.parse(localStorage.getItem(`gcbf_gifts_${userId}`) || '[]')
  totalGiven.value = gifts.reduce((sum, gift) => sum + gift.amount, 0)

  // Load bible reading progress
  const bibleReading = JSON.parse(localStorage.getItem(`gcbf_bible_${userId}`) || '{}')
  const completedChapters = Object.values(bibleReading).filter(Boolean).length
  bibleProgress.value = Math.round((completedChapters / 1189) * 100) // Approximate total chapters in Bible

  // Load prayer requests
  const prayers = JSON.parse(localStorage.getItem(`gcbf_prayers_${userId}`) || '[]')
  prayerRequestsCount.value = prayers.length

  // Mock attendance streak
  attendanceStreak.value = Math.floor(Math.random() * 12) + 1

  // Load recent activity
  loadRecentActivity(userId)

  // Load community prayers
  loadCommunityPrayers()
}

const loadRecentActivity = (userId) => {
  const activities = []
  
  // Check for recent gifts
  const gifts = JSON.parse(localStorage.getItem(`gcbf_gifts_${userId}`) || '[]')
  gifts.slice(-3).forEach(gift => {
    activities.push({
      id: `gift_${gift.id}`,
      icon: 'bi bi-cash',
      description: `Made a ${gift.frequency} gift of ₱${gift.amount}`,
      timestamp: gift.createdAt
    })
  })

  // Check for recent prayers
  const prayers = JSON.parse(localStorage.getItem(`gcbf_prayers_${userId}`) || '[]')
  prayers.slice(-2).forEach(prayer => {
    activities.push({
      id: `prayer_${prayer.id}`,
      icon: 'bi bi-heart',
      description: `Added a prayer request for ${prayer.category.toLowerCase()}`,
      timestamp: prayer.createdAt
    })
  })

  // Sort by timestamp and take most recent
  recentActivity.value = activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)
}

const loadCommunityPrayers = () => {
  // Load all public prayers from all users
  const allUsers = JSON.parse(localStorage.getItem('gcbf_users') || '[]')
  const publicPrayers = []

  allUsers.forEach(user => {
    const userPrayers = JSON.parse(localStorage.getItem(`gcbf_prayers_${user.id}`) || '[]')
    userPrayers.forEach(prayer => {
      if (prayer.visibility === 'public') {
        publicPrayers.push({
          ...prayer,
          requestedBy: user.name
        })
      }
    })
  })

  communityPrayers.value = publicPrayers
    .sort((a, b) => new Date(b.dateRequested) - new Date(a.dateRequested))
    .slice(0, 5)
}

const capitalizeFirst = (str) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
</script>

<style scoped>
.btn-outline-primary {
  border-color: #9A3F3F;
  color: #9A3F3F;
}

.btn-outline-primary:hover {
  background-color: #FBF9D1;
  border-color: #FBF9D1;
  color: #333333;
}

.event-date {
  font-size: 0.8rem;
}

.activity-icon {
  width: 24px;
  text-align: center;
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
}

.quick-action-btn {
  height: 100px;
  border-radius: 12px;
}
</style>