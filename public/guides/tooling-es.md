# Guía de Development Tooling

## Prettier - Formateo de Código
**Descripción:** Herramienta de formateo de código automático que garantiza consistencia en estilo sin discusiones de equipo, compatible con múltiples lenguajes y editors.

**Ejemplo:**
```javascript
// Código sin formatear
const users=[{name:"Juan",age:25,email:"juan@email.com"},{name:"María",age:30,email:"maria@email.com"}];

function processUsers(users){
return users.map(user=>{
if(user.age>=18){
return{...user,isAdult:true}
}else{
return{...user,isAdult:false}
}
}).filter(user=>user.isAdult)
}

// Después de Prettier
const users = [
  { name: "Juan", age: 25, email: "juan@email.com" },
  { name: "María", age: 30, email: "maria@email.com" },
];

function processUsers(users) {
  return users
    .map((user) => {
      if (user.age >= 18) {
        return { ...user, isAdult: true };
      } else {
        return { ...user, isAdult: false };
      }
    })
    .filter((user) => user.isAdult);
}

// Configuración .prettierrc.json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}

// .prettierignore
node_modules/
dist/
build/
*.min.js
package-lock.json
yarn.lock

// Scripts en package.json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "format:staged": "prettier --write $(git diff --cached --name-only --diff-filter=ACMR | xargs)"
  }
}

// Integración con VS Code
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}

// Configuración para diferentes tipos de archivo
// .prettierrc.js
module.exports = {
  semi: true,
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  overrides: [
    {
      files: "*.json",
      options: {
        printWidth: 200,
        tabWidth: 4
      }
    },
    {
      files: "*.md",
      options: {
        printWidth: 100,
        proseWrap: "always"
      }
    }
  ]
};

// Comandos de instalación y uso
npm install --save-dev prettier
npx prettier --write src/           # Formatear carpeta
npx prettier --write "**/*.js"      # Formatear todos los JS
npx prettier --check .              # Verificar formato sin cambiar
npx prettier --write --ignore-path .gitignore .  # Usar .gitignore
```

**Comparación:** Prettier vs Manual formatting - Prettier elimina debates sobre estilo, garantiza consistencia automática y ahorra tiempo, mientras que formateo manual es propenso a inconsistencias y consume tiempo en code reviews.

## ESLint - Análisis Estático
**Descripción:** Linter que encuentra y reporta patrones problemáticos en código JavaScript/TypeScript, detecta errores, problemas de estilo y malas prácticas para mejorar calidad del código.

**Ejemplo:**
```javascript
// Código con problemas que ESLint detectaría
var userName = "juan";                    // prefer const/let
console.log(userName);                    // unused variable
if (userName = "admin") {                 // assignment instead of comparison
  // unreachable code
}

function getData() {                      // missing return
  fetch('/api/data');
}

const users = [1, 2, 3, ];              // trailing comma
const obj = {
  "name": "Juan",                        // unnecessary quotes
  'age': 25,                             // inconsistent quotes
  email: "juan@email.com"
}

// Después de ESLint + auto-fix
const userName = "juan";
console.log(userName);
if (userName === "admin") {
  // code here
}

function getData() {
  return fetch('/api/data');
}

const users = [1, 2, 3];
const obj = {
  name: "Juan",
  age: 25,
  email: "juan@email.com"
};

// Configuración .eslintrc.json
{
  "env": {
    "browser": true,
    "node": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "react",
    "import"
  ],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": "error",
    "curly": "error",
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal"],
      "newlines-between": "always"
    }]
  },
  "overrides": [
    {
      "files": ["*.test.js", "*.spec.js"],
      "rules": {
        "no-console": "off"
      }
    }
  ]
}

// .eslintignore
node_modules/
dist/
build/
*.min.js
coverage/

// Scripts en package.json
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "lint:staged": "eslint $(git diff --cached --name-only --diff-filter=ACMR | grep -E '\\.(js|ts|tsx?)$')"
  }
}

// Reglas custom para equipo
{
  "rules": {
    "no-debugger": "error",
    "no-alert": "error", 
    "prefer-arrow-callback": "error",
    "arrow-spacing": "error",
    "object-shorthand": "error",
    "prefer-template": "error",
    "template-curly-spacing": ["error", "never"],
    "padding-line-between-statements": [
      "error",
      { "blankLine": "always", "prev": "function", "next": "*" },
      { "blankLine": "always", "prev": "*", "next": "return" }
    ]
  }
}

// Integración con TypeScript
// .eslintrc.js para TypeScript
module.exports = {
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json"
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error"
  }
};

// Comandos de uso
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npx eslint --init                       # Configuración inicial
npx eslint src/                         # Lint carpeta
npx eslint src/ --fix                   # Auto-fix problemas
npx eslint src/ --format json          # Output JSON
```

**Comparación:** ESLint vs Sin linting - ESLint detecta errores temprano, mantiene consistencia de código y enseña mejores prácticas, mientras que sin linting los errores se detectan en runtime y el código es inconsistente.

## Husky - Git Hooks
**Descripción:** Herramienta que permite ejecutar scripts automáticamente en eventos Git (commits, push, etc.), asegurando calidad de código antes de que llegue al repositorio.

**Ejemplo:**
```bash
# Instalación y configuración inicial
npm install --save-dev husky
npx husky install

# Agregar script a package.json
npm pkg set scripts.prepare="husky install"

# Crear hooks comunes
npx husky add .husky/pre-commit "npm run lint"
npx husky add .husky/pre-commit "npm run format:check"
npx husky add .husky/pre-commit "npm test"
npx husky add .husky/pre-push "npm run build"

# Estructura de archivos generada
.husky/
├── _/
│   ├── .gitignore
│   └── husky.sh
├── pre-commit
├── pre-push
└── commit-msg

# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run format:check
npm run test:staged

# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run build
npm run test

# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1

# Integración con lint-staged para mejor performance
npm install --save-dev lint-staged

# package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{js,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ],
    "*.{js,ts,tsx}": [
      "jest --findRelatedTests --passWithNoTests"
    ]
  }
}

# .husky/pre-commit con lint-staged
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged

# Ejemplo completo de workflow
# 1. Desarrollador hace cambios
git add src/user.js
git add src/utils.ts

# 2. Al hacer commit, Husky ejecuta:
#    - ESLint en archivos staged
#    - Prettier en archivos staged  
#    - Tests relacionados
#    - Si todo pasa -> commit
#    - Si algo falla -> commit cancelado

git commit -m "Add user management"

# Hooks avanzados
# .husky/prepare-commit-msg - Formato automático de mensajes
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Agregar ticket number automáticamente
BRANCH_NAME=$(git branch --show-current)
TICKET=$(echo $BRANCH_NAME | grep -o -E '[A-Z]+-[0-9]+')
if [ -n "$TICKET" ]; then
  sed -i.bak -e "1s/^/[$TICKET] /" $1
fi

# .husky/post-commit - Notificaciones
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "✅ Commit successful!"
notify-send "Git" "Commit completed successfully"

# Configuración para equipos
# .husky/pre-commit para equipos grandes
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Solo ejecutar en archivos cambiados
npm run lint:staged
npm run type-check
npm run test:staged

# Si es viernes, recordar documentación
if [ "$(date +%u)" = 5 ]; then
  echo "🎉 It's Friday! Don't forget to update documentation"
fi

# Bypass hooks en emergencias (usar con cuidado)
git commit --no-verify -m "Emergency hotfix"
git push --no-verify

# Configuración de commitlint con Husky
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor', 
      'perf', 'test', 'build', 'ci', 'chore'
    ]],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-max-length': [2, 'always', 100]
  }
};

# Mensajes válidos con commitlint:
# feat: Add user authentication
# fix: Resolve memory leak in data processing
# docs: Update API documentation
# Invalid: fixed bug (no type)
```

**Comparación:** Husky vs Manual checks - Husky automatiza verificaciones de calidad y las hace obligatorias antes de commits, mientras que checks manuales son olvidables y inconsistentes entre desarrolladores.

## Integración Completa de Tooling
**Descripción:** Configuración integrada de Prettier, ESLint y Husky para crear un workflow de desarrollo automatizado que garantice calidad de código consistente en todo el equipo.

**Ejemplo:**
```json
// package.json completo con tooling integrado
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:staged": "jest --findRelatedTests --passWithNoTests",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "lint:staged": "eslint --cache --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "prepare": "husky install",
    "pre-commit": "lint-staged",
    "validate": "npm run type-check && npm run lint && npm run test"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --cache --fix",
      "prettier --write",
      "jest --findRelatedTests --passWithNoTests"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  },
  "devDependencies": {
    "@commitlint/cli": "^17.0.0",
    "@commitlint/config-conventional": "^17.0.0",
    "@typescript-eslint/eslint-plugin": "^5.30.0",
    "@typescript-eslint/parser": "^5.30.0",
    "eslint": "^8.20.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-react": "^7.30.0",
    "husky": "^8.0.1",
    "lint-staged": "^13.0.3",
    "prettier": "^2.7.1",
    "typescript": "^4.7.4"
  }
}

// .husky/pre-commit - Hook principal
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged

# Si todo está bien, mostrar resumen
if [ $? -eq 0 ]; then
  echo "✅ All checks passed!"
  echo "📝 Files formatted with Prettier"
  echo "🔍 Code linted with ESLint"  
  echo "🧪 Related tests executed"
fi

// .eslintrc.js - Configuración completa
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier' // Debe ser el último para desactivar reglas que conflicten
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    // Reglas que no conflicten con Prettier
    'prefer-const': 'error',
    'no-var': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal'],
      'newlines-between': 'always',
      'alphabetize': { 'order': 'asc' }
    }]
  }
};

// .prettierrc.js - Configuración que no conflicte con ESLint
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false
};

// VS Code settings para el equipo
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.preferences.importModuleSpecifier": "relative"
}

// GitHub Actions para CI
// .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run format:check
      - run: npm test
      - run: npm run build

// Comando de setup completo para nuevos desarrolladores
npm install
npm run prepare          # Instalar hooks de Husky
code .vscode/settings.json  # Configurar VS Code
echo "🎉 Development environment ready!"
```

**Comparación:** Tooling Integrado vs Sin herramientas - El tooling integrado automatiza calidad, previene errores y mantiene consistencia del equipo, mientras que sin herramientas el código es inconsistente y propenso a errores que llegan a producción.
