<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section text-white py-5" style="
    
      background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/hero.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    ">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
         
            <h1 class="display-4 fw-bold mb-5">Welcome to Graced Community Bible Fellowship</h1>
         
            <p class="lead mb-4">
              Shaped by the Potter’s love to live out His Kingdom purpose through Jesus Christ by the work of the Holy Spirit.
            </p>
       
            <div class="d-flex gap-3">
              <button v-if="!isAuth" class="btn btn-primary btn-lg" @click="scrollToLocation">
                Our Location
              </button>
              <router-link v-if="isAuth" to="/dashboard" class="btn btn-primary btn-lg">
                Go to Dashboard
              </router-link>
              <button class="btn btn-outline-primary btn-lg" @click="scrollToServices">
                View Services
              </button>
            </div>
        
          </div>
          <div class="col-lg-6">
            <!-- Weekly Verse -->
            <div class="card bg-white bg-opacity-10 border-0">
              <div class="card-body">
                <h6 class="text-uppercase fw-bold mb-3 text-white" style="letter-spacing: 1px; opacity: 0.9;">
                  <i class="bi bi-book me-2"></i>Verse of the Week
                </h6>
                <p class="fst-italic mb-3 text-white" style="font-size: 1.1rem; line-height: 1.6; opacity: 0.85;">
                  "{{ weeklyVerse.text }}"
                </p>
                <p class="text-end mb-0 fw-bold text-white" style="opacity: 0.9;">
                  — {{ weeklyVerse.reference }}
                </p>
              </div>
            </div>
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
            <div class="card h-100 shadow-sm border-0 service-card">
              <div class="card-body text-center">
                
                <h5 class="card-title fw-bold">{{ service.name }}</h5>
                <div class="service-details">
                  <p class="mb-1"><strong>{{ service.day }}</strong></p>
                  <p class="mb-0">{{ service.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Monthly Newsletter Carousel Section -->
    <section class="bg-light pt-5 pb-0">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="display-6 fw-bold church-purple">Monthly Newsletter</h2>
          <p class="lead text-muted">Stay connected with our church updates</p>
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
                  <h5 class="fw-bold mb-0">{{ newsletter.title }}</h5>
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

      <!-- Location Section (within newsletter background) -->
      <div id="location" class="container-fluid mt-5 pt-5 px-0 pb-0 mb-0">
        <div class="container mb-4">
          <div class="text-center mb-4">
            <h2 class="display-6 fw-bold church-purple">
              <i class="bi bi-geo-alt-fill me-2"></i>Find Us
            </h2>
            <p class="lead text-muted mb-3">AMK Bldg. General Luna St, Iloilo City Proper, Iloilo City, Iloilo</p>
            <div class="d-flex justify-content-center align-items-center gap-3 flex-wrap">
          
            </div>
          </div>
        </div>
        <div class="map-container shadow-lg position-relative">
          <div class="map-overlay"></div>
          <iframe 
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Twinbee+Print+Ads+Corp,General+Luna+St,Iloilo+City&zoom=16" 
            style="border:0; width: 100%; height: 450px;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="text-white py-4" style="background-color: #537D5D; margin-top: 0;">
      <div class="container">
        <div class="text-center">
          <p>&copy; 2025 Graced Community Bible Fellowship. All rights reserved.</p>
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
import { useRouter } from 'vue-router'
import { isAuthenticated } from '../utils/auth'

const router = useRouter()

// Redirect authenticated users to dashboard
onMounted(() => {
  if (isAuthenticated()) {
    router.push('/dashboard')
  }
})

const isAuth = computed(() => isAuthenticated())
const selectedUpdate = ref(null)

// 52-Week Scripture Memory (KJV Version) - Starting from 2021
const weeklyVerses = [
  { week: 1, reference: "Psalm 119:11", text: "Thy word have I hid in mine heart, that I might not sin against thee." },
  { week: 2, reference: "2 Timothy 3:16-17", text: "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness: That the man of God may be perfect, throughly furnished unto all good works." },
  { week: 3, reference: "Joshua 1:8", text: "This book of the law shall not depart out of thy mouth; but thou shalt meditate therein day and night, that thou mayest observe to do according to all that is written therein: for then thou shalt make thy way prosperous, and then thou shalt have good success." },
  { week: 4, reference: "Hebrews 4:12", text: "For the word of God is quick, and powerful, and sharper than any twoedged sword, piercing even to the dividing asunder of soul and spirit, and of the joints and marrow, and is a discerner of the thoughts and intents of the heart." },
  { week: 5, reference: "Matthew 4:4", text: "But he answered and said, It is written, Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God." },
  { week: 6, reference: "Psalm 119:105", text: "Thy word is a lamp unto my feet, and a light unto my path." },
  { week: 7, reference: "Romans 12:1-2", text: "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service. And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God." },
  { week: 8, reference: "James 1:22", text: "But be ye doers of the word, and not hearers only, deceiving your own selves." },
  { week: 9, reference: "1 Peter 2:2", text: "As newborn babes, desire the sincere milk of the word, that ye may grow thereby." },
  { week: 10, reference: "Colossians 3:16", text: "Let the word of Christ dwell in you richly in all wisdom; teaching and admonishing one another in psalms and hymns and spiritual songs, singing with grace in your hearts to the Lord." },
  { week: 11, reference: "John 1:1", text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
  { week: 12, reference: "Psalm 19:7-8", text: "The law of the LORD is perfect, converting the soul: the testimony of the LORD is sure, making wise the simple. The statutes of the LORD are right, rejoicing the heart: the commandment of the LORD is pure, enlightening the eyes." },
  { week: 13, reference: "John 17:17", text: "Sanctify them through thy truth: thy word is truth." },
  { week: 14, reference: "Romans 10:17", text: "So then faith cometh by hearing, and hearing by the word of God." },
  { week: 15, reference: "2 Peter 1:21", text: "For the prophecy came not in old time by the will of man: but holy men of God spake as they were moved by the Holy Ghost." },
  { week: 16, reference: "Isaiah 55:11", text: "So shall my word be that goeth forth out of my mouth: it shall not return unto me void, but it shall accomplish that which I please, and it shall prosper in the thing whereto I sent it." },
  { week: 17, reference: "Matthew 24:35", text: "Heaven and earth shall pass away, but my words shall not pass away." },
  { week: 18, reference: "Psalm 119:89", text: "For ever, O LORD, thy word is settled in heaven." },
  { week: 19, reference: "John 8:31-32", text: "Then said Jesus to those Jews which believed on him, If ye continue in my word, then are ye my disciples indeed; And ye shall know the truth, and the truth shall make you free." },
  { week: 20, reference: "Acts 20:32", text: "And now, brethren, I commend you to God, and to the word of his grace, which is able to build you up, and to give you an inheritance among all them which are sanctified." },
  { week: 21, reference: "1 Thessalonians 2:13", text: "For this cause also thank we God without ceasing, because, when ye received the word of God which ye heard of us, ye received it not as the word of men, but as it is in truth, the word of God, which effectually worketh also in you that believe." },
  { week: 22, reference: "Jeremiah 15:16", text: "Thy words were found, and I did eat them; and thy word was unto me the joy and rejoicing of mine heart: for I am called by thy name, O LORD God of hosts." },
  { week: 23, reference: "Proverbs 30:5", text: "Every word of God is pure: he is a shield unto them that put their trust in him." },
  { week: 24, reference: "Luke 11:28", text: "But he said, Yea rather, blessed are they that hear the word of God, and keep it." },
  { week: 25, reference: "1 John 2:5", text: "But whoso keepeth his word, in him verily is the love of God perfected: hereby know we that we are in him." },
  { week: 26, reference: "Revelation 1:3", text: "Blessed is he that readeth, and they that hear the words of this prophecy, and keep those things which are written therein: for the time is at hand." },
  { week: 27, reference: "Matthew 7:24", text: "Therefore whosoever heareth these sayings of mine, and doeth them, I will liken him unto a wise man, which built his house upon a rock." },
  { week: 28, reference: "Psalm 119:130", text: "The entrance of thy words giveth light; it giveth understanding unto the simple." },
  { week: 29, reference: "John 15:7", text: "If ye abide in me, and my words abide in you, ye shall ask what ye will, and it shall be done unto you." },
  { week: 30, reference: "Psalm 119:9", text: "Wherewithal shall a young man cleanse his way? by taking heed thereto according to thy word." },
  { week: 31, reference: "2 Timothy 2:15", text: "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth." },
  { week: 32, reference: "Psalm 119:162", text: "I rejoice at thy word, as one that findeth great spoil." },
  { week: 33, reference: "Ephesians 6:17", text: "And take the helmet of salvation, and the sword of the Spirit, which is the word of God." },
  { week: 34, reference: "1 Peter 1:23", text: "Being born again, not of corruptible seed, but of incorruptible, by the word of God, which liveth and abideth for ever." },
  { week: 35, reference: "Proverbs 4:20-22", text: "My son, attend to my words; incline thine ear unto my sayings. Let them not depart from thine eyes; keep them in the midst of thine heart. For they are life unto those that find them, and health to all their flesh." },
  { week: 36, reference: "Mark 4:14", text: "The sower soweth the word." },
  { week: 37, reference: "Acts 17:11", text: "These were more noble than those in Thessalonica, in that they received the word with all readiness of mind, and searched the scriptures daily, whether those things were so." },
  { week: 38, reference: "Psalm 119:160", text: "Thy word is true from the beginning: and every one of thy righteous judgments endureth for ever." },
  { week: 39, reference: "John 5:39", text: "Search the scriptures; for in them ye think ye have eternal life: and they are they which testify of me." },
  { week: 40, reference: "Romans 15:4", text: "For whatsoever things were written aforetime were written for our learning, that we through patience and comfort of the scriptures might have hope." },
  { week: 41, reference: "2 Timothy 3:15", text: "And that from a child thou hast known the holy scriptures, which are able to make thee wise unto salvation through faith which is in Christ Jesus." },
  { week: 42, reference: "Psalm 119:140", text: "Thy word is very pure: therefore thy servant loveth it." },
  { week: 43, reference: "Deuteronomy 11:18", text: "Therefore shall ye lay up these my words in your heart and in your soul, and bind them for a sign upon your hand, that they may be as frontlets between your eyes." },
  { week: 44, reference: "1 John 2:14", text: "I have written unto you, fathers, because ye have known him that is from the beginning. I have written unto you, young men, because ye are strong, and the word of God abideth in you, and ye have overcome the wicked one." },
  { week: 45, reference: "Jeremiah 23:29", text: "Is not my word like as a fire? saith the LORD; and like a hammer that breaketh the rock in pieces?" },
  { week: 46, reference: "John 6:63", text: "It is the spirit that quickeneth; the flesh profiteth nothing: the words that I speak unto you, they are spirit, and they are life." },
  { week: 47, reference: "Psalm 119:97", text: "O how love I thy law! it is my meditation all the day." },
  { week: 48, reference: "Acts 6:7", text: "And the word of God increased; and the number of the disciples multiplied in Jerusalem greatly; and a great company of the priests were obedient to the faith." },
  { week: 49, reference: "Psalm 119:50", text: "This is my comfort in my affliction: for thy word hath quickened me." },
  { week: 50, reference: "1 Peter 1:25", text: "But the word of the Lord endureth for ever. And this is the word which by the gospel is preached unto you." },
  { week: 51, reference: "Proverbs 2:1-5", text: "My son, if thou wilt receive my words, and hide my commandments with thee; So that thou incline thine ear unto wisdom, and apply thine heart to understanding; Yea, if thou criest after knowledge, and liftest up thy voice for understanding; If thou seekest her as silver, and searchest for her as for hid treasures; Then shalt thou understand the fear of the LORD, and find the knowledge of God." },
  { week: 52, reference: "James 1:21", text: "Wherefore lay apart all filthiness and superfluity of naughtiness, and receive with meekness the engrafted word, which is able to save your souls." }
]

// Calculate current week based on 2021 start date
const getWeeklyVerse = () => {
  const startDate = new Date('2021-01-01') // Start from January 1, 2021
  const currentDate = new Date()
  
  // Calculate difference in days
  const diffTime = Math.abs(currentDate - startDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // Calculate which week we're in (0-51)
  const weekNumber = Math.floor(diffDays / 7) % 52
  
  return weeklyVerses[weekNumber]
}

const weeklyVerse = ref(getWeeklyVerse())

const weeklyServices = ref([
  {
    id: 1,
    name: 'Worship Service',
    day: 'Sunday',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    icon: 'bi bi-church'
  },
  {
    id: 2,
    name: 'Bible Night Class',
    day: 'Tuesday',
    time: '6:30 PM',
    location: 'Fellowship Hall',
    icon: 'bi bi-book'
  },
  {
    id: 6,
    name: 'Small Groups',
    day: 'Saturday',
    time: '3:00 PM',
    location: 'Various Locations',
    icon: 'bi bi-heart-fill'
  }
])

// Monthly newsletters uploaded by admin
const monthlyNewsletters = ref([])

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

const scrollToLocation = () => {
  document.getElementById('location').scrollIntoView({ behavior: 'smooth' })
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
  box-shadow: 0 4px 15px rgba(83, 125, 93, 0.3) !important;
}

#services .card:hover {
  box-shadow: 0 8px 25px rgba(83, 125, 93, 0.5) !important;
}

.service-card {
  box-shadow: 0 4px 15px rgba(83, 125, 93, 0.3) !important;
}

.service-card:hover {
  box-shadow: 0 8px 25px rgba(83, 125, 93, 0.5) !important;
}

.map-container {
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.map-container iframe {
  display: block;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(85, 44, 44, 0.7);
  pointer-events: none;
  transition: opacity 0.5s ease;
  z-index: 1;
}

.map-container:hover .map-overlay {
  opacity: 0;
}
</style>