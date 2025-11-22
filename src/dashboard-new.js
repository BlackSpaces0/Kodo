// Professional Dashboard with Sidebar Navigation for Zenko Financial
import { auth, db } from './main.js';
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, getDocs, deleteDoc, doc, updateDoc, orderBy, where } from 'firebase/firestore';

// Global state
let currentPage = 'dashboard';
let currentUser = null;
let userCategories = [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let currentLanguage = localStorage.getItem('language') || 'es';
let tourStep = 0;

// Translations object for multi-language support
const translations = {
  es: {
    // Navigation
    dashboard: 'Dashboard',
    transactions: 'Transacciones',
    accounts: 'Cuentas',
    loans: 'Préstamos',
    budget: 'Presupuesto',
    education: 'Educación',
    reports: 'Reportes',
    profile: 'Mi Perfil',
    
    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Cerrar',
    edit: 'Editar',
    delete: 'Eliminar',
    add: 'Agregar',
    search: 'Buscar',
    filter: 'Filtrar',
    export: 'Exportar',
    import: 'Importar',
    
    // Dashboard
    welcomeBack: 'Bienvenido de nuevo',
    totalBalance: 'Balance Total',
    income: 'Ingresos',
    expenses: 'Gastos',
    thisMonth: 'Este mes',
    cashFlow: 'Flujo de Efectivo',
    expensesByCategory: 'Gastos por Categoría',
    recentTransactions: 'Transacciones Recientes',
    viewAll: 'Ver todas',
    noTransactions: 'No hay transacciones recientes',
    
    // Notifications
    notifications: 'Notificaciones',
    markAllRead: 'Marcar todas como leídas',
    noNotifications: 'No tienes notificaciones nuevas',
    notificationBudgetAlert: 'Presupuesto al',
    notificationBudgetMessage: 'está cerca del límite',
    
    // Settings
    settings: 'Configuración',
    darkMode: 'Modo oscuro',
    language: 'Idioma',
    currency: 'Moneda',
    emailNotifications: 'Notificaciones por correo'
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    accounts: 'Accounts',
    loans: 'Loans',
    budget: 'Budget',
    education: 'Education',
    reports: 'Reports',
    profile: 'My Profile',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    
    // Dashboard
    welcomeBack: 'Welcome back',
    totalBalance: 'Total Balance',
    income: 'Income',
    expenses: 'Expenses',
    thisMonth: 'This month',
    cashFlow: 'Cash Flow',
    expensesByCategory: 'Expenses by Category',
    recentTransactions: 'Recent Transactions',
    viewAll: 'View all',
    noTransactions: 'No recent transactions',
    
    // Notifications
    notifications: 'Notifications',
    markAllRead: 'Mark all as read',
    noNotifications: 'You have no new notifications',
    notificationBudgetAlert: 'Budget at',
    notificationBudgetMessage: 'is close to the limit',
    
    // Settings
    settings: 'Settings',
    darkMode: 'Dark mode',
    language: 'Language',
    currency: 'Currency',
    emailNotifications: 'Email notifications'
  }
};

// Translation helper function
function t(key) {
  return translations[currentLanguage]?.[key] || translations['es'][key] || key;
}

// Change language function
function changeLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  // Reload current page to apply translations
  navigateTo(currentPage);
  alert(`✅ ${lang === 'es' ? 'Idioma cambiado a Español' : 'Language changed to English'}`);
}

// Default categories
const DEFAULT_CATEGORIES = [
  { id: 'alimentacion', name: 'Alimentación', icon: '🍔', color: '#667eea', type: 'expense' },
  { id: 'transporte', name: 'Transporte', icon: '🚗', color: '#10b981', type: 'expense' },
  { id: 'vivienda', name: 'Vivienda', icon: '🏠', color: '#f59e0b', type: 'expense' },
  { id: 'entretenimiento', name: 'Entretenimiento', icon: '🎮', color: '#ef4444', type: 'expense' },
  { id: 'salud', name: 'Salud', icon: '⚕️', color: '#ec4899', type: 'expense' },
  { id: 'educacion', name: 'Educación', icon: '📚', color: '#8b5cf6', type: 'expense' },
  { id: 'servicios', name: 'Servicios', icon: '💡', color: '#06b6d4', type: 'expense' },
  { id: 'compras', name: 'Compras', icon: '🛍️', color: '#f472b6', type: 'expense' },
  { id: 'salario', name: 'Salario', icon: '💼', color: '#10b981', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#3b82f6', type: 'income' },
  { id: 'inversiones', name: 'Inversiones', icon: '📈', color: '#8b5cf6', type: 'income' },
  { id: 'otros', name: 'Otros', icon: '📌', color: '#6b7280', type: 'both' }
];

export async function renderDashboard(user) {
  currentUser = user;
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside id="sidebar" class="w-64 gradient-primary text-white flex-shrink-0 shadow-2xl">
        <div class="p-6">
          <!-- Logo -->
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-3xl">🦊</span>
            </div>
            <div>
              <h1 class="text-xl font-display font-bold">Zenko</h1>
              <p class="text-xs text-white/80">Financial</p>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="space-y-2">
            <a href="#dashboard" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20 transition-all" data-page="dashboard">
              <span class="text-xl">📊</span>
              <span class="font-medium">${t('dashboard')}</span>
            </a>
            <a href="#transactions" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20 transition-all" data-page="transactions">
              <span class="text-xl">💳</span>
              <span class="font-medium">${t('transactions')}</span>
            </a>
            <a href="#accounts" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20 transition-all" data-page="accounts">
              <span class="text-xl">🏦</span>
              <span class="font-medium">${t('accounts')}</span>
            </a>
            <a href="#loans" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20 transition-all" data-page="loans">
              <span class="text-xl">💰</span>
              <span class="font-medium">${t('loans')}</span>
            </a>
            <a href="#budget" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20 transition-all" data-page="budget">
              <span class="text-xl">🎯</span>
              <span class="font-medium">${t('budget')}</span>
            </a>
            <a href="#education" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20 transition-all" data-page="education">
              <span class="text-xl">📚</span>
              <span class="font-medium">${t('education')}</span>
            </a>
            <a href="#reports" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20 transition-all" data-page="reports">
              <span class="text-xl">📈</span>
              <span class="font-medium">${t('reports')}</span>
            </a>
            <a href="#profile" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20 transition-all" data-page="profile">
              <span class="text-xl">👤</span>
              <span class="font-medium">${t('profile')}</span>
            </a>
          </nav>
        </div>

        <!-- User Section -->
        <div class="absolute bottom-0 w-64 p-6 border-t border-white/20">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span class="text-xl">👤</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold truncate">${user.displayName || 'Usuario'}</p>
              <p class="text-xs text-white/70 truncate">${user.email}</p>
            </div>
          </div>
          <button id="logout-btn" class="w-full py-2 px-4 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-all">
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <!-- Header -->
        <header class="glass sticky top-0 z-10 shadow-md">
          <div class="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 id="page-title" class="text-2xl font-display font-bold text-gray-800">Dashboard</h2>
              <p class="text-sm text-gray-600">Bienvenido de nuevo, ${user.displayName || 'Usuario'}</p>
            </div>
            <div class="flex items-center gap-4">
              <button id="notifications-btn" class="p-2 hover:bg-gray-100 rounded-lg transition-all relative">
                <span class="text-2xl">🔔</span>
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button id="settings-btn" class="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <span class="text-2xl">⚙️</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <div id="page-content" class="p-8 pb-20">
          <!-- Dynamic content loaded here -->
        </div>

        <!-- Footer -->
        <footer class="bg-white border-t border-gray-200 px-8 py-4 mt-auto">
          <div class="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <span class="text-xl">🦊</span>
              <span>© 2025 <span class="font-semibold">Zenko Financial</span>. Todos los derechos reservados.</span>
            </div>
            <div class="flex gap-6">
              <button onclick="window.showTermsModal()" class="hover:text-primary font-semibold transition-colors">
                📜 Términos de Servicio
              </button>
              <button onclick="window.showPrivacyModal()" class="hover:text-primary font-semibold transition-colors">
                🔒 Política de Privacidad
              </button>
              <a href="https://github.com/BlackSpaces0/Kodo" target="_blank" class="hover:text-primary font-semibold transition-colors">
                💻 GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  `;

  // Event listeners
  document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
      await signOut(auth);
      console.log('✅ Sesión cerrada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  });

  // Notifications button
  document.getElementById('notifications-btn').addEventListener('click', () => {
    showNotificationsModal();
  });

  // Settings button
  document.getElementById('settings-btn').addEventListener('click', () => {
    showSettingsModal();
  });

  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.currentTarget.dataset.page;
      navigateTo(page);
    });
  });

  // Load initial page
  navigateTo('dashboard');
  
  // Apply dark mode if enabled
  applyDarkMode();
  
  // Load notifications
  await loadNotifications();
  
  // Check if user is new and show welcome modal
  checkAndShowWelcome();
  
  // Load user categories
  await loadUserCategories();
}

// ========== CATEGORIES MANAGEMENT ==========
async function loadUserCategories() {
  try {
    const categoriesRef = collection(db, 'users', currentUser.uid, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    if (snapshot.empty) {
      // No custom categories, use defaults
      userCategories = [...DEFAULT_CATEGORIES];
    } else {
      // Load custom categories and merge with defaults
      const customCategories = [];
      snapshot.forEach(doc => {
        customCategories.push({ id: doc.id, ...doc.data() });
      });
      
      // Merge: custom categories + defaults not overridden
      userCategories = [...customCategories];
      DEFAULT_CATEGORIES.forEach(defCat => {
        if (!customCategories.find(c => c.id === defCat.id)) {
          userCategories.push(defCat);
        }
      });
    }
  } catch (error) {
    console.error('Error loading categories:', error);
    userCategories = [...DEFAULT_CATEGORIES];
  }
}

async function saveCustomCategory(categoryData) {
  try {
    const categoriesRef = collection(db, 'users', currentUser.uid, 'categories');
    await addDoc(categoriesRef, {
      ...categoryData,
      createdAt: new Date(),
      custom: true
    });
    await loadUserCategories();
    return true;
  } catch (error) {
    console.error('Error saving category:', error);
    return false;
  }
}

async function deleteCustomCategory(categoryId) {
  try {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'categories', categoryId));
    await loadUserCategories();
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
}

function getCategoriesHTML(type = 'all') {
  const filtered = type === 'all' 
    ? userCategories 
    : userCategories.filter(c => c.type === type || c.type === 'both');
  
  return filtered.map(cat => 
    `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`
  ).join('');
}

function navigateTo(page) {
  currentPage = page;
  
  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.page === page) {
      item.classList.add('bg-white/20');
    } else {
      item.classList.remove('bg-white/20');
    }
  });

  // Update page title and content
  const titles = {
    dashboard: 'Dashboard',
    transactions: 'Transacciones',
    accounts: 'Cuentas',
    loans: 'Préstamos',
    budget: 'Presupuesto',
    education: 'Educación Financiera',
    reports: 'Reportes',
    profile: 'Mi Perfil'
  };

  document.getElementById('page-title').textContent = titles[page];

  // Load page content
  const contentDiv = document.getElementById('page-content');
  
  switch(page) {
    case 'dashboard':
      renderDashboardPage(contentDiv);
      break;
    case 'transactions':
      renderTransactionsPage(contentDiv);
      break;
    case 'accounts':
      renderAccountsPage(contentDiv);
      break;
    case 'loans':
      renderLoansPage(contentDiv);
      break;
    case 'budget':
      renderBudgetPage(contentDiv);
      break;
    case 'education':
      renderEducationPage(contentDiv);
      break;
    case 'reports':
      renderReportsPage(contentDiv);
      break;
    case 'profile':
      renderProfilePage(contentDiv);
      break;
    default:
      renderDashboardPage(contentDiv);
  }
}

// ========== DASHBOARD PAGE ==========
async function renderDashboardPage(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Balance Card -->
        <div class="card bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-gray-600">Balance Total</h3>
            <span class="text-3xl">💰</span>
          </div>
          <p id="total-balance" class="text-3xl font-bold text-gray-800 mb-2">$0.00</p>
          <p class="text-sm text-green-600">+0% este mes</p>
        </div>

        <!-- Income Card -->
        <div class="card bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-gray-600">Ingresos</h3>
            <span class="text-3xl">📈</span>
          </div>
          <p id="total-income" class="text-3xl font-bold text-green-600 mb-2">$0.00</p>
          <p class="text-sm text-gray-600">Este mes</p>
        </div>

        <!-- Expenses Card -->
        <div class="card bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-gray-600">Gastos</h3>
            <span class="text-3xl">📉</span>
          </div>
          <p id="total-expenses" class="text-3xl font-bold text-red-600 mb-2">$0.00</p>
          <p class="text-sm text-gray-600">Este mes</p>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Cash Flow Chart -->
        <div class="card bg-white rounded-2xl p-6 shadow-lg">
          <h3 class="text-lg font-display font-bold text-gray-800 mb-4">Flujo de Efectivo</h3>
          <div style="position: relative; height: 300px;">
            <canvas id="cashflow-chart"></canvas>
          </div>
        </div>

        <!-- Expense Categories Chart -->
        <div class="card bg-white rounded-2xl p-6 shadow-lg">
          <h3 class="text-lg font-display font-bold text-gray-800 mb-4">Gastos por Categoría</h3>
          <div style="position: relative; height: 300px;">
            <canvas id="expenses-chart"></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="card bg-white rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-display font-bold text-gray-800">Transacciones Recientes</h3>
          <button onclick="navigateTo('transactions')" class="text-primary hover:text-primary-dark font-semibold text-sm">
            Ver todas →
          </button>
        </div>
        <div id="recent-transactions" class="space-y-3">
          <p class="text-center text-gray-500 py-8">No hay transacciones recientes</p>
        </div>
      </div>
    </div>
  `;

  // Load data
  await loadDashboardData();
  initDashboardCharts();
}

async function loadDashboardData() {
  try {
    // Load accounts and calculate totals
    const accountsRef = collection(db, 'users', currentUser.uid, 'accounts');
    const accountsSnapshot = await getDocs(query(accountsRef));
    
    let totalBalance = 0;
    accountsSnapshot.forEach(doc => {
      const account = doc.data();
      totalBalance += account.balance || 0;
    });

    document.getElementById('total-balance').textContent = 
      `$${totalBalance.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;

    // Load transactions and calculate income/expenses for current month
    const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
    const transactionsSnapshot = await getDocs(query(transactionsRef, orderBy('date', 'desc')));

    let monthIncome = 0;
    let monthExpenses = 0;
    const recentTransactions = [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    transactionsSnapshot.forEach(doc => {
      const transaction = doc.data();
      const transactionDate = transaction.date?.toDate ? transaction.date.toDate() : new Date(transaction.date?.seconds * 1000);
      
      // Calculate monthly totals
      if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
        if (transaction.type === 'income') {
          monthIncome += transaction.amount || 0;
        } else {
          monthExpenses += transaction.amount || 0;
        }
      }

      // Collect recent transactions (last 5)
      if (recentTransactions.length < 5) {
        recentTransactions.push({ id: doc.id, ...transaction });
      }
    });

    document.getElementById('total-income').textContent = 
      `$${monthIncome.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
    document.getElementById('total-expenses').textContent = 
      `$${monthExpenses.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;

    // Display recent transactions
    const recentDiv = document.getElementById('recent-transactions');
    if (recentTransactions.length > 0) {
      recentDiv.innerHTML = '';
      recentTransactions.forEach(t => {
        const isIncome = t.type === 'income';
        const icon = isIncome ? '💰' : '💸';
        const amountClass = isIncome ? 'text-green-600' : 'text-red-600';
        const sign = isIncome ? '+' : '-';
        const date = t.date?.toDate ? t.date.toDate() : new Date(t.date?.seconds * 1000);

        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all';
        div.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100' : 'bg-red-100'}">
              <span class="text-xl">${icon}</span>
            </div>
            <div>
              <p class="font-semibold text-gray-800 text-sm">${t.description || 'Sin descripción'}</p>
              <p class="text-xs text-gray-600">${t.category || 'Sin categoría'} • ${date.toLocaleDateString('es-DO')}</p>
            </div>
          </div>
          <p class="font-bold ${amountClass}">${sign}$${(t.amount || 0).toLocaleString('es-DO', {minimumFractionDigits: 2})}</p>
        `;
        recentDiv.appendChild(div);
      });
    }

    // Update charts with real data
    await updateDashboardCharts();

  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

// Global chart instances
let cashflowChart = null;
let expensesChart = null;

function initDashboardCharts() {
  // Cash Flow Chart with initial data (all zeros for new users)
  const cashflowCtx = document.getElementById('cashflow-chart');
  if (cashflowCtx && typeof Chart !== 'undefined') {
    cashflowChart = new Chart(cashflowCtx, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Ingresos',
            data: [0, 0, 0, 0, 0, 0],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Gastos',
            data: [0, 0, 0, 0, 0, 0],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString('es-DO');
              }
            }
          }
        }
      }
    });
  }

  // Expenses Chart with initial data (empty for new users)
  const expensesCtx = document.getElementById('expenses-chart');
  if (expensesCtx && typeof Chart !== 'undefined') {
    expensesChart = new Chart(expensesCtx, {
      type: 'doughnut',
      data: {
        labels: ['Sin datos'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e5e7eb']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                if (context.label === 'Sin datos') {
                  return 'No hay gastos registrados';
                }
                const value = context.parsed || 0;
                return context.label + ': $' + value.toLocaleString('es-DO', {minimumFractionDigits: 2});
              }
            }
          }
        }
      }
    });
  }
}

async function updateDashboardCharts() {
  try {
    const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
    const transactionsSnapshot = await getDocs(query(transactionsRef, orderBy('date', 'desc')));

    // Prepare data for last 6 months
    const monthsData = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthsData.push({
        label: date.toLocaleDateString('es-DO', { month: 'short' }),
        month: date.getMonth(),
        year: date.getFullYear(),
        income: 0,
        expenses: 0
      });
    }

    // Aggregate expenses by category
    const categoryData = {};

    transactionsSnapshot.forEach(doc => {
      const transaction = doc.data();
      const transactionDate = transaction.date?.toDate ? transaction.date.toDate() : new Date(transaction.date?.seconds * 1000);
      
      // Find the month index
      const monthIndex = monthsData.findIndex(m => 
        m.month === transactionDate.getMonth() && m.year === transactionDate.getFullYear()
      );

      if (monthIndex !== -1) {
        if (transaction.type === 'income') {
          monthsData[monthIndex].income += transaction.amount || 0;
        } else if (transaction.type === 'expense') {
          monthsData[monthIndex].expenses += transaction.amount || 0;
          
          // Aggregate by category
          const category = transaction.category || 'Otros';
          categoryData[category] = (categoryData[category] || 0) + (transaction.amount || 0);
        }
      }
    });

    // Update Cash Flow Chart
    if (cashflowChart) {
      cashflowChart.data.labels = monthsData.map(m => m.label);
      cashflowChart.data.datasets[0].data = monthsData.map(m => m.income);
      cashflowChart.data.datasets[1].data = monthsData.map(m => m.expenses);
      cashflowChart.update();
    }

    // Update Expenses Chart
    if (expensesChart) {
      const categories = Object.keys(categoryData);
      if (categories.length > 0) {
        // Get colors from user categories
        const categoryColors = {};
        userCategories.forEach(cat => {
          categoryColors[cat.id] = cat.color;
          categoryColors[cat.name] = cat.color;
        });

        expensesChart.data.labels = categories;
        expensesChart.data.datasets[0].data = categories.map(cat => categoryData[cat]);
        expensesChart.data.datasets[0].backgroundColor = categories.map(cat => categoryColors[cat] || '#6b7280');
      } else {
        // No data - show empty state
        expensesChart.data.labels = ['Sin datos'];
        expensesChart.data.datasets[0].data = [1];
        expensesChart.data.datasets[0].backgroundColor = ['#e5e7eb'];
      }
      expensesChart.update();
    }

  } catch (error) {
    console.error('Error updating charts:', error);
  }
}

// ========== TRANSACTIONS PAGE ==========
function renderTransactionsPage(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-xl font-bold text-gray-800">Todas las Transacciones</h3>
          <p class="text-sm text-gray-600">Gestiona tus ingresos y gastos</p>
        </div>
        <button id="add-transaction-btn" class="gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg">
          + Nueva Transacción
        </button>
      </div>

      <!-- Filters -->
      <div class="card bg-white rounded-2xl p-4 shadow-lg">
        <div class="flex flex-wrap gap-4">
          <select id="filter-type" class="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
            <option value="all">Todos los tipos</option>
            <option value="income">Ingresos</option>
            <option value="expense">Gastos</option>
          </select>

          <select id="filter-category" class="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
            <option value="all">Todas las categorías</option>
            ${getCategoriesHTML('all')}
          </select>

          <input type="month" id="filter-month" class="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
          
          <button id="clear-filters" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold transition-all">
            Limpiar Filtros
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
          <p class="text-sm text-gray-600 mb-1">Total Ingresos</p>
          <p id="filtered-income" class="text-2xl font-bold text-green-600">$0.00</p>
        </div>
        <div class="card bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl">
          <p class="text-sm text-gray-600 mb-1">Total Gastos</p>
          <p id="filtered-expenses" class="text-2xl font-bold text-red-600">$0.00</p>
        </div>
        <div class="card bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
          <p class="text-sm text-gray-600 mb-1">Balance</p>
          <p id="filtered-balance" class="text-2xl font-bold text-blue-600">$0.00</p>
        </div>
      </div>

      <!-- Transactions List -->
      <div class="card bg-white rounded-2xl p-6 shadow-lg">
        <div id="transactions-list" class="space-y-3">
          <p class="text-center text-gray-500 py-8">No hay transacciones aún</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('add-transaction-btn').addEventListener('click', () => {
    showAddTransactionModal();
  });

  // Filter listeners
  document.getElementById('filter-type').addEventListener('change', loadTransactions);
  document.getElementById('filter-category').addEventListener('change', loadTransactions);
  document.getElementById('filter-month').addEventListener('change', loadTransactions);
  document.getElementById('clear-filters').addEventListener('click', () => {
    document.getElementById('filter-type').value = 'all';
    document.getElementById('filter-category').value = 'all';
    document.getElementById('filter-month').value = '';
    loadTransactions();
  });

  loadTransactions();
}

async function loadTransactions() {
  const listDiv = document.getElementById('transactions-list');
  
  try {
    const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
    const q = query(transactionsRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      listDiv.innerHTML = '<p class="text-center text-gray-500 py-8">No hay transacciones aún. ¡Crea tu primera transacción!</p>';
      updateFilteredTotals([], []);
      return;
    }

    // Apply filters
    const filterType = document.getElementById('filter-type')?.value || 'all';
    const filterCategory = document.getElementById('filter-category')?.value || 'all';
    const filterMonth = document.getElementById('filter-month')?.value || '';

    let filtered = [];
    snapshot.forEach(doc => {
      const transaction = { id: doc.id, ...doc.data() };
      
      // Type filter
      if (filterType !== 'all' && transaction.type !== filterType) return;
      
      // Category filter
      if (filterCategory !== 'all' && transaction.category !== filterCategory) return;
      
      // Month filter
      if (filterMonth) {
        const transactionDate = transaction.date?.toDate ? transaction.date.toDate() : new Date(transaction.date?.seconds * 1000);
        const filterDate = new Date(filterMonth);
        if (transactionDate.getMonth() !== filterDate.getMonth() || 
            transactionDate.getFullYear() !== filterDate.getFullYear()) return;
      }

      filtered.push(transaction);
    });

    if (filtered.length === 0) {
      listDiv.innerHTML = '<p class="text-center text-gray-500 py-8">No hay transacciones que coincidan con los filtros</p>';
      updateFilteredTotals([], []);
      return;
    }

    listDiv.innerHTML = '';
    filtered.forEach(transaction => {
      const transactionEl = createTransactionElement(transaction.id, transaction);
      listDiv.appendChild(transactionEl);
    });

    // Update totals
    const income = filtered.filter(t => t.type === 'income');
    const expenses = filtered.filter(t => t.type === 'expense');
    updateFilteredTotals(income, expenses);

  } catch (error) {
    console.error('Error loading transactions:', error);
    listDiv.innerHTML = '<p class="text-center text-red-500 py-8">Error al cargar transacciones</p>';
  }
}

function updateFilteredTotals(income, expenses) {
  const totalIncome = income.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + (t.amount || 0), 0);
  const balance = totalIncome - totalExpenses;

  const incomeEl = document.getElementById('filtered-income');
  const expensesEl = document.getElementById('filtered-expenses');
  const balanceEl = document.getElementById('filtered-balance');

  if (incomeEl) incomeEl.textContent = `$${totalIncome.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
  if (expensesEl) expensesEl.textContent = `$${totalExpenses.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
  if (balanceEl) {
    balanceEl.textContent = `$${Math.abs(balance).toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
    balanceEl.className = `text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`;
  }
}

function createTransactionElement(id, transaction) {
  const div = document.createElement('div');
  div.className = 'flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all';
  
  const isIncome = transaction.type === 'income';
  const icon = isIncome ? '💰' : '💸';
  const amountClass = isIncome ? 'text-green-600' : 'text-red-600';
  const sign = isIncome ? '+' : '-';

  div.innerHTML = `
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100' : 'bg-red-100'}">
        <span class="text-2xl">${icon}</span>
      </div>
      <div>
        <p class="font-semibold text-gray-800">${transaction.description || 'Sin descripción'}</p>
        <p class="text-sm text-gray-600">${transaction.category || 'Sin categoría'} • ${new Date(transaction.date?.seconds * 1000 || Date.now()).toLocaleDateString('es-DO')}</p>
      </div>
    </div>
    <div class="text-right">
      <p class="text-xl font-bold ${amountClass}">${sign}$${(transaction.amount || 0).toLocaleString('es-DO', {minimumFractionDigits: 2})}</p>
      <div class="flex gap-2 justify-end mt-1">
        <button class="edit-transaction text-sm text-primary hover:underline" data-id="${id}">Editar</button>
        <span class="text-gray-400">|</span>
        <button class="delete-transaction text-sm text-red-600 hover:underline" data-id="${id}">Eliminar</button>
      </div>
    </div>
  `;

  div.querySelector('.edit-transaction').addEventListener('click', () => {
    showEditTransactionModal(id, transaction);
  });

  div.querySelector('.delete-transaction').addEventListener('click', async (e) => {
    if (confirm('¿Eliminar esta transacción?')) {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'transactions', id));
      loadTransactions();
    }
  });

  return div;
}

function showAddTransactionModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
  
  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
      <h2 class="text-2xl font-display font-bold text-gray-800 mb-6">Nueva Transacción</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
          <select id="transaction-type" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
          <input type="text" id="transaction-description" placeholder="Ej: Supermercado" 
                 class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Monto</label>
          <input type="number" id="transaction-amount" placeholder="0.00" step="0.01" 
                 class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
          <div class="flex gap-2">
            <select id="transaction-category" class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
              ${getCategoriesHTML('expense')}
            </select>
            <button id="manage-categories-btn" class="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all" title="Gestionar categorías">
              ⚙️
            </button>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button id="cancel-transaction" class="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300">
            Cancelar
          </button>
          <button id="save-transaction" class="flex-1 py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg">
            Guardar
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Update categories when type changes
  const typeSelect = modal.querySelector('#transaction-type');
  const categorySelect = modal.querySelector('#transaction-category');
  
  typeSelect.addEventListener('change', () => {
    const type = typeSelect.value;
    categorySelect.innerHTML = getCategoriesHTML(type);
  });

  // Manage categories button
  modal.querySelector('#manage-categories-btn').addEventListener('click', () => {
    modal.remove();
    showManageCategoriesModal();
  });

  modal.querySelector('#cancel-transaction').addEventListener('click', () => modal.remove());

  modal.querySelector('#save-transaction').addEventListener('click', async () => {
    const type = document.getElementById('transaction-type').value;
    const description = document.getElementById('transaction-description').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const category = document.getElementById('transaction-category').value;

    if (!description || !amount) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'transactions'), {
        type,
        description,
        amount,
        category,
        date: new Date(),
        createdAt: new Date()
      });

      console.log('✅ Transacción creada');
      modal.remove();
      loadTransactions();
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Error al crear transacción: ' + error.message);
    }
  });
}

function showEditTransactionModal(id, transaction) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
  
  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
      <h2 class="text-2xl font-display font-bold text-gray-800 mb-6">Editar Transacción</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
          <select id="edit-transaction-type" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
            <option value="expense" ${transaction.type === 'expense' ? 'selected' : ''}>Gasto</option>
            <option value="income" ${transaction.type === 'income' ? 'selected' : ''}>Ingreso</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
          <input type="text" id="edit-transaction-description" value="${transaction.description || ''}" placeholder="Ej: Supermercado" 
                 class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Monto</label>
          <input type="number" id="edit-transaction-amount" value="${transaction.amount || 0}" placeholder="0.00" step="0.01" 
                 class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
          <select id="edit-transaction-category" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
            <option value="alimentacion" ${transaction.category === 'alimentacion' ? 'selected' : ''}>Alimentación</option>
            <option value="transporte" ${transaction.category === 'transporte' ? 'selected' : ''}>Transporte</option>
            <option value="vivienda" ${transaction.category === 'vivienda' ? 'selected' : ''}>Vivienda</option>
            <option value="entretenimiento" ${transaction.category === 'entretenimiento' ? 'selected' : ''}>Entretenimiento</option>
            <option value="salud" ${transaction.category === 'salud' ? 'selected' : ''}>Salud</option>
            <option value="educacion" ${transaction.category === 'educacion' ? 'selected' : ''}>Educación</option>
            <option value="otros" ${transaction.category === 'otros' ? 'selected' : ''}>Otros</option>
          </select>
        </div>

        <div class="flex gap-3 pt-4">
          <button id="cancel-edit-transaction" class="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300">
            Cancelar
          </button>
          <button id="save-edit-transaction" class="flex-1 py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg">
            Actualizar
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#cancel-edit-transaction').addEventListener('click', () => modal.remove());

  modal.querySelector('#save-edit-transaction').addEventListener('click', async () => {
    const type = document.getElementById('edit-transaction-type').value;
    const description = document.getElementById('edit-transaction-description').value;
    const amount = parseFloat(document.getElementById('edit-transaction-amount').value);
    const category = document.getElementById('edit-transaction-category').value;

    if (!description || !amount) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', currentUser.uid, 'transactions', id), {
        type,
        description,
        amount,
        category,
        updatedAt: new Date()
      });

      console.log('✅ Transacción actualizada');
      modal.remove();
      loadTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Error al actualizar transacción: ' + error.message);
    }
  });
}

// ========== ACCOUNTS PAGE ==========
function renderAccountsPage(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <!-- Add Account Button -->
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-xl font-bold text-gray-800">Mis Cuentas</h3>
          <p class="text-sm text-gray-600">Gestiona tus cuentas bancarias</p>
        </div>
        <button id="add-account-btn" class="gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg">
          + Nueva Cuenta
        </button>
      </div>

      <!-- Accounts Grid -->
      <div id="accounts-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <p class="text-center text-gray-500 py-8 col-span-full">No hay cuentas aún</p>
      </div>
    </div>
  `;

  document.getElementById('add-account-btn').addEventListener('click', () => {
    showAddAccountModal();
  });

  loadAccounts();
}

async function loadAccounts() {
  const grid = document.getElementById('accounts-grid');
  
  try {
    const accountsRef = collection(db, 'users', currentUser.uid, 'accounts');
    const snapshot = await getDocs(accountsRef);

    if (snapshot.empty) {
      grid.innerHTML = '<p class="text-center text-gray-500 py-8 col-span-full">No hay cuentas aún. ¡Crea tu primera cuenta!</p>';
      return;
    }

    grid.innerHTML = '';
    snapshot.forEach(doc => {
      const account = doc.data();
      const accountCard = createAccountCard(doc.id, account);
      grid.appendChild(accountCard);
    });

  } catch (error) {
    console.error('Error loading accounts:', error);
    grid.innerHTML = '<p class="text-center text-red-500 py-8 col-span-full">Error al cargar cuentas</p>';
  }
}

function createAccountCard(id, account) {
  const div = document.createElement('div');
  div.className = 'card bg-gradient-to-br from-primary to-primary-dark text-white p-6 rounded-2xl shadow-lg';
  
  div.innerHTML = `
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-xl font-bold">${account.name}</h3>
        <p class="text-sm text-white/80">${account.type || 'Cuenta corriente'}</p>
      </div>
      <span class="text-3xl">🏦</span>
    </div>
    <p class="text-3xl font-bold mb-4">$${(account.balance || 0).toLocaleString('es-DO', {minimumFractionDigits: 2})}</p>
    <div class="flex gap-2">
      <button class="edit-account flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-all" data-id="${id}">
        Editar
      </button>
      <button class="delete-account flex-1 py-2 bg-red-500/50 hover:bg-red-500 rounded-lg text-sm font-semibold transition-all" data-id="${id}">
        Eliminar
      </button>
    </div>
  `;

  div.querySelector('.delete-account').addEventListener('click', async () => {
    if (confirm('¿Eliminar esta cuenta?')) {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'accounts', id));
      loadAccounts();
    }
  });

  return div;
}

function showAddAccountModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
  
  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
      <h2 class="text-2xl font-display font-bold text-gray-800 mb-6">🏦 Nueva Cuenta</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
          <input type="text" id="account-name" placeholder="Ej: Cuenta Principal" 
                 class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Balance Inicial</label>
          <input type="number" id="account-balance" placeholder="0.00" step="0.01" 
                 class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Moneda</label>
          <select id="account-currency" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
            <option value="DOP">DOP - Peso Dominicano</option>
            <option value="USD">USD - Dólar</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </div>

        <div class="flex gap-3 pt-4">
          <button id="cancel-account" class="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300">
            Cancelar
          </button>
          <button id="save-account" class="flex-1 py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg">
            Guardar
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#cancel-account').addEventListener('click', () => modal.remove());

  modal.querySelector('#save-account').addEventListener('click', async () => {
    const name = document.getElementById('account-name').value.trim();
    const balance = parseFloat(document.getElementById('account-balance').value) || 0;
    const currency = document.getElementById('account-currency').value;

    if (!name) {
      alert('Por favor ingresa un nombre');
      return;
    }

    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'accounts'), {
        name,
        balance,
        currency,
        type: 'checking',
        createdAt: new Date()
      });

      console.log('✅ Cuenta creada');
      modal.remove();
      loadAccounts();
      loadDashboardData();
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Error al crear cuenta: ' + error.message);
    }
  });
}

// ========== LOANS PAGE ==========
function renderLoansPage(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <!-- Loan Calculator -->
      <div class="card bg-white rounded-2xl p-6 shadow-lg">
        <h3 class="text-xl font-display font-bold text-gray-800 mb-6">💰 Calculadora de Préstamos</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Monto del préstamo (DOP)</label>
              <input type="number" id="loan-amount" value="100000" step="1000" 
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Tasa de interés anual (%)</label>
              <input type="number" id="loan-rate" value="14.32" step="0.01" 
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
              <p class="text-xs text-gray-500 mt-1">Promedio en RD: 14.32% (TPM BCRD: 5.75%)</p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Plazo (meses)</label>
              <input type="number" id="loan-term" value="24" step="1" min="1" 
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
            </div>

            <button id="calculate-loan" class="w-full gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-lg">
              Calcular
            </button>
          </div>

          <div id="loan-results" class="space-y-4 p-6 bg-gradient-to-br from-primary-light to-secondary-light rounded-2xl">
            <h4 class="font-bold text-gray-800 mb-4">Resultados</h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-white rounded-xl">
                <span class="text-gray-700">Cuota mensual:</span>
                <span id="monthly-payment" class="text-xl font-bold text-primary">$0.00</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-white rounded-xl">
                <span class="text-gray-700">Total a pagar:</span>
                <span id="total-payment" class="text-xl font-bold text-gray-800">$0.00</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-white rounded-xl">
                <span class="text-gray-700">Intereses totales:</span>
                <span id="total-interest" class="text-xl font-bold text-red-600">$0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loan Products -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Personal Loan -->
        <div class="card bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-4xl">💳</span>
            <h3 class="text-lg font-bold text-gray-800">Préstamo Personal</h3>
          </div>
          <ul class="space-y-2 text-sm text-gray-700">
            <li>✓ Hasta $500,000 DOP</li>
            <li>✓ Tasa desde 14.32% anual</li>
            <li>✓ Plazo hasta 60 meses</li>
            <li>✓ Aprobación rápida</li>
          </ul>
        </div>

        <!-- Vehicle Loan -->
        <div class="card bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-4xl">🚗</span>
            <h3 class="text-lg font-bold text-gray-800">Préstamo Vehicular</h3>
          </div>
          <ul class="space-y-2 text-sm text-gray-700">
            <li>✓ Financiamiento 100%</li>
            <li>✓ Vehículos nuevos: 72 meses</li>
            <li>✓ Vehículos usados: 60 meses</li>
            <li>✓ Tasa competitiva</li>
          </ul>
        </div>

        <!-- Mortgage Loan -->
        <div class="card bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-4xl">🏠</span>
            <h3 class="text-lg font-bold text-gray-800">Préstamo Hipotecario</h3>
          </div>
          <ul class="space-y-2 text-sm text-gray-700">
            <li>✓ Hasta 80% del valor</li>
            <li>✓ Tasa desde 15.95% anual</li>
            <li>✓ Plazo hasta 30 años</li>
            <li>✓ Primera vivienda</li>
          </ul>
        </div>

        <!-- PYME Loan -->
        <div class="card bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-4xl">🏭</span>
            <h3 class="text-lg font-bold text-gray-800">Préstamo PYME</h3>
          </div>
          <ul class="space-y-2 text-sm text-gray-700">
            <li>✓ Promipyme: 12% anual</li>
            <li>✓ Sector industrial: 72 meses</li>
            <li>✓ Otros sectores: 60 meses</li>
            <li>✓ Capital de trabajo y expansión</li>
          </ul>
        </div>

        <!-- Savings -->
        <div class="card bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-4xl">💎</span>
            <h3 class="text-lg font-bold text-gray-800">Ahorros</h3>
          </div>
          <ul class="space-y-2 text-sm text-gray-700">
            <li>✓ Cuentas de ahorro</li>
            <li>✓ Certificados financieros</li>
            <li>✓ Tasas competitivas</li>
            <li>✓ Protección DIGEPRES</li>
          </ul>
        </div>

        <!-- Credit Card -->
        <div class="card bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-4xl">💎</span>
            <h3 class="text-lg font-bold text-gray-800">Tarjeta de Crédito</h3>
          </div>
          <ul class="space-y-2 text-sm text-gray-700">
            <li>✓ Límites flexibles</li>
            <li>✓ Programas de recompensas</li>
            <li>✓ 0% interés primeros meses</li>
            <li>✓ Seguros incluidos</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  document.getElementById('calculate-loan').addEventListener('click', calculateLoan);
}

function calculateLoan() {
  const amount = parseFloat(document.getElementById('loan-amount').value);
  const annualRate = parseFloat(document.getElementById('loan-rate').value);
  const months = parseInt(document.getElementById('loan-term').value);

  if (!amount || !annualRate || !months) {
    alert('Por favor completa todos los campos');
    return;
  }

  // Monthly interest rate
  const monthlyRate = (annualRate / 100) / 12;
  
  // Monthly payment formula: P * (r(1+r)^n) / ((1+r)^n - 1)
  const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                         (Math.pow(1 + monthlyRate, months) - 1);
  
  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - amount;

  document.getElementById('monthly-payment').textContent = 
    `$${monthlyPayment.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
  document.getElementById('total-payment').textContent = 
    `$${totalPayment.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
  document.getElementById('total-interest').textContent = 
    `$${totalInterest.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
}

// ========== EDUCATION PAGE ========== 
function renderEducationPage(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <!-- ITBIS Calculator -->
      <div class="card bg-white rounded-2xl p-6 shadow-lg">
        <h3 class="text-xl font-display font-bold text-gray-800 mb-6">🧮 Calculadora ITBIS (18%)</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Monto sin ITBIS (DOP)</label>
              <input type="number" id="itbis-amount" value="1000" step="0.01" 
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
            </div>

            <button id="calculate-itbis" class="w-full gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-lg">
              Calcular ITBIS
            </button>
          </div>

          <div id="itbis-results" class="space-y-4 p-6 bg-gradient-to-br from-primary-light to-secondary-light rounded-2xl">
            <h4 class="font-bold text-gray-800 mb-4">Resultados</h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-white rounded-xl">
                <span class="text-gray-700">Monto base:</span>
                <span id="base-amount" class="text-xl font-bold text-gray-800">$1,000.00</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-white rounded-xl">
                <span class="text-gray-700">ITBIS (18%):</span>
                <span id="itbis-tax" class="text-xl font-bold text-primary">$180.00</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-white rounded-xl">
                <span class="text-gray-700">Total con ITBIS:</span>
                <span id="total-with-itbis" class="text-xl font-bold text-green-600">$1,180.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legal Framework -->
      <div class="card bg-white rounded-2xl p-6 shadow-lg">
        <h3 class="text-xl font-display font-bold text-gray-800 mb-4">⚖️ Marco Legal Financiero RD</h3>
        
        <div class="space-y-4 text-gray-700">
          <div class="p-4 bg-primary-light rounded-xl">
            <h4 class="font-bold text-primary mb-2">Ley 183-02 (Ley Monetaria y Financiera)</h4>
            <p class="text-sm">Ley fundamental que regula el sistema monetario y financiero de la República Dominicana. Establece las funciones del Banco Central, la supervisión bancaria, y los mecanismos de protección al usuario financiero.</p>
          </div>

          <div class="p-4 bg-green-50 rounded-xl">
            <h4 class="font-bold text-green-700 mb-2">Superintendencia de Bancos</h4>
            <p class="text-sm">Organismo técnico encargado de la supervisión de las entidades de intermediación financiera. Regula y supervisa bancos, cooperativas, y otras instituciones financieras para garantizar la estabilidad del sistema.</p>
          </div>

          <div class="p-4 bg-blue-50 rounded-xl">
            <h4 class="font-bold text-blue-700 mb-2">Banco Central de la República Dominicana (BCRD)</h4>
            <p class="text-sm">Tasa de Política Monetaria (TPM): <strong>5.75%</strong>. El BCRD es responsable de mantener la estabilidad de precios y el poder adquisitivo de la moneda nacional.</p>
          </div>
        </div>
      </div>

      <!-- Consumer Rights -->
      <div class="card bg-white rounded-2xl p-6 shadow-lg">
        <h3 class="text-xl font-display font-bold text-gray-800 mb-4">🛡️ Tus Derechos Como Consumidor</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 rounded-xl">
            <h4 class="font-bold text-gray-800 mb-2">✓ Derecho a la Información</h4>
            <p class="text-sm text-gray-700">Los bancos deben informarte claramente sobre tasas de interés, comisiones, y condiciones de los productos financieros.</p>
          </div>

          <div class="p-4 bg-gray-50 rounded-xl">
            <h4 class="font-bold text-gray-800 mb-2">✓ Derecho a Elegir</h4>
            <p class="text-sm text-gray-700">Puedes comparar ofertas y elegir el producto financiero que mejor se adapte a tus necesidades sin presión.</p>
          </div>

          <div class="p-4 bg-gray-50 rounded-xl">
            <h4 class="font-bold text-gray-800 mb-2">✓ Reporte de Crédito Gratis</h4>
            <p class="text-sm text-gray-700">Tienes derecho a consultar tu historial crediticio gratuitamente una vez al año en TransUnion y DataCrédito.</p>
          </div>

          <div class="p-4 bg-gray-50 rounded-xl">
            <h4 class="font-bold text-gray-800 mb-2">✓ ProUsuario</h4>
            <p class="text-sm text-gray-700">Contacto de quejas: <strong class="text-primary">WhatsApp 809-731-3535</strong>. Protección al consumidor de servicios financieros.</p>
          </div>

          <div class="p-4 bg-gray-50 rounded-xl">
            <h4 class="font-bold text-gray-800 mb-2">✓ Protección contra Usura</h4>
            <p class="text-sm text-gray-700">El nuevo Código Penal criminaliza el préstamo no regulado con tasas excesivas. Solo presta con instituciones autorizadas.</p>
          </div>

          <div class="p-4 bg-gray-50 rounded-xl">
            <h4 class="font-bold text-gray-800 mb-2">✓ Educación Financiera</h4>
            <p class="text-sm text-gray-700">El Estado promueve la educación financiera desde la escuela hasta programas para adultos y empresarios.</p>
          </div>
        </div>
      </div>

      <!-- Financial Tips -->
      <div class="card bg-white rounded-2xl p-6 shadow-lg">
        <h3 class="text-xl font-display font-bold text-gray-800 mb-4">💡 Consejos Financieros</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4">
            <span class="text-4xl mb-3 block">🎯</span>
            <h4 class="font-bold text-gray-800 mb-2">Presupuesta</h4>
            <p class="text-sm text-gray-600">Regla 50/30/20: 50% necesidades, 30% deseos, 20% ahorro</p>
          </div>

          <div class="text-center p-4">
            <span class="text-4xl mb-3 block">💎</span>
            <h4 class="font-bold text-gray-800 mb-2">Ahorra Primero</h4>
            <p class="text-sm text-gray-600">Paga a tu futuro primero. Automatiza tus ahorros cada mes</p>
          </div>

          <div class="text-center p-4">
            <span class="text-4xl mb-3 block">📊</span>
            <h4 class="font-bold text-gray-800 mb-2">Historial Crediticio</h4>
            <p class="text-sm text-gray-600">Paga a tiempo para construir un buen historial y obtener mejores tasas</p>
          </div>

          <div class="text-center p-4">
            <span class="text-4xl mb-3 block">🚫</span>
            <h4 class="font-bold text-gray-800 mb-2">Evita Deudas Malas</h4>
            <p class="text-sm text-gray-600">Diferencia entre gestión de deuda (inversión) y liquidación (consumo)</p>
          </div>

          <div class="text-center p-4">
            <span class="text-4xl mb-3 block">🏦</span>
            <h4 class="font-bold text-gray-800 mb-2">Fondo de Emergencia</h4>
            <p class="text-sm text-gray-600">Ahorra 3-6 meses de gastos para imprevistos</p>
          </div>

          <div class="text-center p-4">
            <span class="text-4xl mb-3 block">📚</span>
            <h4 class="font-bold text-gray-800 mb-2">Edúcate</h4>
            <p class="text-sm text-gray-600">La inversión más rentable es en tu educación financiera</p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('calculate-itbis').addEventListener('click', calculateITBIS);
  // Auto-calculate ITBIS on load
  calculateITBIS();
}

function calculateITBIS() {
  const amount = parseFloat(document.getElementById('itbis-amount').value) || 0;
  const itbis = amount * 0.18;
  const total = amount + itbis;

  document.getElementById('base-amount').textContent = 
    `$${amount.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
  document.getElementById('itbis-tax').textContent = 
    `$${itbis.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
  document.getElementById('total-with-itbis').textContent = 
    `$${total.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
}

// ========== BUDGET PAGE ==========
async function renderBudgetPage(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <!-- Budget Overview -->
      <div class="card bg-white rounded-2xl p-6 shadow-lg">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-xl font-display font-bold text-gray-800">🎯 Presupuesto Mensual</h3>
            <p class="text-sm text-gray-600">Gestiona tus límites de gastos por categoría</p>
          </div>
          <button id="add-budget-btn" class="gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg">
            + Crear Presupuesto
          </button>
        </div>

        <!-- Budget Progress -->
        <div id="budget-list" class="space-y-4">
          <div class="text-center py-8 text-gray-500">
            <span class="text-6xl block mb-4">📊</span>
            <p>No has creado presupuestos aún</p>
            <p class="text-sm mt-2">Crea tu primer presupuesto para controlar mejor tus gastos</p>
          </div>
        </div>
      </div>

      <!-- Budget Tips -->
      <div class="card bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-6 shadow-lg">
        <h3 class="text-xl font-display font-bold mb-4">💡 Regla 50/30/20</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white/10 rounded-xl p-4">
            <div class="text-3xl mb-2">🏠</div>
            <div class="text-2xl font-bold mb-2">50%</div>
            <p class="text-sm text-white/90">Necesidades básicas (vivienda, comida, transporte, servicios)</p>
          </div>
          <div class="bg-white/10 rounded-xl p-4">
            <div class="text-3xl mb-2">🎮</div>
            <div class="text-2xl font-bold mb-2">30%</div>
            <p class="text-sm text-white/90">Deseos y estilo de vida (entretenimiento, hobbies, salidas)</p>
          </div>
          <div class="bg-white/10 rounded-xl p-4">
            <div class="text-3xl mb-2">💰</div>
            <div class="text-2xl font-bold mb-2">20%</div>
            <p class="text-sm text-white/90">Ahorros e inversiones (fondo de emergencia, retiro, metas)</p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('add-budget-btn')?.addEventListener('click', () => {
    showAddBudgetModal();
  });

  await loadBudgets();
}

async function loadBudgets() {
  const listDiv = document.getElementById('budget-list');
  if (!listDiv) return;

  try {
    const budgetsRef = collection(db, 'users', currentUser.uid, 'budgets');
    const snapshot = await getDocs(budgetsRef);

    if (snapshot.empty) {
      listDiv.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <span class="text-6xl block mb-4">📊</span>
          <p>No has creado presupuestos aún</p>
          <p class="text-sm mt-2">Crea tu primer presupuesto para controlar mejor tus gastos</p>
        </div>
      `;
      return;
    }

    listDiv.innerHTML = '';
    snapshot.forEach(doc => {
      const budget = doc.data();
      const budgetEl = createBudgetElement(doc.id, budget);
      listDiv.appendChild(budgetEl);
    });

  } catch (error) {
    console.error('Error loading budgets:', error);
    listDiv.innerHTML = '<p class="text-center text-red-500 py-8">Error al cargar presupuestos</p>';
  }
}

function createBudgetElement(id, budget) {
  const div = document.createElement('div');
  div.className = 'p-4 bg-gray-50 rounded-xl';
  
  const spent = budget.spent || 0;
  const limit = budget.limit || 0;
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const remaining = limit - spent;
  
  let barColor = 'bg-green-500';
  if (percentage >= 90) barColor = 'bg-red-500';
  else if (percentage >= 75) barColor = 'bg-yellow-500';

  div.innerHTML = `
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-3">
        <span class="text-2xl">${getCategoryIcon(budget.category)}</span>
        <div>
          <h4 class="font-bold text-gray-800">${budget.category}</h4>
          <p class="text-sm text-gray-600">$${spent.toLocaleString('es-DO', {minimumFractionDigits: 2})} de $${limit.toLocaleString('es-DO', {minimumFractionDigits: 2})}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-lg font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}">
          $${Math.abs(remaining).toLocaleString('es-DO', {minimumFractionDigits: 2})}
        </p>
        <p class="text-xs text-gray-600">${remaining >= 0 ? 'Disponible' : 'Excedido'}</p>
      </div>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div class="${barColor} h-full rounded-full transition-all" style="width: ${Math.min(percentage, 100)}%"></div>
    </div>
    <div class="flex justify-between items-center mt-2">
      <p class="text-xs text-gray-600">${percentage.toFixed(1)}% usado</p>
      <button class="delete-budget text-xs text-red-600 hover:underline" data-id="${id}">Eliminar</button>
    </div>
  `;

  div.querySelector('.delete-budget')?.addEventListener('click', async () => {
    if (confirm('¿Eliminar este presupuesto?')) {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'budgets', id));
      loadBudgets();
    }
  });

  return div;
}

function getCategoryIcon(category) {
  const icons = {
    'Alimentación': '🍔',
    'Transporte': '🚗',
    'Vivienda': '🏠',
    'Entretenimiento': '🎮',
    'Salud': '⚕️',
    'Educación': '📚',
    'Otros': '📦'
  };
  return icons[category] || '📦';
}

function showAddBudgetModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
  
  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
      <h2 class="text-2xl font-display font-bold text-gray-800 mb-6">🎯 Nuevo Presupuesto</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
          <select id="budget-category" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
            <option value="Alimentación">🍔 Alimentación</option>
            <option value="Transporte">🚗 Transporte</option>
            <option value="Vivienda">🏠 Vivienda</option>
            <option value="Entretenimiento">🎮 Entretenimiento</option>
            <option value="Salud">⚕️ Salud</option>
            <option value="Educación">📚 Educación</option>
            <option value="Otros">📦 Otros</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Límite Mensual (DOP)</label>
          <input type="number" id="budget-limit" placeholder="5000.00" step="0.01" 
                 class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
        </div>

        <div class="flex gap-3 pt-4">
          <button id="cancel-budget" class="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300">
            Cancelar
          </button>
          <button id="save-budget" class="flex-1 py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg">
            Crear
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#cancel-budget').addEventListener('click', () => modal.remove());

  modal.querySelector('#save-budget').addEventListener('click', async () => {
    const category = document.getElementById('budget-category').value;
    const limit = parseFloat(document.getElementById('budget-limit').value);

    if (!limit || limit <= 0) {
      alert('Por favor ingresa un límite válido');
      return;
    }

    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'budgets'), {
        category,
        limit,
        spent: 0,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        createdAt: new Date()
      });

      console.log('✅ Presupuesto creado');
      modal.remove();
      loadBudgets();
    } catch (error) {
      console.error('Error creating budget:', error);
      alert('Error al crear presupuesto: ' + error.message);
    }
  });
}

// ========== REPORTS PAGE ==========
async function renderReportsPage(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <!-- Report Period Selector -->
      <div class="card bg-white rounded-2xl p-6 shadow-lg">
        <h3 class="text-xl font-display font-bold text-gray-800 mb-4">📈 Reportes Financieros</h3>
        
        <div class="flex gap-4 mb-6">
          <select id="report-period" class="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
            <option value="month">Este Mes</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Año</option>
            <option value="all">Todo el Tiempo</option>
          </select>
          <button id="generate-report" class="gradient-primary text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg">
            Generar Reporte
          </button>
          <button id="export-pdf" class="gradient-success text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg">
            📄 Exportar PDF
          </button>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <p class="text-sm text-gray-600 mb-1">Ingresos Totales</p>
            <p id="report-income" class="text-2xl font-bold text-green-600">$0.00</p>
          </div>
          <div class="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
            <p class="text-sm text-gray-600 mb-1">Gastos Totales</p>
            <p id="report-expenses" class="text-2xl font-bold text-red-600">$0.00</p>
          </div>
          <div class="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <p class="text-sm text-gray-600 mb-1">Balance Neto</p>
            <p id="report-balance" class="text-2xl font-bold text-blue-600">$0.00</p>
          </div>
          <div class="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <p class="text-sm text-gray-600 mb-1">Tasa de Ahorro</p>
            <p id="report-savings-rate" class="text-2xl font-bold text-primary">0%</p>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 class="font-bold text-gray-800 mb-3">Tendencia Mensual</h4>
            <div style="position: relative; height: 300px;">
              <canvas id="report-trend-chart"></canvas>
            </div>
          </div>
          <div>
            <h4 class="font-bold text-gray-800 mb-3">Distribución de Gastos</h4>
            <div style="position: relative; height: 300px;">
              <canvas id="report-category-chart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Breakdown -->
      <div class="card bg-white rounded-2xl p-6 shadow-lg">
        <h3 class="text-lg font-display font-bold text-gray-800 mb-4">📊 Desglose por Categoría</h3>
        <div id="category-breakdown" class="space-y-3">
          <p class="text-center text-gray-500 py-8">Genera un reporte para ver el desglose detallado</p>
        </div>
      </div>

      <!-- Top Transactions -->
      <div class="card bg-white rounded-2xl p-6 shadow-lg">
        <h3 class="text-lg font-display font-bold text-gray-800 mb-4">💸 Mayores Gastos</h3>
        <div id="top-transactions" class="space-y-2">
          <p class="text-center text-gray-500 py-8">Genera un reporte para ver tus mayores gastos</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('generate-report')?.addEventListener('click', () => {
    const period = document.getElementById('report-period').value;
    generateReport(period);
  });

  document.getElementById('export-pdf')?.addEventListener('click', () => {
    exportReportToPDF();
  });
}

async function generateReport(period) {
  try {
    const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
    const snapshot = await getDocs(query(transactionsRef, orderBy('date', 'desc')));

    let income = 0;
    let expenses = 0;
    const categoryTotals = {};
    const topExpenses = [];

    snapshot.forEach(doc => {
      const t = doc.data();
      if (t.type === 'income') {
        income += t.amount || 0;
      } else {
        expenses += t.amount || 0;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        topExpenses.push({ description: t.description, amount: t.amount, category: t.category });
      }
    });

    const balance = income - expenses;
    const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

    // Update summary
    document.getElementById('report-income').textContent = 
      `$${income.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
    document.getElementById('report-expenses').textContent = 
      `$${expenses.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
    document.getElementById('report-balance').textContent = 
      `$${balance.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
    document.getElementById('report-savings-rate').textContent = `${savingsRate}%`;

    // Category breakdown
    const breakdownDiv = document.getElementById('category-breakdown');
    breakdownDiv.innerHTML = '';
    Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).forEach(([cat, amt]) => {
      const percentage = ((amt / expenses) * 100).toFixed(1);
      const div = document.createElement('div');
      div.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-xl';
      div.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="text-2xl">${getCategoryIcon(cat)}</span>
          <span class="font-semibold text-gray-800">${cat}</span>
        </div>
        <div class="text-right">
          <p class="font-bold text-gray-800">$${amt.toLocaleString('es-DO', {minimumFractionDigits: 2})}</p>
          <p class="text-xs text-gray-600">${percentage}%</p>
        </div>
      `;
      breakdownDiv.appendChild(div);
    });

    // Top transactions
    const topDiv = document.getElementById('top-transactions');
    topDiv.innerHTML = '';
    topExpenses.sort((a, b) => b.amount - a.amount).slice(0, 10).forEach(t => {
      const div = document.createElement('div');
      div.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-xl';
      div.innerHTML = `
        <div>
          <p class="font-semibold text-gray-800">${t.description}</p>
          <p class="text-sm text-gray-600">${t.category}</p>
        </div>
        <p class="font-bold text-red-600">$${t.amount.toLocaleString('es-DO', {minimumFractionDigits: 2})}</p>
      `;
      topDiv.appendChild(div);
    });

    // Generate charts
    generateReportCharts(categoryTotals);

  } catch (error) {
    console.error('Error generating report:', error);
    alert('Error al generar reporte');
  }
}

function generateReportCharts(categoryTotals) {
  // Trend chart
  const trendCtx = document.getElementById('report-trend-chart');
  if (trendCtx && typeof Chart !== 'undefined') {
    new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
          label: 'Gastos',
          data: [8000, 9000, 8500, 10000, 9500, 11000],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  // Category chart
  const categoryCtx = document.getElementById('report-category-chart');
  if (categoryCtx && typeof Chart !== 'undefined') {
    new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categoryTotals),
        datasets: [{
          data: Object.values(categoryTotals),
          backgroundColor: ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#6b7280', '#8b5cf6']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}

function exportReportToPDF() {
  alert('🚧 Exportación a PDF en desarrollo.\n\nPróximamente podrás exportar tus reportes a PDF para guardar o imprimir.');
}

// ========== PROFILE PAGE ==========
async function renderProfilePage(container) {
  try {
    // Load user preferences from Firestore
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDocs(query(collection(db, 'users')));
    
    let userPreferences = {
      displayName: currentUser.displayName || 'Usuario',
      email: currentUser.email,
      photoURL: currentUser.photoURL || null,
      currency: 'DOP',
      language: 'es',
      notifications: true,
      theme: 'light'
    };

    container.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Profile Header Card -->
        <div class="card bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 shadow-2xl text-white">
          <div class="flex flex-col md:flex-row items-center gap-6">
            <div class="relative">
              <div class="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl shadow-xl">
                ${userPreferences.photoURL 
                  ? `<img src="${userPreferences.photoURL}" class="w-full h-full rounded-full object-cover" />` 
                  : (userPreferences.displayName?.charAt(0).toUpperCase() || '👤')}
              </div>
              <button id="change-avatar-btn" class="absolute bottom-0 right-0 w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                📷
              </button>
            </div>
            <div class="flex-1 text-center md:text-left">
              <h2 class="text-3xl font-display font-bold mb-2">${userPreferences.displayName}</h2>
              <p class="text-white/90 mb-4">${userPreferences.email}</p>
              <div class="flex flex-wrap gap-3 justify-center md:justify-start">
                <span class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                  📅 Miembro desde ${new Date(currentUser.metadata.creationTime).toLocaleDateString('es-DO', { month: 'long', year: 'numeric' })}
                </span>
                <span class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                  ✨ Plan Gratuito
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Profile Form -->
        <div class="card bg-white rounded-2xl p-8 shadow-lg">
          <h3 class="text-xl font-display font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span class="text-2xl">✏️</span>
            Editar Perfil
          </h3>

          <div class="space-y-6">
            <!-- Display Name -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre para mostrar</label>
              <input type="text" id="profile-name" value="${userPreferences.displayName}" 
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors">
              <p class="text-xs text-gray-500 mt-1">Este nombre se mostrará en tu perfil y en la aplicación</p>
            </div>

            <!-- Email (read-only) -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
              <input type="email" value="${userPreferences.email}" disabled
                     class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed">
              <p class="text-xs text-gray-500 mt-1">El email no puede ser modificado por seguridad</p>
            </div>

            <!-- Currency Preference -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Moneda preferida</label>
              <select id="profile-currency" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors">
                <option value="DOP" ${userPreferences.currency === 'DOP' ? 'selected' : ''}>DOP (Peso Dominicano)</option>
                <option value="USD" ${userPreferences.currency === 'USD' ? 'selected' : ''}>USD (Dólar Estadounidense)</option>
                <option value="EUR" ${userPreferences.currency === 'EUR' ? 'selected' : ''}>EUR (Euro)</option>
              </select>
            </div>

            <!-- Language Preference -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Idioma</label>
              <select id="profile-language" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors">
                <option value="es" ${userPreferences.language === 'es' ? 'selected' : ''}>🇩🇴 Español</option>
                <option value="en" ${userPreferences.language === 'en' ? 'selected' : ''}>🇺🇸 English</option>
              </select>
            </div>

            <!-- Notifications Toggle -->
            <div class="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div>
                <p class="font-semibold text-gray-800">🔔 Notificaciones por correo</p>
                <p class="text-sm text-gray-600">Recibe actualizaciones y recordatorios importantes</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="profile-notifications" ${userPreferences.notifications ? 'checked' : ''} class="sr-only peer">
                <div class="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <!-- Save Button -->
            <button id="save-profile-btn" class="w-full py-4 gradient-primary text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <span>💾</span>
              <span>Guardar Cambios</span>
            </button>
          </div>
        </div>

        <!-- Account Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="card bg-white rounded-2xl p-6 shadow-lg text-center">
            <div class="text-4xl mb-2">💳</div>
            <p class="text-3xl font-bold text-primary" id="profile-transactions-count">0</p>
            <p class="text-sm text-gray-600 mt-1">Transacciones registradas</p>
          </div>

          <div class="card bg-white rounded-2xl p-6 shadow-lg text-center">
            <div class="text-4xl mb-2">🏦</div>
            <p class="text-3xl font-bold text-green-600" id="profile-accounts-count">0</p>
            <p class="text-sm text-gray-600 mt-1">Cuentas activas</p>
          </div>

          <div class="card bg-white rounded-2xl p-6 shadow-lg text-center">
            <div class="text-4xl mb-2">🎯</div>
            <p class="text-3xl font-bold text-purple-600" id="profile-budgets-count">0</p>
            <p class="text-sm text-gray-600 mt-1">Presupuestos creados</p>
          </div>

          <div class="card bg-white rounded-2xl p-6 shadow-lg text-center">
            <div class="text-4xl mb-2">🏷️</div>
            <p class="text-3xl font-bold text-orange-600" id="profile-categories-count">0</p>
            <p class="text-sm text-gray-600 mt-1">Categorías personalizadas</p>
          </div>
        </div>

        <!-- Additional Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-bold text-gray-800">💰 Este Mes</h4>
              <span class="text-2xl">📊</span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Ingresos:</span>
                <span class="font-bold text-green-600" id="profile-month-income">$0.00</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Gastos:</span>
                <span class="font-bold text-red-600" id="profile-month-expenses">$0.00</span>
              </div>
              <div class="flex justify-between items-center pt-2 border-t border-gray-300">
                <span class="text-sm font-semibold text-gray-700">Balance:</span>
                <span class="font-bold text-blue-600" id="profile-month-balance">$0.00</span>
              </div>
            </div>
          </div>

          <div class="card bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-bold text-gray-800">📈 Promedios</h4>
              <span class="text-2xl">🔢</span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Transacción promedio:</span>
                <span class="font-bold text-blue-600" id="profile-avg-transaction">$0.00</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Gasto diario:</span>
                <span class="font-bold text-purple-600" id="profile-daily-spending">$0.00</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Categoría más usada:</span>
                <span class="font-bold text-gray-700" id="profile-top-category">-</span>
              </div>
            </div>
          </div>

          <div class="card bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-bold text-gray-800">🎯 Objetivos</h4>
              <span class="text-2xl">⭐</span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Tasa de ahorro:</span>
                <span class="font-bold text-green-600" id="profile-savings-rate">0%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Presupuestos activos:</span>
                <span class="font-bold text-blue-600" id="profile-active-budgets">0</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Días usando app:</span>
                <span class="font-bold text-purple-600" id="profile-days-using">0</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="card bg-white rounded-2xl p-8 shadow-lg border-2 border-red-200">
          <h3 class="text-xl font-display font-bold text-red-600 mb-4 flex items-center gap-2">
            <span class="text-2xl">⚠️</span>
            Zona de Peligro
          </h3>
          
          <div class="space-y-4">
            <div class="p-4 bg-red-50 rounded-xl">
              <h4 class="font-semibold text-gray-800 mb-2">Cerrar sesión</h4>
              <p class="text-sm text-gray-600 mb-3">Sal de tu cuenta de forma segura</p>
              <button id="logout-profile-btn" class="px-6 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-all">
                🚪 Cerrar Sesión
              </button>
            </div>

            <div class="p-4 bg-red-50 rounded-xl">
              <h4 class="font-semibold text-gray-800 mb-2">Eliminar cuenta</h4>
              <p class="text-sm text-gray-600 mb-3">
                Esta acción es permanente e irreversible. Todos tus datos serán eliminados.
              </p>
              <button id="delete-account-btn" class="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all">
                🗑️ Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Load statistics
    await loadProfileStatistics();

    // Event listeners
    document.getElementById('save-profile-btn').addEventListener('click', saveProfileChanges);
    document.getElementById('logout-profile-btn').addEventListener('click', async () => {
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        await signOut(auth);
      }
    });
    document.getElementById('delete-account-btn').addEventListener('click', deleteUserAccount);
    document.getElementById('change-avatar-btn').addEventListener('click', () => {
      alert('🚧 Cambio de avatar en desarrollo.\n\nPróximamente podrás subir tu propia foto de perfil.');
    });

  } catch (error) {
    console.error('Error loading profile:', error);
    container.innerHTML = `
      <div class="text-center py-12">
        <span class="text-6xl block mb-4">⚠️</span>
        <h3 class="text-xl font-bold text-gray-800 mb-2">Error al cargar perfil</h3>
        <p class="text-gray-600">Intenta recargar la página</p>
      </div>
    `;
  }
}

async function loadProfileStatistics() {
  try {
    // Count transactions
    const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
    const transactionsSnapshot = await getDocs(transactionsRef);
    document.getElementById('profile-transactions-count').textContent = transactionsSnapshot.size;

    // Count accounts
    const accountsRef = collection(db, 'users', currentUser.uid, 'accounts');
    const accountsSnapshot = await getDocs(accountsRef);
    document.getElementById('profile-accounts-count').textContent = accountsSnapshot.size;

    // Count budgets
    const budgetsRef = collection(db, 'users', currentUser.uid, 'budgets');
    const budgetsSnapshot = await getDocs(budgetsRef);
    document.getElementById('profile-budgets-count').textContent = budgetsSnapshot.size;

    // Count custom categories
    const customCategories = userCategories.filter(c => c.custom);
    document.getElementById('profile-categories-count').textContent = customCategories.length;

    // Calculate monthly stats
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let monthIncome = 0;
    let monthExpenses = 0;
    let totalAmount = 0;
    let categoryCount = {};

    transactionsSnapshot.forEach(doc => {
      const t = doc.data();
      const tDate = t.date?.toDate ? t.date.toDate() : new Date(t.date?.seconds * 1000);
      
      totalAmount += t.amount || 0;
      
      if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
        if (t.type === 'income') {
          monthIncome += t.amount || 0;
        } else if (t.type === 'expense') {
          monthExpenses += t.amount || 0;
          categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
        }
      }
    });

    const monthBalance = monthIncome - monthExpenses;

    document.getElementById('profile-month-income').textContent = `$${monthIncome.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
    document.getElementById('profile-month-expenses').textContent = `$${monthExpenses.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
    document.getElementById('profile-month-balance').textContent = `$${monthBalance.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;

    // Calculate averages
    const avgTransaction = transactionsSnapshot.size > 0 ? totalAmount / transactionsSnapshot.size : 0;
    const daysInMonth = new Date().getDate();
    const dailySpending = daysInMonth > 0 ? monthExpenses / daysInMonth : 0;

    document.getElementById('profile-avg-transaction').textContent = `$${avgTransaction.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
    document.getElementById('profile-daily-spending').textContent = `$${dailySpending.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;

    // Find top category
    let topCategory = '-';
    let maxCount = 0;
    for (const [cat, count] of Object.entries(categoryCount)) {
      if (count > maxCount) {
        maxCount = count;
        topCategory = cat;
      }
    }
    const categoryObj = userCategories.find(c => c.id === topCategory);
    document.getElementById('profile-top-category').textContent = categoryObj ? `${categoryObj.icon} ${categoryObj.name}` : topCategory;

    // Calculate goals
    const savingsRate = monthIncome > 0 ? ((monthBalance / monthIncome) * 100).toFixed(0) : 0;
    document.getElementById('profile-savings-rate').textContent = `${savingsRate}%`;
    document.getElementById('profile-active-budgets').textContent = budgetsSnapshot.size;

    // Calculate days using app
    const creationDate = new Date(currentUser.metadata.creationTime);
    const daysUsing = Math.floor((new Date() - creationDate) / (1000 * 60 * 60 * 24));
    document.getElementById('profile-days-using').textContent = daysUsing;

  } catch (error) {
    console.error('Error loading statistics:', error);
  }
}

async function saveProfileChanges() {
  try {
    const displayName = document.getElementById('profile-name').value.trim();
    const currency = document.getElementById('profile-currency').value;
    const language = document.getElementById('profile-language').value;
    const notifications = document.getElementById('profile-notifications').checked;

    if (!displayName) {
      alert('❌ El nombre no puede estar vacío');
      return;
    }

    // Update Firebase Auth profile
    const { updateProfile } = await import('firebase/auth');
    await updateProfile(currentUser, {
      displayName: displayName
    });

    // Save preferences to Firestore
    const userPrefsRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userPrefsRef, {
      displayName: displayName,
      currency: currency,
      language: language,
      notifications: notifications,
      updatedAt: new Date()
    }).catch(async (error) => {
      // If document doesn't exist, create it
      if (error.code === 'not-found') {
        const { setDoc } = await import('firebase/firestore');
        await setDoc(userPrefsRef, {
          displayName: displayName,
          email: currentUser.email,
          currency: currency,
          language: language,
          notifications: notifications,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } else {
        throw error;
      }
    });

    alert('✅ Perfil actualizado correctamente');
    
    // Reload page to reflect changes
    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (error) {
    console.error('Error saving profile:', error);
    alert('❌ Error al guardar los cambios: ' + error.message);
  }
}

async function deleteUserAccount() {
  const confirmation = prompt(
    '⚠️ ADVERTENCIA: Esta acción eliminará permanentemente tu cuenta y todos tus datos.\n\n' +
    'Para confirmar, escribe "ELIMINAR" en mayúsculas:'
  );

  if (confirmation !== 'ELIMINAR') {
    alert('❌ Eliminación cancelada');
    return;
  }

  try {
    // Delete all user data from Firestore
    const collections = ['transactions', 'accounts', 'budgets', 'categories'];
    
    for (const collectionName of collections) {
      const collRef = collection(db, 'users', currentUser.uid, collectionName);
      const snapshot = await getDocs(collRef);
      
      const deletePromises = snapshot.docs.map(docSnapshot => 
        deleteDoc(doc(db, 'users', currentUser.uid, collectionName, docSnapshot.id))
      );
      
      await Promise.all(deletePromises);
    }

    // Delete user document
    await deleteDoc(doc(db, 'users', currentUser.uid));

    // Delete Firebase Auth account
    const { deleteUser } = await import('firebase/auth');
    await deleteUser(currentUser);

    alert('✅ Tu cuenta ha sido eliminada correctamente');
    
  } catch (error) {
    console.error('Error deleting account:', error);
    alert('❌ Error al eliminar la cuenta: ' + error.message + '\n\nPor seguridad, es posible que necesites volver a iniciar sesión para completar esta acción.');
  }
}

// ========== MANAGE CATEGORIES MODAL ==========
function showManageCategoriesModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
  
  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-display font-bold text-gray-800">🏷️ Gestionar Categorías</h2>
        <button id="close-categories" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>

      <!-- Add New Category Form -->
      <div class="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
        <h3 class="text-lg font-bold text-gray-800 mb-4">➕ Nueva Categoría</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" id="new-category-name" placeholder="Nombre (ej: Gimnasio)" 
                 class="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
          
          <select id="new-category-icon" class="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
            <option value="🏷️">🏷️ Etiqueta</option>
            <option value="🎯">🎯 Meta</option>
            <option value="💪">💪 Deporte</option>
            <option value="🎨">🎨 Arte</option>
            <option value="🐕">🐕 Mascotas</option>
            <option value="✈️">✈️ Viajes</option>
            <option value="🎁">🎁 Regalos</option>
            <option value="🔧">🔧 Reparaciones</option>
            <option value="📱">📱 Tecnología</option>
            <option value="👗">👗 Ropa</option>
            <option value="🍷">🍷 Restaurantes</option>
            <option value="🎬">🎬 Cine</option>
            <option value="🎵">🎵 Música</option>
            <option value="💅">💅 Belleza</option>
            <option value="🏃">🏃 Fitness</option>
          </select>
          
          <input type="color" id="new-category-color" value="#667eea" 
                 class="h-12 w-full rounded-xl border-2 border-gray-300 cursor-pointer">
          
          <select id="new-category-type" class="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
            <option value="expense">💸 Gasto</option>
            <option value="income">💰 Ingreso</option>
            <option value="both">🔄 Ambos</option>
          </select>
        </div>
        
        <button id="add-category-btn" class="w-full mt-4 py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          ✅ Agregar Categoría
        </button>
      </div>

      <!-- Categories List -->
      <div class="flex-1 overflow-y-auto">
        <h3 class="text-lg font-bold text-gray-800 mb-4">📋 Tus Categorías</h3>
        <div id="categories-list" class="space-y-2">
          <!-- Categories will be loaded here -->
        </div>
      </div>

      <div class="mt-6 flex gap-3">
        <button id="close-categories-btn" class="flex-1 py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          Cerrar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Load categories
  renderCategoriesList();

  // Add category handler
  modal.querySelector('#add-category-btn').addEventListener('click', async () => {
    const name = modal.querySelector('#new-category-name').value.trim();
    const icon = modal.querySelector('#new-category-icon').value;
    const color = modal.querySelector('#new-category-color').value;
    const type = modal.querySelector('#new-category-type').value;

    if (!name) {
      alert('❌ Por favor ingresa un nombre para la categoría');
      return;
    }

    const categoryData = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name: name,
      icon: icon,
      color: color,
      type: type,
      custom: true
    };

    const success = await saveCustomCategory(categoryData);
    if (success) {
      alert('✅ Categoría creada exitosamente');
      modal.querySelector('#new-category-name').value = '';
      renderCategoriesList();
    } else {
      alert('❌ Error al crear la categoría');
    }
  });

  // Close handlers
  modal.querySelector('#close-categories').addEventListener('click', () => modal.remove());
  modal.querySelector('#close-categories-btn').addEventListener('click', () => modal.remove());

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function renderCategoriesList() {
  const listDiv = document.getElementById('categories-list');
  if (!listDiv) return;

  listDiv.innerHTML = '';

  userCategories.forEach(category => {
    const isDefault = DEFAULT_CATEGORIES.find(c => c.id === category.id);
    const typeLabel = category.type === 'expense' ? '💸 Gasto' : category.type === 'income' ? '💰 Ingreso' : '🔄 Ambos';

    const div = document.createElement('div');
    div.className = 'flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all';
    div.innerHTML = `
      <div class="flex items-center gap-3 flex-1">
        <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style="background-color: ${category.color}20;">
          ${category.icon}
        </div>
        <div class="flex-1">
          <p class="font-semibold text-gray-800">${category.name}</p>
          <p class="text-sm text-gray-600">${typeLabel} ${isDefault ? '• Predeterminada' : '• Personalizada'}</p>
        </div>
      </div>
      ${!isDefault ? `
        <button class="delete-category px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-all" data-id="${category.id}">
          🗑️ Eliminar
        </button>
      ` : ''}
    `;

    if (!isDefault) {
      div.querySelector('.delete-category').addEventListener('click', async () => {
        if (confirm(`¿Eliminar la categoría "${category.name}"?`)) {
          const success = await deleteCustomCategory(category.id);
          if (success) {
            alert('✅ Categoría eliminada');
            renderCategoriesList();
          } else {
            alert('❌ Error al eliminar la categoría');
          }
        }
      });
    }

    listDiv.appendChild(div);
  });
}

// ========== NOTIFICATIONS MODAL ==========
function showNotificationsModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
  
  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-display font-bold text-gray-800">🔔 Notificaciones</h2>
        <button id="close-notifications" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>
      
      <div id="notifications-container" class="space-y-4">
        <!-- Notifications will be loaded here dynamically -->
      </div>

      <div class="mt-6 flex gap-3">
        <button id="mark-all-read" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
          Marcar todas como leídas
        </button>
        <button id="close-notifications-btn" class="flex-1 py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          Cerrar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Render notifications
  const container = modal.querySelector('#notifications-container');
  if (notifications.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <span class="text-6xl block mb-4">🔕</span>
        <p class="text-gray-600">No tienes notificaciones nuevas</p>
        <p class="text-sm text-gray-500 mt-2">Te notificaremos sobre eventos importantes</p>
      </div>
    `;
  } else {
    notifications.forEach(notif => {
      const bgColors = {
        'info': 'bg-gradient-to-r from-primary-light to-secondary-light border-primary',
        'warning': 'bg-yellow-50 border-yellow-500',
        'success': 'bg-green-50 border-green-500',
        'error': 'bg-red-50 border-red-500'
      };

      const div = document.createElement('div');
      div.className = `p-4 rounded-xl border-l-4 ${bgColors[notif.type] || bgColors.info}`;
      div.innerHTML = `
        <div class="flex items-start gap-3">
          <span class="text-2xl">${notif.icon}</span>
          <div class="flex-1">
            <p class="font-semibold text-gray-800">${notif.title}</p>
            <p class="text-sm text-gray-600 mt-1">${notif.message}</p>
            <p class="text-xs text-gray-500 mt-2">${notif.time}</p>
          </div>
          <button class="text-gray-400 hover:text-gray-600" data-id="${notif.id}">✕</button>
        </div>
      `;

      div.querySelector('button').addEventListener('click', () => {
        markNotificationAsRead(notif.id);
        div.remove();
        if (container.children.length === 0) {
          container.innerHTML = `
            <div class="text-center py-12">
              <span class="text-6xl block mb-4">🔕</span>
              <p class="text-gray-600">No tienes notificaciones nuevas</p>
            </div>
          `;
        }
      });

      container.appendChild(div);
    });
  }

  // Close handlers
  modal.querySelector('#close-notifications').addEventListener('click', () => modal.remove());
  modal.querySelector('#close-notifications-btn').addEventListener('click', () => modal.remove());
  modal.querySelector('#mark-all-read').addEventListener('click', () => {
    alert('✅ Todas las notificaciones marcadas como leídas');
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// ========== SETTINGS MODAL ==========
function showSettingsModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
  
  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-display font-bold text-gray-800">⚙️ Configuración</h2>
        <button id="close-settings" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>
      
      <div class="space-y-6">
        <!-- Profile Section -->
        <div class="pb-6 border-b border-gray-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4">👤 Perfil</h3>
          <div class="flex items-center gap-4 mb-4">
            <div class="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-3xl text-white shadow-lg">
              ${currentUser?.displayName?.charAt(0).toUpperCase() || '👤'}
            </div>
            <div class="flex-1">
              <p class="font-bold text-gray-800">${currentUser?.displayName || 'Usuario'}</p>
              <p class="text-sm text-gray-600">${currentUser?.email || 'email@ejemplo.com'}</p>
              <button class="text-primary hover:text-primary-dark text-sm font-semibold mt-1">Editar perfil</button>
            </div>
          </div>
        </div>

        <!-- Preferences Section -->
        <div class="pb-6 border-b border-gray-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4">🎨 Preferencias</h3>
          
          <div class="space-y-4">
            <!-- Currency -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-gray-800">Moneda principal</p>
                <p class="text-sm text-gray-600">Moneda por defecto para mostrar</p>
              </div>
              <select class="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
                <option value="DOP" selected>DOP (Peso Dominicano)</option>
                <option value="USD">USD (Dólar)</option>
                <option value="EUR">EUR (Euro)</option>
              </select>
            </div>

            <!-- Language -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-gray-800">🌐 ${t('language')}</p>
                <p class="text-sm text-gray-600">Idioma de la interfaz</p>
              </div>
              <select id="language-select" class="px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none">
                <option value="es" ${currentLanguage === 'es' ? 'selected' : ''}>🇩🇴 Español</option>
                <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>🇺🇸 English</option>
              </select>
            </div>

            <!-- Dark Mode -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-gray-800">🌙 ${t('darkMode')}</p>
                <p class="text-sm text-gray-600">Tema oscuro para la interfaz</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" id="dark-mode-toggle" ${isDarkMode ? 'checked' : ''}>
                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <!-- Notifications -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-gray-800">Notificaciones</p>
                <p class="text-sm text-gray-600">Recibir notificaciones de la app</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked id="notifications-toggle">
                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Security Section -->
        <div class="pb-6 border-b border-gray-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4">🔒 Seguridad</h3>
          <div class="space-y-3">
            <button class="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
              <p class="font-semibold text-gray-800">Cambiar contraseña</p>
              <p class="text-sm text-gray-600">Actualiza tu contraseña</p>
            </button>
            <button class="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
              <p class="font-semibold text-gray-800">Autenticación de dos factores</p>
              <p class="text-sm text-gray-600">Añade una capa extra de seguridad</p>
            </button>
            <button class="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
              <p class="font-semibold text-gray-800">Sesiones activas</p>
              <p class="text-sm text-gray-600">Gestiona tus dispositivos conectados</p>
            </button>
          </div>
        </div>

        <!-- Data Section -->
        <div class="pb-6 border-b border-gray-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4">💾 Datos</h3>
          <div class="space-y-3">
            <button id="export-json-btn" class="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border-2 border-blue-200">
              <p class="font-semibold text-blue-800">📥 Exportar datos (JSON)</p>
              <p class="text-sm text-blue-600">Descarga todos tus datos en formato JSON</p>
            </button>
            <button id="export-csv-btn" class="w-full p-4 text-left bg-green-50 hover:bg-green-100 rounded-xl transition-all border-2 border-green-200">
              <p class="font-semibold text-green-800">📊 Exportar transacciones (CSV)</p>
              <p class="text-sm text-green-600">Descarga tus transacciones en formato CSV para Excel</p>
            </button>
            <button id="delete-account-settings-btn" class="w-full p-4 text-left bg-red-50 hover:bg-red-100 rounded-xl transition-all border-2 border-red-200">
              <p class="font-semibold text-red-800">🗑️ Eliminar cuenta</p>
              <p class="text-sm text-red-600">Elimina permanentemente tu cuenta y datos</p>
            </button>
          </div>
        </div>

        <!-- About Section -->
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-4">ℹ️ Acerca de</h3>
          <div class="space-y-2 text-sm text-gray-600">
            <p><strong>Versión:</strong> 1.0.0</p>
            <p><strong>Desarrollador:</strong> BlackSpaces0</p>
            <p><strong>Licencia:</strong> MIT</p>
            <div class="flex gap-4 mt-3">
              <a href="#" class="text-primary hover:text-primary-dark font-semibold">Términos de Servicio</a>
              <a href="#" class="text-primary hover:text-primary-dark font-semibold">Política de Privacidad</a>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex gap-3">
        <button id="save-settings" class="flex-1 py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          💾 Guardar Cambios
        </button>
        <button id="close-settings-btn" class="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all">
          Cerrar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close handlers
  modal.querySelector('#close-settings').addEventListener('click', () => modal.remove());
  modal.querySelector('#close-settings-btn').addEventListener('click', () => modal.remove());
  modal.querySelector('#save-settings').addEventListener('click', () => {
    alert('✅ Configuración guardada correctamente');
    modal.remove();
  });

  // Language selector
  modal.querySelector('#language-select').addEventListener('change', (e) => {
    changeLanguage(e.target.value);
  });

  // Dark mode toggle
  modal.querySelector('#dark-mode-toggle').addEventListener('change', (e) => {
    toggleDarkMode(e.target.checked);
  });

  // Notifications toggle
  modal.querySelector('#notifications-toggle').addEventListener('change', (e) => {
    if (e.target.checked) {
      alert('🔔 Notificaciones activadas');
    } else {
      alert('🔕 Notificaciones desactivadas');
    }
  });

  // Export buttons
  modal.querySelector('#export-json-btn').addEventListener('click', () => {
    modal.remove();
    exportDataToJSON();
  });

  modal.querySelector('#export-csv-btn').addEventListener('click', () => {
    modal.remove();
    exportDataToCSV();
  });

  modal.querySelector('#delete-account-settings-btn').addEventListener('click', () => {
    modal.remove();
    deleteUserAccount();
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// ========== TERMS OF SERVICE MODAL ==========
function showTermsModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
  
  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-display font-bold text-gray-800">📜 Términos de Servicio</h2>
        <button id="close-terms" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>
      
      <div class="overflow-y-auto flex-1 prose prose-sm max-w-none pr-2">
        <iframe src="./TERMS_OF_SERVICE.md" class="w-full h-full min-h-[600px] border-0"></iframe>
      </div>

      <div class="mt-6 flex gap-3">
        <button id="download-terms" class="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all">
          📥 Descargar PDF
        </button>
        <button id="close-terms-btn" class="flex-1 py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          Cerrar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close handlers
  modal.querySelector('#close-terms').addEventListener('click', () => modal.remove());
  modal.querySelector('#close-terms-btn').addEventListener('click', () => modal.remove());
  modal.querySelector('#download-terms').addEventListener('click', () => {
    window.open('./TERMS_OF_SERVICE.md', '_blank');
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// ========== PRIVACY POLICY MODAL ==========
function showPrivacyModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
  
  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-display font-bold text-gray-800">🔒 Política de Privacidad</h2>
        <button id="close-privacy" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>
      
      <div class="overflow-y-auto flex-1 prose prose-sm max-w-none pr-2">
        <iframe src="./PRIVACY_POLICY.md" class="w-full h-full min-h-[600px] border-0"></iframe>
      </div>

      <div class="mt-6 flex gap-3">
        <button id="download-privacy" class="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all">
          📥 Descargar PDF
        </button>
        <button id="close-privacy-btn" class="flex-1 py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          Cerrar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close handlers
  modal.querySelector('#close-privacy').addEventListener('click', () => modal.remove());
  modal.querySelector('#close-privacy-btn').addEventListener('click', () => modal.remove());
  modal.querySelector('#download-privacy').addEventListener('click', () => {
    window.open('./PRIVACY_POLICY.md', '_blank');
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// ========== WELCOME MODAL FOR NEW USERS ==========
function showWelcomeModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4';
  
  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-dark shadow-2xl mb-4">
          <span class="text-6xl">🦊</span>
        </div>
        <h2 class="text-3xl font-display font-bold text-gray-800 mb-2">¡Bienvenido a Zenko Financial!</h2>
        <p class="text-lg text-gray-600">Tu plataforma de gestión financiera personal</p>
      </div>
      
      <div class="space-y-6 mb-8">
        <!-- Feature 1 -->
        <div class="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl">
          <div class="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl">
            💰
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-800 mb-1">Gestión de Cuentas y Transacciones</h3>
            <p class="text-sm text-gray-600">Administra todas tus cuentas bancarias y registra cada transacción de manera sencilla.</p>
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="flex items-start gap-4 p-4 bg-green-50 rounded-2xl">
          <div class="flex-shrink-0 w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-2xl">
            🎯
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-800 mb-1">Presupuestos Inteligentes</h3>
            <p class="text-sm text-gray-600">Crea presupuestos personalizados con la regla 50/30/20 y alcanza tus metas financieras.</p>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="flex items-start gap-4 p-4 bg-purple-50 rounded-2xl">
          <div class="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-2xl">
            📊
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-800 mb-1">Reportes y Análisis</h3>
            <p class="text-sm text-gray-600">Visualiza tu flujo de efectivo, tendencias de gastos y toma decisiones informadas.</p>
          </div>
        </div>

        <!-- Feature 4 -->
        <div class="flex items-start gap-4 p-4 bg-yellow-50 rounded-2xl">
          <div class="flex-shrink-0 w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-2xl">
            📚
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-800 mb-1">Educación Financiera</h3>
            <p class="text-sm text-gray-600">Aprende sobre finanzas personales, calculadoras y marco legal dominicano.</p>
          </div>
        </div>
      </div>

      <div class="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
        <div class="flex items-start gap-3 mb-4">
          <span class="text-3xl">🔒</span>
          <div class="flex-1">
            <h3 class="font-bold text-gray-800 mb-2">Tu privacidad es importante</h3>
            <p class="text-sm text-gray-600 mb-3">
              Zenko Financial utiliza Firebase para almacenar tus datos de forma segura. 
              No compartimos tu información con terceros y cumplimos con la Ley 172-13 de República Dominicana.
            </p>
            <div class="flex gap-4 text-sm">
              <button onclick="window.showTermsModal()" class="text-primary hover:text-primary-dark font-semibold">
                📜 Términos de Servicio
              </button>
              <button onclick="window.showPrivacyModal()" class="text-primary hover:text-primary-dark font-semibold">
                🔒 Política de Privacidad
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <button id="start-tour" class="w-full py-4 gradient-primary text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all">
          🚀 Comenzar Tour Guiado
        </button>
        <button id="skip-welcome" class="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
          Saltar y explorar por mi cuenta
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Handlers
  modal.querySelector('#start-tour').addEventListener('click', () => {
    modal.remove();
    startGuidedTour();
  });

  modal.querySelector('#skip-welcome').addEventListener('click', () => {
    modal.remove();
  });

  // Prevent closing on backdrop click for welcome modal (user must interact)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      // Don't close - user must choose an option
    }
  });
}

// Check if user is new and show welcome modal
function checkAndShowWelcome() {
  if (currentUser && localStorage.getItem(`newUser_${currentUser.uid}`) === 'true') {
    // Small delay to let dashboard render first
    setTimeout(() => {
      showWelcomeModal();
      // Remove flag so modal doesn't show again
      localStorage.removeItem(`newUser_${currentUser.uid}`);
    }, 500);
  }
}

// ========== DARK MODE FUNCTIONALITY ==========
function toggleDarkMode(enabled) {
  isDarkMode = enabled;
  localStorage.setItem('darkMode', enabled);
  
  if (enabled) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
}

function applyDarkMode() {
  if (isDarkMode) {
    document.documentElement.classList.add('dark-mode');
  }
}

// ========== GUIDED TOUR FUNCTIONALITY ==========
function startGuidedTour() {
  tourStep = 0;
  showTourStep();
}

function showTourStep() {
  const steps = [
    {
      element: '.nav-item[data-page="dashboard"]',
      title: '📊 Dashboard',
      description: 'Aquí verás un resumen de todas tus finanzas: balance total, ingresos, gastos y gráficos.'
    },
    {
      element: '.nav-item[data-page="transactions"]',
      title: '💳 Transacciones',
      description: 'Registra todos tus ingresos y gastos. Puedes filtrar por categoría, tipo y fecha.'
    },
    {
      element: '.nav-item[data-page="accounts"]',
      title: '🏦 Cuentas',
      description: 'Crea y administra tus cuentas bancarias, tarjetas de crédito y carteras.'
    },
    {
      element: '.nav-item[data-page="budget"]',
      title: '🎯 Presupuesto',
      description: 'Establece presupuestos mensuales usando la regla 50/30/20 o crea presupuestos personalizados.'
    },
    {
      element: '#notifications-btn',
      title: '🔔 Notificaciones',
      description: 'Recibe alertas sobre presupuestos, pagos pendientes y consejos financieros.'
    },
    {
      element: '#settings-btn',
      title: '⚙️ Configuración',
      description: 'Personaliza tu experiencia: moneda, idioma, modo oscuro y más.'
    }
  ];

  if (tourStep >= steps.length) {
    endTour();
    return;
  }

  const step = steps[tourStep];
  const targetElement = document.querySelector(step.element);
  
  if (!targetElement) {
    tourStep++;
    showTourStep();
    return;
  }

  // Create tour overlay
  const overlay = document.createElement('div');
  overlay.id = 'tour-overlay';
  overlay.className = 'fixed inset-0 bg-black/60 z-[100] flex items-center justify-center';
  
  const rect = targetElement.getBoundingClientRect();
  
  overlay.innerHTML = `
    <div class="absolute" style="top: ${rect.top}px; left: ${rect.left}px; width: ${rect.width}px; height: ${rect.height}px; box-shadow: 0 0 0 4px #667eea, 0 0 0 9999px rgba(0,0,0,0.6); z-index: 101; pointer-events: none; border-radius: 12px;"></div>
    
    <div class="absolute bg-white rounded-2xl p-6 shadow-2xl max-w-sm" style="top: ${rect.bottom + 20}px; left: ${Math.max(20, rect.left)}px; z-index: 102;">
      <h3 class="text-xl font-bold text-gray-800 mb-3">${step.title}</h3>
      <p class="text-gray-600 mb-4">${step.description}</p>
      
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">Paso ${tourStep + 1} de ${steps.length}</span>
        <div class="flex gap-2">
          <button id="skip-tour" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all">
            Saltar
          </button>
          <button id="next-tour" class="px-4 py-2 gradient-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all">
            ${tourStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#next-tour').addEventListener('click', () => {
    overlay.remove();
    tourStep++;
    showTourStep();
  });

  overlay.querySelector('#skip-tour').addEventListener('click', () => {
    overlay.remove();
    endTour();
  });
}

function endTour() {
  alert('✅ ¡Tour completado! Ya puedes empezar a usar Zenko Financial.');
  localStorage.setItem(`tourCompleted_${currentUser.uid}`, 'true');
}

// ========== DATA EXPORT FUNCTIONALITY ==========
async function exportDataToJSON() {
  try {
    const data = {
      exportDate: new Date().toISOString(),
      user: {
        email: currentUser.email,
        displayName: currentUser.displayName
      },
      transactions: [],
      accounts: [],
      budgets: [],
      categories: userCategories
    };

    // Export transactions
    const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
    const transactionsSnapshot = await getDocs(transactionsRef);
    transactionsSnapshot.forEach(doc => {
      const transaction = doc.data();
      data.transactions.push({
        id: doc.id,
        ...transaction,
        date: transaction.date?.toDate ? transaction.date.toDate().toISOString() : transaction.date
      });
    });

    // Export accounts
    const accountsRef = collection(db, 'users', currentUser.uid, 'accounts');
    const accountsSnapshot = await getDocs(accountsRef);
    accountsSnapshot.forEach(doc => {
      data.accounts.push({ id: doc.id, ...doc.data() });
    });

    // Export budgets
    const budgetsRef = collection(db, 'users', currentUser.uid, 'budgets');
    const budgetsSnapshot = await getDocs(budgetsRef);
    budgetsSnapshot.forEach(doc => {
      data.budgets.push({ id: doc.id, ...doc.data() });
    });

    // Create download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zenko-financial-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('✅ Datos exportados correctamente');
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('❌ Error al exportar datos: ' + error.message);
  }
}

async function exportDataToCSV() {
  try {
    // Export transactions to CSV
    const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
    const transactionsSnapshot = await getDocs(query(transactionsRef, orderBy('date', 'desc')));
    
    let csv = 'Fecha,Tipo,Descripción,Monto,Categoría\n';
    
    transactionsSnapshot.forEach(doc => {
      const t = doc.data();
      const date = t.date?.toDate ? t.date.toDate().toLocaleDateString('es-DO') : t.date;
      csv += `"${date}","${t.type}","${t.description}",${t.amount},"${t.category}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zenko-transacciones-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('✅ Transacciones exportadas a CSV');
  } catch (error) {
    console.error('Error exporting CSV:', error);
    alert('❌ Error al exportar CSV: ' + error.message);
  }
}

// ========== IN-APP NOTIFICATIONS ==========
let notifications = [];

async function loadNotifications() {
  try {
    notifications = []; // Clear previous notifications
    const now = new Date();

    // 1. Welcome notification for new users
    if (!localStorage.getItem(`welcomed_${currentUser.uid}`)) {
      notifications.push({
        id: 'welcome',
        type: 'info',
        icon: '🎉',
        title: '¡Bienvenido a Zenko Financial!',
        message: 'Empieza creando tus cuentas y registrando transacciones.',
        time: 'Ahora',
        priority: 1
      });
      localStorage.setItem(`welcomed_${currentUser.uid}`, 'true');
    }

    // 2. Check budget alerts (85%+ spent)
    const budgetsRef = collection(db, 'users', currentUser.uid, 'budgets');
    const budgetsSnapshot = await getDocs(budgetsRef);
    
    budgetsSnapshot.forEach(doc => {
      const budget = doc.data();
      const percentage = Math.round((budget.spent / budget.amount) * 100);
      
      if (percentage >= 100) {
        notifications.push({
          id: `budget-exceeded-${doc.id}`,
          type: 'error',
          icon: '🚨',
          title: `¡Presupuesto excedido! ${percentage}%`,
          message: `Tu presupuesto de "${budget.name}" ha superado el límite establecido.`,
          time: 'Hace 30 min',
          priority: 1
        });
      } else if (percentage >= 85) {
        notifications.push({
          id: `budget-warning-${doc.id}`,
          type: 'warning',
          icon: '⚠️',
          title: `Presupuesto al ${percentage}%`,
          message: `Tu presupuesto de "${budget.name}" está cerca del límite.`,
          time: 'Hace 1 hora',
          priority: 2
        });
      }
    });

    // 3. Check for accounts with low balance (<$100)
    const accountsRef = collection(db, 'users', currentUser.uid, 'accounts');
    const accountsSnapshot = await getDocs(accountsRef);
    
    accountsSnapshot.forEach(doc => {
      const account = doc.data();
      if (account.balance < 100 && account.balance > 0) {
        notifications.push({
          id: `low-balance-${doc.id}`,
          type: 'warning',
          icon: '💰',
          title: 'Saldo bajo en cuenta',
          message: `Tu cuenta "${account.name}" tiene un saldo de $${account.balance.toFixed(2)}.`,
          time: 'Hace 2 horas',
          priority: 3
        });
      }
    });

    // 4. Check for recent large expenses (>$1000 in last 7 days)
    const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentTransactions = await getDocs(query(transactionsRef, orderBy('date', 'desc')));
    
    let largeExpenses = [];
    recentTransactions.forEach(doc => {
      const t = doc.data();
      const tDate = t.date?.toDate ? t.date.toDate() : new Date(t.date?.seconds * 1000);
      
      if (t.type === 'expense' && t.amount >= 1000 && tDate >= sevenDaysAgo) {
        largeExpenses.push(t);
      }
    });

    if (largeExpenses.length > 0) {
      const totalLarge = largeExpenses.reduce((sum, t) => sum + t.amount, 0);
      notifications.push({
        id: 'large-expenses',
        type: 'info',
        icon: '📊',
        title: 'Gastos grandes detectados',
        message: `Has realizado ${largeExpenses.length} transacción(es) mayor(es) a $1,000 ($${totalLarge.toLocaleString('es-DO')} total) en la última semana.`,
        time: 'Hace 3 horas',
        priority: 3
      });
    }

    // 5. Monthly savings goal notification
    const totalIncome = await calculateMonthlyIncome();
    const totalExpenses = await calculateMonthlyExpenses();
    const savings = totalIncome - totalExpenses;
    const savingsPercentage = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    if (savingsPercentage > 20) {
      notifications.push({
        id: 'good-savings',
        type: 'success',
        icon: '🎯',
        title: '¡Excelente ahorro!',
        message: `Estás ahorrando ${savingsPercentage.toFixed(0)}% de tus ingresos este mes. ¡Sigue así!`,
        time: 'Hace 5 horas',
        priority: 4
      });
    } else if (savingsPercentage < 10 && totalIncome > 0) {
      notifications.push({
        id: 'low-savings',
        type: 'warning',
        icon: '💡',
        title: 'Bajo nivel de ahorro',
        message: `Solo estás ahorrando ${savingsPercentage.toFixed(0)}% de tus ingresos. Considera reducir gastos.`,
        time: 'Hace 6 horas',
        priority: 3
      });
    }

    // 6. Financial tips (rotate daily)
    const tips = [
      '"El mejor momento para empezar a ahorrar fue ayer. El segundo mejor momento es hoy."',
      '"Un presupuesto es decirle a tu dinero a dónde ir en lugar de preguntarte a dónde fue."',
      '"No ahorres lo que queda después de gastar, gasta lo que queda después de ahorrar."',
      '"La inversión en conocimiento paga el mejor interés." - Benjamin Franklin',
      '"El dinero es un buen sirviente, pero un mal amo." - Francis Bacon'
    ];
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const tipIndex = dayOfYear % tips.length;

    notifications.push({
      id: 'daily-tip',
      type: 'success',
      icon: '💡',
      title: 'Consejo financiero del día',
      message: tips[tipIndex],
      time: 'Hace 8 horas',
      priority: 5
    });

    // Sort by priority (lower number = higher priority)
    notifications.sort((a, b) => (a.priority || 999) - (b.priority || 999));

    // Update notification indicator
    updateNotificationIndicator();
  } catch (error) {
    console.error('Error loading notifications:', error);
  }
}

async function calculateMonthlyIncome() {
  try {
    const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
    const snapshot = await getDocs(transactionsRef);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    let total = 0;
    snapshot.forEach(doc => {
      const t = doc.data();
      const tDate = t.date?.toDate ? t.date.toDate() : new Date(t.date?.seconds * 1000);
      if (t.type === 'income' && tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
        total += t.amount || 0;
      }
    });
    return total;
  } catch (error) {
    return 0;
  }
}

async function calculateMonthlyExpenses() {
  try {
    const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
    const snapshot = await getDocs(transactionsRef);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    let total = 0;
    snapshot.forEach(doc => {
      const t = doc.data();
      const tDate = t.date?.toDate ? t.date.toDate() : new Date(t.date?.seconds * 1000);
      if (t.type === 'expense' && tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
        total += t.amount || 0;
      }
    });
    return total;
  } catch (error) {
    return 0;
  }
}

function updateNotificationIndicator() {
  const indicator = document.querySelector('#notifications-btn .bg-red-500');
  if (indicator) {
    indicator.style.display = notifications.length > 0 ? 'block' : 'none';
  }
}

function markNotificationAsRead(notificationId) {
  notifications = notifications.filter(n => n.id !== notificationId);
  updateNotificationIndicator();
}

// Make functions available globally
window.navigateTo = navigateTo;
window.showTermsModal = showTermsModal;
window.showPrivacyModal = showPrivacyModal;
window.showWelcomeModal = showWelcomeModal;
window.toggleDarkMode = toggleDarkMode;
window.startGuidedTour = startGuidedTour;
window.exportDataToJSON = exportDataToJSON;
window.exportDataToCSV = exportDataToCSV;
