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
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { renderDashboard } from "./dashboard-new.js";

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
} else {
  console.log('✅ Firebase config loaded successfully');
  console.log('📦 Project ID:', firebaseConfig.projectId);
}

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log('🔥 Firebase initialized for Zenko Financial');

// ========== UI PROFESIONAL DE AUTENTICACIÓN ==========

function initUI() {
  const appDiv = document.getElementById('app');
  
  appDiv.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-4" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div class="w-full max-w-md">
        <!-- Logo & Brand -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-2xl mb-4">
            <span class="text-5xl">🦊</span>
          </div>
          <h1 class="text-4xl font-display font-bold text-white mb-2">Zenko Financial</h1>
          <p class="text-white/80 text-lg">Claridad Estratégica</p>
        </div>

        <!-- Login Card -->
        <div class="glass rounded-3xl shadow-2xl p-8">
          <h2 class="text-2xl font-display font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
          
          <!-- Login con Google -->
          <button id="google-login-btn" class="w-full py-3 px-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-primary transition-all flex items-center justify-center gap-3 mb-6">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continuar con Google</span>
          </button>

          <div class="relative mb-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500">o usa tu email</span>
            </div>
          </div>

          <!-- Login con Email/Password -->
          <div class="space-y-4">
            <!-- Signup-only fields -->
            <div id="signup-fields" class="hidden space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre completo</label>
                <input type="text" id="fullname-input" placeholder="Juan Pérez" 
                       class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors">
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre de usuario</label>
                <input type="text" id="username-input" placeholder="juanperez" 
                       class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors">
                <p class="text-xs text-gray-500 mt-1">Solo letras, números y guiones bajos</p>
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Edad</label>
                <input type="number" id="age-input" placeholder="18" min="13" max="120"
                       class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors">
                <p class="text-xs text-gray-500 mt-1">Debes ser mayor de 13 años</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" id="email-input" placeholder="tu@email.com" 
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors">
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
              <input type="password" id="password-input" placeholder="••••••••" 
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors">
              <div id="password-requirements" class="hidden mt-2 space-y-1 text-xs">
                <p id="req-length" class="text-gray-500">• Mínimo 8 caracteres</p>
                <p id="req-uppercase" class="text-gray-500">• Una letra mayúscula</p>
                <p id="req-lowercase" class="text-gray-500">• Una letra minúscula</p>
                <p id="req-number" class="text-gray-500">• Un número</p>
                <p id="req-special" class="text-gray-500">• Un carácter especial (!@#$%^&*)</p>
              </div>
            </div>

            <!-- Confirm Password (signup only) -->
            <div id="confirm-password-container" class="hidden">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Confirmar contraseña</label>
              <input type="password" id="confirm-password-input" placeholder="••••••••" 
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none transition-colors">
            </div>

            <!-- Terms and Privacy Checkbox (shown only during signup) -->
            <div id="terms-container" class="hidden">
              <label class="flex items-start gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors">
                <input type="checkbox" id="terms-checkbox" class="mt-1 w-5 h-5 text-primary border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary">
                <span class="text-sm text-gray-700 flex-1">
                  Acepto los <a href="./TERMS_OF_SERVICE.md" target="_blank" class="text-primary font-semibold hover:underline">Términos de Servicio</a> 
                  y la <a href="./PRIVACY_POLICY.md" target="_blank" class="text-primary font-semibold hover:underline">Política de Privacidad</a> de Zenko Financial
                </span>
              </label>
            </div>

            <div id="error-message" class="hidden p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm"></div>

            <div class="flex gap-3 pt-2">
              <button id="login-btn" class="flex-1 py-3 gradient-primary text-white rounded-xl font-semibold hover:shadow-lg">
                Iniciar Sesión
              </button>
              <button id="signup-btn" class="flex-1 py-3 gradient-success text-white rounded-xl font-semibold hover:shadow-lg">
                Crear Cuenta
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <p class="text-center text-white/70 text-sm mt-6">
          � Tu información está segura y protegida
        </p>
      </div>
    </div>
  `;

  // Event Listeners
  document.getElementById('google-login-btn').addEventListener('click', handleGoogleLogin);
  document.getElementById('login-btn').addEventListener('click', handleEmailLogin);
  document.getElementById('signup-btn').addEventListener('click', handleEmailSignup);
  
  // Show/hide signup fields and terms
  const signupBtn = document.getElementById('signup-btn');
  const loginBtn = document.getElementById('login-btn');
  const signupFields = document.getElementById('signup-fields');
  const termsContainer = document.getElementById('terms-container');
  const confirmPasswordContainer = document.getElementById('confirm-password-container');
  const passwordRequirements = document.getElementById('password-requirements');
  const passwordInput = document.getElementById('password-input');
  
  let isSignupMode = false;
  
  signupBtn.addEventListener('click', (e) => {
    if (!isSignupMode) {
      e.preventDefault();
      isSignupMode = true;
      signupFields.classList.remove('hidden');
      termsContainer.classList.remove('hidden');
      confirmPasswordContainer.classList.remove('hidden');
      passwordRequirements.classList.remove('hidden');
      signupBtn.textContent = 'Registrarse';
      loginBtn.textContent = 'Ya tengo cuenta';
      return;
    }
    // If already in signup mode, proceed with handleEmailSignup
  });
  
  loginBtn.addEventListener('click', (e) => {
    if (isSignupMode) {
      e.preventDefault();
      isSignupMode = false;
      signupFields.classList.add('hidden');
      termsContainer.classList.add('hidden');
      confirmPasswordContainer.classList.add('hidden');
      passwordRequirements.classList.add('hidden');
      signupBtn.textContent = 'Crear Cuenta';
      loginBtn.textContent = 'Iniciar Sesión';
      return;
    }
    // If in login mode, proceed with handleEmailLogin
  });

  // Real-time password validation
  passwordInput.addEventListener('input', () => {
    validatePasswordRequirements(passwordInput.value);
  });
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
  const fullname = document.getElementById('fullname-input').value.trim();
  const username = document.getElementById('username-input').value.trim();
  const age = parseInt(document.getElementById('age-input').value);
  const email = document.getElementById('email-input').value.trim();
  const password = document.getElementById('password-input').value;
  const confirmPassword = document.getElementById('confirm-password-input').value;
  const termsCheckbox = document.getElementById('terms-checkbox');
  
  // Validate all fields
  if (!fullname || !username || !age || !email || !password || !confirmPassword) {
    showError('Por favor completa todos los campos');
    return;
  }

  // Validate fullname
  if (fullname.length < 3) {
    showError('El nombre completo debe tener al menos 3 caracteres');
    return;
  }

  // Validate username (only alphanumeric and underscore)
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    showError('El nombre de usuario debe tener entre 3-20 caracteres (solo letras, números y guiones bajos)');
    return;
  }

  // Validate age
  if (age < 13 || age > 120 || isNaN(age)) {
    showError('Debes tener al menos 13 años para crear una cuenta');
    return;
  }

  // Validate password requirements
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    showError(passwordValidation.message);
    return;
  }

  // Confirm password match
  if (password !== confirmPassword) {
    showError('Las contraseñas no coinciden');
    return;
  }

  // Check terms acceptance
  if (!termsCheckbox.checked) {
    showError('Debes aceptar los Términos de Servicio y la Política de Privacidad para crear una cuenta');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: fullname
    });

    // Save additional user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      fullname: fullname,
      username: username,
      age: age,
      email: email,
      createdAt: new Date().toISOString(),
      photoURL: user.photoURL || ''
    });

    // Mark user as new for welcome modal
    localStorage.setItem(`newUser_${user.uid}`, 'true');
    showError('');
    console.log('✅ Usuario registrado exitosamente');
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      showError('Este email ya está registrado. Intenta iniciar sesión.');
    } else if (error.code === 'auth/invalid-email') {
      showError('Email inválido');
    } else {
      showError(`Error registro: ${error.message}`);
    }
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

// Password validation function
function validatePassword(password) {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  const allValid = Object.values(requirements).every(v => v);

  let message = 'La contraseña debe contener: ';
  const missing = [];
  if (!requirements.length) missing.push('mínimo 8 caracteres');
  if (!requirements.uppercase) missing.push('una mayúscula');
  if (!requirements.lowercase) missing.push('una minúscula');
  if (!requirements.number) missing.push('un número');
  if (!requirements.special) missing.push('un carácter especial');

  return {
    valid: allValid,
    message: missing.length > 0 ? message + missing.join(', ') : '',
    requirements: requirements
  };
}

// Real-time password requirements UI update
function validatePasswordRequirements(password) {
  const validation = validatePassword(password);
  const reqs = validation.requirements;

  updateRequirement('req-length', reqs.length);
  updateRequirement('req-uppercase', reqs.uppercase);
  updateRequirement('req-lowercase', reqs.lowercase);
  updateRequirement('req-number', reqs.number);
  updateRequirement('req-special', reqs.special);
}

function updateRequirement(id, isValid) {
  const element = document.getElementById(id);
  if (element) {
    if (isValid) {
      element.classList.remove('text-gray-500');
      element.classList.add('text-green-600', 'font-semibold');
      element.innerHTML = element.innerHTML.replace('•', '✓');
    } else {
      element.classList.remove('text-green-600', 'font-semibold');
      element.classList.add('text-gray-500');
      element.innerHTML = element.innerHTML.replace('✓', '•');
    }
  }
}

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  if (message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
  } else {
    errorDiv.classList.add('hidden');
  }
}

function updateUIForUser(user) {
  if (user) {
    // Usuario autenticado - Mostrar Dashboard
    console.log('✅ Usuario autenticado, cargando dashboard...');
    renderDashboard(user);
  } else {
    // Usuario no autenticado - Mostrar pantalla de login
    console.log('❌ Usuario no autenticado, mostrando login');
    initUI();
  }
}

// Escucha cambios de autenticación
onAuthStateChanged(auth, user => {
  console.log('Auth state changed:', user);
  updateUIForUser(user);
});

// Inicializa la UI cuando el DOM esté listo
console.log('🎨 Initializing Zenko Financial UI...');
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, mounting UI');
    initUI();
  });
} else {
  console.log('📄 DOM already loaded, mounting UI');
  initUI();
}
