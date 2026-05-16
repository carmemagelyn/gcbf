<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { isAuthenticated, getCurrentUser, logout, initializeDemoUsers } from './utils/auth'
import Navbar from './components/Navbar.vue'

const router = useRouter()
const route = useRoute()

// Use ref to force reactivity when user logs in/out
const userRef = ref(getCurrentUser())
const user = computed(() => userRef.value)

// Show navbar on all pages now that admin login is removed
const showNavbar = computed(() => true)

// Initialize demo users on mount
onMounted(() => {
  initializeDemoUsers()
  // Update user ref on mount
  userRef.value = getCurrentUser()
})

const handleLogout = () => {
  logout()
  userRef.value = null
  router.push('/')
}

const handleLogin = (loggedInUser) => {
  // Update the user ref to trigger reactivity
  userRef.value = loggedInUser
  console.log('User logged in:', loggedInUser)
}
</script>

<template>
  <div id="app">
    <Navbar v-if="showNavbar" :user="user" @logout="handleLogout" @login="handleLogin" />
    <main>
      <router-view />
    </main>
  </div>

   <footer class="text-white py-4 pb-4" style="background-color: #537D5D; margin-top: 0;">
  
      <div class="text-center">
        <p>
          &copy; 2026 Graced Community Bible Fellowship. All rights reserved.
        </p>
        <span class="text-white" style="font-size: 1rem; opacity: 0.85;">WAYS TO FOLLOW</span>
        <br>
        <a href="https://www.facebook.com/gracedcommunitybiblefellowship" target="_blank" class="footer">
          <i class="bi bi-facebook">&nbsp;&nbsp;</i> 
        </a> 
        <a href="https://www.youtube.com/@GracedCommunityBibleFellowship" target="_blank" class="footer">
          <i class="bi bi-youtube">&nbsp;&nbsp;</i> 
        </a>
        <a href="https://www.instagram.com/gracedcommunitybiblefellowship/" target="_blank" class="footer">
          <i class="bi bi-instagram">&nbsp;&nbsp;</i> 
        </a>
      </div>
    
    </footer>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Montserrat', sans-serif;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f8f9fa;
}

#app {
  min-height: 100vh;
}

main {
  padding-top: 50px; /* Account for fixed navbar */
  margin-top: 0;
}

.btn-primary {
  background-color: #9A3F3F;
  border-color: #9A3F3F;
}

.btn-primary:hover {
  background-color: #FBF9D1;
  border-color: #FBF9D1;
  color: #333333;
}

.text-primary {
  color: #9A3F3F !important;
}

.navbar-toggler {
  color: #9A3F3F;
}

.navbar-toggler:focus {
  background-color: #9A3F3F;
}

footer a {
  color: #Ffff !important;
  text-decoration: none;
  font-size: 20px;
  padding: 0.3rem;
}

footer a:hover {
  color: #fff988 !important;
  
  
}
</style>
