# Guía de Next.js

## App Router
**Descripción:** El nuevo sistema de enrutamiento en Next.js 13+ que usa la estructura del directorio `app` para mejor organización y rendimiento.

**Ejemplo:**
```jsx
// app/page.js
export default function HomePage() {
  return <h1>¡Bienvenido a Next.js!</h1>
}

// app/about/page.js
export default function AboutPage() {
  return <h1>Acerca de Nosotros</h1>
}
```

**Comparación:** App Router vs Pages Router - App Router proporciona mejor rendimiento con React Server Components y streaming, mientras que Pages Router es el sistema tradicional de enrutamiento basado en archivos.

## Server Components
**Descripción:** Componentes de React que se ejecutan en el servidor, reduciendo el tamaño del bundle y mejorando el rendimiento al obtener datos del lado del servidor.

**Ejemplo:**
```jsx
// Este es un Server Component por defecto en el directorio app
async function UserProfile({ userId }) {
  const user = await fetch(`/api/users/${userId}`)
  const userData = await user.json()
  
  return (
    <div>
      <h1>{userData.name}</h1>
      <p>{userData.email}</p>
    </div>
  )
}
```

**Comparación:** Server Components vs Client Components - Los Server Components se ejecutan en el servidor y pueden acceder directamente a bases de datos, mientras que los Client Components se ejecutan en el navegador y pueden usar hooks y event handlers.

## Middleware
**Descripción:** Funciones que se ejecutan antes de que se complete una solicitud, permitiéndote modificar la respuesta reescribiendo, redirigiendo o modificando headers.

**Ejemplo:**
```javascript
// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}

export const config = {
  matcher: '/admin/:path*'
}
```

**Comparación:** Middleware vs API Routes - El Middleware se ejecuta antes de que la solicitud llegue a tu página o ruta API, siendo ideal para autenticación y redirecciones, mientras que las API Routes manejan la lógica de negocio real.

## Generación de Sitios Estáticos (SSG)
**Descripción:** Pre-renderiza páginas en tiempo de construcción, creando archivos HTML estáticos que pueden ser servidos por un CDN para rendimiento óptimo.

**Ejemplo:**
```jsx
// Esta página será pre-renderizada en tiempo de construcción
export default function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}

export async function getStaticProps({ params }) {
  const post = await fetchPost(params.id)
  
  return {
    props: { post },
    revalidate: 60 // Regenerar página cada 60 segundos
  }
}

export async function getStaticPaths() {
  const posts = await fetchAllPosts()
  const paths = posts.map(post => ({
    params: { id: post.id }
  }))
  
  return { paths, fallback: false }
}
```

**Comparación:** SSG vs SSR - SSG genera páginas en tiempo de construcción para mejor rendimiento, mientras que SSR genera páginas en cada solicitud para contenido dinámico.

## API Routes
**Descripción:** Endpoints API integrados que te permiten crear funcionalidad backend dentro de tu aplicación Next.js.

**Ejemplo:**
```javascript
// pages/api/users/[id].js o app/api/users/[id]/route.js
export async function GET(request, { params }) {
  const userId = params.id
  const user = await database.users.findById(userId)
  
  return Response.json(user)
}

export async function POST(request) {
  const body = await request.json()
  const newUser = await database.users.create(body)
  
  return Response.json(newUser, { status: 201 })
}
```

**Comparación:** API Routes vs API Externa - Las API Routes están co-localizadas con tu código frontend y comparten el mismo deployment, mientras que las APIs externas requieren hosting y gestión separados.

## Client Navigation (Link y useRouter)
**Descripción:** Sistema de navegación del lado del cliente que permite transiciones entre páginas sin recargar la página completa, mejorando la experiencia del usuario con prefetch automático.

**Ejemplo:**
```jsx
import Link from 'next/link'
import { useRouter } from 'next/router'

function Navigation() {
  const router = useRouter()
  
  const handleNavigation = () => {
    router.push('/dashboard')
  }
  
  return (
    <nav>
      <Link href="/about" prefetch={true}>
        Acerca de
      </Link>
      <Link href="/products/[id]" as="/products/123">
        Producto 123
      </Link>
      <button onClick={handleNavigation}>
        Ir al Dashboard
      </button>
    </nav>
  )
}
```

**Comparación:** Client Navigation vs Navegación tradicional - La navegación del cliente es más rápida ya que no recarga la página completa y permite prefetch, mientras que la navegación tradicional requiere cargar toda la página desde el servidor.

## Optimización de Imágenes
**Descripción:** Next.js optimiza automáticamente las imágenes con redimensionamiento, lazy loading, conversión a formatos modernos como WebP, y responsive design para mejorar el rendimiento.

**Ejemplo:**
```jsx
import Image from 'next/image'

function Gallery() {
  return (
    <div>
      {/* Imagen optimizada con lazy loading */}
      <Image
        src="/hero.jpg"
        alt="Imagen principal"
        width={800}
        height={400}
        priority // Cargar inmediatamente para LCP
      />
      
      {/* Imagen responsive */}
      <Image
        src="/gallery/photo1.jpg"
        alt="Foto de galería"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}
```

**Comparación:** next/image vs img tradicional - next/image proporciona optimización automática, lazy loading y responsive design, mientras que img tradicional requiere optimización manual y no tiene estas características integradas.

## Error Pages Personalizadas
**Descripción:** Páginas de error personalizadas que permiten manejar errores 404, 500 y otros códigos de estado con interfaces consistentes con el diseño de tu aplicación.

**Ejemplo:**
```jsx
// pages/404.js (Pages Router)
export default function Custom404() {
  return (
    <div>
      <h1>404 - Página No Encontrada</h1>
      <p>La página que buscas no existe.</p>
      <Link href="/">Volver al inicio</Link>
    </div>
  )
}

// app/not-found.tsx (App Router)
export default function NotFound() {
  return (
    <div>
      <h2>No Encontrado</h2>
      <p>No se pudo encontrar el recurso solicitado</p>
      <Link href="/">Regresar al Inicio</Link>
    </div>
  )
}

// pages/_error.js (Para errores 500)
function Error({ statusCode }) {
  return (
    <p>
      {statusCode
        ? `Ocurrió un error ${statusCode} en el servidor`
        : 'Ocurrió un error en el cliente'}
    </p>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}
```

**Comparación:** Error Pages vs Error Boundaries - Las Error Pages manejan errores de routing y servidor (404, 500), mientras que los Error Boundaries capturan errores de renderizado de componentes React.

## Variables de Entorno
**Descripción:** Sistema para gestionar configuraciones sensibles y específicas del entorno, permitiendo diferentes valores para desarrollo, staging y producción de forma segura.

**Ejemplo:**
```javascript
// .env.local
DATABASE_URL=postgresql://localhost:5432/mydb
NEXT_PUBLIC_API_URL=https://api.example.com
SECRET_KEY=mi-clave-secreta

// pages/api/config.js
export default function handler(req, res) {
  // Solo disponible en el servidor
  const dbUrl = process.env.DATABASE_URL
  
  // Disponible en cliente y servidor
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  res.json({ 
    apiUrl, // Se puede enviar al cliente
    hasDb: !!dbUrl // No enviar la URL real
  })
}

// components/ApiClient.js
function ApiClient() {
  // Accesible en el cliente
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  return <div>API URL: {apiUrl}</div>
}
```

**Comparación:** Variables de entorno vs Hardcoding - Las variables de entorno permiten configuraciones flexibles por entorno y mayor seguridad, mientras que hardcoding valores los expone y hace inflexible el deployment.

## Headers, Redirects y Rewrites
**Descripción:** Configuraciones en next.config.js que permiten manipular headers HTTP, redireccionar URLs y reescribir rutas de manera transparente para SEO y funcionalidad avanzada.

**Ejemplo:**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'X-Custom-Header',
            value: 'my-value',
          },
        ],
      },
    ]
  },
  
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true, // 308 redirect
      },
      {
        source: '/admin',
        destination: '/login',
        permanent: false, // 307 redirect
      },
    ]
  },
  
  async rewrites() {
    return [
      {
        source: '/api/external/:path*',
        destination: 'https://external-api.com/:path*',
      },
      {
        source: '/blog/:slug',
        destination: '/posts/:slug',
      },
    ]
  },
}
```

**Comparación:** Redirects vs Rewrites - Los Redirects cambian la URL visible en el navegador y son útiles para SEO, mientras que los Rewrites mantienen la URL original pero sirven contenido diferente, útiles para proxies y routing interno.

## Pages Router vs App Router
**Descripción:** Comparación entre el sistema tradicional de enrutamiento (Pages Router) y el nuevo sistema (App Router), cada uno con sus propias convenciones y características específicas.

**Ejemplo:**
```jsx
// Pages Router Structure
pages/
├── index.js          // Route: /
├── about.js          // Route: /about
├── blog/
│   ├── index.js      // Route: /blog
│   └── [slug].js     // Route: /blog/[slug]
└── api/
    └── users.js      // API Route: /api/users

// App Router Structure  
app/
├── page.js           // Route: /
├── about/
│   └── page.js       // Route: /about
├── blog/
│   ├── page.js       // Route: /blog
│   └── [slug]/
│       └── page.js   // Route: /blog/[slug]
└── api/
    └── users/
        └── route.js  // API Route: /api/users

// Pages Router - Archivo individual
// pages/products/[id].js
export default function Product({ product }) {
  return <h1>{product.name}</h1>
}

export async function getServerSideProps({ params }) {
  const product = await fetchProduct(params.id)
  return { props: { product } }
}

// App Router - Componente en directorio
// app/products/[id]/page.js
export default async function Product({ params }) {
  const product = await fetchProduct(params.id)
  return <h1>{product.name}</h1>
}
```

**Comparación:** Pages Router vs App Router - Pages Router usa archivos individuales para rutas y funciones especiales para fetching, mientras que App Router usa estructura de directorios con archivos específicos y Server Components nativos.

## Server-Side Rendering (SSR)
**Descripción:** Renderizado del lado del servidor que genera HTML en cada solicitud, ideal para contenido dinámico que cambia frecuentemente o depende del contexto del usuario.

**Ejemplo:**
```jsx
// Pages Router - getServerSideProps
export default function UserDashboard({ user, posts }) {
  return (
    <div>
      <h1>Bienvenido, {user.name}</h1>
      <div>
        {posts.map(post => (
          <article key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { req } = context
  const userId = getUserIdFromSession(req)
  
  // Ejecuta en cada request
  const [user, posts] = await Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId)
  ])
  
  return {
    props: {
      user,
      posts
    }
  }
}

// App Router - Server Component
export default async function UserDashboard({ searchParams }) {
  const userId = await getUserIdFromSession()
  
  const [user, posts] = await Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId)
  ])
  
  return (
    <div>
      <h1>Bienvenido, {user.name}</h1>
      <div>
        {posts.map(post => (
          <article key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
```

**Comparación:** SSR vs SSG - SSR genera HTML en cada solicitud permitiendo contenido personalizado, mientras que SSG pre-genera HTML en build time para mejor rendimiento pero menor personalización.

## Incremental Static Regeneration (ISR)
**Descripción:** Combina los beneficios de SSG y SSR, permitiendo que páginas estáticas se actualicen incrementalmente después del build sin necesidad de rebuild completo.

**Ejemplo:**
```jsx
// Pages Router - ISR con revalidate
export default function BlogPost({ post, lastUpdated }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>Autor: {post.author}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <footer>
        <small>Última actualización: {lastUpdated}</small>
      </footer>
    </article>
  )
}

export async function getStaticProps({ params }) {
  const post = await fetchBlogPost(params.slug)
  
  return {
    props: {
      post,
      lastUpdated: new Date().toISOString()
    },
    // Regenerar la página cada 60 segundos si hay tráfico
    revalidate: 60
  }
}

export async function getStaticPaths() {
  // Pre-generar solo las páginas más populares
  const popularPosts = await fetchPopularPosts(10)
  
  return {
    paths: popularPosts.map(post => ({
      params: { slug: post.slug }
    })),
    // Generar otras páginas bajo demanda
    fallback: 'blocking'
  }
}

// App Router - ISR con revalidate
export const revalidate = 60 // revalidar cada 60 segundos

export default async function BlogPost({ params }) {
  const post = await fetchBlogPost(params.slug)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>Autor: {post.author}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
```

**Comparación:** ISR vs SSG tradicional - ISR permite actualizar contenido estático sin rebuild completo, mientras que SSG tradicional requiere rebuilds para actualizar contenido.

## Client-Side Rendering (CSR)
**Descripción:** Renderizado del lado del cliente donde el contenido se carga después del HTML inicial, útil para contenido que requiere interactividad inmediata o datos del usuario.

**Ejemplo:**
```jsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// Client-side data fetching
export default function UserProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  
  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          router.push('/login')
          return
        }
        
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        
        const userData = await response.json()
        setUser(userData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [router])
  
  if (loading) return <div>Cargando perfil...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return null
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Miembro desde: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  )
}

// Con SWR para mejor UX
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function UserProfileWithSWR() {
  const { data: user, error, isLoading } = useSWR('/api/user/profile', fetcher)
  
  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error al cargar</div>
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}
```

**Comparación:** CSR vs SSR - CSR carga contenido después del HTML inicial permitiendo interactividad inmediata, mientras que SSR entrega contenido completo desde el servidor pero puede ser menos interactivo inicialmente.
