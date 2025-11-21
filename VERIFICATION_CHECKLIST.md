# ✅ Checklist de Verificación - Zenko Financial

## 📋 Verificaciones Iniciales

### 1. Instalación y Dependencias
- [x] `npm install` completado sin errores
- [x] `package-lock.json` generado
- [x] 0 vulnerabilidades (`npm audit`)
- [x] Node.js >= 18.0.0

### 2. Configuración de Entorno
- [x] `.env.local` existe en la raíz del proyecto
- [x] 7 variables `VITE_FIREBASE_*` configuradas
- [x] `.env.local` NO aparece en `git status` (protegido por `.gitignore`)
- [x] `.env.example` commiteado como plantilla

### 3. Servidor de Desarrollo
- [x] `npm run dev` arranca sin errores
- [ ] Navegador abre en `http://localhost:5173` (o puerto alternativo)
- [ ] Página carga sin errores 404 o de red

## 🔍 Verificación de Consola del Navegador (F12)

Abre DevTools (F12) y busca estos mensajes en orden:

```
✅ Firebase config loaded successfully
📦 Project ID: zenko-financial
🔥 Firebase initialized for Zenko Financial
🎨 Initializing Zenko Financial UI...
📄 DOM already loaded, mounting UI
Auth state changed: null
```

### Estado de cada log:
- [ ] ✅ "Firebase config loaded successfully" - Variables cargadas OK
- [ ] 📦 "Project ID: zenko-financial" - Confirma proyecto correcto
- [ ] 🔥 "Firebase initialized" - Firebase conectado
- [ ] 🎨 "Initializing UI" - App montándose
- [ ] 📄 "DOM loaded" - UI lista
- [ ] 🔐 "Auth state changed: null" - Sistema de auth funcionando

### ❌ Si NO ves estos logs:
- [ ] Verifica que `.env.local` existe
- [ ] Reinicia el servidor (`Ctrl+C` y `npm run dev`)
- [ ] Recarga la página con `Ctrl+Shift+R` (hard refresh)
- [ ] Verifica que estás en la pestaña "Console" de DevTools

## 🔐 Prueba de Autenticación

### Opción A: Registro con Email/Password
1. [ ] Escribe email: `test@zenko.com`
2. [ ] Escribe contraseña: `Test123456` (mínimo 6 caracteres)
3. [ ] Click en "Crear cuenta"
4. [ ] Verifica en consola: `Auth state changed: { email: "test@zenko.com", ... }`
5. [ ] UI cambia a "✅ Autenticado"
6. [ ] Se muestra el email del usuario

### Opción B: Login con Google
1. [ ] Click en "🔑 Iniciar sesión con Google"
2. [ ] Popup de Google aparece
3. [ ] Selecciona cuenta Google
4. [ ] Popup se cierra automáticamente
5. [ ] Verifica en consola: `Auth state changed: { email: "..." }`
6. [ ] UI cambia a "✅ Autenticado"

### Verificación en Firebase Console
1. [ ] Abre [Firebase Console](https://console.firebase.google.com/)
2. [ ] Selecciona proyecto "zenko-financial"
3. [ ] Ve a Authentication → Users
4. [ ] Verifica que el usuario aparece en la lista

## 🔥 Prueba de Firestore (Opcional)

En la consola del navegador, ejecuta:

```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from './src/main.js';

// Crear documento de prueba
const testDoc = await addDoc(collection(db, 'users', auth.currentUser.uid, 'accounts'), {
  name: 'Cuenta de prueba',
  balance: 1000,
  currency: 'USD',
  createdAt: new Date()
});

console.log('✅ Documento creado:', testDoc.id);
```

- [ ] Documento se crea sin errores
- [ ] En Firebase Console → Firestore → Data, aparece en `/users/{uid}/accounts/`

### Si obtienes error `permission-denied`:
1. [ ] Firebase Console → Firestore Database → Rules
2. [ ] Verifica que las reglas permiten acceso al usuario autenticado:
   ```
   match /users/{userId}/{document=**} {
     allow read, write: if request.auth != null && request.auth.uid == userId;
   }
   ```

## 🚨 Errores Comunes y Soluciones

### Error: "Firebase config missing"
- **Causa**: `.env.local` no existe o no tiene las variables
- **Solución**: 
  - [ ] Verifica que `.env.local` existe en la raíz
  - [ ] Copia de `.env.example` si falta
  - [ ] Reinicia `npm run dev`

### Error: "auth/operation-not-allowed"
- **Causa**: Email/Password no habilitado en Firebase
- **Solución**:
  - [ ] Firebase Console → Authentication → Sign-in method
  - [ ] Habilita "Email/Password"
  - [ ] Guarda cambios

### Error: "auth/unauthorized-domain"
- **Causa**: `localhost` no autorizado en Firebase
- **Solución**:
  - [ ] Firebase Console → Authentication → Settings
  - [ ] Authorized domains → Add domain
  - [ ] Añade `localhost`

### Error: Popup bloqueado (Google login)
- **Causa**: Navegador bloquea popups
- **Solución**:
  - [ ] Habilita popups para `localhost` en configuración del navegador
  - [ ] O usa el método de redirección en lugar de popup

### Error: "auth/network-request-failed"
- **Causa**: Problema de red o hora del sistema incorrecta
- **Solución**:
  - [ ] Verifica conexión a internet
  - [ ] Sincroniza hora del sistema
  - [ ] Limpia caché del navegador

## 📦 Build de Producción

Cuando todo funcione localmente:

```bash
# 1. Compilar
npm run build

# 2. Preview del build
npm run preview
```

- [ ] Build completa sin errores
- [ ] Carpeta `dist/` generada
- [ ] Preview funciona en `http://localhost:4173`

## 🚀 Despliegue a Firebase Hosting

```bash
# 1. Instalar CLI (si no lo tienes)
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Inicializar (solo primera vez)
firebase init hosting
# Elige: dist como carpeta, SPA=Yes, GitHub Actions=No

# 4. Desplegar
firebase deploy
```

- [ ] Login exitoso
- [ ] Hosting inicializado
- [ ] Deploy completado
- [ ] URL de producción funcionando

## 🔄 CI/CD con GitHub Actions

### Configurar Secrets en GitHub:
1. [ ] Ve a Settings → Secrets and variables → Actions
2. [ ] Añade cada secret:
   - [ ] `VITE_FIREBASE_API_KEY`
   - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
   - [ ] `VITE_FIREBASE_PROJECT_ID`
   - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
   - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - [ ] `VITE_FIREBASE_APP_ID`
   - [ ] `VITE_FIREBASE_MEASUREMENT_ID`
   - [ ] `FIREBASE_SERVICE_ACCOUNT` (JSON completo del service account)

### Verificar Workflow:
- [ ] `.github/workflows/deploy.yml` existe
- [ ] Push a `main` dispara el workflow
- [ ] Build pasa correctamente
- [ ] Deploy a Firebase Hosting exitoso

## ✅ Estado Final

Una vez completadas todas las verificaciones:

- [ ] ✅ Aplicación funciona localmente
- [ ] ✅ Autenticación operativa
- [ ] ✅ Firestore conectado
- [ ] ✅ Build de producción funciona
- [ ] ✅ Deploy exitoso (opcional)
- [ ] ✅ CI/CD configurado (opcional)

---

**Fecha de verificación**: _______________
**Verificado por**: _______________

**🎉 ¡Zenko Financial está listo para producción!**
