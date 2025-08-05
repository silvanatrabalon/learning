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
