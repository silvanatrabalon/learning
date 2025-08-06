# Guía de Node.js

## Package Management
**Descripción:** Sistemas de gestión de paquetes que permiten instalar, actualizar y administrar dependencias en proyectos Node.js, incluyendo gestores de versiones y registros de paquetes.

**Ejemplo:**
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

# Configurar registry personalizado
npm config set registry https://my-artifactory.com/npm/
yarn config set registry https://my-artifactory.com/npm/

# Verificar configuración
npm config get registry
yarn config get registry
```

**Comparación:** npm vs pnpm vs yarn - npm es el gestor por defecto con amplia compatibilidad, pnpm optimiza espacio en disco compartiendo dependencias, y yarn ofrece workspaces avanzados y mejor performance en instalaciones.

## devDependencies vs dependencies
**Descripción:** Clasificación de dependencias según su propósito: dependencies son necesarias en producción, mientras que devDependencies solo se usan durante desarrollo y testing.

**Ejemplo:**
```json
{
  "name": "mi-app",
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
# Instalar dependencias de producción
npm install express --save
# o simplemente
npm install express

# Instalar dependencias de desarrollo
npm install jest --save-dev
# o
npm install jest -D

# Solo instalar dependencies (producción)
npm install --only=production
# o
npm ci --only=production
```

**Comparación:** dependencies vs devDependencies - Las dependencies se incluyen en el bundle de producción y son esenciales para que la app funcione, mientras que devDependencies se excluyen de producción y solo sirven para desarrollo, testing y build.

## Compiladores y Herramientas de Build
**Descripción:** Herramientas que transforman código fuente en código ejecutable, desde transpilación de JavaScript moderno hasta bundling y optimización para producción.

**Ejemplo:**
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

**Comparación:** Webpack vs Vite vs TypeScript Compiler - Webpack es completo pero complejo, ideal para apps grandes; Vite es rápido y moderno para desarrollo; TypeScript Compiler se enfoca solo en transpilación de tipos.

## JWT (JSON Web Tokens)
**Descripción:** Estándar para transmitir información de forma segura entre partes como tokens compactos y autofirmados, comúnmente usados para autenticación y autorización.

**Ejemplo:**
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Crear JWT
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
      issuer: 'mi-app',
      audience: 'mi-app-users'
    }
  );
}

// Verificar JWT
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    throw error;
  }
}

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
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
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Ruta protegida
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
```

**Comparación:** JWT vs Session Cookies - JWT es stateless y escalable entre servicios, mientras que las sessions requieren almacenamiento del lado del servidor pero son más fáciles de invalidar y gestionar.

## Event Loop y Asíncronia
**Descripción:** El Event Loop es el mecanismo central de Node.js que permite operaciones no bloqueantes, manejando callbacks, promises y async/await de manera eficiente en un solo hilo.

**Ejemplo:**
```javascript
// Event Loop phases y setTimeout vs setImmediate
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

**Comparación:** Callbacks vs Promises vs Async/Await - Los callbacks pueden crear "callback hell", las Promises mejoran la legibilidad con chaining, y async/await proporciona sintaxis síncrona para código asíncrono.

## Streams y Buffers
**Descripción:** Los Streams permiten procesar datos en chunks sin cargar todo en memoria, mientras que los Buffers manejan datos binarios de manera eficiente para operaciones I/O.

**Ejemplo:**
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

// Pipeline para manejo automático de errores
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

**Comparación:** Streams vs Cargar en memoria - Los Streams procesan datos incrementalmente usando menos memoria, mientras que cargar todo en memoria es más simple pero puede causar problemas con archivos grandes.

## Módulos y require vs import
**Descripción:** Node.js soporta tanto CommonJS (require/module.exports) como ES Modules (import/export), cada uno con sus propias características de carga y resolución.

**Ejemplo:**
```javascript
// CommonJS (require/module.exports)
// math.js
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// Múltiples formas de exportar
module.exports = { add, multiply };
// o
exports.add = add;
exports.multiply = multiply;
// o
module.exports.add = add;
module.exports.multiply = multiply;

// app.js
const { add, multiply } = require('./math');
const math = require('./math');
const fs = require('fs'); // Built-in module
const express = require('express'); // npm module

console.log(add(2, 3)); // 5
console.log(math.multiply(2, 3)); // 6

// ES Modules (import/export) - requiere "type": "module" en package.json
// math.mjs o math.js con "type": "module"
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

// Dynamic imports (funciona en CommonJS y ES Modules)
async function loadModule() {
  const { add } = await import('./math.js');
  console.log(add(1, 2));
}

// Module resolution
console.log(require.resolve('./math')); // Absolute path
console.log(__dirname); // Current directory (solo CommonJS)
console.log(__filename); // Current file (solo CommonJS)

// En ES Modules equivalente:
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

**Comparación:** CommonJS vs ES Modules - CommonJS carga módulos síncronamente y es el estándar tradicional de Node.js, mientras que ES Modules soporta carga asíncrona y es el estándar moderno de JavaScript.

## Gestión de Procesos y Clusters
**Descripción:** Node.js puede manejar múltiples procesos para aprovechar sistemas multi-core y mejorar la disponibilidad y rendimiento de aplicaciones.

**Ejemplo:**
```javascript
// cluster.js - Aprovechando múltiples CPUs
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // Manejar worker deaths
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

// child_process.js - Ejecutar procesos externos
const { spawn, exec, execSync, fork } = require('child_process');

// spawn - para comandos con output grande
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

// exec - para comandos simples
exec('ls -la', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

// fork - para procesos Node.js
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

**Comparación:** Single Process vs Cluster vs Child Processes - Single process es simple pero limitado a un CPU core, Cluster escala automáticamente para requests HTTP, y Child Processes permiten ejecutar tareas separadas o comandos del sistema.

## Package Management Avanzado
**Descripción:** Gestión avanzada de paquetes con npm, incluyendo versionado semántico, diferencias entre ^ y ~, y estrategias para actualización de dependencias según el tipo de cambio (major/minor/patch).

**Ejemplo:**
```json
// package.json - Versionado semántico
{
  "name": "mi-proyecto",
  "version": "1.2.3",
  "dependencies": {
    "express": "^4.18.0",        // ^ permite minor y patch updates
    "lodash": "~4.17.21",        // ~ permite solo patch updates
    "react": "18.2.0",           // versión exacta (no recomendado)
    "typescript": ">=4.5.0",     // versión mínima
    "jest": "~28.1.0"            // solo patches dentro de 28.1.x
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

// Diferencias entre ^ y ~
// Versión: 4.18.2

// ^ (caret) - permite cambios compatibles
"express": "^4.18.0"
// Permite: 4.18.1, 4.19.0, 4.25.3
// NO permite: 5.0.0 (breaking change)

// ~ (tilde) - permite solo patches
"express": "~4.18.0"  
// Permite: 4.18.1, 4.18.9
// NO permite: 4.19.0, 5.0.0

// Cuándo usar cada estrategia:
// ^ para la mayoría de dependencias (balance seguridad/features)
// ~ para dependencias críticas (máxima estabilidad)
// exacta para casos muy específicos (no recomendado)

// Comandos de gestión de paquetes
npm install express@^4.18.0     // Instalar con caret
npm install lodash@~4.17.21     // Instalar con tilde
npm install react@18.2.0        // Versión exacta

// Ver versiones disponibles
npm view express versions --json
npm outdated                     // Ver paquetes desactualizados
npm audit                       // Verificar vulnerabilidades
npm audit fix                   // Arreglar vulnerabilidades automáticamente

// Actualización de dependencias
npm update                      // Actualizar según semver en package.json
npm update express              // Actualizar paquete específico
npx npm-check-updates          // Ver todas las actualizaciones disponibles
npx npm-check-updates -u       // Actualizar package.json a últimas versiones

// Cuándo actualizar major/minor/patch
// PATCH (1.0.0 -> 1.0.1): Bug fixes, seguridad
npm update                      // Safe automático

// MINOR (1.0.0 -> 1.1.0): Nuevas features compatibles
npm update                      // Safe con ^
npm install package@^1.1.0     // Explícito

// MAJOR (1.0.0 -> 2.0.0): Breaking changes
// Requiere análisis manual y testing
npm install package@^2.0.0     // Solo después de testing
npm install package@latest     // Última versión disponible

// Estrategias de actualización
// 1. Desarrollo activo - usar ^ para la mayoría
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^6.5.0",
    "lodash": "^4.17.21"
  }
}

// 2. Producción estable - usar ~ para críticos
{
  "dependencies": {
    "express": "~4.18.0",      // Solo patches
    "database-driver": "~2.1.0", // Crítico
    "utility-lib": "^1.5.0"    // No crítico
  }
}

// 3. Microservicios - versiones exactas para consistencia
{
  "dependencies": {
    "shared-types": "1.2.3",   // Exacta para consistencia
    "internal-lib": "2.1.0"    // Exacta
  }
}

// Lock files para reproducibilidad
// package-lock.json (npm) - versiones exactas instaladas
// yarn.lock (Yarn) - versiones exactas instaladas

// Comandos de lock files
npm ci                         // Instalar desde package-lock.json (CI/CD)
npm install --frozen-lockfile  // No modificar package-lock.json
rm -rf node_modules package-lock.json && npm install  // Regenerar lock

// Monorepos y workspaces
// package.json raíz
{
  "workspaces": [
    "packages/*",
    "apps/*"
  ]
}

// Gestión de dependencias en workspaces
npm install express -w packages/api    // Instalar en workspace específico
npm run test --workspaces             // Ejecutar en todos los workspaces
npm run build -w packages/shared     // Ejecutar en workspace específico
```

**Comparación:** ^ vs ~ vs Exacta - Caret (^) permite actualizaciones compatibles (recomendado para desarrollo), Tilde (~) solo patches (mejor para producción crítica), y versión exacta previene cualquier cambio (solo casos específicos).
