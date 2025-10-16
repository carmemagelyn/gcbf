<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section bg-church-purple text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">Welcome to Graced Community Bible Fellowship</h1>
            <p class="lead mb-4">
              Join us in worship, fellowship, and growing in God's grace together. 
              Everyone is welcome in our loving community.
            </p>
            <div class="d-flex gap-3">
              <router-link v-if="!isAuth" to="/register" class="btn btn-light btn-lg">
                Join Our Community
              </router-link>
              <router-link v-if="isAuth" to="/dashboard" class="btn btn-light btn-lg">
                Go to Dashboard
              </router-link>
              <button class="btn btn-outline-light btn-lg" @click="scrollToServices">
                View Services
              </button>
            </div>
          </div>
          <div class="col-lg-6 text-center">
            <i class="bi bi-church display-1 opacity-75"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- Weekly Services Section -->
    <section id="services" class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="display-6 fw-bold church-purple">Weekly Services</h2>
          <p class="lead text-muted">Join us for worship and fellowship</p>
        </div>
        
        <div class="row g-4">
          <div v-for="service in weeklyServices" :key="service.id" class="col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm border-0">
              <div class="card-body text-center">
                
                <h5 class="card-title fw-bold">{{ service.name }}</h5>
                <div class="service-details">
                  <p class="mb-1"><strong>{{ service.day }}</strong></p>
                  <p class="mb-1">{{ service.time }}</p>
                  <p class="mb-0 text-muted">{{ service.location }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Monthly Newsletter Carousel Section -->
    <section class="bg-light py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="display-6 fw-bold church-purple">Monthly Newsletter</h2>
          <p class="lead text-muted">Latest updates from our church leadership</p>
        </div>
        
        <!-- Newsletter Cards -->
        <div v-if="monthlyNewsletters && monthlyNewsletters.length > 0" class="row g-4">
          <div 
            v-for="newsletter in monthlyNewsletters" 
            :key="newsletter.id"
            class="col-lg-4 col-md-6"
          >
            <div 
              class="card h-100 border-0 shadow-sm newsletter-card clickable-card"
              @click="viewNewsletter(newsletter)"
              @contextmenu.prevent="downloadNewsletter(newsletter)"
              :title="`Click to open ${newsletter.title} | Right-click to download`"
            >
              <!-- Newsletter Cover Image or Icon -->
              <div class="card-img-top position-relative overflow-hidden" style="height: 200px;">
                <div v-if="newsletter.coverImage" class="w-100 h-100">
                  <img 
                    :src="newsletter.coverImage" 
                    :alt="newsletter.title"
                    class="w-100 h-100 object-fit-cover"
                  >
                  <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"></div>
                </div>
                <div v-else class="w-100 h-100 bg-gradient-primary d-flex align-items-center justify-content-center">
                  <i class="bi bi-file-earmark-pdf display-1 text-white opacity-75"></i>
                </div>
                
                <!-- Newsletter Title Overlay -->
                <div class="position-absolute bottom-0 start-0 w-100 p-3 text-white">
                  <h5 class="fw-bold mb-1">{{ newsletter.title }}</h5>
                  <p class="mb-0 small opacity-75">{{ formatDate(newsletter.date) }}</p>
                </div>
                
                <!-- Issue Badge -->
                <div class="position-absolute top-0 end-0 m-3">
                  <span class="badge bg-light text-dark">Issue #{{ newsletter.issueNumber }}</span>
                </div>

                <!-- Hover Overlay with Instructions -->
                <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center newsletter-hover-overlay">
                  <div class="text-center text-white">
                    <i class="bi bi-eye-fill display-4 mb-2"></i>
                    <p class="mb-1 fw-bold">Click to Open PDF</p>
                    <p class="small mb-0 opacity-75">Right-click to Download</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5">
          <i class="bi bi-newspaper display-1 text-muted opacity-50"></i>
          <h4 class="text-muted mt-3">No newsletters available</h4>
          <p class="text-muted">Check back soon for the latest church updates</p>
        </div>
      </div>
    </section>



    <!-- Contact Section -->
    <footer class="text-white py-5" style="background-color: #537D5D;">
      <div class="container">
        <div class="row">
          <div class="col-lg-6">
            <h4 class="fw-bold mb-4">Visit Us</h4>
            <p><i class="bi bi-geo-alt-fill me-2"></i><a href="https://maps.app.goo.gl/fpM5Nabzzk7e55am8">AMK Bldg. General Luna St, Iloilo City Proper, Iloilo City, Iloilo</a></p>
            <p><i class="bi bi-telephone-fill me-2"></i><a href="tel:+63906067141">09060671412</a></p>
            <p><i class="bi bi-envelope-fill me-2"></i>info@gcbf.org</p>
          </div>
          <div class="col-lg-6">
            <h4 class="fw-bold mb-4">Connect With Us</h4>
            <div class="d-flex gap-3">
              <a href="#" class="text-white fs-4"><i class="bi bi-facebook"></i></a>
              <a href="#" class="text-white fs-4"><i class="bi bi-twitter"></i></a>
              <a href="#" class="text-white fs-4"><i class="bi bi-instagram"></i></a>
              <a href="#" class="text-white fs-4"><i class="bi bi-youtube"></i></a>
            </div>
          </div>
        </div>
        <hr class="my-4">
        <div class="text-center">
          <p>&copy; 2025 Graced Community Bible Fellowship. All rights reserved.</p>
          <div class="mt-3">
            <router-link to="/admin-login" class="text-muted small text-decoration-none">
              <i class="bi bi-shield-lock me-1"></i>
              Admin Portal Access
            </router-link>
          </div>
        </div>
      </div>
    </footer>

    <!-- Update Details Modal -->
    <div v-if="selectedUpdate" class="modal fade show d-block" tabindex="-1" @click="closeModal">
      <div class="modal-dialog modal-lg" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedUpdate.title }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p class="text-muted">{{ formatDate(selectedUpdate.date) }}</p>
            <div v-html="selectedUpdate.content"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedUpdate" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { isAuthenticated } from '../utils/auth'

const isAuth = computed(() => isAuthenticated())
const selectedUpdate = ref(null)

const weeklyServices = ref([
  {
    id: 1,
    name: 'Sunday Worship',
    day: 'Sunday',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    icon: 'bi bi-church'
  },
  {
    id: 2,
    name: 'Bible Night Class',
    day: 'Wednesday',
    time: '7:00 PM',
    location: 'Fellowship Hall',
    icon: 'bi bi-book'
  },
  {
    id: 6,
    name: 'Small Groups',
    day: 'Saturday',
    time: '9:00 AM',
    location: 'Various Locations',
    icon: 'bi bi-heart-fill'
  }
])

// Monthly newsletters uploaded by admin
const monthlyNewsletters = ref([
  {
    id: 1,
    title: 'October 2025 - Harvest Blessings',
    date: '2025-10-01',
    excerpt: 'Celebrating God\'s abundant harvest with thanksgiving, community service, and special events throughout October.',
    issueNumber: 22,
    pageCount: 12,
    publishedBy: 'Pastor Michael',
    coverImage: '/newsletter-covers/october-2025.jpg', // Would be uploaded by admin
    downloadUrl: '/newsletters/october-2025.pdf', // PDF file uploaded by admin
    highlights: [
      'Harvest Thanksgiving Service - October 27th',
      'Community Food Drive - Goal: 1,500 items',
      'New Member Classes starting November',
      'Youth Fall Retreat - October 15th',
      'Trunk or Treat Event - October 31st'
    ],
    content: `
      <h5>Harvest Thanksgiving Service</h5>
      <p>This October, we're celebrating God's abundant blessings with a special Harvest Thanksgiving service on October 27th. Join us as we give thanks for His provision and celebrate the harvest season.</p>
      
      <h5>Community Food Drive</h5>
      <p>We're organizing a community food drive throughout October to help local families in need. Please bring non-perishable items to any of our services. Our goal is to collect 1,000 items this month!</p>
      
      <h5>New Member Classes</h5>
      <p>Starting in November, we'll be offering new member orientation classes. If you're interested in officially joining our church family, please speak with Pastor Michael or register through our church portal.</p>
      
      <h5>Upcoming Events</h5>
      <ul>
        <li>October 15: Youth Fall Retreat</li>
        <li>October 22: Community Service Day</li>
        <li>October 27: Harvest Thanksgiving Service</li>
        <li>October 31: Trunk or Treat Event</li>
      </ul>
    `
  },
  {
    id: 2,
    title: 'September 2025 - Back to School',
    date: '2025-09-01',
    excerpt: 'Starting the new season with renewed faith, education ministry updates, and preparing for fall activities.',
    issueNumber: 21,
    pageCount: 10,
    publishedBy: 'Pastor Michael',
    coverImage: '/newsletter-covers/september-2025.jpg',
    downloadUrl: '/newsletters/september-2025.pdf',
    highlights: [
      'Back to School Blessing Service',
      'Sunday School Teacher Training',
      'Fall Ministry Launch',
      'Youth Group Kickoff',
      'Small Groups Registration'
    ],
    content: `
      <h5>Back to School Blessing</h5>
      <p>We blessed our students, teachers, and families as they return to school this fall.</p>
      
      <h5>Ministry Updates</h5>
      <p>All our fall ministries are launching with exciting new programs and opportunities.</p>
    `
  },
  {
    id: 3,
    title: 'August 2025 - Summer Reflections',
    date: '2025-08-01',
    excerpt: 'Reflecting on a wonderful summer of ministry, missions, and memorable moments in our church family.',
    issueNumber: 20,
    pageCount: 14,
    publishedBy: 'Pastor Michael',
    coverImage: '/newsletter-covers/august-2025.jpg',
    downloadUrl: '/newsletters/august-2025.pdf',
    highlights: [
      'Summer Mission Trip Testimonies',
      'VBS 2024 Success Stories',
      'Church Picnic Highlights',
      'Baptism Celebrations',
      'Facility Improvement Updates'
    ],
    content: `
      <h5>Summer Ministry Recap</h5>
      <p>What an amazing summer we've had together as a church family!</p>
      
      <h5>Mission Trip Success</h5>
      <p>Our youth mission trip was a tremendous blessing to both those we served and our young people.</p>
    `
  }
])

// Load newsletters from admin uploads
const loadNewsletters = () => {
  try {
    const savedNewsletters = localStorage.getItem('churchNewsletters')
    if (savedNewsletters) {
      const parsed = JSON.parse(savedNewsletters)
      // Keep only the latest 3 newsletters for the carousel
      monthlyNewsletters.value = parsed.slice(0, 3)
    }
    console.log('Loaded newsletters from admin uploads:', monthlyNewsletters.value.length)
  } catch (error) {
    console.error('Error loading newsletters:', error)
    // Fall back to sample data if there's an error
  }
}

// Newsletter functions - No longer needed for card layout

const viewNewsletter = (newsletter) => {
  // Open PDF in new tab for viewing
  if (newsletter.downloadUrl) {
    window.open(newsletter.downloadUrl, '_blank')
  } else {
    alert('PDF not available for this newsletter')
  }
}

const downloadNewsletter = (newsletter) => {
  // Download PDF file
  if (newsletter.downloadUrl) {
    const link = document.createElement('a')
    link.href = newsletter.downloadUrl
    link.download = `${newsletter.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    alert('PDF not available for download')
  }
}

const scrollToServices = () => {
  document.getElementById('services').scrollIntoView({ behavior: 'smooth' })
}

const showUpdateDetails = (update) => {
  selectedUpdate.value = update
}

const closeModal = () => {
  selectedUpdate.value = null
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(rgba(154, 63, 63, 0.7), rgba(154, 63, 63, 0.8)), url('/hero.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 500px;
  display: flex;
  align-items: center;
}

.stat-item {
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.newsletter-card {
  transition: all 0.3s ease;
}

.clickable-card {
  cursor: pointer;
  user-select: none;
}

.newsletter-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.2) !important;
}

.newsletter-card .card-img-top {
  position: relative;
  background: linear-gradient(135deg, #9A3F3F, #C96868);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #9A3F3F, #C96868) !important;
}

.newsletter-hover-overlay {
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.newsletter-card:hover .newsletter-hover-overlay {
  opacity: 1;
}

.clickable-card:active {
  transform: translateY(-4px);
}

.service-details {
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
  margin-top: 1rem;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

footer a {
  color: #FBF9D1 !important;
  text-decoration: none;
}

footer a:hover {
  color: #FFFFFF !important;
  text-decoration: underline;
}

#services .card {
  background-color: #FFFFFF !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15) !important;
}

#services .card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
}
</style>