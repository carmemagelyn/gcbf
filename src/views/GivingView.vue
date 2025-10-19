<template>
  <div class="giving-page">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card bg-church-purple text-white border-0">
            <div class="card-body">
              <h2 class="fw-bold mb-2">
                <i class="bi bi-currency-dollar me-2"></i>
                Tithing & Giving
              </h2>
              <p class="mb-0 opacity-75">
                Support God's work through faithful giving and stewardship
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Pledge Form -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0">
              <h5 class="fw-bold mb-0">Make a Pledge or Gift</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitGift">
                <div class="mb-3">
                  <label for="giftAmount" class="form-label">Amount (₱)</label>
                  <div class="input-group">
                    <span class="input-group-text">₱</span>
                    <input
                      type="number"
                      class="form-control"
                      id="giftAmount"
                      v-model.number="giftForm.amount"
                      min="1"
                      step="0.01"
                      required
                      placeholder="0.00"
                    >
                  </div>
                </div>

                <div class="mb-3">
                  <label for="frequency" class="form-label">Frequency</label>
                  <select class="form-select" id="frequency" v-model="giftForm.frequency" required>
                    <option value="">Select frequency</option>
                    <option value="one-time">One Time</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>

                <div v-if="giftForm.frequency && giftForm.frequency !== 'one-time'" class="mb-3">
                  <label for="startDate" class="form-label">Start Date</label>
                  <input
                    type="date"
                    class="form-control"
                    id="startDate"
                    v-model="giftForm.startDate"
                    :min="today"
                    required
                  >
                </div>

                <div v-if="giftForm.frequency && giftForm.frequency !== 'one-time'" class="mb-3">
                  <label for="duration" class="form-label">Duration (months)</label>
                  <select class="form-select" id="duration" v-model.number="giftForm.duration">
                    <option value="">Select duration</option>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months (1 year)</option>
                    <option value="24">24 months (2 years)</option>
                    <option value="0">Ongoing</option>
                  </select>
                </div>

                <!-- Payment Information -->
                <div class="mb-4">
                  <h6 class="fw-bold text-muted">Payment Information</h6>
                  <div class="alert alert-light">
                    <i class="bi bi-info-circle me-2"></i>
                    <small>After creating your gift commitment, you'll be able to make payments individually for each scheduled occurrence and upload receipts for verification.</small>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="notes" class="form-label">Notes (Optional)</label>
                  <textarea
                    class="form-control"
                    id="notes"
                    v-model="giftForm.notes"
                    rows="3"
                    placeholder="Any special instructions or comments..."
                  ></textarea>
                </div>

                <!-- Gift Summary -->
                <div v-if="giftForm.amount && giftForm.frequency" class="alert alert-info">
                  <h6 class="fw-bold mb-2">Gift Commitment Summary:</h6>
                  <p class="mb-1">
                    <strong>Amount per Payment:</strong> ₱{{ giftForm.amount.toFixed(2) }} 
                    <span class="text-muted">({{ giftForm.frequency }})</span>
                  </p>
                  <p v-if="giftForm.frequency !== 'one-time'" class="mb-1">
                    <strong>Annual Total:</strong> ₱{{ calculateAnnualTotal().toFixed(2) }}
                  </p>
                  <p v-if="giftForm.duration && giftForm.duration > 0" class="mb-1">
                    <strong>Total Commitment:</strong> ₱{{ calculateTotalCommitment().toFixed(2) }}
                  </p>
                  <p class="mb-0">
                    <strong>Scheduled Payments:</strong> {{ calculateScheduledPayments() }} payments
                    <small class="text-muted d-block">You can make and upload receipts for each payment individually after creating this commitment.</small>
                  </p>
                </div>

                <div v-if="error" class="alert alert-danger">
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  {{ error }}
                </div>

                <div v-if="success" class="alert alert-success">
                  <i class="bi bi-check-circle me-2"></i>
                  {{ success }}
                </div>

                <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-heart-fill me-2"></i>
                  {{ loading ? 'Processing...' : 'Make Gift' }}
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Gift History -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 class="fw-bold mb-0">My Gift History</h5>
              <span class="badge bg-primary">{{ gifts.length }} gifts</span>
            </div>
            <div class="card-body">
              <div v-if="gifts.length === 0" class="text-center text-muted py-4">
                <i class="bi bi-currency-dollar display-4 opacity-25"></i>
                <p class="mt-2 mb-0">No gifts yet</p>
                <small>Make your first gift to get started</small>
              </div>

              <div v-else>
                <!-- Summary Stats -->
                <div class="row g-3 mb-4">
                  <div class="col-6">
                    <div class="text-center p-3 bg-light rounded">
                      <h5 class="fw-bold mb-0 church-purple">₱{{ totalGiven.toFixed(2) }}</h5>
                      <small class="text-muted">Total Given</small>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-center p-3 bg-light rounded">
                      <h5 class="fw-bold mb-0 church-purple">{{ activeGifts }}</h5>
                      <small class="text-muted">Active Gifts</small>
                    </div>
                  </div>
                </div>

                <!-- Gift List -->
                <div class="gift-list" style="max-height: 400px; overflow-y: auto;">
                  <div 
                    v-for="gift in sortedGifts" 
                    :key="gift.id" 
                    class="gift-item border rounded p-3 mb-3"
                    :class="{ 'border-success bg-success bg-opacity-10': gift.status === 'active' }"
                  >
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <h6 class="fw-bold mb-0">Gift</h6>
                      <span 
                        class="badge"
                        :class="gift.status === 'active' ? 'bg-success' : 'bg-secondary'"
                      >
                        {{ capitalizeFirst(gift.status) }}
                      </span>
                    </div>
                    
                    <div class="gift-details">
                      <p class="mb-2">
                        <strong>₱{{ gift.amount.toFixed(2) }}</strong>
                        <span class="text-muted"> • {{ gift.frequency }}</span>
                        <span v-if="gift.frequency !== 'one-time'" class="badge bg-primary ms-2">
                          {{ gift.payments?.length || 0 }} payments
                        </span>
                      </p>
                      
                      <p v-if="gift.frequency !== 'one-time'" class="mb-2 small text-muted">
                        <i class="bi bi-calendar me-1"></i>
                        Started: {{ formatDate(gift.startDate) }}
                        <span v-if="gift.duration && gift.duration > 0">
                          • {{ gift.duration }} months
                        </span>
                      </p>
                      
                      <p v-if="gift.notes" class="mb-2 small">
                        <i class="bi bi-chat-text me-1"></i>
                        {{ gift.notes }}
                      </p>

                      <!-- Individual Payments Section -->
                      <div v-if="gift.payments && gift.payments.length > 0" class="payments-section mt-2">
                        <h6 class="fw-bold mb-2 small">Payment History:</h6>
                        <div 
                          v-for="payment in gift.payments" 
                          :key="payment.id"
                          class="payment-item p-2 mb-2 border rounded"
                          :class="{
                            'border-success bg-success bg-opacity-10': payment.verificationStatus === 'approved',
                            'border-warning bg-warning bg-opacity-10': payment.verificationStatus === 'pending',
                            'border-danger bg-danger bg-opacity-10': payment.verificationStatus === 'rejected',
                            'border-secondary bg-light': payment.verificationStatus === 'pending_payment'
                          }"
                        >
                          <div class="d-flex justify-content-between align-items-start mb-1">
                            <span class="fw-bold small">₱{{ payment.amount.toFixed(2) }}</span>
                            <span 
                              class="badge"
                              :class="{
                                'bg-success': payment.verificationStatus === 'approved',
                                'bg-warning': payment.verificationStatus === 'pending',
                                'bg-danger': payment.verificationStatus === 'rejected',
                                'bg-secondary': payment.verificationStatus === 'pending_payment'
                              }"
                            >
                              {{ getVerificationStatusText(payment.verificationStatus) }}
                            </span>
                          </div>
                          
                          <div class="small text-muted mb-1">
                            <i class="bi bi-calendar me-1"></i>
                            Due: {{ formatDate(payment.dueDate) }}
                            <span v-if="payment.paymentDate">
                              • Paid: {{ formatDate(payment.paymentDate) }}
                            </span>
                          </div>
                          
                          <div v-if="payment.paymentMethod" class="small mb-1">
                            <i class="bi bi-credit-card me-1" v-if="payment.paymentMethod === 'online'"></i>
                            <i class="bi bi-cash me-1" v-if="payment.paymentMethod === 'cash'"></i>
                            <span class="text-capitalize">{{ payment.paymentMethod }}</span>
                            
                            <span v-if="payment.paymentMethod === 'cash' && payment.referenceNumber" class="text-muted">
                              • Ref: {{ payment.referenceNumber }}
                            </span>
                            <span v-if="payment.paymentMethod === 'online' && payment.receiptFileName" class="text-muted">
                              • Receipt: {{ payment.receiptFileName }}
                            </span>
                          </div>
                          
                          <div v-if="payment.verificationStatus === 'approved' && payment.verifiedBy" class="small text-success">
                            <i class="bi bi-check-circle me-1"></i>
                            Verified by {{ payment.verifiedBy }} on {{ formatDate(payment.verifiedDate) }}
                          </div>
                          
                          <!-- Make Payment Button for Pending Payments -->
                          <div v-if="payment.verificationStatus === 'pending_payment'" class="mt-1">
                            <button 
                              class="btn btn-sm btn-primary"
                              @click="makePayment(gift.id, payment.id)"
                            >
                              <i class="bi bi-credit-card me-1"></i>
                              Make Payment
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <p class="mb-0 small text-muted mt-2">
                        Gift Created: {{ formatDateTime(gift.createdAt) }}
                      </p>
                    </div>

                    <div v-if="gift.status === 'active'" class="mt-2">
                      <button 
                        class="btn btn-sm btn-outline-danger"
                        @click="cancelGift(gift.id)"
                      >
                        <i class="bi bi-x-circle me-1"></i>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-credit-card me-2"></i>
              Make Payment - ₱{{ currentPayment?.amount?.toFixed(2) }}
            </h5>
            <button type="button" class="btn-close" @click="showPaymentModal = false"></button>
          </div>
          <div class="modal-body">
            <div v-if="currentPayment && currentGift" class="mb-3">
              <div class="alert alert-info">
                <strong>{{ currentGift.notes || 'Gift Payment' }}</strong><br>
                <small class="text-muted">
                  Due Date: {{ formatDate(currentPayment.dueDate) }} • 
                  Amount: ₱{{ currentPayment.amount.toFixed(2) }}
                </small>
              </div>
            </div>

            <form @submit.prevent="submitPayment">
              <!-- Payment Method Selection -->
              <div class="mb-4">
                <label class="form-label fw-bold">Payment Method</label>
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        name="modalPaymentMethod" 
                        id="modalOnlinePayment"
                        value="online"
                        v-model="paymentForm.paymentMethod"
                      >
                      <label class="form-check-label" for="modalOnlinePayment">
                        <i class="bi bi-credit-card me-2"></i>Online Payment
                      </label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        name="modalPaymentMethod" 
                        id="modalCashPayment"
                        value="cash"
                        v-model="paymentForm.paymentMethod"
                      >
                      <label class="form-check-label" for="modalCashPayment">
                        <i class="bi bi-cash me-2"></i>Cash Payment
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Online Payment - Receipt Upload -->
              <div v-if="paymentForm.paymentMethod === 'online'" class="mb-3">
                <label for="modalReceiptUpload" class="form-label">Upload Receipt</label>
                <input
                  type="file"
                  class="form-control"
                  id="modalReceiptUpload"
                  @change="handlePaymentReceiptUpload"
                  accept="image/*,.pdf"
                >
                <div class="form-text">
                  <i class="bi bi-info-circle me-1"></i>
                  Upload your payment receipt (JPG, PNG, or PDF format)
                </div>
                
                <!-- Receipt Preview -->
                <div v-if="paymentForm.receiptPreview" class="mt-2">
                  <div class="alert alert-success d-flex align-items-center">
                    <i class="bi bi-check-circle me-2"></i>
                    <span>{{ paymentForm.receiptFileName }} uploaded successfully</span>
                    <button 
                      type="button" 
                      class="btn-close ms-auto" 
                      @click="removePaymentReceipt"
                    ></button>
                  </div>
                </div>
              </div>

              <!-- Cash Payment - Reference Number -->
              <div v-if="paymentForm.paymentMethod === 'cash'" class="mb-3">
                <label for="modalReferenceNumber" class="form-label">Reference Number</label>
                <input
                  type="text"
                  class="form-control"
                  id="modalReferenceNumber"
                  v-model="paymentForm.referenceNumber"
                  placeholder="Enter reference number or transaction ID"
                >
                <div class="form-text">
                  <i class="bi bi-info-circle me-1"></i>
                  Please provide the reference number from your cash payment receipt
                </div>
              </div>

              <!-- Notes -->
              <div class="mb-3">
                <label for="modalPaymentNotes" class="form-label">Payment Notes (Optional)</label>
                <textarea
                  class="form-control"
                  id="modalPaymentNotes"
                  v-model="paymentForm.notes"
                  rows="2"
                  placeholder="Any additional notes about this payment..."
                ></textarea>
              </div>

              <!-- Error/Success Messages -->
              <div v-if="error" class="alert alert-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="showPaymentModal = false">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">
                  <i class="bi bi-check-circle me-2"></i>
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCurrentUser } from '../utils/auth'

const user = getCurrentUser()

const giftForm = ref({
  amount: null,
  frequency: '',
  startDate: '',
  duration: '',
  notes: ''
})

const gifts = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')

// Payment modal and form
const showPaymentModal = ref(false)
const currentPayment = ref(null)
const currentGift = ref(null)
const paymentForm = ref({
  paymentMethod: '',
  receiptFile: null,
  receiptPreview: null,
  receiptFileName: '',
  referenceNumber: '',
  notes: ''
})

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const totalGiven = computed(() => {
  return gifts.value.reduce((sum, gift) => sum + gift.amount, 0)
})

const activeGifts = computed(() => {
  return gifts.value.filter(g => g.status === 'active').length
})

const sortedGifts = computed(() => {
  return [...gifts.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

onMounted(() => {
  loadGifts()
})

// Helper function to get verification status text
const getVerificationStatusText = (status) => {
  switch(status) {
    case 'approved': return 'Approved'
    case 'pending': return 'Pending Review'
    case 'rejected': return 'Rejected'
    case 'pending_payment': return 'Payment Due'
    default: return 'Unknown'
  }
}

// Make payment for a specific payment entry
const makePayment = (giftId, paymentId) => {
  const gift = gifts.value.find(g => g.id === giftId)
  if (!gift) return
  
  const payment = gift.payments.find(p => p.id === paymentId)
  if (!payment) return
  
  // Set the current payment for the modal/form
  currentPayment.value = payment
  currentGift.value = gift
  showPaymentModal.value = true
}

// Submit payment for a specific payment entry
const submitPayment = async () => {
  if (!currentPayment.value || !currentGift.value) return
  
  // Validation for payment method
  if (!paymentForm.value.paymentMethod) {
    error.value = 'Please select a payment method'
    return
  }

  if (paymentForm.value.paymentMethod === 'online' && !paymentForm.value.receiptFile) {
    error.value = 'Please upload a receipt for online payment'
    return
  }

  if (paymentForm.value.paymentMethod === 'cash' && !paymentForm.value.referenceNumber.trim()) {
    error.value = 'Please provide a reference number for cash payment'
    return
  }

  try {
    let receiptUrl = null
    
    // Upload receipt to R2 if online payment
    if (paymentForm.value.paymentMethod === 'online' && paymentForm.value.receiptFile) {
      const formData = new FormData()
      
      // Create a safe filename
      const timestamp = Date.now()
      const userId = user?.id || 'unknown'
      const fileExtension = paymentForm.value.receiptFile.name.split('.').pop()
      const safeFileName = `receipt-${userId}-${timestamp}.${fileExtension}`
      
      formData.append('receipt', paymentForm.value.receiptFile, safeFileName)
      formData.append('fileName', safeFileName)
      formData.append('userId', userId)
      formData.append('giftId', currentGift.value.id)
      formData.append('paymentId', currentPayment.value.id)
      
      // Upload to R2
      const uploadResponse = await fetch('/api/receipts/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload receipt')
      }
      
      const uploadResult = await uploadResponse.json()
      receiptUrl = uploadResult.receiptUrl
    }
    
    // Update the payment entry
    currentPayment.value.paymentDate = new Date().toISOString().split('T')[0]
    currentPayment.value.paymentMethod = paymentForm.value.paymentMethod
    currentPayment.value.receiptFile = paymentForm.value.receiptFile
    currentPayment.value.receiptFileName = paymentForm.value.receiptFileName
    currentPayment.value.receiptUrl = receiptUrl || paymentForm.value.receiptPreview
    currentPayment.value.referenceNumber = paymentForm.value.referenceNumber
    currentPayment.value.verificationStatus = 'pending'
    currentPayment.value.notes = paymentForm.value.notes

    saveGifts()
    
    success.value = 'Payment submitted successfully! Receipt uploaded. Awaiting admin verification.'
    showPaymentModal.value = false
    resetPaymentForm()
    
    setTimeout(() => {
      success.value = ''
    }, 5000)
  } catch (err) {
    console.error('Payment submission error:', err)
    error.value = 'Failed to submit payment. Please try again.'
  }
}

// Reset payment form
const resetPaymentForm = () => {
  paymentForm.value = {
    paymentMethod: '',
    receiptFile: null,
    receiptPreview: null,
    receiptFileName: '',
    referenceNumber: '',
    notes: ''
  }
  currentPayment.value = null
  currentGift.value = null
}

const loadGifts = () => {
  const userId = user?.id
  if (!userId) return
  
  const savedGifts = localStorage.getItem(`gcbf_gifts_${userId}`)
  if (savedGifts) {
    gifts.value = JSON.parse(savedGifts)
  } else {
    // Start with empty gift history - users will create their own pledges
    gifts.value = []
  }
}

const saveGifts = () => {
  const userId = user?.id
  if (!userId) return
  
  localStorage.setItem(`gcbf_gifts_${userId}`, JSON.stringify(gifts.value))
}

// Handle receipt file upload
const handleReceiptUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'File size must be less than 5MB'
      return
    }

    giftForm.value.receiptFile = file
    giftForm.value.receiptFileName = file.name
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        giftForm.value.receiptPreview = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      giftForm.value.receiptPreview = 'document'
    }
  }
}

// Remove uploaded receipt
const removeReceipt = () => {
  giftForm.value.receiptFile = null
  giftForm.value.receiptPreview = null
  giftForm.value.receiptFileName = ''
  // Reset the file input
  const fileInput = document.getElementById('receiptUpload')
  if (fileInput) fileInput.value = ''
}

// Handle payment receipt upload in modal
const handlePaymentReceiptUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'File size must be less than 5MB'
      return
    }

    paymentForm.value.receiptFile = file
    paymentForm.value.receiptFileName = file.name
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        paymentForm.value.receiptPreview = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      paymentForm.value.receiptPreview = 'document'
    }
  }
}

// Remove payment receipt in modal
const removePaymentReceipt = () => {
  paymentForm.value.receiptFile = null
  paymentForm.value.receiptPreview = null
  paymentForm.value.receiptFileName = ''
  // Reset the file input
  const fileInput = document.getElementById('modalReceiptUpload')
  if (fileInput) fileInput.value = ''
}

// Generate payment schedule based on frequency and duration
const generatePaymentSchedule = (amount, frequency, startDate, duration) => {
  const payments = []
  let currentDate = new Date(startDate)
  let paymentCount = 0
  
  // Calculate how many payments to generate
  let totalPayments = 0
  if (frequency === 'one-time') {
    totalPayments = 1
  } else if (duration && duration > 0) {
    switch(frequency) {
      case 'weekly':
        totalPayments = duration * 4 // approximate weeks per month
        break
      case 'monthly':
        totalPayments = duration
        break
      case 'quarterly':
        totalPayments = Math.ceil(duration / 3)
        break
      case 'annually':
        totalPayments = Math.ceil(duration / 12)
        break
    }
  } else {
    // If ongoing (duration = 0), generate next 12 payments
    totalPayments = frequency === 'weekly' ? 48 : frequency === 'monthly' ? 12 : frequency === 'quarterly' ? 4 : 1
  }

  for (let i = 0; i < totalPayments; i++) {
    paymentCount++
    payments.push({
      id: `payment_${Date.now()}_${paymentCount}`,
      dueDate: currentDate.toISOString().split('T')[0],
      amount: amount,
      paymentDate: null,
      paymentMethod: '',
      receiptFile: null,
      receiptFileName: '',
      receiptUrl: '',
      referenceNumber: '',
      verificationStatus: 'pending_payment',
      verifiedBy: null,
      verifiedDate: null,
      notes: ''
    })

    // Calculate next payment date
    switch(frequency) {
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7)
        break
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1)
        break
      case 'quarterly':
        currentDate.setMonth(currentDate.getMonth() + 3)
        break
      case 'annually':
        currentDate.setFullYear(currentDate.getFullYear() + 1)
        break
    }

    if (frequency === 'one-time') break
  }

  return payments
}

const submitGift = () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // Generate payment schedule
    const paymentSchedule = generatePaymentSchedule(
      giftForm.value.amount,
      giftForm.value.frequency,
      giftForm.value.frequency === 'one-time' ? new Date().toISOString().split('T')[0] : giftForm.value.startDate,
      giftForm.value.duration
    )

    const newGift = {
      id: Date.now().toString(),
      amount: giftForm.value.amount,
      frequency: giftForm.value.frequency,
      startDate: giftForm.value.startDate,
      duration: giftForm.value.duration,
      notes: giftForm.value.notes,
      status: 'active',
      createdAt: new Date().toISOString(),
      userId: user?.id,
      payments: paymentSchedule
    }

    gifts.value.push(newGift)
    saveGifts()

    success.value = `Gift commitment created successfully! You have ${paymentSchedule.length} scheduled payments.`
    
    // Reset form
    giftForm.value = {
      amount: null,
      frequency: '',
      startDate: '',
      duration: '',
      notes: ''
    }

    setTimeout(() => {
      success.value = ''
    }, 5000)

  } catch (err) {
    error.value = 'An error occurred while creating your gift. Please try again.'
  } finally {
    loading.value = false
  }
}

const cancelGift = (giftId) => {
  if (confirm('Are you sure you want to cancel this gift?')) {
    const giftIndex = gifts.value.findIndex(g => g.id === giftId)
    if (giftIndex !== -1) {
      gifts.value[giftIndex].status = 'cancelled'
      gifts.value[giftIndex].cancelledAt = new Date().toISOString()
      saveGifts()
      success.value = 'Gift cancelled successfully.'
      setTimeout(() => {
        success.value = ''
      }, 3000)
    }
  }
}

const calculateAnnualTotal = () => {
  const amount = giftForm.value.amount || 0
  const frequency = giftForm.value.frequency
  
  const multipliers = {
    'weekly': 52,
    'monthly': 12,
    'quarterly': 4,
    'annually': 1
  }
  
  return amount * (multipliers[frequency] || 0)
}

const calculateTotalCommitment = () => {
  const annualTotal = calculateAnnualTotal()
  const duration = giftForm.value.duration || 0
  
  if (duration === 0) return annualTotal // Ongoing
  return (annualTotal / 12) * duration
}

const calculateScheduledPayments = () => {
  if (!giftForm.value.frequency) return 0
  
  if (giftForm.value.frequency === 'one-time') {
    return 1
  } else if (giftForm.value.duration && giftForm.value.duration > 0) {
    switch(giftForm.value.frequency) {
      case 'weekly':
        return giftForm.value.duration * 4 // approximate weeks per month
      case 'monthly':
        return giftForm.value.duration
      case 'quarterly':
        return Math.ceil(giftForm.value.duration / 3)
      case 'annually':
        return Math.ceil(giftForm.value.duration / 12)
    }
  } else {
    // If ongoing (duration = 0), show next 12 payments
    return giftForm.value.frequency === 'weekly' ? 48 : giftForm.value.frequency === 'monthly' ? 12 : giftForm.value.frequency === 'quarterly' ? 4 : 1
  }
}

const capitalizeFirst = (str) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>

<style scoped>
.gift-item {
  transition: all 0.2s ease;
}

.gift-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.gift-list {
  scrollbar-width: thin;
  scrollbar-color: #9A3F3F #f8f9fa;
}

.gift-list::-webkit-scrollbar {
  width: 6px;
}

.gift-list::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 3px;
}

.gift-list::-webkit-scrollbar-thumb {
  background: #9A3F3F;
  border-radius: 3px;
}

.gift-list::-webkit-scrollbar-thumb:hover {
  background: #FBF9D1;
}

.form-control:focus,
.form-select:focus {
  box-shadow: 0 0 0 0.2rem rgba(154, 63, 63, 0.25);
  border-color: #9A3F3F;
}
</style>