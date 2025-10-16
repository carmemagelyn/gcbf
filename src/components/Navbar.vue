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
          <li v-if="!user" class="nav-item">
            <a class="nav-link" href="#" @click.prevent="showGiveModal = true">
              <i class="bi bi-heart me-1"></i>Give
            </a>
          </li>
        </ul>
        
        <ul class="navbar-nav">
          <li v-if="!user" class="nav-item">
            <a class="nav-link" href="#" @click.prevent="showAuthModal = true">
              <i class="bi bi-person-circle" style="font-size: 1.5rem;"></i>
            </a>
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

    <!-- Auth Selection Modal -->
    <div v-if="showAuthModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);" @click.self="showAuthModal = false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">Welcome to GCBF</h5>
            <button type="button" class="btn-close" @click="showAuthModal = false"></button>
          </div>
          <div class="modal-body text-center py-4">
            <i class="bi bi-person-circle display-1 church-purple mb-4"></i>
            <p class="text-muted mb-4">Please choose an option to continue</p>
            <div class="d-grid gap-3">
              <button @click="openLoginModal" class="btn btn-primary btn-lg">
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Login
              </button>
              <button @click="openRegisterModal" class="btn btn-outline-primary btn-lg">
                <i class="bi bi-person-plus me-2"></i>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <div v-if="showLoginModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);" @click.self="showLoginModal = false">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">Sign In</h5>
            <button type="button" class="btn-close" @click="showLoginModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="loginEmail" class="form-label">Email Address</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    class="form-control"
                    id="loginEmail"
                    v-model="loginForm.email"
                    required
                    placeholder="Enter your email"
                  >
                </div>
              </div>

              <div class="mb-3">
                <label for="loginPassword" class="form-label">Password</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input
                    :type="showLoginPassword ? 'text' : 'password'"
                    class="form-control"
                    id="loginPassword"
                    v-model="loginForm.password"
                    required
                    placeholder="Enter your password"
                  >
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    @click="showLoginPassword = !showLoginPassword"
                  >
                    <i :class="showLoginPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <div v-if="loginError" class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ loginError }}
              </div>

              <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loginLoading">
                <span v-if="loginLoading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                {{ loginLoading ? 'Signing In...' : 'Sign In' }}
              </button>

              <div class="text-center">
                <p class="mb-0">
                  Don't have an account? 
                  <a href="#" @click.prevent="switchToRegister" class="text-decoration-none">Sign up here</a>
                </p>
              </div>
            </form>

            <!-- Demo Credentials -->
            <div class="mt-4 p-3 bg-light rounded">
              <h6 class="fw-bold mb-2">Demo Credentials:</h6>
              <div class="demo-creds">
                <small class="d-block mb-1"><strong>Member:</strong> john.doe@email.com / password123</small>
                <small class="d-block mb-1"><strong>Visitor:</strong> jane.smith@email.com / password123</small>
                <small class="d-block"><strong>Pastor:</strong> pastor@gcbf.org / admin123</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Register Modal -->
    <div v-if="showRegisterModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);" @click.self="showRegisterModal = false">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">Create Account</h5>
            <button type="button" class="btn-close" @click="showRegisterModal = false"></button>
          </div>
          <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
            <form @submit.prevent="handleRegister">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="firstName" class="form-label">First Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="firstName"
                    v-model="registerForm.firstName"
                    required
                    placeholder="Enter your first name"
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="lastName" class="form-label">Last Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="lastName"
                    v-model="registerForm.lastName"
                    required
                    placeholder="Enter your last name"
                  >
                </div>
              </div>

              <div class="mb-3">
                <label for="registerEmail" class="form-label">Email Address</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    class="form-control"
                    id="registerEmail"
                    v-model="registerForm.email"
                    required
                    placeholder="Enter your email"
                  >
                </div>
              </div>

              <div class="mb-3">
                <label for="phone" class="form-label">Phone Number</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-telephone"></i>
                  </span>
                  <input
                    type="tel"
                    class="form-control"
                    id="phone"
                    v-model="registerForm.phone"
                    required
                    placeholder="Enter your phone number"
                  >
                </div>
              </div>

              <div class="mb-3">
                <label for="registerPassword" class="form-label">Password</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input
                    :type="showRegisterPassword ? 'text' : 'password'"
                    class="form-control"
                    id="registerPassword"
                    v-model="registerForm.password"
                    required
                    placeholder="Create a password"
                    minlength="6"
                  >
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    @click="showRegisterPassword = !showRegisterPassword"
                  >
                    <i :class="showRegisterPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div class="form-text">Password must be at least 6 characters long.</div>
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-lock-fill"></i>
                  </span>
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control"
                    id="confirmPassword"
                    v-model="registerForm.confirmPassword"
                    required
                    placeholder="Confirm your password"
                  >
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="mb-3">
                <label for="userType" class="form-label">I am a</label>
                <select
                  class="form-select"
                  id="userType"
                  v-model="registerForm.userType"
                  required
                >
                  <option value="">Choose...</option>
                  <option value="member">Member</option>
                  <option value="visitor">First-time Visitor</option>
                </select>
              </div>

              <div v-if="registerError" class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ registerError }}
              </div>

              <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="registerLoading">
                <span v-if="registerLoading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-person-plus me-2"></i>
                {{ registerLoading ? 'Creating Account...' : 'Create Account' }}
              </button>

              <div class="text-center">
                <p class="mb-0">
                  Already have an account? 
                  <a href="#" @click.prevent="switchToLogin" class="text-decoration-none">Sign in here</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Give Modal -->
    <div v-if="showGiveModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);" @click.self="showGiveModal = false">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-heart-fill me-2 text-danger"></i>
              Support Our Ministry
            </h5>
            <button type="button" class="btn-close" @click="showGiveModal = false"></button>
          </div>
          <div class="modal-body text-center py-4">
            <p class="lead text-muted mb-4">Scan the QR code below to give your offering</p>
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
              <i class="bi bi-info-circle me-2"></i>
              Thank you for blessing our ministry with your generosity.
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, register } from '../utils/auth'

const props = defineProps({
  user: Object
})

const emit = defineEmits(['logout', 'login'])
const router = useRouter()

const showAuthModal = ref(false)
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const showGiveModal = ref(false)

// Login form
const loginForm = ref({
  email: '',
  password: ''
})
const showLoginPassword = ref(false)
const loginLoading = ref(false)
const loginError = ref('')

// Register form
const registerForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  userType: ''
})
const showRegisterPassword = ref(false)
const showConfirmPassword = ref(false)
const registerLoading = ref(false)
const registerError = ref('')

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const openLoginModal = () => {
  showAuthModal.value = false
  showLoginModal.value = true
}

const openRegisterModal = () => {
  showAuthModal.value = false
  showRegisterModal.value = true
}

const switchToRegister = () => {
  showLoginModal.value = false
  showRegisterModal.value = true
}

const switchToLogin = () => {
  showRegisterModal.value = false
  showLoginModal.value = true
}

const handleLogin = async () => {
  loginError.value = ''
  loginLoading.value = true

  try {
    const user = await login(loginForm.value.email, loginForm.value.password)
    
    if (user) {
      emit('login', user)
      showLoginModal.value = false
      
      // Reset form
      loginForm.value = { email: '', password: '' }
      
      // Redirect based on user type
      if (user.userType === 'pastor' || user.userType === 'admin') {
        router.push('/dashboard')
      } else {
        router.push('/dashboard')
      }
    } else {
      loginError.value = 'Invalid email or password'
    }
  } catch (error) {
    loginError.value = error.message || 'An error occurred during login'
  } finally {
    loginLoading.value = false
  }
}

const handleRegister = async () => {
  registerError.value = ''

  // Validate passwords match
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    registerError.value = 'Passwords do not match'
    return
  }

  // Validate password length
  if (registerForm.value.password.length < 6) {
    registerError.value = 'Password must be at least 6 characters long'
    return
  }

  registerLoading.value = true

  try {
    const user = await register({
      name: `${registerForm.value.firstName} ${registerForm.value.lastName}`,
      email: registerForm.value.email,
      phone: registerForm.value.phone,
      password: registerForm.value.password,
      userType: registerForm.value.userType
    })

    if (user) {
      emit('login', user)
      showRegisterModal.value = false
      
      // Reset form
      registerForm.value = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        userType: ''
      }
      
      router.push('/dashboard')
    }
  } catch (error) {
    registerError.value = error.message || 'An error occurred during registration'
  } finally {
    registerLoading.value = false
  }
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