// Entrada principal (Vite + Firebase modular)
// Importa tu CSS/Tailwind si lo configuras o usa CDN en index.html
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Carga la config desde variables de entorno (Vite expone VITE_*)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validar que las variables de entorno están configuradas
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('⚠️ Firebase config missing! Please create .env.local with your Firebase credentials.');
  console.error('See .env.example for the required variables.');
}

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ========== UI BÁSICA DE AUTENTICACIÓN ==========

function initUI() {
  const appDiv = document.getElementById('app');
  
  appDiv.innerHTML = `
    <div style="max-width: 600px; margin: 50px auto; padding: 20px; font-family: system-ui, sans-serif;">
      <h1 style="text-align: center; color: #1a73e8;">🔐 Zenko Financial Auth</h1>
      
      <div id="auth-status" style="padding: 15px; margin: 20px 0; border-radius: 8px; background: #f5f5f5;">
        <p style="margin: 0;">Estado: <strong id="status-text">Cargando...</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;" id="user-email"></p>
      </div>

      <!-- Login con Google -->
      <div id="google-login-section" style="margin: 20px 0;">
        <button id="google-login-btn" style="width: 100%; padding: 12px; background: #4285f4; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
          <span>🔑</span> Iniciar sesión con Google
        </button>
      </div>

      <div style="text-align: center; margin: 20px 0; color: #999;">─── o ───</div>

      <!-- Login con Email/Password -->
      <div id="email-login-section">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Email:</label>
          <input type="email" id="email-input" placeholder="tu@email.com" 
                 style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Contraseña:</label>
          <input type="password" id="password-input" placeholder="••••••••" 
                 style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
        </div>
        <div style="display: flex; gap: 10px;">
          <button id="login-btn" style="flex: 1; padding: 10px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Iniciar sesión
          </button>
          <button id="signup-btn" style="flex: 1; padding: 10px; background: #34a853; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Crear cuenta
          </button>
        </div>
      </div>

      <!-- Logout -->
      <div id="logout-section" style="display: none; margin-top: 20px;">
        <button id="logout-btn" style="width: 100%; padding: 12px; background: #ea4335; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer;">
          🚪 Cerrar sesión
        </button>
      </div>

      <div id="error-message" style="margin-top: 15px; padding: 10px; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c33; display: none;"></div>
    </div>
  `;

  // Event Listeners
  document.getElementById('google-login-btn').addEventListener('click', handleGoogleLogin);
  document.getElementById('login-btn').addEventListener('click', handleEmailLogin);
  document.getElementById('signup-btn').addEventListener('click', handleEmailSignup);
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

// Handlers de autenticación
async function handleGoogleLogin() {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    showError(''); // Limpia errores
  } catch (error) {
    showError(`Error Google: ${error.message}`);
  }
}

async function handleEmailLogin() {
  const email = document.getElementById('email-input').value;
  const password = document.getElementById('password-input').value;
  
  if (!email || !password) {
    showError('Por favor completa todos los campos');
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showError('');
  } catch (error) {
    showError(`Error login: ${error.message}`);
  }
}

async function handleEmailSignup() {
  const email = document.getElementById('email-input').value;
  const password = document.getElementById('password-input').value;
  
  if (!email || !password) {
    showError('Por favor completa todos los campos');
    return;
  }

  if (password.length < 6) {
    showError('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    showError('');
  } catch (error) {
    showError(`Error registro: ${error.message}`);
  }
}

async function handleLogout() {
  try {
    await signOut(auth);
    showError('');
  } catch (error) {
    showError(`Error logout: ${error.message}`);
  }
}

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  if (message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  } else {
    errorDiv.style.display = 'none';
  }
}

function updateUIForUser(user) {
  const statusText = document.getElementById('status-text');
  const userEmail = document.getElementById('user-email');
  const loginSection = document.getElementById('email-login-section');
  const googleSection = document.getElementById('google-login-section');
  const logoutSection = document.getElementById('logout-section');

  if (user) {
    // Usuario autenticado
    statusText.textContent = '✅ Autenticado';
    statusText.style.color = '#34a853';
    userEmail.textContent = `Usuario: ${user.email}`;
    
    loginSection.style.display = 'none';
    googleSection.style.display = 'none';
    logoutSection.style.display = 'block';
  } else {
    // Usuario no autenticado
    statusText.textContent = '❌ No autenticado';
    statusText.style.color = '#ea4335';
    userEmail.textContent = '';
    
    loginSection.style.display = 'block';
    googleSection.style.display = 'block';
    logoutSection.style.display = 'none';
  }
}

// Escucha cambios de autenticación
onAuthStateChanged(auth, user => {
  console.log('Auth state changed:', user);
  updateUIForUser(user);
});

// Inicializa la UI cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUI);
} else {
  initUI();
}
