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
                  <i class="bi bi-clock me-1"></i>SERVICE SCHEDULE:
               
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
   <!--
    <section class="booklet-section py-5 bg-white">
   
      <div class="container-fluid d-flex flex-column align-items-center">
        <div class="booklet-title text-center mb-4">
          <h2 class="fw-bold mb-1">Jesus Christ Alone</h2>
          <p class="lead booklet-subtitle mb-1" style="font-size: .8rem;">CAN SAVE AND SATISFY YOUR SOUL</p>
          <p class="booklet-description mb-0" style="font-size: .8rem;">Discover seven biblical truths about salvation and eternal life.</p>
        </div>
   
        
        <button class="btn btn-outline-primary btn-lg mb-0" @click="showBookletContent = !showBookletContent" style="text-decoration: none; color: inherit; font-size: .8rem;">
          Click here to read.
        </button>

        <div class="card booklet-card border-0 p-4 mt-5" style="max-width: 90%; width: 100%; border: none !important;" v-if="showBookletContent">
         
          <div class="booklet-content" :key="currentBookletPage">
            <div v-if="bookletPages[currentBookletPage].title" class="booklet-page-header d-flex flex-column flex-md-row align-items-start gap-4 mb-4">
              <div class="booklet-page-number display-1 fw-bold text-dark">{{ bookletPages[currentBookletPage].pageNumber }}</div>
              <div>
                <h3 class="booklet-page-title text-uppercase fw-bold mb-2">{{ bookletPages[currentBookletPage].title }}</h3>
                <p class="booklet-page-subtitle mb-0">{{ bookletPages[currentBookletPage].subtitle }}</p>
              </div>
            </div>

            <div v-for="(paragraph, index) in bookletPages[currentBookletPage].paragraphs" :key="index" class="mb-3 text-muted booklet-paragraph" v-html="paragraph"></div>
          </div>

          <div class="d-flex flex-column align-items-center pt-3 mt-3 gap-3">
            <div class="text-muted">
              Page {{ currentBookletPage + 1 }} of {{ bookletPages.length }}
            </div>
            <div class="d-flex gap-3">
              <button class="btn btn-outline-secondary booklet-nav-btn" @click="showPreviousBookletPage">
                ←
              </button>
              <button class="btn btn-outline-primary booklet-nav-btn" @click="showNextBookletPage">
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
   -->
  
    <section id="services" class="py-5">
  <div class="container">

    <!-- FEATURED POST -->
    <!-- FEATURED POST -->
<div class="row g-4 mb-5">

  <div
    v-for="post in latestNews.slice(0, 1)"
    :key="post.slug"
    class="col-12"
  >

    <router-link
      :to="`${post.type === 'article'
        ? '/articles'
        : post.type === 'message'
          ? '/messages'
          : '/newsletter'
      }/${post.slug}`"
      class="text-decoration-none"
    >

      <div class="article-card featured-card p-3 overflow-hidden">

        <div class="row align-items-center g-4">

          <!-- IMAGE -->
          <div class="col-lg-7">

            <div class="position-relative">

              <div
                :class="
                  post.type === 'message'
                    ? 'message-badge'
                    : post.type === 'article'
                      ? 'article-badge'
                      : 'newsletter-badge'
                "
                style="font-size: .95rem; padding: 10px 20px;"
              >
                {{
                  post.type === 'message'
                    ? 'Message'
                    : post.type === 'article'
                      ? 'Article'
                      : 'Newsletter'
                }}
              </div>

              <img
                :src="post.coverphoto"
                class="img-fluid rounded w-100 featured-image"
                :alt="post.title"
              >

            </div>

          </div>

          <!-- CONTENT -->
          <div class="col-lg-5">

            <small
              class="text-muted d-block mb-3"
              style="font-size: .75rem; text-transform: uppercase; letter-spacing: 1px;"
            >
              {{ post.date }}
            </small>

            <h2
              class="text-dark fw-bold mb-3"
              style="line-height: 1.2;"
            >
              {{ post.title }}
            </h2>

            <p
              class="text-muted mb-4"
              style="font-size: .95rem; line-height: 1.8;"
            >
              {{ post.excerpt }}
            </p>

            <div class="newsletter-author d-flex align-items-center">

              <div class="author-img">
                <img
                  :src="post.authorImage"
                  :alt="post.author"
                  class="author-photo"
                >
              </div>

              <small
                class="text-muted mb-0 ps-2"
                style="font-size: .85rem;"
              >
                {{ post.author }}
              </small>

            </div>

          </div>

        </div>

      </div>

    </router-link>

  </div>

</div>

    <!-- SECOND ROW -->
    <div class="row g-4 mb-4">

      <div
        v-for="post in latestNews.slice(1, 3)"
        :key="post.slug"
        class="col-12 col-md-6"
      >

        <router-link
          :to="`${post.type === 'article'
            ? '/articles'
            : post.type === 'message'
              ? '/messages'
              : '/newsletter'
          }/${post.slug}`"
          class="text-decoration-none"
        >

          <div class="article-card p-3 h-100 d-flex flex-column">

            <div class="position-relative mb-3">

              <div
                :class="
                  post.type === 'message'
                    ? 'message-badge'
                    : post.type === 'article'
                      ? 'article-badge'
                      : 'newsletter-badge'
                "
              >
                {{
                  post.type === 'message'
                    ? 'Message'
                    : post.type === 'article'
                      ? 'Article'
                      : 'Newsletter'
                }}
              </div>

              <img
                :src="post.coverphoto"
                class="img-fluid rounded w-100"
                :alt="post.title"
                style="height: 300px; object-fit: cover;"
              >

            </div>

            <small
              class="text-muted d-block mb-2"
              style="font-size: .7rem; text-transform: uppercase; letter-spacing: 1px;"
            >
              {{ post.date }}
            </small>

            <h5 class="mb-2 text-dark fw-bold">
              {{ post.title }}
            </h5>

            <p
              class="text-muted mb-0"
              style="font-size: .8rem;"
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
                style="font-size: .8rem;"
              >
                {{ post.author }}
              </small>
            </div>

          </div>

        </router-link>

      </div>

    </div>

    <!-- THIRD ROW -->
    <div class="row g-4">

      <div
        v-for="post in latestNews.slice(3, 7)"
        :key="post.slug"
        class="col-12 col-sm-6 col-md-3"
      >

        <router-link
          :to="`${post.type === 'article'
            ? '/articles'
            : post.type === 'message'
              ? '/messages'
              : '/newsletter'
          }/${post.slug}`"
          class="text-decoration-none"
        >

          <div class="article-card p-3 h-100 d-flex flex-column">

            <div class="position-relative mb-3">

              <div
                :class="
                  post.type === 'message'
                    ? 'message-badge'
                    : post.type === 'article'
                      ? 'article-badge'
                      : 'newsletter-badge'
                "
              >
                {{
                  post.type === 'message'
                    ? 'Message'
                    : post.type === 'article'
                      ? 'Article'
                      : 'Newsletter'
                }}
              </div>

              <img
                :src="post.coverphoto"
                class="img-fluid rounded w-100"
                :alt="post.title"
                style="height: 220px; object-fit: cover;"
              >

            </div>

            <small
              class="text-muted d-block mb-2"
              style="font-size: .7rem; text-transform: uppercase; letter-spacing: 1px;"
            >
              {{ post.date }}
            </small>

            <h6 class="mb-2 text-dark fw-bold">
              {{ post.title }}
            </h6>

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
    
    
 
    

   
  <section class="bg-light pb-0">
      <div id="location" class="container-fluid pt-5 px-0 pb-0 mb-0">
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
    <section >
    <div class="container text-center pt-5 pb-5">
      <p class="display-6 fw-medium black" style="font-size: 1.5rem;">
        Would you like to support the ministry through your giving?
      </p>
      <p class="lead text-muted" style="font-size: .8rem;">Your generosity helps us continue sharing God's Word, supporting church ministries, discipleship programs, outreach efforts, and community services.</p>
      <p>
      <button class="btn btn-outline-secondary" @click="showBPIModal = true">
        View BPI Account      
      </button>
      
      &nbsp;&nbsp;&nbsp;&nbsp;
      <span>
        <button class="btn btn-outline-third" @click="showGCashModal = true">
        View GCash Details
      </button>
      </span>
   
      </p>
    </div>
    </section>


<div v-if="showBPIModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);" @click.self="showBPIModal = false">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <button type="button" class="btn-close" @click="showBPIModal = false"></button>
          </div>
          <div class="modal-body text-center py-4">
            <div class="d-flex justify-content-center">
              <img src="/bpi.jpeg" alt="Give QR Code" class="img-fluid" style="max-width: 400px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            </div>
            <p class="lead text-muted mb-0" style="font-size: 0.5rem;">
              This BPI Checking Account is exclusively for Grace Community Bible Fellowship church finances.
             <br>Please add note: <b>GCBF GIVE (your name)</b> when sending your donation to help us identify and allocate your contribution properly.
            
            </p>
            <div class="mt-4">
              <a href="/bpi.jpeg" download="GCBF-BPI-QR.jpeg" class="btn btn-primary">
                <i class="bi bi-download me-2"></i>
                Download QR Code
              </a>
            </div>
            <p class="lead text-muted mt-4 mb-0" style="font-size: 0.6rem;">
              For donation receipts or inquiries, please contact us at
      <a href="https://www.facebook.com/gracedcommunitybiblefellowship">
        GCBF Facebook
      </a>page
      </p>
      <p class="lead text-muted mt-2 mb-0" style="font-size: 0.6rem;">
              <i class="bi bi-heart-fill me-2 text-danger"></i>
              Thank you for partnering with us in advancing God's work. 
              <br>May the Lord bless you abundantly for your faithfulness and generosity.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showGCashModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);" @click.self="showGCashModal = false">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <button type="button" class="btn-close" @click="showGCashModal = false"></button>
          </div>
          <div class="modal-body text-center py-4">
            <div class="d-flex justify-content-center">
              <img src="/gcash.png" alt="Give QR Code" class="img-fluid" style="max-width: 400px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            </div>
            <p class="lead text-muted mb-0" style="font-size: 0.5rem;">
              This is another option for those who prefer using GCash for their donations to Grace Community Bible Fellowship.
              <br>Please add note: <b>GCBF GIVE (your name)</b> when sending your donation to help us identify and allocate your contribution properly.
            </p>
            <div class="mt-4">
              <a href="/gcash.png" download="GCBF-GCash-QR.jpeg" class="btn btn-primary">
                <i class="bi bi-download me-2"></i>
                Download QR Code
              </a>
            </div>
            <p class="lead text-muted mt-4 mb-0" style="font-size: 0.6rem;">
              For donation receipts or inquiries, please contact us at
      <a href="https://www.facebook.com/gracedcommunitybiblefellowship">
        GCBF Facebook
      </a>page
      </p>
      <p class="lead text-muted mt-2 mb-0" style="font-size: 0.6rem;">
              <i class="bi bi-heart-fill me-2 text-danger"></i>
              Thank you for partnering with us in advancing God's work. 
              <br>May the Lord bless you abundantly for your faithfulness and generosity.
            </p>
          </div>
        </div>
      </div>
    </div>
    
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
import { newsletter } from '@/data/category'



const router = useRouter()
const showBPIModal = ref(false)
const showGCashModal = ref(false)


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
/*
const bookletPages = [
  {
    pageNumber: 1,
    title: 'THE PERFECT GOD',
    subtitle: 'God is perfect, thus, He is worthy to be loved and obeyed above all',
    paragraphs: [
      '<strong>God is Perfect in All that He is</strong>',
      'And one cried unto another, and said, “Holy, holy, holy, is the Lord of hosts: the whole earth is full of his glory.” (Isaiah 6:3).',
      '<strong>God is Perfect in All that He Does</strong>',
      '“In the beginning God created the heaven and the earth” (Genesis 1:1).',
      '“And God saw everything that he had made, and, behold, it was very good. And the evening and the morning were the sixth day.” (Genesis 1:31).',
      '<strong>There is Only One Perfect God</strong>',
      '“I am the Lord, and there is none else, there is no God beside me: I girded thee, though thou hast not known me:” (Isaiah 45:5).',
      'Do you agree that God alone is worthy of worship?',
      ],
  },
  {
    pageNumber: 2,
    title: 'THE PURPOSE',
    subtitle: 'Man’s purpose is to love and obey God above all',
    paragraphs: [
      '<strong>Man is Created to Love God Above All</strong>',
      '“And thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind, and with all thy strength: this is the first commandment.” (Mark 12:30).',
      'To love God is to worship God. It involves knowing, desiring, enjoying, fearing, trusting, and valuing God above anyone and anything else (Psalms 73:25-26; Luke 14:26).',
      '<strong>Man is Created to Obey God Above All</strong>',
      '“Let us hear the conclusion of the whole matter: Fear God, and keep his commandments: for this is the whole duty of man.” (Ecclesiastes 12:13).',
      '<strong>Man is Required to Love and Obey God Perfectly</strong>',
      '“Be ye therefore perfect, even as your Father which is in heaven is perfect.” (Matthew 5:48).',
      'Is there anyone who perfectly loves and obeys God?',
    ],
  },
  {
    pageNumber: 3,
    title: 'THE PROBLEM',
    subtitle: 'All men have sinned by not loving and obeying God above all',
    paragraphs: [
      '<strong>Man Sinned By Not Loving God</strong>',
      '“And this is the condemnation, that light is come into the world, and men loved darkness rather than light, because their deeds were evil.” (John 3:19).',
      'Man is sinful by nature. He loves darkness rather than the light who is Jesus Christ (John 8:12). Darkness or sin is anything that is morally evil like cheating, lying, lustful thought. However, it is also anything that is morally good like money, education, work, friends, and family that you value more than God.',
      '<strong>Man Sinned By Not Obeying God</strong>',
      '“For all have sinned, and come short of the glory of God;” (Romans 3:23). “For whosoever shall keep the whole law, and yet offend in one point, he is guilty of all.” (James 2:10).',
      'If loving God is the greatest commandment, what is the greatest sin? Are you also guilty of committing the greatest sin? If all men are guilty, what does all men deserve then, reward or penalty?',
    ],
  },
  {
    pageNumber: 4,
    title: 'THE PENALTY',
    subtitle: "Eternal death in hell is the penalty for man's sin",
    paragraphs: [
      'Because God is holy and just, He demands punishment for sin. If God does not punish sin, it means He is not a good and righteous judge.',
      '<strong>The Penalty for Sin is Death</strong>',
      '“For the wages of sin is death...” (Romans 6:23).',
      '<strong>The Final Penalty for Sin is Eternal Suffering in Hell</strong>',
      '“If any man love not the Lord Jesus Christ, let him be Anathema Maranatha [be condemned in hell]” (1 Corinthians 16:22).',
      '“And fear not them which kill the body, but are not able to kill the soul: but rather fear him which is able to destroy both soul and body in hell.” (Matthew 10:28).',
      '“Where their worm dieth not, and the fire is not quenched.” (Mark 9:44).',
      'Because God is perfect, only perfect people can go to heaven and thus, escape Hell (Galatians 3:10; James 2:10; Revelation 21:27). Is this good news or bad news? Why? The fifth truth presents the good news.',
    ],
  },
  {
    pageNumber: 5,
    title: 'THE PROVISION',
    subtitle: 'Jesus Christ came to earth for man’s salvation',
    paragraphs: [
      'Jesus Christ alone can represent God to man and man to God for He alone is both God and man (1 Timothy 2:5; 1 John 5:20). Christ Himself said “I am the way, the truth, and the life: no man cometh unto the Father, but by me.” (John 14:6).',
      'There are three things that Jesus Christ did to provide salvation for man:',
      '<strong>Jesus Lived a Perfect Life for Man’s Perfection</strong>',
      '“For as by one man’s disobedience many were made sinners, so by the obedience of one shall many be made righteous.” (Romans 5:19).',
      '<strong>Jesus Died a Painful Death for Man’s Punishment</strong>',
      '“But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.” (Romans 5:8).',
      '<strong>Jesus Resurrected from the Dead for Man’s Salvation</strong>',
      '“Who was delivered for our offences, and was raised again for our justification. (Being perfect in the eyes of God)” (Romans 4:25).',
      '<div class="booklet-question-box mb-3"><p class="fw-bold mb-2">HOW DO YOU THINK MAN CAN BE SAVED FROM HELL<br>AND BE ACCEPTED BY GOD IN HEAVEN?</p><p class="mb-0">a. By doing good works&nbsp;&nbsp;c. By baptism<br>b. By church/religion&nbsp;&nbsp;d. By faith in Christ plus good works<br>e. _________</p></div>',
      'The only right answer to the question above is: By faith in Christ alone. It is so because Christ is the only Savior (Acts 4:12). Adding your good works to Christ means you do not fully trust Christ, especially on the sufficiency of His finished work of salvation. Christ’s coming down from heaven to earth would be useless if it is possible to gain salvation by doing good works. The Bible says “we are all like an unclean thing, and all our righteousness [good works] are as filthy rags” (Isaiah 64:6). Thus, obtaining salvation is only by faith in Christ alone.',
      '“For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.” (Ephesians 2:8-9).',
      'The next truth will further explain how a sinful man can be perfect in the eyes of God and receive the gifts of eternal salvation. Do you want to know how?',
    ],
  },
  {
    pageNumber: 6,
    title: 'THE PERSONAL RESPONSE',
    subtitle: 'You must repent and believe in Christ to be eternally saved',
    paragraphs: [
      '<strong>You Must Repent from Your Sins</strong>',
      '“Repent ye therefore, and be converted, that your sins may be blotted out, when the times of refreshing shall come from the presence of the Lord.” (Acts 3:19).',
      'True repentance is a change of mind and heart and a genuine decision to turn away from sin towards God (Acts 20:21). It is realizing that sin dishonors God, does not give lasting satisfaction, and its end is eternal separation from God in hell. It also involves forsaking anything you have added to Christ for your salvation, like good works.',
      '<strong>You Must Believe in Christ Alone</strong>',
      '“And they said, Believe on the Lord Jesus Christ, and thou shalt be saved, and thy house.” (Acts 16:31).',
      'True faith is trusting Christ alone, especially His finished work of salvation through His perfect life, sacrificial death and resurrection. True faith is also receiving Christ for who He is — God, Savior, Lord and Master. The primary goal of saving faith is reconciliation with God and intimacy with Him through love and obedience for life and eternity. Escaping hell and going to heaven are only secondary.',
    ],
  },
  {
    pageNumber: 7,
    title: 'PRIVILEGES FOR HAVING CHRIST’S PRESENCE AND PERFECTION',
    subtitle: 'God declares sinful man perfect and eternally saves him',
    paragraphs: [
      'Man Can be Perfect in the Eyes of God by Grace through Faith',
      'At the very moment a person repents and trusts in Christ alone for salvation he becomes instantly and permanently perfect in God’s eyes. This is on the basis of Christ’s perfection counted as his. The Bible says, “But to him that worketh not, but believeth on him that justifieth the ungodly, his faith is counted for righteousness.” (Romans 4:5).',
      'A Thief who Became Perfect in the Eyes of God',
      'During the crucifixion of Jesus Christ, one of the thieves was saved. He repented from his sin and believed on Christ. Right there and then, Jesus granted forgiveness and eternal life to the thief. Christ said to him, “To day shalt thou be with me in paradise” (Luke 23:43). The thief was accepted by the Holy God in heaven. Why? It is so because at that very moment the thief genuinely repented and fully trusted Christ to save him, he then became perfect in the eyes of God. How? The death of Christ erased all his sins, and the perfection of Christ was counted as his.',
      'Do you understand how the thief became perfect in the eyes of God? How?',
      'Having the presence and the perfection of Jesus Christ does not only make a sinful man perfect in the eyes of God, but it also results in many other wonderful eternal privileges such as:',
      '<strong>1. Forgiveness of all sins — past, present and future</strong> (Romans 4:5-8; Col 2:13).',
      '<strong>2. Eternal reconciliation with God</strong> (Romans 5:9-11).',
      '<strong>3. Being a child of God for life and eternity</strong> (John 1:12; Romans 8:16-17).',
      '<strong>4. Sure salvation from the punishment of sin in hell</strong> (Romans 5:9; 8:1; John 5:24).',
      '<strong>5. Having eternal life now and forever</strong> (1 John 5:11-13; John 3:16, 36; 10:28-29).',
      '<strong>6. Having the permanent presence of Jesus Christ in one’s life</strong> (Hebrews 13:5).',
      '<strong>7. Having real satisfaction through glorifying God by loving and obeying Him above all</strong> (Psalm 16:11; John 6:35; Romans 5:11; Mark 12:30).',
      'Christian life is not easy. It involves sacrifices. However, it is worth it for there is nothing in this world more wonderful and satisfying than having Christ and loving Him above all. This is why Christ said, “I am come that they might have life, and that they might have it more abundantly” (John 10:10).',
      'In God’s presence is fullness of joy and pleasures forevermore (Psalm 16:11).',
      'Do you understand how the thief became perfect in the eyes of God? How?',
    ],
  },
  {
    pageNumber: 10,
    paragraphs: [
      'Answer the following questions in your mind: Have you already experienced the wonderful privileges of salvation? Are you sure you are going to heaven and not to hell? Do you already have the presence and perfection of Christ? Have you genuinely repented from your sin and put your trust on Christ alone for your salvation?',
      'If you are already saved, praise the Lord! Keep valuing and following Him until the end. However, if the Holy Spirit is convicting your heart right now that you are not yet saved, repent and believe in Him, for behold now is the day of salvation (2 Corinthians 6:2). Admit you are a sinner, deserving of eternal death in hell. Admit you are helpless to save yourself. Then, humbly come to Christ. Ask Him to forgive you and reconcile you to God. Also ask Him to rule your life to make you a person who loves and obeys the Lord Jesus Christ. Then claim God’s promise that “For whosoever calls upon the name of the Lord shall be saved” (Romans 10:13). Talk to God in prayer right now in response to the truths He has revealed to you.',
      '<div class="booklet-footer-box"><p class="mb-3">Thank you for your time in hearing the Good News of salvation through this booklet. May you continue to give importance to the Word of God as Christ Himself said, “Man shall not live by bread alone, but by every word that proceeds from the mouth of God.”</p><p class="mb-0">We offer more lessons from the Bible to help you know and love God more. Would you like to meet again for follow up bible study?</p></div>',
      'You can contact us at our Facebook page: <a href="https://www.facebook.com/gracedcommunitybiblefellowship" target="_blank" rel="noopener noreferrer">facebook.com/gracedcommunitybiblefellowship</a>.'
    ],
  },
]
const currentBookletPage = ref(0)
const bookletDirection = ref('next')
const showBookletContent = ref(false)
const pageTurnClass = computed(() => `page-turn-${bookletDirection.value}`)

const showNextBookletPage = () => {
  bookletDirection.value = 'next'
  currentBookletPage.value = (currentBookletPage.value + 1) % bookletPages.length
}

const showPreviousBookletPage = () => {
  bookletDirection.value = 'prev'
  currentBookletPage.value = (currentBookletPage.value - 1 + bookletPages.length) % bookletPages.length
}
*/

const latestNews = computed(() => newsletter.slice(0, 12))



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

.booklet-card {
  background: #ffffff;
  border-radius: 18px;
  min-height: 360px;
  border: none !important;
  box-shadow: none !important;
}

.booklet-title h3 {
  font-size: 1.5rem;
  letter-spacing: 0.02em;
  margin-bottom: 0.35rem;
}

.booklet-expand-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.booklet-expand-btn:hover {
  color: #28a745 !important;
}

.booklet-page-header {
  padding-bottom: 0.75rem;
}

.booklet-page-number {
  font-size: 3.5rem;
  line-height: 1;
}

.booklet-page-title {
  font-size: 1.55rem;
  color: #1f1f1f;
}

.booklet-page-subtitle {
  font-size: 0.92rem;
  color: #3a3a3a;
}

.booklet-subtitle,
.booklet-description {
  color: #333333;
}

.newsletter-author .text-muted,
.newsletter-author .author-name {
  color: #202020 !important;
}

.booklet-paragraph {
  color: #4b4b4b;
  font-size: 0.92rem;
  line-height: 1.6;
  margin-bottom: 0.9rem;
}

.booklet-paragraph strong {
  display: block;
  font-weight: 700;
  color: #202020;
  margin-bottom: 0.25rem;
}

.booklet-question-box {
  border: 2px solid #202020;
  padding: 1rem 1.1rem;
  background: #f8f7f2;
  color: #202020;
  border-radius: 0.75rem;
}

.booklet-question-box p {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.booklet-question-box .fw-bold {
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.booklet-footer-box {
  margin-top: 1.5rem;
  border: 1px solid #202020;
  padding: 1rem 1.1rem;
  
  border-radius: 0.75rem;
}

.booklet-footer-box p {
  margin-bottom: 0.75rem;
  color: #333;
  font-size: 0.95rem;
}

.booklet-nav-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.booklet-section .badge {
  background: #9a3f3f;
}

.page-turn-next-enter-active,
.page-turn-prev-enter-active,
.page-turn-next-leave-active,
.page-turn-prev-leave-active {
  transition: transform 0.45s ease, opacity 0.45s ease;
}

.page-turn-next-enter-from {
  opacity: 0;
  transform: perspective(1000px) rotateY(25deg) translateX(20px);
}

.page-turn-next-enter-to {
  opacity: 1;
  transform: perspective(1000px) rotateY(0deg) translateX(0);
}

.page-turn-next-leave-from {
  opacity: 1;
  transform: perspective(1000px) rotateY(0deg) translateX(0);
}

.page-turn-next-leave-to {
  opacity: 0;
  transform: perspective(1000px) rotateY(-25deg) translateX(-20px);
}

.page-turn-prev-enter-from {
  opacity: 0;
  transform: perspective(1000px) rotateY(-25deg) translateX(-20px);
}

.page-turn-prev-enter-to {
  opacity: 1;
  transform: perspective(1000px) rotateY(0deg) translateX(0);
}

.page-turn-prev-leave-from {
  opacity: 1;
  transform: perspective(1000px) rotateY(0deg) translateX(0);
}

.page-turn-prev-leave-to {
  opacity: 0;
  transform: perspective(1000px) rotateY(25deg) translateX(20px);
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
  border: 0px solid #dbdbdb;
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
  background: rgba(83, 125, 93, 0.8);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.message-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(138, 53, 53, 0.8);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.article-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgb(156, 154, 154,.8);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.featured-image {
  height: 500px;
  object-fit: cover;
  transition: transform .4s ease;
}

.featured-card:hover .featured-image {
  transform: scale(1.02);
}

.featured-card h2 {
  font-size: 2.2rem;
}

@media (max-width: 992px) {
  .featured-image {
    height: 320px;
  }

  .featured-card h2 {
    font-size: 1.5rem;
  }
}
</style>