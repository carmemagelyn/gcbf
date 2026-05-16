<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section text-white" style="
    
      background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/hero.jpg');
      background-size: cover;
      background-position: center 42%;
      background-repeat: no-repeat;
    ">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="display-6 fw-bold mb-5">Building grace-filled community, fulfilling Christ’s mission.</h1>
              <div>
              <p class="text-uppercase fw-bold mb-3 text-white" style="font-size: .9rem; letter-spacing: .5px; opacity: 0.9;">
                  <i class="bi bi-clock me-1"></i>SERVICES SCHEDULE:
               
                <br><b  class="text-end mb-0 fw-bold text-white" style="font-size: .8rem; opacity: 0.9;">WORSHIP SERVICE:</b><span class="mb-3 text-white" style="font-size: .8rem; line-height: .7; opacity: 0.85;"> Sunday, 10:00AM - 12:00NN</span>
                <br><b class="text-end mb-0 fw-bold text-white" style="font-size: .8rem; opacity: 0.9;">NIGHT CLASS:</b><span class="mb-3 text-white" style="font-size: .8rem; line-height: .7; opacity: 0.85;"> Tuesday, 6:30PM - 8:00PM</span>
                <br><b class="text-end mb-0 fw-bold text-white" style="font-size: .8rem; opacity: 0.9;">YOUTH COMMunity:</b><span class="mb-3 text-white" style="font-size: .8rem; line-height: .7; opacity: 0.85;"> Thursday, 6:30PM - 8:00PM</span>
               
              </p>
              </div>
            <br>
            <div class="d-flex gap-3">
              <button v-if="!isAuth" class="btn btn-primary btn-lg" @click="scrollToLocation">
                Our Location
              </button>
            </div>
         
          </div>
          <div class="col-lg-4">
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

  
    <section id="services" class="py-5">
      <div class="container">
  
      <div class="row g-4">

  <div
   v-for="post in latestNews"

    :key="post.slug"
    class="col-md-4"
  >

    <router-link
      :to="`/newsletter/${post.slug}`"
      class="text-decoration-none"
    >

      <div class="article-card p-3 h-100 d-flex flex-column">

        <div class="position-relative mb-3">

          <div class="newsletter-badge">
            Newsletter
          </div>

          <img
            :src="post.coverphoto"
            class="img-fluid rounded w-100"
            :alt="post.title"
            style="height: 220px; object-fit: cover;"
          >

        </div>

        <h6 class="mb-1 text-dark fw-bold">
          {{ post.title }}
        </h6>

        <small
          class="text-muted d-block mb-2"
          style="font-size: .7rem; text-transform: uppercase; letter-spacing: 1px;"
        >
          {{ post.date }}
        </small>

        <p
          class="text-muted mb-0"
          style="font-size: .75rem;"
        >
          {{ post.excerpt }}
        </p>

        <div
          class="newsletter-author d-flex align-items-center mt-auto pt-4"
        >
<div class="author-img">
  <img
    :src="post.authorImage"
    :alt="post.author"
    class="author-photo"
  >
</div>

          <small
            class="text-muted mb-0 ps-2"
            style="font-size: .75rem;"
          >
            {{ post.author }}
          </small>
        </div>

      </div>

    </router-link>

  </div>

</div>

      

      </div>
    </section>
    <!--
    <section>
    <div class="container text-center py-5">
      <h2>Would you like to support our ministry?</h2>
      <h7>You may also scan our Bank Qr code for a simple and secure way to give.</h7>
      <p>
      <button class="btn btn-primary" @click="showGiveModal = true">
        Please click here
      </button>
      </p>
    </div>
    </section>
  -->
    <div v-if="showGiveModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);" @click.self="showGiveModal = false">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <button type="button" class="btn-close" @click="showGiveModal = false"></button>
          </div>
          <div class="modal-body text-center py-4">
            <div class="d-flex justify-content-center">
              <img src="/giveqr.jpeg" alt="Give QR Code" class="img-fluid" style="max-width: 400px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            </div>
            <div class="mt-4">
              <a href="/giveqr.jpeg" download="GCBF-Give-QR.jpeg" class="btn btn-primary">
                <i class="bi bi-download me-2"></i>
                Download QR Code
              </a>
            </div>
            <p class="text-muted mt-4 mb-0">
              <i class="bi bi-heart-fill me-2 text-danger"></i>
              We sincerely appreciate your generous donation and partnership in God’s work. 
              <br>Thank you for blessing our ministry with your generosity.
            </p>
          </div>
        </div>
      </div>
    </div>

   
  <section class="bg-light pt-2 pb-0">
      <div id="location" class="container-fluid mt-5 pt-5 px-0 pb-0 mb-0">
        <div class="container mb-4">
          <div class="text-center mb-4">
            <h2 class="display-6 fw-bold church-purple" style="font-size: 2rem;">
              <i class="bi bi-geo-alt-fill me-2"></i> Visit Us
            </h2>
            <p class="lead text-muted" style="font-size: 1rem;">
              AMK Bldg. General Luna St, Iloilo City Proper, Iloilo City, Iloilo
            </p>
          </div>
       

          </div>
      
        <div class="map-container shadow-lg position-relative">
         
          <iframe 
            src="https://www.google.com/maps?q=Graced+Community+Bible+Fellowship,Iloilo,Philippines&output=embed"
            style="border:0; width: 100%; height: 450px;"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
    </section>



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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated } from '../utils/auth'
import { newsletter } from '@/data/newsletter'



const router = useRouter()
const showGiveModal = ref(false)


const isAuth = computed(() => isAuthenticated())


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
const latestNews = computed(() => newsletter.slice(0, 3))



const scrollToServices = () => {
  document.getElementById('services').scrollIntoView({ behavior: 'smooth' })
}

const scrollToLocation = () => {
  document.getElementById('location').scrollIntoView({ behavior: 'smooth' })
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
  color: #9A3F3F !important;
  
  
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

.newsletter-item {
  display: flex;
  padding: 16px;
  border: 2px solid #eee;
  border-radius: 10px;
  background: #fff;
  transition: 0.2s ease;
}

.newsletter-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

/* Image */
.newsletter-image img {
  width: 400px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

/* Author image */
.author-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;

  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

.author-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Ensures author stays at bottom */
.newsletter-content {
  flex-grow: 1;
}

/* Mobile */
@media (max-width: 576px) {
  .newsletter-item {
    flex-direction: column;
  }

  .newsletter-image img {
    width: 100%;
    height: auto;
  }

  .newsletter-author {
    margin-bottom: 0;
  }
}

.article-card {
  border: 1px solid #dbdbdb;
  border-radius: 12px;
  transition: 0.2s ease;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}

.message-card {
 border: 1px solid #eee;
  border-radius: 12px;
  transition: 0.2s ease;
}

.message-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}

.author-img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.newsletter-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #537D5D;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

</style>