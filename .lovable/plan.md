
# Monthly Summary Layout

## Overview
Create a new "Monthly Summary" section that displays income, expenses (including fixed expenses), and savings aggregated by month. This will give you a clear month-by-month view of your financial health.

## Location in UI
The monthly summary will appear as a collapsible section between the current totals bar and the CombinedChart, making it easy to access while keeping the interface clean.

## Layout Design

```text
┌────────────────────────────────────────────────────────────────────┐
│  📊 Monthly Summary                              [▼ Expand/Collapse]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─── January 2026 ────────────────────────────────────────────┐  │
│  │  💰 Income        📤 Expenses      💵 Fixed       🏦 Savings │  │
│  │  +NT$85,000       -NT$32,450       -NT$5,824      NT$120,000 │  │
│  │  (violet)         (blue)           (orange)       (green)    │  │
│  │──────────────────────────────────────────────────────────────│  │
│  │  Net: +NT$46,726                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─── December 2025 ───────────────────────────────────────────┐  │
│  │  💰 Income        📤 Expenses      💵 Fixed       🏦 Savings │  │
│  │  +NT$80,000       -NT$28,900       -NT$5,824      NT$115,000 │  │
│  │──────────────────────────────────────────────────────────────│  │
│  │  Net: +NT$45,276                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ... (more months, scrollable)                                     │
└────────────────────────────────────────────────────────────────────┘
```

## Features

1. **Month-by-month breakdown** showing:
   - Total income for the month (violet color)
   - Total one-time expenses for the month (blue color)
   - Fixed expenses monthly equivalent (orange color)
   - Latest savings balance for that month (green color)
   - Net cash flow calculation (income - expenses - fixed)

2. **Collapsible design** - The section can be expanded/collapsed to save space

3. **Sorted by most recent** - Current month appears first

4. **Color-coded** to match the existing chart color scheme

5. **Currency conversion** - All values displayed in the user's selected currency

## Technical Implementation

### New Component: `MonthlySummary.tsx`
A dedicated component that:
- Groups expenses and incomes by month (using YYYY-MM format)
- Calculates monthly totals for each category
- Displays the latest savings entry per month as the "balance"
- Computes net cash flow per month
- Uses Collapsible from Radix UI for expand/collapse

### Data Aggregation Logic
- **Income**: Sum all income entries per month
- **One-time Expenses**: Sum all expense entries per month
- **Fixed Expenses**: Use the current active fixed expenses and their monthly equivalents (same value shown for all months since these are recurring)
- **Savings**: Take the last savings entry of each month as the month-end balance

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/MonthlySummary.tsx` | Create | New component for monthly aggregation display |
| `src/components/ExpenseTracker.tsx` | Modify | Add MonthlySummary between totals and chart |

### Props for MonthlySummary
```typescript
interface MonthlySummaryProps {
  expenses: Expense[];
  incomes: Income[];
  savings: Saving[];
  fixedExpenses: FixedExpense[];
}
```
