<template>
  <div class="admin-login">
    <div class="container-fluid vh-100">
      <div class="row h-100">
        <!-- Left Side - Branding -->
        <div class="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-church-purple text-white">
          <div class="text-center">
            <i class="bi bi-shield-lock display-1 mb-4"></i>
            <h1 class="display-4 fw-bold mb-3">Admin Portal</h1>
            <p class="lead">
              Secure access to church management tools and administrative functions
            </p>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="col-lg-6 d-flex align-items-center justify-content-center">
          <div class="w-100" style="max-width: 400px;">
            <div class="text-center mb-5">
              <i class="bi bi-building display-4 church-purple mb-3"></i>
              <h2 class="fw-bold church-purple">GCBF Admin Login</h2>
              <p class="text-muted">Access the Church Portal</p>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="needs-validation" novalidate>
              <div class="mb-3">
                <label for="email" class="form-label fw-bold">Admin Email</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-envelope"></i>
                  </span>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email"
                    v-model="email"
                    placeholder="admin@gcbf.org"
                    required
                    :class="{ 'is-invalid': errors.email }"
                  >
                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <label for="password" class="form-label fw-bold">Password</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-control" 
                    id="password"
                    v-model="password"
                    placeholder="Enter admin password"
                    required
                    :class="{ 'is-invalid': errors.password }"
                  >
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                  <div v-if="errors.password" class="invalid-feedback">
                    {{ errors.password }}
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="error" class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <!-- Login Button -->
              <button 
                type="submit" 
                class="btn btn-church-purple w-100 py-3 fw-bold"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'Signing In...' : 'Sign In to Admin Portal' }}
              </button>
            </form>

            <!-- Demo Credentials -->
            <div class="mt-4 p-3 bg-light rounded">
              <h6 class="fw-bold mb-2">Demo Admin Credentials:</h6>
              <p class="small mb-1"><strong>Email:</strong> admin@gcbf.org</p>
              <p class="small mb-0"><strong>Password:</strong> admin2024</p>
            </div>

            <!-- Back to Home -->
            <div class="text-center mt-4">
              <router-link to="/" class="text-muted text-decoration-none">
                <i class="bi bi-arrow-left me-2"></i>
                Back to Home
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminLogin } from '../utils/auth'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')
const errors = ref({})

const validateForm = () => {
  errors.value = {}
  
  if (!email.value) {
    errors.value.email = 'Admin email is required'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = 'Please enter a valid email'
  }
  
  if (!password.value) {
    errors.value.password = 'Password is required'
  } else if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleLogin = async () => {
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const result = adminLogin(email.value, password.value)
    
    if (result.success) {
      // Redirect to Church Portal
      router.push('/church-portal')
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
}

.bg-church-purple {
  background: linear-gradient(135deg, #9A3F3F, #C96868);
}

.btn-church-purple {
  background-color: #9A3F3F;
  border-color: #9A3F3F;
  color: white;
}

.btn-church-purple:hover {
  background-color: #8B3838;
  border-color: #8B3838;
  color: white;
}

.btn-church-purple:disabled {
  background-color: #9A3F3F;
  border-color: #9A3F3F;
  opacity: 0.6;
}

.church-purple {
  color: #9A3F3F;
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.form-control:focus {
  border-color: #9A3F3F;
  box-shadow: 0 0 0 0.2rem rgba(154, 63, 63, 0.25);
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}
</style>