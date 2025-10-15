<template>
  <div class="register-page min-vh-100 d-flex align-items-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow border-0">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <i class="bi bi-church display-4 church-purple"></i>
                <h2 class="fw-bold mt-3">Join Our Community</h2>
                <p class="text-muted">Create your GCBF account</p>
              </div>

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
                  <label for="email" class="form-label">Email Address</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      v-model="registerForm.email"
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
                      v-model="registerForm.password"
                      required
                      placeholder="Create a password"
                      minlength="6"
                    >
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
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
                      :class="{ 'is-invalid': passwordMismatch }"
                    >
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="passwordMismatch" class="invalid-feedback">
                    Passwords do not match.
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
                      placeholder="(555) 123-4567"
                    >
                  </div>
                </div>

                <div class="mb-3">
                  <label for="userType" class="form-label">I am a...</label>
                  <select 
                    class="form-select" 
                    id="userType" 
                    v-model="registerForm.userType" 
                    required
                  >
                    <option value="">Select your status</option>
                    <option value="visitor">Visitor (First time or occasional attendee)</option>
                    <option value="member">Member (Regular attendee seeking membership)</option>
                  </select>
                </div>

                <div v-if="error" class="alert alert-danger" role="alert">
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  {{ error }}
                </div>

                <div v-if="success" class="alert alert-success" role="alert">
                  <i class="bi bi-check-circle me-2"></i>
                  {{ success }}
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100 mb-3" 
                  :disabled="loading || passwordMismatch || !isFormValid"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-person-plus me-2"></i>
                  {{ loading ? 'Creating Account...' : 'Create Account' }}
                </button>

                <div class="text-center">
                  <p class="mb-0">
                    Already have an account? 
                    <router-link to="/login" class="text-decoration-none">Sign in here</router-link>
                  </p>
                </div>
              </form>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../utils/auth'

const router = useRouter()

const registerForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  userType: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

const passwordMismatch = computed(() => {
  return registerForm.value.password && 
         registerForm.value.confirmPassword && 
         registerForm.value.password !== registerForm.value.confirmPassword
})

const isFormValid = computed(() => {
  return registerForm.value.firstName &&
         registerForm.value.lastName &&
         registerForm.value.email &&
         registerForm.value.password &&
         registerForm.value.confirmPassword &&
         registerForm.value.userType &&
         registerForm.value.password === registerForm.value.confirmPassword &&
         registerForm.value.password.length >= 6
})

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const userData = {
      name: `${registerForm.value.firstName} ${registerForm.value.lastName}`,
      email: registerForm.value.email,
      password: registerForm.value.password,
      phone: registerForm.value.phone,
      userType: registerForm.value.userType
    }

    const result = register(userData)
    
    if (result.success) {
      success.value = 'Account created successfully! Redirecting to dashboard...'
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = 'An error occurred during registration. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
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

.form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(154, 63, 63, 0.25);
  border-color: #9A3F3F;
}

.form-select:focus {
  box-shadow: 0 0 0 0.2rem rgba(154, 63, 63, 0.25);
  border-color: #9A3F3F;
}
</style>