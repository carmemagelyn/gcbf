<template>
  <div class="church-portal">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card bg-church-purple text-white border-0">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <h2 class="fw-bold mb-2">
                  <i class="bi bi-shield-check me-2"></i>
                  Church Admin Portal
                </h2>
                <p class="mb-0 opacity-75">
                  Administrative access to church management, finances, and reports
                </p>
              </div>
              <div class="text-end">
                <p class="mb-1 small opacity-75">Welcome, {{ user?.name || 'Administrator' }}</p>
                <button 
                  class="btn btn-outline-light btn-sm"
                  @click="handleLogout"
                >
                  <i class="bi bi-box-arrow-right me-1"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats Dashboard -->
      <div class="row g-4 mb-4">
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-currency-dollar display-4 text-success"></i>
              <h5 class="mt-2 mb-0">₱{{ totalIncome.toLocaleString() }}</h5>
              <small class="text-muted">Monthly Income</small>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-credit-card display-4 text-danger"></i>
              <h5 class="mt-2 mb-0">₱{{ totalExpenses.toLocaleString() }}</h5>
              <small class="text-muted">Monthly Expenses</small>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-piggy-bank display-4 church-purple"></i>
              <h5 class="mt-2 mb-0">₱{{ netIncome.toLocaleString() }}</h5>
              <small class="text-muted">Net Income</small>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-people-fill display-4 text-info"></i>
              <h5 class="mt-2 mb-0">{{ memberCount }}</h5>
              <small class="text-muted">Active Members</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Portal Navigation -->
      <div class="row">
        <div class="col-12">
          <ul class="nav nav-pills mb-4" role="tablist">
            <li class="nav-item">
              <button 
                class="nav-link"
                :class="{ active: activeSection === 'finance' }"
                @click="activeSection = 'finance'"
              >
                <i class="bi bi-graph-up me-2"></i>
                Financial Reports
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link"
                :class="{ active: activeSection === 'prayers' }"
                @click="activeSection = 'prayers'"
              >
                <i class="bi bi-heart me-2"></i>
                Shared Prayers
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link"
                :class="{ active: activeSection === 'ministry' }"
                @click="activeSection = 'ministry'"
              >
                <i class="bi bi-people me-2"></i>
                Ministry Reports
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link"
                :class="{ active: activeSection === 'forecast' }"
                @click="activeSection = 'forecast'"
              >
                <i class="bi bi-bar-chart me-2"></i>
                Budget Forecast
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link"
                :class="{ active: activeSection === 'payments' }"
                @click="activeSection = 'payments'"
              >
                <i class="bi bi-credit-card-2-front me-2"></i>
                Payment Verification
                <span v-if="pendingPaymentsCount > 0" class="badge bg-warning ms-1">
                  {{ pendingPaymentsCount }}
                </span>
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link"
                :class="{ active: activeSection === 'newsletters' }"
                @click="activeSection = 'newsletters'"
              >
                <i class="bi bi-newspaper me-2"></i>
                Newsletter Management
              </button>
            </li>
          </ul>

          <!-- Section Content -->
          <div class="tab-content">
            <!-- Financial Reports -->
            <div v-if="activeSection === 'finance'" class="section-content">
              <div class="row g-4">
                <!-- Income Breakdown -->
                <div class="col-lg-6">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0">
                      <h5 class="fw-bold mb-0">Income Breakdown - {{ currentMonth }}</h5>
                    </div>
                    <div class="card-body">
                      <canvas id="incomeChart" style="max-height: 300px;"></canvas>
                      
                      <div class="income-details mt-3">
                        <div v-for="income in incomeData" :key="income.category" class="d-flex justify-content-between align-items-center mb-2">
                          <span>{{ income.category }}</span>
                          <strong class="text-success">₱{{ income.amount.toLocaleString() }}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Expense Breakdown -->
                <div class="col-lg-6">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0">
                      <h5 class="fw-bold mb-0">Expense Breakdown - {{ currentMonth }}</h5>
                    </div>
                    <div class="card-body">
                      <canvas id="expenseChart" style="max-height: 300px;"></canvas>
                      
                      <div class="expense-details mt-3">
                        <div v-for="expense in expenseData" :key="expense.category" class="d-flex justify-content-between align-items-center mb-2">
                          <span>{{ expense.category }}</span>
                          <strong class="text-danger">₱{{ expense.amount.toLocaleString() }}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Year-to-Date Summary -->
                <div class="col-12">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0">
                      <h5 class="fw-bold mb-0">Year-to-Date Financial Summary</h5>
                    </div>
                    <div class="card-body">
                      <div class="row g-4">
                        <div class="col-md-4 text-center">
                          <h3 class="text-success fw-bold">₱{{ ytdIncome.toLocaleString() }}</h3>
                          <p class="mb-0 text-muted">Total Income</p>
                        </div>
                        <div class="col-md-4 text-center">
                          <h3 class="text-danger fw-bold">₱{{ ytdExpenses.toLocaleString() }}</h3>
                          <p class="mb-0 text-muted">Total Expenses</p>
                        </div>
                        <div class="col-md-4 text-center">
                          <h3 class="fw-bold" :class="ytdNet >= 0 ? 'text-success' : 'text-danger'">
                            ₱{{ ytdNet.toLocaleString() }}
                          </h3>
                          <p class="mb-0 text-muted">Net {{ ytdNet >= 0 ? 'Surplus' : 'Deficit' }}</p>
                        </div>
                      </div>

                      <!-- Monthly Trend Chart -->
                      <div class="mt-4">
                        <h6 class="fw-bold mb-3">Monthly Trend (Last 6 Months)</h6>
                        <canvas id="trendChart" style="max-height: 250px;"></canvas>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shared Prayers -->
            <div v-if="activeSection === 'prayers'" class="section-content">
              <div class="row g-4">
                <div class="col-12">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                      <h5 class="fw-bold mb-0">Community Prayer Requests</h5>
                      <span class="badge bg-primary">{{ sharedPrayers.length }} active prayers</span>
                    </div>
                    <div class="card-body">
                      <div v-if="sharedPrayers.length === 0" class="text-center py-4">
                        <i class="bi bi-heart display-4 opacity-25"></i>
                        <p class="mt-3 text-muted">No shared prayer requests at this time</p>
                      </div>

                      <div v-else class="row g-3">
                        <div v-for="prayer in sharedPrayers" :key="prayer.id" class="col-lg-6">
                          <div class="prayer-card card border-0 bg-light">
                            <div class="card-body">
                              <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="badge" :class="getPrayerCategoryClass(prayer.category)">
                                  {{ prayer.category }}
                                </span>
                                <small class="text-muted">{{ formatDate(prayer.dateRequested) }}</small>
                              </div>
                              
                              <div class="d-flex align-items-center mb-2">
                                <i class="bi bi-person-circle me-2 church-purple"></i>
                                <strong>{{ prayer.requestedBy }}</strong>
                              </div>
                              
                              <h6 class="fw-bold mb-2">{{ prayer.title }}</h6>
                              <p class="card-text small">{{ truncateText(prayer.request, 120) }}</p>
                              
                              <div v="if prayer.status === 'answered'" class="mt-2">
                                <div class="alert alert-success py-2 mb-0">
                                  <i class="bi bi-check-circle me-2"></i>
                                  <strong>Answered Prayer!</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ministry Reports -->
            <div v-if="activeSection === 'ministry'" class="section-content">
              <div class="row g-4">
                <div v-for="ministry in ministryReports" :key="ministry.name" class="col-lg-4">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0">
                      <h5 class="fw-bold mb-0">{{ ministry.name }}</h5>
                    </div>
                    <div class="card-body">
                      <div class="ministry-stats">
                        <div class="stat-item mb-3">
                          <div class="d-flex justify-content-between">
                            <span>Participants</span>
                            <strong class="church-purple">{{ ministry.participants }}</strong>
                          </div>
                        </div>
                        <div class="stat-item mb-3">
                          <div class="d-flex justify-content-between">
                            <span>Monthly Budget</span>
                            <strong class="text-success">₱{{ ministry.budget.toLocaleString() }}</strong>
                          </div>
                        </div>
                        <div class="stat-item mb-3">
                          <div class="d-flex justify-content-between">
                            <span>Spent This Month</span>
                            <strong class="text-danger">₱{{ ministry.spent.toLocaleString() }}</strong>
                          </div>
                        </div>
                        <div class="progress mb-3" style="height: 8px;">
                          <div 
                            class="progress-bar bg-success" 
                            :style="{ width: (ministry.spent / ministry.budget) * 100 + '%' }"
                          ></div>
                        </div>
                      </div>
                      
                      <div class="ministry-updates">
                        <h6 class="fw-bold mb-2">Recent Updates</h6>
                        <ul class="list-unstyled small">
                          <li v-for="update in ministry.updates" :key="update" class="mb-1">
                            <i class="bi bi-chevron-right me-2 text-muted"></i>
                            {{ update }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Budget Forecast -->
            <div v-if="activeSection === 'forecast'" class="section-content">
              <div class="row g-4">
                <div class="col-12">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0">
                      <h5 class="fw-bold mb-0">6-Month Budget Forecast</h5>
                    </div>
                    <div class="card-body">
                      <canvas id="forecastChart" style="max-height: 350px;"></canvas>
                      
                      <div class="forecast-summary mt-4">
                        <div class="row g-4">
                          <div class="col-md-6">
                            <div class="card bg-light border-0">
                              <div class="card-body text-center">
                                <h5 class="fw-bold text-success">₱{{ projectedIncome.toLocaleString() }}</h5>
                                <p class="mb-0 text-muted">Projected 6-Month Income</p>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="card bg-light border-0">
                              <div class="card-body text-center">
                                <h5 class="fw-bold text-danger">₱{{ projectedExpenses.toLocaleString() }}</h5>
                                <p class="mb-0 text-muted">Projected 6-Month Expenses</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div class="mt-4 p-3 rounded" :class="projectedNet >= 0 ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'">
                          <h6 class="fw-bold mb-2" :class="projectedNet >= 0 ? 'text-success' : 'text-danger'">
                            <i class="bi bi-graph-up me-2" v-if="projectedNet >= 0"></i>
                            <i class="bi bi-graph-down me-2" v-else></i>
                            Projected Net: ₱{{ projectedNet.toLocaleString() }}
                          </h6>
                          <p class="mb-0 small">
                            {{ projectedNet >= 0 ? 
                                'The church is projected to have a healthy surplus over the next 6 months.' : 
                                'The church may face financial challenges. Consider increasing fundraising efforts or reducing expenses.' 
                            }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Verification Section -->
            <div v-if="activeSection === 'payments'" class="section-content">
              <div class="row">
                <div class="col-12">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0">
                      <div class="d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold mb-0">Payment Verification</h5>
                        <div class="d-flex gap-2">
                          <span class="badge bg-warning">{{ pendingPaymentsCount }} Pending</span>
                          <span class="badge bg-success">{{ approvedPaymentsCount }} Approved</span>
                        </div>
                      </div>
                    </div>
                    <div class="card-body">
                      <div v-if="allPayments.length === 0" class="text-center text-muted py-4">
                        <i class="bi bi-credit-card display-4 opacity-25"></i>
                        <p class="mt-2 mb-0">No payments to review</p>
                      </div>
                      
                      <div v-else>
                        <!-- Filter Tabs -->
                        <ul class="nav nav-tabs mb-3">
                          <li class="nav-item">
                            <button 
                              class="nav-link"
                              :class="{ active: paymentFilter === 'pending' }"
                              @click="paymentFilter = 'pending'"
                            >
                              Pending Review ({{ pendingPayments.length }})
                            </button>
                          </li>
                          <li class="nav-item">
                            <button 
                              class="nav-link"
                              :class="{ active: paymentFilter === 'all' }"
                              @click="paymentFilter = 'all'"
                            >
                              All Payments ({{ allPayments.length }})
                            </button>
                          </li>
                        </ul>

                        <!-- Payment List -->
                        <div class="payment-verification-list">
                          <div 
                            v-for="payment in filteredPayments" 
                            :key="payment.id"
                            class="payment-verification-item border rounded p-3 mb-3"
                            :class="{
                              'border-warning bg-warning bg-opacity-10': payment.verificationStatus === 'pending',
                              'border-success bg-success bg-opacity-10': payment.verificationStatus === 'approved',
                              'border-danger bg-danger bg-opacity-10': payment.verificationStatus === 'rejected'
                            }"
                          >
                            <div class="row">
                              <div class="col-md-8">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                  <h6 class="fw-bold mb-1">
                                    ₱{{ payment.amount.toFixed(2) }} - {{ payment.giftNotes || 'Gift Payment' }}
                                  </h6>
                                  <span 
                                    class="badge"
                                    :class="{
                                      'bg-warning': payment.verificationStatus === 'pending',
                                      'bg-success': payment.verificationStatus === 'approved',
                                      'bg-danger': payment.verificationStatus === 'rejected'
                                    }"
                                  >
                                    {{ getVerificationStatusText(payment.verificationStatus) }}
                                  </span>
                                </div>
                                
                                <p class="mb-1 small">
                                  <strong>Member:</strong> {{ payment.memberName }}
                                  <span class="text-muted ms-2">• Due: {{ formatDate(payment.dueDate) }}</span>
                                  <span v-if="payment.paymentDate" class="text-muted">
                                    • Paid: {{ formatDate(payment.paymentDate) }}
                                  </span>
                                </p>
                                
                                <p class="mb-1 small">
                                  <i class="bi bi-credit-card me-1" v-if="payment.paymentMethod === 'online'"></i>
                                  <i class="bi bi-cash me-1" v-if="payment.paymentMethod === 'cash'"></i>
                                  <span class="text-capitalize">{{ payment.paymentMethod }}</span>
                                  
                                  <span v-if="payment.paymentMethod === 'cash' && payment.referenceNumber" class="text-muted ms-2">
                                    Ref: {{ payment.referenceNumber }}
                                  </span>
                                  <span v-if="payment.paymentMethod === 'online' && payment.receiptFileName" class="text-muted ms-2">
                                    Receipt: {{ payment.receiptFileName }}
                                  </span>
                                </p>
                                
                                <p v-if="payment.notes" class="mb-1 small text-muted">
                                  <i class="bi bi-chat-text me-1"></i>
                                  {{ payment.notes }}
                                </p>
                              </div>
                              
                              <div class="col-md-4 text-end">
                                <div v-if="payment.verificationStatus === 'pending'" class="d-flex flex-column gap-2">
                                  <button 
                                    class="btn btn-sm btn-success"
                                    @click="verifyPayment(payment.giftId, payment.id, 'approved')"
                                  >
                                    <i class="bi bi-check-circle me-1"></i>
                                    Approve
                                  </button>
                                  <button 
                                    class="btn btn-sm btn-danger"
                                    @click="verifyPayment(payment.giftId, payment.id, 'rejected')"
                                  >
                                    <i class="bi bi-x-circle me-1"></i>
                                    Reject
                                  </button>
                                  <button 
                                    v-if="payment.receiptFileName" 
                                    class="btn btn-sm btn-outline-primary"
                                    @click="viewReceipt(payment)"
                                  >
                                    <i class="bi bi-eye me-1"></i>
                                    View Receipt
                                  </button>
                                </div>
                                
                                <div v-else-if="payment.verificationStatus === 'approved'" class="small text-success">
                                  <i class="bi bi-check-circle me-1"></i>
                                  Approved by {{ payment.verifiedBy }}<br>
                                  <span class="text-muted">{{ formatDate(payment.verifiedDate) }}</span>
                                </div>
                                
                                <div v-else-if="payment.verificationStatus === 'rejected'" class="small text-danger">
                                  <i class="bi bi-x-circle me-1"></i>
                                  Rejected by {{ payment.verifiedBy }}<br>
                                  <span class="text-muted">{{ formatDate(payment.verifiedDate) }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Newsletter Management Section -->
            <div v-if="activeSection === 'newsletters'" class="section-content">
              <div class="row g-4">
                <!-- Upload New Newsletter -->
                <div class="col-lg-8">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0">
                      <h5 class="fw-bold mb-0">Upload Monthly Newsletter</h5>
                    </div>
                    <div class="card-body">
                      <form @submit.prevent="uploadNewsletter">
                        <div class="row g-3">
                          <div class="col-md-6">
                            <label for="newsletterTitle" class="form-label fw-bold">Newsletter Title</label>
                            <input 
                              type="text" 
                              class="form-control" 
                              id="newsletterTitle"
                              v-model="newNewsletter.title"
                              placeholder="e.g., November 2025 - Thanksgiving Blessings"
                              required
                            >
                          </div>
                          <div class="col-md-6">
                            <label for="newsletterDate" class="form-label fw-bold">Publication Date</label>
                            <input 
                              type="date" 
                              class="form-control" 
                              id="newsletterDate"
                              v-model="newNewsletter.date"
                              required
                            >
                          </div>
                          <div class="col-12">
                            <label for="newsletterExcerpt" class="form-label fw-bold">Brief Description</label>
                            <textarea 
                              class="form-control" 
                              id="newsletterExcerpt"
                              v-model="newNewsletter.excerpt"
                              rows="2"
                              placeholder="Brief description of this month's newsletter content"
                              required
                            ></textarea>
                          </div>
                          <div class="col-md-6">
                            <label for="newsletterCover" class="form-label fw-bold">Cover Image</label>
                            <input 
                              type="file" 
                              class="form-control" 
                              id="newsletterCover"
                              @change="handleCoverUpload"
                              accept="image/*"
                            >
                            <div class="form-text">Optional: Upload a cover image for the newsletter</div>
                          </div>
                          <div class="col-md-6">
                            <label for="newsletterPdf" class="form-label fw-bold">Newsletter PDF *</label>
                            <input 
                              type="file" 
                              class="form-control" 
                              id="newsletterPdf"
                              @change="handlePdfUpload"
                              accept=".pdf"
                              required
                            >
                            <div class="form-text">Upload the monthly newsletter PDF file</div>
                          </div>
                          <div class="col-12">
                            <label for="newsletterHighlights" class="form-label fw-bold">Monthly Highlights</label>
                            <div class="input-group mb-2">
                              <input 
                                type="text" 
                                class="form-control" 
                                v-model="highlightInput"
                                placeholder="Add a highlight (e.g., Special service on November 15th)"
                                @keyup.enter="addHighlight"
                              >
                              <button 
                                type="button" 
                                class="btn btn-outline-primary"
                                @click="addHighlight"
                              >
                                <i class="bi bi-plus"></i>
                                Add
                              </button>
                            </div>
                            <div class="highlights-list">
                              <div 
                                v-for="(highlight, index) in newNewsletter.highlights" 
                                :key="index"
                                class="d-flex align-items-center justify-content-between bg-light rounded p-2 mb-1"
                              >
                                <span class="small">{{ highlight }}</span>
                                <button 
                                  type="button" 
                                  class="btn btn-sm btn-outline-danger"
                                  @click="removeHighlight(index)"
                                >
                                  <i class="bi bi-x"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="col-12">
                            <button 
                              type="submit" 
                              class="btn btn-primary"
                              :disabled="isUploading"
                            >
                              <i class="bi bi-upload me-2"></i>
                              {{ isUploading ? 'Uploading...' : 'Upload Newsletter' }}
                            </button>
                            <button 
                              type="button" 
                              class="btn btn-outline-secondary ms-2"
                              @click="resetForm"
                            >
                              <i class="bi bi-arrow-clockwise me-2"></i>
                              Reset Form
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <!-- Current Newsletters -->
                <div class="col-lg-4">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0">
                      <h5 class="fw-bold mb-0">Published Newsletters</h5>
                    </div>
                    <div class="card-body">
                      <div v-if="publishedNewsletters.length === 0" class="text-center text-muted py-3">
                        <i class="bi bi-newspaper display-4 opacity-25"></i>
                        <p class="mt-2 mb-0">No newsletters published yet</p>
                      </div>
                      <div v-else class="newsletter-list">
                        <div 
                          v-for="newsletter in publishedNewsletters" 
                          :key="newsletter.id"
                          class="newsletter-item border rounded p-3 mb-3"
                        >
                          <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="fw-bold mb-1">{{ newsletter.title }}</h6>
                            <div class="dropdown">
                              <button 
                                class="btn btn-sm btn-outline-secondary dropdown-toggle"
                                type="button"
                                :id="`newsletter-${newsletter.id}`"
                                data-bs-toggle="dropdown"
                              >
                                <i class="bi bi-three-dots"></i>
                              </button>
                              <ul class="dropdown-menu">
                                <li>
                                  <button 
                                    class="dropdown-item"
                                    @click="viewNewsletter(newsletter)"
                                  >
                                    <i class="bi bi-eye me-2"></i>
                                    View PDF
                                  </button>
                                </li>
                                <li>
                                  <button 
                                    class="dropdown-item text-danger"
                                    @click="deleteNewsletter(newsletter.id)"
                                  >
                                    <i class="bi bi-trash me-2"></i>
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <p class="small text-muted mb-2">{{ formatDate(newsletter.date) }}</p>
                          <p class="small mb-2">{{ newsletter.excerpt }}</p>
                          <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-primary">Issue #{{ newsletter.issueNumber }}</span>
                            <span class="small text-muted">{{ newsletter.pageCount || 'N/A' }} pages</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, logout } from '../utils/auth'

const router = useRouter()

const activeSection = ref('finance')
const user = getCurrentUser()

// Payment verification variables
const paymentFilter = ref('pending')
const allPayments = ref([])
const pendingPayments = computed(() => 
  allPayments.value.filter(p => p.verificationStatus === 'pending')
)
const approvedPaymentsCount = computed(() => 
  allPayments.value.filter(p => p.verificationStatus === 'approved').length
)
const pendingPaymentsCount = computed(() => pendingPayments.value.length)

const filteredPayments = computed(() => {
  if (paymentFilter.value === 'pending') {
    return pendingPayments.value
  }
  return allPayments.value
})

// Mock financial data
const currentMonth = ref('October 2024')

const incomeData = ref([
  { category: 'Tithes & Offerings', amount: 38500 },
  { category: 'Special Donations', amount: 4750 },
  { category: 'Fundraising Events', amount: 2200 },
  { category: 'Investment Returns', amount: 800 },
  { category: 'Other Income', amount: 500 }
])

const expenseData = ref([
  { category: 'Staff & Benefits', amount: 25200 },
  { category: 'Facilities & Utilities', amount: 8400 },
  { category: 'Ministries & Programs', amount: 6300 },
  { category: 'Missions Support', amount: 4200 },
  { category: 'Administrative', amount: 2200 },
  { category: 'Maintenance', amount: 1800 }
])

const sharedPrayers = ref([
  {
    id: 1,
    title: 'Healing for Sarah Johnson',
    category: 'Health',
    request: 'Please pray for Sarah as she recovers from surgery. Pray for complete healing and strength during this time.',
    requestedBy: 'Mark Johnson',
    dateRequested: '2024-10-12',
    status: 'active'
  },
  {
    id: 2,
    title: 'Mission Trip Safety',
    category: 'Missions',
    request: 'Our youth mission team is traveling to Guatemala next week. Please pray for their safety and for hearts to be touched.',
    requestedBy: 'Pastor Michael',
    dateRequested: '2024-10-10',
    status: 'active'
  },
  {
    id: 3,
    title: 'New Job Opportunity',
    category: 'Work',
    request: 'I have an important job interview coming up. Please pray for wisdom and favor.',
    requestedBy: 'Lisa Chen',
    dateRequested: '2024-10-08',
    status: 'answered'
  },
  {
    id: 4,
    title: 'Small Groups',
    category: 'Discipleship',
    request: 'Pray for our upcoming community food drive and that we can serve those in need effectively.',
    requestedBy: 'David Martinez',
    dateRequested: '2024-10-05',
    status: 'active'
  }
])

const ministryReports = ref([
  {
    name: 'Children\'s Ministry',
    participants: 65,
    budget: 2500,
    spent: 2100,
    updates: [
      'VBS planning is underway for next summer',
      'New volunteer training scheduled for November',
      'Added 8 new children this month'
    ]
  },
  {
    name: 'Youth Ministry',
    participants: 45,
    budget: 3200,
    spent: 2800,
    updates: [
      'Fall retreat was a huge success with 38 attendees',
      'Planning Christmas service project',
      'Youth band is preparing special Christmas music'
    ]
  },
  {
    name: 'Worship Ministry',
    participants: 25,
    budget: 1800,
    spent: 1400,
    updates: [
      'New sound equipment installed successfully',
      'Christmas concert rehearsals begin November 1st',
      'Added two new worship team members'
    ]
  },
  {
    name: 'Missions Ministry',
    participants: 30,
    budget: 4200,
    spent: 3900,
    updates: [
      'Supported 3 new missionaries this month',
      'Guatemala mission trip raised ₱8,000',
      'Local food bank partnership established'
    ]
  },
  {
    name: 'Adult Education',
    participants: 85,
    budget: 800,
    spent: 650,
    updates: [
      'New Bible study series on Romans started',
      'Men\'s breakfast attendance up 20%',
      'Women\'s retreat planning in progress'
    ]
  },
  {
    name: 'Community Outreach',
    participants: 40,
    budget: 2000,
    spent: 1750,
    updates: [
      'Served 150 families at food distribution',
      'Partnered with local homeless shelter',
      'Community garden project launched'
    ]
  }
])

// Newsletter Management
const publishedNewsletters = ref([
  {
    id: 1,
    title: 'October 2025 - Harvest Blessings',
    date: '2025-10-01',
    excerpt: 'Celebrating God\'s abundant harvest with thanksgiving, community service, and special events throughout October.',
    issueNumber: 22,
    pageCount: 12,
    publishedBy: 'Pastor Michael',
    coverImage: '/newsletter-covers/october-2025.jpg',
    downloadUrl: '/newsletters/october-2025.pdf',
    highlights: [
      'Harvest Thanksgiving Service - October 27th',
      'Community Food Drive - Goal: 1,500 items',
      'New Member Classes starting November',
      'Youth Fall Retreat - October 15th',
      'Trunk or Treat Event - October 31st'
    ]
  },
  {
    id: 2,
    title: 'September 2025 - Back to School',
    date: '2025-09-01',
    excerpt: 'Starting the new season with renewed faith, education ministry updates, and preparing for fall activities.',
    issueNumber: 21,
    pageCount: 10,
    publishedBy: 'Pastor Michael',
    coverImage: '/newsletter-covers/september-2025.jpg',
    downloadUrl: '/newsletters/september-2025.pdf',
    highlights: [
      'Back to School Blessing Service',
      'Sunday School Teacher Training',
      'Fall Ministry Launch',
      'Youth Group Kickoff',
      'Small Groups Registration'
    ]
  },
  {
    id: 3,
    title: 'August 2025 - Summer Reflections',
    date: '2025-08-01',
    excerpt: 'Reflecting on a wonderful summer of ministry, missions, and memorable moments in our church family.',
    issueNumber: 20,
    pageCount: 14,
    publishedBy: 'Pastor Michael',
    coverImage: '/newsletter-covers/august-2025.jpg',
    downloadUrl: '/newsletters/august-2025.pdf',
    highlights: [
      'Summer Mission Trip Testimonies',
      'VBS 2024 Success Stories',
      'Church Picnic Highlights',
      'Baptism Celebrations',
      'Facility Improvement Updates'
    ]
  }
])

const newNewsletter = ref({
  title: '',
  date: '',
  excerpt: '',
  highlights: [],
  coverFile: null,
  pdfFile: null
})

const highlightInput = ref('')
const isUploading = ref(false)

// Newsletter Functions
const addHighlight = () => {
  if (highlightInput.value.trim()) {
    newNewsletter.value.highlights.push(highlightInput.value.trim())
    highlightInput.value = ''
  }
}

const removeHighlight = (index) => {
  newNewsletter.value.highlights.splice(index, 1)
}

const handleCoverUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newNewsletter.value.coverFile = file
  }
}

const handlePdfUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newNewsletter.value.pdfFile = file
  }
}

const uploadNewsletter = async () => {
  isUploading.value = true
  
  try {
    // In a real app, this would upload files to server
    // For demo, we'll simulate the upload and add to local data
    
    const newIssueNumber = Math.max(...publishedNewsletters.value.map(n => n.issueNumber)) + 1
    
    const newsletter = {
      id: Date.now(),
      title: newNewsletter.value.title,
      date: newNewsletter.value.date,
      excerpt: newNewsletter.value.excerpt,
      highlights: [...newNewsletter.value.highlights],
      issueNumber: newIssueNumber,
      pageCount: null, // Would be extracted from PDF
      publishedBy: user?.name || 'Admin',
      coverImage: newNewsletter.value.coverFile ? `/newsletter-covers/${Date.now()}.jpg` : null,
      downloadUrl: `/newsletters/${Date.now()}.pdf`
    }
    
    publishedNewsletters.value.unshift(newsletter)
    
    // Save to localStorage
    localStorage.setItem('churchNewsletters', JSON.stringify(publishedNewsletters.value))
    
    alert('Newsletter uploaded successfully!')
    resetForm()
    
  } catch (error) {
    console.error('Error uploading newsletter:', error)
    alert('Error uploading newsletter. Please try again.')
  } finally {
    isUploading.value = false
  }
}

const resetForm = () => {
  newNewsletter.value = {
    title: '',
    date: '',
    excerpt: '',
    highlights: [],
    coverFile: null,
    pdfFile: null
  }
  highlightInput.value = ''
  
  // Reset file inputs
  const coverInput = document.getElementById('newsletterCover')
  const pdfInput = document.getElementById('newsletterPdf')
  if (coverInput) coverInput.value = ''
  if (pdfInput) pdfInput.value = ''
}

const viewNewsletter = (newsletter) => {
  // Open PDF in new tab
  if (newsletter.downloadUrl) {
    window.open(newsletter.downloadUrl, '_blank')
  }
}

const deleteNewsletter = (id) => {
  if (confirm('Are you sure you want to delete this newsletter?')) {
    const index = publishedNewsletters.value.findIndex(n => n.id === id)
    if (index > -1) {
      publishedNewsletters.value.splice(index, 1)
      localStorage.setItem('churchNewsletters', JSON.stringify(publishedNewsletters.value))
      alert('Newsletter deleted successfully!')
    }
  }
}

// Computed values
const totalIncome = computed(() => {
  return incomeData.value.reduce((sum, item) => sum + item.amount, 0)
})

const totalExpenses = computed(() => {
  return expenseData.value.reduce((sum, item) => sum + item.amount, 0)
})

const netIncome = computed(() => {
  return totalIncome.value - totalExpenses.value
})

const memberCount = ref(247)

const ytdIncome = ref(510000)
const ytdExpenses = ref(465000)
const ytdNet = computed(() => ytdIncome.value - ytdExpenses.value)

const projectedIncome = ref(285000)
const projectedExpenses = ref(280000)
const projectedNet = computed(() => projectedIncome.value - projectedExpenses.value)

const getPrayerCategoryClass = (category) => {
  const classes = {
    'Health': 'bg-danger',
    'Family': 'bg-primary',
    'Work': 'bg-info',
    'Missions': 'bg-dark',
    'Community': 'bg-secondary'
  }
  return classes[category] || 'bg-secondary'
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Load all payments from localStorage for verification
const loadAllPayments = () => {
  const allGifts = []
  
  // Get all users' gifts from localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('gcbf_gifts_')) {
      const userId = key.replace('gcbf_gifts_', '')
      const userGifts = JSON.parse(localStorage.getItem(key) || '[]')
      allGifts.push(...userGifts.map(gift => ({ ...gift, userId })))
    }
  }
  
  // Extract all payments with user info
  const payments = []
  allGifts.forEach(gift => {
    if (gift.payments && gift.payments.length > 0) {
      gift.payments.forEach(payment => {
        payments.push({
          ...payment,
          giftId: gift.id,
          giftNotes: gift.notes,
          memberName: getUserName(gift.userId),
          userId: gift.userId
        })
      })
    }
  })
  
  allPayments.value = payments.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
}

// Get user name by ID (mock function)
const getUserName = (userId) => {
  const users = JSON.parse(localStorage.getItem('gcbf_users') || '[]')
  const user = users.find(u => u.id === userId)
  return user?.name || 'Unknown User'
}

// Verify payment (approve or reject)
const verifyPayment = (giftId, paymentId, status) => {
  // Find the gift in localStorage
  const allGifts = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('gcbf_gifts_')) {
      const userGifts = JSON.parse(localStorage.getItem(key) || '[]')
      const gift = userGifts.find(g => g.id === giftId)
      if (gift) {
        const payment = gift.payments.find(p => p.id === paymentId)
        if (payment) {
          payment.verificationStatus = status
          payment.verifiedBy = user?.name || 'Admin'
          payment.verifiedDate = new Date().toISOString().split('T')[0]
          
          // Save back to localStorage
          localStorage.setItem(key, JSON.stringify(userGifts))
          break
        }
      }
    }
  }
  
  // Reload payments
  loadAllPayments()
}

// View receipt (placeholder function)
const viewReceipt = (payment) => {
  alert(`Receipt: ${payment.receiptFileName}\n\nThis would open the receipt in a modal or new window.`)
}

// Get verification status text
const getVerificationStatusText = (status) => {
  switch(status) {
    case 'approved': return 'Approved'
    case 'pending': return 'Pending Review'
    case 'rejected': return 'Rejected'
    case 'pending_payment': return 'Payment Due'
    default: return 'Unknown'
  }
}

onMounted(() => {
  // In a real app, you would initialize charts here using Chart.js or similar
  console.log('Church Portal loaded - Charts would be initialized here')
  
  // Load all payments for verification
  loadAllPayments()
  
  // Load existing newsletters from localStorage
  try {
    const savedNewsletters = localStorage.getItem('churchNewsletters')
    if (savedNewsletters) {
      publishedNewsletters.value = JSON.parse(savedNewsletters)
    }
  } catch (error) {
    console.error('Error loading newsletters from localStorage:', error)
  }
})
</script>

<style scoped>
.nav-pills .nav-link {
  border-radius: 25px;
  margin-right: 0.5rem;
  color: #6c757d;
  font-weight: 500;
}

.nav-pills .nav-link.active {
  background-color: #C96868;
  color: white;
}

.nav-pills .nav-link:hover {
  color: #C96868;
}

.prayer-card {
  transition: transform 0.2s ease;
}

.prayer-card:hover {
  transform: translateY(-2px);
}

.stat-item {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.stat-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.ministry-updates ul li {
  border-bottom: 1px solid #f8f9fa;
  padding: 0.25rem 0;
}

.ministry-updates ul li:last-child {
  border-bottom: none;
}

.section-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
}
</style>