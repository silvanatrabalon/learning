# Guía de Accesibilidad Web

## Meta Tags y SEO Básico
**Descripción:** Meta tags que mejoran la accesibilidad y SEO, proporcionando información estructurada para navegadores, buscadores y tecnologías asistivas.

**Ejemplo:**
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <!-- Meta tags básicos para accesibilidad -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Descripción clara y concisa de la página">
  <meta name="keywords" content="palabras, clave, relevantes">
  <meta name="author" content="Nombre del autor">
  
  <!-- Robots y crawling -->
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow, snippet, archive">
  
  <!-- Open Graph para redes sociales -->
  <meta property="og:title" content="Título de la página">
  <meta property="og:description" content="Descripción para redes sociales">
  <meta property="og:image" content="https://ejemplo.com/imagen.jpg">
  <meta property="og:url" content="https://ejemplo.com/pagina">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Nombre del sitio">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Título de la página">
  <meta name="twitter:description" content="Descripción para Twitter">
  <meta name="twitter:image" content="https://ejemplo.com/imagen.jpg">
  
  <!-- Título accesible -->
  <title>Título Descriptivo - Nombre del Sitio</title>
</head>
<body>
  <!-- Contenido -->
</body>
</html>

<!-- robots.txt -->
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Sitemap: https://ejemplo.com/sitemap.xml

<!-- sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ejemplo.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**Comparación:** Meta tags vs Sin meta tags - Los meta tags mejoran SEO, accesibilidad y experiencia en redes sociales, mientras que sin ellos el contenido es menos discoverable y accesible.

## HTML Semántico y Structured Data
**Descripción:** Uso de elementos HTML semánticos y schemas estructurados que proporcionan significado y contexto al contenido para navegadores y tecnologías asistivas.

**Ejemplo:**
```html
<!-- HTML Semántico -->
<header>
  <nav aria-label="Navegación principal">
    <ul>
      <li><a href="/" aria-current="page">Inicio</a></li>
      <li><a href="/productos">Productos</a></li>
      <li><a href="/contacto">Contacto</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <header>
      <h1>Título Principal del Artículo</h1>
      <time datetime="2024-01-15">15 de enero, 2024</time>
      <address>Por <a href="/autor">Juan Pérez</a></address>
    </header>
    
    <section>
      <h2>Sección del Contenido</h2>
      <p>Párrafo con contenido relevante...</p>
      
      <figure>
        <img src="grafico.jpg" alt="Gráfico mostrando ventas del Q1 2024">
        <figcaption>Ventas trimestrales aumentaron 25%</figcaption>
      </figure>
    </section>
    
    <aside>
      <h3>Información Relacionada</h3>
      <p>Contenido complementario...</p>
    </aside>
  </article>
</main>

<footer>
  <p>&copy; 2024 Mi Empresa. Todos los derechos reservados.</p>
</footer>

<!-- Structured Data (JSON-LD) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Título Principal del Artículo",
  "author": {
    "@type": "Person",
    "name": "Juan Pérez"
  },
  "datePublished": "2024-01-15",
  "description": "Descripción del artículo",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://ejemplo.com/articulo"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Mi Empresa",
    "logo": {
      "@type": "ImageObject",
      "url": "https://ejemplo.com/logo.jpg"
    }
  }
}
</script>

<!-- Schema para productos -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Producto Ejemplo",
  "description": "Descripción del producto",
  "brand": {
    "@type": "Brand",
    "name": "Marca"
  },
  "offers": {
    "@type": "Offer",
    "price": "99.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

**Comparación:** HTML Semántico vs Divs genéricos - El HTML semántico proporciona estructura y significado para screen readers y SEO, mientras que divs genéricos solo proporcionan styling sin contexto semántico.

## ARIA Roles y Navegación por Teclado
**Descripción:** Atributos ARIA y técnicas de navegación que hacen las aplicaciones web accesibles para usuarios con discapacidades, especialmente para screen readers y navegación por teclado.

**Ejemplo:**
```html
<!-- ARIA Roles y Properties -->
<div role="banner">
  <h1>Mi Aplicación Web</h1>
</div>

<nav role="navigation" aria-label="Navegación principal">
  <ul role="menubar">
    <li role="none">
      <a href="/" role="menuitem" aria-current="page">Inicio</a>
    </li>
    <li role="none">
      <a href="/productos" role="menuitem">Productos</a>
    </li>
  </ul>
</nav>

<!-- Formularios accesibles -->
<form role="form" aria-labelledby="form-title">
  <h2 id="form-title">Información de Contacto</h2>
  
  <div>
    <label for="nombre">Nombre Completo *</label>
    <input 
      type="text" 
      id="nombre" 
      name="nombre"
      required 
      aria-required="true"
      aria-describedby="nombre-ayuda"
    >
    <div id="nombre-ayuda">Ingresa tu nombre y apellido</div>
  </div>
  
  <div>
    <label for="email">Email *</label>
    <input 
      type="email" 
      id="email" 
      name="email"
      required 
      aria-required="true"
      aria-invalid="false"
    >
    <div id="email-error" role="alert" aria-live="polite" hidden>
      Por favor ingresa un email válido
    </div>
  </div>
  
  <fieldset>
    <legend>Método de Contacto Preferido</legend>
    <input type="radio" id="contacto-email" name="contacto" value="email">
    <label for="contacto-email">Email</label>
    
    <input type="radio" id="contacto-telefono" name="contacto" value="telefono">
    <label for="contacto-telefono">Teléfono</label>
  </fieldset>
  
  <button type="submit" aria-describedby="submit-help">
    Enviar Formulario
  </button>
  <div id="submit-help">Presiona Enter o haz clic para enviar</div>
</form>

<!-- Modal accesible -->
<div 
  role="dialog" 
  aria-modal="true" 
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  tabindex="-1"
>
  <h2 id="modal-title">Confirmar Acción</h2>
  <p id="modal-description">¿Estás seguro de que quieres continuar?</p>
  
  <button type="button" aria-label="Cerrar modal">×</button>
  <button type="button">Cancelar</button>
  <button type="button">Confirmar</button>
</div>

<!-- Navegación por teclado -->
<script>
// Tab order management
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    // Asegurar orden lógico de tabulación
    console.log('Tab navigation:', document.activeElement);
  }
  
  if (e.key === 'Escape' && document.querySelector('[role="dialog"]')) {
    // Cerrar modal con Escape
    closeModal();
  }
});

// Skip to main content
function skipToMain() {
  document.getElementById('main-content').focus();
}
</script>

<!-- Skip link -->
<a href="#main-content" class="skip-link">
  Saltar al contenido principal
</a>
```

**Comparación:** ARIA vs Solo HTML - ARIA proporciona información semántica adicional para tecnologías asistivas cuando HTML semántico no es suficiente, mientras que solo HTML puede ser limitado para aplicaciones interactivas complejas.

## Screen Readers y Contraste
**Descripción:** Optimización para lectores de pantalla (JAWS, NVDA, VoiceOver) y técnicas de contraste que aseguran que el contenido sea perceptible para usuarios con discapacidades visuales.

**Ejemplo:**
```html
<!-- Optimización para Screen Readers -->
<img 
  src="grafico-ventas.png" 
  alt="Gráfico de barras mostrando crecimiento de ventas del 25% en Q1 2024"
  longdesc="detailed-description.html"
>

<!-- Imagen decorativa -->
<img src="decoracion.png" alt="" role="presentation">

<!-- Contenido que se actualiza dinámicamente -->
<div 
  id="status-messages" 
  role="status" 
  aria-live="polite"
  aria-atomic="true"
>
  <!-- Los mensajes aparecerán aquí -->
</div>

<!-- Tabla accesible -->
<table>
  <caption>Ventas por Trimestre 2024</caption>
  <thead>
    <tr>
      <th scope="col">Trimestre</th>
      <th scope="col">Ventas (USD)</th>
      <th scope="col">Crecimiento</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Q1</th>
      <td>$125,000</td>
      <td>+25%</td>
    </tr>
  </tbody>
</table>

<!-- CSS para contraste y visibilidad -->
<style>
/* Contraste WCAG AA: mínimo 4.5:1 */
.high-contrast {
  background-color: #000000; /* Negro */
  color: #ffffff; /* Blanco */
  /* Ratio: 21:1 - Cumple WCAG AAA */
}

.medium-contrast {
  background-color: #333333; /* Gris oscuro */
  color: #ffffff; /* Blanco */
  /* Ratio: 12.6:1 - Cumple WCAG AA */
}

/* Focus visible para navegación por teclado */
:focus {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* Skip link styling */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .card {
    border: 2px solid currentColor;
  }
}

/* Font size preferences */
@media (min-resolution: 2dppx) {
  body {
    font-size: 18px; /* Larger base font for high-DPI */
  }
}
</style>

<script>
// Screen reader testing helpers
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = message;
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Usage
announceToScreenReader('Formulario enviado exitosamente');
</script>
```

**Comparación:** Optimizado para screen readers vs Sin optimización - El contenido optimizado proporciona contexto rico y navegación eficiente para usuarios de lectores de pantalla, mientras que sin optimización puede ser confuso o inaccesible.

## Herramientas de Auditoría y Testing
**Descripción:** Herramientas y técnicas para auditar y probar la accesibilidad web, incluyendo automated testing, performance audits y Core Web Vitals.

**Ejemplo:**
```javascript
// Axe Core - Automated accessibility testing
import axe from 'axe-core';

// Test de accesibilidad básico
axe.run(document, {
  rules: {
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'aria-labels': { enabled: true }
  }
}).then(results => {
  if (results.violations.length > 0) {
    console.error('Accessibility violations found:', results.violations);
    results.violations.forEach(violation => {
      console.log(`Rule: ${violation.id}`);
      console.log(`Impact: ${violation.impact}`);
      console.log(`Description: ${violation.description}`);
      violation.nodes.forEach(node => {
        console.log(`Element: ${node.html}`);
      });
    });
  } else {
    console.log('No accessibility violations found!');
  }
});

// Lighthouse CI configuration
// .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:performance': ['warn', {minScore: 0.8}],
        'categories:seo': ['error', {minScore: 0.9}],
        'first-contentful-paint': ['error', {maxNumericValue: 2000}],
        'largest-contentful-paint': ['error', {maxNumericValue: 2500}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
      },
    },
  },
};

// Core Web Vitals monitoring
function measureWebVitals() {
  // First Contentful Paint (FCP)
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        console.log('FCP:', entry.startTime);
      }
    }
  }).observe({entryTypes: ['paint']});

  // Largest Contentful Paint (LCP)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
  }).observe({entryTypes: ['largest-contentful-paint']});

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        console.log('CLS:', clsValue);
      }
    }
  }).observe({entryTypes: ['layout-shift']});

  // First Input Delay (FID)
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('FID:', entry.processingStart - entry.startTime);
    }
  }).observe({entryTypes: ['first-input']});
}

// Contrast checking function
function checkContrast(foreground, background) {
  function getLuminance(color) {
    const rgb = color.match(/\d+/g).map(Number);
    const [r, g, b] = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  return {
    ratio: ratio.toFixed(2),
    AA: ratio >= 4.5,
    AAA: ratio >= 7
  };
}

// Usage
const result = checkContrast('rgb(0, 0, 0)', 'rgb(255, 255, 255)');
console.log('Contrast ratio:', result.ratio); // 21:1
console.log('WCAG AA compliant:', result.AA); // true
console.log('WCAG AAA compliant:', result.AAA); // true

measureWebVitals();
```

**Comparación:** Auditoría automatizada vs Manual testing - Las herramientas automatizadas detectan problemas comunes rápidamente, mientras que el testing manual con usuarios reales y screen readers proporciona insights más profundos sobre usabilidad real.
