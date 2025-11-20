# Guía de Solución de Problemas - Kodo

## ✅ Problemas Corregidos

### 1. **index.html duplicado** (CRÍTICO - RESUELTO)
- **Problema**: El archivo tenía dos secciones `<html>` completas que rompían la aplicación
- **Solución**: Eliminado el contenido duplicado, manteniendo solo la versión compatible con Vite

### 2. **Validación de variables de entorno** (MEJORADO)
- **Problema**: No había validación si las variables de Firebase estaban configuradas
- **Solución**: Añadido console.error cuando faltan las credenciales de Firebase

## 🔍 Verificación del Setup

### Verificar que los archivos están correctos:

```powershell
# 1. Verificar que package.json existe
Get-Content package.json

# 2. Verificar que src/main.js existe
Test-Path src\main.js

# 3. Verificar que .env.example existe
Get-Content .env.example

# 4. Verificar que index.html no tiene duplicados (debe tener ~11 líneas)
(Get-Content index.html).Length
```

### Crear .env.local rápidamente:

```powershell
# Copia el ejemplo y edítalo
Copy-Item .env.example .env.local
notepad .env.local
```

Luego reemplaza los valores vacíos `""` con tus credenciales reales de Firebase.

## ⚠️ Errores Comunes y Soluciones

### Error: "Firebase config missing"
**Causa**: No has creado el archivo `.env.local` o está vacío

**Solución**:
1. Copia `.env.example` a `.env.local`
2. Rellena todas las variables con tus credenciales de Firebase
3. Reinicia el servidor de desarrollo (`npm run dev`)

### Error: "Cannot find module 'firebase'"
**Causa**: No has instalado las dependencias

**Solución**:
```powershell
npm install
```

### Error: "Port 5173 already in use"
**Causa**: Ya tienes un servidor Vite ejecutándose

**Solución**:
```powershell
# Detén el proceso anterior o usa otro puerto
npm run dev -- --port 3000
```

### Error en login con Google: "This domain is not authorized"
**Causa**: No has añadido `localhost` a los dominios autorizados en Firebase Console

**Solución**:
1. Ve a Firebase Console → Authentication → Settings
2. En "Authorized domains", añade `localhost`

### El workflow de GitHub Actions falla
**Causa**: Los Secrets no están configurados en GitHub

**Solución**:
1. Ve a tu repo → Settings → Secrets and variables → Actions
2. Añade todos los secrets listados en el README
3. Especialmente el `FIREBASE_SERVICE_ACCOUNT`

## 🧪 Probar que todo funciona

### Test local básico:

```powershell
# 1. Instalar
npm install

# 2. Crear .env.local (si no existe)
# Copia .env.example y rellena con tus valores

# 3. Iniciar servidor
npm run dev

# 4. Abrir navegador en http://localhost:5173
# Deberías ver la UI de autenticación
```

### Lo que deberías ver:
- ✅ Título "🔐 Zenko Financial Auth"
- ✅ Botón "Iniciar sesión con Google"
- ✅ Campos de email y password
- ✅ Botones "Iniciar sesión" y "Crear cuenta"
- ✅ Estado: "❌ No autenticado" (si no has iniciado sesión)

### Funcionalidades que deben funcionar:
- ✅ Login con Google (popup)
- ✅ Crear cuenta con email/password
- ✅ Login con email/password
- ✅ Ver email del usuario autenticado
- ✅ Cerrar sesión
- ✅ Mensajes de error claros

## 📊 Seguridad - Snyk Scan

Última verificación Snyk: ✅ **0 vulnerabilidades**
- Código JavaScript: Sin problemas
- Dependencias: Firebase ^12.6.0, Vite ^5.0.0

## 🚀 Siguiente paso después de verificar

Si todo funciona localmente:
1. Commit y push a GitHub
2. Configura los Secrets en GitHub
3. El workflow automáticamente desplegará a Firebase Hosting

## 📞 Soporte adicional

Si tienes un error que no está aquí:
1. Revisa la consola del navegador (F12)
2. Revisa la terminal donde corre `npm run dev`
3. Verifica que `.env.local` tiene las 7 variables completadas
4. Asegúrate de que Firebase Console tiene tu proyecto configurado
