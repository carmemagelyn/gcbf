<script setup>
import { ref, onMounted } from 'vue'

const showForm = ref(false)

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://link.msgsndr.com/js/form_embed.js'
  script.async = true
  document.body.appendChild(script)
})
</script>

<template>
  <div>
    <section class="program-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content-wrapper container text-white py-5">
        <div class="hero-content">
          <span class="hero-eyebrow">Study God's Word at Your Own Pace</span>
          <h1 class="hero-title">Bible Correspondence Program</h1>
          <p class="hero-description">
            Grow in your knowledge of God's Word through the <b>Diploma in Bible Program</b> offered by Graced Community Bible Fellowship in partnership with <b>Open Bible College International.</b> </p>
             <p class="hero-description">Graced Community Bible Fellowship is an independent ministry that administers this correspondence program using OBCI course materials with permission from <i>Dr. Dave Reese.</i>

          </p>
          <p class="hero-description">
            Study online through our Learning Management System (LMS), with access to lessons, assignments, and progress tracking anytime, anywhere.
          </p>
          <div class="hero-buttons mt-5">
            <button class="btn btn-primary me-3" @click="showForm = true">Register Now</button>
         
            <span><a class="btn btn-outline-light" href="https://bible-correspondence.gcbf.com.ph/home" target="_blank" rel="noopener noreferrer">Student Login</a></span>
          </div>
        </div>
        <div class="hero-logo">
          <img src="/assets/obci.jpg" alt="Open Bible College International" />
        </div>
      </div>
    </section>

    <div class="container py-3">
      <article class="program-page">
        <section class="program-intro mt-4 mb-4">
          <h2>Program Features</h2>
          
          <ul>
            <li>Online Bible lessons and assignments</li>
            <li>Flexible, self-paced learning</li>
            <li>Instructor support</li>
            <li>Diploma in Bible curriculum</li>
            <li>Access to the Bible Correspondence Portal</li>
          </ul>
        </section>

        <hr />
        <section class="program-intro mt-4 mb-4">
          <h2>Curriculum</h2>
          
          <ul>
            <li>Theology</li>
            <li>Christology</li>
            <li>Pneumatology</li>
            <li>Bibliology</li>
            <li>Anthropology</li>
            <li>Soteriology</li>
            <li>Ecclesiology</li>
            <li>Eschatology</li>
            <li>King James Bible</li>
            <li>Bible Interpretation</li>
            <li>Other Course Subjects*</li>

          </ul>
        </section>

        <hr />

        <section class="face-to-face mt-4 mb-4">
          <h2>Additional Face-to-Face Learning Sessions</h2>
          <p>
            Students who desire personal interaction and classroom discussion are welcome to attend our weekly learning sessions.
          </p>

          <h3>Schedule</h3>
          <p style="line-height: 1.5;color: #9A3F3F;">
            <strong>Every Tuesday</strong><br />
            <strong>6:30 PM – 8:00 PM</strong><br />
            <strong>Graced Community Bible Fellowship</strong>
          </p>
          All coursework is completed through the LMS. Attendance is optional.
        </section>

        <hr />
         <section class="program-intro mt-4 mb-4">
          <h2>For Inquiries</h2>
          <p>
            Please message us through our Facebook page:  <a href="https://www.facebook.com/gracedcommunitybiblefellowship" target="_blank" class="footer">
          <i class="bi bi-facebook"> Graced Community Bible Fellowship</i> 
        </a> 
          </p>
           

         
        </section>

        <hr />

        <section class="meet-the-team mt-5 mb-5">
          <h2>Meet the Team</h2>

          <div class="team-grid mt-2">
            <div class="team-member">
              <img class="team-avatar" src="/newsletter/author/sammy-tabuena.jpg" alt="Sammy Tabuena" />
              <h4>Sammy G. Tabuena</h4>
              <p style="font-style: italic; font-size: 0.9rem;">Transcription and Editorial Preparation
              <br>Senior Instructor
              <br>Senior Pastor, New Testament Baptist Church - Trapiche, Oton, Iloilo</p>
            </div>
            
          
            <div class="team-member">
              <img class="team-avatar" src="/newsletter/author/john-louie.jpg" alt="Pastor John Louie Berdejo" />
              <h4>John Louie Berdejo</h4>
              <p style="font-style: italic; font-size: 0.9rem;">Instructor
              <br>Pastor, Graced Community Bible Fellowship - Iloilo City</p>
            </div>


            
          </div>
        </section>
      </article>
    </div>

    <!-- Registration Form Modal -->
    <Teleport to="body" v-if="showForm">
      <div class="form-modal-overlay" @click="showForm = false">
        <div class="form-modal-content" @click.stop>
          <button class="form-close-btn" @click="showForm = false">&times;</button>
          <iframe
            src="https://api.leadconnectorhq.com/widget/form/iWf7oXyQbzM7UMMmIyIY"
            style="width:100%;height:100%;border:none;border-radius:4px"
            title="Lead Generation"
          >
          </iframe>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.program-hero {
  position: relative;
  background-image: url('/assets/program_hero.jpg');
  background-size: cover;
  background-position: center;
  min-height: 720px;
  display: flex;
  align-items: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.hero-content {
  position: relative;
  max-width: 90%;
  flex: 1;
}

.hero-content-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.hero-logo {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-logo img {
  max-width: 180px;
  height: auto;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

@media (max-width: 768px) {
  .hero-content-wrapper {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .hero-logo {
    justify-content: flex-start;
  }
  
  .hero-logo img {
    max-width: 140px;
  }
}

.hero-eyebrow {
  display: inline-block;
  margin-bottom: 1rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.85rem;
  color: #f8f9fa;
}

.hero-title {
  font-size: clamp(2.5rem, 4vw, 4rem);
  line-height: 1.05;
  margin-bottom: 1rem;
}

.hero-description {
  font-size: 1.05rem;
  max-width: 680px;
  margin-bottom: 1.75rem;
  color: #f1f3f5;
}

.hero-buttons .btn {
  min-width: 160px;
  margin-bottom: 1rem;
}

.hero-buttons .btn-outline-light {
  border-color: rgba(255, 255, 255, 0.9);
  color: #fff;
}

.hero-buttons .btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.program-page h2,
.program-page h3 {
  margin-top: 0;
}

.program-page ul {
  list-style: disc;
  padding-left: 1.25rem;
}

.program-page ul li {
  margin-bottom: 0.6rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.team-member {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.team-member h3 {
  margin-bottom: 0.75rem;
}

.team-member p {
  margin-bottom: 0.5rem;
  color: #444;
}

.team-avatar {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 1rem;
  margin-bottom: 1rem;
  display: block;
}

@media (max-width: 992px) {
  .team-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .team-grid {
    grid-template-columns: 1fr;
  }
}

.form-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  overflow-y: auto;
  padding: 2rem 0;
}

.form-modal-content {
  position: relative;
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  z-index: 10;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-close-btn:hover {
  color: #000;
}
</style>
