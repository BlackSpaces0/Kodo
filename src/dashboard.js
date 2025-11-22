// Dashboard component for Zenko Financial
import { auth, db } from './main.js';
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, getDocs, deleteDoc, doc } from 'firebase/firestore';

export function renderDashboard(user) {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <!-- Header -->
      <header style="background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); box-shadow: 0 2px 20px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="font-size: 2rem;">🦊</span>
            <div>
              <h1 style="margin: 0; font-size: 1.5rem; color: #667eea; font-weight: 700;">Zenko Financial</h1>
              <p style="margin: 0; font-size: 0.875rem; color: #666;">Claridad Estratégica</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 1.5rem;">
            <div style="text-align: right;">
              <p style="margin: 0; font-size: 0.875rem; color: #666;">Bienvenido</p>
              <p style="margin: 0; font-weight: 600; color: #333;">${user.email}</p>
            </div>
            <button id="logout-btn" style="padding: 0.5rem 1.5rem; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.2s;">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main style="max-width: 1200px; margin: 0 auto; padding: 2rem;">
        <!-- Balance Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <!-- Total Balance Card -->
          <div style="background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
              <h3 style="margin: 0; color: #666; font-size: 0.875rem; font-weight: 600;">Balance Total</h3>
              <span style="font-size: 1.5rem;">💰</span>
            </div>
            <p style="margin: 0; font-size: 2rem; font-weight: 700; color: #333;" id="total-balance">$0.00</p>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.75rem; color: #10b981;">+0% este mes</p>
          </div>

          <!-- Income Card -->
          <div style="background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
              <h3 style="margin: 0; color: #666; font-size: 0.875rem; font-weight: 600;">Ingresos</h3>
              <span style="font-size: 1.5rem;">📈</span>
            </div>
            <p style="margin: 0; font-size: 2rem; font-weight: 700; color: #10b981;" id="total-income">$0.00</p>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.75rem; color: #666;">Este mes</p>
          </div>

          <!-- Expenses Card -->
          <div style="background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
              <h3 style="margin: 0; color: #666; font-size: 0.875rem; font-weight: 600;">Gastos</h3>
              <span style="font-size: 1.5rem;">📉</span>
            </div>
            <p style="margin: 0; font-size: 2rem; font-weight: 700; color: #ef4444;" id="total-expenses">$0.00</p>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.75rem; color: #666;">Este mes</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div style="background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin-bottom: 2rem;">
          <h2 style="margin: 0 0 1.5rem 0; color: #333; font-size: 1.25rem; font-weight: 700;">Acciones Rápidas</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <button id="add-account-btn" style="padding: 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <span style="font-size: 1.25rem;">🏦</span>
              Añadir Cuenta
            </button>
            <button id="add-transaction-btn" style="padding: 1rem; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <span style="font-size: 1.25rem;">💸</span>
              Nueva Transacción
            </button>
            <button id="view-reports-btn" style="padding: 1rem; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <span style="font-size: 1.25rem;">📊</span>
              Ver Reportes
            </button>
          </div>
        </div>

        <!-- Accounts List -->
        <div style="background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <h2 style="margin: 0 0 1.5rem 0; color: #333; font-size: 1.25rem; font-weight: 700;">Mis Cuentas</h2>
          <div id="accounts-list" style="display: flex; flex-direction: column; gap: 1rem;">
            <p style="color: #666; text-align: center; padding: 2rem;">No tienes cuentas aún. ¡Crea tu primera cuenta!</p>
          </div>
        </div>
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

  document.getElementById('add-account-btn').addEventListener('click', () => {
    showAddAccountModal(user);
  });

  document.getElementById('add-transaction-btn').addEventListener('click', () => {
    alert('Función de transacciones en desarrollo');
  });

  document.getElementById('view-reports-btn').addEventListener('click', () => {
    alert('Función de reportes en desarrollo');
  });

  // Load accounts
  loadAccounts(user);
}

async function loadAccounts(user) {
  const accountsList = document.getElementById('accounts-list');
  
  try {
    const accountsRef = collection(db, 'users', user.uid, 'accounts');
    const q = query(accountsRef);
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      accountsList.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">No tienes cuentas aún. ¡Crea tu primera cuenta!</p>';
      return;
    }

    accountsList.innerHTML = '';
    let totalBalance = 0;

    querySnapshot.forEach((doc) => {
      const account = doc.data();
      totalBalance += account.balance || 0;
      
      const accountCard = document.createElement('div');
      accountCard.style.cssText = 'padding: 1.5rem; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; cursor: pointer;';
      accountCard.onmouseover = () => accountCard.style.transform = 'translateX(4px)';
      accountCard.onmouseout = () => accountCard.style.transform = 'translateX(0)';
      
      accountCard.innerHTML = `
        <div>
          <h3 style="margin: 0 0 0.5rem 0; color: #0284c7; font-weight: 700;">${account.name}</h3>
          <p style="margin: 0; color: #666; font-size: 0.875rem;">${account.type || 'Cuenta corriente'} • ${account.currency || 'DOP'}</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; font-size: 1.5rem; font-weight: 700; color: #0284c7;">$${(account.balance || 0).toLocaleString('es-DO', {minimumFractionDigits: 2})}</p>
          <button class="delete-account" data-id="${doc.id}" style="margin-top: 0.5rem; padding: 0.25rem 0.75rem; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 0.75rem; cursor: pointer;">Eliminar</button>
        </div>
      `;
      
      accountsList.appendChild(accountCard);
    });

    // Update total balance
    document.getElementById('total-balance').textContent = `$${totalBalance.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;

    // Add delete listeners
    document.querySelectorAll('.delete-account').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const accountId = e.target.dataset.id;
        if (confirm('¿Estás seguro de eliminar esta cuenta?')) {
          await deleteDoc(doc(db, 'users', user.uid, 'accounts', accountId));
          loadAccounts(user);
        }
      });
    });

  } catch (error) {
    console.error('Error al cargar cuentas:', error);
    accountsList.innerHTML = '<p style="color: #ef4444; text-align: center; padding: 2rem;">Error al cargar cuentas</p>';
  }
}

function showAddAccountModal(user) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';
  
  modal.innerHTML = `
    <div style="background: white; border-radius: 16px; padding: 2rem; max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
      <h2 style="margin: 0 0 1.5rem 0; color: #333;">🏦 Nueva Cuenta</h2>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #666;">Nombre de la cuenta:</label>
        <input type="text" id="account-name" placeholder="Ej: Cuenta Principal" style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
      </div>

      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #666;">Balance inicial:</label>
        <input type="number" id="account-balance" placeholder="0.00" step="0.01" style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
      </div>

      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #666;">Moneda:</label>
        <select id="account-currency" style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; box-sizing: border-box;">
          <option value="DOP">DOP - Peso Dominicano</option>
          <option value="USD">USD - Dólar</option>
          <option value="EUR">EUR - Euro</option>
        </select>
      </div>

      <div style="display: flex; gap: 1rem;">
        <button id="cancel-btn" style="flex: 1; padding: 0.75rem; background: #e5e7eb; color: #333; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Cancelar</button>
        <button id="save-account-btn" style="flex: 1; padding: 0.75rem; background: #667eea; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Guardar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#cancel-btn').addEventListener('click', () => modal.remove());
  
  modal.querySelector('#save-account-btn').addEventListener('click', async () => {
    const name = document.getElementById('account-name').value.trim();
    const balance = parseFloat(document.getElementById('account-balance').value) || 0;
    const currency = document.getElementById('account-currency').value;

    if (!name) {
      alert('Por favor ingresa un nombre para la cuenta');
      return;
    }

    try {
      await addDoc(collection(db, 'users', user.uid, 'accounts'), {
        name,
        balance,
        currency,
        type: 'checking',
        createdAt: new Date()
      });

      console.log('✅ Cuenta creada exitosamente');
      modal.remove();
      loadAccounts(user);
    } catch (error) {
      console.error('Error al crear cuenta:', error);
      alert('Error al crear la cuenta: ' + error.message);
    }
  });
}
