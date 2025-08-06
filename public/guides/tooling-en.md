# Development Tooling Guide

## Prettier - Code Formatting
**Description:** Automatic code formatting tool that ensures consistency in style without team discussions, compatible with multiple languages and editors.

**Example:**
```javascript
// Unformatted code
const users=[{name:"John",age:25,email:"john@email.com"},{name:"Mary",age:30,email:"mary@email.com"}];

function processUsers(users){
return users.map(user=>{
if(user.age>=18){
return{...user,isAdult:true}
}else{
return{...user,isAdult:false}
}
}).filter(user=>user.isAdult)
}

// After Prettier
const users = [
  { name: "John", age: 25, email: "john@email.com" },
  { name: "Mary", age: 30, email: "mary@email.com" },
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

// Configuration .prettierrc.json
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

// Scripts in package.json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "format:staged": "prettier --write $(git diff --cached --name-only --diff-filter=ACMR | xargs)"
  }
}

// VS Code integration
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

// Configuration for different file types
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

// Installation and usage commands
npm install --save-dev prettier
npx prettier --write src/           # Format folder
npx prettier --write "**/*.js"      # Format all JS files
npx prettier --check .              # Check format without changing
npx prettier --write --ignore-path .gitignore .  # Use .gitignore
```

**Comparison:** Prettier vs Manual formatting - Prettier eliminates style debates, guarantees automatic consistency and saves time, while manual formatting is prone to inconsistencies and consumes time in code reviews.

## ESLint - Static Analysis
**Description:** Linter that finds and reports problematic patterns in JavaScript/TypeScript code, detects errors, style issues and bad practices to improve code quality.

**Example:**
```javascript
// Code with issues that ESLint would detect
var userName = "john";                    // prefer const/let
console.log(userName);                    // unused variable
if (userName = "admin") {                 // assignment instead of comparison
  // unreachable code
}

function getData() {                      // missing return
  fetch('/api/data');
}

const users = [1, 2, 3, ];              // trailing comma
const obj = {
  "name": "John",                        // unnecessary quotes
  'age': 25,                             // inconsistent quotes
  email: "john@email.com"
}

// After ESLint + auto-fix
const userName = "john";
console.log(userName);
if (userName === "admin") {
  // code here
}

function getData() {
  return fetch('/api/data');
}

const users = [1, 2, 3];
const obj = {
  name: "John",
  age: 25,
  email: "john@email.com"
};

// Configuration .eslintrc.json
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

// Scripts in package.json
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "lint:staged": "eslint $(git diff --cached --name-only --diff-filter=ACMR | grep -E '\\.(js|ts|tsx?)$')"
  }
}

// Custom rules for team
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

// TypeScript integration
// .eslintrc.js for TypeScript
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

// Usage commands
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npx eslint --init                       # Initial configuration
npx eslint src/                         # Lint folder
npx eslint src/ --fix                   # Auto-fix issues
npx eslint src/ --format json          # JSON output
```

**Comparison:** ESLint vs No linting - ESLint detects errors early, maintains code consistency and teaches best practices, while without linting errors are detected at runtime and code is inconsistent.

## Husky - Git Hooks
**Description:** Tool that allows running scripts automatically on Git events (commits, push, etc.), ensuring code quality before it reaches the repository.

**Example:**
```bash
# Installation and initial setup
npm install --save-dev husky
npx husky install

# Add script to package.json
npm pkg set scripts.prepare="husky install"

# Create common hooks
npx husky add .husky/pre-commit "npm run lint"
npx husky add .husky/pre-commit "npm run format:check"
npx husky add .husky/pre-commit "npm test"
npx husky add .husky/pre-push "npm run build"

# Generated file structure
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

# Integration with lint-staged for better performance
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

# .husky/pre-commit with lint-staged
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged

# Complete workflow example
# 1. Developer makes changes
git add src/user.js
git add src/utils.ts

# 2. On commit, Husky runs:
#    - ESLint on staged files
#    - Prettier on staged files  
#    - Related tests
#    - If all pass -> commit
#    - If anything fails -> commit cancelled

git commit -m "Add user management"

# Advanced hooks
# .husky/prepare-commit-msg - Automatic message formatting
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Add ticket number automatically
BRANCH_NAME=$(git branch --show-current)
TICKET=$(echo $BRANCH_NAME | grep -o -E '[A-Z]+-[0-9]+')
if [ -n "$TICKET" ]; then
  sed -i.bak -e "1s/^/[$TICKET] /" $1
fi

# .husky/post-commit - Notifications
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "✅ Commit successful!"
notify-send "Git" "Commit completed successfully"

# Team configuration
# .husky/pre-commit for large teams
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Only run on changed files
npm run lint:staged
npm run type-check
npm run test:staged

# If it's Friday, remind about documentation
if [ "$(date +%u)" = 5 ]; then
  echo "🎉 It's Friday! Don't forget to update documentation"
fi

# Bypass hooks in emergencies (use carefully)
git commit --no-verify -m "Emergency hotfix"
git push --no-verify

# Commitlint configuration with Husky
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

# Valid messages with commitlint:
# feat: Add user authentication
# fix: Resolve memory leak in data processing
# docs: Update API documentation
# Invalid: fixed bug (no type)
```

**Comparison:** Husky vs Manual checks - Husky automates quality checks and makes them mandatory before commits, while manual checks are forgettable and inconsistent among developers.

## Complete Tooling Integration
**Description:** Integrated configuration of Prettier, ESLint and Husky to create an automated development workflow that ensures consistent code quality across the team.

**Example:**
```json
// Complete package.json with integrated tooling
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

// .husky/pre-commit - Main hook
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged

# If everything is fine, show summary
if [ $? -eq 0 ]; then
  echo "✅ All checks passed!"
  echo "📝 Files formatted with Prettier"
  echo "🔍 Code linted with ESLint"  
  echo "🧪 Related tests executed"
fi

// .eslintrc.js - Complete configuration
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier' // Must be last to disable conflicting rules
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    // Rules that don't conflict with Prettier
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

// .prettierrc.js - Configuration that doesn't conflict with ESLint
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false
};

// VS Code settings for team
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

// GitHub Actions for CI
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

// Complete setup command for new developers
npm install
npm run prepare          # Install Husky hooks
code .vscode/settings.json  # Configure VS Code
echo "🎉 Development environment ready!"
```

**Comparison:** Integrated Tooling vs No tools - Integrated tooling automates quality, prevents errors and maintains team consistency, while without tools code is inconsistent and prone to errors that reach production.
