# Kodo - Zenko Financial

Gestión financiera personal con claridad estratégica

## 🚀 Desarrollo Local

### Pre-requisitos
- Node.js 18+ 
- npm o yarn

### Configuración Inicial

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**
   
   ⚠️ **IMPORTANTE**: Nunca commitear el archivo `.env.local` con credenciales reales.
   
   Copia el archivo de ejemplo y configura tus credenciales de Firebase:
   ```bash
   cp .env.example .env.local
   ```
   
   Edita `.env.local` y reemplaza los valores con tus credenciales reales de Firebase:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```
   
   El servidor de desarrollo estará disponible en `http://localhost:5173`

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción localmente

## 🔒 Seguridad

- **NO commitear** archivos `.env.local` o cualquier archivo con credenciales reales
- Los archivos `.env.*.local` están incluidos en `.gitignore` por seguridad
- Usar siempre variables de entorno para credenciales sensibles

## 📁 Estructura del Proyecto

```
.
├── src/
│   └── main.js          # Punto de entrada, inicialización de Firebase
├── public/
│   └── original-index.html  # Backup del HTML original
├── index.html           # HTML principal
├── .env.example         # Plantilla de variables de entorno
├── .gitignore          # Archivos ignorados por Git
├── package.json        # Dependencias y scripts
└── README.md          # Este archivo
```

## 🛠️ Tecnologías

- **Vite** - Build tool y dev server
- **Firebase** - Backend as a Service (Auth, Firestore)
- **JavaScript** - Lenguaje principal

---

**Powered by Proyecto Kodō** 🦊
