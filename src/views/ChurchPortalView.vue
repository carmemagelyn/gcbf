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
              <h5 class="mt-2 mb-0">{{ allUsers.length }}</h5>
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
                Monthly Reports
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link"
                :class="{ active: activeSection === 'expenses' }"
                @click="activeSection = 'expenses'"
              >
                <i class="bi bi-receipt me-2"></i>
                Monthly Budget
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
                :class="{ active: activeSection === 'newsletters' }"
                @click="activeSection = 'newsletters'"
              >
                <i class="bi bi-newspaper me-2"></i>
                Newsletter Management
              </button>
            </li>
            <li v-if="user?.userType === 'admin'" class="nav-item">
              <button 
                class="nav-link"
                :class="{ active: activeSection === 'prayers' }"
                @click="activeSection = 'prayers'"
              >
                <i class="bi bi-heart me-2"></i>
                Shared Prayers
                <span v-if="pendingPrayers.length > 0" class="badge bg-warning ms-1">
                  {{ pendingPrayers.length }}
                </span>
              </button>
            </li>
            <li v-if="user?.userType === 'admin'" class="nav-item">
              <button 
                class="nav-link"
                :class="{ active: activeSection === 'accounts' }"
                @click="activeSection = 'accounts'"
              >
                <i class="bi bi-people-fill me-2"></i>
                Manage Accounts
                <span class="badge bg-info ms-1">{{ allUsers.length }}</span>
              </button>
            </li>
          </ul>

          <!-- Section Content -->
          <div class="tab-content">
            <!-- Financial Reports -->
            <div v-if="activeSection === 'finance'" class="section-content">
              <div class="row g-4">
                <!-- Monthly Summary Card -->
                <div class="col-12">
                  <div class="card border-0 shadow-sm">
                    <div class="card-body">
                      <div class="alert alert-info mb-0">
                        <div class="d-flex align-items-center">
                          <i class="bi bi-info-circle me-2"></i>
                          <div>
                            <strong>Note:</strong> Financial Reports are automatically synced from your Monthly Budget. 
                            Tithes & Offerings includes verified payments (₱{{ totalVerifiedPaymentsThisMonth.toLocaleString() }}) 
                            + Sunday collections (₱{{ totalSundayCollection.toLocaleString() }}).
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Income Breakdown -->
                <div class="col-lg-6">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-success bg-opacity-10 border-0">
                      <div class="d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold mb-0 text-success">
                          <i class="bi bi-cash-stack me-2"></i>Income Breakdown
                        </h5>
                        <span class="badge bg-success">{{ currentMonth }}</span>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="income-details">
                        <div v-for="(income, index) in incomeData" :key="income.category" 
                             class="income-item border-bottom pb-3 mb-3"
                             :class="{ 'border-0 pb-0 mb-0': index === incomeData.length - 1 }">
                          <div class="d-flex justify-content-between align-items-start mb-2">
                            <div class="d-flex flex-column">
                              <span class="fw-bold">{{ income.category }}</span>
                              <small v-if="income.category === 'Tithes & Offerings'" class="text-muted">
                                <i class="bi bi-check-circle-fill text-success me-1"></i>
                                Verified Payments: ₱{{ totalVerifiedPaymentsThisMonth.toLocaleString() }}<br>
                                <i class="bi bi-cash me-1"></i>
                                Sunday Collections: ₱{{ totalSundayCollection.toLocaleString() }}
                              </small>
                            </div>
                            <strong class="text-success fs-5">
                              ₱{{ (income.category === 'Tithes & Offerings' ? totalVerifiedPaymentsThisMonth + totalSundayCollection : income.amount).toLocaleString() }}
                            </strong>
                          </div>
                          <div v-if="income.category === 'Tithes & Offerings'" class="progress" style="height: 8px;">
                            <div class="progress-bar bg-success" 
                                 :style="{ width: ((totalVerifiedPaymentsThisMonth / (totalVerifiedPaymentsThisMonth + totalSundayCollection)) * 100) + '%' }"
                                 :title="'Verified: ' + ((totalVerifiedPaymentsThisMonth / (totalVerifiedPaymentsThisMonth + totalSundayCollection)) * 100).toFixed(1) + '%'">
                            </div>
                            <div class="progress-bar bg-info" 
                                 :style="{ width: ((totalSundayCollection / (totalVerifiedPaymentsThisMonth + totalSundayCollection)) * 100) + '%' }"
                                 :title="'Sunday: ' + ((totalSundayCollection / (totalVerifiedPaymentsThisMonth + totalSundayCollection)) * 100).toFixed(1) + '%'">
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Total Income -->
                      <div class="mt-4 pt-3 border-top">
                        <div class="d-flex justify-content-between align-items-center">
                          <h6 class="fw-bold mb-0">Total Monthly Income:</h6>
                          <h4 class="text-success fw-bold mb-0">₱{{ totalIncome.toLocaleString() }}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Expense Breakdown -->
                <div class="col-lg-6">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-danger bg-opacity-10 border-0">
                      <div class="d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold mb-0 text-danger">
                          <i class="bi bi-wallet2 me-2"></i>Expense Breakdown
                        </h5>
                        <span class="badge bg-danger">{{ currentMonth }}</span>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="expense-details">
                        <div v-for="(expense, index) in expenseData" :key="expense.category" 
                             class="expense-item border-bottom pb-3 mb-3"
                             :class="{ 'border-0 pb-0 mb-0': index === expenseData.length - 1 }">
                          <div class="d-flex justify-content-between align-items-start mb-2">
                            <div class="d-flex flex-column">
                              <span class="fw-bold">{{ expense.category }}</span>
                              <small v-if="expense.category === 'Ministries & Programs'" class="text-muted">
                                <i class="bi bi-people-fill me-1"></i>
                                Total Ministry Budget: ₱{{ totalMinistryBudget.toLocaleString() }}
                              </small>
                            </div>
                            <strong class="text-danger fs-5">
                              ₱{{ expense.amount.toLocaleString() }}
                            </strong>
                          </div>
                          <div class="progress" style="height: 8px;">
                            <div class="progress-bar bg-danger" 
                                 :style="{ width: ((expense.amount / totalExpenses) * 100) + '%' }"
                                 :title="((expense.amount / totalExpenses) * 100).toFixed(1) + '%'">
                            </div>
                          </div>
                          <small class="text-muted">
                            {{ ((expense.amount / totalExpenses) * 100).toFixed(1) }}% of total expenses
                          </small>
                        </div>
                      </div>
                      
                      <!-- Total Expenses -->
                      <div class="mt-4 pt-3 border-top">
                        <div class="d-flex justify-content-between align-items-center">
                          <h6 class="fw-bold mb-0">Total Monthly Expenses:</h6>
                          <h4 class="text-danger fw-bold mb-0">₱{{ totalExpenses.toLocaleString() }}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Net Income Card -->
                <div class="col-12">
                  <div class="card border-0 shadow-sm" :class="netIncome >= 0 ? 'bg-success bg-opacity-10' : 'bg-warning bg-opacity-10'">
                    <div class="card-body">
                      <div class="row align-items-center">
                        <div class="col-md-8">
                          <h5 class="fw-bold mb-2" :class="netIncome >= 0 ? 'text-success' : 'text-warning'">
                            <i class="bi bi-calculator me-2"></i>
                            Net Income for {{ currentMonth }}
                          </h5>
                          <p class="mb-0 text-muted">
                            {{ netIncome >= 0 ? 
                               'The church has a surplus this month. Consider allocating funds to savings or special projects.' : 
                               'The church is operating at a deficit this month. Review expenses and consider increasing income sources.' 
                            }}
                          </p>
                        </div>
                        <div class="col-md-4 text-md-end mt-3 mt-md-0">
                          <h2 class="fw-bold mb-0" :class="netIncome >= 0 ? 'text-success' : 'text-warning'">
                            ₱{{ netIncome.toLocaleString() }}
                          </h2>
                          <small class="text-muted">
                            {{ netIncome >= 0 ? 'Surplus' : 'Deficit' }}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Monthly Trend -->
                <div class="col-12">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0">
                      <h5 class="fw-bold mb-0">Monthly Financial Trend</h5>
                      <p class="mb-0 text-muted small">6 months graph of income and expenses</p>
                    </div>
                    <div class="card-body">
                      <!-- 6 Month Trend Chart -->
                      <div>
                        <h6 class="fw-bold mb-3">6-Month Income vs Expenses Trend</h6>
                        <canvas id="monthlyTrendChart" style="width: 100%; max-height: 400px;"></canvas>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Ministry Attendance Trend -->
                <div class="col-12">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0">
                      <h5 class="fw-bold mb-0">Ministry Attendance Trend</h5>
                      <p class="mb-0 text-muted small">6 months attendance tracking for ministries</p>
                    </div>
                    <div class="card-body">
                      <div>
                        <h6 class="fw-bold mb-3">Worship, Bible Night Class & Small Groups Attendance</h6>
                        <canvas id="attendanceChart" style="width: 100%; max-height: 400px;"></canvas>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shared Prayers -->
            <div v-if="activeSection === 'prayers'" class="section-content">
              <!-- Pending Prayers for Admin Approval -->
              <div class="row g-4 mb-4" v-if="user?.userType === 'admin' && pendingPrayers.length > 0">
                <div class="col-12">
                  <div class="card border-warning border-2 shadow-sm">
                    <div class="card-header bg-warning bg-opacity-10 border-0 d-flex justify-content-between align-items-center">
                      <h5 class="fw-bold mb-0">
                        <i class="bi bi-exclamation-circle me-2"></i>
                        Prayers Pending Approval
                      </h5>
                      <span class="badge bg-warning">{{ pendingPrayers.length }} pending</span>
                    </div>
                    <div class="card-body">
                      <div class="row g-3">
                        <div v-for="prayer in pendingPrayers" :key="prayer.id" class="col-lg-6">
                          <div class="prayer-card card border-warning">
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
                              <p class="card-text small">{{ prayer.request }}</p>
                              
                              <div class="d-flex gap-2 mt-3">
                                <button class="btn btn-sm btn-success flex-fill" @click="approvePrayer(prayer.id)">
                                  <i class="bi bi-check-circle me-1"></i>
                                  Approve
                                </button>
                                <button class="btn btn-sm btn-danger flex-fill" @click="rejectPrayer(prayer.id)">
                                  <i class="bi bi-x-circle me-1"></i>
                                  Reject
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

              <!-- Approved Community Prayer Requests -->
              <div class="row g-4">
                <div class="col-12">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                      <h5 class="fw-bold mb-0">Community Prayer Requests</h5>
                      <div class="d-flex gap-2 align-items-center">
                        <span class="badge bg-primary">{{ approvedPrayers.length }} active prayers</span>
                        <button v-if="user?.userType === 'admin'" class="btn btn-sm btn-primary" @click="showAddCommunityPrayerModal = true">
                          <i class="bi bi-plus-circle me-1"></i>
                          Add Prayer
                        </button>
                      </div>
                    </div>
                    <div class="card-body">
                      <div v-if="approvedPrayers.length === 0" class="text-center py-4">
                        <i class="bi bi-heart display-4 opacity-25"></i>
                        <p class="mt-3 text-muted">No shared prayer requests at this time</p>
                      </div>

                      <div v-else class="row g-3">
                        <div v-for="prayer in approvedPrayers" :key="prayer.id" class="col-lg-6">
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
                              
                              <div v-if="prayer.status === 'answered'" class="mt-2">
                                <div class="alert alert-success py-2 mb-0">
                                  <i class="bi bi-check-circle me-2"></i>
                                  <strong>Answered Prayer!</strong>
                                </div>
                              </div>
                              
                              <div v-if="user?.userType === 'admin'" class="mt-3">
                                <button class="btn btn-sm btn-outline-danger" @click="removePrayer(prayer.id)">
                                  <i class="bi bi-trash me-1"></i>
                                  Remove
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
            </div>

            <!-- Ministry Reports -->
            <div v-if="activeSection === 'ministry'" class="section-content">
              <div class="row g-4">
                <div v-for="ministry in ministryReports" :key="ministry.name" class="col-lg-6">
                  <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                      <h5 class="fw-bold mb-0">{{ ministry.name }}</h5>
                      <div class="d-flex gap-2">
                        <button v-if="user?.userType === 'admin'" class="btn btn-sm btn-outline-success" @click="showAddAttendance(ministry)">
                          <i class="bi bi-plus-circle"></i> Add Attendance
                        </button>
                        <button v-if="user?.userType === 'admin'" class="btn btn-sm btn-outline-primary" @click="editMinistry(ministry)">
                          <i class="bi bi-pencil"></i>
                        </button>
                      </div>
                    </div>
                    <div class="card-body">
                      <!-- Statistics -->
                      <div class="ministry-stats mb-4">
                        <div class="stat-item mb-3">
                          <div class="d-flex justify-content-between">
                            <span><i class="bi bi-people me-1"></i>Regular Participants</span>
                            <strong class="church-purple">{{ ministry.participants }}</strong>
                          </div>
                        </div>
                        <div class="stat-item mb-3">
                          <div class="d-flex justify-content-between">
                            <span><i class="bi bi-calendar-check me-1"></i>Average Attendance</span>
                            <strong class="text-info">{{ getAverageAttendance(ministry) }}</strong>
                          </div>
                        </div>
                      </div>

                      <!-- Recent Attendance -->
                      <div v-if="ministry.attendance && ministry.attendance.length > 0" class="mb-3">
                        <h6 class="fw-bold mb-2">Recent Attendance</h6>
                        <div class="attendance-list" style="max-height: 150px; overflow-y: auto;">
                          <div v-for="(record, index) in ministry.attendance.slice(-5).reverse()" :key="index" 
                            class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                            <div>
                              <small class="text-muted d-block">{{ formatDate(record.date) }}</small>
                            </div>
                            <div class="text-end">
                              <strong class="text-primary">{{ record.count }}</strong>
                              <small class="text-muted d-block">attendees</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-center text-muted py-2 mb-3">
                        <small>No attendance records yet</small>
                      </div>

                      <!-- Admin Notes -->
                      <div class="admin-notes mt-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                          <h6 class="fw-bold mb-0"><i class="bi bi-sticky me-1"></i>Admin Notes</h6>
                          <button v-if="user?.userType === 'admin'" class="btn btn-sm btn-link p-0" @click="editMinistryNotes(ministry)">
                            <i class="bi bi-pencil-square"></i>
                          </button>
                        </div>
                        <div class="card bg-light border-0">
                          <div class="card-body py-2">
                            <small class="text-muted" v-if="!ministry.notes || ministry.notes.trim() === ''">
                              <em>No notes added yet</em>
                            </small>
                            <small v-else style="white-space: pre-wrap;">{{ ministry.notes }}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Monthly Budget Settings -->
            <div v-if="activeSection === 'expenses'" class="section-content">
              <div class="row g-4">
                <!-- Default Monthly Income -->
                <div class="col-12">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                      <div>
                        <h5 class="fw-bold mb-1">Monthly Income</h5>
                        <p class="mb-0 text-muted small">Set expected monthly income sources for budget forecasting</p>
                      </div>
                      <button v-if="user?.userType === 'admin'" class="btn btn-success" @click="saveDefaultIncome">
                        <i class="bi bi-save me-1"></i>
                        Save Changes
                      </button>
                    </div>
                    <div class="card-body">
                      <div class="row g-4">
                        <!-- Verified Tithes & Offerings (Auto-calculated, Non-editable) -->
                        <div class="col-12">
                          <div class="card bg-primary bg-opacity-10 border-primary border-2">
                            <div class="card-body">
                              <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                  <label class="form-label mb-0 fw-bold text-primary">
                                    <i class="bi bi-shield-check me-1"></i>
                                    Tithes & Offerings (Verified Payments)
                                  </label>
                                  <small class="d-block text-muted">Auto-calculated from verified payments</small>
                                </div>
                                <i class="bi bi-lock-fill text-primary"></i>
                              </div>
                              <div class="input-group">
                                <span class="input-group-text bg-primary text-white">₱</span>
                                <input 
                                  type="text" 
                                  class="form-control bg-white fw-bold" 
                                  :value="totalVerifiedPaymentsThisMonth.toLocaleString()"
                                  readonly
                                  style="cursor: not-allowed;"
                                >
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Sunday Collection Breakdown (Editable) -->
                        <div class="col-12">
                          <div class="card bg-success bg-opacity-10 border-0">
                            <div class="card-body">
                              <div class="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                  <label class="form-label mb-0 fw-bold">
                                    <i class="bi bi-cash-stack me-1"></i>
                                    Sunday Collection
                                  </label>
                                  <small class="d-block text-muted">Weekly tithes & offerings from Sunday services</small>
                                </div>
                                <div class="badge bg-success fs-6">
                                  Total: ₱{{ totalSundayCollection.toLocaleString() }}
                                </div>
                              </div>
                              
                              <!-- Sunday Collection Grid -->
                              <div class="row g-3">
                                <div class="col-md-3 col-6">
                                  <label class="form-label small fw-bold">1st Sunday</label>
                                  <div class="input-group input-group-sm">
                                    <span class="input-group-text">₱</span>
                                    <input 
                                      type="number" 
                                      class="form-control" 
                                      v-model.number="sundayCollection.first"
                                      :readonly="user?.userType !== 'admin'"
                                      min="0"
                                      placeholder="0"
                                    >
                                  </div>
                                </div>
                                <div class="col-md-3 col-6">
                                  <label class="form-label small fw-bold">2nd Sunday</label>
                                  <div class="input-group input-group-sm">
                                    <span class="input-group-text">₱</span>
                                    <input 
                                      type="number" 
                                      class="form-control" 
                                      v-model.number="sundayCollection.second"
                                      :readonly="user?.userType !== 'admin'"
                                      min="0"
                                      placeholder="0"
                                    >
                                  </div>
                                </div>
                                <div class="col-md-3 col-6">
                                  <label class="form-label small fw-bold">3rd Sunday</label>
                                  <div class="input-group input-group-sm">
                                    <span class="input-group-text">₱</span>
                                    <input 
                                      type="number" 
                                      class="form-control" 
                                      v-model.number="sundayCollection.third"
                                      :readonly="user?.userType !== 'admin'"
                                      min="0"
                                      placeholder="0"
                                    >
                                  </div>
                                </div>
                                <div class="col-md-3 col-6">
                                  <label class="form-label small fw-bold">4th Sunday</label>
                                  <div class="input-group input-group-sm">
                                    <span class="input-group-text">₱</span>
                                    <input 
                                      type="number" 
                                      class="form-control" 
                                      v-model.number="sundayCollection.fourth"
                                      :readonly="user?.userType !== 'admin'"
                                      min="0"
                                      placeholder="0"
                                    >
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Other Income Categories -->
                        <div v-for="(income, index) in defaultMonthlyIncome" :key="index" class="col-md-6">
                          <div class="card bg-success bg-opacity-10 border-0">
                            <div class="card-body">
                              <div class="d-flex justify-content-between align-items-center mb-2">
                                <label class="form-label mb-0 fw-bold">{{ income.category }}</label>
                                <button v-if="user?.userType === 'admin' && defaultMonthlyIncome.length > 1" 
                                  class="btn btn-sm btn-outline-danger" 
                                  @click="removeIncomeCategory(index)"
                                >
                                  <i class="bi bi-trash"></i>
                                </button>
                              </div>
                              <div class="input-group">
                                <span class="input-group-text">₱</span>
                                <input 
                                  type="number" 
                                  class="form-control" 
                                  v-model.number="income.amount"
                                  :readonly="user?.userType !== 'admin'"
                                  min="0"
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-if="user?.userType === 'admin'" class="mt-4">
                        <button class="btn btn-outline-success" @click="showAddIncomeCategoryModal = true">
                          <i class="bi bi-plus-circle me-2"></i>
                          Add Income Category
                        </button>
                      </div>

                      <div class="mt-4 p-3 bg-success bg-opacity-10 rounded">
                        <div class="d-flex justify-content-between align-items-center">
                          <h6 class="fw-bold mb-0">Total Monthly Income:</h6>
                          <h5 class="text-success fw-bold mb-0">₱{{ totalDefaultIncomeWithVerified.toLocaleString() }}</h5>
                        </div>
                        <hr class="my-2">
                        <div class="small text-muted">
                          <div class="d-flex justify-content-between mb-1">
                            <span>Verified Payments:</span>
                            <span class="fw-bold">₱{{ totalVerifiedPaymentsThisMonth.toLocaleString() }}</span>
                          </div>
                          <div class="d-flex justify-content-between mb-1">
                            <span>Sunday Collection:</span>
                            <span class="fw-bold">₱{{ totalSundayCollection.toLocaleString() }}</span>
                          </div>
                          <div class="ms-3 border-start border-2 ps-2 mb-1">
                            <div class="d-flex justify-content-between">
                              <small class="text-muted">1st Sunday:</small>
                              <small class="fw-bold">₱{{ sundayCollection.first.toLocaleString() }}</small>
                            </div>
                            <div class="d-flex justify-content-between">
                              <small class="text-muted">2nd Sunday:</small>
                              <small class="fw-bold">₱{{ sundayCollection.second.toLocaleString() }}</small>
                            </div>
                            <div class="d-flex justify-content-between">
                              <small class="text-muted">3rd Sunday:</small>
                              <small class="fw-bold">₱{{ sundayCollection.third.toLocaleString() }}</small>
                            </div>
                            <div class="d-flex justify-content-between">
                              <small class="text-muted">4th Sunday:</small>
                              <small class="fw-bold">₱{{ sundayCollection.fourth.toLocaleString() }}</small>
                            </div>
                          </div>
                          <div class="d-flex justify-content-between">
                            <span>Other Income:</span>
                            <span class="fw-bold">₱{{ totalDefaultIncome.toLocaleString() }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Default Monthly Expenses -->
                <div class="col-12">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                      <div>
                        <h5 class="fw-bold mb-1">Monthly Expenses</h5>
                        <p class="mb-0 text-muted small">Set default monthly expense amounts for budget forecasting</p>
                      </div>
                      <div v-if="user?.userType === 'admin'" class="d-flex gap-2">
                        <button class="btn btn-warning" @click="resetExpensesToDefault">
                          <i class="bi bi-arrow-clockwise me-1"></i>
                          Reset to Default
                        </button>
                        <button class="btn btn-success" @click="saveDefaultExpenses">
                          <i class="bi bi-save me-1"></i>
                          Save Expenses
                        </button>
                        <button class="btn btn-primary" @click="saveMinistryAllocations">
                          <i class="bi bi-save me-1"></i>
                          Save Ministry Spending
                        </button>
                      </div>
                    </div>
                    <div class="card-body">
                      <!-- Ministry Budget Breakdown - At Top -->
                      <div class="ministry-breakdown mb-4">
                        <div class="card bg-danger bg-opacity-10 border-0">
                          <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                              <div>
                                <label class="form-label mb-0 fw-bold">
                                  <i class="bi bi-people me-1"></i>
                                  Ministry Breakdown
                                </label>
                                <small class="d-block text-muted">Ministry spending allocation</small>
                              </div>
                              <div class="badge bg-danger fs-6">
                                Total: ₱{{ totalMinistrySpent.toLocaleString() }}
                              </div>
                            </div>
                            
                            <div class="row g-3">
                              <div v-for="ministry in ministryReports" :key="ministry.name" class="col-md-3 col-6">
                                <label class="form-label small fw-bold">{{ ministry.name }}</label>
                                <div class="input-group input-group-sm">
                                  <span class="input-group-text">₱</span>
                                  <input 
                                    type="number" 
                                    class="form-control" 
                                    v-model.number="ministry.spent"
                                    :readonly="user?.userType !== 'admin'"
                                    min="0"
                                    placeholder="0"
                                  >
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Other Expense Categories -->
                      <div class="row g-4">
                        <div v-for="(expense, index) in defaultMonthlyExpenses" :key="index" class="col-md-6">
                          <div v-if="expense.category !== 'Ministries & Programs'" class="card bg-danger bg-opacity-10 border-0">
                            <div class="card-body">
                              <div class="d-flex justify-content-between align-items-center mb-2">
                                <label class="form-label mb-0 fw-bold">{{ expense.category }}</label>
                                <button v-if="user?.userType === 'admin' && defaultMonthlyExpenses.length > 1" 
                                  class="btn btn-sm btn-outline-danger" 
                                  @click="removeExpenseCategory(index)"
                                >
                                  <i class="bi bi-trash"></i>
                                </button>
                              </div>
                              
                              <!-- Regular expense input -->
                              <div class="input-group">
                                <span class="input-group-text">₱</span>
                                <input 
                                  type="number" 
                                  class="form-control" 
                                  v-model.number="expense.amount"
                                  :readonly="user?.userType !== 'admin'"
                                  min="0"
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-if="user?.userType === 'admin'" class="mt-4">
                        <button class="btn btn-outline-primary" @click="showAddExpenseCategoryModal = true">
                          <i class="bi bi-plus-circle me-2"></i>
                          Add Expense Category
                        </button>
                      </div>

                      <!-- Total Monthly Expenses with Breakdown -->
                      <div class="mt-4 p-4 bg-light rounded">
                        <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                          <h6 class="fw-bold mb-0">Total Monthly Expenses:</h6>
                          <h4 class="text-success fw-bold mb-0">₱{{ totalDefaultExpensesWithMinistries.toLocaleString() }}</h4>
                        </div>
                        
                        <!-- Ministries Breakdown -->
                        <div class="mb-3">
                          <div class="d-flex justify-content-between align-items-center">
                            <span>Ministries & Programs:</span>
                            <strong class="text-end">₱{{ totalMinistrySpent.toLocaleString() }}</strong>
                          </div>
                          <div class="ms-4 mt-2">
                            <div v-for="ministry in ministryReports" :key="ministry.name" class="d-flex justify-content-between align-items-center mb-1">
                              <small class="text-muted">{{ ministry.name }}:</small>
                              <small class="text-end">₱{{ (ministry.spent || 0).toLocaleString() }}</small>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Other Expenses -->
                        <div v-for="expense in defaultMonthlyExpenses" :key="expense.category">
                          <div v-if="expense.category !== 'Ministries & Programs'" class="d-flex justify-content-between align-items-center mb-2">
                            <span>{{ expense.category }}:</span>
                            <strong class="text-end">₱{{ expense.amount.toLocaleString() }}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Budget Summary -->
                <div class="col-12">
                  <div class="card border-0 shadow-sm">
                    <div class="card-body">
                      <h5 class="fw-bold mb-3">Monthly Budget Summary</h5>
                      <div class="row g-3">
                        <div class="col-md-4">
                          <div class="text-center p-3 bg-success bg-opacity-10 rounded">
                            <small class="text-muted d-block mb-1">Expected Income</small>
                            <h4 class="text-success fw-bold mb-0">₱{{ totalDefaultIncomeWithVerified.toLocaleString() }}</h4>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="text-center p-3 bg-danger bg-opacity-10 rounded">
                            <small class="text-muted d-block mb-1">Expected Expenses</small>
                            <h4 class="text-danger fw-bold mb-0">₱{{ totalDefaultExpensesWithMinistries.toLocaleString() }}</h4>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="text-center p-3 rounded" :class="defaultBudgetNet >= 0 ? 'bg-success bg-opacity-10' : 'bg-warning bg-opacity-10'">
                            <small class="text-muted d-block mb-1">Expected Net</small>
                            <h4 class="fw-bold mb-0" :class="defaultBudgetNet >= 0 ? 'text-success' : 'text-warning'">
                              ₱{{ defaultBudgetNet.toLocaleString() }}
                            </h4>
                          </div>
                        </div>
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
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 class="fw-bold mb-1">6-Month Budget Forecast</h5>
                          <p class="mb-0 text-muted small">Based on member pledges and default monthly expenses</p>
                        </div>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="alert alert-info mb-4">
                        <h6 class="fw-bold mb-2"><i class="bi bi-info-circle me-2"></i>Forecast Calculation</h6>
                        <ul class="mb-0 small">
                          <li><strong>Income:</strong> Based on total member pledges (₱{{ totalPledges.toLocaleString() }}/month)</li>
                          <li><strong>Expenses:</strong> Based on default monthly expenses including ministry budgets (₱{{ totalDefaultExpensesWithMinistries.toLocaleString() }}/month)</li>
                        </ul>
                      </div>

                      <canvas id="forecastChart" style="max-height: 350px;"></canvas>
                      
                      <div class="forecast-summary mt-4">
                        <div class="row g-4">
                          <div class="col-md-4">
                            <div class="card bg-light border-0">
                              <div class="card-body text-center">
                                <small class="text-muted d-block mb-1">Monthly Average</small>
                                <h6 class="fw-bold text-success mb-0">₱{{ totalPledges.toLocaleString() }}</h6>
                                <small class="text-muted">Income (from pledges)</small>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="card bg-light border-0">
                              <div class="card-body text-center">
                                <small class="text-muted d-block mb-1">Monthly Average</small>
                                <h6 class="fw-bold text-danger mb-0">₱{{ totalDefaultExpensesWithMinistries.toLocaleString() }}</h6>
                                <small class="text-muted">Expenses (with ministries)</small>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="card bg-light border-0">
                              <div class="card-body text-center">
                                <small class="text-muted d-block mb-1">Monthly Net</small>
                                <h6 class="fw-bold mb-0" :class="(totalPledges - totalDefaultExpensesWithMinistries) >= 0 ? 'text-success' : 'text-danger'">
                                  ₱{{ (totalPledges - totalDefaultExpensesWithMinistries).toLocaleString() }}
                                </h6>
                                <small class="text-muted">{{ (totalPledges - totalDefaultExpensesWithMinistries) >= 0 ? 'Surplus' : 'Deficit' }}</small>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="row g-4 mt-2">
                          <div class="col-md-6">
                            <div class="card bg-success bg-opacity-10 border-0">
                              <div class="card-body text-center">
                                <h5 class="fw-bold text-success">₱{{ projectedIncome.toLocaleString() }}</h5>
                                <p class="mb-0 text-muted">Projected 6-Month Income</p>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="card bg-danger bg-opacity-10 border-0">
                              <div class="card-body text-center">
                                <h5 class="fw-bold text-danger">₱{{ projectedExpenses.toLocaleString() }}</h5>
                                <p class="mb-0 text-muted">Projected 6-Month Expenses</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div class="mt-4 p-4 rounded" :class="projectedNet >= 0 ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'">
                          <h6 class="fw-bold mb-2" :class="projectedNet >= 0 ? 'text-success' : 'text-danger'">
                            <i class="bi bi-graph-up me-2" v-if="projectedNet >= 0"></i>
                            <i class="bi bi-graph-down me-2" v-else></i>
                            Projected 6-Month Net: ₱{{ projectedNet.toLocaleString() }}
                          </h6>
                          <p class="mb-0 small">
                            {{ projectedNet >= 0 ? 
                                'The church is projected to have a healthy surplus over the next 6 months based on current pledges and expense settings.' : 
                                'The church may face financial challenges. Consider encouraging additional pledges or reviewing monthly expense settings.' 
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
                                  <div class="btn-group w-100 mt-2" role="group">
                                    <button 
                                      class="btn btn-sm btn-outline-secondary"
                                      @click="editPayment(payment)"
                                      title="Edit Payment"
                                    >
                                      <i class="bi bi-pencil"></i>
                                    </button>
                                    <button 
                                      class="btn btn-sm btn-outline-danger"
                                      @click="deletePayment(payment.giftId, payment.id)"
                                      title="Delete Payment"
                                    >
                                      <i class="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </div>
                                
                                <div v-else-if="payment.verificationStatus === 'approved'" class="d-flex flex-column gap-2">
                                  <div class="small text-success mb-2">
                                    <i class="bi bi-check-circle me-1"></i>
                                    Approved by {{ payment.verifiedBy }}<br>
                                    <span class="text-muted">{{ formatDate(payment.verifiedDate) }}</span>
                                  </div>
                                  <button 
                                    v-if="payment.receiptFileName" 
                                    class="btn btn-sm btn-outline-primary"
                                    @click="viewReceipt(payment)"
                                  >
                                    <i class="bi bi-eye me-1"></i>
                                    View Receipt
                                  </button>
                                  <div class="btn-group w-100" role="group">
                                    <button 
                                      class="btn btn-sm btn-outline-secondary"
                                      @click="editPayment(payment)"
                                      title="Edit Payment"
                                    >
                                      <i class="bi bi-pencil"></i>
                                    </button>
                                    <button 
                                      class="btn btn-sm btn-outline-warning"
                                      @click="verifyPayment(payment.giftId, payment.id, 'pending')"
                                      title="Reset to Pending"
                                    >
                                      <i class="bi bi-arrow-clockwise"></i>
                                    </button>
                                    <button 
                                      class="btn btn-sm btn-outline-danger"
                                      @click="deletePayment(payment.giftId, payment.id)"
                                      title="Delete Payment"
                                    >
                                      <i class="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </div>
                                
                                <div v-else-if="payment.verificationStatus === 'rejected'" class="d-flex flex-column gap-2">
                                  <div class="small text-danger mb-2">
                                    <i class="bi bi-x-circle me-1"></i>
                                    Rejected by {{ payment.verifiedBy }}<br>
                                    <span class="text-muted">{{ formatDate(payment.verifiedDate) }}</span>
                                  </div>
                                  <button 
                                    v-if="payment.receiptFileName" 
                                    class="btn btn-sm btn-outline-primary"
                                    @click="viewReceipt(payment)"
                                  >
                                    <i class="bi bi-eye me-1"></i>
                                    View Receipt
                                  </button>
                                  <div class="btn-group w-100" role="group">
                                    <button 
                                      class="btn btn-sm btn-outline-secondary"
                                      @click="editPayment(payment)"
                                      title="Edit Payment"
                                    >
                                      <i class="bi bi-pencil"></i>
                                    </button>
                                    <button 
                                      class="btn btn-sm btn-outline-warning"
                                      @click="verifyPayment(payment.giftId, payment.id, 'pending')"
                                      title="Reset to Pending"
                                    >
                                      <i class="bi bi-arrow-clockwise"></i>
                                    </button>
                                    <button 
                                      class="btn btn-sm btn-outline-danger"
                                      @click="deletePayment(payment.giftId, payment.id)"
                                      title="Delete Payment"
                                    >
                                      <i class="bi bi-trash"></i>
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

            <!-- Accounts Management Section -->
            <div v-if="activeSection === 'accounts'" class="section-content">
              <div class="row">
                <div class="col-12">
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-white border-0">
                      <div class="d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold mb-0">User Accounts</h5>
                        <div class="d-flex gap-2 align-items-center">
                          <span class="badge bg-info">{{ allUsers.length }} total users</span>
                        </div>
                      </div>
                    </div>
                    <div class="card-body">
                      <!-- Filter by user type -->
                      <div class="mb-3">
                        <div class="btn-group" role="group">
                          <button 
                            type="button" 
                            class="btn btn-sm"
                            :class="accountFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'"
                            @click="accountFilter = 'all'"
                          >
                            All ({{ allUsers.length }})
                          </button>
                          <button 
                            type="button" 
                            class="btn btn-sm"
                            :class="accountFilter === 'member' ? 'btn-primary' : 'btn-outline-primary'"
                            @click="accountFilter = 'member'"
                          >
                            Members ({{ allUsers.filter(u => u.userType === 'member').length }})
                          </button>
                          <button 
                            type="button" 
                            class="btn btn-sm"
                            :class="accountFilter === 'pastor' ? 'btn-primary' : 'btn-outline-primary'"
                            @click="accountFilter = 'pastor'"
                          >
                            Pastors ({{ allUsers.filter(u => u.userType === 'pastor').length }})
                          </button>
                          <button 
                            type="button" 
                            class="btn btn-sm"
                            :class="accountFilter === 'admin' ? 'btn-primary' : 'btn-outline-primary'"
                            @click="accountFilter = 'admin'"
                          >
                            Admins ({{ allUsers.filter(u => u.userType === 'admin').length }})
                          </button>
                        </div>
                      </div>

                      <!-- Users Table -->
                      <div class="table-responsive">
                        <table class="table table-hover align-middle">
                          <thead class="table-light">
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>User Type</th>
                              <th>Joined</th>
                              <th class="text-end">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="account in filteredAccounts" :key="account.id">
                              <td>
                                <div class="d-flex align-items-center">
                                  <i class="bi bi-person-circle fs-4 me-2 text-primary"></i>
                                  <strong>{{ account.name }}</strong>
                                </div>
                              </td>
                              <td>{{ account.email }}</td>
                              <td>{{ account.phone || 'N/A' }}</td>
                              <td>
                                <span 
                                  class="badge"
                                  :class="{
                                    'bg-success': account.userType === 'member',
                                    'bg-primary': account.userType === 'pastor',
                                    'bg-danger': account.userType === 'admin'
                                  }"
                                >
                                  {{ capitalizeFirst(account.userType) }}
                                </span>
                              </td>
                              <td>{{ formatDate(account.joinDate) }}</td>
                              <td class="text-end">
                                <button 
                                  class="btn btn-sm btn-outline-primary me-2"
                                  @click="editAccount(account)"
                                  title="Edit Account"
                                >
                                  <i class="bi bi-pencil"></i>
                                </button>
                                <button 
                                  class="btn btn-sm btn-outline-danger"
                                  @click="deleteAccount(account.id)"
                                  :disabled="account.id === user?.id"
                                  title="Delete Account"
                                >
                                  <i class="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div v-if="filteredAccounts.length === 0" class="text-center py-4 text-muted">
                        <i class="bi bi-person-x display-4 opacity-25"></i>
                        <p class="mt-2 mb-0">No users found</p>
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

    <!-- Edit Ministry Modal -->
    <div v-if="showEditMinistryModal" class="modal fade show d-block" tabindex="-1" @click="closeMinistryModal">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Ministry Report</h5>
            <button type="button" class="btn-close" @click="closeMinistryModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-bold">Ministry Name</label>
              <input type="text" class="form-control" v-model="editingMinistry.name" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Regular Participants</label>
              <input type="number" class="form-control" v-model.number="editingMinistry.participants" min="0">
              <small class="text-muted">Average number of regular participants</small>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Monthly Budget (₱)</label>
              <input type="number" class="form-control" v-model.number="editingMinistry.budget" min="0">
              <small class="text-muted">Budget allocation for this ministry (used in expense tracking)</small>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeMinistryModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveMinistry">
              <i class="bi bi-save me-1"></i>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Ministry Notes Modal -->
    <div v-if="showEditNotesModal" class="modal fade show d-block" tabindex="-1" @click="closeNotesModal">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Admin Notes - {{ editingMinistryForNotes?.name }}</h5>
            <button type="button" class="btn-close" @click="closeNotesModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-bold">Notes</label>
              <textarea 
                class="form-control" 
                v-model="editingNotes" 
                rows="6"
                placeholder="Enter admin notes, updates, or important information about this ministry..."
              ></textarea>
              <small class="text-muted">These notes are visible to admin and pastors only</small>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeNotesModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveMinistryNotes">
              <i class="bi bi-save me-1"></i>
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Attendance Modal -->
    <div v-if="showAttendanceModal" class="modal fade show d-block" tabindex="-1" @click="closeAttendanceModal">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Attendance - {{ editingMinistryForAttendance?.name }}</h5>
            <button type="button" class="btn-close" @click="closeAttendanceModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-bold">Date</label>
              <input 
                type="date" 
                class="form-control" 
                v-model="newAttendance.date"
                :max="new Date().toISOString().split('T')[0]"
              >
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Attendance Count</label>
              <input 
                type="number" 
                class="form-control" 
                v-model.number="newAttendance.count" 
                min="0"
                placeholder="Number of attendees"
              >
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Notes (Optional)</label>
              <textarea 
                class="form-control" 
                v-model="newAttendance.notes" 
                rows="3"
                placeholder="Any special notes about this attendance..."
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeAttendanceModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveAttendance">
              <i class="bi bi-plus-circle me-1"></i>
              Add Attendance
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Income Category Modal -->
    <div v-if="showAddIncomeCategoryModal" class="modal fade show d-block" tabindex="-1" @click="showAddIncomeCategoryModal = false">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Income Category</h5>
            <button type="button" class="btn-close" @click="showAddIncomeCategoryModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-bold">Category Name</label>
              <input type="text" class="form-control" v-model="newIncomeCategory.category" placeholder="e.g., Special Offerings">
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Default Amount (₱)</label>
              <input type="number" class="form-control" v-model.number="newIncomeCategory.amount" min="0" placeholder="0">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAddIncomeCategoryModal = false">Cancel</button>
            <button type="button" class="btn btn-success" @click="addIncomeCategory">
              <i class="bi bi-plus-circle me-1"></i>
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Expense Category Modal -->
    <div v-if="showAddExpenseCategoryModal" class="modal fade show d-block" tabindex="-1" @click="showAddExpenseCategoryModal = false">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Expense Category</h5>
            <button type="button" class="btn-close" @click="showAddExpenseCategoryModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-bold">Category Name</label>
              <input type="text" class="form-control" v-model="newExpenseCategory.category" placeholder="e.g., Building Maintenance">
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Default Amount (₱)</label>
              <input type="number" class="form-control" v-model.number="newExpenseCategory.amount" min="0" placeholder="0">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAddExpenseCategoryModal = false">Cancel</button>
            <button type="button" class="btn btn-primary" @click="addExpenseCategory">
              <i class="bi bi-plus-circle me-1"></i>
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Community Prayer Modal -->
    <div v-if="showAddCommunityPrayerModal" class="modal fade show d-block" tabindex="-1" @click="showAddCommunityPrayerModal = false">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Community Prayer</h5>
            <button type="button" class="btn-close" @click="showAddCommunityPrayerModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-bold">Prayer Title</label>
              <input type="text" class="form-control" v-model="newCommunityPrayer.title" placeholder="e.g., Prayer for Healing">
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Category</label>
              <select class="form-select" v-model="newCommunityPrayer.category">
                <option value="">Select category</option>
                <option value="Health">Health</option>
                <option value="Family">Family</option>
                <option value="Work">Work</option>
                <option value="Missions">Missions</option>
                <option value="Community">Community</option>
                <option value="Spiritual">Spiritual</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Prayer Request</label>
              <textarea class="form-control" v-model="newCommunityPrayer.request" rows="4" placeholder="Enter prayer request details..."></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Requested By (Optional)</label>
              <input type="text" class="form-control" v-model="newCommunityPrayer.requestedBy" placeholder="e.g., John Doe or leave blank for admin">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showAddCommunityPrayerModal = false">Cancel</button>
            <button type="button" class="btn btn-primary" @click="addCommunityPrayer">
              <i class="bi bi-plus-circle me-1"></i>
              Add Prayer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Account Modal -->
    <div v-if="showEditAccountModal" class="modal fade show d-block" tabindex="-1" @click="closeAccountModal">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Account</h5>
            <button type="button" class="btn-close" @click="closeAccountModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-bold">Full Name</label>
              <input type="text" class="form-control" v-model="editingAccount.name" required>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Email</label>
              <input type="email" class="form-control" v-model="editingAccount.email" required>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Phone</label>
              <input type="tel" class="form-control" v-model="editingAccount.phone">
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">User Type</label>
              <select class="form-select" v-model="editingAccount.userType" required>
                <option value="member">Member</option>
                <option value="pastor">Pastor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Password (leave blank to keep current)</label>
              <input type="password" class="form-control" v-model="editingAccount.newPassword" placeholder="Enter new password or leave blank">
              <small class="text-muted">Only fill this if you want to change the password</small>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeAccountModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveAccount">
              <i class="bi bi-save me-1"></i>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Payment Modal -->
    <div v-if="showEditPaymentModal" class="modal fade show d-block" tabindex="-1" @click="closePaymentModal">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Payment</h5>
            <button type="button" class="btn-close" @click="closePaymentModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-bold">Member Name</label>
              <input type="text" class="form-control" v-model="editingPayment.memberName" readonly>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Amount (₱)</label>
              <input type="number" class="form-control" v-model.number="editingPayment.amount" min="0" step="0.01" required>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Due Date</label>
              <input type="date" class="form-control" v-model="editingPayment.dueDate" required>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Payment Date</label>
              <input type="date" class="form-control" v-model="editingPayment.paymentDate">
              <small class="text-muted">Leave blank if not yet paid</small>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Payment Method</label>
              <select class="form-select" v-model="editingPayment.paymentMethod">
                <option value="online">Online Payment</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <div v-if="editingPayment.paymentMethod === 'cash'" class="mb-3">
              <label class="form-label fw-bold">Reference Number</label>
              <input type="text" class="form-control" v-model="editingPayment.referenceNumber">
            </div>
            <div v-if="editingPayment.paymentMethod === 'online'" class="mb-3">
              <label class="form-label fw-bold">Receipt File Name</label>
              <input type="text" class="form-control" v-model="editingPayment.receiptFileName" readonly>
              <small class="text-muted">Receipt uploads are managed by the member</small>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Verification Status</label>
              <select class="form-select" v-model="editingPayment.verificationStatus">
                <option value="pending_payment">Payment Due</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Notes</label>
              <textarea class="form-control" v-model="editingPayment.notes" rows="3" placeholder="Add notes about this payment..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closePaymentModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="savePayment">
              <i class="bi bi-save me-1"></i>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Receipt Modal -->
    <div v-if="showReceiptModal" class="modal fade show d-block" tabindex="-1" @click="closeReceiptModal">
      <div class="modal-dialog modal-lg" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Payment Receipt</h5>
            <button type="button" class="btn-close" @click="closeReceiptModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="viewingReceipt" class="receipt-details">
              <div class="row mb-3">
                <div class="col-md-6">
                  <p class="mb-1"><strong>Member:</strong> {{ viewingReceipt.memberName }}</p>
                  <p class="mb-1"><strong>Amount:</strong> ₱{{ viewingReceipt.amount.toFixed(2) }}</p>
                  <p class="mb-1"><strong>Payment Date:</strong> {{ formatDate(viewingReceipt.paymentDate) }}</p>
                </div>
                <div class="col-md-6">
                  <p class="mb-1"><strong>Payment Method:</strong> {{ viewingReceipt.paymentMethod }}</p>
                  <p class="mb-1"><strong>Status:</strong> 
                    <span 
                      class="badge"
                      :class="{
                        'bg-warning': viewingReceipt.verificationStatus === 'pending',
                        'bg-success': viewingReceipt.verificationStatus === 'approved',
                        'bg-danger': viewingReceipt.verificationStatus === 'rejected'
                      }"
                    >
                      {{ getVerificationStatusText(viewingReceipt.verificationStatus) }}
                    </span>
                  </p>
                </div>
              </div>
              <div v-if="viewingReceipt.receiptFileName" class="mt-3">
                <p class="mb-2"><strong>Receipt File:</strong></p>
                <div class="alert alert-info">
                  <i class="bi bi-file-earmark-text me-2"></i>
                  {{ viewingReceipt.receiptFileName }}
                </div>
                <p class="text-muted small">
                  <i class="bi bi-info-circle me-1"></i>
                  Receipt preview functionality would display the uploaded image/PDF here.
                </p>
              </div>
              <div v-if="viewingReceipt.referenceNumber" class="mt-3">
                <p class="mb-1"><strong>Reference Number:</strong></p>
                <div class="alert alert-info">
                  {{ viewingReceipt.referenceNumber }}
                </div>
              </div>
              <div v-if="viewingReceipt.notes" class="mt-3">
                <p class="mb-1"><strong>Notes:</strong></p>
                <div class="alert alert-secondary">
                  {{ viewingReceipt.notes }}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeReceiptModal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div v-if="showEditMinistryModal || showAddExpenseCategoryModal || showAddIncomeCategoryModal || showEditNotesModal || showAttendanceModal || showAddCommunityPrayerModal || showEditAccountModal || showEditPaymentModal || showReceiptModal" 
      class="modal-backdrop fade show">
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

// Account management variables
const accountFilter = ref('all')
const allUsers = ref([])
const showEditAccountModal = ref(false)
const editingAccount = ref({ id: '', name: '', email: '', phone: '', userType: '', newPassword: '' })

const filteredAccounts = computed(() => {
  if (accountFilter.value === 'all') {
    return allUsers.value
  }
  return allUsers.value.filter(u => u.userType === accountFilter.value)
})

// Payment verification variables
const paymentFilter = ref('pending')
const allPayments = ref([])
const showEditPaymentModal = ref(false)
const showReceiptModal = ref(false)
const editingPayment = ref({
  giftId: '',
  id: '',
  memberName: '',
  amount: 0,
  dueDate: '',
  paymentDate: '',
  paymentMethod: 'online',
  referenceNumber: '',
  receiptFileName: '',
  verificationStatus: 'pending',
  notes: ''
})
const viewingReceipt = ref(null)

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

// ===== FINANCIAL REPORTS DATA (Current Month Actuals) =====
// These represent ACTUAL income and expenses for the current reporting month
// Stored in: gcbf_income_data and gcbf_expense_data
// Used in: Financial Reports tab (activeSection === 'finance')
// NOTE: "Tithes & Offerings" is auto-calculated from verified payments this month
const currentMonth = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
})

const incomeData = ref([
  { category: 'Tithes & Offerings', amount: 38500 },
  { category: 'Special Donations', amount: 4750 },
  { category: 'Fundraising Events', amount: 2200 },
  { category: 'Investment Returns', amount: 800 },
  { category: 'Other Income', amount: 500 }
])

const expenseData = ref([
  { category: 'Staff & Benefits', amount: 0 },
  { category: 'Facilities & Utilities', amount: 0 },
  { category: 'Ministries & Programs', amount: 0 },
  { category: 'Missions Support', amount: 0 },
  { category: 'Administrative', amount: 0 },
  { category: 'Maintenance', amount: 0 }
])

// ===== MONTHLY BUDGET DATA (Default/Expected Amounts) =====
// These represent EXPECTED/DEFAULT monthly amounts for budgeting and forecasting
// Stored in: gcbf_default_income and gcbf_default_expenses
// Used in: Monthly Budget tab (activeSection === 'expenses') and Budget Forecast tab
const defaultMonthlyIncome = ref([
  { category: 'Special Donations', amount: 0 },
  { category: 'Fundraising Events', amount: 0 },
  { category: 'Investment Returns', amount: 0 },
  { category: 'Other Income', amount: 0 }
])

const defaultMonthlyExpenses = ref([
  { category: 'Staff & Benefits', amount: 0 },
  { category: 'Facilities & Utilities', amount: 0 },
  { category: 'Ministries & Programs', amount: 0 },
  { category: 'Missions Support', amount: 0 },
  { category: 'Administrative', amount: 0 },
  { category: 'Maintenance', amount: 0 }
])

// Sunday collection breakdown (editable tithes & offerings from each Sunday)
const sundayCollection = ref({
  first: 0,
  second: 0,
  third: 0,
  fourth: 0
})

// Modal states
const showEditMinistryModal = ref(false)
const showAddExpenseCategoryModal = ref(false)
const showAddIncomeCategoryModal = ref(false)
const showEditNotesModal = ref(false)
const showAttendanceModal = ref(false)
const showAddCommunityPrayerModal = ref(false)
const editingMinistry = ref({ name: '', participants: 0, budget: 0 })
const editingMinistryForNotes = ref(null)
const editingMinistryForAttendance = ref(null)
const editingNotes = ref('')
const newExpenseCategory = ref({ category: '', amount: 0 })
const newIncomeCategory = ref({ category: '', amount: 0 })
const newAttendance = ref({ date: '', count: 0, notes: '' })
const newCommunityPrayer = ref({ title: '', category: '', request: '', requestedBy: '' })

const sharedPrayers = ref([
  {
    id: 2,
    title: 'Mission Trip Safety',
    category: 'Missions',
    request: 'Our youth mission team is traveling to Guatemala next week. Please pray for their safety and for hearts to be touched.',
    requestedBy: 'Pastor John Louie Berdejo',
    dateRequested: '2024-10-10',
    status: 'active',
    approvalStatus: 'approved'
  }
])

// Computed properties for prayer filtering
const pendingPrayers = computed(() => 
  sharedPrayers.value.filter(p => p.approvalStatus === 'pending')
)

const approvedPrayers = computed(() => 
  sharedPrayers.value.filter(p => p.approvalStatus === 'approved')
)

const ministryReports = ref([
  {
    name: 'Worship',
    participants: 0,
    budget: 0,
    spent: 0,
    notes: '',
    attendance: []
  },
  {
    name: 'Bible Night Class',
    participants: 0,
    budget: 0,
    spent: 0,
    notes: '',
    attendance: []
  },
  {
    name: 'Small Groups',
    participants: 0,
    budget: 0,
    spent: 0,
    notes: '',
    attendance: []
  },
  {
    name: 'Mission',
    participants: 0,
    budget: 0,
    spent: 0,
    notes: '',
    attendance: []
  }
])

// Newsletter Management
const publishedNewsletters = ref([
  {
    id: 1,
    title: 'GCBF OCT 2025 — ISSUE 1 | VOL. 1',
    date: '2025-10-01',
    excerpt: 'Our inaugural newsletter featuring church updates, ministry highlights, and upcoming events.',
    issueNumber: 1,
    volume: 1,
    pageCount: 12,
    publishedBy: 'Pastor John Louie Berdejo',
    coverImage: '/newsletter/cover-gcbf-oct-2025-issue-1-vol-1.jpg',
    downloadUrl: '/newsletter/gcbf-oct-2025-issue-1-vol-1.pdf',
    highlights: [
      'Welcome Message from Pastor',
      'Ministry Updates and Reports',
      'Upcoming Events and Activities',
      'Community Outreach Programs',
      'Prayer Requests and Testimonies'
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
    // Validate required fields
    if (!newNewsletter.value.title || !newNewsletter.value.date || !newNewsletter.value.excerpt) {
      alert('Please fill in all required fields (Title, Date, Excerpt)')
      isUploading.value = false
      return
    }
    
    if (!newNewsletter.value.pdfFile) {
      alert('Please select a PDF file to upload')
      isUploading.value = false
      return
    }
    
    // Create a URL-safe filename from the title
    const safeTitle = newNewsletter.value.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    const pdfFileName = `${safeTitle}.pdf`
    const coverFileName = newNewsletter.value.coverFile ? `cover-${safeTitle}.jpg` : null
    
    // Upload files to R2 via API
    const formData = new FormData()
    formData.append('pdf', newNewsletter.value.pdfFile, pdfFileName)
    if (newNewsletter.value.coverFile) {
      formData.append('cover', newNewsletter.value.coverFile, coverFileName)
    }
    formData.append('pdfFileName', pdfFileName)
    if (coverFileName) {
      formData.append('coverFileName', coverFileName)
    }
    
    // Upload files
    const uploadResponse = await fetch('/api/newsletters/upload', {
      method: 'POST',
      body: formData
    })
    
    if (!uploadResponse.ok) {
      throw new Error('Failed to upload files')
    }
    
    const uploadResult = await uploadResponse.json()
    
    // Create newsletter metadata
    const newIssueNumber = publishedNewsletters.value.length > 0 
      ? Math.max(...publishedNewsletters.value.map(n => n.issueNumber)) + 1 
      : 1
    
    const newsletter = {
      id: Date.now(),
      title: newNewsletter.value.title,
      date: newNewsletter.value.date,
      excerpt: newNewsletter.value.excerpt,
      highlights: [...newNewsletter.value.highlights],
      issueNumber: newIssueNumber,
      volume: 1,
      pageCount: null,
      publishedBy: user?.name || 'Admin',
      coverImage: uploadResult.coverUrl || null,
      downloadUrl: uploadResult.pdfUrl
    }
    
    publishedNewsletters.value.unshift(newsletter)
    
    // Save to localStorage
    localStorage.setItem('churchNewsletters', JSON.stringify(publishedNewsletters.value))
    
    // Trigger homepage update
    window.dispatchEvent(new Event('newslettersUpdated'))
    
    alert('✅ Newsletter uploaded successfully!\n\n' +
          'Your newsletter has been uploaded to R2 storage and is now live on the homepage!')
    
    resetForm()
    
  } catch (error) {
    console.error('Error uploading newsletter:', error)
    alert('❌ Error uploading newsletter!\n\n' + 
          'Error: ' + error.message + '\n\n' +
          'Please check:\n' +
          '• PDF file is valid and not corrupted\n' +
          '• File size is reasonable (< 50MB)\n' +
          '• Your internet connection is stable\n\n' +
          'Try again or contact support if the issue persists.')
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
      
      // Trigger homepage update
      window.dispatchEvent(new Event('newslettersUpdated'))
      
      alert('Newsletter deleted successfully!')
    }
  }
}

// Computed values
const totalIncome = computed(() => {
  return incomeData.value.reduce((sum, item) => {
    // Use verified payments + Sunday collection for Tithes & Offerings
    if (item.category === 'Tithes & Offerings') {
      return sum + Number(totalVerifiedPaymentsThisMonth.value || 0) + Number(totalSundayCollection.value || 0)
    }
    return sum + Number(item.amount || 0)
  }, 0)
})

const totalExpenses = computed(() => {
  return expenseData.value.reduce((sum, item) => sum + Number(item.amount || 0), 0)
})

const netIncome = computed(() => {
  return Number(totalIncome.value) - Number(totalExpenses.value)
})

const ytdIncome = ref(510000)
const ytdExpenses = ref(465000)
const ytdNet = computed(() => ytdIncome.value - ytdExpenses.value)

// Calculate total verified payments for the current month
const totalVerifiedPaymentsThisMonth = computed(() => {
  let total = 0
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonthNum = currentDate.getMonth() + 1 // 1-12
  
  // Get all users' gifts from localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('gcbf_gifts_')) {
      const userGifts = JSON.parse(localStorage.getItem(key) || '[]')
      
      userGifts.forEach(gift => {
        if (gift.payments && gift.payments.length > 0) {
          gift.payments.forEach(payment => {
            // Only count approved/verified payments
            if (payment.verificationStatus === 'approved' && payment.verifiedDate) {
              const paymentDate = new Date(payment.verifiedDate)
              const paymentYear = paymentDate.getFullYear()
              const paymentMonth = paymentDate.getMonth() + 1
              
              // Check if payment was verified in the current month
              if (paymentYear === currentYear && paymentMonth === currentMonthNum) {
                total += payment.amount || 0
              }
            }
          })
        }
      })
    }
  }
  
  return total
})

// Calculate total pledges from all users
const totalPledges = computed(() => {
  let totalPledge = 0
  const users = JSON.parse(localStorage.getItem('gcbf_users') || '[]')
  users.forEach(user => {
    const gifts = JSON.parse(localStorage.getItem(`gcbf_gifts_${user.id}`) || '[]')
    gifts.forEach(gift => {
      if (gift.pledgeAmount) {
        totalPledge += gift.pledgeAmount
      }
    })
  })
  return totalPledge
})

// Calculate total Sunday collection
const totalSundayCollection = computed(() => {
  return Number(sundayCollection.value.first || 0) + 
         Number(sundayCollection.value.second || 0) + 
         Number(sundayCollection.value.third || 0) + 
         Number(sundayCollection.value.fourth || 0)
})

// Calculate total default income (excluding verified payments and Sunday collection)
const totalDefaultIncome = computed(() => {
  return defaultMonthlyIncome.value.reduce((sum, item) => sum + Number(item.amount || 0), 0)
})

// Calculate total default income WITH verified payments and Sunday collection
const totalDefaultIncomeWithVerified = computed(() => {
  return Number(totalDefaultIncome.value) + Number(totalVerifiedPaymentsThisMonth.value) + Number(totalSundayCollection.value)
})

// Calculate total default expenses (excluding Ministries & Programs)
const totalDefaultExpenses = computed(() => {
  return defaultMonthlyExpenses.value
    .filter(item => item.category !== 'Ministries & Programs')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)
})

// Calculate total default expenses WITH ministries budget
const totalDefaultExpensesWithMinistries = computed(() => {
  return Number(totalDefaultExpenses.value) + Number(totalMinistryBudget.value)
})

// Calculate default budget net (using total income with verified payments)
const defaultBudgetNet = computed(() => {
  return totalDefaultIncomeWithVerified.value - totalDefaultExpensesWithMinistries.value
})

// Calculate total ministry budget
const totalMinistryBudget = computed(() => {
  return ministryReports.value.reduce((sum, ministry) => sum + Number(ministry.budget || 0), 0)
})

// Calculate total ministry spent
const totalMinistrySpent = computed(() => {
  return ministryReports.value.reduce((sum, ministry) => sum + Number(ministry.spent || 0), 0)
})

// Projected income based on pledges (6 months)
const projectedIncome = computed(() => totalPledges.value * 6)

// Projected expenses based on default monthly expenses WITH ministries (6 months)
const projectedExpenses = computed(() => totalDefaultExpensesWithMinistries.value * 6)

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

// Prayer approval functions
const approvePrayer = (prayerId) => {
  const prayer = sharedPrayers.value.find(p => p.id === prayerId)
  if (prayer) {
    prayer.approvalStatus = 'approved'
    localStorage.setItem('gcbf_shared_prayers', JSON.stringify(sharedPrayers.value))
    alert('Prayer request approved and posted to community!')
  }
}

const rejectPrayer = (prayerId) => {
  if (confirm('Are you sure you want to reject this prayer request? It will be permanently removed.')) {
    const index = sharedPrayers.value.findIndex(p => p.id === prayerId)
    if (index !== -1) {
      sharedPrayers.value.splice(index, 1)
      localStorage.setItem('gcbf_shared_prayers', JSON.stringify(sharedPrayers.value))
      alert('Prayer request rejected and removed.')
    }
  }
}

const removePrayer = (prayerId) => {
  if (confirm('Are you sure you want to remove this prayer request from the community?')) {
    const index = sharedPrayers.value.findIndex(p => p.id === prayerId)
    if (index !== -1) {
      sharedPrayers.value.splice(index, 1)
      localStorage.setItem('gcbf_shared_prayers', JSON.stringify(sharedPrayers.value))
      alert('Prayer request removed.')
    }
  }
}

// Add community prayer (admin only)
const addCommunityPrayer = () => {
  if (!newCommunityPrayer.value.title || !newCommunityPrayer.value.category || !newCommunityPrayer.value.request) {
    alert('Please fill in all required fields')
    return
  }

  const prayer = {
    id: Date.now(),
    title: newCommunityPrayer.value.title,
    category: newCommunityPrayer.value.category,
    request: newCommunityPrayer.value.request,
    requestedBy: newCommunityPrayer.value.requestedBy || user?.name || 'Church Administrator',
    dateRequested: new Date().toISOString().split('T')[0],
    status: 'active',
    approvalStatus: 'approved' // Admin-created prayers are automatically approved
  }

  sharedPrayers.value.unshift(prayer)
  localStorage.setItem('gcbf_shared_prayers', JSON.stringify(sharedPrayers.value))
  
  // Reset form
  newCommunityPrayer.value = { title: '', category: '', request: '', requestedBy: '' }
  showAddCommunityPrayerModal.value = false
  
  alert('Community prayer added successfully!')
}

// Account management functions
const loadAllUsers = () => {
  const users = JSON.parse(localStorage.getItem('gcbf_users') || '[]')
  allUsers.value = users.sort((a, b) => {
    // Sort by userType first (admin, pastor, member), then by name
    const typeOrder = { admin: 1, pastor: 2, member: 3 }
    if (typeOrder[a.userType] !== typeOrder[b.userType]) {
      return typeOrder[a.userType] - typeOrder[b.userType]
    }
    return a.name.localeCompare(b.name)
  })
}

const editAccount = (account) => {
  editingAccount.value = {
    id: account.id,
    name: account.name,
    email: account.email,
    phone: account.phone || '',
    userType: account.userType,
    newPassword: '',
    originalPassword: account.password
  }
  showEditAccountModal.value = true
}

const closeAccountModal = () => {
  showEditAccountModal.value = false
  editingAccount.value = { id: '', name: '', email: '', phone: '', userType: '', newPassword: '' }
}

const saveAccount = () => {
  if (!editingAccount.value.name || !editingAccount.value.email || !editingAccount.value.userType) {
    alert('Please fill in all required fields')
    return
  }

  const users = JSON.parse(localStorage.getItem('gcbf_users') || '[]')
  const index = users.findIndex(u => u.id === editingAccount.value.id)
  
  if (index !== -1) {
    // Update user data
    users[index] = {
      ...users[index],
      name: editingAccount.value.name,
      email: editingAccount.value.email,
      phone: editingAccount.value.phone,
      userType: editingAccount.value.userType,
      // Only update password if a new one was provided
      password: editingAccount.value.newPassword || editingAccount.value.originalPassword
    }
    
    localStorage.setItem('gcbf_users', JSON.stringify(users))
    
    // If editing current user, update the session
    if (editingAccount.value.id === user?.id) {
      const { password, ...userWithoutPassword } = users[index]
      localStorage.setItem('gcbf_auth', JSON.stringify(userWithoutPassword))
    }
    
    loadAllUsers()
    closeAccountModal()
    alert('Account updated successfully!')
  }
}

const deleteAccount = (accountId) => {
  if (accountId === user?.id) {
    alert('You cannot delete your own account!')
    return
  }

  if (!confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
    return
  }

  const users = JSON.parse(localStorage.getItem('gcbf_users') || '[]')
  const index = users.findIndex(u => u.id === accountId)
  
  if (index !== -1) {
    const deletedUser = users[index]
    users.splice(index, 1)
    localStorage.setItem('gcbf_users', JSON.stringify(users))
    
    // Clean up user data
    localStorage.removeItem(`gcbf_prayers_${accountId}`)
    localStorage.removeItem(`gcbf_gifts_${accountId}`)
    
    loadAllUsers()
    alert(`Account for ${deletedUser.name} has been deleted.`)
  }
}

const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
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

// Get ministry percentage of total budget
const getMinistryPercentage = (budget) => {
  if (totalMinistryBudget.value === 0) return 0
  return ((budget / totalMinistryBudget.value) * 100).toFixed(1)
}

// Get progress bar class based on spending
const getProgressBarClass = (spent, budget) => {
  const percentage = (spent / budget) * 100
  if (percentage > 100) return 'bg-danger'
  if (percentage > 90) return 'bg-warning'
  return 'bg-success'
}

// Save ministry allocations (spent amounts)
const saveMinistryAllocations = () => {
  localStorage.setItem('gcbf_ministry_reports', JSON.stringify(ministryReports.value))
  alert('Ministry allocations saved successfully!')
}

// Get average attendance for a ministry
const getAverageAttendance = (ministry) => {
  if (!ministry.attendance || ministry.attendance.length === 0) return 0
  const total = ministry.attendance.reduce((sum, record) => sum + record.count, 0)
  return Math.round(total / ministry.attendance.length)
}

// Edit ministry notes
const editMinistryNotes = (ministry) => {
  editingMinistryForNotes.value = ministry
  editingNotes.value = ministry.notes || ''
  showEditNotesModal.value = true
}

// Save ministry notes
const saveMinistryNotes = () => {
  const index = ministryReports.value.findIndex(m => m.name === editingMinistryForNotes.value.name)
  if (index !== -1) {
    ministryReports.value[index].notes = editingNotes.value
    localStorage.setItem('gcbf_ministry_reports', JSON.stringify(ministryReports.value))
    closeNotesModal()
    alert('Admin notes saved successfully!')
  }
}

// Close notes modal
const closeNotesModal = () => {
  showEditNotesModal.value = false
  editingMinistryForNotes.value = null
  editingNotes.value = ''
}

// Show add attendance modal
const showAddAttendance = (ministry) => {
  editingMinistryForAttendance.value = ministry
  newAttendance.value = { 
    date: new Date().toISOString().split('T')[0], 
    count: 0, 
    notes: '' 
  }
  showAttendanceModal.value = true
}

// Save attendance
const saveAttendance = () => {
  if (!newAttendance.value.date || newAttendance.value.count < 0) {
    alert('Please fill in all required fields')
    return
  }

  const index = ministryReports.value.findIndex(m => m.name === editingMinistryForAttendance.value.name)
  if (index !== -1) {
    if (!ministryReports.value[index].attendance) {
      ministryReports.value[index].attendance = []
    }
    
    ministryReports.value[index].attendance.push({
      date: newAttendance.value.date,
      count: newAttendance.value.count,
      notes: newAttendance.value.notes || ''
    })
    
    // Sort by date descending
    ministryReports.value[index].attendance.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    localStorage.setItem('gcbf_ministry_reports', JSON.stringify(ministryReports.value))
    closeAttendanceModal()
    alert('Attendance added successfully!')
    
    // Refresh the attendance chart with updated data
    setTimeout(() => {
      const canvas = document.getElementById('attendanceChart')
      if (canvas) {
        initAttendanceChart()
      }
    }, 100)
  }
}

// Close attendance modal
const closeAttendanceModal = () => {
  showAttendanceModal.value = false
  editingMinistryForAttendance.value = null
  newAttendance.value = { date: '', count: 0, notes: '' }
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

// View receipt in modal
const viewReceipt = (payment) => {
  viewingReceipt.value = payment
  showReceiptModal.value = true
}

// Close receipt modal
const closeReceiptModal = () => {
  showReceiptModal.value = false
  viewingReceipt.value = null
}

// Edit payment
const editPayment = (payment) => {
  editingPayment.value = {
    giftId: payment.giftId,
    id: payment.id,
    memberName: payment.memberName,
    amount: payment.amount,
    dueDate: payment.dueDate,
    paymentDate: payment.paymentDate || '',
    paymentMethod: payment.paymentMethod,
    referenceNumber: payment.referenceNumber || '',
    receiptFileName: payment.receiptFileName || '',
    verificationStatus: payment.verificationStatus,
    notes: payment.notes || '',
    userId: payment.userId
  }
  showEditPaymentModal.value = true
}

// Save payment changes
const savePayment = () => {
  if (!editingPayment.value.amount || editingPayment.value.amount <= 0) {
    alert('Please enter a valid amount')
    return
  }

  // Find and update the payment in localStorage
  const key = `gcbf_gifts_${editingPayment.value.userId}`
  const userGifts = JSON.parse(localStorage.getItem(key) || '[]')
  const gift = userGifts.find(g => g.id === editingPayment.value.giftId)
  
  if (gift) {
    const payment = gift.payments.find(p => p.id === editingPayment.value.id)
    if (payment) {
      payment.amount = editingPayment.value.amount
      payment.dueDate = editingPayment.value.dueDate
      payment.paymentDate = editingPayment.value.paymentDate
      payment.paymentMethod = editingPayment.value.paymentMethod
      payment.referenceNumber = editingPayment.value.referenceNumber
      payment.receiptFileName = editingPayment.value.receiptFileName
      payment.verificationStatus = editingPayment.value.verificationStatus
      payment.notes = editingPayment.value.notes
      
      // If status changed to approved/rejected, update verification info
      if (['approved', 'rejected'].includes(editingPayment.value.verificationStatus)) {
        payment.verifiedBy = user?.name || 'Admin'
        payment.verifiedDate = new Date().toISOString().split('T')[0]
      }
      
      // Save back to localStorage
      localStorage.setItem(key, JSON.stringify(userGifts))
      closePaymentModal()
      loadAllPayments()
      alert('Payment updated successfully!')
    }
  }
}

// Close payment modal
const closePaymentModal = () => {
  showEditPaymentModal.value = false
  editingPayment.value = {
    giftId: '',
    id: '',
    memberName: '',
    amount: 0,
    dueDate: '',
    paymentDate: '',
    paymentMethod: 'online',
    referenceNumber: '',
    receiptFileName: '',
    verificationStatus: 'pending',
    notes: ''
  }
}

// Delete payment
const deletePayment = (giftId, paymentId) => {
  if (!confirm('Are you sure you want to delete this payment? This action cannot be undone.')) {
    return
  }

  // Find and remove the payment from localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('gcbf_gifts_')) {
      const userGifts = JSON.parse(localStorage.getItem(key) || '[]')
      const gift = userGifts.find(g => g.id === giftId)
      
      if (gift) {
        const paymentIndex = gift.payments.findIndex(p => p.id === paymentId)
        if (paymentIndex !== -1) {
          gift.payments.splice(paymentIndex, 1)
          
          // Save back to localStorage
          localStorage.setItem(key, JSON.stringify(userGifts))
          loadAllPayments()
          alert('Payment deleted successfully!')
          break
        }
      }
    }
  }
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

// Edit ministry
const editMinistry = (ministry) => {
  editingMinistry.value = { ...ministry }
  showEditMinistryModal.value = true
}

// Save ministry
const saveMinistry = () => {
  const index = ministryReports.value.findIndex(m => m.name === editingMinistry.value.name)
  if (index !== -1) {
    ministryReports.value[index] = { ...editingMinistry.value }
    localStorage.setItem('gcbf_ministry_reports', JSON.stringify(ministryReports.value))
    showEditMinistryModal.value = false
    alert('Ministry report updated successfully!')
  }
}

// Close ministry modal
const closeMinistryModal = () => {
  showEditMinistryModal.value = false
  editingMinistry.value = { name: '', participants: 0, budget: 0 }
}

// Save default income (MONTHLY BUDGET - Default/Expected Amounts)
const saveDefaultIncome = () => {
  localStorage.setItem('gcbf_default_income', JSON.stringify(defaultMonthlyIncome.value))
  localStorage.setItem('gcbf_sunday_collection', JSON.stringify(sundayCollection.value))
  
  // Sync Monthly Budget to Financial Report
  // Update incomeData with values from defaultMonthlyIncome and verified payments
  const updatedIncomeData = []
  
  // Add Tithes & Offerings (from verified payments + Sunday collection)
  updatedIncomeData.push({ 
    category: 'Tithes & Offerings', 
    amount: totalVerifiedPaymentsThisMonth.value + totalSundayCollection.value 
  })
  
  // Add all other income categories from Monthly Budget
  defaultMonthlyIncome.value.forEach(item => {
    // Skip Tithes & Offerings since we already added it with verified + Sunday collection
    if (item.category !== 'Tithes & Offerings') {
      updatedIncomeData.push({ ...item })
    }
  })
  
  // Update incomeData and save to localStorage
  incomeData.value = updatedIncomeData
  localStorage.setItem('gcbf_income_data', JSON.stringify(incomeData.value))
  
  alert('Monthly budget income saved and synced to Financial Report!')
}

// Add income category (MONTHLY BUDGET)
const addIncomeCategory = () => {
  if (newIncomeCategory.value.category && newIncomeCategory.value.amount >= 0) {
    defaultMonthlyIncome.value.push({ ...newIncomeCategory.value })
    saveDefaultIncome()
    showAddIncomeCategoryModal.value = false
    newIncomeCategory.value = { category: '', amount: 0 }
  }
}

// Remove income category (MONTHLY BUDGET)
const removeIncomeCategory = (index) => {
  if (confirm('Are you sure you want to remove this income category?')) {
    defaultMonthlyIncome.value.splice(index, 1)
    saveDefaultIncome()
  }
}

// Reset expenses to default values
const resetExpensesToDefault = () => {
  if (confirm('Are you sure you want to reset all expenses to ₱0? This will clear all expense data.')) {
    // Reset to zero values
    const zeroExpenses = [
      { category: 'Staff & Benefits', amount: 0 },
      { category: 'Facilities & Utilities', amount: 0 },
      { category: 'Ministries & Programs', amount: 0 },
      { category: 'Missions Support', amount: 0 },
      { category: 'Administrative', amount: 0 },
      { category: 'Maintenance', amount: 0 }
    ]
    
    // Update both arrays
    defaultMonthlyExpenses.value = zeroExpenses.map(item => ({ ...item }))
    expenseData.value = zeroExpenses.map(item => ({ ...item }))
    
    // Clear and reset localStorage
    localStorage.removeItem('gcbf_default_expenses')
    localStorage.removeItem('gcbf_expense_data')
    localStorage.setItem('gcbf_default_expenses', JSON.stringify(defaultMonthlyExpenses.value))
    localStorage.setItem('gcbf_expense_data', JSON.stringify(expenseData.value))
    
    alert('All expenses have been reset to ₱0!')
  }
}

// Save default expenses (MONTHLY BUDGET - Default/Expected Amounts)
const saveDefaultExpenses = () => {
  localStorage.setItem('gcbf_default_expenses', JSON.stringify(defaultMonthlyExpenses.value))
  
  // Sync Monthly Budget to Financial Report
  // Update expenseData with values from defaultMonthlyExpenses
  const updatedExpenseData = defaultMonthlyExpenses.value.map(item => ({ ...item }))
  
  // Update expenseData and save to localStorage
  expenseData.value = updatedExpenseData
  localStorage.setItem('gcbf_expense_data', JSON.stringify(expenseData.value))
  
  alert('Monthly budget expenses saved and synced to Financial Report!')
}

// Add expense category (MONTHLY BUDGET)
const addExpenseCategory = () => {
  if (newExpenseCategory.value.category && newExpenseCategory.value.amount >= 0) {
    defaultMonthlyExpenses.value.push({ ...newExpenseCategory.value })
    saveDefaultExpenses()
    showAddExpenseCategoryModal.value = false
    newExpenseCategory.value = { category: '', amount: 0 }
  }
}

// Remove expense category (MONTHLY BUDGET)
const removeExpenseCategory = (index) => {
  if (confirm('Are you sure you want to remove this expense category?')) {
    defaultMonthlyExpenses.value.splice(index, 1)
    saveDefaultExpenses()
  }
}

// Initialize 6-month trend chart
const initMonthlyTrendChart = () => {
  const canvas = document.getElementById('monthlyTrendChart')
  if (canvas) {
    const ctx = canvas.getContext('2d')
    
    // Generate next 6 months starting from current month
    const months = []
    const currentDate = new Date()
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1)
      months.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }))
      }
      
      // Current month has actual data, future months show projected/budgeted amounts
      const incomeData = [totalIncome.value, 15000, 16000, 14500, 17000, 15500]
      const expenseData = [totalExpenses.value, 12000, 13000, 12500, 14000, 13500]
      
      const drawChart = () => {
        const width = canvas.width = canvas.offsetWidth
        const height = canvas.height = 400
        const padding = 60
        const chartWidth = width - padding * 2
        const chartHeight = height - padding * 2
        
        ctx.clearRect(0, 0, width, height)
        
        // Find max value for scaling
        const maxValue = Math.max(...incomeData, ...expenseData, 20000)
        const barWidth = chartWidth / (months.length * 2.5)
        const gap = barWidth * 0.2  // Reduced gap between income and expense bars
        
        // Draw axes
        ctx.strokeStyle = '#999'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(padding, padding)
        ctx.lineTo(padding, height - padding)
        ctx.lineTo(width - padding, height - padding)
        ctx.stroke()
        
        // Draw bars and labels
        months.forEach((month, i) => {
          const x = padding + (i * (barWidth * 2 + gap + barWidth * 0.5))  // Adjusted spacing
          
          // Income bar (green)
          const incomeHeight = (incomeData[i] / maxValue) * chartHeight
          ctx.fillStyle = '#198754'
          ctx.fillRect(x, height - padding - incomeHeight, barWidth, incomeHeight)
          
          // Expense bar (red)
          const expenseHeight = (expenseData[i] / maxValue) * chartHeight
          ctx.fillStyle = '#dc3545'
          ctx.fillRect(x + barWidth + gap, height - padding - expenseHeight, barWidth, expenseHeight)
          
          // Month label
          ctx.fillStyle = '#000'
          ctx.font = '11px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(month, x + barWidth + gap / 2, height - padding + 20)
        })
        
        // Legend
        ctx.fillStyle = '#198754'
        ctx.fillRect(width - 150, 20, 20, 15)
        ctx.fillStyle = '#000'
        ctx.font = '12px Arial'
        ctx.textAlign = 'left'
        ctx.fillText('Income', width - 125, 32)
        
        ctx.fillStyle = '#dc3545'
        ctx.fillRect(width - 150, 40, 20, 15)
        ctx.fillStyle = '#000'
        ctx.fillText('Expenses', width - 125, 52)
        
        // Y-axis labels
        ctx.textAlign = 'right'
        ctx.font = '11px Arial'
        for (let i = 0; i <= 4; i++) {
          const value = (maxValue / 4) * i
          const y = height - padding - (chartHeight / 4) * i
          ctx.fillText('₱' + Math.round(value).toLocaleString(), padding - 10, y + 5)
        }
      }
      
      drawChart()
    }
  }

// Initialize attendance trend chart
const initAttendanceChart = () => {
    const canvas = document.getElementById('attendanceChart')
    if (canvas) {
      const ctx = canvas.getContext('2d')
      
      // Generate 6 months starting from current month (like the financial chart)
      const months = []
      const currentDate = new Date()
      for (let i = 0; i < 6; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1)
        months.push({
          label: date.toLocaleDateString('en-US', { month: 'short' }),
          month: date.getMonth(),
          year: date.getFullYear()
        })
      }
      
      // Helper function to get week number in month from date
      const getWeekInMonth = (dateStr) => {
        const date = new Date(dateStr)
        const day = date.getDate()
        return Math.ceil(day / 7)
      }
      
      // Helper function to aggregate attendance by week for a specific month/year
      const getMonthlyWeeklyData = (ministryName, month, year) => {
        const ministry = ministryReports.value.find(m => m.name === ministryName)
        if (!ministry || !ministry.attendance || ministry.attendance.length === 0) {
          return [0, 0, 0, 0] // Return zeros for 4 weeks if no data
        }
        
        // Filter for specific month and year
        const monthData = ministry.attendance.filter(record => {
          const date = new Date(record.date)
          return date.getMonth() === month && date.getFullYear() === year
        })
        
        // Aggregate by week (4 weeks per month)
        // TOTAL all attendance for each week (not average)
        // This allows for multiple meetings per week (e.g., Small Groups)
        const weeklyTotals = [0, 0, 0, 0]
        
        monthData.forEach(record => {
          const weekNum = getWeekInMonth(record.date)
          if (weekNum >= 1 && weekNum <= 4) {
            weeklyTotals[weekNum - 1] += Number(record.count || 0)
          }
        })
        
        // Return total attendance per week
        return weeklyTotals
      }
      
      // Get real attendance data from ministry reports for all 6 months
      // Each month has 4 weeks, so we'll have 24 data points total
      const worshipData = []
      const bibleNightData = []
      const smallGroupsData = []
      
      months.forEach(monthInfo => {
        worshipData.push(...getMonthlyWeeklyData('Worship', monthInfo.month, monthInfo.year))
        bibleNightData.push(...getMonthlyWeeklyData('Bible Night Class', monthInfo.month, monthInfo.year))
        smallGroupsData.push(...getMonthlyWeeklyData('Small Groups', monthInfo.month, monthInfo.year))
      })
      
      // Debug: Log the attendance data being used
      console.log('Worship Attendance Data:', worshipData)
      console.log('Bible Night Attendance Data:', bibleNightData)
      console.log('Small Groups Attendance Data:', smallGroupsData)
      
      // Generate week labels (4 weeks per month for 6 months = 24 weeks)
      const weeks = []
      months.forEach(monthInfo => {
        for (let w = 1; w <= 4; w++) {
          weeks.push(`${monthInfo.label} W${w}`)
        }
      })
      
      const drawAttendanceChart = () => {
        const width = canvas.width = canvas.offsetWidth
        const height = canvas.height = 400
        const padding = 60
        const chartWidth = width - padding * 2
        const chartHeight = height - padding * 2
        
        ctx.clearRect(0, 0, width, height)
        
        // Find max value
        const maxValue = Math.max(...worshipData, ...bibleNightData, ...smallGroupsData, 100)
        
        // Draw axes
        ctx.strokeStyle = '#999'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(padding, padding)
        ctx.lineTo(padding, height - padding)
        ctx.lineTo(width - padding, height - padding)
        ctx.stroke()
        
        // Draw lines for each ministry
        const drawLine = (data, color) => {
          ctx.strokeStyle = color
          ctx.lineWidth = 3
          ctx.beginPath()
          
          // Draw the line connecting all points
          data.forEach((value, i) => {
            const x = padding + (i * (chartWidth / (weeks.length - 1)))
            const y = height - padding - ((value / maxValue) * chartHeight)
            
            if (i === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          })
          
          ctx.stroke()
          
          // Draw points (circles) on top of the line
          data.forEach((value, i) => {
            const x = padding + (i * (chartWidth / (weeks.length - 1)))
            const y = height - padding - ((value / maxValue) * chartHeight)
            
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(x, y, 5, 0, Math.PI * 2)
            ctx.fill()
          })
          
          // Draw value labels beside each point (to the right)
          ctx.fillStyle = color
          ctx.font = 'bold 10px Arial'
          ctx.textAlign = 'left'
          data.forEach((value, i) => {
            const x = padding + (i * (chartWidth / (weeks.length - 1)))
            const y = height - padding - ((value / maxValue) * chartHeight)
            ctx.fillText(value, x + 10, y + 4)
          })
        }
        
        // Draw ministry lines
        drawLine(worshipData, '#6f42c1')      // Purple for Worship
        drawLine(bibleNightData, '#0d6efd')   // Blue for Bible Night Class
        drawLine(smallGroupsData, '#198754')  // Green for Small Groups
        
        // Draw week labels
        ctx.fillStyle = '#000'
        ctx.font = '11px Arial'
        ctx.textAlign = 'center'
        weeks.forEach((week, i) => {
          const x = padding + (i * (chartWidth / (weeks.length - 1)))
          ctx.fillText(week, x, height - padding + 20)
        })
        
        // Legend
        ctx.font = '12px Arial'
        ctx.textAlign = 'left'
        
        ctx.fillStyle = '#6f42c1'
        ctx.fillRect(width - 180, 20, 20, 15)
        ctx.fillStyle = '#000'
        ctx.fillText('Worship', width - 155, 32)
        
        ctx.fillStyle = '#0d6efd'
        ctx.fillRect(width - 180, 40, 20, 15)
        ctx.fillStyle = '#000'
        ctx.fillText('Bible Night Class', width - 155, 52)
        
        ctx.fillStyle = '#198754'
        ctx.fillRect(width - 180, 60, 20, 15)
        ctx.fillStyle = '#000'
        ctx.fillText('Small Groups', width - 155, 72)
        
        // Y-axis labels
        ctx.textAlign = 'right'
        ctx.font = '11px Arial'
        for (let i = 0; i <= 4; i++) {
          const value = (maxValue / 4) * i
          const y = height - padding - (chartHeight / 4) * i
          ctx.fillText(Math.round(value), padding - 10, y + 5)
        }
      }
      
      drawAttendanceChart()
    }
  }

onMounted(() => {
  // Load all payments for verification
  loadAllPayments()
  
  // Load all users for account management
  loadAllUsers()
  
  // Load existing newsletters from localStorage
  try {
    const savedNewsletters = localStorage.getItem('churchNewsletters')
    if (savedNewsletters) {
      const parsed = JSON.parse(savedNewsletters)
      // Only filter out newsletters with timestamp-based fake filenames (e.g., 1760749774682.pdf)
      const validNewsletters = parsed.filter(n => 
        n.downloadUrl && !n.downloadUrl.match(/\/newsletter\/\d+\.pdf$/)
      )
      publishedNewsletters.value = validNewsletters
      
      // Save cleaned list back
      localStorage.setItem('churchNewsletters', JSON.stringify(validNewsletters))
      
      // Trigger homepage update
      window.dispatchEvent(new Event('newslettersUpdated'))
    }
  } catch (error) {
    console.error('Error loading newsletters:', error)
  }
  
  // Load shared prayers from localStorage
  try {
    const savedPrayers = localStorage.getItem('gcbf_shared_prayers')
    if (savedPrayers) {
      sharedPrayers.value = JSON.parse(savedPrayers)
    }
  } catch (error) {
    console.error('Error loading prayers from localStorage:', error)
  }

  // Load saved financial data
  try {
    // Load FINANCIAL REPORTS data (actual current month income/expenses)
    const savedIncome = localStorage.getItem('gcbf_income_data')
    if (savedIncome) {
      incomeData.value = JSON.parse(savedIncome).map(item => ({
        ...item,
        amount: Number(item.amount || 0)
      }))
    }

    const savedExpense = localStorage.getItem('gcbf_expense_data')
    if (savedExpense) {
      expenseData.value = JSON.parse(savedExpense).map(item => ({
        ...item,
        amount: Number(item.amount || 0)
      }))
    }

    // Load MINISTRY REPORTS data
    const savedMinistry = localStorage.getItem('gcbf_ministry_reports')
    if (savedMinistry) {
      ministryReports.value = JSON.parse(savedMinistry).map(ministry => ({
        ...ministry,
        budget: Number(ministry.budget || 0),
        spent: Number(ministry.spent || 0),
        participants: Number(ministry.participants || 0)
      }))
    }

    // Load MONTHLY BUDGET data (default/expected monthly amounts for forecasting)
    const savedDefaultExpenses = localStorage.getItem('gcbf_default_expenses')
    if (savedDefaultExpenses) {
      defaultMonthlyExpenses.value = JSON.parse(savedDefaultExpenses).map(item => ({
        ...item,
        amount: Number(item.amount || 0)
      }))
    }

    const savedDefaultIncome = localStorage.getItem('gcbf_default_income')
    if (savedDefaultIncome) {
      defaultMonthlyIncome.value = JSON.parse(savedDefaultIncome).map(item => ({
        ...item,
        amount: Number(item.amount || 0)
      }))
    }

    const savedSundayCollection = localStorage.getItem('gcbf_sunday_collection')
    if (savedSundayCollection) {
      const parsed = JSON.parse(savedSundayCollection)
      sundayCollection.value = {
        first: Number(parsed.first || 0),
        second: Number(parsed.second || 0),
        third: Number(parsed.third || 0),
        fourth: Number(parsed.fourth || 0)
      }
    }
  } catch (error) {
    console.error('Error loading financial data from localStorage:', error)
  }
  
  // Initialize charts AFTER data is loaded
  setTimeout(() => {
    initMonthlyTrendChart()
    initAttendanceChart()
  }, 200)
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