<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { isAuthenticated, getCurrentUser, logout, initializeDemoUsers } from './utils/auth'
import Navbar from './components/Navbar.vue'

const router = useRouter()
const route = useRoute()

const user = computed(() => getCurrentUser())
const showNavbar = computed(() => 
  route.name !== 'Login' && 
  route.name !== 'Register' && 
  route.name !== 'AdminLogin'
)

// Initialize demo users on mount
onMounted(() => {
  initializeDemoUsers()
})

const handleLogout = () => {
  logout()
  router.push('/')
}

const handleLogin = (loggedInUser) => {
  // The user state will automatically update via the computed property
  // No need to do anything here as auth.js handles localStorage
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
