# Guía de Aprendizaje HTML

## Estructura de Documento y Doctypes
**Descripción:** Los documentos HTML requieren una estructura adecuada y declaración DOCTYPE para asegurar renderizado correcto y compatibilidad con estándares en todos los navegadores.
**Ejemplo:**
```html
<!-- DOCTYPE HTML5 (recomendado) -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Descripción de la página para SEO">
    <title>Título de la Página</title>
</head>
<body>
    <main>
        <!-- El contenido principal va aquí -->
    </main>
</body>
</html>

<!-- DOCTYPEs legacy (evitar en proyectos nuevos) -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<!-- Elementos de estructura del documento -->
<html>
  <head>
    <!-- Metadatos del documento - no visible para usuarios -->
  </head>
  <body>
    <!-- Contenido del documento - visible para usuarios -->
  </body>
</html>
```

## Metadatos del Documento
**Descripción:** Los elementos meta proporcionan información sobre el documento HTML que no se muestra en la página pero es utilizada por navegadores, motores de búsqueda y otros servicios.
**Ejemplo:**
```html
<head>
    <!-- Codificación de caracteres (debe ser primero) -->
    <meta charset="UTF-8">
    
    <!-- Viewport para diseño responsivo -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Metadatos SEO -->
    <meta name="description" content="Aprende fundamentos de HTML con ejemplos prácticos">
    <meta name="keywords" content="HTML, desarrollo web, marcado">
    <meta name="author" content="Tu Nombre">
    
    <!-- Metadatos de redes sociales (Open Graph) -->
    <meta property="og:title" content="Guía de Aprendizaje HTML">
    <meta property="og:description" content="Tutorial completo de HTML">
    <meta property="og:image" content="https://ejemplo.com/imagen.jpg">
    <meta property="og:url" content="https://ejemplo.com/guia-html">
    
    <!-- Metadatos Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Guía de Aprendizaje HTML">
    <meta name="twitter:description" content="Aprende fundamentos de HTML">
    
    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    
    <!-- Precargar recursos críticos -->
    <link rel="preload" href="critico.css" as="style">
    <link rel="preload" href="imagen-hero.jpg" as="image">
    
    <!-- DNS prefetch para dominios externos -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//cdn.ejemplo.com">
    
    <!-- URL canónica para SEO -->
    <link rel="canonical" href="https://ejemplo.com/guia-html">
    
    <!-- Alternativas de idioma -->
    <link rel="alternate" hreflang="en" href="https://ejemplo.com/en/html-guide">
    <link rel="alternate" hreflang="fr" href="https://ejemplo.com/fr/guide-html">
    
    <!-- Feeds RSS/Atom -->
    <link rel="alternate" type="application/rss+xml" title="RSS del Blog" href="/feed.rss">
    
    <!-- Hojas de estilo -->
    <link rel="stylesheet" href="estilos.css">
    <link rel="stylesheet" href="impresion.css" media="print">
    
    <!-- Actualización HTTP (evitar en la mayoría de casos) -->
    <meta http-equiv="refresh" content="300">
    
    <!-- Control de caché -->
    <meta http-equiv="cache-control" content="no-cache">
    
    <!-- Título de la página -->
    <title>Guía de Aprendizaje HTML - Tutorial de Desarrollo Web</title>
</head>
```

## Marcado Semántico
**Descripción:** HTML semántico usa elementos que describen claramente su significado tanto para navegadores como desarrolladores, mejorando accesibilidad, SEO y mantenibilidad del código.
**Ejemplo:**
```html
<!-- Estructura semántica de página -->
<main>
    <header>
        <nav>
            <ul>
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#acerca">Acerca de</a></li>
                <li><a href="#contacto">Contacto</a></li>
            </ul>
        </nav>
    </header>

    <section id="inicio">
        <h1>Bienvenido a Nuestro Sitio Web</h1>
        <p>Esta es el área de contenido principal.</p>
        
        <article>
            <header>
                <h2>Título del Artículo</h2>
                <time datetime="2024-01-15">15 de enero de 2024</time>
                <address>Por <a href="mailto:autor@ejemplo.com">Juan Autor</a></address>
            </header>
            
            <p>El contenido del artículo va aquí...</p>
            
            <aside>
                <h3>Enlaces Relacionados</h3>
                <ul>
                    <li><a href="#relacionado1">Artículo Relacionado 1</a></li>
                    <li><a href="#relacionado2">Artículo Relacionado 2</a></li>
                </ul>
            </aside>
            
            <footer>
                <small>Publicado bajo Licencia Creative Commons</small>
            </footer>
        </article>
    </section>

    <footer>
        <p>&copy; 2024 Nombre de la Empresa. Todos los derechos reservados.</p>
    </footer>
</main>

<!-- Elementos de texto semántico -->
<p>Esto es <strong>texto importante</strong> y esto es <em>texto enfatizado</em>.</p>
<p>La reunión es el <time datetime="2024-12-25">Día de Navidad</time>.</p>
<p>Presiona <kbd>Ctrl</kbd> + <kbd>C</kbd> para copiar.</p>
<p>La función <code>console.log()</code> imprime en la consola.</p>
<p>Él dijo <q cite="https://ejemplo.com">Esta es una cita</q>.</p>

<blockquote cite="https://ejemplo.com/cita">
    <p>Esta es una cita más larga que se presenta sola como elemento de bloque.</p>
    <cite>Nombre del Autor</cite>
</blockquote>

<!-- Listas de definición -->
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language - el lenguaje de marcado estándar para páginas web</dd>
    
    <dt>CSS</dt>
    <dd>Cascading Style Sheets - usado para dar estilo a páginas web</dd>
    
    <dt>JavaScript</dt>
    <dd>Lenguaje de programación usado para crear contenido web dinámico</dd>
</dl>

<!-- Details y summary para contenido expandible -->
<details>
    <summary>Clic para expandir</summary>
    <p>Este contenido está inicialmente oculto y puede alternarse haciendo clic en el resumen.</p>
</details>

<!-- Figura con título -->
<figure>
    <img src="diagrama.png" alt="Diagrama de arquitectura del sistema">
    <figcaption>Figura 1: Vista general de la arquitectura del sistema</figcaption>
</figure>

<!-- Mark para resaltado -->
<p>Resultados de búsqueda para <mark>"elementos semánticos HTML"</mark> muestran muchos recursos.</p>

<!-- Elementos progress y meter -->
<progress value="70" max="100">70%</progress>
<meter value="8" min="0" max="10">8 de 10</meter>
```

## Elementos de Sección
**Descripción:** Los elementos de sección de HTML5 ayudan a estructurar el contenido lógicamente y mejorar el esquema del documento, accesibilidad y SEO.
**Ejemplo:**
```html
<!-- Esquema de documento con secciones apropiadas -->
<body>
    <!-- Navegación principal -->
    <header role="banner">
        <h1>Título del Sitio Web</h1>
        <nav role="navigation" aria-label="Navegación principal">
            <ul>
                <li><a href="#seccion1">Sección 1</a></li>
                <li><a href="#seccion2">Sección 2</a></li>
            </ul>
        </nav>
    </header>

    <!-- Contenido principal -->
    <main role="main">
        <!-- Sección independiente -->
        <section id="seccion1">
            <h2>Sección Principal</h2>
            <p>Esta sección contiene contenido relacionado.</p>
            
            <!-- Sección anidada -->
            <section>
                <h3>Subsección</h3>
                <p>Contenido anidado dentro de la sección principal.</p>
            </section>
        </section>

        <!-- Contenido autocontenido -->
        <article>
            <header>
                <h2>Título de Entrada de Blog</h2>
                <time datetime="2024-01-15">15 de enero de 2024</time>
            </header>
            
            <p>Este artículo podría existir por sí solo y ser sindicado.</p>
            
            <!-- Contenido relacionado pero separado -->
            <aside>
                <h3>Biografía del Autor</h3>
                <p>Información sobre el autor...</p>
            </aside>
            
            <footer>
                <p>Etiquetas: <a href="#etiqueta1">HTML</a>, <a href="#etiqueta2">Desarrollo Web</a></p>
            </footer>
        </article>

        <!-- Otra sección independiente -->
        <section id="seccion2">
            <h2>Productos</h2>
            
            <!-- Múltiples artículos dentro de una sección -->
            <article>
                <h3>Producto 1</h3>
                <p>Descripción del producto 1...</p>
            </article>
            
            <article>
                <h3>Producto 2</h3>
                <p>Descripción del producto 2...</p>
            </article>
        </section>
    </main>

    <!-- Contenido de barra lateral -->
    <aside role="complementary">
        <h2>Barra Lateral</h2>
        <nav aria-label="Navegación secundaria">
            <ul>
                <li><a href="#enlace1">Enlace Rápido 1</a></li>
                <li><a href="#enlace2">Enlace Rápido 2</a></li>
            </ul>
        </nav>
        
        <section>
            <h3>Entradas Recientes</h3>
            <ul>
                <li><a href="#entrada1">Entrada Reciente 1</a></li>
                <li><a href="#entrada2">Entrada Reciente 2</a></li>
            </ul>
        </section>
    </aside>

    <!-- Pie de página del sitio -->
    <footer role="contentinfo">
        <section>
            <h3>Información de Contacto</h3>
            <address>
                <p>123 Calle Web<br>
                Ciudad Internet, CI 12345<br>
                <a href="mailto:contacto@ejemplo.com">contacto@ejemplo.com</a></p>
            </address>
        </section>
        
        <section>
            <h3>Legal</h3>
            <p><a href="#privacidad">Política de Privacidad</a> | <a href="#terminos">Términos de Servicio</a></p>
        </section>
    </footer>
</body>
```

## Formularios
**Descripción:** Los formularios HTML recopilan entrada del usuario a través de varios controles de formulario y proporcionan estructura para envío de datos a servidores.
**Ejemplo:**
```html
<!-- Ejemplo de formulario completo -->
<form action="/enviar" method="post" enctype="multipart/form-data" novalidate>
    <fieldset>
        <legend>Información Personal</legend>
        
        <!-- Campos de texto -->
        <div class="grupo-formulario">
            <label for="nombre">Nombre *</label>
            <input type="text" id="nombre" name="nombre" required 
                   minlength="2" maxlength="50" autocomplete="given-name"
                   aria-describedby="ayuda-nombre">
            <small id="ayuda-nombre">Ingresa tu nombre legal</small>
        </div>
        
        <div class="grupo-formulario">
            <label for="apellido">Apellido *</label>
            <input type="text" id="apellido" name="apellido" required
                   minlength="2" maxlength="50" autocomplete="family-name">
        </div>
        
        <div class="grupo-formulario">
            <label for="email">Dirección de Email *</label>
            <input type="email" id="email" name="email" required
                   autocomplete="email" placeholder="usuario@ejemplo.com"
                   pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
        </div>
        
        <div class="grupo-formulario">
            <label for="telefono">Número de Teléfono</label>
            <input type="tel" id="telefono" name="telefono" 
                   autocomplete="tel" placeholder="(555) 123-4567"
                   pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}">
        </div>
        
        <div class="grupo-formulario">
            <label for="fechaNacimiento">Fecha de Nacimiento</label>
            <input type="date" id="fechaNacimiento" name="fechaNacimiento"
                   min="1900-01-01" max="2010-12-31">
        </div>
    </fieldset>
    
    <fieldset>
        <legend>Preferencias</legend>
        
        <!-- Botones de radio -->
        <div class="grupo-formulario">
            <fieldset>
                <legend>Método de Contacto Preferido</legend>
                <div class="grupo-radio">
                    <input type="radio" id="contacto-email" name="metodoContacto" value="email" checked>
                    <label for="contacto-email">Email</label>
                </div>
                <div class="grupo-radio">
                    <input type="radio" id="contacto-telefono" name="metodoContacto" value="telefono">
                    <label for="contacto-telefono">Teléfono</label>
                </div>
                <div class="grupo-radio">
                    <input type="radio" id="contacto-correo" name="metodoContacto" value="correo">
                    <label for="contacto-correo">Correo Postal</label>
                </div>
            </fieldset>
        </div>
        
        <!-- Casillas de verificación -->
        <div class="grupo-formulario">
            <fieldset>
                <legend>Intereses (selecciona todos los que apliquen)</legend>
                <div class="grupo-checkbox">
                    <input type="checkbox" id="interes-web" name="intereses" value="desarrollo-web">
                    <label for="interes-web">Desarrollo Web</label>
                </div>
                <div class="grupo-checkbox">
                    <input type="checkbox" id="interes-movil" name="intereses" value="desarrollo-movil">
                    <label for="interes-movil">Desarrollo Móvil</label>
                </div>
                <div class="grupo-checkbox">
                    <input type="checkbox" id="interes-diseño" name="intereses" value="diseño">
                    <label for="interes-diseño">Diseño</label>
                </div>
            </fieldset>
        </div>
        
        <!-- Lista desplegable -->
        <div class="grupo-formulario">
            <label for="pais">País</label>
            <select id="pais" name="pais" autocomplete="country-name">
                <option value="">Selecciona un país</option>
                <option value="mx">México</option>
                <option value="es">España</option>
                <option value="ar">Argentina</option>
                <option value="co">Colombia</option>
            </select>
        </div>
        
        <!-- Área de texto -->
        <div class="grupo-formulario">
            <label for="biografia">Biografía</label>
            <textarea id="biografia" name="biografia" rows="4" cols="50"
                      maxlength="500" placeholder="Cuéntanos sobre ti..."
                      aria-describedby="contador-bio"></textarea>
            <div id="contador-bio">0/500 caracteres</div>
        </div>
        
        <!-- Subida de archivo -->
        <div class="grupo-formulario">
            <label for="curriculum">Currículum</label>
            <input type="file" id="curriculum" name="curriculum"
                   accept=".pdf,.doc,.docx" aria-describedby="ayuda-curriculum">
            <small id="ayuda-curriculum">Formatos aceptados: PDF, DOC, DOCX (máx. 5MB)</small>
        </div>
    </fieldset>
    
    <!-- Términos y condiciones -->
    <div class="grupo-formulario">
        <input type="checkbox" id="terminos" name="terminos" required>
        <label for="terminos">Acepto los <a href="/terminos" target="_blank">Términos y Condiciones</a> *</label>
    </div>
    
    <!-- Campo oculto -->
    <input type="hidden" name="versionFormulario" value="2.1">
    
    <!-- Botones del formulario -->
    <div class="acciones-formulario">
        <button type="submit">Crear Cuenta</button>
        <button type="reset">Limpiar Formulario</button>
        <button type="button" onclick="guardarBorrador()">Guardar Borrador</button>
    </div>
</form>
```

## Tablas
**Descripción:** Las tablas HTML muestran datos tabulares en filas y columnas con estructura semántica apropiada para accesibilidad y estilos.
**Ejemplo:**
```html
<!-- Estructura básica de tabla -->
<table>
    <caption>Reporte de Ventas Mensual</caption>
    <thead>
        <tr>
            <th scope="col">Mes</th>
            <th scope="col">Ventas ($)</th>
            <th scope="col">Crecimiento (%)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Enero</td>
            <td>50.000</td>
            <td>+5,2</td>
        </tr>
        <tr>
            <td>Febrero</td>
            <td>52.600</td>
            <td>+5,2</td>
        </tr>
        <tr>
            <td>Marzo</td>
            <td>48.900</td>
            <td>-7,0</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th scope="row">Total</th>
            <td>151.500</td>
            <td>+1,1</td>
        </tr>
    </tfoot>
</table>

<!-- Tabla compleja con celdas fusionadas -->
<table>
    <caption>Horario de Empleados</caption>
    <thead>
        <tr>
            <th scope="col">Empleado</th>
            <th scope="col">Lunes</th>
            <th scope="col">Martes</th>
            <th scope="col">Miércoles</th>
            <th scope="col">Jueves</th>
            <th scope="col">Viernes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Juan Pérez</th>
            <td>9-17</td>
            <td>9-17</td>
            <td colspan="2">Conferencia (9-17)</td>
            <td>9-17</td>
        </tr>
        <tr>
            <th scope="row">Ana García</th>
            <td rowspan="2">Entrenamiento<br>(9-12)</td>
            <td>9-17</td>
            <td>9-17</td>
            <td>9-17</td>
            <td>Libre</td>
        </tr>
        <tr>
            <th scope="row">Roberto López</th>
            <!-- Celda fusionada desde arriba -->
            <td>13-17</td>
            <td>9-17</td>
            <td>9-17</td>
            <td>9-17</td>
        </tr>
    </tbody>
</table>
```

## Canvas, Audio y Video
**Descripción:** HTML5 proporciona capacidades potentes de multimedia y gráficos a través de canvas para gráficos dinámicos y soporte completo de audio/video.
**Ejemplo:**
```html
<!-- Elemento canvas para gráficos dinámicos -->
<canvas id="miCanvas" width="400" height="300" style="border: 1px solid #000;">
    Tu navegador no soporta la etiqueta canvas de HTML5.
</canvas>

<script>
// Dibujo básico en canvas
const canvas = document.getElementById('miCanvas');
const ctx = canvas.getContext('2d');

// Dibujar rectángulo
ctx.fillStyle = '#FF0000';
ctx.fillRect(20, 20, 100, 80);

// Dibujar círculo
ctx.beginPath();
ctx.arc(200, 60, 40, 0, 2 * Math.PI);
ctx.fillStyle = '#0000FF';
ctx.fill();

// Dibujar texto
ctx.font = '20px Arial';
ctx.fillStyle = '#000000';
ctx.fillText('¡Hola Canvas!', 20, 150);

// Dibujar línea
ctx.beginPath();
ctx.moveTo(20, 180);
ctx.lineTo(180, 180);
ctx.stroke();

// Ejemplo de gradiente
const gradiente = ctx.createLinearGradient(0, 200, 0, 280);
gradiente.addColorStop(0, '#FF0000');
gradiente.addColorStop(1, '#0000FF');
ctx.fillStyle = gradiente;
ctx.fillRect(20, 200, 160, 80);
</script>

<!-- Video avanzado con API JavaScript -->
<video id="videoAvanzado" controls width="640" height="360">
    <source src="pelicula.webm" type="video/webm">
    <source src="pelicula.mp4" type="video/mp4">
    <track kind="subtitles" src="subtitulos-es.vtt" srclang="es" label="Español" default>
</video>

<div class="controles-video">
    <button onclick="reproducirPausar()">Reproducir/Pausar</button>
    <button onclick="saltar(-10)">-10s</button>
    <button onclick="saltar(10)">+10s</button>
    <input type="range" id="barraProgreso" value="0" onchange="irA()">
    <input type="range" id="barraVolumen" min="0" max="1" step="0.1" value="1" onchange="establecerVolumen()">
    <button onclick="alternarPantallaCompleta()">Pantalla Completa</button>
</div>

<script>
const video = document.getElementById('videoAvanzado');
const barraProgreso = document.getElementById('barraProgreso');
const barraVolumen = document.getElementById('barraVolumen');

function reproducirPausar() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function saltar(segundos) {
    video.currentTime += segundos;
}

function irA() {
    const tiempo = video.duration * (barraProgreso.value / 100);
    video.currentTime = tiempo;
}

function establecerVolumen() {
    video.volume = barraVolumen.value;
}

function alternarPantallaCompleta() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    }
}

// Actualizar barra de progreso mientras se reproduce el video
video.ontimeupdate = function() {
    const valor = (100 / video.duration) * video.currentTime;
    barraProgreso.value = valor;
};

// Eventos de video
video.addEventListener('loadstart', () => console.log('Carga iniciada'));
video.addEventListener('loadedmetadata', () => console.log('Metadatos cargados'));
video.addEventListener('canplay', () => console.log('Puede empezar a reproducir'));
video.addEventListener('play', () => console.log('Reproduciendo'));
video.addEventListener('pause', () => console.log('Pausado'));
video.addEventListener('ended', () => console.log('Terminado'));
</script>
```
