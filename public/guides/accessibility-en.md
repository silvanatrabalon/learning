# Web Accessibility Guide

## Meta Tags and Basic SEO
**Description:** Meta tags that improve accessibility and SEO by providing structured information for browsers, search engines, and assistive technologies.

**Example:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Basic meta tags for accessibility -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Clear and concise page description">
  <meta name="keywords" content="relevant, keywords, here">
  <meta name="author" content="Author Name">
  
  <!-- Robots and crawling -->
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow, snippet, archive">
  
  <!-- Open Graph for social media -->
  <meta property="og:title" content="Page Title">
  <meta property="og:description" content="Social media description">
  <meta property="og:image" content="https://example.com/image.jpg">
  <meta property="og:url" content="https://example.com/page">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Site Name">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Page Title">
  <meta name="twitter:description" content="Twitter description">
  <meta name="twitter:image" content="https://example.com/image.jpg">
  
  <!-- Accessible title -->
  <title>Descriptive Title - Site Name</title>
</head>
<body>
  <!-- Content -->
</body>
</html>

<!-- robots.txt -->
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Sitemap: https://example.com/sitemap.xml

<!-- sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**Comparison:** Meta tags vs No meta tags - Meta tags improve SEO, accessibility, and social media experience, while without them content is less discoverable and accessible.

## Semantic HTML and Structured Data
**Description:** Use of semantic HTML elements and structured schemas that provide meaning and context to content for browsers and assistive technologies.

**Example:**
```html
<!-- Semantic HTML -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/" aria-current="page">Home</a></li>
      <li><a href="/products">Products</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <header>
      <h1>Main Article Title</h1>
      <time datetime="2024-01-15">January 15, 2024</time>
      <address>By <a href="/author">John Doe</a></address>
    </header>
    
    <section>
      <h2>Content Section</h2>
      <p>Paragraph with relevant content...</p>
      
      <figure>
        <img src="chart.jpg" alt="Chart showing Q1 2024 sales">
        <figcaption>Quarterly sales increased 25%</figcaption>
      </figure>
    </section>
    
    <aside>
      <h3>Related Information</h3>
      <p>Complementary content...</p>
    </aside>
  </article>
</main>

<footer>
  <p>&copy; 2024 My Company. All rights reserved.</p>
</footer>

<!-- Structured Data (JSON-LD) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Main Article Title",
  "author": {
    "@type": "Person",
    "name": "John Doe"
  },
  "datePublished": "2024-01-15",
  "description": "Article description",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/article"
  },
  "publisher": {
    "@type": "Organization",
    "name": "My Company",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.jpg"
    }
  }
}
</script>

<!-- Schema for products -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Example Product",
  "description": "Product description",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
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

**Comparison:** Semantic HTML vs Generic divs - Semantic HTML provides structure and meaning for screen readers and SEO, while generic divs only provide styling without semantic context.

## ARIA Roles and Keyboard Navigation
**Description:** ARIA attributes and navigation techniques that make web applications accessible for users with disabilities, especially for screen readers and keyboard navigation.

**Example:**
```html
<!-- ARIA Roles and Properties -->
<div role="banner">
  <h1>My Web Application</h1>
</div>

<nav role="navigation" aria-label="Main navigation">
  <ul role="menubar">
    <li role="none">
      <a href="/" role="menuitem" aria-current="page">Home</a>
    </li>
    <li role="none">
      <a href="/products" role="menuitem">Products</a>
    </li>
  </ul>
</nav>

<!-- Accessible forms -->
<form role="form" aria-labelledby="form-title">
  <h2 id="form-title">Contact Information</h2>
  
  <div>
    <label for="name">Full Name *</label>
    <input 
      type="text" 
      id="name" 
      name="name"
      required 
      aria-required="true"
      aria-describedby="name-help"
    >
    <div id="name-help">Enter your first and last name</div>
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
      Please enter a valid email address
    </div>
  </div>
  
  <fieldset>
    <legend>Preferred Contact Method</legend>
    <input type="radio" id="contact-email" name="contact" value="email">
    <label for="contact-email">Email</label>
    
    <input type="radio" id="contact-phone" name="contact" value="phone">
    <label for="contact-phone">Phone</label>
  </fieldset>
  
  <button type="submit" aria-describedby="submit-help">
    Submit Form
  </button>
  <div id="submit-help">Press Enter or click to submit</div>
</form>

<!-- Accessible modal -->
<div 
  role="dialog" 
  aria-modal="true" 
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  tabindex="-1"
>
  <h2 id="modal-title">Confirm Action</h2>
  <p id="modal-description">Are you sure you want to continue?</p>
  
  <button type="button" aria-label="Close modal">×</button>
  <button type="button">Cancel</button>
  <button type="button">Confirm</button>
</div>

<!-- Keyboard navigation -->
<script>
// Tab order management
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    // Ensure logical tab order
    console.log('Tab navigation:', document.activeElement);
  }
  
  if (e.key === 'Escape' && document.querySelector('[role="dialog"]')) {
    // Close modal with Escape
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
  Skip to main content
</a>
```

**Comparison:** ARIA vs HTML only - ARIA provides additional semantic information for assistive technologies when semantic HTML is not enough, while HTML-only can be limiting for complex interactive applications.

## Screen Readers and Contrast
**Description:** Optimization for screen readers (JAWS, NVDA, VoiceOver) and contrast techniques that ensure content is perceivable for users with visual disabilities.

**Example:**
```html
<!-- Screen Reader optimization -->
<img 
  src="sales-chart.png" 
  alt="Bar chart showing 25% sales growth in Q1 2024"
  longdesc="detailed-description.html"
>

<!-- Decorative image -->
<img src="decoration.png" alt="" role="presentation">

<!-- Dynamically updating content -->
<div 
  id="status-messages" 
  role="status" 
  aria-live="polite"
  aria-atomic="true"
>
  <!-- Messages will appear here -->
</div>

<!-- Accessible table -->
<table>
  <caption>Sales by Quarter 2024</caption>
  <thead>
    <tr>
      <th scope="col">Quarter</th>
      <th scope="col">Sales (USD)</th>
      <th scope="col">Growth</th>
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

<!-- CSS for contrast and visibility -->
<style>
/* WCAG AA contrast: minimum 4.5:1 */
.high-contrast {
  background-color: #000000; /* Black */
  color: #ffffff; /* White */
  /* Ratio: 21:1 - Meets WCAG AAA */
}

.medium-contrast {
  background-color: #333333; /* Dark gray */
  color: #ffffff; /* White */
  /* Ratio: 12.6:1 - Meets WCAG AA */
}

/* Visible focus for keyboard navigation */
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
announceToScreenReader('Form submitted successfully');
</script>
```

**Comparison:** Screen reader optimized vs Non-optimized - Optimized content provides rich context and efficient navigation for screen reader users, while non-optimized content can be confusing or inaccessible.

## Audit Tools and Testing
**Description:** Tools and techniques for auditing and testing web accessibility, including automated testing, performance audits, and Core Web Vitals.

**Example:**
```javascript
// Axe Core - Automated accessibility testing
import axe from 'axe-core';

// Basic accessibility test
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

**Comparison:** Automated auditing vs Manual testing - Automated tools catch common issues quickly, while manual testing with real users and screen readers provides deeper insights into actual usability.
