<script setup>
import { ref } from 'vue'

const navbarOpen = ref(false)

const closeNavbar = () => {
  const navbar = document.getElementById('navbarNav')

  if (navbar.classList.contains('show')) {
    navbar.classList.remove('show')
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-church-purple fixed-top shadow">
    <div class="container">

      <!-- Logo -->
      <router-link
        class="navbar-brand fw-bold d-flex align-items-center"
        to="/"
      >
        <img
          src="../assets/logo.png"
          alt="GCBF Logo"
          class="navbar-logo"
        >
      </router-link>

      <!-- Mobile Toggle -->
      <button
        class="navbar-toggler border-0 shadow-none"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar -->
      <div
        class="collapse navbar-collapse"
        id="navbarNav"
      >
        <ul class="navbar-nav ms-auto">

          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/newsletter"
              active-class="active"
              @click="closeNavbar"
            >
              Newsletters
            </router-link>
          </li>

        </ul>
      </div>

    </div>
  </nav>
</template>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
}

.navbar-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

/* NAV LINK */
.nav-link {
  color: rgba(255, 255, 255, 0.88);
  font-weight: 600;
  font-size: 0.96rem;
  letter-spacing: 0.3px;
  transition: all 0.25s ease;
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
}

/* Hover */
.nav-link:hover {
  color: #FBF9D1;
  background-color: rgba(255, 255, 255, 0.08);
}

/* Active */
.nav-link.active {
  color: #FBF9D1;
  background-color: rgba(251, 249, 209, 0.08);
}

/* Toggle button */
.navbar-toggler {
  padding: 4px 8px;
}

/* MOBILE */
@media (max-width: 991px) {

  .navbar-collapse {
    background: #537D5D;
    padding: 1rem;
    border-radius: 14px;
    margin-top: 1rem;
  }

 

  .nav-link {
    font-size: 1rem;
    padding: 0.85rem 1rem;
  }
}
</style>