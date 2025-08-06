# HTML Learning Guide

## Document Structure and Doctypes
**Description:** HTML documents require a proper structure and DOCTYPE declaration to ensure correct rendering and standards compliance across browsers.
**Example:**
```html
<!-- HTML5 DOCTYPE (recommended) -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Page description for SEO">
    <title>Page Title</title>
</head>
<body>
    <main>
        <!-- Main content goes here -->
    </main>
</body>
</html>

<!-- Legacy DOCTYPEs (avoid in new projects) -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<!-- Document structure elements -->
<html>
  <head>
    <!-- Document metadata - not visible to users -->
  </head>
  <body>
    <!-- Document content - visible to users -->
  </body>
</html>
```

## Document Metadata
**Description:** Meta elements provide information about the HTML document that isn't displayed on the page but is used by browsers, search engines, and other services.
**Example:**
```html
<head>
    <!-- Character encoding (must be first) -->
    <meta charset="UTF-8">
    
    <!-- Viewport for responsive design -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO metadata -->
    <meta name="description" content="Learn HTML fundamentals with practical examples">
    <meta name="keywords" content="HTML, web development, markup">
    <meta name="author" content="Your Name">
    
    <!-- Social media metadata (Open Graph) -->
    <meta property="og:title" content="HTML Learning Guide">
    <meta property="og:description" content="Comprehensive HTML tutorial">
    <meta property="og:image" content="https://example.com/image.jpg">
    <meta property="og:url" content="https://example.com/html-guide">
    
    <!-- Twitter Card metadata -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="HTML Learning Guide">
    <meta name="twitter:description" content="Learn HTML fundamentals">
    
    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    
    <!-- Preload critical resources -->
    <link rel="preload" href="critical.css" as="style">
    <link rel="preload" href="hero-image.jpg" as="image">
    
    <!-- DNS prefetch for external domains -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//cdn.example.com">
    
    <!-- Canonical URL for SEO -->
    <link rel="canonical" href="https://example.com/html-guide">
    
    <!-- Language alternatives -->
    <link rel="alternate" hreflang="es" href="https://example.com/es/guia-html">
    <link rel="alternate" hreflang="fr" href="https://example.com/fr/guide-html">
    
    <!-- RSS/Atom feeds -->
    <link rel="alternate" type="application/rss+xml" title="Blog RSS" href="/feed.rss">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="print.css" media="print">
    
    <!-- HTTP refresh (avoid in most cases) -->
    <meta http-equiv="refresh" content="300">
    
    <!-- Cache control -->
    <meta http-equiv="cache-control" content="no-cache">
    
    <!-- Page title -->
    <title>HTML Learning Guide - Web Development Tutorial</title>
</head>
```

## Semantic Markup
**Description:** Semantic HTML uses elements that clearly describe their meaning both to browsers and developers, improving accessibility, SEO, and code maintainability.
**Example:**
```html
<!-- Semantic page structure -->
<main>
    <header>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <section id="home">
        <h1>Welcome to Our Website</h1>
        <p>This is the main content area.</p>
        
        <article>
            <header>
                <h2>Article Title</h2>
                <time datetime="2024-01-15">January 15, 2024</time>
                <address>By <a href="mailto:author@example.com">John Author</a></address>
            </header>
            
            <p>Article content goes here...</p>
            
            <aside>
                <h3>Related Links</h3>
                <ul>
                    <li><a href="#related1">Related Article 1</a></li>
                    <li><a href="#related2">Related Article 2</a></li>
                </ul>
            </aside>
            
            <footer>
                <small>Published under Creative Commons License</small>
            </footer>
        </article>
    </section>

    <footer>
        <p>&copy; 2024 Company Name. All rights reserved.</p>
    </footer>
</main>

<!-- Semantic text elements -->
<p>This is <strong>important text</strong> and this is <em>emphasized text</em>.</p>
<p>The meeting is on <time datetime="2024-12-25">Christmas Day</time>.</p>
<p>Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.</p>
<p>The <code>console.log()</code> function outputs to the console.</p>
<p>He said <q cite="https://example.com">This is a quote</q>.</p>

<blockquote cite="https://example.com/quote">
    <p>This is a longer quote that stands alone as a block element.</p>
    <cite>Author Name</cite>
</blockquote>

<!-- Definition lists -->
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language - the standard markup language for web pages</dd>
    
    <dt>CSS</dt>
    <dd>Cascading Style Sheets - used for styling web pages</dd>
    
    <dt>JavaScript</dt>
    <dd>Programming language used to create dynamic web content</dd>
</dl>

<!-- Details and summary for expandable content -->
<details>
    <summary>Click to expand</summary>
    <p>This content is initially hidden and can be toggled by clicking the summary.</p>
</details>

<!-- Figure with caption -->
<figure>
    <img src="diagram.png" alt="System architecture diagram">
    <figcaption>Figure 1: System architecture overview</figcaption>
</figure>

<!-- Mark for highlighting -->
<p>Search results for <mark>"HTML semantic elements"</mark> show many resources.</p>

<!-- Progress and meter elements -->
<progress value="70" max="100">70%</progress>
<meter value="8" min="0" max="10">8 out of 10</meter>
```

## Section Elements
**Description:** HTML5 sectioning elements help structure content logically and improve document outline, accessibility, and SEO.
**Example:**
```html
<!-- Document outline with proper sectioning -->
<body>
    <!-- Main navigation -->
    <header role="banner">
        <h1>Website Title</h1>
        <nav role="navigation" aria-label="Main navigation">
            <ul>
                <li><a href="#section1">Section 1</a></li>
                <li><a href="#section2">Section 2</a></li>
            </ul>
        </nav>
    </header>

    <!-- Main content -->
    <main role="main">
        <!-- Independent section -->
        <section id="section1">
            <h2>Main Section</h2>
            <p>This section contains related content.</p>
            
            <!-- Nested section -->
            <section>
                <h3>Subsection</h3>
                <p>Nested content within the main section.</p>
            </section>
        </section>

        <!-- Self-contained content -->
        <article>
            <header>
                <h2>Blog Post Title</h2>
                <time datetime="2024-01-15">January 15, 2024</time>
            </header>
            
            <p>This article could stand alone and be syndicated.</p>
            
            <!-- Related but separate content -->
            <aside>
                <h3>Author Bio</h3>
                <p>Information about the author...</p>
            </aside>
            
            <footer>
                <p>Tags: <a href="#tag1">HTML</a>, <a href="#tag2">Web Development</a></p>
            </footer>
        </article>

        <!-- Another independent section -->
        <section id="section2">
            <h2>Products</h2>
            
            <!-- Multiple articles within a section -->
            <article>
                <h3>Product 1</h3>
                <p>Description of product 1...</p>
            </article>
            
            <article>
                <h3>Product 2</h3>
                <p>Description of product 2...</p>
            </article>
        </section>
    </main>

    <!-- Sidebar content -->
    <aside role="complementary">
        <h2>Sidebar</h2>
        <nav aria-label="Secondary navigation">
            <ul>
                <li><a href="#link1">Quick Link 1</a></li>
                <li><a href="#link2">Quick Link 2</a></li>
            </ul>
        </nav>
        
        <section>
            <h3>Recent Posts</h3>
            <ul>
                <li><a href="#post1">Recent Post 1</a></li>
                <li><a href="#post2">Recent Post 2</a></li>
            </ul>
        </section>
    </aside>

    <!-- Site footer -->
    <footer role="contentinfo">
        <section>
            <h3>Contact Information</h3>
            <address>
                <p>123 Web Street<br>
                Internet City, IC 12345<br>
                <a href="mailto:contact@example.com">contact@example.com</a></p>
            </address>
        </section>
        
        <section>
            <h3>Legal</h3>
            <p><a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a></p>
        </section>
    </footer>
</body>

<!-- Document outline hierarchy -->
<!-- 
1. Website Title (h1)
   1.1. Main Section (h2)
       1.1.1. Subsection (h3)
   1.2. Blog Post Title (h2)
       1.2.1. Author Bio (h3)
   1.3. Products (h2)
       1.3.1. Product 1 (h3)
       1.3.2. Product 2 (h3)
   1.4. Sidebar (h2)
       1.4.1. Recent Posts (h3)
   1.5. Contact Information (h3)
   1.6. Legal (h3)
-->
```

## Grouping and Text Elements
**Description:** HTML provides various elements for grouping content and marking up text with semantic meaning, improving both structure and accessibility.
**Example:**
```html
<!-- Paragraph grouping -->
<div class="content-wrapper">
    <p>This is a regular paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
    <p>Another paragraph with <small>small print</small> and <mark>highlighted text</mark>.</p>
</div>

<!-- Headings hierarchy -->
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>
<h4>Sub-subsection Title</h4>
<h5>Minor Heading</h5>
<h6>Smallest Heading</h6>

<!-- Text formatting elements -->
<p>
    This text contains <b>bold text</b> (presentational),
    <strong>strong text</strong> (semantic importance),
    <i>italic text</i> (presentational),
    <em>emphasized text</em> (semantic emphasis),
    <u>underlined text</u> (presentational),
    <s>struck-through text</s> (no longer accurate),
    <del>deleted text</del> (removed content),
    <ins>inserted text</ins> (added content),
    <sup>superscript</sup> and <sub>subscript</sub>.
</p>

<!-- Code and preformatted text -->
<pre><code>function greet(name) {
    console.log("Hello, " + name + "!");
}

greet("World");</code></pre>

<p>Use the <code>Array.push()</code> method to add elements to an array.</p>

<p>Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd> to open developer tools.</p>

<samp>Error 404: Page not found</samp>

<var>x</var> = <var>y</var> + <var>z</var>

<!-- Quotations -->
<blockquote cite="https://example.com">
    <p>This is a longer quotation that stands alone as a block element.</p>
    <cite>Source: Example Website</cite>
</blockquote>

<p>Einstein said <q cite="https://quotes.com/einstein">Imagination is more important than knowledge.</q></p>

<!-- Abbreviations and definitions -->
<p>The <abbr title="World Wide Web">WWW</abbr> was invented by Tim Berners-Lee.</p>
<p><dfn title="HyperText Markup Language">HTML</dfn> is the standard markup language for web pages.</p>

<!-- Lists -->
<ul>
    <li>Unordered list item 1</li>
    <li>Unordered list item 2
        <ul>
            <li>Nested item 1</li>
            <li>Nested item 2</li>
        </ul>
    </li>
    <li>Unordered list item 3</li>
</ul>

<ol>
    <li>First ordered item</li>
    <li>Second ordered item</li>
    <li>Third ordered item</li>
</ol>

<ol type="A" start="3">
    <li>Item C</li>
    <li>Item D</li>
</ol>

<ol reversed>
    <li>Last item (3)</li>
    <li>Second to last (2)</li>
    <li>First item (1)</li>
</ol>

<!-- Description lists -->
<dl>
    <dt>Frontend</dt>
    <dd>The client-side of a web application that users interact with directly.</dd>
    <dd>Technologies include HTML, CSS, and JavaScript.</dd>
    
    <dt>Backend</dt>
    <dd>The server-side of a web application that handles data and logic.</dd>
    
    <dt>Database</dt>
    <dd>A structured collection of data that can be easily accessed and managed.</dd>
</dl>

<!-- Grouping with div and span -->
<div class="article-content">
    <p>This paragraph is inside a div container.</p>
    <p>This text has a <span class="highlight">highlighted span</span> within it.</p>
</div>

<!-- Address element -->
<address>
    Written by <a href="mailto:author@example.com">John Doe</a><br>
    Visit us at: 123 Web Street, Internet City<br>
    Phone: <a href="tel:+1234567890">+1 (234) 567-890</a>
</address>

<!-- Line breaks and word breaks -->
<p>This is a line with a<br>manual line break.</p>
<p>This is a very long word that might need to break: supercali<wbr>fragilisticexpiali<wbr>docious</p>

<!-- Horizontal rule -->
<p>Section 1 content...</p>
<hr>
<p>Section 2 content...</p>
```

## Tables
**Description:** HTML tables display tabular data in rows and columns with proper semantic structure for accessibility and styling.
**Example:**
```html
<!-- Basic table structure -->
<table>
    <caption>Monthly Sales Report</caption>
    <thead>
        <tr>
            <th scope="col">Month</th>
            <th scope="col">Sales ($)</th>
            <th scope="col">Growth (%)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>January</td>
            <td>50,000</td>
            <td>+5.2</td>
        </tr>
        <tr>
            <td>February</td>
            <td>52,600</td>
            <td>+5.2</td>
        </tr>
        <tr>
            <td>March</td>
            <td>48,900</td>
            <td>-7.0</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th scope="row">Total</th>
            <td>151,500</td>
            <td>+1.1</td>
        </tr>
    </tfoot>
</table>

<!-- Complex table with merged cells -->
<table>
    <caption>Employee Schedule</caption>
    <thead>
        <tr>
            <th scope="col">Employee</th>
            <th scope="col">Monday</th>
            <th scope="col">Tuesday</th>
            <th scope="col">Wednesday</th>
            <th scope="col">Thursday</th>
            <th scope="col">Friday</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">John Doe</th>
            <td>9-5</td>
            <td>9-5</td>
            <td colspan="2">Conference (9-5)</td>
            <td>9-5</td>
        </tr>
        <tr>
            <th scope="row">Jane Smith</th>
            <td rowspan="2">Training<br>(9-12)</td>
            <td>9-5</td>
            <td>9-5</td>
            <td>9-5</td>
            <td>Off</td>
        </tr>
        <tr>
            <th scope="row">Bob Johnson</th>
            <!-- Cell merged from above -->
            <td>1-5</td>
            <td>9-5</td>
            <td>9-5</td>
            <td>9-5</td>
        </tr>
    </tbody>
</table>

<!-- Accessible table with headers -->
<table>
    <caption>Quarterly Financial Data</caption>
    <thead>
        <tr>
            <td></td>
            <th scope="col">Q1</th>
            <th scope="col">Q2</th>
            <th scope="col">Q3</th>
            <th scope="col">Q4</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Revenue</th>
            <td>$100K</td>
            <td>$120K</td>
            <td>$140K</td>
            <td>$160K</td>
        </tr>
        <tr>
            <th scope="row">Expenses</th>
            <td>$80K</td>
            <td>$90K</td>
            <td>$100K</td>
            <td>$110K</td>
        </tr>
        <tr>
            <th scope="row">Profit</th>
            <td>$20K</td>
            <td>$30K</td>
            <td>$40K</td>
            <td>$50K</td>
        </tr>
    </tbody>
</table>

<!-- Responsive table pattern -->
<div class="table-container">
    <table class="responsive-table">
        <thead>
            <tr>
                <th data-label="Name">Name</th>
                <th data-label="Email">Email</th>
                <th data-label="Phone">Phone</th>
                <th data-label="Department">Department</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td data-label="Name">John Doe</td>
                <td data-label="Email">john@example.com</td>
                <td data-label="Phone">555-0123</td>
                <td data-label="Department">Engineering</td>
            </tr>
            <tr>
                <td data-label="Name">Jane Smith</td>
                <td data-label="Email">jane@example.com</td>
                <td data-label="Phone">555-0456</td>
                <td data-label="Department">Marketing</td>
            </tr>
        </tbody>
    </table>
</div>

<!-- Column groups for styling -->
<table>
    <colgroup>
        <col>
        <col class="highlight">
        <col span="2" class="data-columns">
    </colgroup>
    <thead>
        <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Sold</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Laptop</td>
            <td>$999</td>
            <td>15</td>
            <td>8</td>
        </tr>
        <tr>
            <td>Mouse</td>
            <td>$25</td>
            <td>50</td>
            <td>32</td>
        </tr>
    </tbody>
</table>
```

## Forms
**Description:** HTML forms collect user input through various form controls and provide structure for data submission to servers.
**Example:**
```html
<!-- Comprehensive form example -->
<form action="/submit" method="post" enctype="multipart/form-data" novalidate>
    <fieldset>
        <legend>Personal Information</legend>
        
        <!-- Text inputs -->
        <div class="form-group">
            <label for="firstName">First Name *</label>
            <input type="text" id="firstName" name="firstName" required 
                   minlength="2" maxlength="50" autocomplete="given-name"
                   aria-describedby="firstName-help">
            <small id="firstName-help">Enter your legal first name</small>
        </div>
        
        <div class="form-group">
            <label for="lastName">Last Name *</label>
            <input type="text" id="lastName" name="lastName" required
                   minlength="2" maxlength="50" autocomplete="family-name">
        </div>
        
        <div class="form-group">
            <label for="email">Email Address *</label>
            <input type="email" id="email" name="email" required
                   autocomplete="email" placeholder="user@example.com"
                   pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
        </div>
        
        <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" 
                   autocomplete="tel" placeholder="(555) 123-4567"
                   pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}">
        </div>
        
        <div class="form-group">
            <label for="birthdate">Date of Birth</label>
            <input type="date" id="birthdate" name="birthdate"
                   min="1900-01-01" max="2010-12-31">
        </div>
    </fieldset>
    
    <fieldset>
        <legend>Account Details</legend>
        
        <div class="form-group">
            <label for="username">Username *</label>
            <input type="text" id="username" name="username" required
                   minlength="3" maxlength="20" autocomplete="username"
                   pattern="[a-zA-Z0-9_]+" title="Only letters, numbers, and underscores">
        </div>
        
        <div class="form-group">
            <label for="password">Password *</label>
            <input type="password" id="password" name="password" required
                   minlength="8" autocomplete="new-password"
                   pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                   title="Must contain at least one number, one uppercase and lowercase letter, and at least 8 characters">
        </div>
        
        <div class="form-group">
            <label for="confirmPassword">Confirm Password *</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required
                   autocomplete="new-password">
        </div>
    </fieldset>
    
    <fieldset>
        <legend>Preferences</legend>
        
        <!-- Radio buttons -->
        <div class="form-group">
            <fieldset>
                <legend>Preferred Contact Method</legend>
                <div class="radio-group">
                    <input type="radio" id="contact-email" name="contactMethod" value="email" checked>
                    <label for="contact-email">Email</label>
                </div>
                <div class="radio-group">
                    <input type="radio" id="contact-phone" name="contactMethod" value="phone">
                    <label for="contact-phone">Phone</label>
                </div>
                <div class="radio-group">
                    <input type="radio" id="contact-mail" name="contactMethod" value="mail">
                    <label for="contact-mail">Postal Mail</label>
                </div>
            </fieldset>
        </div>
        
        <!-- Checkboxes -->
        <div class="form-group">
            <fieldset>
                <legend>Interests (select all that apply)</legend>
                <div class="checkbox-group">
                    <input type="checkbox" id="interest-web" name="interests" value="web-development">
                    <label for="interest-web">Web Development</label>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="interest-mobile" name="interests" value="mobile-development">
                    <label for="interest-mobile">Mobile Development</label>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="interest-design" name="interests" value="design">
                    <label for="interest-design">Design</label>
                </div>
            </fieldset>
        </div>
        
        <!-- Select dropdown -->
        <div class="form-group">
            <label for="country">Country</label>
            <select id="country" name="country" autocomplete="country-name">
                <option value="">Select a country</option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="uk">United Kingdom</option>
                <option value="au">Australia</option>
            </select>
        </div>
        
        <!-- Multiple select -->
        <div class="form-group">
            <label for="languages">Programming Languages</label>
            <select id="languages" name="languages" multiple size="4">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
            </select>
            <small>Hold Ctrl (Cmd on Mac) to select multiple</small>
        </div>
    </fieldset>
    
    <fieldset>
        <legend>Additional Information</legend>
        
        <!-- Textarea -->
        <div class="form-group">
            <label for="bio">Bio</label>
            <textarea id="bio" name="bio" rows="4" cols="50"
                      maxlength="500" placeholder="Tell us about yourself..."
                      aria-describedby="bio-counter"></textarea>
            <div id="bio-counter">0/500 characters</div>
        </div>
        
        <!-- File upload -->
        <div class="form-group">
            <label for="resume">Resume/CV</label>
            <input type="file" id="resume" name="resume"
                   accept=".pdf,.doc,.docx" aria-describedby="resume-help">
            <small id="resume-help">Accepted formats: PDF, DOC, DOCX (max 5MB)</small>
        </div>
        
        <!-- Range slider -->
        <div class="form-group">
            <label for="experience">Years of Experience</label>
            <input type="range" id="experience" name="experience"
                   min="0" max="20" value="5" step="1"
                   oninput="document.getElementById('exp-value').textContent = this.value">
            <output id="exp-value">5</output> years
        </div>
        
        <!-- Number input -->
        <div class="form-group">
            <label for="salary">Expected Salary</label>
            <input type="number" id="salary" name="salary"
                   min="20000" max="200000" step="1000" placeholder="50000">
        </div>
        
        <!-- Color picker -->
        <div class="form-group">
            <label for="favorite-color">Favorite Color</label>
            <input type="color" id="favorite-color" name="favoriteColor" value="#0066cc">
        </div>
        
        <!-- URL input -->
        <div class="form-group">
            <label for="website">Personal Website</label>
            <input type="url" id="website" name="website" 
                   placeholder="https://example.com" autocomplete="url">
        </div>
    </fieldset>
    
    <!-- Terms and conditions -->
    <div class="form-group">
        <input type="checkbox" id="terms" name="terms" required>
        <label for="terms">I agree to the <a href="/terms" target="_blank">Terms and Conditions</a> *</label>
    </div>
    
    <!-- Hidden field -->
    <input type="hidden" name="formVersion" value="2.1">
    
    <!-- Form buttons -->
    <div class="form-actions">
        <button type="submit">Create Account</button>
        <button type="reset">Clear Form</button>
        <button type="button" onclick="saveDraft()">Save Draft</button>
    </div>
</form>

<!-- Datalist for autocomplete -->
<form>
    <label for="city">City</label>
    <input type="text" id="city" name="city" list="cities" autocomplete="address-level2">
    <datalist id="cities">
        <option value="New York">
        <option value="Los Angeles">
        <option value="Chicago">
        <option value="Houston">
        <option value="Phoenix">
    </datalist>
</form>

<!-- Form validation with custom messages -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    // Custom validation for password confirmation
    confirmPassword.addEventListener('input', function() {
        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity('Passwords do not match');
        } else {
            confirmPassword.setCustomValidity('');
        }
    });
    
    // Character counter for textarea
    const bio = document.getElementById('bio');
    const counter = document.getElementById('bio-counter');
    
    bio.addEventListener('input', function() {
        const current = bio.value.length;
        const max = bio.getAttribute('maxlength');
        counter.textContent = `${current}/${max} characters`;
        
        if (current >= max * 0.9) {
            counter.style.color = 'orange';
        } else {
            counter.style.color = 'inherit';
        }
    });
});
</script>
```

## Embedded Content Elements
**Description:** HTML provides elements for embedding external content like images, videos, audio, and interactive content from other sources.
**Example:**
```html
<!-- Images with accessibility and responsive features -->
<img src="hero-image.jpg" 
     alt="Team collaboration in a modern office space"
     width="800" height="400"
     loading="lazy"
     decoding="async"
     srcset="hero-small.jpg 400w, hero-medium.jpg 800w, hero-large.jpg 1200w"
     sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 25vw">

<!-- Picture element for art direction -->
<picture>
    <source media="(max-width: 600px)" srcset="mobile-hero.jpg">
    <source media="(max-width: 1200px)" srcset="tablet-hero.jpg">
    <source srcset="desktop-hero.webp" type="image/webp">
    <img src="desktop-hero.jpg" alt="Responsive hero image">
</picture>

<!-- Video element with multiple sources and controls -->
<video controls width="640" height="360" poster="video-poster.jpg"
       preload="metadata" loop muted autoplay>
    <source src="video.webm" type="video/webm">
    <source src="video.mp4" type="video/mp4">
    <track kind="subtitles" src="subtitles-en.vtt" srclang="en" label="English">
    <track kind="subtitles" src="subtitles-es.vtt" srclang="es" label="Español">
    <p>Your browser doesn't support HTML5 video. 
       <a href="video.mp4">Download the video</a> instead.</p>
</video>

<!-- Audio element -->
<audio controls preload="none">
    <source src="audio.ogg" type="audio/ogg">
    <source src="audio.mp3" type="audio/mpeg">
    <p>Your browser doesn't support HTML5 audio. 
       <a href="audio.mp3">Download the audio file</a>.</p>
</audio>

<!-- Embedded iframe content -->
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        width="560" height="315"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        title="YouTube video player"
        loading="lazy">
</iframe>

<!-- Embedded map -->
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024...."
        width="400" height="300"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="Office location map">
</iframe>

<!-- Object element for plugins -->
<object data="document.pdf" type="application/pdf" width="600" height="400">
    <p>Your browser doesn't support PDF viewing. 
       <a href="document.pdf">Download the PDF</a> instead.</p>
</object>

<!-- Embed element -->
<embed src="interactive-content.swf" 
       type="application/x-shockwave-flash"
       width="400" height="300"
       quality="high"
       pluginspage="http://www.macromedia.com/shockwave/download/">

<!-- Source element for media resources -->
<audio controls>
    <source src="audio.opus" type="audio/opus">
    <source src="audio.ogg" type="audio/ogg">
    <source src="audio.mp3" type="audio/mpeg">
</audio>

<!-- Track element for video/audio accessibility -->
<video controls>
    <source src="movie.mp4" type="video/mp4">
    <track kind="captions" src="captions-en.vtt" srclang="en" label="English Captions" default>
    <track kind="captions" src="captions-fr.vtt" srclang="fr" label="Français">
    <track kind="descriptions" src="descriptions-en.vtt" srclang="en" label="English Descriptions">
    <track kind="chapters" src="chapters.vtt" srclang="en" label="Chapters">
</video>

<!-- Area element for image maps -->
<img src="planets.jpg" alt="Solar system" usemap="#planetmap" width="400" height="300">
<map name="planetmap">
    <area shape="circle" coords="90,58,10" href="mercury.html" alt="Mercury">
    <area shape="circle" coords="124,58,8" href="venus.html" alt="Venus">  
    <area shape="circle" coords="161,58,10" href="earth.html" alt="Earth">
    <area shape="circle" coords="194,58,6" href="mars.html" alt="Mars">
</map>

<!-- Param element for object parameters -->
<object data="movie.swf" type="application/x-shockwave-flash">
    <param name="quality" value="high">
    <param name="bgcolor" value="#ffffff">
    <param name="allowfullscreen" value="true">
    <p>Flash content not supported</p>
</object>
```

## Canvas, Audio, and Video
**Description:** HTML5 provides powerful multimedia and graphics capabilities through canvas for dynamic graphics and comprehensive audio/video support.
**Example:**
```html
<!-- Canvas element for dynamic graphics -->
<canvas id="myCanvas" width="400" height="300" style="border: 1px solid #000;">
    Your browser does not support the HTML5 canvas tag.
</canvas>

<script>
// Basic canvas drawing
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Draw rectangle
ctx.fillStyle = '#FF0000';
ctx.fillRect(20, 20, 100, 80);

// Draw circle
ctx.beginPath();
ctx.arc(200, 60, 40, 0, 2 * Math.PI);
ctx.fillStyle = '#0000FF';
ctx.fill();

// Draw text
ctx.font = '20px Arial';
ctx.fillStyle = '#000000';
ctx.fillText('Hello Canvas!', 20, 150);

// Draw line
ctx.beginPath();
ctx.moveTo(20, 180);
ctx.lineTo(180, 180);
ctx.stroke();

// Gradient example
const gradient = ctx.createLinearGradient(0, 200, 0, 280);
gradient.addColorStop(0, '#FF0000');
gradient.addColorStop(1, '#0000FF');
ctx.fillStyle = gradient;
ctx.fillRect(20, 200, 160, 80);
</script>

<!-- Advanced video with JavaScript API -->
<video id="advancedVideo" controls width="640" height="360">
    <source src="movie.webm" type="video/webm">
    <source src="movie.mp4" type="video/mp4">
    <track kind="subtitles" src="subs-en.vtt" srclang="en" label="English" default>
</video>

<div class="video-controls">
    <button onclick="playPause()">Play/Pause</button>
    <button onclick="skip(-10)">-10s</button>
    <button onclick="skip(10)">+10s</button>
    <input type="range" id="seekBar" value="0" onchange="seekTo()">
    <input type="range" id="volumeBar" min="0" max="1" step="0.1" value="1" onchange="setVolume()">
    <button onclick="toggleFullscreen()">Fullscreen</button>
</div>

<script>
const video = document.getElementById('advancedVideo');
const seekBar = document.getElementById('seekBar');
const volumeBar = document.getElementById('volumeBar');

function playPause() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function skip(seconds) {
    video.currentTime += seconds;
}

function seekTo() {
    const time = video.duration * (seekBar.value / 100);
    video.currentTime = time;
}

function setVolume() {
    video.volume = volumeBar.value;
}

function toggleFullscreen() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    }
}

// Update seek bar as video plays
video.ontimeupdate = function() {
    const value = (100 / video.duration) * video.currentTime;
    seekBar.value = value;
};

// Video event listeners
video.addEventListener('loadstart', () => console.log('Load started'));
video.addEventListener('loadedmetadata', () => console.log('Metadata loaded'));
video.addEventListener('loadeddata', () => console.log('Data loaded'));
video.addEventListener('canplay', () => console.log('Can start playing'));
video.addEventListener('canplaythrough', () => console.log('Can play through'));
video.addEventListener('play', () => console.log('Playing'));
video.addEventListener('pause', () => console.log('Paused'));
video.addEventListener('ended', () => console.log('Ended'));
</script>

<!-- Advanced audio with Web Audio API -->
<audio id="audioPlayer" controls>
    <source src="music.ogg" type="audio/ogg">
    <source src="music.mp3" type="audio/mpeg">
</audio>

<div class="audio-controls">
    <button onclick="analyzeAudio()">Start Visualization</button>
    <canvas id="visualizer" width="400" height="200"></canvas>
</div>

<script>
let audioContext;
let analyser;
let source;
let animationId;

function analyzeAudio() {
    const audio = document.getElementById('audioPlayer');
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    
    // Create audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audio);
    
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function draw() {
        animationId = requestAnimationFrame(draw);
        
        analyser.getByteFrequencyData(dataArray);
        
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            
            ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
            ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }
    
    draw();
}
</script>

<!-- Interactive canvas animation -->
<canvas id="interactiveCanvas" width="500" height="400"></canvas>

<script>
const iCanvas = document.getElementById('interactiveCanvas');
const iCtx = iCanvas.getContext('2d');
const particles = [];

// Particle class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.radius = Math.random() * 3 + 1;
        this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > iCanvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > iCanvas.height) this.vy *= -1;
    }
    
    draw() {
        iCtx.beginPath();
        iCtx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        iCtx.fillStyle = this.color;
        iCtx.fill();
    }
}

// Mouse interaction
iCanvas.addEventListener('mousemove', (e) => {
    const rect = iCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    for (let i = 0; i < 3; i++) {
        particles.push(new Particle(x, y));
    }
    
    // Limit particles
    if (particles.length > 100) {
        particles.splice(0, particles.length - 100);
    }
});

// Animation loop
function animate() {
    iCtx.clearRect(0, 0, iCanvas.width, iCanvas.height);
    
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        
        // Remove old particles
        if (particle.radius < 0.5) {
            particles.splice(index, 1);
        } else {
            particle.radius *= 0.98;
        }
    });
    
    requestAnimationFrame(animate);
}

animate();
</script>
```

## SVG (Scalable Vector Graphics)
**Description:** SVG provides vector-based graphics that scale without quality loss and can be styled with CSS and manipulated with JavaScript.
**Example:**
```html
<!-- Basic SVG shapes -->
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <!-- Rectangle -->
    <rect x="10" y="10" width="100" height="80" 
          fill="blue" stroke="black" stroke-width="2"/>
    
    <!-- Circle -->
    <circle cx="200" cy="50" r="40" 
            fill="red" stroke="green" stroke-width="3"/>
    
    <!-- Ellipse -->
    <ellipse cx="300" cy="50" rx="50" ry="30" 
             fill="yellow" opacity="0.7"/>
    
    <!-- Line -->
    <line x1="10" y1="120" x2="390" y2="120" 
          stroke="purple" stroke-width="2"/>
    
    <!-- Polyline -->
    <polyline points="10,140 50,160 90,140 130,180 170,140" 
              fill="none" stroke="orange" stroke-width="3"/>
    
    <!-- Polygon -->
    <polygon points="200,140 240,160 220,200 180,200 160,160" 
             fill="lightblue" stroke="navy" stroke-width="2"/>
    
    <!-- Path (complex shapes) -->
    <path d="M 300 140 Q 350 120 400 140 T 400 180 L 350 200 Z" 
          fill="pink" stroke="red" stroke-width="2"/>
    
    <!-- Text -->
    <text x="20" y="250" font-family="Arial" font-size="20" fill="black">
        SVG Text Example
    </text>
    
    <!-- Text along path -->
    <defs>
        <path id="textPath" d="M 20 280 Q 200 260 380 280"/>
    </defs>
    <text font-size="16" fill="blue">
        <textPath href="#textPath">This text follows a curved path</textPath>
    </text>
</svg>

<!-- SVG with gradients and patterns -->
<svg width="400" height="200">
    <defs>
        <!-- Linear gradient -->
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
        </linearGradient>
        
        <!-- Radial gradient -->
        <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:rgb(255,255,255);stop-opacity:0" />
            <stop offset="100%" style="stop-color:rgb(0,0,255);stop-opacity:1" />
        </radialGradient>
        
        <!-- Pattern -->
        <pattern id="pattern1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="5" fill="red"/>
        </pattern>
        
        <!-- Filter effects -->
        <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
        
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="3" dy="3" stdDeviation="2" flood-color="gray"/>
        </filter>
    </defs>
    
    <!-- Using gradients -->
    <rect x="10" y="10" width="100" height="80" fill="url(#grad1)"/>
    <circle cx="200" cy="50" r="40" fill="url(#grad2)"/>
    
    <!-- Using patterns -->
    <rect x="300" y="10" width="80" height="80" fill="url(#pattern1)"/>
    
    <!-- Using filters -->
    <text x="20" y="140" font-size="20" fill="blue" filter="url(#blur)">
        Blurred Text
    </text>
    
    <rect x="200" y="120" width="80" height="40" fill="green" filter="url(#shadow)"/>
</svg>

<!-- Interactive SVG with CSS and JavaScript -->
<svg id="interactiveSVG" width="400" height="300" style="border: 1px solid #ccc;">
    <style>
        .hover-circle {
            transition: all 0.3s ease;
        }
        .hover-circle:hover {
            fill: orange;
            r: 35;
        }
        .animated-rect {
            animation: slide 2s infinite alternate;
        }
        @keyframes slide {
            from { transform: translateX(0); }
            to { transform: translateX(100px); }
        }
    </style>
    
    <!-- Interactive elements -->
    <circle class="hover-circle" cx="100" cy="100" r="30" fill="blue" cursor="pointer"/>
    <rect class="animated-rect" x="20" y="200" width="50" height="30" fill="red"/>
    
    <!-- Clickable group -->
    <g id="clickableGroup" cursor="pointer">
        <rect x="200" y="50" width="80" height="60" fill="lightgreen" stroke="green"/>
        <text x="240" y="85" text-anchor="middle" font-size="12">Click me</text>
    </g>
    
    <!-- Path for drawing -->
    <path id="drawingPath" stroke="black" stroke-width="2" fill="none"/>
</svg>

<script>
// Interactive SVG functionality
document.addEventListener('DOMContentLoaded', function() {
    const svg = document.getElementById('interactiveSVG');
    const clickableGroup = document.getElementById('clickableGroup');
    const drawingPath = document.getElementById('drawingPath');
    
    let isDrawing = false;
    let pathData = '';
    
    // Click event
    clickableGroup.addEventListener('click', function() {
        alert('SVG group clicked!');
    });
    
    // Drawing functionality
    svg.addEventListener('mousedown', function(e) {
        if (e.target === svg) {
            isDrawing = true;
            const rect = svg.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            pathData = `M ${x} ${y}`;
        }
    });
    
    svg.addEventListener('mousemove', function(e) {
        if (isDrawing) {
            const rect = svg.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            pathData += ` L ${x} ${y}`;
            drawingPath.setAttribute('d', pathData);
        }
    });
    
    svg.addEventListener('mouseup', function() {
        isDrawing = false;
    });
});
</script>

<!-- SVG icons and symbols -->
<svg style="display: none;">
    <defs>
        <symbol id="home-icon" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </symbol>
        <symbol id="user-icon" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </symbol>
        <symbol id="settings-icon" viewBox="0 0 24 24">
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
        </symbol>
    </defs>
</svg>

<!-- Using the icons -->
<div class="icon-menu">
    <svg width="24" height="24" fill="currentColor">
        <use href="#home-icon"/>
    </svg>
    <svg width="24" height="24" fill="currentColor">
        <use href="#user-icon"/>
    </svg>
    <svg width="24" height="24" fill="currentColor">
        <use href="#settings-icon"/>
    </svg>
</div>

<!-- Responsive SVG -->
<div style="width: 50%; max-width: 300px;">
    <svg viewBox="0 0 100 100" style="width: 100%; height: auto;">
        <circle cx="50" cy="50" r="40" fill="purple"/>
        <text x="50" y="55" text-anchor="middle" font-size="8" fill="white">Responsive</text>
    </svg>
</div>
```
