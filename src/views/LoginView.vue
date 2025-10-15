<template>
  <div class="login-page min-vh-100 d-flex align-items-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow border-0">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <i class="bi bi-church display-4 church-purple"></i>
                <h2 class="fw-bold mt-3">Welcome Back</h2>
                <p class="text-muted">Sign in to your GCBF account</p>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      v-model="loginForm.email"
                      required
                      placeholder="Enter your email"
                    >
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      id="password"
                      v-model="loginForm.password"
                      required
                      placeholder="Enter your password"
                    >
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>

                <div v-if="error" class="alert alert-danger" role="alert">
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  {{ error }}
                </div>

                <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                  {{ loading ? 'Signing In...' : 'Sign In' }}
                </button>

                <div class="text-center">
                  <p class="mb-0">
                    Don't have an account? 
                    <router-link to="/register" class="text-decoration-none">Sign up here</router-link>
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
          
          <div class="text-center mt-4">
            <router-link to="/" class="text-decoration-none">
              <i class="bi bi-arrow-left me-2"></i>
              Back to Homepage
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../utils/auth'

const router = useRouter()

const loginForm = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = login(loginForm.value.email, loginForm.value.password)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = 'An error occurred during login. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.demo-creds {
  font-size: 0.8rem;
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.card {
  border-radius: 15px;
}

.btn-primary {
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
}
</style>