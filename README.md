# Learning Platform

Una aplicación React estática para aprender tecnologías de desarrollo web modernas a través de guías interactivas en markdown.

## 🚀 Características

- **Landing Page** con navegación clara entre secciones
- **Start Learning** - Exploración de guías técnicas interactivas
- **Búsqueda en tiempo real** por conceptos específicos
- **Índice de contenido** navegable en la barra lateral
- **Soporte multiidioma** (Inglés/Español)
- **Ejemplos de código** que se pueden mostrar/ocultar
- **Deployment automático** en GitHub Pages

## 📚 Tecnologías Incluidas

### Next.js
- App Router
- Server Components
- Middleware
- Static Site Generation (SSG)
- API Routes

### NestJS
- Controllers
- Services
- Modules
- Guards
- Middleware
- Pipes

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework frontend
- **Vite** - Build tool y dev server
- **React Router** - Navegación SPA
- **React Markdown** - Renderizado de archivos MD
- **GitHub Pages** - Hosting estático
- **GitHub Actions** - CI/CD automático

## 📁 Estructura del Proyecto

```
learning/
├── public/
│   └── guides/           # Archivos markdown de las guías
│       ├── next-en.md    # Next.js en inglés
│       ├── next-es.md    # Next.js en español
│       ├── nest-en.md    # NestJS en inglés
│       └── nest-es.md    # NestJS en español
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── SearchBar.jsx
│   │   ├── TopicSelector.jsx
│   │   ├── LanguageToggle.jsx
│   │   └── ContentIndex.jsx
│   ├── pages/           # Páginas principales
│   │   ├── HomePage.jsx
│   │   └── StartLearning.jsx
│   └── App.jsx
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions para deployment
└── package.json
```

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+
- npm

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/silvanatrabalon/learning.git
   cd learning
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173/learning/
   ```

## 📝 Agregar Nuevas Guías

Para agregar una nueva tecnología:

1. **Crear los archivos markdown**
   ```bash
   public/guides/nueva-tecnologia-en.md
   public/guides/nueva-tecnologia-es.md
   ```

2. **Seguir el formato de estructura**
   ```markdown
   # Nombre de la Tecnología
   
   ## Concepto 1
   **Description/Descripción:** Explicación del concepto
   
   **Example/Ejemplo:**
   ```código```
   
   **Comparison/Comparación:** Comparación con otros conceptos
   ```

3. **Actualizar el array de topics en StartLearning.jsx**
   ```javascript
   const topics = [
     { id: 'next', name: 'Next.js', icon: '⚛️' },
     { id: 'nest', name: 'NestJS', icon: '🪶' },
     { id: 'nueva-tecnologia', name: 'Nueva Tecnología', icon: '🆕' }
   ]
   ```

## 🌐 Deployment en GitHub Pages

El proyecto está configurado para deployment automático:

### Configuración Manual (primera vez)

1. **Configurar GitHub Pages**
   - Ve a Settings → Pages
   - Source: GitHub Actions

2. **Deploy manual**
   ```bash
   npm run build
   npm run deploy
   ```

### Deployment Automático

El proyecto incluye GitHub Actions que deployea automáticamente:
- En cada push a la rama `main`
- Ejecuta tests, build y deployment
- Disponible en: `https://silvanatrabalon.github.io/learning`

## 🎯 Cómo Usar la Aplicación

### Landing Page
- Navega entre "Start Learning" y "Test Knowledge" (próximamente)

### Start Learning
1. **Selecciona un tema** (Next.js o NestJS)
2. **Cambia el idioma** usando el toggle EN/ES
3. **Busca conceptos** usando la barra de búsqueda
4. **Navega el índice** en la barra lateral
5. **Muestra/oculta ejemplos** con el botón correspondiente

### Características de Búsqueda
- Búsqueda en tiempo real
- Coincidencia parcial de títulos
- Resultados clickeables

## 🔧 Comandos Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Preview del build
npm run deploy     # Deploy manual a GitHub Pages
npm run lint       # Linter de código
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🚧 Roadmap

- [ ] Página "Test Knowledge" con quizzes interactivos
- [ ] Más tecnologías (React, Angular, Vue, etc.)
- [ ] Sistema de favoritos
- [ ] Historial de conceptos visitados
- [ ] Comentarios y ratings en conceptos
- [ ] Dark mode
- [ ] Versión PWA

## 📞 Contacto

- GitHub: [@silvanatrabalon](https://github.com/silvanatrabalon)
- Proyecto: [Learning Platform](https://github.com/silvanatrabalon/learning)

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
