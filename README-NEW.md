# 🦊 Zenko Financial - Claridad Estratégica

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/vite-6.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/firebase-12.6-orange?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-3.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Snyk Security](https://img.shields.io/badge/snyk-0%20vulnerabilities-success)](https://snyk.io/)

Plataforma moderna de gestión financiera diseñada específicamente para República Dominicana. Construida con Vite, Firebase, Tailwind CSS y Chart.js.

---

## 🎯 Características Principales

### ✅ Sistema de Autenticación Completo
- 🔑 Login con Google OAuth
- 📧 Login con Email/Password
- ✨ Registro de nuevos usuarios
- 🔐 Sesiones persistentes con Firebase Auth
- 🛡️ Protección de rutas y datos por usuario

### 💰 Gestión de Cuentas Bancarias
- ➕ Crear múltiples cuentas
- 💱 Soporte para DOP, USD, EUR
- 📊 Balance en tiempo real
- ✏️ Editar y eliminar cuentas
- 🎨 Tarjetas visuales con gradientes

### 💳 Sistema de Transacciones
- ✅ Registrar ingresos y gastos
- 🏷️ Categorización (Alimentación, Transporte, Vivienda, etc.)
- 📜 Historial completo
- 🔍 Filtros por fecha y tipo
- 💾 Persistencia en Firestore

### 💰 Calculadora de Préstamos RD
Sistema completo de cálculo de préstamos con tasas dominicanas:

- **Tasa de Política Monetaria BCRD**: 5.75%
- **Tasa Promedio Personal**: 14.32%

**Productos Financieros**:
- 💳 **Préstamo Personal**: Hasta $500,000 DOP, 60 meses
- 🚗 **Préstamo Vehicular**: Financiamiento 100%, 72 meses (nuevo) / 60 meses (usado)
- 🏠 **Préstamo Hipotecario**: Hasta 80% del valor, 30 años, desde 15.95%
- 🏭 **Préstamo PYME (Promipyme)**: 12% anual, hasta 72 meses sector industrial

**Funcionalidades**:
- Cálculo de cuota mensual
- Total a pagar
- Intereses totales
- Amortización personalizada

### 🧮 Calculadora ITBIS (18%)
- Cálculo automático del impuesto
- Monto base sin ITBIS
- Impuesto (18%)
- Total con ITBIS incluido

### 📚 Educación Financiera República Dominicana

#### ⚖️ Marco Legal
- **Ley 183-02**: Ley Monetaria y Financiera de la República Dominicana
- **Superintendencia de Bancos**: Supervisión de entidades financieras
- **Banco Central RD**: Control monetario, TPM 5.75%
- **Nuevo Código Penal**: Criminalización de usura y préstamos no regulados

#### 🛡️ Derechos del Consumidor
- ✅ Derecho a la información clara sobre productos financieros
- ✅ Derecho a elegir sin presión
- ✅ Reporte de crédito gratis anualmente (TransUnion, DataCrédito)
- ✅ **ProUsuario**: WhatsApp 809-731-3535 para quejas
- ✅ Protección contra usura
- ✅ Educación financiera garantizada

#### 💡 Consejos Financieros
1. **Regla 50/30/20**: 50% necesidades, 30% deseos, 20% ahorro
2. **Ahorra primero**: Automatiza tus ahorros mensuales
3. **Historial crediticio**: Paga a tiempo para mejores tasas
4. **Fondo de emergencia**: 3-6 meses de gastos guardados
5. **Evita deudas malas**: Diferencia inversión vs. consumo
6. **Edúcate constantemente**: Mejor inversión

### 📊 Dashboard Visual Profesional

**Diseño Moderno**:
- 🎨 Gradientes (#667eea → #764ba2)
- ✨ Glass morphism effects
- 🌓 Preparado para modo oscuro
- 📱 100% responsive

**Componentes**:
- 💰 Cards de estadísticas en tiempo real
- 📈 Gráfico de flujo de efectivo (Chart.js)
- 🍩 Gráfico de gastos por categoría
- 📋 Lista de transacciones recientes
- 🧭 Sidebar navigation profesional

### 🧭 Navegación Multi-Página

| Página | Descripción | Estado |
|--------|-------------|---------|
| 📊 Dashboard | Vista general, stats, gráficos | ✅ Completo |
| 💳 Transacciones | Gestión de ingresos/gastos | ✅ Completo |
| 🏦 Cuentas | Administración de cuentas | ✅ Completo |
| 💰 Préstamos | Calculadora y productos RD | ✅ Completo |
| 🎯 Presupuesto | Planificación financiera | 🚧 En desarrollo |
| 📚 Educación | Marco legal RD + ITBIS | ✅ Completo |
| 📈 Reportes | Análisis detallado | 🚧 En desarrollo |

---

## 🛠️ Stack Tecnológico

### Frontend
- **Vite 6.4.1**: Build tool ultrarrápido con HMR
- **Tailwind CSS 3+**: Utility-first CSS framework
- **Chart.js 4.4.1**: Visualizaciones interactivas
- **Google Fonts**: Inter (body), Poppins (display)

### Backend & Database
- **Firebase Auth**: Autenticación con Google + Email
- **Firestore**: Base de datos NoSQL en tiempo real
- **Firebase SDK 12.6.0**: Modular imports

### Diseño
- **Color Palette**: 
  - Primary: `#667eea` → `#764ba2` (gradient)
  - Success: `#10b981`
  - Warning: `#f59e0b`
  - Danger: `#ef4444`
- **Effects**: Glass morphism, smooth transitions
- **Icons**: Emoji-based (accesibilidad)

### Seguridad
- ✅ Snyk Code Scan (0 vulnerabilities)
- ✅ Firestore Security Rules
- ✅ Environment variables protection
- ✅ User-scoped data isolation

---

## 🚀 Inicio Rápido

### 1. Clonar repositorio

```powershell
git clone https://github.com/BlackSpaces0/Kodo.git
cd Kodo
```

### 2. Instalar dependencias

```powershell
npm install
```

### 3. Configurar Firebase

Crea un archivo `.env.local` en la raíz con tus credenciales:

```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123
```

### 4. Configurar Firestore

#### Activar Firestore
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Firestore Database → Create Database
4. Modo: **Production** (con reglas de seguridad)

#### Desplegar reglas de seguridad
```powershell
firebase deploy --only firestore:rules
```

**Reglas incluidas** (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data - solo el usuario autenticado
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcollections
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 5. Activar Authentication

En Firebase Console:
1. Authentication → Sign-in method
2. Activar **Google**
3. Activar **Email/Password**

### 6. Iniciar desarrollo

```powershell
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

### 7. Build para producción

```powershell
npm run build
```

Los archivos optimizados estarán en `/dist`.

---

## 📁 Estructura del Proyecto

```
Kodo/
├── src/
│   ├── main.js              # Entry point, Firebase init, Auth UI
│   ├── dashboard-new.js     # Dashboard principal con sidebar
│   └── dashboard.js         # Dashboard original (legacy)
├── public/                  # Assets estáticos
├── .env.local              # Variables de entorno (NO COMMITEAR)
├── .env.example            # Template de variables
├── firestore.rules         # Reglas de seguridad Firestore
├── firebase.json           # Configuración Firebase
├── index.html              # HTML principal con Tailwind
├── package.json            # Dependencies
└── vite.config.js          # Configuración Vite
```

---

## 🔒 Seguridad

### Implementado
- ✅ **Firestore Rules**: Datos aislados por usuario (`users/{uid}/...`)
- ✅ **Snyk Scanning**: 0 vulnerabilidades en código
- ✅ **Environment Variables**: Credenciales protegidas en `.env.local`
- ✅ **Auth Required**: Todas las operaciones requieren login
- ✅ **Input Validation**: Validación en frontend

### Próximos Pasos
- [ ] Rate limiting en operaciones
- [ ] Auditoría de logs
- [ ] 2FA opcional
- [ ] Backup automático Firestore

---

## 📊 Base de Datos Firestore

### Estructura de Datos

```
users/
  {userId}/
    accounts/
      {accountId}
        - name: string
        - balance: number
        - currency: string (DOP, USD, EUR)
        - type: string
        - createdAt: timestamp
    
    transactions/
      {transactionId}
        - type: string (income, expense)
        - description: string
        - amount: number
        - category: string
        - date: timestamp
        - createdAt: timestamp
    
    budgets/
      {budgetId}
        - category: string
        - limit: number
        - period: string
        - createdAt: timestamp
```

---

## 🎨 Personalización

### Cambiar Colores
Edita `index.html`, sección `tailwind.config`:

```javascript
colors: {
  primary: {
    DEFAULT: '#667eea',    // Tu color primario
    dark: '#764ba2',       // Variante oscura
    light: '#f0f4ff'       // Variante clara
  }
}
```

### Cambiar Fuentes
En `index.html`, sección de Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=TuFuente:wght@400;700&display=swap" rel="stylesheet">
```

---

## 🐛 Troubleshooting

### "Firebase config missing"
- Verifica que `.env.local` existe
- Verifica que las variables empiezan con `VITE_`
- Reinicia el servidor de desarrollo

### "Permission denied" en Firestore
- Verifica que las reglas están desplegadas: `firebase deploy --only firestore:rules`
- Verifica que el usuario está autenticado
- Revisa la consola de Firebase para errores

### Problemas con npm
```powershell
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Puerto en uso
Vite automáticamente buscará otro puerto. Si necesitas uno específico:

```powershell
npm run dev -- --port 3000
```

---

## 📝 Roadmap

### v1.0 (Actual)
- ✅ Autenticación completa
- ✅ Gestión de cuentas
- ✅ Transacciones
- ✅ Dashboard visual
- ✅ Calculadora préstamos RD
- ✅ Calculadora ITBIS
- ✅ Educación financiera RD

### v1.1 (Próximo)
- [ ] Sistema de presupuestos por categoría
- [ ] Reportes PDF exportables
- [ ] Notificaciones push
- [ ] Modo oscuro completo
- [ ] PWA (instalable)

### v1.2 (Futuro)
- [ ] Sincronización bancaria automática
- [ ] Análisis de gastos con ML
- [ ] Metas de ahorro
- [ ] Recordatorios de pagos
- [ ] Multi-idioma (EN, ES)

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m 'Add AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Abre un Pull Request

### Guías
- Usa conventional commits
- Escribe tests si es posible
- Documenta nuevas features
- Mantén el código limpio

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

## 👥 Autor

Desarrollado con ❤️ para la comunidad dominicana

- **GitHub**: [@BlackSpaces0](https://github.com/BlackSpaces0)
- **Proyecto**: [Kodo - Zenko Financial](https://github.com/BlackSpaces0/Kodo)

---

## 📞 Contacto y Soporte

### Recursos Financieros RD
- **ProUsuario**: WhatsApp 809-731-3535
- **Superintendencia de Bancos**: [www.sib.gob.do](https://www.sib.gob.do)
- **Banco Central RD**: [www.bancentral.gov.do](https://www.bancentral.gov.do)

### Recursos del Proyecto
- **Issues**: [GitHub Issues](https://github.com/BlackSpaces0/Kodo/issues)
- **Documentación**: Este README
- **Demo**: [Ver demo en vivo](#) (próximamente)

---

## 🙏 Agradecimientos

- [Firebase](https://firebase.google.com/) - Backend as a Service
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Chart.js](https://www.chartjs.org/) - Visualizaciones
- Comunidad de desarrolladores dominicanos

---

**¡Gracias por usar Zenko Financial!** 🦊💰

Si este proyecto te ayuda, considera darle una ⭐ en GitHub.
