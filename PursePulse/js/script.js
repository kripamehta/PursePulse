/* ==========================================================================
   PursePulse - Dashboard Engine
   ========================================================================== */

/* ==========================================================================
   1. CONSTANTS & INITIAL DATA
   ========================================================================== */
const KEYS = {
  TRANSACTIONS: 'pursePulseTransactions',
  GOALS: 'pursePulseGoals',
  ACCOUNTS: 'pursePulseAccounts',
  BILLS: 'pursePulseBills',
  THEME: 'pursePulseTheme'
};

const SAMPLE_TRANSACTIONS = [
  { id: '1', type: 'expense', amount: 500, category: 'food', date: '2026-09-14', description: 'Lunch' },
  { id: '2', type: 'expense', amount: 250, category: 'transport', date: '2026-09-14', description: 'Uber' },
  { id: '3', type: 'income', amount: 65000, category: 'salary', date: '2026-09-01', description: 'September Salary' },
  { id: '4', type: 'expense', amount: 1200, category: 'shopping', date: '2026-08-28', description: 'T-shirt' },
  { id: '5', type: 'expense', amount: 2100, category: 'utilities', date: '2026-08-25', description: 'Electricity Bill' }
];

const SAMPLE_GOALS = [
  { id: 'g1', title: 'Emergency Fund', currentAmount: 75000, targetAmount: 100000 },
  { id: 'g2', title: 'Vacation Savings', currentAmount: 15000, targetAmount: 30000 }
];

const SAMPLE_ACCOUNTS = [
  { id: 'a1', name: 'HDFC Bank Savings', type: 'Checking', balance: 24150 },
  { id: 'a2', name: 'Credit Card', type: 'Rewards Visa', balance: -4200 },
  { id: 'a3', name: 'Investment Account', type: 'Stocks & Mutual Funds', balance: 12500 }
];

const SAMPLE_BILLS = [
  { id: 'b1', name: 'Netflix Subscription', dueDate: '2026-09-20', amount: 649 },
  { id: 'b2', name: 'WiFi Broadband', dueDate: '2026-09-24', amount: 999 }
];

const CATEGORY_NAMES = {
  food: 'Food',
  transport: 'Transport',
  shopping: 'Shopping',
  utilities: 'Utilities',
  entertainment: 'Entertainment',
  healthcare: 'Healthcare',
  housing: 'Housing',
  subscriptions: 'Subscriptions',
  education: 'Education',
  salary: 'Salary',
  freelance: 'Freelance',
  investments: 'Investments',
  'other-income': 'Other Income'
};

/* ==========================================================================
   2. APPLICATION STATE
   ========================================================================== */
let state = {
  transactions: [],
  goals: [],
  accounts: [],
  bills: [],
  theme: 'dark',
  activeSection: 'dashboard',
  transactionFilter: 'All',
  analyticsPeriod: 'This Month'
};

/* ==========================================================================
   3. DOM ELEMENTS SELECTION
   ========================================================================== */
const DOM = {
  appContainer: document.getElementById('app'),
  pageTitle: document.getElementById('current-page-title'),

  // Navigation Links & Sections
  navLinks: document.querySelectorAll('.sidebar-nav .nav-link'),
  appSections: document.querySelectorAll('.app-section'),

  // Financial Summary Cards
  totalBalance: document.getElementById('total-balance-display'),
  totalIncome: document.getElementById('total-income-display'),
  totalExpenses: document.getElementById('total-expenses-display'),
  progressBar: document.getElementById('app-progress'),
  budgetUsageText: document.getElementById('budget-usage-text'),

  // Charts
  dashboardChart: document.getElementById('dashboard-bar-chart'),
  analyticsChart: document.getElementById('analytics-bar-chart'),
  analyticsSummaryText: document.getElementById('analytics-total-summary'),
  timeFilterBtns: document.querySelectorAll('.time-filter .btn-time'),

  // Containers
  transactionsTableBody: document.getElementById('transactions-table-body'),
  filterGroupBtns: document.querySelectorAll('.filter-group .btn-filter'),
  goalsList: document.getElementById('goals-container-list'),
  accountsList: document.getElementById('accounts-container-list'),
  billsList: document.getElementById('bills-container-list'),
  quickTransferForm: document.getElementById('quick-transfer-form'),

  // Modals & Forms
  transactionModal: document.getElementById('add-transaction-modal'),
  openTransactionModalBtn: document.getElementById('open-transaction-modal-btn'),
  closeTransactionModalBtn: document.getElementById('close-transaction-modal-btn'),
  cancelTransactionModalBtn: document.getElementById('cancel-transaction-modal-btn'),
  transactionForm: document.getElementById('transaction-form'),

  goalModal: document.getElementById('add-goal-modal'),
  openGoalModalBtn: document.getElementById('open-goal-modal-btn'),
  closeGoalModalBtn: document.getElementById('close-goal-modal-btn'),
  cancelGoalModalBtn: document.getElementById('cancel-goal-modal-btn'),
  goalForm: document.getElementById('goal-form'),

  // Theme Switches
  themeDarkBtn: document.getElementById('theme-dark-btn'),
  themeLightBtn: document.getElementById('theme-light-btn')
};

/* ==========================================================================
   4. LOCALSTORAGE CONTROLLER
   ========================================================================== */
function loadStateFromStorage() {
  state.theme = localStorage.getItem(KEYS.THEME) || 'dark';

  // Load Transactions
  const storedTrans = localStorage.getItem(KEYS.TRANSACTIONS);
  if (storedTrans) {
    try { state.transactions = JSON.parse(storedTrans); }
    catch (e) { state.transactions = SAMPLE_TRANSACTIONS; }
  } else {
    state.transactions = SAMPLE_TRANSACTIONS;
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(SAMPLE_TRANSACTIONS));
  }

  // Load Goals
  const storedGoals = localStorage.getItem(KEYS.GOALS);
  if (storedGoals) {
    try { state.goals = JSON.parse(storedGoals); }
    catch (e) { state.goals = SAMPLE_GOALS; }
  } else {
    state.goals = SAMPLE_GOALS;
    localStorage.setItem(KEYS.GOALS, JSON.stringify(SAMPLE_GOALS));
  }

  // Load Accounts
  const storedAccounts = localStorage.getItem(KEYS.ACCOUNTS);
  if (storedAccounts) {
    try { state.accounts = JSON.parse(storedAccounts); }
    catch (e) { state.accounts = SAMPLE_ACCOUNTS; }
  } else {
    state.accounts = SAMPLE_ACCOUNTS;
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(SAMPLE_ACCOUNTS));
  }

  // Load Bills
  const storedBills = localStorage.getItem(KEYS.BILLS);
  if (storedBills) {
    try { state.bills = JSON.parse(storedBills); }
    catch (e) { state.bills = SAMPLE_BILLS; }
  } else {
    state.bills = SAMPLE_BILLS;
    localStorage.setItem(KEYS.BILLS, JSON.stringify(SAMPLE_BILLS));
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
}

/* ==========================================================================
   5. UTILITY & FORMATTING FUNCTIONS
   ========================================================================== */
function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

function formatDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateString;
}

/* ==========================================================================
   6. NAVIGATION CONTROLLER
   ========================================================================== */
function switchSection(targetSectionId) {
  state.activeSection = targetSectionId;

  // Update Navigation Highlight
  DOM.navLinks.forEach(link => {
    if (link.dataset.section === targetSectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Toggle Visibility of Sections
  DOM.appSections.forEach(section => {
    if (section.id === `section-${targetSectionId}`) {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });

  // Update Header Title
  const titleMap = {
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    analytics: 'Analytics',
    accounts: 'Connected Accounts',
    bills: 'Bills & Subscriptions',
    settings: 'Settings'
  };
  DOM.pageTitle.textContent = titleMap[targetSectionId] || 'Dashboard';
}

/* ==========================================================================
   7. FINANCIAL CALCULATIONS & SUMMARY CARDS
   ========================================================================== */
function updateSummaryCards() {
  const income = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expenses;

  DOM.totalBalance.textContent = formatCurrency(balance);
  DOM.totalIncome.textContent = formatCurrency(income);
  DOM.totalExpenses.textContent = formatCurrency(expenses);

  // Update Monthly Budget Progress Bar
  const budgetLimit = 40000;
  const usagePercentage = Math.min(Math.round((expenses / budgetLimit) * 100), 100);
  
  if (DOM.progressBar) {
    DOM.progressBar.value = expenses;
    DOM.progressBar.max = budgetLimit;
  }
  if (DOM.budgetUsageText) {
    DOM.budgetUsageText.textContent = `${usagePercentage}% used`;
  }
}

/* ==========================================================================
   8. TRANSACTIONS CONTROLLER
   ========================================================================== */
function renderTransactionsTable() {
  const filtered = state.transactions.filter(t => {
    if (state.transactionFilter === 'Income') return t.type === 'income';
    if (state.transactionFilter === 'Expense') return t.type === 'expense';
    return true;
  });

  DOM.transactionsTableBody.innerHTML = '';

  if (filtered.length === 0) {
    DOM.transactionsTableBody.innerHTML = `
      <tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">
        No transactions recorded yet.
      </td></tr>
    `;
    return;
  }

  filtered.forEach(t => {
    const row = document.createElement('tr');
    const isIncome = t.type === 'income';
    const amountPrefix = isIncome ? '+' : '-';
    const amountClass = isIncome ? 'amount-income' : 'amount-expense';
    const categoryKey = t.category || 'other';

    row.innerHTML = `
      <td><span class="category-tag ${categoryKey}">${CATEGORY_NAMES[categoryKey] || categoryKey}</span></td>
      <td>${t.description || 'No description'}</td>
      <td><time datetime="${t.date}">${formatDate(t.date)}</time></td>
      <td class="${amountClass}">${amountPrefix}${formatCurrency(t.amount)}</td>
    `;
    DOM.transactionsTableBody.appendChild(row);
  });
}

function handleAddTransaction(e) {
  e.preventDefault();

  const type = document.getElementById('transaction-type').value;
  const amount = parseFloat(document.getElementById('transaction-amount').value);
  const category = document.getElementById('transaction-category').value;
  const date = document.getElementById('transaction-date').value;
  const description = document.getElementById('transaction-description').value.trim() || 'No description';

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount greater than 0.');
    return;
  }

  const newTransaction = {
    id: Date.now().toString(),
    type,
    amount,
    category,
    date,
    description
  };

  state.transactions.unshift(newTransaction);
  saveToStorage(KEYS.TRANSACTIONS, state.transactions);

  updateAllViews();
  DOM.transactionForm.reset();
  DOM.transactionModal.close();
}

/* ==========================================================================
   9. PURE CSS/HTML BAR CHART ENGINE
   ========================================================================== */
function renderSpendingChart(targetContainer, period) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const periodExpenses = state.transactions.filter(t => {
    if (t.type !== 'expense' || !t.date) return false;
    const transDate = new Date(t.date);
    const transYear = transDate.getFullYear();
    const transMonth = transDate.getMonth();

    if (period === 'This Month') {
      return transYear === currentYear && transMonth === currentMonth;
    } else {
      const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
      return transYear === lastMonthDate.getFullYear() && transMonth === lastMonthDate.getMonth();
    }
  });

  const categoryTotals = {};
  let maxSpend = 0;
  let totalPeriodSpend = 0;

  periodExpenses.forEach(t => {
    const cat = t.category || 'other';
    const amt = Number(t.amount);
    categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
    totalPeriodSpend += amt;
    if (categoryTotals[cat] > maxSpend) {
      maxSpend = categoryTotals[cat];
    }
  });

  const categories = Object.keys(categoryTotals);

  if (DOM.analyticsSummaryText && targetContainer === DOM.analyticsChart) {
    DOM.analyticsSummaryText.textContent = `Total Spent (${period}): ${formatCurrency(totalPeriodSpend)}`;
  }

  if (categories.length === 0) {
    targetContainer.innerHTML = `
      <p style="color: var(--text-muted); text-align: center;">No expenses recorded for ${period.toLowerCase()}</p>
    `;
    return;
  }

  let chartHTML = `<div style="display: flex; flex-direction: column; gap: 0.875rem; width: 100%;">`;
  
  categories.forEach(cat => {
    const amount = categoryTotals[cat];
    const percentage = maxSpend > 0 ? Math.round((amount / maxSpend) * 100) : 0;
    const catName = CATEGORY_NAMES[cat] || cat;

    chartHTML += `
      <div class="chart-bar-item">
        <div class="chart-bar-header">
          <span class="category-tag ${cat}">${catName}</span>
          <span style="font-weight: 600;">${formatCurrency(amount)}</span>
        </div>
        <div class="chart-bar-track">
          <div class="chart-bar-fill" style="width: ${percentage}%;"></div>
        </div>
      </div>
    `;
  });

  chartHTML += `</div>`;
  targetContainer.innerHTML = chartHTML;
}

/* ==========================================================================
   10. GOALS, ACCOUNTS & BILLS CONTROLLERS
   ========================================================================== */
function renderGoals() {
  DOM.goalsList.innerHTML = '';
  state.goals.forEach(goal => {
    const percent = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
    const item = document.createElement('li');
    item.className = 'goal-item';
    item.innerHTML = `
      <div class="goal-info">
        <span class="goal-title">${goal.title}</span>
        <span class="goal-amount">${formatCurrency(goal.currentAmount)} / ${formatCurrency(goal.targetAmount)} (${percent}%)</span>
      </div>
      <progress value="${goal.currentAmount}" max="${goal.targetAmount}" aria-label="${goal.title} ${percent}% complete"></progress>
    `;
    DOM.goalsList.appendChild(item);
  });
}

function handleAddGoal(e) {
  e.preventDefault();
  const title = document.getElementById('goal-title-input').value.trim();
  const targetAmount = parseFloat(document.getElementById('goal-target-input').value);
  const currentAmount = parseFloat(document.getElementById('goal-current-input').value);

  if (!title || isNaN(targetAmount) || targetAmount <= 0) {
    alert('Please provide a valid goal title and target amount.');
    return;
  }

  state.goals.push({
    id: Date.now().toString(),
    title,
    targetAmount,
    currentAmount: isNaN(currentAmount) ? 0 : currentAmount
  });

  saveToStorage(KEYS.GOALS, state.goals);
  renderGoals();
  DOM.goalForm.reset();
  DOM.goalModal.close();
}

function renderAccounts() {
  DOM.accountsList.innerHTML = '';
  state.accounts.forEach(acc => {
    const item = document.createElement('li');
    item.className = 'account-item';
    const isNegative = acc.balance < 0;
    item.innerHTML = `
      <div class="account-details">
        <span class="account-name">${acc.name}</span>
        <span class="account-type">${acc.type}</span>
      </div>
      <span class="account-balance ${isNegative ? 'negative' : ''}">${formatCurrency(acc.balance)}</span>
    `;
    DOM.accountsList.appendChild(item);
  });
}

function renderBills() {
  DOM.billsList.innerHTML = '';
  state.bills.forEach(bill => {
    const item = document.createElement('li');
    item.className = 'bill-item';
    item.innerHTML = `
      <div class="bill-info">
        <span class="bill-name">${bill.name}</span>
        <span class="bill-date">Due: ${formatDate(bill.dueDate)}</span>
      </div>
      <span class="bill-amount">${formatCurrency(bill.amount)}</span>
    `;
    DOM.billsList.appendChild(item);
  });
}

function handleQuickTransfer(e) {
  e.preventDefault();
  const recipient = document.getElementById('transfer-recipient').value.trim();
  const amount = parseFloat(document.getElementById('transfer-amount').value);

  if (!recipient || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid recipient and amount.');
    return;
  }

  const transferTx = {
    id: Date.now().toString(),
    type: 'expense',
    amount,
    category: 'other-income',
    date: new Date().toISOString().split('T')[0],
    description: `Transfer to ${recipient}`
  };

  state.transactions.unshift(transferTx);
  saveToStorage(KEYS.TRANSACTIONS, state.transactions);

  updateAllViews();
  DOM.quickTransferForm.reset();
  alert(`Successfully transferred ${formatCurrency(amount)} to ${recipient}!`);
}

/* ==========================================================================
   11. THEME CONTROLLER
   ========================================================================== */
function setTheme(themeMode) {
  state.theme = themeMode;
  saveToStorage(KEYS.THEME, themeMode);
  if (themeMode === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }
}

/* ==========================================================================
   12. MASTER RENDER ENGINE
   ========================================================================== */
function updateAllViews() {
  updateSummaryCards();
  renderTransactionsTable();
  renderSpendingChart(DOM.dashboardChart, state.analyticsPeriod);
  renderSpendingChart(DOM.analyticsChart, state.analyticsPeriod);
  renderGoals();
  renderAccounts();
  renderBills();
}

/* ==========================================================================
   13. INITIALIZATION & EVENT LISTENERS
   ========================================================================== */
function init() {
  loadStateFromStorage();
  setTheme(state.theme);

  // Navigation Click Handlers
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchSection(link.dataset.section);
    });
  });

  // Modal Triggers
  DOM.openTransactionModalBtn.addEventListener('click', () => {
    document.getElementById('transaction-date').value = new Date().toISOString().split('T')[0];
    DOM.transactionModal.showModal();
  });
  DOM.closeTransactionModalBtn.addEventListener('click', () => DOM.transactionModal.close());
  DOM.cancelTransactionModalBtn.addEventListener('click', () => DOM.transactionModal.close());
  DOM.transactionForm.addEventListener('submit', handleAddTransaction);

  DOM.openGoalModalBtn.addEventListener('click', () => DOM.goalModal.showModal());
  DOM.closeGoalModalBtn.addEventListener('click', () => DOM.goalModal.close());
  DOM.cancelGoalModalBtn.addEventListener('click', () => DOM.goalModal.close());
  DOM.goalForm.addEventListener('submit', handleAddGoal);

  // Filtering Controls
  DOM.filterGroupBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.filterGroupBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.transactionFilter = btn.dataset.filter;
      renderTransactionsTable();
    });
  });

  DOM.timeFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.timeFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.analyticsPeriod = btn.dataset.period;
      renderSpendingChart(DOM.dashboardChart, state.analyticsPeriod);
      renderSpendingChart(DOM.analyticsChart, state.analyticsPeriod);
    });
  });

  // Quick Transfer Form
  DOM.quickTransferForm.addEventListener('submit', handleQuickTransfer);

  // Settings Theme Switches
  DOM.themeDarkBtn.addEventListener('click', () => setTheme('dark'));
  DOM.themeLightBtn.addEventListener('click', () => setTheme('light'));

  // Load Dashboard directly
  switchSection('dashboard');
  updateAllViews();
}

document.addEventListener('DOMContentLoaded', () => {
  init();
  lucide.createIcons();
});