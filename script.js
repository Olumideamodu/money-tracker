/**
 * Money Tracker - Personal Finance & Expense Tracker (Nigerian Naira ₦)
 * Vanilla JavaScript Implementation
 */

(function () {
  'use strict';

  // ==========================================
  // 1. Constants & Configuration
  // ==========================================
  const STORAGE_KEY = 'money_tracker_transactions_v1';

  const CATEGORIES = {
    income: [
      'Salary',
      'Freelance',
      'Business',
      'Photography',
      'Gifts',
      'Other income'
    ],
    expense: [
      'Food',
      'Transportation',
      'Rent',
      'Bills and Utilities',
      'Shopping',
      'Health',
      'Entertainment',
      'Savings',
      'Giving',
      'Subscriptions',
      'Other expenses'
    ]
  };

  // Sample data to test dashboard quickly
  const SAMPLE_TRANSACTIONS = [
    {
      id: 'tx_sample_1',
      title: 'Monthly Tech Salary',
      amount: 650000,
      type: 'income',
      category: 'Salary',
      date: getRelativeDate(2),
      notes: 'Direct salary deposit for the month',
      createdAt: Date.now() - 200000000
    },
    {
      id: 'tx_sample_2',
      title: 'Apartment Rent Contribution',
      amount: 180000,
      type: 'expense',
      category: 'Rent',
      date: getRelativeDate(3),
      notes: 'Monthly apartment rent share',
      createdAt: Date.now() - 180000000
    },
    {
      id: 'tx_sample_3',
      title: 'Website Design Client',
      amount: 150000,
      type: 'income',
      category: 'Freelance',
      date: getRelativeDate(5),
      notes: 'Fintech landing page redesign milestone',
      createdAt: Date.now() - 150000000
    },
    {
      id: 'tx_sample_4',
      title: 'Groceries at Shoprite',
      amount: 45000,
      type: 'expense',
      category: 'Food',
      date: getRelativeDate(6),
      notes: 'Monthly household provisions and fresh produce',
      createdAt: Date.now() - 120000000
    },
    {
      id: 'tx_sample_5',
      title: 'Fuel & Car Maintenance',
      amount: 32000,
      type: 'expense',
      category: 'Transportation',
      date: getRelativeDate(8),
      notes: 'Full tank fuel and oil top-up',
      createdAt: Date.now() - 90000000
    },
    {
      id: 'tx_sample_6',
      title: 'PHCN Electricity & Internet Bills',
      amount: 28500,
      type: 'expense',
      category: 'Bills and Utilities',
      date: getRelativeDate(10),
      notes: 'Prepaid meter token and Fibre WiFi',
      createdAt: Date.now() - 70000000
    },
    {
      id: 'tx_sample_7',
      title: 'Family Birthday Gift',
      amount: 25000,
      type: 'income',
      category: 'Gifts',
      date: getRelativeDate(12),
      notes: 'Birthday monetary gift from family',
      createdAt: Date.now() - 50000000
    },
    {
      id: 'tx_sample_8',
      title: 'Streaming & Cloud Subscriptions',
      amount: 14200,
      type: 'expense',
      category: 'Subscriptions',
      date: getRelativeDate(14),
      notes: 'Netflix, Spotify & iCloud recurring charges',
      createdAt: Date.now() - 30000000
    }
  ];

  // ==========================================
  // 2. Application State
  // ==========================================
  let transactions = [];
  let itemToDeleteId = null;

  // Filter State
  const filters = {
    search: '',
    type: 'all', // 'all' | 'income' | 'expense'
    category: 'all',
    dateFrom: '',
    dateTo: ''
  };

  // Selected Month State (defaults to current YYYY-MM)
  let selectedMonth = getCurrentYearMonth();

  // ==========================================
  // 3. DOM Elements Cache
  // ==========================================
  const DOM = {
    // Dashboard metrics
    totalBalance: document.getElementById('total-balance'),
    totalIncome: document.getElementById('total-income'),
    totalExpenses: document.getElementById('total-expenses'),
    transactionCount: document.getElementById('transaction-count'),
    balanceStatusText: document.getElementById('balance-status-text'),
    incomeCountText: document.getElementById('income-count-text'),
    expenseCountText: document.getElementById('expense-count-text'),

    // Monthly overview
    monthPicker: document.getElementById('month-picker'),
    prevMonthBtn: document.getElementById('prev-month-btn'),
    nextMonthBtn: document.getElementById('next-month-btn'),
    currentMonthBtn: document.getElementById('current-month-btn'),
    monthlyIncome: document.getElementById('monthly-income'),
    monthlyExpenses: document.getElementById('monthly-expenses'),
    monthlyBalance: document.getElementById('monthly-balance'),
    monthlyIncomeRatio: document.getElementById('monthly-income-ratio'),
    monthlyExpenseRatio: document.getElementById('monthly-expense-ratio'),
    monthlySavingsStatus: document.getElementById('monthly-savings-status'),
    monthlyProgressFill: document.getElementById('monthly-progress-fill'),
    progressBarLabel: document.getElementById('progress-bar-label'),
    progressBarPercentage: document.getElementById('progress-bar-percentage'),
    categoryBarsList: document.getElementById('category-bars-list'),
    breakdownExpenseTotal: document.getElementById('breakdown-expense-total'),

    // Export & Shortcuts
    exportCsvBtn: document.getElementById('export-csv-btn'),
    dateTodayBtn: document.getElementById('date-today-btn'),
    dateYesterdayBtn: document.getElementById('date-yesterday-btn'),

    // Filter controls
    searchInput: document.getElementById('search-input'),
    typePills: document.querySelectorAll('.type-pill'),
    categoryFilter: document.getElementById('category-filter'),
    dateFromFilter: document.getElementById('date-from-filter'),
    dateToFilter: document.getElementById('date-to-filter'),
    resetFiltersBtn: document.getElementById('reset-filters-btn'),
    filterResultsCount: document.getElementById('filter-results-count'),

    // Transaction List & Empty States
    transactionsList: document.getElementById('transactions-list'),
    listCountBadge: document.getElementById('list-count-badge'),
    emptyState: document.getElementById('empty-state'),
    filterEmptyState: document.getElementById('filter-empty-state'),
    clearFiltersBtn: document.getElementById('clear-filters-btn'),
    loadSampleBtn: document.getElementById('load-sample-btn'),
    emptyAddBtn: document.getElementById('empty-add-btn'),

    // Add / Edit Transaction Modal
    openAddModalBtn: document.getElementById('open-add-modal-btn'),
    quickAddBtn: document.getElementById('quick-add-btn'),
    transactionModal: document.getElementById('transaction-modal'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    cancelModalBtn: document.getElementById('cancel-modal-btn'),
    transactionForm: document.getElementById('transaction-form'),
    modalTitle: document.getElementById('modal-title'),
    saveBtnText: document.getElementById('save-btn-text'),
    editTransactionId: document.getElementById('edit-transaction-id'),
    formTypeRadios: document.querySelectorAll('input[name="form-type"]'),
    formTitle: document.getElementById('form-title'),
    formAmount: document.getElementById('form-amount'),
    formDate: document.getElementById('form-date'),
    formCategory: document.getElementById('form-category'),
    formNotes: document.getElementById('form-notes'),

    // Form errors
    titleError: document.getElementById('title-error'),
    amountError: document.getElementById('amount-error'),
    dateError: document.getElementById('date-error'),
    categoryError: document.getElementById('category-error'),

    // Delete Modal
    deleteModal: document.getElementById('delete-modal'),
    deleteItemTitle: document.getElementById('delete-item-title'),
    deleteItemAmount: document.getElementById('delete-item-amount'),
    cancelDeleteBtn: document.getElementById('cancel-delete-btn'),
    confirmDeleteBtn: document.getElementById('confirm-delete-btn'),

    // Toast Container
    toastContainer: document.getElementById('toast-container')
  };

  // ==========================================
  // 4. Initialization
  // ==========================================
  function init() {
    loadTransactionsFromStorage();
    initMonthPicker();
    populateCategoryFilterDropdown();
    setupEventListeners();
    renderApp();
  }

  // ==========================================
  // 5. Data Storage & Persistence
  // ==========================================
  function loadTransactionsFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        transactions = JSON.parse(stored);
        if (!Array.isArray(transactions)) {
          transactions = [];
        }
      } else {
        transactions = [];
      }
    } catch (e) {
      console.error('Failed to parse localStorage data:', e);
      transactions = [];
    }
  }

  function saveTransactionsToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      showToast('Error saving data to browser storage', 'danger');
    }
  }

  // ==========================================
  // 6. Formatting Utilities
  // ==========================================
  /**
   * Formats a numeric value into Nigerian Naira currency representation.
   * e.g. formatNaira(1250000.5) => "₦1,250,000.50"
   */
  function formatNaira(amount, includeSign = false, type = null) {
    const num = Math.abs(Number(amount) || 0);
    const formatted = '₦' + num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    if (includeSign) {
      if (type === 'income') {
        return '+' + formatted;
      }
      if (type === 'expense') {
        return '-' + formatted;
      }
      return (Number(amount) < 0 ? '-' : '+') + formatted;
    }

    if (Number(amount) < 0) {
      return '-' + formatted;
    }

    return formatted;
  }

  /**
   * Formats an ISO date string (YYYY-MM-DD) into readable format: "08 Nov 2026"
   */
  function formatDateReadable(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    } catch (e) {
      // fallback
    }
    return dateStr;
  }

  /**
   * Returns current year-month string "YYYY-MM"
   */
  function getCurrentYearMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  /**
   * Returns today's ISO date string "YYYY-MM-DD"
   */
  function getTodayDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Helper to generate sample relative dates
   */
  function getRelativeDate(daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ==========================================
  // 7. Core Render Orchestrator
  // ==========================================
  function renderApp() {
    renderDashboardOverview();
    renderMonthlyOverview();
    renderTransactionsList();
  }

  // ==========================================
  // 8. Dashboard Overview Calculations
  // ==========================================
  function renderDashboardOverview() {
    let totalIncome = 0;
    let totalExpenses = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    transactions.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        totalIncome += amt;
        incomeCount++;
      } else if (tx.type === 'expense') {
        totalExpenses += amt;
        expenseCount++;
      }
    });

    const totalBalance = totalIncome - totalExpenses;
    const totalCount = transactions.length;

    // Update DOM values
    DOM.totalBalance.textContent = formatNaira(totalBalance);
    DOM.totalIncome.textContent = formatNaira(totalIncome);
    DOM.totalExpenses.textContent = formatNaira(totalExpenses);
    DOM.transactionCount.textContent = totalCount.toLocaleString();

    // Style balance if negative
    if (totalBalance < 0) {
      DOM.totalBalance.style.color = 'var(--expense-main)';
      DOM.balanceStatusText.textContent = 'Deficit: expenses exceed income';
    } else {
      DOM.totalBalance.style.color = 'var(--text-main)';
      DOM.balanceStatusText.textContent = totalBalance === 0 ? 'Net balance is zero' : 'Net savings available';
    }

    DOM.incomeCountText.textContent = `${incomeCount} incoming ${incomeCount === 1 ? 'record' : 'records'}`;
    DOM.expenseCountText.textContent = `${expenseCount} expense ${expenseCount === 1 ? 'record' : 'records'}`;
  }

  // ==========================================
  // 9. Monthly Overview Calculations
  // ==========================================
  function initMonthPicker() {
    DOM.monthPicker.value = selectedMonth;
  }

  function renderMonthlyOverview() {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr, 10);
    const monthIndex = parseInt(monthStr, 10) - 1;
    const monthDate = new Date(year, monthIndex, 1);
    const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    let monthIncome = 0;
    let monthExpenses = 0;
    let monthTxCount = 0;

    transactions.forEach(tx => {
      if (tx.date && tx.date.startsWith(selectedMonth)) {
        const amt = Number(tx.amount) || 0;
        if (tx.type === 'income') {
          monthIncome += amt;
        } else if (tx.type === 'expense') {
          monthExpenses += amt;
        }
        monthTxCount++;
      }
    });

    const monthBalance = monthIncome - monthExpenses;

    DOM.monthlyIncome.textContent = formatNaira(monthIncome);
    DOM.monthlyExpenses.textContent = formatNaira(monthExpenses);
    DOM.monthlyBalance.textContent = formatNaira(monthBalance);

    if (monthBalance < 0) {
      DOM.monthlyBalance.style.color = 'var(--expense-main)';
      DOM.monthlySavingsStatus.textContent = 'Monthly deficit';
    } else {
      DOM.monthlyBalance.style.color = monthBalance > 0 ? 'var(--income-main)' : 'var(--text-main)';
      DOM.monthlySavingsStatus.textContent = monthBalance > 0 ? 'Positive net savings' : 'Balanced';
    }

    // Monthly ratios & progress bar
    if (monthIncome > 0) {
      const expensePercentage = Math.round((monthExpenses / monthIncome) * 100);
      DOM.monthlyExpenseRatio.textContent = `${expensePercentage}% of income spent`;
      DOM.monthlyIncomeRatio.textContent = `${monthTxCount} txs in ${monthName}`;

      DOM.progressBarLabel.textContent = `${monthName} Budget Utilization`;
      DOM.progressBarPercentage.textContent = `${expensePercentage}% spent`;

      const fillWidth = Math.min(expensePercentage, 100);
      DOM.monthlyProgressFill.style.width = `${fillWidth}%`;

      // Color coding for progress bar
      DOM.monthlyProgressFill.classList.remove('warning', 'danger');
      if (expensePercentage > 100) {
        DOM.monthlyProgressFill.classList.add('danger');
        DOM.progressBarPercentage.textContent = `${expensePercentage}% (over budget!)`;
      } else if (expensePercentage >= 80) {
        DOM.monthlyProgressFill.classList.add('warning');
      }
    } else if (monthExpenses > 0) {
      DOM.monthlyExpenseRatio.textContent = 'No income recorded this month';
      DOM.monthlyIncomeRatio.textContent = `${monthTxCount} txs in ${monthName}`;
      DOM.progressBarLabel.textContent = `${monthName} Budget Utilization`;
      DOM.progressBarPercentage.textContent = '100% (expenses only)';
      DOM.monthlyProgressFill.style.width = '100%';
      DOM.monthlyProgressFill.classList.add('danger');
    } else {
      DOM.monthlyExpenseRatio.textContent = 'No expenses this month';
      DOM.monthlyIncomeRatio.textContent = `0 transactions in ${monthName}`;
      DOM.progressBarLabel.textContent = `${monthName} Budget Utilization`;
      DOM.progressBarPercentage.textContent = '0% spent';
      DOM.monthlyProgressFill.style.width = '0%';
      DOM.monthlyProgressFill.classList.remove('warning', 'danger');
    }

    // Render category breakdown for this month
    renderMonthlyCategoryBreakdown(selectedMonth, monthExpenses);
  }

  function renderMonthlyCategoryBreakdown(month, totalMonthExpenses) {
    if (!DOM.categoryBarsList) return;

    const categoryMap = {};
    transactions.forEach(tx => {
      if (tx.type === 'expense' && tx.date && tx.date.startsWith(month)) {
        const cat = tx.category || 'Other expenses';
        categoryMap[cat] = (categoryMap[cat] || 0) + (Number(tx.amount) || 0);
      }
    });

    const entries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

    if (DOM.breakdownExpenseTotal) {
      DOM.breakdownExpenseTotal.textContent = `Total: ${formatNaira(totalMonthExpenses)}`;
    }

    if (entries.length === 0) {
      DOM.categoryBarsList.innerHTML = '<p class="empty-breakdown-note">No expenses recorded for this month.</p>';
      return;
    }

    DOM.categoryBarsList.innerHTML = entries.map(([cat, amt]) => {
      const pct = totalMonthExpenses > 0 ? Math.round((amt / totalMonthExpenses) * 100) : 0;
      return `
        <div class="cat-bar-item">
          <div class="cat-bar-header">
            <span class="cat-bar-name">${escapeHtml(cat)}</span>
            <span class="cat-bar-amount">${formatNaira(amt)} (${pct}%)</span>
          </div>
          <div class="cat-bar-track">
            <div class="cat-bar-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function changeSelectedMonth(offset) {
    const [yearStr, monthStr] = selectedMonth.split('-');
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10) + offset;

    if (month > 12) {
      month = 1;
      year++;
    } else if (month < 1) {
      month = 12;
      year--;
    }

    selectedMonth = `${year}-${String(month).padStart(2, '0')}`;
    DOM.monthPicker.value = selectedMonth;
    renderMonthlyOverview();
  }

  // ==========================================
  // 10. Category Filter Dropdown Setup
  // ==========================================
  function populateCategoryFilterDropdown() {
    // Collect all unique categories from config
    const allCategories = [
      ...new Set([...CATEGORIES.income, ...CATEGORIES.expense])
    ].sort();

    DOM.categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    allCategories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      DOM.categoryFilter.appendChild(option);
    });
  }

  // ==========================================
  // 11. Transaction List Rendering & Filtering
  // ==========================================
  function getFilteredTransactions() {
    return transactions.filter(tx => {
      // 1. Search Query filter (title or notes)
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const titleMatch = (tx.title || '').toLowerCase().includes(query);
        const notesMatch = (tx.notes || '').toLowerCase().includes(query);
        const categoryMatch = (tx.category || '').toLowerCase().includes(query);
        if (!titleMatch && !notesMatch && !categoryMatch) {
          return false;
        }
      }

      // 2. Type Filter (all, income, expense)
      if (filters.type !== 'all' && tx.type !== filters.type) {
        return false;
      }

      // 3. Category Filter
      if (filters.category !== 'all' && tx.category !== filters.category) {
        return false;
      }

      // 4. Date Range Filter
      if (filters.dateFrom && tx.date < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && tx.date > filters.dateTo) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort most recent date first
      if (b.date !== a.date) {
        return b.date.localeCompare(a.date);
      }
      // If dates are identical, use createdAt timestamp descending
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }

  function renderTransactionsList() {
    const totalCount = transactions.length;
    const filtered = getFilteredTransactions();

    DOM.listCountBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'record' : 'records'}`;

    // Update filter status bar text
    const isFiltered = filters.search || filters.type !== 'all' || filters.category !== 'all' || filters.dateFrom || filters.dateTo;
    if (isFiltered) {
      DOM.filterResultsCount.textContent = `Showing ${filtered.length} of ${totalCount} transactions matching filters`;
    } else {
      DOM.filterResultsCount.textContent = `Showing all ${totalCount} recorded transactions`;
    }

    // Handle Empty States
    if (totalCount === 0) {
      DOM.transactionsList.innerHTML = '';
      DOM.transactionsList.classList.add('hidden');
      DOM.filterEmptyState.classList.add('hidden');
      DOM.emptyState.classList.remove('hidden');
      return;
    }

    if (filtered.length === 0) {
      DOM.transactionsList.innerHTML = '';
      DOM.transactionsList.classList.add('hidden');
      DOM.emptyState.classList.add('hidden');
      DOM.filterEmptyState.classList.remove('hidden');
      return;
    }

    // Normal State with items
    DOM.emptyState.classList.add('hidden');
    DOM.filterEmptyState.classList.add('hidden');
    DOM.transactionsList.classList.remove('hidden');

    // Build transaction elements
    const fragment = document.createDocumentFragment();

    filtered.forEach(tx => {
      const itemEl = createTransactionElement(tx);
      fragment.appendChild(itemEl);
    });

    DOM.transactionsList.innerHTML = '';
    DOM.transactionsList.appendChild(fragment);
  }

  function createTransactionElement(tx) {
    const isIncome = tx.type === 'income';
    const row = document.createElement('div');
    row.className = 'tx-item';
    row.dataset.id = tx.id;

    // SVG icon for transaction type
    const iconSvg = isIncome
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
           <line x1="12" y1="19" x2="12" y2="5" />
           <polyline points="5 12 12 5 19 12" />
         </svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
           <line x1="12" y1="5" x2="12" y2="19" />
           <polyline points="19 12 12 19 5 12" />
         </svg>`;

    const formattedAmount = formatNaira(tx.amount, true, tx.type);
    const readableDate = formatDateReadable(tx.date);
    const notesHtml = tx.notes ? `<span class="tx-notes" title="${escapeHtml(tx.notes)}">&bull; ${escapeHtml(tx.notes)}</span>` : '';

    row.innerHTML = `
      <div class="tx-main-info">
        <div class="tx-type-icon ${isIncome ? 'income' : 'expense'}" aria-label="${isIncome ? 'Income' : 'Expense'}">
          ${iconSvg}
        </div>
        <div class="tx-details">
          <div class="tx-title-row">
            <span class="tx-title" title="${escapeHtml(tx.title)}">${escapeHtml(tx.title)}</span>
            <span class="tx-category-badge">${escapeHtml(tx.category)}</span>
          </div>
          <div class="tx-meta">
            <span class="tx-date">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              ${readableDate}
            </span>
            ${notesHtml}
          </div>
        </div>
      </div>
      <div class="tx-amount-actions">
        <div class="tx-amount ${isIncome ? 'income' : 'expense'}">
          ${formattedAmount}
        </div>
        <div class="tx-actions">
          <button type="button" class="icon-btn icon-btn-edit edit-btn" title="Edit Transaction" aria-label="Edit transaction ${escapeHtml(tx.title)}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button type="button" class="icon-btn icon-btn-danger delete-btn" title="Delete Transaction" aria-label="Delete transaction ${escapeHtml(tx.title)}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    `;

    // Attach row events
    const editBtn = row.querySelector('.edit-btn');
    const deleteBtn = row.querySelector('.delete-btn');

    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditModal(tx.id);
    });

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDeleteConfirmation(tx.id);
    });

    return row;
  }

  // ==========================================
  // 12. Modal Management (Add & Edit)
  // ==========================================
  function updateModalCategoryOptions(selectedCategory = null) {
    const selectedType = document.querySelector('input[name="form-type"]:checked').value;
    const catList = CATEGORIES[selectedType] || [];

    DOM.formCategory.innerHTML = '';
    catList.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      DOM.formCategory.appendChild(option);
    });

    if (selectedCategory && catList.includes(selectedCategory)) {
      DOM.formCategory.value = selectedCategory;
    } else if (catList.length > 0) {
      DOM.formCategory.value = catList[0];
    }
  }

  function clearFormErrors() {
    DOM.titleError.textContent = '';
    DOM.amountError.textContent = '';
    DOM.dateError.textContent = '';
    DOM.categoryError.textContent = '';

    DOM.formTitle.classList.remove('input-error');
    DOM.formAmount.classList.remove('input-error');
    DOM.formDate.classList.remove('input-error');
    DOM.formCategory.classList.remove('input-error');
  }

  function openAddModal() {
    clearFormErrors();
    DOM.editTransactionId.value = '';
    DOM.modalTitle.textContent = 'Add Transaction';
    DOM.saveBtnText.textContent = 'Save Transaction';

    // Reset fields
    DOM.formTitle.value = '';
    DOM.formAmount.value = '';
    DOM.formNotes.value = '';
    DOM.formDate.value = getTodayDateString();

    // Default to income
    const incomeRadio = document.getElementById('type-income');
    incomeRadio.checked = true;
    updateModalCategoryOptions();

    DOM.transactionModal.classList.remove('hidden');
    DOM.transactionModal.setAttribute('aria-hidden', 'false');
    DOM.formTitle.focus();
  }

  function openEditModal(id) {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    clearFormErrors();
    DOM.editTransactionId.value = tx.id;
    DOM.modalTitle.textContent = 'Edit Transaction';
    DOM.saveBtnText.textContent = 'Update Transaction';

    DOM.formTitle.value = tx.title || '';
    DOM.formAmount.value = tx.amount;
    DOM.formDate.value = tx.date || getTodayDateString();
    DOM.formNotes.value = tx.notes || '';

    // Set type radio
    const radio = document.querySelector(`input[name="form-type"][value="${tx.type}"]`);
    if (radio) {
      radio.checked = true;
    }
    updateModalCategoryOptions(tx.category);

    DOM.transactionModal.classList.remove('hidden');
    DOM.transactionModal.setAttribute('aria-hidden', 'false');
    DOM.formTitle.focus();
  }

  function closeModal() {
    DOM.transactionModal.classList.add('hidden');
    DOM.transactionModal.setAttribute('aria-hidden', 'true');
    DOM.transactionForm.reset();
    clearFormErrors();
  }

  // ==========================================
  // 13. Form Submission & Validation
  // ==========================================
  function handleFormSubmit(e) {
    e.preventDefault();
    clearFormErrors();

    const title = DOM.formTitle.value.trim();
    const amountVal = DOM.formAmount.value.trim();
    const amount = parseFloat(amountVal);
    const date = DOM.formDate.value;
    const type = document.querySelector('input[name="form-type"]:checked').value;
    const category = DOM.formCategory.value;
    const notes = DOM.formNotes.value.trim();
    const editId = DOM.editTransactionId.value;

    let isValid = true;

    // Validate Title
    if (!title) {
      DOM.titleError.textContent = 'Title or description is required';
      DOM.formTitle.classList.add('input-error');
      isValid = false;
    }

    // Validate Amount
    if (!amountVal || isNaN(amount) || amount <= 0) {
      DOM.amountError.textContent = 'Amount must be greater than ₦0.00';
      DOM.formAmount.classList.add('input-error');
      isValid = false;
    }

    // Validate Date
    if (!date) {
      DOM.dateError.textContent = 'Transaction date is required';
      DOM.formDate.classList.add('input-error');
      isValid = false;
    }

    // Validate Category
    if (!category) {
      DOM.categoryError.textContent = 'Category is required';
      DOM.formCategory.classList.add('input-error');
      isValid = false;
    }

    if (!isValid) return;

    if (editId) {
      // Edit existing transaction
      const index = transactions.findIndex(t => t.id === editId);
      if (index !== -1) {
        transactions[index] = {
          ...transactions[index],
          title,
          amount,
          type,
          category,
          date,
          notes
        };
        saveTransactionsToStorage();
        renderApp();
        closeModal();
        showToast('Transaction updated successfully', 'success');
      }
    } else {
      // Add new transaction
      const newTx = {
        id: 'tx_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
        title,
        amount,
        type,
        category,
        date,
        notes,
        createdAt: Date.now()
      };

      transactions.unshift(newTx);
      saveTransactionsToStorage();
      renderApp();
      closeModal();
      showToast('Transaction recorded successfully', 'success');
    }
  }

  // ==========================================
  // 14. Delete Confirmation Handling
  // ==========================================
  function openDeleteConfirmation(id) {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    itemToDeleteId = id;
    DOM.deleteItemTitle.textContent = `"${tx.title}"`;
    DOM.deleteItemAmount.textContent = formatNaira(tx.amount);

    DOM.deleteModal.classList.remove('hidden');
    DOM.deleteModal.setAttribute('aria-hidden', 'false');
    DOM.confirmDeleteBtn.focus();
  }

  function closeDeleteConfirmation() {
    itemToDeleteId = null;
    DOM.deleteModal.classList.add('hidden');
    DOM.deleteModal.setAttribute('aria-hidden', 'true');
  }

  function confirmDelete() {
    if (!itemToDeleteId) return;

    const tx = transactions.find(t => t.id === itemToDeleteId);
    const title = tx ? tx.title : 'Transaction';

    transactions = transactions.filter(t => t.id !== itemToDeleteId);
    saveTransactionsToStorage();
    renderApp();
    closeDeleteConfirmation();
    showToast(`Deleted "${title}"`, 'danger');
  }

  // ==========================================
  // 15. Search & Filters Handling
  // ==========================================
  function handleSearchInput(e) {
    filters.search = e.target.value;
    renderTransactionsList();
  }

  function handleTypeFilterChange(type) {
    filters.type = type;

    DOM.typePills.forEach(pill => {
      if (pill.dataset.type === type) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    renderTransactionsList();
  }

  function handleCategoryFilterChange(e) {
    filters.category = e.target.value;
    renderTransactionsList();
  }

  function handleDateFilterChange() {
    filters.dateFrom = DOM.dateFromFilter.value;
    filters.dateTo = DOM.dateToFilter.value;
    renderTransactionsList();
  }

  function resetFilters() {
    filters.search = '';
    filters.type = 'all';
    filters.category = 'all';
    filters.dateFrom = '';
    filters.dateTo = '';

    DOM.searchInput.value = '';
    DOM.categoryFilter.value = 'all';
    DOM.dateFromFilter.value = '';
    DOM.dateToFilter.value = '';

    DOM.typePills.forEach(pill => {
      if (pill.dataset.type === 'all') {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    renderTransactionsList();
  }

  // ==========================================
  // 16. Sample Data Seeding
  // ==========================================
  function loadSampleData() {
    transactions = [...SAMPLE_TRANSACTIONS];
    saveTransactionsToStorage();
    renderApp();
    showToast('Loaded sample transactions', 'success');
  }

  // ==========================================
  // 17. CSV Export
  // ==========================================
  function exportTransactionsToCSV() {
    if (transactions.length === 0) {
      showToast('No transactions to export', 'info');
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Category', 'Title', 'Amount (NGN)', 'Notes'];
    const rows = transactions.map(tx => [
      `"${(tx.id || '').replace(/"/g, '""')}"`,
      `"${(tx.date || '').replace(/"/g, '""')}"`,
      `"${(tx.type || '').replace(/"/g, '""')}"`,
      `"${(tx.category || '').replace(/"/g, '""')}"`,
      `"${(tx.title || '').replace(/"/g, '""')}"`,
      Number(tx.amount || 0).toFixed(2),
      `"${(tx.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `money_tracker_export_${getTodayDateString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Exported transactions to CSV', 'success');
  }

  // ==========================================
  // 18. Toast Notifications
  // ==========================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                   <polyline points="20 6 9 17 4 12" />
                 </svg>`;
    } else if (type === 'danger') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                   <circle cx="12" cy="12" r="10" />
                   <line x1="15" y1="9" x2="9" y2="15" />
                   <line x1="9" y1="9" x2="15" y2="15" />
                 </svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                   <circle cx="12" cy="12" r="10" />
                   <line x1="12" y1="16" x2="12" y2="12" />
                   <line x1="12" y1="8" x2="12.01" y2="8" />
                 </svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3200);
  }

  // ==========================================
  // 18. Helper Utilities
  // ==========================================
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ==========================================
  // 19. Event Listeners Setup
  // ==========================================
  function setupEventListeners() {
    // Add transaction triggers
    DOM.openAddModalBtn.addEventListener('click', openAddModal);
    DOM.quickAddBtn.addEventListener('click', openAddModal);
    DOM.emptyAddBtn.addEventListener('click', openAddModal);

    // Modal close triggers
    DOM.closeModalBtn.addEventListener('click', closeModal);
    DOM.cancelModalBtn.addEventListener('click', closeModal);

    // Click outside modal dialog to close
    DOM.transactionModal.addEventListener('click', (e) => {
      if (e.target === DOM.transactionModal) {
        closeModal();
      }
    });

    // Type change in modal form switches categories
    DOM.formTypeRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        updateModalCategoryOptions();
      });
    });

    // Form submit
    DOM.transactionForm.addEventListener('submit', handleFormSubmit);

    // Delete modal buttons
    DOM.cancelDeleteBtn.addEventListener('click', closeDeleteConfirmation);
    DOM.confirmDeleteBtn.addEventListener('click', confirmDelete);

    DOM.deleteModal.addEventListener('click', (e) => {
      if (e.target === DOM.deleteModal) {
        closeDeleteConfirmation();
      }
    });

    // Filter controls
    DOM.searchInput.addEventListener('input', handleSearchInput);

    DOM.typePills.forEach(pill => {
      pill.addEventListener('click', () => {
        handleTypeFilterChange(pill.dataset.type);
      });
    });

    DOM.categoryFilter.addEventListener('change', handleCategoryFilterChange);
    DOM.dateFromFilter.addEventListener('change', handleDateFilterChange);
    DOM.dateToFilter.addEventListener('change', handleDateFilterChange);
    DOM.resetFiltersBtn.addEventListener('click', resetFilters);
    DOM.clearFiltersBtn.addEventListener('click', resetFilters);

    // Sample data loader
    DOM.loadSampleBtn.addEventListener('click', loadSampleData);

    // Export CSV
    if (DOM.exportCsvBtn) {
      DOM.exportCsvBtn.addEventListener('click', exportTransactionsToCSV);
    }

    // Modal date shortcuts
    if (DOM.dateTodayBtn) {
      DOM.dateTodayBtn.addEventListener('click', () => {
        DOM.formDate.value = getTodayDateString();
      });
    }

    if (DOM.dateYesterdayBtn) {
      DOM.dateYesterdayBtn.addEventListener('click', () => {
        DOM.formDate.value = getRelativeDate(1);
      });
    }

    // Monthly selector controls
    DOM.monthPicker.addEventListener('change', (e) => {
      if (e.target.value) {
        selectedMonth = e.target.value;
        renderMonthlyOverview();
      }
    });

    DOM.prevMonthBtn.addEventListener('click', () => changeSelectedMonth(-1));
    DOM.nextMonthBtn.addEventListener('click', () => changeSelectedMonth(1));
    DOM.currentMonthBtn.addEventListener('click', () => {
      selectedMonth = getCurrentYearMonth();
      DOM.monthPicker.value = selectedMonth;
      renderMonthlyOverview();
    });

    // Keyboard shortcuts (Escape key closes modals)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!DOM.transactionModal.classList.contains('hidden')) {
          closeModal();
        } else if (!DOM.deleteModal.classList.contains('hidden')) {
          closeDeleteConfirmation();
        }
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

