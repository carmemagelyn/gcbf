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

const showNavbar = computed(() => 
  route.name !== 'AdminLogin'
)

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
  padding-top: 80px; /* Account for fixed navbar */
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
</style>
