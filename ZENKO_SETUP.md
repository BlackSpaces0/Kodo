# 🦊 Configuración de Zenko Financial

## ✅ Credenciales de Firebase ya configuradas

Este proyecto ya tiene las credenciales de Firebase de **Zenko Financial** listas para usar.

### 📋 Detalles del Proyecto Firebase

- **Nombre de la app**: Zenko Web
- **App ID**: `1:394322832162:web:4570949682511d80ff537b`
- **Project ID**: `zenko-financial`
- **Auth Domain**: `zenko-financial.firebaseapp.com`
- **Storage Bucket**: `zenko-financial.firebasestorage.app`

## 🚀 Inicio Rápido (Ya está todo listo)

El archivo `.env.local` ya está creado con tus credenciales reales. Solo necesitas:

```powershell
# 1. Instalar dependencias (si no lo has hecho)
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
# http://localhost:5173
```

## 🔐 Seguridad

- ✅ El archivo `.env.local` contiene tus credenciales reales
- ✅ Está protegido por `.gitignore` y **NO se subirá a GitHub**
- ✅ Las variables están correctamente prefijadas con `VITE_`
- ✅ Firebase está inicializado en `src/main.js`

## 🎨 Funcionalidades Disponibles

### Autenticación
- ✅ Login con Google (popup)
- ✅ Login/Registro con Email y Contraseña
- ✅ Cerrar sesión
- ✅ Estado de autenticación en tiempo real

### Base de datos
- ✅ Firestore inicializado y listo para usar
- ✅ Exportado como `db` en `src/main.js`

## 📝 Configuración de Firebase (Referencia)

### Variables de Entorno en `.env.local`
```env
VITE_FIREBASE_API_KEY="AIzaSyCDsp6PnB2pAjsQY6qKii70UuhLaYBdZQc"
VITE_FIREBASE_AUTH_DOMAIN="zenko-financial.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="zenko-financial"
VITE_FIREBASE_STORAGE_BUCKET="zenko-financial.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="394322832162"
VITE_FIREBASE_APP_ID="1:394322832162:web:4570949682511d80ff537b"
VITE_FIREBASE_MEASUREMENT_ID="G-6RE5T32290"
```

### Cómo se usa en el código (`src/main.js`)
```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## 🌐 Configuración de Autenticación en Firebase Console

Para que el login funcione correctamente, asegúrate de tener habilitado en Firebase Console:

1. **Authentication → Sign-in method**:
   - ✅ Email/Password habilitado
   - ✅ Google habilitado
   - ✅ Dominios autorizados: `localhost`, `zenko-financial.firebaseapp.com`

2. **Firestore Database**:
   - ✅ Base de datos creada (modo producción o test)
   - ✅ Reglas de seguridad configuradas

## 📦 Despliegue a Firebase Hosting

Cuando estés listo para desplegar:

```powershell
# 1. Compilar para producción
npm run build

# 2. Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# 3. Login en Firebase
firebase login

# 4. Desplegar
firebase deploy
```

O usa GitHub Actions (el workflow ya está configurado en `.github/workflows/deploy.yml`).

### Para GitHub Actions
Añade estos Secrets en GitHub (`Settings` → `Secrets` → `Actions`):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `FIREBASE_SERVICE_ACCOUNT` (JSON del service account)

## 🧪 Probar la aplicación

1. **Abrir**: http://localhost:5173
2. **Deberías ver**: 
   - Título "🔐 Zenko Financial Auth"
   - Botón de Google login
   - Campos de email/password
   - Estado: "❌ No autenticado"

3. **Probar login**:
   - Click en "Iniciar sesión con Google"
   - O crear cuenta con email/password
   - Debería cambiar a "✅ Autenticado" y mostrar tu email

## 🐛 Troubleshooting

Si tienes problemas, consulta [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

### Error común: "Firebase config missing"
- **Causa**: No se cargó el `.env.local`
- **Solución**: Reinicia el servidor (`Ctrl+C` y `npm run dev` de nuevo)

### Error: "This domain is not authorized"
- **Causa**: `localhost` no está en dominios autorizados de Firebase
- **Solución**: Firebase Console → Authentication → Settings → Authorized domains → Añadir `localhost`

---

**🦊 Zenko Financial - Tu estrategia financiera con claridad** 💰
