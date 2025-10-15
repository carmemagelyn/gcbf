<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-church-purple fixed-top shadow">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">
        <i class="bi bi-church me-2"></i>
        GCBF
      </router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" active-class="active">Home</router-link>
          </li>
          <li v-if="user" class="nav-item">
            <router-link class="nav-link" to="/dashboard" active-class="active">Dashboard</router-link>
          </li>
          <li v-if="user" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              My Activities
            </a>
            <ul class="dropdown-menu">
              <li><router-link class="dropdown-item" to="/giving">Giving</router-link></li>
              <li><router-link class="dropdown-item" to="/bible-reading">Bible Reading</router-link></li>
              <li><router-link class="dropdown-item" to="/prayer-list">Prayer List</router-link></li>
            </ul>
          </li>
          <li v-if="user && user.userType === 'member'" class="nav-item">
            <router-link class="nav-link" to="/church-portal" active-class="active">Church Portal</router-link>
          </li>
        </ul>
        
        <ul class="navbar-nav">
          <li v-if="!user" class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li v-if="!user" class="nav-item">
            <router-link class="nav-link" to="/register">Register</router-link>
          </li>
          <li v-if="user" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <i class="bi bi-person-circle me-1"></i>
              {{ user.name }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><span class="dropdown-item-text">{{ user.email }}</span></li>
              <li><span class="dropdown-item-text small text-muted">{{ capitalizeFirst(user.userType) }}</span></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" @click.prevent="$emit('logout')">
                <i class="bi bi-box-arrow-right me-2"></i>Logout
              </a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  user: Object
})

defineEmits(['logout'])

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
}

.dropdown-item-text {
  font-size: 0.9rem;
}
</style>