# CSS Learning Guide

## Fundamentals
- **Cascading**: Understanding how CSS rules cascade and override each other
- **Box Model**: Difference between margin vs padding, content, border
- **Specificity**: How CSS determines which rules to apply (IDs, classes, elements)
- **Units**: px, em, rem, %, vh, vw, and when to use each
- **Atomic Design**: Building UI components with atomic design principles

## Positioning
- **Static**: Default positioning behavior
- **Relative**: Positioned relative to its normal position
- **Absolute**: Positioned relative to nearest positioned ancestor
- **Fixed**: Positioned relative to viewport
- **Sticky**: Combination of relative and fixed positioning
- **Z-index**: Controlling stacking order of positioned elements

## Pseudo Classes & Elements
- **Pseudo-classes**: `:hover`, `:focus`, `:nth-child()`, `:first-child`, `:last-child`, `:active`, `:visited`
- **Pseudo-elements**: `::before`, `::after`, `::first-letter`, `::first-line`
- **Advanced selectors**: `:not()`, `:has()`, `:is()`, `:where()`

## Responsive Design
- **Media Queries**: `@media` rules for different screen sizes
- **Responsive vs Adaptive Design**: Fluid layouts vs fixed breakpoints
- **Mobile First Approach**: Designing for mobile devices first, then scaling up
- **Viewport units**: Using `vh`, `vw`, `vmin`, `vmax`
- **Container queries**: `@container` for component-based responsive design

## Layout Systems
- **Flexbox**: One-dimensional layout system
  - `flex-direction`, `justify-content`, `align-items`
  - `flex-grow`, `flex-shrink`, `flex-basis`
  - `gap`, `flex-wrap`
- **Grid**: Two-dimensional layout system
  - `grid-template-columns`, `grid-template-rows`
  - `grid-area`, `grid-column`, `grid-row`
  - `gap`, `grid-auto-flow`

## CSS Preprocessors
- **Use vs Forward**: `@use` vs `@forward` in modern Sass
- **Mixins**: Reusable blocks of CSS declarations
- **Variables**: CSS custom properties vs Sass variables
- **Functions**: Built-in and custom functions
- **Nesting**: Writing nested CSS rules

## CSS Frameworks
- **Bootstrap**: Popular utility-first framework
- **Material UI**: Google's Material Design implementation
- **Tailwind**: Utility-first CSS framework
- **CSS-in-JS**: Styled-components, emotion, etc.

## Animations & Transitions
- **Keyframes**: `@keyframes` rule for complex animations
- **Animations**: `animation` property and its sub-properties
- **Transitions**: `transition` property for smooth state changes
- **Transforms**: `transform` property (`rotate`, `scale`, `translate`, `skew`)
- **CSS Sprites**: Combining multiple images for performance
- **Translate**: Using `transform: translate()` for smooth animations
- **Performance**: `will-change`, `transform3d`, hardware acceleration

## Advanced Topics
- **CSS Custom Properties**: Creating and using CSS variables
- **CSS Modules**: Scoped CSS for components
- **PostCSS**: Tool for transforming CSS with plugins
- **CSS Architecture**: BEM, OOCSS, SMACSS methodologies
- **Modern CSS**: `clamp()`, `min()`, `max()`, `aspect-ratio`
- **CSS Containment**: `contain` property for performance optimization
