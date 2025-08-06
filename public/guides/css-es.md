# Guía de Aprendizaje CSS

## Fundamentos
- **Cascading (Cascada)**: Entender cómo las reglas CSS se superponen y anulan entre sí
- **Box Model (Modelo de Caja)**: Diferencia entre margin vs padding, contenido, borde
- **Specificity (Especificidad)**: Cómo CSS determina qué reglas aplicar (IDs, clases, elementos)
- **Units (Unidades)**: px, em, rem, %, vh, vw, y cuándo usar cada una
- **Atomic Design (Diseño Atómico)**: Construir componentes de UI con principios de diseño atómico

## Posicionamiento
- **Static (Estático)**: Comportamiento de posicionamiento por defecto
- **Relative (Relativo)**: Posicionado relativo a su posición normal
- **Absolute (Absoluto)**: Posicionado relativo al ancestro posicionado más cercano
- **Fixed (Fijo)**: Posicionado relativo al viewport
- **Sticky (Pegajoso)**: Combinación de posicionamiento relativo y fijo
- **Z-index**: Control del orden de apilamiento de elementos posicionados

## Pseudo Clases y Elementos
- **Pseudo-clases**: `:hover`, `:focus`, `:nth-child()`, `:first-child`, `:last-child`, `:active`, `:visited`
- **Pseudo-elementos**: `::before`, `::after`, `::first-letter`, `::first-line`
- **Selectores avanzados**: `:not()`, `:has()`, `:is()`, `:where()`

## Diseño Responsivo
- **Media Queries**: Reglas `@media` para diferentes tamaños de pantalla
- **Diseño Responsivo vs Adaptativo**: Layouts fluidos vs breakpoints fijos
- **Enfoque Mobile First**: Diseñar primero para dispositivos móviles, luego escalar
- **Unidades de viewport**: Uso de `vh`, `vw`, `vmin`, `vmax`
- **Container queries**: `@container` para diseño responsivo basado en componentes

## Sistemas de Layout
- **Flexbox**: Sistema de layout unidimensional
  - `flex-direction`, `justify-content`, `align-items`
  - `flex-grow`, `flex-shrink`, `flex-basis`
  - `gap`, `flex-wrap`
- **Grid**: Sistema de layout bidimensional
  - `grid-template-columns`, `grid-template-rows`
  - `grid-area`, `grid-column`, `grid-row`
  - `gap`, `grid-auto-flow`

## Preprocesadores CSS
- **Use vs Forward**: `@use` vs `@forward` en Sass moderno
- **Mixins**: Bloques reutilizables de declaraciones CSS
- **Variables**: Propiedades personalizadas CSS vs variables Sass
- **Funciones**: Funciones integradas y personalizadas
- **Anidamiento**: Escribir reglas CSS anidadas

## Frameworks CSS
- **Bootstrap**: Framework popular basado en utilidades
- **Material UI**: Implementación del Material Design de Google
- **Tailwind**: Framework CSS basado en utilidades
- **CSS-in-JS**: Styled-components, emotion, etc.

## Animaciones y Transiciones
- **Keyframes**: Regla `@keyframes` para animaciones complejas
- **Animations**: Propiedad `animation` y sus sub-propiedades
- **Transitions**: Propiedad `transition` para cambios de estado suaves
- **Transforms**: Propiedad `transform` (`rotate`, `scale`, `translate`, `skew`)
- **CSS Sprites**: Combinar múltiples imágenes para rendimiento
- **Translate**: Usar `transform: translate()` para animaciones suaves
- **Rendimiento**: `will-change`, `transform3d`, aceleración de hardware

## Temas Avanzados
- **CSS Custom Properties**: Crear y usar variables CSS
- **CSS Modules**: CSS con ámbito para componentes
- **PostCSS**: Herramienta para transformar CSS con plugins
- **Arquitectura CSS**: Metodologías BEM, OOCSS, SMACSS
- **CSS Moderno**: `clamp()`, `min()`, `max()`, `aspect-ratio`
- **CSS Containment**: Propiedad `contain` para optimización de rendimiento
