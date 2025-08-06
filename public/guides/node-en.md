# Node.js Guide

## Package Management
**Description:** Package management systems that allow installing, updating, and managing dependencies in Node.js projects, including version managers and package registries.

**Example:**
```bash
# nvm - Node Version Manager
nvm install 18.17.0
nvm use 18.17.0
nvm list

# npm - Node Package Manager
npm init -y
npm install express
npm install --save-dev jest
npm run build

# pnpm - Performant npm
pnpm install express
pnpm add -D typescript
pnpm run dev

# yarn - Yet Another Resource Negotiator
yarn add express
yarn add --dev eslint
yarn install --frozen-lockfile

# Configure custom registry
npm config set registry https://my-artifactory.com/npm/
yarn config set registry https://my-artifactory.com/npm/

# Check configuration
npm config get registry
yarn config get registry
```

**Comparison:** npm vs pnpm vs yarn - npm is the default manager with wide compatibility, pnpm optimizes disk space by sharing dependencies, and yarn offers advanced workspaces and better installation performance.

## devDependencies vs dependencies
**Description:** Dependency classification by purpose: dependencies are needed in production, while devDependencies are only used during development and testing.

**Example:**
```json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "lodash": "^4.17.21",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0"
  },
  "devDependencies": {
    "jest": "^29.5.0",
    "eslint": "^8.40.0",
    "typescript": "^5.0.4",
    "nodemon": "^2.0.22",
    "@types/express": "^4.17.17",
    "prettier": "^2.8.8"
  }
}
```

```bash
# Install production dependencies
npm install express --save
# or simply
npm install express

# Install development dependencies
npm install jest --save-dev
# or
npm install jest -D

# Install only dependencies (production)
npm install --only=production
# or
npm ci --only=production
```

**Comparison:** dependencies vs devDependencies - Dependencies are included in the production bundle and are essential for the app to work, while devDependencies are excluded from production and only serve development, testing, and build purposes.

## Compilers and Build Tools
**Description:** Tools that transform source code into executable code, from modern JavaScript transpilation to bundling and optimization for production.

**Example:**
```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};

// .babelrc
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "node": "16"
      }
    }],
    "@babel/preset-typescript"
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties"
  ]
}

// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'node16',
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs']
    }
  },
  esbuild: {
    platform: 'node'
  }
})

// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Comparison:** Webpack vs Vite vs TypeScript Compiler - Webpack is comprehensive but complex, ideal for large apps; Vite is fast and modern for development; TypeScript Compiler focuses only on type transpilation.

## JWT (JSON Web Tokens)
**Description:** Standard for securely transmitting information between parties as compact, self-contained tokens, commonly used for authentication and authorization.

**Example:**
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Create JWT
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { 
      expiresIn: '24h',
      issuer: 'my-app',
      audience: 'my-app-users'
    }
  );
}

// Verify JWT
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }
  
  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
}

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await findUserByEmail(email);
    if (!user || !await bcrypt.compare(password, user.hashedPassword)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected route
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
```

**Comparison:** JWT vs Session Cookies - JWT is stateless and scalable across services, while sessions require server-side storage but are easier to invalidate and manage.

## Event Loop and Asynchrony
**Description:** The Event Loop is Node.js's central mechanism that enables non-blocking operations, efficiently handling callbacks, promises, and async/await in a single thread.

**Example:**
```javascript
// Event Loop phases and setTimeout vs setImmediate
console.log('Start');

setTimeout(() => console.log('setTimeout 1'), 0);
setImmediate(() => console.log('setImmediate 1'));

process.nextTick(() => console.log('nextTick 1'));
Promise.resolve().then(() => console.log('Promise 1'));

setTimeout(() => console.log('setTimeout 2'), 0);
setImmediate(() => console.log('setImmediate 2'));

process.nextTick(() => console.log('nextTick 2'));
Promise.resolve().then(() => console.log('Promise 2'));

console.log('End');

// Output order:
// Start
// End
// nextTick 1
// nextTick 2
// Promise 1
// Promise 2
// setTimeout 1
// setTimeout 2
// setImmediate 1
// setImmediate 2

// Callbacks vs Promises vs Async/Await
// Callback Hell
fs.readFile('file1.txt', (err, data1) => {
  if (err) throw err;
  fs.readFile('file2.txt', (err, data2) => {
    if (err) throw err;
    fs.readFile('file3.txt', (err, data3) => {
      if (err) throw err;
      console.log('All files read');
    });
  });
});

// Promises
const readFile = promisify(fs.readFile);

readFile('file1.txt')
  .then(data1 => readFile('file2.txt'))
  .then(data2 => readFile('file3.txt'))
  .then(data3 => console.log('All files read'))
  .catch(err => console.error(err));

// Async/Await
async function readAllFiles() {
  try {
    const data1 = await readFile('file1.txt');
    const data2 = await readFile('file2.txt');
    const data3 = await readFile('file3.txt');
    console.log('All files read');
  } catch (error) {
    console.error(error);
  }
}
```

**Comparison:** Callbacks vs Promises vs Async/Await - Callbacks can create "callback hell", Promises improve readability with chaining, and async/await provides synchronous syntax for asynchronous code.

## Streams and Buffers
**Description:** Streams allow processing data in chunks without loading everything into memory, while Buffers handle binary data efficiently for I/O operations.

**Example:**
```javascript
const fs = require('fs');
const { Transform, pipeline } = require('stream');

// Readable Stream
const readableStream = fs.createReadStream('large-file.txt', {
  encoding: 'utf8',
  highWaterMark: 16 * 1024 // 16KB chunks
});

// Transform Stream
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  }
});

// Writable Stream
const writableStream = fs.createWriteStream('output.txt');

// Pipeline for automatic error handling
pipeline(
  readableStream,
  upperCaseTransform,
  writableStream,
  (err) => {
    if (err) {
      console.error('Pipeline failed:', err);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);

// Buffer operations
const buffer1 = Buffer.from('Hello', 'utf8');
const buffer2 = Buffer.from(' World', 'utf8');
const combined = Buffer.concat([buffer1, buffer2]);

console.log(combined.toString()); // "Hello World"
console.log(buffer1.length); // 5 bytes
console.log(buffer1[0]); // 72 (ASCII code for 'H')

// Working with binary data
const binaryBuffer = Buffer.alloc(4);
binaryBuffer.writeUInt32BE(0x12345678, 0);
console.log(binaryBuffer); // <Buffer 12 34 56 78>

// Stream events
readableStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes`);
});

readableStream.on('end', () => {
  console.log('No more data');
});

readableStream.on('error', (err) => {
  console.error('Stream error:', err);
});
```

**Comparison:** Streams vs Loading into memory - Streams process data incrementally using less memory, while loading everything into memory is simpler but can cause issues with large files.

## Modules and require vs import
**Description:** Node.js supports both CommonJS (require/module.exports) and ES Modules (import/export), each with their own loading and resolution characteristics.

**Example:**
```javascript
// CommonJS (require/module.exports)
// math.js
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// Multiple ways to export
module.exports = { add, multiply };
// or
exports.add = add;
exports.multiply = multiply;
// or
module.exports.add = add;
module.exports.multiply = multiply;

// app.js
const { add, multiply } = require('./math');
const math = require('./math');
const fs = require('fs'); // Built-in module
const express = require('express'); // npm module

console.log(add(2, 3)); // 5
console.log(math.multiply(2, 3)); // 6

// ES Modules (import/export) - requires "type": "module" in package.json
// math.mjs or math.js with "type": "module"
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// Default export
export default function subtract(a, b) {
  return a - b;
}

// app.mjs
import subtract, { add, multiply } from './math.js';
import fs from 'fs';
import express from 'express';

console.log(add(2, 3)); // 5
console.log(subtract(5, 2)); // 3

// Dynamic imports (works in both CommonJS and ES Modules)
async function loadModule() {
  const { add } = await import('./math.js');
  console.log(add(1, 2));
}

// Module resolution
console.log(require.resolve('./math')); // Absolute path
console.log(__dirname); // Current directory (CommonJS only)
console.log(__filename); // Current file (CommonJS only)

// ES Modules equivalent:
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

**Comparison:** CommonJS vs ES Modules - CommonJS loads modules synchronously and is Node.js's traditional standard, while ES Modules support asynchronous loading and are JavaScript's modern standard.

## Process Management and Clusters
**Description:** Node.js can handle multiple processes to leverage multi-core systems and improve application availability and performance.

**Example:**
```javascript
// cluster.js - Leveraging multiple CPUs
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // Handle worker deaths
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Starting a new worker...');
    cluster.fork();
  });
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Master received SIGTERM, shutting down gracefully');
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
  });
  
} else {
  // Worker process
  const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Response from worker ${process.pid}\n`);
  });
  
  server.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}

// child_process.js - Running external processes
const { spawn, exec, execSync, fork } = require('child_process');

// spawn - for commands with large output
const ls = spawn('ls', ['-la']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

// exec - for simple commands
exec('ls -la', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

// fork - for Node.js processes
const child = fork('./worker.js');
child.send({ message: 'Hello from parent' });
child.on('message', (msg) => {
  console.log('Received from child:', msg);
});

// Process signals
process.on('SIGINT', () => {
  console.log('Received SIGINT, graceful shutdown');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
```

**Comparison:** Single Process vs Cluster vs Child Processes - Single process is simple but limited to one CPU core, Cluster scales automatically for HTTP requests, and Child Processes allow running separate tasks or system commands.

## Advanced Package Management
**Description:** Advanced package management with npm, including semantic versioning, differences between ^ and ~, and strategies for updating dependencies based on change type (major/minor/patch).

**Example:**
```json
// package.json - Semantic versioning
{
  "name": "my-project",
  "version": "1.2.3",
  "dependencies": {
    "express": "^4.18.0",        // ^ allows minor and patch updates
    "lodash": "~4.17.21",        // ~ allows only patch updates
    "react": "18.2.0",           // exact version (not recommended)
    "typescript": ">=4.5.0",     // minimum version
    "jest": "~28.1.0"            // only patches within 28.1.x
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "@types/node": "^18.0.0",
    "eslint": "~8.22.0"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  }
}

// Differences between ^ and ~
// Version: 4.18.2

// ^ (caret) - allows compatible changes
"express": "^4.18.0"
// Allows: 4.18.1, 4.19.0, 4.25.3
// NOT allows: 5.0.0 (breaking change)

// ~ (tilde) - allows only patches
"express": "~4.18.0"  
// Allows: 4.18.1, 4.18.9
// NOT allows: 4.19.0, 5.0.0

// When to use each strategy:
// ^ for most dependencies (balance security/features)
// ~ for critical dependencies (maximum stability)
// exact for very specific cases (not recommended)

// Package management commands
npm install express@^4.18.0     // Install with caret
npm install lodash@~4.17.21     // Install with tilde
npm install react@18.2.0        // Exact version

// View available versions
npm view express versions --json
npm outdated                     // View outdated packages
npm audit                       // Check vulnerabilities
npm audit fix                   // Fix vulnerabilities automatically

// Dependency updates
npm update                      // Update according to semver in package.json
npm update express              // Update specific package
npx npm-check-updates          // View all available updates
npx npm-check-updates -u       // Update package.json to latest versions

// When to update major/minor/patch
// PATCH (1.0.0 -> 1.0.1): Bug fixes, security
npm update                      // Safe automatic

// MINOR (1.0.0 -> 1.1.0): New compatible features
npm update                      // Safe with ^
npm install package@^1.1.0     // Explicit

// MAJOR (1.0.0 -> 2.0.0): Breaking changes
// Requires manual analysis and testing
npm install package@^2.0.0     // Only after testing
npm install package@latest     // Latest available version

// Update strategies
// 1. Active development - use ^ for most
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^6.5.0",
    "lodash": "^4.17.21"
  }
}

// 2. Stable production - use ~ for critical
{
  "dependencies": {
    "express": "~4.18.0",      // Only patches
    "database-driver": "~2.1.0", // Critical
    "utility-lib": "^1.5.0"    // Not critical
  }
}

// 3. Microservices - exact versions for consistency
{
  "dependencies": {
    "shared-types": "1.2.3",   // Exact for consistency
    "internal-lib": "2.1.0"    // Exact
  }
}

// Lock files for reproducibility
// package-lock.json (npm) - exact installed versions
// yarn.lock (Yarn) - exact installed versions

// Lock file commands
npm ci                         // Install from package-lock.json (CI/CD)
npm install --frozen-lockfile  // Don't modify package-lock.json
rm -rf node_modules package-lock.json && npm install  // Regenerate lock

// Monorepos and workspaces
// Root package.json
{
  "workspaces": [
    "packages/*",
    "apps/*"
  ]
}

// Dependency management in workspaces
npm install express -w packages/api    // Install in specific workspace
npm run test --workspaces             // Run in all workspaces
npm run build -w packages/shared     // Run in specific workspace
```

**Comparison:** ^ vs ~ vs Exact - Caret (^) allows compatible updates (recommended for development), Tilde (~) only patches (better for critical production), and exact version prevents any change (specific cases only).
