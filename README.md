# Kodo

Zenko Financial - Gestión financiera personal con claridad estratégica

## 🚀 Configuración para Desarrolladores

### Prerrequisitos
- Node.js (v18 o superior)
- npm (incluido con Node.js)
- Cuenta de Firebase con un proyecto configurado

### Pasos para comenzar

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/BlackSpaces0/Kodo.git
   cd Kodo
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Copiar el archivo `.env.example` a `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Editar `.env.local` con tus credenciales reales de Firebase
   - Obtén las credenciales desde la consola de Firebase (Project Settings > General > Your apps)

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```
   - La aplicación estará disponible en `http://localhost:5173`

5. **Compilar para producción**
   ```bash
   npm run build
   ```
   - Los archivos compilados estarán en el directorio `dist/`

6. **Vista previa de producción**
   ```bash
   npm run preview
   ```

## ⚠️ Seguridad

- **NUNCA** commites el archivo `.env.local` al repositorio
- Las variables de entorno locales están excluidas en `.gitignore`
- Usa `.env.example` como plantilla (sin credenciales reales)

## 🛠️ Stack Tecnológico

- **Vite** - Build tool y servidor de desarrollo
- **Firebase** - Backend as a Service (Authentication, Firestore)
- **JavaScript (ES Modules)** - Lenguaje de programación

## 📁 Estructura del Proyecto

```
Kodo/
├── src/
│   └── main.js          # Punto de entrada principal, inicialización de Firebase
├── public/
│   └── original-index.html  # Backup del HTML original
├── index.html           # Punto de entrada HTML para Vite
├── package.json         # Dependencias y scripts
├── .env.example         # Plantilla de variables de entorno
├── .env.local          # Variables de entorno (NO commitear)
└── .gitignore          # Archivos excluidos del control de versiones
```

## 🦊 Proyecto Kodō

Powered by Proyecto Kodō - Claridad estratégica en tus finanzas personales.
