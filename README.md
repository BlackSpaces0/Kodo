# 🦊 Zenko Financial

```
    /\___/\
   ( o   o )
   (  =^=  )    ¡Claridad Estratégica en tus Finanzas!
    (------)
   /       \
  /  Zenko  \
 /___________ \
```

**Gestión Financiera Personal con la Filosofía Zenko**

Zenko Financial es una aplicación web moderna de gestión financiera personal que implementa la filosofía de "Claridad Estratégica". Construida como una Single Page Application (SPA), ofrece seguimiento de transacciones, presupuestos inteligentes, metas financieras, portafolio de inversiones y un innovador sistema de gamificación inspirado en el zorro de nueve colas (Kitsune).

---

## ✨ Características Principales

### 💰 Gestión Financiera Completa
- **Dashboard Intuitivo**: Visualiza tu situación financiera de un vistazo
- **Transacciones**: CRUD completo con filtros avanzados (fecha, cuenta, tipo, categoría)
- **Cuentas Múltiples**: Gestiona cuentas bancarias con diferentes monedas (MXN, USD, EUR, DOP)
- **Presupuestos Inteligentes**: Control de gastos por categoría con alertas visuales
- **Metas Financieras**: Define y alcanza objetivos vinculados a cuentas de ahorro
- **Inversiones**: Rastrea tu portafolio con cálculo automático de rendimiento
- **Suscripciones**: Control de pagos recurrentes con fechas de próximo pago

### 📊 Análisis y Reportes
- **Flujo de Caja**: Gráfico de 6 meses con ingresos vs gastos
- **Gastos por Categoría**: Visualización en gráfico de dona
- **Top Comerciantes**: Análisis de mayores gastos por establecimiento
- **Tendencias**: Identificación automática de patrones de gasto

### 🤖 Importador Inteligente
- Parser de texto/CSV de estados de cuenta
- Categorización automática con IA simulada
- Revisión antes de importar transacciones en lote
- Compatible con múltiples formatos bancarios

### 🎮 Sistema de Gamificación "The Zenko Way"
- **Sistema XP y Niveles**: Gana experiencia por cada acción financiera
- **Avatar Progresivo**: Zorro Kitsune con 1-9 colas según tu nivel
- **Logros Desbloqueables**: 
  - 🏁 "Primer Paso" - Primera transacción
  - 💯 "Centurión" - 100 transacciones
  - 🎯 "Objetivo Cumplido" - Primera meta completada
  - 🏆 "Maestro del Presupuesto" - 3 meses sin exceder presupuesto
- **Recompensas por Acción**:
  - +10 XP por transacción
  - +50 XP por crear cuenta
  - +100 XP por completar meta
  - +25 XP por crear presupuesto

### 🎨 Diseño y UX
- **Responsive**: Optimizado para móvil, tablet y desktop
- **Tema Zenko**: Gradientes morados y rosas personalizados
- **Animaciones Suaves**: Transiciones fluidas entre estados
- **Iconografía Emoji**: Interfaz visual amigable
- **Dark Mode Ready**: Preparado para tema oscuro (futuro)

---

## 🛠️ Stack Tecnológico

### Frontend
- **HTML5** - Estructura semántica
- **JavaScript ES6+** - Vanilla JS con programación reactiva
- **Tailwind CSS 3.x** - Diseño utility-first vía CDN
- **Chart.js 4.x** - Visualizaciones de datos
- **Flatpickr** - Selector de fechas

### Backend
- **Firebase Authentication** - Gestión de usuarios
- **Cloud Firestore** - Base de datos NoSQL en tiempo real
- **Firebase Hosting** - Despliegue y hosting

### Arquitectura
- **SPA (Single Page Application)** - Navegación sin recarga
- **Estado Reactivo** - Sincronización automática con Firestore
- **Real-time Listeners** - `onSnapshot` para actualizaciones en vivo
- **Atomic Operations** - `writeBatch` para transacciones complejas

---

## 🚀 Configuración e Instalación

### Prerrequisitos
- Cuenta de Google/Gmail
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Editor de texto (VS Code recomendado)

### Paso 1: Configurar Firebase

1. **Crear Proyecto en Firebase**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Clic en "Agregar proyecto"
   - Nombre: "Zenko Financial" (o el que prefieras)
   - Deshabilita Google Analytics (opcional)

2. **Habilitar Firebase Authentication**
   - En el menú lateral: `Build` → `Authentication`
   - Clic en "Comenzar"
   - Pestaña "Sign-in method"
   - Habilita "Correo electrónico/contraseña"

3. **Crear Base de Datos Firestore**
   - En el menú lateral: `Build` → `Firestore Database`
   - Clic en "Crear base de datos"
   - Modo: "Empezar en modo de prueba" (o configura reglas de seguridad)
   - Ubicación: Elige la más cercana a ti

4. **Obtener Credenciales**
   - Ve a Configuración del proyecto (ícono de engranaje)
   - Sección "Tus apps" → Clic en `</>`  (icono web)
   - Registra la app: "Zenko Financial Web"
   - **NO** configures Firebase Hosting por ahora
   - Copia el objeto `firebaseConfig`

5. **Configurar en el Código**
   - Abre `index.html`
   - Busca la sección `// Firebase Configuration`
   - Reemplaza el objeto `firebaseConfig` con tus credenciales:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Paso 2: Ejecutar la Aplicación

**Opción A: Servidor Local Simple**
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (si tienes http-server instalado)
npx http-server -p 8000
```

Abre: `http://localhost:8000`

**Opción B: Live Server (VS Code)**
1. Instala la extensión "Live Server"
2. Clic derecho en `index.html` → "Open with Live Server"

**Opción C: Abrir Directamente**
- Doble clic en `index.html` (algunas funcionalidades pueden no funcionar por CORS)

### Paso 3: Crear tu Primera Cuenta

1. En la pantalla de login, ve a la pestaña "Registro"
2. Ingresa email y contraseña (mínimo 6 caracteres)
3. Clic en "Crear Cuenta"
4. ¡Listo! Serás redirigido al Dashboard

---

## 📁 Estructura de la Base de Datos

### Colecciones en Firestore

```
/users/{userId}/
│
├── user_profile (Documento único)
│   └── {
│       nivel: 1,
│       xp: 0,
│       nextLevelXP: 100,
│       logros: {
│         primerPaso: false,
│         centurion: false,
│         objetivoCumplido: false,
│         maestroPresupuesto: false
│       }
│     }
│
├── bancos/ (Colección)
│   └── {bancoId}
│       ├── id: string
│       ├── nombre: string
│       ├── tipo: string (ej: "Bancario", "Digital")
│       └── timestamp: Date
│
├── cuentas/ (Colección)
│   └── {cuentaId}
│       ├── id: string
│       ├── bankId: string (referencia a bancos)
│       ├── nombre: string
│       ├── numero: string (últimos 4 dígitos)
│       ├── moneda: string ("MXN" | "USD" | "EUR" | "DOP")
│       ├── saldo: number
│       ├── color: string (gradiente CSS)
│       └── timestamp: Date
│
├── categorias/ (Colección)
│   └── {categoriaId}
│       ├── id: string
│       ├── nombre: string
│       ├── icono: string (emoji)
│       ├── tipo: string ("ingreso" | "gasto")
│       └── timestamp: Date
│
├── transacciones/ (Colección)
│   └── {transaccionId}
│       ├── id: string
│       ├── accountId: string (referencia a cuentas)
│       ├── nombre: string (descripción)
│       ├── comerciante: string (nombre del negocio)
│       ├── monto: number
│       ├── tipo: string ("ingreso" | "gasto")
│       ├── categoria: string (nombre de categoría)
│       ├── fecha: Date
│       ├── metodoPago: string ("Efectivo" | "Tarjeta" | "Transferencia")
│       ├── tipoTarjeta: string ("Crédito" | "Débito" | null)
│       └── timestamp: Date
│
├── presupuestos/ (Colección)
│   └── {nombreCategoria} (ID = nombre de categoría)
│       └── total: number (límite mensual)
│
├── objetivos/ (Colección)
│   └── {objetivoId}
│       ├── id: string
│       ├── nombre: string
│       ├── icono: string (emoji)
│       ├── targetAmount: number
│       ├── linkedAccountId: string (cuenta de ahorro vinculada)
│       └── timestamp: Date
│
├── inversiones/ (Colección)
│   └── {inversionId}
│       ├── id: string
│       ├── nombre: string
│       ├── simbolo: string (ticker)
│       ├── icono: string (emoji)
│       ├── cantidad: number
│       ├── precio: number (precio de compra)
│       └── timestamp: Date
│
└── suscripciones/ (Colección)
    └── {suscripcionId}
        ├── id: string
        ├── nombre: string
        ├── icono: string (emoji)
        ├── monto: number
        ├── proximaFecha: Date
        └── timestamp: Date
```

### Reglas de Seguridad Recomendadas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Los usuarios solo pueden acceder a sus propios datos
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🌐 Despliegue

### Firebase Hosting (Recomendado)

1. **Instalar Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login**
```bash
firebase login
```

3. **Inicializar Hosting**
```bash
firebase init hosting
```
- Selecciona tu proyecto
- Public directory: `.` (directorio actual)
- Configure as SPA: `Yes`
- Overwrite index.html: `No`

4. **Desplegar**
```bash
firebase deploy --only hosting
```

Tu app estará en: `https://tu-proyecto.web.app`

### Netlify

1. Arrastra el archivo `index.html` a [Netlify Drop](https://app.netlify.com/drop)
2. O conecta tu repositorio de GitHub

### Vercel

```bash
npx vercel
```

### GitHub Pages

1. Ve a Settings → Pages
2. Source: Deploy from branch
3. Branch: `main` o `master`
4. Folder: `/ (root)`

---

## 📱 Capturas Conceptuales

### Dashboard Principal
```
┌─────────────────────────────────────────┐
│  🦊 Zenko Financial                     │
├─────────────────────────────────────────┤
│  💰 $45,230.00  ↗️ $8,500  ↘️ $3,200   │
│  Saldo Total    Ingresos   Gastos       │
├─────────────────────────────────────────┤
│  [💳 Santander ****1234  $25,400]      │
│  [💳 BBVA ****5678       $19,830]      │
├─────────────────────────────────────────┤
│  📊 Flujo de Caja (6 meses)            │
│     [Gráfico de barras]                 │
├─────────────────────────────────────────┤
│  📝 Transacciones Recientes             │
│  • Walmart         -$450.00             │
│  • Nómina          +$8,500.00           │
│  • Netflix         -$199.00             │
└─────────────────────────────────────────┘
```

### Sistema de Gamificación
```
┌─────────────────────────────────────────┐
│  🦊 Tu Progreso Zenko                   │
├─────────────────────────────────────────┤
│           🦊🦊🦊                        │
│        Nivel 3 - Zenko Aprendiz         │
│     ████████████░░░░ 280/500 XP         │
├─────────────────────────────────────────┤
│  Logros Desbloqueados:                  │
│  ✅ 🏁 Primer Paso                      │
│  ✅ 🎯 Objetivo Cumplido                │
│  ⬜ 💯 Centurión (45/100)               │
│  ⬜ 🏆 Maestro del Presupuesto          │
└─────────────────────────────────────────┘
```

---

## 🎯 Roadmap

### Versión 1.0 (Actual)
- ✅ Sistema de autenticación
- ✅ Gestión de transacciones
- ✅ Presupuestos y metas
- ✅ Inversiones y suscripciones
- ✅ Reportes básicos
- ✅ Gamificación

### Versión 1.1 (Próximo)
- [ ] Modo oscuro
- [ ] Exportar datos a CSV/PDF
- [ ] Recordatorios de pagos
- [ ] Calculadora de interés compuesto

### Versión 2.0 (Futuro)
- [ ] Integración con APIs bancarias reales
- [ ] Reconocimiento OCR de tickets
- [ ] Compartir presupuestos en familia
- [ ] App móvil (React Native/Flutter)
- [ ] Asesor financiero con IA real

---

## 🤝 Contribución

¿Quieres mejorar Zenko Financial? ¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agrega nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

---

## 🙏 Créditos

- **Concepto Original**: Proyecto Kodō
- **Filosofía**: Inspirado en el Kitsune (zorro de nueve colas) japonés
- **Iconografía**: Emojis nativos del sistema
- **Librerías**:
  - [Firebase](https://firebase.google.com/) - Backend y autenticación
  - [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
  - [Chart.js](https://www.chartjs.org/) - Visualizaciones
  - [Flatpickr](https://flatpickr.js.org/) - Date picker

---

## 💬 Soporte

¿Necesitas ayuda? Abre un [Issue](../../issues) en GitHub.

---

<div align="center">

**Hecho con 💜 por la comunidad Zenko**

🦊 *"Claridad Estratégica en cada decisión financiera"* 🦊

[⬆ Volver arriba](#-zenko-financial)

</div>
