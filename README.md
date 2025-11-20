# Kodo - Zenko Financial 🦊💰

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/firebase-12.6-orange?logo=firebase)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Aplicación web moderna construida con Vite + Firebase para gestión financiera con claridad estratégica.

## ✨ Características

- 🔐 **Autenticación Firebase** - Login con Google y Email/Password
- 🔥 **Firestore Database** - Base de datos en tiempo real
- ⚡ **Vite Build System** - Development rápido con HMR
- 🔒 **Variables de entorno seguras** - Configuración con `.env.local`
- 🚀 **CI/CD GitHub Actions** - Despliegue automático a Firebase Hosting
- 🛡️ **Snyk Security** - 0 vulnerabilidades detectadas
- 📱 **Responsive Design** - Funciona en todos los dispositivos

## 📋 Requisitos previos

- Node.js 18+ y npm
- Cuenta de Firebase (proyecto configurado)
- Git

## 🚀 Configuración local (Pasos exactos)

### 1. Clonar el repositorio

```powershell
git clone https://github.com/BlackSpaces0/Kodo.git
cd Kodo
```

### 2. Instalar dependencias

```powershell
npm install
```

### 3. Configurar variables de entorno

**IMPORTANTE**: No subas tus credenciales reales a GitHub.

Crea un archivo `.env.local` en la raíz del proyecto con tus credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="zenko-financial.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="zenko-financial"
VITE_FIREBASE_STORAGE_BUCKET="zenko-financial.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="394322832162"
VITE_FIREBASE_APP_ID="1:394322832162:web:4570949682511d80ff537b"
VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXX"
```

> **Nota**: El archivo `.env.local` está en `.gitignore` y **nunca** se subirá al repositorio.

### 4. Ejecutar el servidor de desarrollo

```powershell
npm run dev
```

Abre tu navegador en: http://localhost:5173

## 🔧 Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila para producción (salida en `/dist`)
- `npm run preview` - Preview del build de producción

## 📁 Estructura del proyecto

```
Kodo/
├── src/
│   └── main.js          # Entrada principal (inicialización Firebase)
├── index.html           # HTML principal
├── package.json         # Dependencias y scripts
├── .env.example         # Plantilla de variables de entorno (commiteable)
├── .env.local           # Variables reales (NO commitear - ignorado por git)
└── .gitignore           # Archivos ignorados por git
```

## 🔒 Seguridad - QUÉ GUARDAR Y DÓNDE

### ✅ Guardar LOCALMENTE (NO subir a GitHub)
- `.env.local` - tus credenciales reales de Firebase
- Archivos JSON de service accounts
- Tokens de autenticación
- Backups con datos sensibles

### ✅ Commitear al REPOSITORIO
- `.env.example` - plantilla con placeholders
- Código fuente (`src/`, `index.html`, etc.)
- `package.json`, `.gitignore`
- Archivos de configuración (sin secretos)

### ✅ GitHub Secrets (para CI/CD)
Para despliegues automáticos, añade las variables como GitHub Secrets:

1. Ve a tu repo: `Settings` → `Secrets and variables` → `Actions`
2. Añade cada variable como secret:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

## 🚢 Despliegue

### Firebase Hosting

1. Instala Firebase CLI globalmente:
```powershell
npm install -g firebase-tools
```

2. Autentícate:
```powershell
firebase login
```

3. Inicializa Firebase Hosting:
```powershell
firebase init hosting
```
- Selecciona tu proyecto existente
- Establece `dist` como carpeta de despliegue
- Configura como SPA (rewrite todas las URLs a `/index.html`)

4. Compila y despliega:
```powershell
npm run build
firebase deploy
```

### GitHub Actions (CI/CD)

Ya incluimos un workflow en `.github/workflows/deploy.yml` que despliega automáticamente a Firebase Hosting cuando haces push a `main`.

**Configuración de Secrets necesarios:**

1. Ve a tu repositorio en GitHub: `Settings` → `Secrets and variables` → `Actions`

2. Añade estos secrets (clic en "New repository secret"):
   - `VITE_FIREBASE_API_KEY` - tu API key
   - `VITE_FIREBASE_AUTH_DOMAIN` - tu auth domain
   - `VITE_FIREBASE_PROJECT_ID` - tu project ID
   - `VITE_FIREBASE_STORAGE_BUCKET` - tu storage bucket
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` - tu messaging sender ID
   - `VITE_FIREBASE_APP_ID` - tu app ID
   - `VITE_FIREBASE_MEASUREMENT_ID` - tu measurement ID (opcional)

3. **Importante**: Añade `FIREBASE_SERVICE_ACCOUNT`:
   - Ve a Firebase Console → Project Settings → Service Accounts
   - Clic en "Generate new private key" (descarga el JSON)
   - Copia **todo el contenido** del archivo JSON
   - Pégalo como valor del secret `FIREBASE_SERVICE_ACCOUNT`

Una vez configurado, cada push a `main` ejecutará:
1. `npm ci` (instala dependencias)
2. `npm run build` (compila con las variables de entorno)
3. Deploy a Firebase Hosting automáticamente

## 🛡️ Recomendaciones de seguridad

- ✅ **Nunca** subas `.env.local` o archivos con secretos al repositorio
- ✅ Usa GitHub Secrets para variables en CI/CD
- ✅ Configura reglas de seguridad en Firestore antes de producción
- ✅ Considera activar Firebase App Check + reCAPTCHA
- ✅ Revisa y actualiza dependencias regularmente (`npm audit`)
- ✅ Ejecuta escaneos de seguridad (Snyk) antes de commits importantes

## 🔑 Migración desde HTML estático

Si estás migrando desde un `index.html` monolítico:
1. Mueve tu código JS a `src/main.js` o crea módulos en `src/`
2. Mantén el HTML mínimo en `index.html` (solo estructura base)
3. Importa Firebase de forma modular (ya configurado en este proyecto)
4. Ventajas: tree-shaking, builds optimizados, desarrollo modular

## 📚 Recursos

- [Vite Documentation](https://vitejs.dev/)
- [Firebase Web SDK (v9+)](https://firebase.google.com/docs/web/setup)
- [Firebase Authentication](https://firebase.google.com/docs/auth/web/start)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

## 📝 Notas adicionales

- Este proyecto usa Firebase SDK v9+ (modular)
- Las variables de entorno deben tener prefijo `VITE_` para ser expuestas
- El build de producción optimiza y hace tree-shaking automáticamente
- Para desarrollo, las credenciales de Firebase son seguras si están en `.env.local`

## 🔧 Solución de Problemas

¿Tienes errores? Consulta **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** para:
- Errores comunes y sus soluciones
- Cómo verificar que tu setup está correcto
- Pasos para probar que todo funciona
- Guía de debugging

---

**Desarrollado con ❤️ para Zenko Financial**
