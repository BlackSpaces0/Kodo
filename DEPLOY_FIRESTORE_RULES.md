# 🚀 Despliegue de Firestore Rules

## ⚠️ **PASO CRÍTICO - Configura las reglas de seguridad**

Para que el dashboard funcione, necesitas desplegar las reglas de Firestore a tu proyecto Firebase.

## Opción 1: Firebase CLI (Recomendado)

```powershell
# 1. Instala Firebase CLI si no la tienes
npm install -g firebase-tools

# 2. Inicia sesión en Firebase
firebase login

# 3. Inicializa el proyecto (solo la primera vez)
firebase init firestore

# 4. Despliega las reglas
firebase deploy --only firestore:rules
```

## Opción 2: Firebase Console (Más rápido)

1. Ve a la **Firebase Console**: https://console.firebase.google.com/project/zenko-financial/firestore

2. Ve a **Firestore Database** → **Reglas** (Rules)

3. **Copia y pega** estas reglas:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para colección de usuarios
    match /users/{userId} {
      // Solo el usuario puede leer/escribir su propia data
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcolección de cuentas
      match /accounts/{accountId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Subcolección de transacciones
      match /transactions/{transactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Subcolección de presupuestos
      match /budgets/{budgetId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

4. Haz clic en **Publicar** (Publish)

## ✅ Verificación

Una vez desplegadas las reglas:

1. Recarga tu aplicación en http://localhost:5174/
2. Ya deberías ver el **Dashboard de Zenko Financial** automáticamente
3. Prueba crear una cuenta desde el botón "🏦 Añadir Cuenta"

## 🔥 ¿Qué cambió?

- **Antes**: Solo pantalla de login
- **Ahora**: Dashboard completo con:
  - ✅ Tarjetas de balance (Total, Ingresos, Gastos)
  - ✅ Gestión de cuentas bancarias
  - ✅ Botón para añadir cuentas
  - ✅ Botón de cerrar sesión

## 🐛 Solución de problemas

Si ves errores en la consola del navegador:

**Error: "Missing or insufficient permissions"**
- Significa que las reglas de Firestore no están desplegadas
- Sigue las instrucciones arriba para desplegarlas

**Error: "PERMISSION_DENIED"**
- Asegúrate de estar autenticado
- Verifica que tu email coincide con el usuario autenticado
