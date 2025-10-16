# Church Financial System - Data Structure Explanation

## Overview
The Church Portal has **TWO LINKED** financial tracking systems:

**Monthly Budget → Financial Reports**
When you save Monthly Budget changes, the system automatically syncs those values to Financial Reports. This ensures your expected budget values are reflected in your current month's financial reporting.

---

## 1. Financial Reports (Actual Monthly Data)
**Purpose:** Track actual income and expenses for the current month

**Location in UI:** "Financial Reports" tab

**Data Variables:**
- `incomeData` - Actual income received this month
- `expenseData` - Actual expenses paid this month

**LocalStorage Keys:**
- `gcbf_income_data` - Stores actual income data
- `gcbf_expense_data` - Stores actual expense data

**Features:**
- Shows current month actuals
- **"Tithes & Offerings" is automatically calculated from verified payments + Sunday collection**
- Other income categories are synced from Monthly Budget
- Used for financial reporting and Year-to-Date summaries
- **Read-only** - cannot be edited directly
- **Automatically synced from Monthly Budget when you save budget changes**

**Example Data:**
```javascript
incomeData = [
  { category: 'Tithes & Offerings', amount: 0 },  // Auto-calculated from verified payments
  { category: 'Special Donations', amount: 4750 }  // Manual tracking
]
```

**Important:** The "Tithes & Offerings" amount is dynamically calculated from all payments that were verified (approved) in the current month. This ensures accurate tracking of actual giving.

---

## 2. Monthly Budget (Default/Expected Amounts)
**Purpose:** Set expected/default monthly amounts for budget planning and forecasting

**Location in UI:** "Monthly Budget" tab

**Data Variables:**
- `defaultMonthlyIncome` - Expected monthly income (other sources)
- `defaultMonthlyExpenses` - Expected monthly expenses
- `weeklyCollectionAmount` - Editable weekly tithes & offerings collection
- `totalVerifiedPaymentsThisMonth` - Auto-calculated verified payments

**LocalStorage Keys:**
- `gcbf_default_income` - Stores default income budget
- `gcbf_default_expenses` - Stores default expense budget
- `gcbf_weekly_collection` - Stores weekly collection amount

**Features:**
- Shows expected monthly amounts
- **Special Tithes & Offerings Section:**
  - **Verified Payments** (Non-editable, Auto-calculated): Shows total from payment verification system
  - **Sunday Collection** (Editable with breakdown): Manual entry for cash/check collections from each Sunday service
    - 1st Sunday
    - 2nd Sunday
    - 3rd Sunday
    - 4th Sunday
    - Auto-calculates total from all 4 Sundays
- Admin can edit, add, or remove other income categories
- Includes auto-calculated "Ministries & Programs" based on ministry budgets
- Used for 6-month budget forecasting
- Total income = Verified Payments + Sunday Collection + Other Income

**Example Data:**
```javascript
// Auto-calculated (locked)
totalVerifiedPaymentsThisMonth = 35000  // From payment verification

// Editable
weeklyCollectionAmount = 15000  // Weekly cash/check offerings

// Other income categories
defaultMonthlyIncome = [
  { category: 'Special Donations', amount: 5000 },
  { category: 'Fundraising Events', amount: 2000 }
]

// Total = 35000 + 15000 + 5000 + 2000 = 57000
```

---

## 3. Budget Forecast System
**Purpose:** Project 6-month financial outlook

**Location in UI:** "Budget Forecast" tab

**How it Works:**
- **Projected Income:** Total member pledges × 6 months
- **Projected Expenses:** Total default monthly expenses × 6 months
- **Projected Net:** Projected Income - Projected Expenses

**Data Sources:**
- Uses `totalPledges` from all member giving pledges
- Uses `defaultMonthlyExpenses` + ministry budgets

---

## 4. Ministry Reports
**Purpose:** Track ministry participation, attendance, and budgets

**Location in UI:** "Ministry Reports" tab

**Data Variable:** `ministryReports`

**LocalStorage Key:** `gcbf_ministry_reports`

**Structure:**
```javascript
{
  name: 'Worship',
  participants: 25,
  budget: 1800,           // Monthly budget allocation
  spent: 1400,            // Not displayed, kept for expense tracking
  notes: 'Admin notes',   // Admin coordination notes
  attendance: [           // Historical attendance records
    { date: '2025-10-06', count: 28, notes: 'Great session' }
  ]
}
```

**Important:**
- Ministry budgets are automatically included in "Monthly Budget" expenses under "Ministries & Programs"
- The budget amount is used for expense tracking but NOT displayed in ministry cards
- Focus is on attendance tracking and admin coordination

---

## Key Differences

| Feature | Financial Reports | Monthly Budget |
|---------|------------------|----------------|
| **Purpose** | Track actuals | Plan/forecast |
| **Data Type** | Current month | Expected monthly |
| **Storage Keys** | `gcbf_income_data`, `gcbf_expense_data` | `gcbf_default_income`, `gcbf_default_expenses` |
| **Used For** | Reporting, YTD summaries | Forecasting, budget planning |
| **Editable** | No (auto-synced) | Yes |
| **Example Amount** | What we received/spent | What we expect to receive/spend |

---

## Data Flow

```
Payment Verification → Verified Payments (This Month)
                              ↓
                    Tithes & Offerings
                              ↓
Ministry Budgets → Monthly Budget → Financial Reports (Auto-synced)
                         ↓
                   Budget Forecast
```

**Sync Process:**
1. Admin edits Monthly Budget (income or expenses)
2. Admin clicks "Save Changes"
3. System automatically updates Financial Reports with same values
4. Both Monthly Budget and Financial Reports show consistent data

---

## Admin Operations

### To Update Financial Reports:
**Financial Reports are now automatically synced from Monthly Budget!**
1. Go to "Monthly Budget" tab
2. Modify income or expense amounts (including Sunday Collection)
3. Click "Save Changes"
4. System automatically:
   - Saves to `gcbf_default_income` or `gcbf_default_expenses`
   - Updates Financial Reports with the same values
   - Syncs to `gcbf_income_data` or `gcbf_expense_data`
5. Navigate to "Financial Reports" to see updated values

**Note:** Financial Reports are read-only and reflect your Monthly Budget values plus verified payments.

### To Edit Ministry Budgets:
1. Go to "Ministry Reports" tab
2. Click "Edit" button on ministry card
3. Modify participants or budget
4. Click "Save Changes"
5. Ministry budget automatically updates "Ministries & Programs" in Monthly Budget expenses

---

## Summary

✅ **Financial Reports** = Current month actuals (auto-synced from Monthly Budget + Verified Payments)  
✅ **Monthly Budget** = Expected monthly amounts (editable, syncs to Financial Reports)  
✅ **Budget Forecast** = 6-month projection based on pledges and budget  
✅ **Ministry Reports** = Track ministry activities, attendance, and coordination  
✅ **Sync Feature** = Monthly Budget automatically updates Financial Reports when saved  

**These systems are INDEPENDENT** - editing one does not affect the other!
