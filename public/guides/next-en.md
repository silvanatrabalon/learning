# Next.js Guide

## App Router
**Description:** The new routing system in Next.js 13+ that uses the `app` directory structure for better organization and performance.

**Example:**
```jsx
// app/page.js
export default function HomePage() {
  return <h1>Welcome to Next.js!</h1>
}

// app/about/page.js
export default function AboutPage() {
  return <h1>About Us</h1>
}
```

**Comparison:** App Router vs Pages Router - App Router provides better performance with React Server Components and streaming, while Pages Router is the traditional file-based routing system.

## Server Components
**Description:** React components that run on the server, reducing bundle size and improving performance by fetching data server-side.

**Example:**
```jsx
// This is a Server Component by default in the app directory
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

**Comparison:** Server Components vs Client Components - Server Components run on the server and can directly access databases, while Client Components run in the browser and can use hooks and event handlers.

## Middleware
**Description:** Functions that run before a request is completed, allowing you to modify the response by rewriting, redirecting, or modifying headers.

**Example:**
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

**Comparison:** Middleware vs API Routes - Middleware runs before the request reaches your page or API route, making it ideal for authentication and redirects, while API routes handle the actual business logic.

## Static Site Generation (SSG)
**Description:** Pre-renders pages at build time, creating static HTML files that can be served by a CDN for optimal performance.

**Example:**
```jsx
// This page will be pre-rendered at build time
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
    revalidate: 60 // Regenerate page every 60 seconds
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

**Comparison:** SSG vs SSR - SSG generates pages at build time for better performance, while SSR generates pages on each request for dynamic content.

## API Routes
**Description:** Built-in API endpoints that allow you to create backend functionality within your Next.js application.

**Example:**
```javascript
// pages/api/users/[id].js or app/api/users/[id]/route.js
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

**Comparison:** API Routes vs External API - API Routes are co-located with your frontend code and share the same deployment, while external APIs require separate hosting and management.
