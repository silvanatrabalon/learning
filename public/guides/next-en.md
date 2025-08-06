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

## Client Navigation (Link and useRouter)
**Description:** Client-side navigation system that allows transitions between pages without reloading the complete page, improving user experience with automatic prefetch.

**Example:**
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
        About
      </Link>
      <Link href="/products/[id]" as="/products/123">
        Product 123
      </Link>
      <button onClick={handleNavigation}>
        Go to Dashboard
      </button>
    </nav>
  )
}
```

**Comparison:** Client Navigation vs Traditional navigation - Client navigation is faster as it doesn't reload the complete page and allows prefetch, while traditional navigation requires loading the entire page from the server.

## Image Optimization
**Description:** Next.js automatically optimizes images with resizing, lazy loading, conversion to modern formats like WebP, and responsive design to improve performance.

**Example:**
```jsx
import Image from 'next/image'

function Gallery() {
  return (
    <div>
      {/* Optimized image with lazy loading */}
      <Image
        src="/hero.jpg"
        alt="Hero image"
        width={800}
        height={400}
        priority // Load immediately for LCP
      />
      
      {/* Responsive image */}
      <Image
        src="/gallery/photo1.jpg"
        alt="Gallery photo"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}
```

**Comparison:** next/image vs traditional img - next/image provides automatic optimization, lazy loading and responsive design, while traditional img requires manual optimization and doesn't have these built-in features.

## Custom Error Pages
**Description:** Custom error pages that allow handling 404, 500, and other status codes with interfaces consistent with your application design.

**Example:**
```jsx
// pages/404.js (Pages Router)
export default function Custom404() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link href="/">Go back home</Link>
    </div>
  )
}

// app/not-found.tsx (App Router)
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}

// pages/_error.js (For 500 errors)
function Error({ statusCode }) {
  return (
    <p>
      {statusCode
        ? `A ${statusCode} error occurred on server`
        : 'An error occurred on client'}
    </p>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}
```

**Comparison:** Error Pages vs Error Boundaries - Error Pages handle routing and server errors (404, 500), while Error Boundaries capture React component rendering errors.

## Environment Variables
**Description:** System for managing sensitive and environment-specific configurations, allowing different values for development, staging, and production securely.

**Example:**
```javascript
// .env.local
DATABASE_URL=postgresql://localhost:5432/mydb
NEXT_PUBLIC_API_URL=https://api.example.com
SECRET_KEY=my-secret-key

// pages/api/config.js
export default function handler(req, res) {
  // Only available on server
  const dbUrl = process.env.DATABASE_URL
  
  // Available on client and server
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  res.json({ 
    apiUrl, // Can send to client
    hasDb: !!dbUrl // Don't send real URL
  })
}

// components/ApiClient.js
function ApiClient() {
  // Accessible on client
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  return <div>API URL: {apiUrl}</div>
}
```

**Comparison:** Environment variables vs Hardcoding - Environment variables allow flexible configurations per environment and better security, while hardcoding values exposes them and makes deployment inflexible.

## Headers, Redirects and Rewrites
**Description:** Configurations in next.config.js that allow manipulating HTTP headers, redirecting URLs, and rewriting routes transparently for SEO and advanced functionality.

**Example:**
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

**Comparison:** Redirects vs Rewrites - Redirects change the visible URL in the browser and are useful for SEO, while Rewrites maintain the original URL but serve different content, useful for proxies and internal routing.

## Pages Router vs App Router
**Description:** Comparison between the traditional routing system (Pages Router) and the new system (App Router), each with their own conventions and specific features.

**Example:**
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

// Pages Router - Individual file
// pages/products/[id].js
export default function Product({ product }) {
  return <h1>{product.name}</h1>
}

export async function getServerSideProps({ params }) {
  const product = await fetchProduct(params.id)
  return { props: { product } }
}

// App Router - Component in directory
// app/products/[id]/page.js
export default async function Product({ params }) {
  const product = await fetchProduct(params.id)
  return <h1>{product.name}</h1>
}
```

**Comparison:** Pages Router vs App Router - Pages Router uses individual files for routes and special functions for fetching, while App Router uses directory structure with specific files and native Server Components.

## Server-Side Rendering (SSR)
**Description:** Server-side rendering that generates HTML on each request, ideal for dynamic content that changes frequently or depends on user context.

**Example:**
```jsx
// Pages Router - getServerSideProps
export default function UserDashboard({ user, posts }) {
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
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
  
  // Runs on every request
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
      <h1>Welcome, {user.name}</h1>
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

**Comparison:** SSR vs SSG - SSR generates HTML on each request allowing personalized content, while SSG pre-generates HTML at build time for better performance but less personalization.

## Incremental Static Regeneration (ISR)
**Description:** Combines the benefits of SSG and SSR, allowing static pages to be updated incrementally after build without requiring a complete rebuild.

**Example:**
```jsx
// Pages Router - ISR with revalidate
export default function BlogPost({ post, lastUpdated }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>Author: {post.author}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <footer>
        <small>Last updated: {lastUpdated}</small>
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
    // Regenerate page every 60 seconds if there's traffic
    revalidate: 60
  }
}

export async function getStaticPaths() {
  // Pre-generate only the most popular pages
  const popularPosts = await fetchPopularPosts(10)
  
  return {
    paths: popularPosts.map(post => ({
      params: { slug: post.slug }
    })),
    // Generate other pages on-demand
    fallback: 'blocking'
  }
}

// App Router - ISR with revalidate
export const revalidate = 60 // revalidate every 60 seconds

export default async function BlogPost({ params }) {
  const post = await fetchBlogPost(params.slug)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>Author: {post.author}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
```

**Comparison:** ISR vs Traditional SSG - ISR allows updating static content without complete rebuild, while traditional SSG requires rebuilds to update content.

## Client-Side Rendering (CSR)
**Description:** Client-side rendering where content loads after the initial HTML, useful for content that requires immediate interactivity or user-specific data.

**Example:**
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
  
  if (loading) return <div>Loading profile...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return null
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  )
}

// With SWR for better UX
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function UserProfileWithSWR() {
  const { data: user, error, isLoading } = useSWR('/api/user/profile', fetcher)
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}
```

**Comparison:** CSR vs SSR - CSR loads content after initial HTML allowing immediate interactivity, while SSR delivers complete content from server but may be less interactive initially.
