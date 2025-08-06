# Software Architecture Guide

## REST vs GraphQL
**Description:** Two different paradigms for designing APIs: REST follows resource-based architecture principles and HTTP, while GraphQL allows flexible queries with a single endpoint.

**Example:**
```javascript
// REST API
// GET /api/users - Get all users
app.get('/api/users', async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email']
  });
  res.json(users);
});

// GET /api/users/:id - Get specific user
app.get('/api/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: ['posts', 'profile']
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST /api/users - Create user
app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.status(201).json(user);
});

// PUT /api/users/:id - Update user
app.put('/api/users/:id', async (req, res) => {
  const [updated] = await User.update(req.body, {
    where: { id: req.params.id }
  });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  const user = await User.findByPk(req.params.id);
  res.json(user);
});

// GraphQL API
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList } = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (user) => Post.findAll({ where: { userId: user.id } })
    }
  }
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve: () => User.findAll()
      },
      user: {
        type: UserType,
        args: { id: { type: GraphQLString } },
        resolve: (_, { id }) => User.findByPk(id)
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: UserType,
        args: {
          name: { type: GraphQLString },
          email: { type: GraphQLString }
        },
        resolve: (_, args) => User.create(args)
      }
    }
  })
});

// GraphQL Query
// query {
//   user(id: "1") {
//     name
//     email
//     posts {
//       title
//       content
//     }
//   }
// }
```

**Comparison:** REST vs GraphQL - REST is simple and cacheable with multiple specific endpoints, while GraphQL is flexible with a single endpoint but requires more configuration and can be complex to cache.

## Server-Side Rendering (SSR)
**Description:** Technique where HTML content is generated on the server before being sent to the client, improving SEO and initial user experience.

**Example:**
```javascript
// Express with SSR using React
const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');

const app = express();

// React Component
const App = ({ data }) => (
  React.createElement('div', null,
    React.createElement('h1', null, 'My App'),
    React.createElement('p', null, `User: ${data.user.name}`)
  )
);

// SSR Route
app.get('*', async (req, res) => {
  try {
    // Get necessary data on server
    const user = await getUserFromSession(req);
    const data = { user };
    
    // Render component to string
    const html = ReactDOMServer.renderToString(
      React.createElement(StaticRouter, { location: req.url },
        React.createElement(App, { data })
      )
    );
    
    // Complete HTML template
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>My SSR App</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          <div id="root">${html}</div>
          <script>
            window.__INITIAL_DATA__ = ${JSON.stringify(data)};
          </script>
          <script src="/client.js"></script>
        </body>
      </html>
    `;
    
    res.send(fullHtml);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Client (hydration)
// client.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

const App = ({ data }) => (
  <div>
    <h1>My App</h1>
    <p>User: {data.user.name}</p>
  </div>
);

// Hydrate with initial data
const initialData = window.__INITIAL_DATA__;
ReactDOM.hydrate(
  <BrowserRouter>
    <App data={initialData} />
  </BrowserRouter>,
  document.getElementById('root')
);
```

**Comparison:** SSR vs CSR (Client-Side Rendering) - SSR improves SEO and initial load time but increases server complexity, while CSR is simpler to develop but worse for SEO and initial load.

## Cache-Control and ETag
**Description:** HTTP caching mechanisms that optimize web performance by controlling when and how browsers and proxies store and reuse responses.

**Example:**
```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

// Middleware to generate ETag
function generateETag(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

// Cache-Control for static resources
app.use('/static', express.static('public', {
  maxAge: '1y', // Cache for 1 year
  etag: true,
  lastModified: true
}));

// API with intelligent caching
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['updatedAt', 'DESC']]
    });
    
    const data = JSON.stringify(products);
    const etag = generateETag(data);
    
    // Check If-None-Match header
    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end(); // Not Modified
    }
    
    res.set({
      'Cache-Control': 'public, max-age=300, must-revalidate', // 5 minutes
      'ETag': etag,
      'Last-Modified': new Date().toUTCString()
    });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Conditional cache for dynamic content
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const lastModified = user.updatedAt.toUTCString();
    
    // Check If-Modified-Since
    if (req.headers['if-modified-since'] === lastModified) {
      return res.status(304).end();
    }
    
    res.set({
      'Cache-Control': 'private, max-age=60', // Private cache 1 minute
      'Last-Modified': lastModified,
      'ETag': generateETag(JSON.stringify(user))
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Different caching strategies
app.get('/api/config', (req, res) => {
  // No cache for sensitive data
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  res.json({ apiVersion: '1.0' });
});

app.get('/api/public-data', (req, res) => {
  // Aggressive public cache
  res.set({
    'Cache-Control': 'public, max-age=86400, immutable' // 24 hours
  });
  
  res.json({ data: 'public information' });
});
```

**Comparison:** Cache-Control vs ETag - Cache-Control defines time-based caching policies, while ETag allows conditional validation based on content; used together they optimize both performance and data consistency.

## SPA (Single Page Application)
**Description:** Web applications that load a single HTML page and dynamically update content using JavaScript, providing a user experience similar to native applications.

**Example:**
```javascript
// React SPA with React Router
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Page components
const Home = () => <div><h1>Home</h1><p>Welcome to our SPA</p></div>;
const About = () => <div><h1>About</h1><p>Information about the company</p></div>;
const Products = () => {
  const [products, setProducts] = React.useState([]);
  
  React.useEffect(() => {
    // API call without page reload
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);
  
  return (
    <div>
      <h1>Products</h1>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
};

// Main app
function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> |
        <Link to="/about">About</Link> |
        <Link to="/products">Products</Link>
      </nav>
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </main>
    </Router>
  );
}

// Webpack configuration for SPA
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true, // Important for SPA routing
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};

// Lazy loading strategy in SPA
const LazyComponent = React.lazy(() => import('./components/HeavyComponent'));

function AppWithLazyLoading() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/heavy" 
          element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <LazyComponent />
            </React.Suspense>
          } 
        />
      </Routes>
    </Router>
  );
}

// Global state with Context API for SPA
const AppContext = React.createContext();

function AppProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [theme, setTheme] = React.useState('light');
  
  return (
    <AppContext.Provider value={{
      user, setUser,
      theme, setTheme
    }}>
      {children}
    </AppContext.Provider>
  );
}
```

**Comparison:** SPA vs MPA - SPAs provide smoother UX and speed after initial load, but have limited SEO without SSR and longer initial load time. MPAs (Multi-Page Applications) are better for SEO and faster initial load.

## PWA (Progressive Web App)
**Description:** Web applications that use modern technologies to provide a native app-like experience, including offline functionality, push notifications, and device installation.

**Example:**
```javascript
// Service Worker for offline functionality
// sw.js
const CACHE_NAME = 'my-pwa-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/api/products',
  '/offline.html'
];

// Service Worker installation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercept requests and serve from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return from cache if exists
        if (response) {
          return response;
        }
        
        // Otherwise, fetch from network
        return fetch(event.request)
          .then(response => {
            // Check valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // If fails, show offline page
            return caches.match('/offline.html');
          });
      })
  );
});

// Push Notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    actions: [
      {
        action: 'view',
        title: 'View details',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png'
      }
    ],
    data: {
      url: '/notifications'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('My PWA', options)
  );
});

// Service Worker registration in app
// main.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Web App Manifest
// manifest.json
{
  "name": "My Progressive Web App",
  "short_name": "My PWA",
  "description": "An amazing PWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/images/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}

// Push Notifications on client
async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;
  
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
  });
  
  // Send subscription to server
  fetch('/api/push-subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// PWA installation detection
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install button
  const installButton = document.getElementById('install-button');
  installButton.style.display = 'block';
  
  installButton.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted PWA install');
      }
      deferredPrompt = null;
    });
  });
});
```

**Comparison:** PWA vs Native App - PWAs are easier to develop and maintain, work across multiple platforms, but native apps have better performance and full access to device APIs.

## Headless Architecture
**Description:** Complete separation between frontend (head) and backend (body), where the backend exposes APIs to deliver content and the frontend consumes this data from any channel or device.

**Example:**
```javascript
// Headless CMS Backend with Node.js/Express
const express = require('express');
const app = express();

// Content model
class ContentModel {
  constructor() {
    this.articles = [
      {
        id: 1,
        title: "Introduction to Headless",
        slug: "introduction-headless",
        content: "Article content...",
        author: "John Doe",
        publishDate: "2024-01-15",
        tags: ["technology", "architecture"],
        seo: {
          metaTitle: "Introduction to Headless Architecture",
          metaDescription: "Learn about headless architecture"
        }
      }
    ];
  }
  
  getAll(filters = {}) {
    let filtered = [...this.articles];
    
    if (filters.tags) {
      filtered = filtered.filter(article => 
        article.tags.some(tag => filters.tags.includes(tag))
      );
    }
    
    if (filters.author) {
      filtered = filtered.filter(article => 
        article.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }
    
    return filtered;
  }
  
  getBySlug(slug) {
    return this.articles.find(article => article.slug === slug);
  }
}

const contentModel = new ContentModel();

// API Routes
app.get('/api/articles', (req, res) => {
  const { tags, author, limit } = req.query;
  const filters = {};
  
  if (tags) filters.tags = tags.split(',');
  if (author) filters.author = author;
  
  let articles = contentModel.getAll(filters);
  
  if (limit) {
    articles = articles.slice(0, parseInt(limit));
  }
  
  res.json({
    data: articles,
    meta: {
      total: articles.length,
      filters: filters
    }
  });
});

app.get('/api/articles/:slug', (req, res) => {
  const article = contentModel.getBySlug(req.params.slug);
  
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  
  res.json({ data: article });
});

// React Frontend consuming Headless API
import React, { useState, useEffect } from 'react';

function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  
  useEffect(() => {
    fetchArticles();
  }, [filters]);
  
  const fetchArticles = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    
    if (filters.tags) params.append('tags', filters.tags.join(','));
    if (filters.author) params.append('author', filters.author);
    
    try {
      const response = await fetch(`/api/articles?${params}`);
      const data = await response.json();
      setArticles(data.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1>Articles</h1>
      
      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by author"
          onChange={(e) => setFilters({...filters, author: e.target.value})}
        />
      </div>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="articles-grid">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article }) {
  return (
    <div className="article-card">
      <h3>{article.title}</h3>
      <p>By {article.author} - {article.publishDate}</p>
      <div className="tags">
        {article.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}

// React Native Mobile frontend consuming same API
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';

function MobileArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('https://api.mysite.com/api/articles')
      .then(response => response.json())
      .then(data => {
        setArticles(data.data);
        setLoading(false);
      });
  }, []);
  
  const renderArticle = ({ item }) => (
    <View style={styles.articleCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>By {item.author}</Text>
    </View>
  );
  
  if (loading) {
    return <ActivityIndicator size="large" />;
  }
  
  return (
    <FlatList
      data={articles}
      renderItem={renderArticle}
      keyExtractor={item => item.id.toString()}
    />
  );
}

// Next.js with Static Generation consuming Headless API
export async function getStaticProps() {
  const res = await fetch('https://api.mysite.com/api/articles');
  const data = await res.json();
  
  return {
    props: {
      articles: data.data
    },
    revalidate: 3600 // Regenerate every hour
  };
}

export default function HomePage({ articles }) {
  return (
    <div>
      <h1>My Headless Blog</h1>
      {articles.map(article => (
        <div key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.content}</p>
        </div>
      ))}
    </div>
  );
}
```

**Comparison:** Headless vs Traditional - Headless architecture allows greater flexibility and backend reuse for multiple frontends, but requires more initial development and integration management between systems.

## Microfrontends
**Description:** Architecture that allows dividing a frontend application into smaller, independent parts, developed and deployed by separate teams, similar to how microservices divide the backend.

**Example:**
```javascript
// Module Federation with Webpack 5
// Host App - webpack.config.js
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  mode: 'development',
  devServer: {
    port: 3000,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        mfHeader: 'header@http://localhost:3001/remoteEntry.js',
        mfProducts: 'products@http://localhost:3002/remoteEntry.js',
        mfCart: 'cart@http://localhost:3003/remoteEntry.js',
      },
    }),
  ],
};

// Host App - App.js
import React, { Suspense } from 'react';

// Lazy loading of remote microfrontends
const Header = React.lazy(() => import('mfHeader/Header'));
const ProductsList = React.lazy(() => import('mfProducts/ProductsList'));
const Cart = React.lazy(() => import('mfCart/Cart'));

function App() {
  return (
    <div className="app">
      <Suspense fallback={<div>Loading Header...</div>}>
        <Header />
      </Suspense>
      
      <main>
        <Suspense fallback={<div>Loading Products...</div>}>
          <ProductsList />
        </Suspense>
        
        <aside>
          <Suspense fallback={<div>Loading Cart...</div>}>
            <Cart />
          </Suspense>
        </aside>
      </main>
    </div>
  );
}

export default App;

// Microfrontend Header - webpack.config.js
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  mode: 'development',
  devServer: {
    port: 3001,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'header',
      filename: 'remoteEntry.js',
      exposes: {
        './Header': './src/Header',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};

// Microfrontend Header - src/Header.js
import React from 'react';

function Header() {
  return (
    <header style={{ background: '#333', color: 'white', padding: '1rem' }}>
      <h1>My E-commerce</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <a href="/cart">Cart</a>
      </nav>
    </header>
  );
}

export default Header;

// Web Components Approach
class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    const productId = this.getAttribute('product-id');
    this.render(productId);
  }
  
  async render(productId) {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const product = await response.json();
      
      this.shadowRoot.innerHTML = `
        <style>
          .card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .title { color: #333; font-size: 1.2em; }
          .price { color: #e74c3c; font-weight: bold; }
          .button {
            background: #3498db;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
          }
        </style>
        <div class="card">
          <h3 class="title">${product.name}</h3>
          <p class="price">$${product.price}</p>
          <p>${product.description}</p>
          <button class="button" onclick="this.addToCart()">
            Add to Cart
          </button>
        </div>
      `;
    } catch (error) {
      this.shadowRoot.innerHTML = `
        <div style="color: red;">Error loading product</div>
      `;
    }
  }
  
  addToCart() {
    const productId = this.getAttribute('product-id');
    // Emit custom event for microfrontend communication
    window.dispatchEvent(new CustomEvent('addToCart', {
      detail: { productId }
    }));
  }
}

customElements.define('product-card', ProductCard);

// Single-SPA Configuration
// index.js
import { registerApplication, start } from 'single-spa';

// Register applications
registerApplication({
  name: '@company/header',
  app: () => import('@company/header'),
  activeWhen: '/',
  customProps: {
    theme: 'dark'
  }
});

registerApplication({
  name: '@company/products',
  app: () => import('@company/products'),
  activeWhen: ['/products', '/'],
});

registerApplication({
  name: '@company/checkout',
  app: () => import('@company/checkout'),
  activeWhen: '/checkout',
});

// Global configuration
start({
  urlRerouteOnly: true,
});

// Shared State between Microfrontends
class SharedStore {
  constructor() {
    this.state = {
      user: null,
      cart: [],
      theme: 'light'
    };
    this.subscribers = [];
  }
  
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }
  
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.subscribers.forEach(callback => callback(this.state));
  }
  
  getState() {
    return this.state;
  }
  
  // Specific methods
  addToCart(product) {
    const cart = [...this.state.cart, product];
    this.setState({ cart });
  }
  
  setUser(user) {
    this.setState({ user });
  }
}

// Global shared instance
window.sharedStore = new SharedStore();

// Usage in microfrontend
function ProductComponent() {
  const [cart, setCart] = React.useState([]);
  
  React.useEffect(() => {
    const unsubscribe = window.sharedStore.subscribe((state) => {
      setCart(state.cart);
    });
    
    return unsubscribe;
  }, []);
  
  const handleAddToCart = (product) => {
    window.sharedStore.addToCart(product);
  };
  
  return (
    <div>
      <h2>Products</h2>
      <button onClick={() => handleAddToCart({ id: 1, name: 'Product 1' })}>
        Add to cart ({cart.length})
      </button>
    </div>
  );
}
```

**Comparison:** Microfrontends vs Monolithic Frontend - Microfrontends enable independent development and different technologies per team, but add integration complexity and can impact performance. Monolithic is simpler but can create bottlenecks in large teams.

## Real-Time Communication
**Description:** Technologies for real-time communication between client and server, enabling instant updates, push notifications, and live collaboration.

**Example:**
```javascript
// WebSockets with Socket.IO
// Node.js Server
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Global chat state
const chatRooms = new Map();
const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join a room
  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);
    users.set(socket.id, { username, roomId });
    
    if (!chatRooms.has(roomId)) {
      chatRooms.set(roomId, {
        messages: [],
        users: new Set()
      });
    }
    
    chatRooms.get(roomId).users.add(username);
    
    // Notify room
    socket.to(roomId).emit('user-joined', {
      username,
      message: `${username} joined the chat`
    });
    
    // Send connected users
    io.to(roomId).emit('users-update', 
      Array.from(chatRooms.get(roomId).users)
    );
  });
  
  // Handle messages
  socket.on('send-message', ({ message, roomId }) => {
    const user = users.get(socket.id);
    if (!user) return;
    
    const messageData = {
      id: Date.now(),
      username: user.username,
      message,
      timestamp: new Date().toISOString()
    };
    
    // Save message
    if (chatRooms.has(roomId)) {
      chatRooms.get(roomId).messages.push(messageData);
    }
    
    // Broadcast to room
    io.to(roomId).emit('new-message', messageData);
  });
  
  // User typing
  socket.on('typing', ({ roomId, username }) => {
    socket.to(roomId).emit('user-typing', username);
  });
  
  socket.on('stop-typing', ({ roomId, username }) => {
    socket.to(roomId).emit('user-stop-typing', username);
  });
  
  // Disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      const { username, roomId } = user;
      
      if (chatRooms.has(roomId)) {
        chatRooms.get(roomId).users.delete(username);
        
        socket.to(roomId).emit('user-left', {
          username,
          message: `${username} left the chat`
        });
        
        io.to(roomId).emit('users-update',
          Array.from(chatRooms.get(roomId).users)
        );
      }
      
      users.delete(socket.id);
    }
  });
});

// React Client
import io from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react';

function ChatApp() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState([]);
  const [roomId] = useState('general');
  const [username] = useState(`User_${Date.now()}`);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    
    // Join room
    newSocket.emit('join-room', { roomId, username });
    
    // Listen to messages
    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    // Listen to users
    newSocket.on('users-update', (usersList) => {
      setUsers(usersList);
    });
    
    // Listen to typing
    newSocket.on('user-typing', (user) => {
      setTyping(prev => [...prev, user]);
    });
    
    newSocket.on('user-stop-typing', (user) => {
      setTyping(prev => prev.filter(u => u !== user));
    });
    
    return () => newSocket.close();
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      socket.emit('send-message', { 
        message: newMessage, 
        roomId 
      });
      setNewMessage('');
    }
  };
  
  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', { roomId, username });
      setTimeout(() => {
        socket.emit('stop-typing', { roomId, username });
      }, 1000);
    }
  };
  
  return (
    <div className="chat-app">
      <div className="sidebar">
        <h3>Connected Users ({users.length})</h3>
        {users.map(user => (
          <div key={user} className="user">👤 {user}</div>
        ))}
      </div>
      
      <div className="chat-main">
        <div className="messages">
          {messages.map(msg => (
            <div key={msg.id} className="message">
              <strong>{msg.username}:</strong> {msg.message}
              <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
          ))}
          
          {typing.length > 0 && (
            <div className="typing-indicator">
              {typing.join(', ')} {typing.length === 1 ? 'is' : 'are'} typing...
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={sendMessage} className="message-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type your message..."
            className="message-input"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

// Server-Sent Events (SSE)
// Server
app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  
  // Send data every 5 seconds
  const interval = setInterval(() => {
    const data = {
      timestamp: new Date().toISOString(),
      users: users.size,
      activeRooms: chatRooms.size
    };
    
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 5000);
  
  // Clean up when client disconnects
  req.on('close', () => {
    clearInterval(interval);
  });
});

// SSE Client
function DashboardStats() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    const eventSource = new EventSource('/api/events');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStats(data);
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };
    
    return () => {
      eventSource.close();
    };
  }, []);
  
  if (!stats) return <div>Connecting...</div>;
  
  return (
    <div className="dashboard">
      <h2>Real-time Statistics</h2>
      <div className="stat">👥 Users: {stats.users}</div>
      <div className="stat">🏠 Rooms: {stats.activeRooms}</div>
      <div className="stat">🕒 Last update: {stats.timestamp}</div>
    </div>
  );
}

// Long Polling
async function longPoll() {
  try {
    const response = await fetch('/api/poll', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      handleNewData(data);
    }
  } catch (error) {
    console.error('Polling error:', error);
  } finally {
    // Restart polling
    setTimeout(longPoll, 1000);
  }
}

// Start long polling
longPoll();
```

**Comparison:** WebSockets vs SSE vs Long Polling - WebSockets enable full bidirectional communication, SSE is ideal for unidirectional server updates, and Long Polling is simpler but less efficient for high-frequency updates.

## Event-Driven Architecture
**Description:** Architectural pattern where components communicate through events, enabling decoupling, scalability, and asynchronous processing in distributed systems.

**Example:**
```javascript
// Simple Event Bus with Node.js EventEmitter
const EventEmitter = require('events');

class ApplicationEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100); // Allow many listeners
  }
  
  // Convenience methods
  publishEvent(eventName, data) {
    console.log(`📢 Publishing event: ${eventName}`, data);
    this.emit(eventName, data);
  }
  
  subscribeToEvent(eventName, handler) {
    console.log(`👂 Subscribing to: ${eventName}`);
    this.on(eventName, handler);
  }
  
  unsubscribeFromEvent(eventName, handler) {
    this.off(eventName, handler);
  }
}

const eventBus = new ApplicationEventBus();

// Services that publish events
class OrderService {
  async createOrder(orderData) {
    try {
      // Order creation logic
      const order = {
        id: Date.now(),
        ...orderData,
        status: 'created',
        timestamp: new Date().toISOString()
      };
      
      // Publish event
      eventBus.publishEvent('order.created', {
        orderId: order.id,
        customerId: order.customerId,
        total: order.total,
        items: order.items
      });
      
      return order;
    } catch (error) {
      eventBus.publishEvent('order.creation.failed', {
        error: error.message,
        orderData
      });
      throw error;
    }
  }
  
  async updateOrderStatus(orderId, status) {
    // Update status
    const order = { id: orderId, status };
    
    eventBus.publishEvent('order.status.updated', {
      orderId,
      previousStatus: 'created',
      newStatus: status,
      timestamp: new Date().toISOString()
    });
    
    return order;
  }
}

// Services that listen to events
class InventoryService {
  constructor() {
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    eventBus.subscribeToEvent('order.created', this.handleOrderCreated.bind(this));
    eventBus.subscribeToEvent('order.cancelled', this.handleOrderCancelled.bind(this));
  }
  
  async handleOrderCreated(orderData) {
    console.log('📦 Inventory: Processing new order', orderData.orderId);
    
    try {
      // Check stock
      for (const item of orderData.items) {
        await this.checkStock(item.productId, item.quantity);
        await this.reserveStock(item.productId, item.quantity);
      }
      
      eventBus.publishEvent('inventory.reserved', {
        orderId: orderData.orderId,
        items: orderData.items
      });
    } catch (error) {
      eventBus.publishEvent('inventory.reservation.failed', {
        orderId: orderData.orderId,
        error: error.message
      });
    }
  }
  
  async handleOrderCancelled(orderData) {
    console.log('📦 Inventory: Releasing stock for cancelled order', orderData.orderId);
    // Release reserved stock
    await this.releaseReservedStock(orderData.orderId);
  }
  
  async checkStock(productId, quantity) {
    // Simulate stock verification
    return true;
  }
  
  async reserveStock(productId, quantity) {
    // Simulate stock reservation
    return true;
  }
  
  async releaseReservedStock(orderId) {
    // Simulate stock release
    return true;
  }
}

class PaymentService {
  constructor() {
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    eventBus.subscribeToEvent('inventory.reserved', this.handleInventoryReserved.bind(this));
    eventBus.subscribeToEvent('payment.failed', this.handlePaymentFailed.bind(this));
  }
  
  async handleInventoryReserved(eventData) {
    console.log('💳 Payment: Processing payment for order', eventData.orderId);
    
    try {
      // Simulate payment processing
      const paymentResult = await this.processPayment(eventData.orderId);
      
      if (paymentResult.success) {
        eventBus.publishEvent('payment.completed', {
          orderId: eventData.orderId,
          paymentId: paymentResult.paymentId,
          amount: paymentResult.amount
        });
      } else {
        eventBus.publishEvent('payment.failed', {
          orderId: eventData.orderId,
          error: paymentResult.error
        });
      }
    } catch (error) {
      eventBus.publishEvent('payment.failed', {
        orderId: eventData.orderId,
        error: error.message
      });
    }
  }
  
  async processPayment(orderId) {
    // Simulate processing
    return {
      success: Math.random() > 0.1, // 90% success
      paymentId: `pay_${Date.now()}`,
      amount: 99.99,
      error: Math.random() > 0.1 ? null : 'Insufficient funds'
    };
  }
}

class NotificationService {
  constructor() {
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    eventBus.subscribeToEvent('order.created', this.handleOrderCreated.bind(this));
    eventBus.subscribeToEvent('payment.completed', this.handlePaymentCompleted.bind(this));
    eventBus.subscribeToEvent('payment.failed', this.handlePaymentFailed.bind(this));
    eventBus.subscribeToEvent('order.shipped', this.handleOrderShipped.bind(this));
  }
  
  async handleOrderCreated(orderData) {
    await this.sendNotification(orderData.customerId, {
      type: 'order_created',
      message: `Your order #${orderData.orderId} has been created successfully`,
      orderId: orderData.orderId
    });
  }
  
  async handlePaymentCompleted(paymentData) {
    await this.sendNotification(paymentData.customerId, {
      type: 'payment_completed',
      message: `Payment for your order #${paymentData.orderId} was processed`,
      paymentId: paymentData.paymentId
    });
  }
  
  async handlePaymentFailed(paymentData) {
    await this.sendNotification(paymentData.customerId, {
      type: 'payment_failed',
      message: `Payment for your order #${paymentData.orderId} failed. Please try again`,
      error: paymentData.error
    });
  }
  
  async sendNotification(customerId, notification) {
    console.log(`📧 Notification sent to customer ${customerId}:`, notification.message);
    // Implement real sending (email, SMS, push notification)
  }
}

// Service initialization
const orderService = new OrderService();
const inventoryService = new InventoryService();
const paymentService = new PaymentService();
const notificationService = new NotificationService();

// System usage
async function processOrder() {
  const orderData = {
    customerId: 'customer_123',
    total: 99.99,
    items: [
      { productId: 'prod_1', quantity: 2, price: 29.99 },
      { productId: 'prod_2', quantity: 1, price: 39.99 }
    ]
  };
  
  try {
    const order = await orderService.createOrder(orderData);
    console.log('✅ Order created successfully:', order.id);
  } catch (error) {
    console.error('❌ Order creation failed:', error.message);
  }
}

// With Redis for scalability
const redis = require('redis');
const redisClient = redis.createClient();

class DistributedEventBus {
  constructor() {
    this.localEventBus = new EventEmitter();
    this.setupRedisSubscription();
  }
  
  async publishEvent(eventName, data) {
    const eventData = {
      eventName,
      data,
      timestamp: new Date().toISOString(),
      source: process.env.SERVICE_NAME || 'unknown'
    };
    
    // Publish locally
    this.localEventBus.emit(eventName, data);
    
    // Publish in Redis for other services
    await redisClient.publish('events', JSON.stringify(eventData));
  }
  
  subscribeToEvent(eventName, handler) {
    this.localEventBus.on(eventName, handler);
  }
  
  setupRedisSubscription() {
    const subscriber = redis.createClient();
    
    subscriber.subscribe('events');
    subscriber.on('message', (channel, message) => {
      if (channel === 'events') {
        const eventData = JSON.parse(message);
        
        // Avoid processing events from same service
        if (eventData.source !== process.env.SERVICE_NAME) {
          this.localEventBus.emit(eventData.eventName, eventData.data);
        }
      }
    });
  }
}

// Example with queues for guaranteed delivery
const Queue = require('bull');
const eventQueue = new Queue('event processing', {
  redis: { port: 6379, host: '127.0.0.1' }
});

// Process events asynchronously and reliably
eventQueue.process('order.created', async (job) => {
  const { orderData } = job.data;
  
  try {
    await inventoryService.handleOrderCreated(orderData);
    console.log(`✅ Order ${orderData.orderId} processed successfully`);
  } catch (error) {
    console.error(`❌ Failed to process order ${orderData.orderId}:`, error);
    throw error; // Bull will retry automatically
  }
});

// Add events to queue
eventBus.subscribeToEvent('order.created', (orderData) => {
  eventQueue.add('order.created', { orderData }, {
    attempts: 3,
    backoff: 'exponential',
    delay: 1000
  });
});
```

**Comparison:** Event-Driven vs Request-Response - Event-driven architecture enables better decoupling and scalability, ideal for microservices, while request-response is more straightforward and easier to debug, better for simple synchronous operations.
