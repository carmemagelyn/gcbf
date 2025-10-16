# Tithes & Offerings Integration with Payment Verification

## Overview
The "Tithes & Offerings" amount in the Financial Reports is now **automatically calculated** from verified payments for the current month. This ensures accurate, real-time tracking of actual giving without manual data entry.

---

## How It Works

### 1. Payment Flow
```
Member Makes Gift Pledge
    ↓
Member Uploads Payment Receipt
    ↓
Admin Verifies/Approves Payment → Payment gets verifiedDate
    ↓
Payment is Counted in "Tithes & Offerings" for that month
```

### 2. Calculation Logic

**File:** `src/views/ChurchPortalView.vue`

**Computed Property:** `totalVerifiedPaymentsThisMonth`
```javascript
// Scans all user gifts
// Filters payments where:
//   - verificationStatus === 'approved'
//   - verifiedDate is in current month/year
// Sums the payment amounts
```

**Display Logic:**
```javascript
// In Financial Reports income display
if (income.category === 'Tithes & Offerings') {
  amount = totalVerifiedPaymentsThisMonth
} else {
  amount = income.amount // from incomeData
}
```

---

## Current Month Detection

The system automatically detects the current month:
```javascript
const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonthNum = currentDate.getMonth() + 1 // 1-12
```

Payments are counted if:
```javascript
paymentYear === currentYear && paymentMonth === currentMonthNum
```

---

## User Interface

### Financial Reports Tab
- **Income Breakdown** section shows:
  - "Tithes & Offerings" with amount from verified payments
  - Small note: "(From verified payments this month)"
  - Other income categories with manual amounts

### Example Display:
```
Income Breakdown - October 2025

Tithes & Offerings
(From verified payments this month)          ₱45,250

Special Donations                            ₱4,750
Fundraising Events                           ₱2,200
Investment Returns                           ₱800
Other Income                                 ₱500
```

---

## Data Sources

### Verified Payments
- **Location:** `localStorage.getItem('gcbf_gifts_{userId}')`
- **Structure:**
  ```javascript
  {
    payments: [
      {
        id: 1,
        amount: 5000,
        verificationStatus: 'approved',
        verifiedDate: '2025-10-15',  // ← Key field for monthly counting
        verifiedBy: 'Admin Name'
      }
    ]
  }
  ```

### Other Income
- **Location:** `localStorage.getItem('gcbf_income_data')`
- **Structure:**
  ```javascript
  [
    { category: 'Tithes & Offerings', amount: 0 },  // Ignored, uses verified payments
    { category: 'Special Donations', amount: 4750 },
    { category: 'Fundraising Events', amount: 2200 }
  ]
  ```

---

## Admin Workflow

### To Record Monthly Income:

1. **Tithes & Offerings** (Automatic)
   - Members upload payment receipts in their giving dashboard
   - Go to "Payment Verification" tab
   - Review and approve valid payments
   - System automatically adds approved amounts to current month's Tithes & Offerings
   - No manual entry needed!

2. **Other Income Categories** (Manual)
   - Special donations, fundraising, etc. need manual tracking
   - Currently displayed from `incomeData` stored values
   - Future enhancement: Could add edit functionality for these categories

---

## Benefits

✅ **Accuracy:** Direct link between payment verification and financial reports  
✅ **Real-time:** Updates automatically as payments are verified  
✅ **Transparency:** Clear source of Tithes & Offerings data  
✅ **Audit Trail:** All payments have verification dates and approver names  
✅ **No Double Entry:** Admin doesn't need to manually enter tithes amounts  

---

## Monthly Transition

When the month changes:
- Previous month's verified payments are no longer counted
- Current month starts at ₱0 for Tithes & Offerings
- Only payments verified in the new month are counted
- Historical data remains in payment records

Example:
- October 2025: Payments verified in October → Count for October
- November 2025: System automatically switches to November payments
- October payments still visible in payment history but not in November's financial report

---

## Quick Stats Dashboard

The dashboard cards also reflect verified payments:
```
Monthly Income: ₱46,750
  ↳ Includes verified Tithes & Offerings: ₱45,250
  ↳ Plus other income: ₱1,500
```

This gives admins an at-a-glance view of actual giving vs. total income.

---

## Future Enhancements

Potential improvements:
1. Historical month view (see previous months' verified payments)
2. Year-to-date calculation from all verified payments
3. Export verified payment report by date range
4. Comparison chart: Pledges vs. Actual Verified Payments
5. Auto-reminder for members with pending payments

---

## Technical Notes

- **Performance:** Calculation runs on every component render, but only scans localStorage keys starting with `gcbf_gifts_`
- **Data Integrity:** Uses strict date matching (year + month) to ensure accurate monthly breakdowns
- **Read-Only:** Tithes & Offerings cannot be manually edited; only reflects verified payments
- **Timezone:** Uses local browser timezone for date calculations

---

## Summary

The integration ensures that **what members give and what gets verified is exactly what shows in the financial reports**. No manual reconciliation needed - the system does it automatically!
