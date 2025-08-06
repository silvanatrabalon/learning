# Guía de Arquitectura de Software

## REST vs GraphQL
**Descripción:** Dos paradigmas diferentes para diseñar APIs: REST sigue principios de arquitectura basada en recursos y HTTP, mientras que GraphQL permite consultas flexibles con un solo endpoint.

**Ejemplo:**
```javascript
// REST API
// GET /api/users - Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email']
  });
  res.json(users);
});

// GET /api/users/:id - Obtener usuario específico
app.get('/api/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: ['posts', 'profile']
  });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
});

// POST /api/users - Crear usuario
app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.status(201).json(user);
});

// PUT /api/users/:id - Actualizar usuario
app.put('/api/users/:id', async (req, res) => {
  const [updated] = await User.update(req.body, {
    where: { id: req.params.id }
  });
  if (!updated) return res.status(404).json({ error: 'Usuario no encontrado' });
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

// Consulta GraphQL
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

**Comparación:** REST vs GraphQL - REST es simple y cacheable, ideal para operaciones CRUD estándar, mientras que GraphQL es más flexible permitiendo consultas específicas pero requiere más configuración y gestión de caché compleja.

## SPA (Single Page Application)
**Descripción:** Aplicaciones web que cargan una sola página HTML y actualizan dinámicamente el contenido usando JavaScript, proporcionando una experiencia de usuario similar a aplicaciones nativas.

**Ejemplo:**
```javascript
// React SPA con React Router
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Componentes de páginas
const Home = () => <div><h1>Inicio</h1><p>Bienvenido a nuestra SPA</p></div>;
const About = () => <div><h1>Acerca de</h1><p>Información sobre la empresa</p></div>;
const Products = () => {
  const [products, setProducts] = React.useState([]);
  
  React.useEffect(() => {
    // Llamada a API sin recargar la página
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);
  
  return (
    <div>
      <h1>Productos</h1>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
};

// App principal
function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Inicio</Link> |
        <Link to="/about">Acerca de</Link> |
        <Link to="/products">Productos</Link>
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

// Configuración de Webpack para SPA
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true, // Importante para SPA routing
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

// Estrategia de lazy loading en SPA
const LazyComponent = React.lazy(() => import('./components/HeavyComponent'));

function AppWithLazyLoading() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/heavy" 
          element={
            <React.Suspense fallback={<div>Cargando...</div>}>
              <LazyComponent />
            </React.Suspense>
          } 
        />
      </Routes>
    </Router>
  );
}

// Estado global con Context API para SPA
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

**Comparación:** SPA vs MPA - Las SPA ofrecen UX más fluida y velocidad después de la carga inicial, pero tienen SEO limitado sin SSR y mayor tiempo de carga inicial. Las MPA (Multi-Page Applications) son mejores para SEO y carga inicial más rápida.

## PWA (Progressive Web App)
**Descripción:** Aplicaciones web que utilizan tecnologías modernas para proporcionar una experiencia similar a las aplicaciones nativas, incluyendo funcionalidad offline, push notifications e instalación en dispositivos.

**Ejemplo:**
```javascript
// Service Worker para funcionalidad offline
// sw.js
const CACHE_NAME = 'my-pwa-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/api/products',
  '/offline.html'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requests y servir desde cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devolver desde cache si existe
        if (response) {
          return response;
        }
        
        // Sino, fetch de la red
        return fetch(event.request)
          .then(response => {
            // Verificar respuesta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clonar respuesta
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Si falla, mostrar página offline
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
        title: 'Ver detalles',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/images/xmark.png'
      }
    ],
    data: {
      url: '/notifications'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Mi PWA', options)
  );
});

// Registro del Service Worker en la app
// main.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registrado: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration falló: ', registrationError);
      });
  });
}

// Web App Manifest
// manifest.json
{
  "name": "Mi Progressive Web App",
  "short_name": "Mi PWA",
  "description": "Una increíble PWA",
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

// Push Notifications en cliente
async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;
  
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
  });
  
  // Enviar subscription al servidor
  fetch('/api/push-subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// Detección de instalación PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Mostrar botón de instalación
  const installButton = document.getElementById('install-button');
  installButton.style.display = 'block';
  
  installButton.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuario aceptó instalar PWA');
      }
      deferredPrompt = null;
    });
  });
});
```

**Comparación:** PWA vs Native App - Las PWA son más fáciles de desarrollar y mantener, funcionan en múltiples plataformas, pero las apps nativas tienen mejor rendimiento y acceso completo a APIs del dispositivo.

## Arquitectura Headless
**Descripción:** Separación completa entre el frontend (head) y backend (body), donde el backend expone APIs para entregar contenido y el frontend consume estos datos desde cualquier canal o dispositivo.

**Ejemplo:**
```javascript
// Backend Headless CMS con Node.js/Express
const express = require('express');
const app = express();

// Modelo de contenido
class ContentModel {
  constructor() {
    this.articles = [
      {
        id: 1,
        title: "Introducción a Headless",
        slug: "introduccion-headless",
        content: "Contenido del artículo...",
        author: "Juan Pérez",
        publishDate: "2024-01-15",
        tags: ["tecnología", "arquitectura"],
        seo: {
          metaTitle: "Introducción a Arquitectura Headless",
          metaDescription: "Aprende sobre arquitectura headless"
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
    return res.status(404).json({ error: 'Artículo no encontrado' });
  }
  
  res.json({ data: article });
});

// Frontend React consumiendo API Headless
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
      <h1>Artículos</h1>
      
      {/* Filtros */}
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por autor"
          onChange={(e) => setFilters({...filters, author: e.target.value})}
        />
      </div>
      
      {loading ? (
        <div>Cargando...</div>
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
      <p>Por {article.author} - {article.publishDate}</p>
      <div className="tags">
        {article.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}

// Frontend móvil React Native consumiendo misma API
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';

function MobileArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('https://api.misite.com/api/articles')
      .then(response => response.json())
      .then(data => {
        setArticles(data.data);
        setLoading(false);
      });
  }, []);
  
  const renderArticle = ({ item }) => (
    <View style={styles.articleCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>Por {item.author}</Text>
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

// Next.js con Static Generation consumiendo API Headless
export async function getStaticProps() {
  const res = await fetch('https://api.misite.com/api/articles');
  const data = await res.json();
  
  return {
    props: {
      articles: data.data
    },
    revalidate: 3600 // Regenerar cada hora
  };
}

export default function HomePage({ articles }) {
  return (
    <div>
      <h1>Mi Blog Headless</h1>
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

**Comparación:** Headless vs Tradicional - La arquitectura headless permite mayor flexibilidad y reutilización del backend para múltiples frontends, pero requiere más desarrollo inicial y gestión de integración entre sistemas.

## Server-Side Rendering (SSR)
**Descripción:** Técnica donde el contenido HTML se genera en el servidor antes de enviarlo al cliente, mejorando el SEO y la experiencia inicial del usuario.

**Ejemplo:**
```javascript
// Express con SSR usando React
const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');

const app = express();

// Componente React
const App = ({ data }) => (
  React.createElement('div', null,
    React.createElement('h1', null, 'Mi App'),
    React.createElement('p', null, `Usuario: ${data.user.name}`)
  )
);

// SSR Route
app.get('*', async (req, res) => {
  try {
    // Obtener datos necesarios en el servidor
    const user = await getUserFromSession(req);
    const data = { user };
    
    // Renderizar componente a string
    const html = ReactDOMServer.renderToString(
      React.createElement(StaticRouter, { location: req.url },
        React.createElement(App, { data })
      )
    );
    
    // Template HTML completo
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mi App SSR</title>
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
    res.status(500).send('Error del servidor');
  }
});

// Cliente (hidratación)
// client.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

const App = ({ data }) => (
  <div>
    <h1>Mi App</h1>
    <p>Usuario: {data.user.name}</p>
  </div>
);

// Hidratar con datos iniciales
const initialData = window.__INITIAL_DATA__;
ReactDOM.hydrate(
  <BrowserRouter>
    <App data={initialData} />
  </BrowserRouter>,
  document.getElementById('root')
);
```

**Comparación:** SSR vs CSR (Client-Side Rendering) - SSR mejora SEO y tiempo de carga inicial pero aumenta complejidad del servidor, mientras que CSR es más simple de desarrollar pero peor para SEO y carga inicial.

## Cache-Control y ETag
**Descripción:** Mecanismos de caché HTTP que optimizan el rendimiento web controlando cuándo y cómo los navegadores y proxies almacenan y reutilizan respuestas.

**Ejemplo:**
```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

// Middleware para generar ETag
function generateETag(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

// Cache-Control para recursos estáticos
app.use('/static', express.static('public', {
  maxAge: '1y', // Cache por 1 año
  etag: true,
  lastModified: true
}));

// API con cache inteligente
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['updatedAt', 'DESC']]
    });
    
    const data = JSON.stringify(products);
    const etag = generateETag(data);
    
    // Verificar If-None-Match header
    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end(); // Not Modified
    }
    
    res.set({
      'Cache-Control': 'public, max-age=300, must-revalidate', // 5 minutos
      'ETag': etag,
      'Last-Modified': new Date().toUTCString()
    });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Cache condicional para contenido dinámico
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    const lastModified = user.updatedAt.toUTCString();
    
    // Verificar If-Modified-Since
    if (req.headers['if-modified-since'] === lastModified) {
      return res.status(304).end();
    }
    
    res.set({
      'Cache-Control': 'private, max-age=60', // Cache privado 1 minuto
      'Last-Modified': lastModified,
      'ETag': generateETag(JSON.stringify(user))
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Diferentes estrategias de cache
app.get('/api/config', (req, res) => {
  // No cache para datos sensibles
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  res.json({ apiVersion: '1.0' });
});

app.get('/api/public-data', (req, res) => {
  // Cache público agresivo
  res.set({
    'Cache-Control': 'public, max-age=86400, immutable' // 24 horas
  });
  
  res.json({ data: 'información pública' });
});
```

**Comparación:** Cache-Control vs ETag - Cache-Control define políticas de tiempo de caché, mientras que ETag permite validación condicional basada en contenido; usados juntos optimizan tanto el rendimiento como la consistencia de datos.

## Microfrontends
**Descripción:** Arquitectura que permite dividir una aplicación frontend en partes más pequeñas e independientes, desarrolladas y desplegadas por equipos separados, similar a como los microservicios dividen el backend.

**Ejemplo:**
```javascript
// Module Federation con Webpack 5
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

// Lazy loading de microfrontends remotos
const Header = React.lazy(() => import('mfHeader/Header'));
const ProductsList = React.lazy(() => import('mfProducts/ProductsList'));
const Cart = React.lazy(() => import('mfCart/Cart'));

function App() {
  return (
    <div className="app">
      <Suspense fallback={<div>Cargando Header...</div>}>
        <Header />
      </Suspense>
      
      <main>
        <Suspense fallback={<div>Cargando Productos...</div>}>
          <ProductsList />
        </Suspense>
        
        <aside>
          <Suspense fallback={<div>Cargando Carrito...</div>}>
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
      <h1>Mi E-commerce</h1>
      <nav>
        <a href="/">Inicio</a>
        <a href="/products">Productos</a>
        <a href="/cart">Carrito</a>
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
            Agregar al Carrito
          </button>
        </div>
      `;
    } catch (error) {
      this.shadowRoot.innerHTML = `
        <div style="color: red;">Error cargando producto</div>
      `;
    }
  }
  
  addToCart() {
    const productId = this.getAttribute('product-id');
    // Emitir evento custom para comunicación entre microfrontends
    window.dispatchEvent(new CustomEvent('addToCart', {
      detail: { productId }
    }));
  }
}

customElements.define('product-card', ProductCard);

// Single-SPA Configuration
// index.js
import { registerApplication, start } from 'single-spa';

// Registrar aplicaciones
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

// Configuración global
start({
  urlRerouteOnly: true,
});

// Shared State entre Microfrontends
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
  
  // Métodos específicos
  addToCart(product) {
    const cart = [...this.state.cart, product];
    this.setState({ cart });
  }
  
  setUser(user) {
    this.setState({ user });
  }
}

// Instancia global compartida
window.sharedStore = new SharedStore();

// Uso en microfrontend
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
      <h2>Productos</h2>
      <button onClick={() => handleAddToCart({ id: 1, name: 'Producto 1' })}>
        Agregar al carrito ({cart.length})
      </button>
    </div>
  );
}
```

**Comparación:** Microfrontends vs Monolito Frontend - Los microfrontends permiten desarrollo independiente y tecnologías diferentes por equipo, pero agregan complejidad de integración y pueden impactar el rendimiento. El monolito es más simple pero puede crear cuellos de botella en equipos grandes.

## Real-Time Communication
**Descripción:** Tecnologías para comunicación en tiempo real entre cliente y servidor, permitiendo actualizaciones instantáneas, notificaciones push y colaboración en vivo.

**Ejemplo:**
```javascript
// WebSockets con Socket.IO
// Servidor Node.js
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

// Estado global del chat
const chatRooms = new Map();
const users = new Map();

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);
  
  // Unirse a una sala
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
    
    // Notificar a la sala
    socket.to(roomId).emit('user-joined', {
      username,
      message: `${username} se unió al chat`
    });
    
    // Enviar usuarios conectados
    io.to(roomId).emit('users-update', 
      Array.from(chatRooms.get(roomId).users)
    );
  });
  
  // Manejar mensajes
  socket.on('send-message', ({ message, roomId }) => {
    const user = users.get(socket.id);
    if (!user) return;
    
    const messageData = {
      id: Date.now(),
      username: user.username,
      message,
      timestamp: new Date().toISOString()
    };
    
    // Guardar mensaje
    if (chatRooms.has(roomId)) {
      chatRooms.get(roomId).messages.push(messageData);
    }
    
    // Broadcast a la sala
    io.to(roomId).emit('new-message', messageData);
  });
  
  // Usuario escribiendo
  socket.on('typing', ({ roomId, username }) => {
    socket.to(roomId).emit('user-typing', username);
  });
  
  socket.on('stop-typing', ({ roomId, username }) => {
    socket.to(roomId).emit('user-stop-typing', username);
  });
  
  // Desconexión
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      const { username, roomId } = user;
      
      if (chatRooms.has(roomId)) {
        chatRooms.get(roomId).users.delete(username);
        
        socket.to(roomId).emit('user-left', {
          username,
          message: `${username} dejó el chat`
        });
        
        io.to(roomId).emit('users-update',
          Array.from(chatRooms.get(roomId).users)
        );
      }
      
      users.delete(socket.id);
    }
  });
});

// Cliente React
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
    
    // Unirse al room
    newSocket.emit('join-room', { roomId, username });
    
    // Escuchar mensajes
    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    // Escuchar usuarios
    newSocket.on('users-update', (usersList) => {
      setUsers(usersList);
    });
    
    // Escuchar typing
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
        <h3>Usuarios Conectados ({users.length})</h3>
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
              {typing.join(', ')} {typing.length === 1 ? 'está' : 'están'} escribiendo...
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
            placeholder="Escribe tu mensaje..."
            className="message-input"
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}

// Server-Sent Events (SSE)
// Servidor
app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  
  // Enviar datos cada 5 segundos
  const interval = setInterval(() => {
    const data = {
      timestamp: new Date().toISOString(),
      users: users.size,
      activeRooms: chatRooms.size
    };
    
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 5000);
  
  // Limpiar cuando el cliente se desconecta
  req.on('close', () => {
    clearInterval(interval);
  });
});

// Cliente SSE
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
  
  if (!stats) return <div>Conectando...</div>;
  
  return (
    <div className="dashboard">
      <h2>Estadísticas en Tiempo Real</h2>
      <div className="stat">👥 Usuarios: {stats.users}</div>
      <div className="stat">🏠 Salas: {stats.activeRooms}</div>
      <div className="stat">🕒 Última actualización: {stats.timestamp}</div>
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
    // Reiniciar polling
    setTimeout(longPoll, 1000);
  }
}

// Iniciar long polling
longPoll();
```

**Comparación:** WebSockets vs SSE vs Long Polling - WebSockets permiten comunicación bidireccional completa, SSE es ideal para actualizaciones unidireccionales del servidor, y Long Polling es más simple pero menos eficiente para alta frecuencia de actualizaciones.

## Event-Driven Architecture
**Descripción:** Patrón arquitectónico donde los componentes comunican a través de eventos, permitiendo desacoplamiento, escalabilidad y procesamiento asíncrono en sistemas distribuidos.

**Ejemplo:**
```javascript
// Event Bus simple con Node.js EventEmitter
const EventEmitter = require('events');

class ApplicationEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100); // Permitir muchos listeners
  }
  
  // Métodos de conveniencia
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

// Servicios que publican eventos
class OrderService {
  async createOrder(orderData) {
    try {
      // Lógica de creación de orden
      const order = {
        id: Date.now(),
        ...orderData,
        status: 'created',
        timestamp: new Date().toISOString()
      };
      
      // Publicar evento
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
    // Actualizar status
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

// Servicios que escuchan eventos
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
      // Verificar stock
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
    // Liberar stock reservado
    await this.releaseReservedStock(orderData.orderId);
  }
  
  async checkStock(productId, quantity) {
    // Simular verificación de stock
    return true;
  }
  
  async reserveStock(productId, quantity) {
    // Simular reserva de stock
    return true;
  }
  
  async releaseReservedStock(orderId) {
    // Simular liberación de stock
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
      // Simular procesamiento de pago
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
    // Simular procesamiento
    return {
      success: Math.random() > 0.1, // 90% éxito
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
      message: `Tu orden #${orderData.orderId} ha sido creada exitosamente`,
      orderId: orderData.orderId
    });
  }
  
  async handlePaymentCompleted(paymentData) {
    await this.sendNotification(paymentData.customerId, {
      type: 'payment_completed',
      message: `El pago de tu orden #${paymentData.orderId} fue procesado`,
      paymentId: paymentData.paymentId
    });
  }
  
  async handlePaymentFailed(paymentData) {
    await this.sendNotification(paymentData.customerId, {
      type: 'payment_failed',
      message: `El pago de tu orden #${paymentData.orderId} falló. Por favor intenta nuevamente`,
      error: paymentData.error
    });
  }
  
  async sendNotification(customerId, notification) {
    console.log(`📧 Notification sent to customer ${customerId}:`, notification.message);
    // Implementar envío real (email, SMS, push notification)
  }
}

// Inicialización de servicios
const orderService = new OrderService();
const inventoryService = new InventoryService();
const paymentService = new PaymentService();
const notificationService = new NotificationService();

// Uso del sistema
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

// Con Redis para escalabilidad
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
    
    // Publicar localmente
    this.localEventBus.emit(eventName, data);
    
    // Publicar en Redis para otros servicios
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
        
        // Evitar procesar eventos del mismo servicio
        if (eventData.source !== process.env.SERVICE_NAME) {
          this.localEventBus.emit(eventData.eventName, eventData.data);
        }
      }
    });
  }
}

// Ejemplo con colas para garantizar entrega
const Queue = require('bull');
const eventQueue = new Queue('event processing', {
  redis: { port: 6379, host: '127.0.0.1' }
});

// Procesar eventos de forma asíncrona y confiable
eventQueue.process('order.created', async (job) => {
  const { orderData } = job.data;
  
  try {
    await inventoryService.handleOrderCreated(orderData);
    console.log(`✅ Order ${orderData.orderId} processed successfully`);
  } catch (error) {
    console.error(`❌ Failed to process order ${orderData.orderId}:`, error);
    throw error; // Bull reintentará automáticamente
  }
});

// Agregar eventos a la cola
eventBus.subscribeToEvent('order.created', (orderData) => {
  eventQueue.add('order.created', { orderData }, {
    attempts: 3,
    backoff: 'exponential',
    delay: 1000
  });
});
```

**Comparación:** Event-Driven vs Request-Response - La arquitectura dirigida por eventos permite mejor desacoplamiento y escalabilidad, ideal para microservicios, mientras que request-response es más directo y fácil de debuggear, mejor para operaciones síncronas simples.
