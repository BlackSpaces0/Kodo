# Contributing to Kodo - Zenko Financial

¡Gracias por tu interés en contribuir a Zenko Financial! 🎉

## 📋 Requisitos previos

- Node.js 18+ y npm 9+
- Git
- Cuenta de Firebase (para testing local)
- Editor de código (recomendado: VS Code)

## 🚀 Setup del proyecto

1. **Fork y clona el repositorio**
   ```bash
   git clone https://github.com/TU_USUARIO/Kodo.git
   cd Kodo
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   # Copia el archivo de ejemplo
   cp .env.example .env.local
   
   # Edita .env.local con tus credenciales de Firebase
   # NUNCA commitees este archivo
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

## 🔨 Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo en http://localhost:5173
- `npm run build` - Compila para producción en `/dist`
- `npm run preview` - Preview del build de producción

## 📝 Convenciones de código

### Commits
Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Formato de código (sin cambios funcionales)
- `refactor:` - Refactorización de código
- `test:` - Añadir o modificar tests
- `chore:` - Cambios en build, dependencias, etc.

**Ejemplos:**
```
feat: add user profile page
fix: resolve Firebase auth timeout issue
docs: update README with deployment steps
```

### Estilo de código
- Usamos Prettier para formateo (`.prettierrc` incluido)
- Indentación: 2 espacios
- Comillas simples para strings
- Semicolons obligatorios

## 🔐 Seguridad

- **NUNCA** commitees archivos con credenciales (`.env.local`, service accounts, tokens)
- Verifica que `.gitignore` está actualizado
- Ejecuta `npm audit` antes de hacer PR
- Los PRs deben pasar el scan de Snyk (ejecutado automáticamente)

## 🌿 Workflow de Git

1. **Crea una rama desde `main`**
   ```bash
   git checkout -b feature/tu-feature
   # o
   git checkout -b fix/tu-fix
   ```

2. **Haz commits pequeños y descriptivos**
   ```bash
   git add .
   git commit -m "feat: add login button component"
   ```

3. **Push a tu fork**
   ```bash
   git push origin feature/tu-feature
   ```

4. **Abre un Pull Request**
   - Ve a GitHub y abre un PR desde tu rama a `main`
   - Describe claramente qué hace tu cambio
   - Referencia issues relacionados si aplica

## ✅ Checklist antes de hacer PR

- [ ] El código compila sin errores (`npm run build`)
- [ ] El servidor de desarrollo arranca correctamente (`npm run dev`)
- [ ] No hay vulnerabilidades nuevas (`npm audit`)
- [ ] Los commits siguen Conventional Commits
- [ ] No se incluyeron archivos con secretos
- [ ] La documentación está actualizada (si aplica)
- [ ] Testeaste localmente los cambios

## 🐛 Reportar bugs

Si encuentras un bug:
1. Verifica que no esté reportado en Issues
2. Abre un nuevo Issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Información del entorno (OS, Node version, etc.)

## 💡 Sugerir features

Para sugerir nuevas funcionalidades:
1. Abre un Issue con etiqueta `enhancement`
2. Describe el problema que resolvería
3. Propón una solución o implementación
4. Explica por qué sería útil

## 📞 ¿Necesitas ayuda?

- Revisa [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para problemas comunes
- Abre un Issue con la etiqueta `question`
- Revisa la documentación en el README

## 📜 Código de conducta

- Sé respetuoso y constructivo
- Acepta feedback de forma positiva
- Ayuda a otros cuando puedas
- Mantén discusiones técnicas y profesionales

---

**¡Gracias por contribuir a Zenko Financial!** 🦊💰
