# Guía de Git

## Git vs GitHub
**Descripción:** Diferencias fundamentales entre Git (sistema de control de versiones distribuido) y GitHub (plataforma de hosting para repositorios Git), incluyendo sus funcionalidades y casos de uso específicos.

**Ejemplo:**
```bash
# Git - Sistema de control de versiones local/distribuido
git init                    # Inicializar repositorio local
git add .                  # Agregar archivos al staging area
git commit -m "mensaje"    # Crear commit local
git log                    # Ver historial local

# Git comandos básicos
git status                 # Ver estado del repositorio
git diff                   # Ver diferencias
git branch                 # Listar ramas
git checkout -b nueva-rama # Crear y cambiar a nueva rama
git merge feature-branch   # Fusionar rama

# GitHub - Plataforma de hosting remota
git remote add origin https://github.com/usuario/repo.git
git push origin main       # Subir commits al repositorio remoto
git clone https://github.com/usuario/repo.git  # Clonar repo remoto

# Funcionalidades exclusivas de GitHub
# - Pull Requests / Merge Requests
# - Issues y Project Management
# - GitHub Actions (CI/CD)
# - GitHub Pages
# - Wikis y Documentación
# - Security features (Dependabot, Code scanning)
# - Colaboración social (followers, stars, forks)

# Ejemplo de workflow Git + GitHub
git checkout -b feature/nueva-funcionalidad
echo "nueva funcionalidad" > feature.txt
git add feature.txt
git commit -m "Add: nueva funcionalidad"
git push origin feature/nueva-funcionalidad
# En GitHub: crear Pull Request, code review, merge

# Git es independiente de GitHub
git init
git add README.md
git commit -m "Initial commit"
# Esto funciona sin GitHub

# Alternativas a GitHub que usan Git
git remote add gitlab https://gitlab.com/usuario/repo.git
git remote add bitbucket https://bitbucket.org/usuario/repo.git
```

**Comparación:** Git vs GitHub - Git es la herramienta de control de versiones que funciona localmente y de forma distribuida, mientras que GitHub es una plataforma que hostea repositorios Git y añade funcionalidades colaborativas como PR, issues y CI/CD.

## Fetch vs Pull
**Descripción:** Diferencias entre `git fetch` (descargar referencias remotas sin fusionar) y `git pull` (descargar y fusionar automáticamente), incluyendo cuándo usar cada uno para mantener un historial limpio.

**Ejemplo:**
```bash
# git fetch - Descarga cambios sin fusionar
git fetch origin           # Descargar todas las ramas remotas
git fetch origin main      # Descargar solo rama main remota
git fetch --all           # Descargar de todos los remotes

# Después de fetch, revisar cambios antes de fusionar
git log HEAD..origin/main  # Ver commits nuevos en remoto
git diff HEAD origin/main  # Ver diferencias
git checkout origin/main   # Ver estado remoto (detached HEAD)

# Fusionar manualmente después de revisar
git merge origin/main      # Merge explícito
git rebase origin/main     # Rebase explícito

# git pull - Descarga y fusiona automáticamente
git pull origin main       # Equivale a: fetch + merge
git pull --rebase origin main  # Equivale a: fetch + rebase

# Configurar comportamiento por defecto
git config pull.rebase true    # Usar rebase por defecto
git config pull.ff only        # Solo fast-forward

# Workflow seguro con fetch
git fetch origin
git status                 # Verificar estado local
git log --oneline --graph --all  # Ver historial completo
git merge origin/main      # Fusionar cuando estés listo

# Ejemplo práctico: trabajo en equipo
# Desarrollador A hace cambios
git checkout -b feature/login
echo "login feature" > login.js
git add login.js
git commit -m "Add login feature"
git push origin feature/login

# Desarrollador B quiere ver los cambios sin afectar su trabajo
git fetch origin
git log origin/feature/login  # Ver commits de la feature
git diff origin/feature/login # Ver cambios específicos
git checkout origin/feature/login  # Revisar código

# Cuando esté listo para integrar
git checkout main
git pull origin main       # o fetch + merge

# Situación de conflicto con pull vs fetch
# Con pull (automático, puede generar merge commit inesperado)
git pull origin main       # Auto-merge, posibles conflictos

# Con fetch (control total)
git fetch origin
git log HEAD..origin/main  # Ver qué cambios vienen
git merge origin/main      # Decisión consciente de fusionar
```

**Comparación:** Fetch vs Pull - Fetch descarga cambios permitiendo revisión antes de fusionar (más control), mientras que Pull fusiona automáticamente (más rápido pero menos control sobre el historial).

## Rebase y Cherry-pick
**Descripción:** Técnicas avanzadas para reescribir historial: rebase (reorganizar commits linealmente) y cherry-pick (aplicar commits específicos), incluyendo cuándo usar cada técnica y mejores prácticas.

**Ejemplo:**
```bash
# REBASE - Reorganizar commits linealmente

# Rebase interactivo para limpiar historial
git log --oneline -5       # Ver últimos 5 commits
git rebase -i HEAD~3       # Rebase interactivo últimos 3 commits

# Opciones en rebase interactivo:
# pick   - usar commit tal como está
# reword - usar commit pero editar mensaje
# edit   - usar commit pero pausar para editar
# squash - fusionar con commit anterior
# fixup  - como squash pero descartar mensaje
# drop   - eliminar commit

# Ejemplo de limpieza de commits
# Antes:
# abc123 Fix typo
# def456 Add feature
# ghi789 Fix bug in feature
# jkl012 Another typo fix

# Rebase interactivo:
git rebase -i HEAD~4
# pick def456 Add feature
# squash ghi789 Fix bug in feature  
# squash abc123 Fix typo
# squash jkl012 Another typo fix

# Resultado:
# def456 Add feature (con todos los fixes incluidos)

# Rebase de rama feature sobre main actualizado
git checkout feature-branch
git rebase main            # Aplicar commits de feature sobre main actual

# Si hay conflictos durante rebase
git status                 # Ver conflictos
# Resolver conflictos en archivos
git add archivo-resuelto.js
git rebase --continue      # Continuar rebase
# git rebase --abort       # Cancelar si algo sale mal

# CHERRY-PICK - Aplicar commits específicos

# Cherry-pick un commit específico
git log --oneline feature-branch  # Ver commits disponibles
git cherry-pick abc1234    # Aplicar commit abc1234 a rama actual

# Cherry-pick múltiples commits
git cherry-pick abc1234 def5678 ghi9012

# Cherry-pick rango de commits
git cherry-pick abc1234..def5678  # Desde abc1234 hasta def5678

# Cherry-pick con edición
git cherry-pick -e abc1234  # Editar mensaje del commit
git cherry-pick -x abc1234  # Agregar referencia al commit original

# Caso práctico: hotfix en producción
git checkout production
git log --oneline development  # Ver commits en development
git cherry-pick def5678    # Aplicar solo el fix crítico

# Cherry-pick con conflictos
git cherry-pick abc1234
# Resolver conflictos
git add archivo-resuelto.js
git cherry-pick --continue

# Ejemplo completo: preparar release
git checkout -b release/v2.0
git cherry-pick feature1-commit  # Incluir feature 1
git cherry-pick feature2-commit  # Incluir feature 2
# No incluir feature3-commit (no está listo)

# Rebase vs Cherry-pick
# Rebase: reorganizar historial completo de una rama
git checkout feature
git rebase main

# Cherry-pick: seleccionar commits específicos
git checkout main  
git cherry-pick feature-commit1 feature-commit3  # Solo algunos commits
```

**Comparación:** Rebase vs Cherry-pick - Rebase reorganiza historial completo de una rama para mantener linealidad, mientras que Cherry-pick aplica commits específicos selectivamente, útil para hotfixes o releases selectivos.

## Stash y Git Flow
**Descripción:** Gestión temporal de cambios con stash y metodología Git Flow para organizar desarrollo con ramas feature, develop, release y hotfix, incluyendo comandos y mejores prácticas.

**Ejemplo:**
```bash
# GIT STASH - Guardar trabajo temporal

# Guardar cambios actuales temporalmente
git stash                   # Guardar cambios en stash
git stash save "mensaje"    # Guardar con mensaje descriptivo
git stash -u               # Incluir archivos untracked
git stash -a               # Incluir archivos ignored también

# Ver stash guardados
git stash list             # Lista todos los stash
# stash@{0}: WIP on main: abc1234 Last commit
# stash@{1}: On feature: def5678 Working on login

# Aplicar stash
git stash pop              # Aplicar último stash y eliminarlo
git stash apply            # Aplicar último stash pero mantenerlo
git stash apply stash@{1}  # Aplicar stash específico

# Gestión de stash
git stash show             # Ver resumen de cambios en stash
git stash show -p          # Ver diff completo del stash
git stash drop stash@{1}   # Eliminar stash específico
git stash clear            # Eliminar todos los stash

# Caso práctico: cambio urgente
echo "working on feature" > feature.js
git add feature.js
# Llega bug urgente
git stash save "WIP: feature development"
git checkout main
git checkout -b hotfix/critical-bug
# Fix the bug...
git add bug-fix.js
git commit -m "Fix: critical bug"
git checkout feature-branch
git stash pop              # Continuar con feature

# GIT FLOW - Metodología de branching

# Inicializar git flow
git flow init
# Configurar ramas:
# - main (producción)
# - develop (desarrollo)
# - feature/* (nuevas funcionalidades)
# - release/* (preparar releases)
# - hotfix/* (fixes de producción)

# Feature workflow
git flow feature start login-system
# Crear rama: feature/login-system desde develop
echo "login code" > login.js
git add login.js
git commit -m "Add login functionality"
git flow feature finish login-system
# Fusiona a develop y elimina feature branch

# Release workflow  
git flow release start v1.2.0
# Crear rama: release/v1.2.0 desde develop
# Preparar release (version bumps, changelog)
echo "1.2.0" > VERSION
git add VERSION
git commit -m "Bump version to 1.2.0"
git flow release finish v1.2.0
# Fusiona a main y develop, crea tag v1.2.0

# Hotfix workflow
git flow hotfix start v1.2.1
# Crear rama: hotfix/v1.2.1 desde main
echo "security fix" > security.js
git add security.js
git commit -m "Security fix"
git flow hotfix finish v1.2.1
# Fusiona a main y develop, crea tag v1.2.1

# Git Flow manual (sin extensión)
# Feature branch
git checkout develop
git checkout -b feature/nueva-funcionalidad
# Desarrollar...
git checkout develop
git merge --no-ff feature/nueva-funcionalidad
git branch -d feature/nueva-funcionalidad

# Release branch
git checkout develop
git checkout -b release/v1.3.0
# Preparar release...
git checkout main
git merge --no-ff release/v1.3.0
git tag v1.3.0
git checkout develop
git merge --no-ff release/v1.3.0
git branch -d release/v1.3.0

# Ejemplo completo de workflow
git stash save "WIP: current work"
git flow hotfix start security-patch
echo "security update" > security.patch
git add security.patch
git commit -m "Critical security patch"
git flow hotfix finish security-patch
git stash pop
```

**Comparación:** Stash vs Commit - Stash guarda cambios temporalmente sin crear commits permanentes, mientras que Git Flow estructura el desarrollo con ramas específicas para features, releases y hotfixes, manteniendo historial organizado.

## Tags, Releases y Submodules
**Descripción:** Gestión de versiones con tags de Git vs releases de GitHub, y manejo de submodules para incluir repositorios externos, incluyendo configuración y sincronización.

**Ejemplo:**
```bash
# GIT TAGS vs GITHUB RELEASES

# Git Tags - Marcadores de commits específicos
git tag                    # Listar tags existentes
git tag v1.0.0            # Crear tag ligero
git tag -a v1.0.0 -m "Release version 1.0.0"  # Tag anotado
git tag -a v1.0.0 abc1234 -m "Tag commit específico"

# Ver información de tags
git show v1.0.0           # Ver información del tag
git log --oneline --decorate  # Ver tags en log

# Tags remotos
git push origin v1.0.0    # Subir tag específico
git push origin --tags    # Subir todos los tags
git fetch --tags          # Descargar tags remotos

# Gestión de tags
git tag -d v1.0.0         # Eliminar tag local
git push origin :refs/tags/v1.0.0  # Eliminar tag remoto

# GitHub Releases - Interfaz web + assets
# 1. Crear tag primero
git tag -a v2.0.0 -m "Major release v2.0.0"
git push origin v2.0.0

# 2. En GitHub web interface:
# - Ir a Releases
# - "Create a new release"
# - Seleccionar tag v2.0.0
# - Agregar release notes
# - Subir archivos binarios/assets
# - Marcar como pre-release si es beta

# Automatizar releases con GitHub CLI
gh release create v2.0.0 \
  --title "Version 2.0.0" \
  --notes "Release notes here" \
  ./dist/app.zip \
  ./dist/app.tar.gz

# SUBMODULES - Repositorios anidados

# Agregar submodule
git submodule add https://github.com/usuario/libreria.git lib/libreria
git commit -m "Add libreria submodule"

# Clonar repositorio con submodules
git clone --recurse-submodules https://github.com/usuario/proyecto.git
# o después de clonar:
git submodule init
git submodule update

# Actualizar submodules
cd lib/libreria
git pull origin main
cd ../..
git add lib/libreria
git commit -m "Update libreria submodule"

# Actualizar todos los submodules
git submodule update --remote --merge

# Ver estado de submodules
git submodule status
git submodule foreach git status

# Eliminar submodule
git submodule deinit lib/libreria
git rm lib/libreria
rm -rf .git/modules/lib/libreria
git commit -m "Remove libreria submodule"

# Ejemplo práctico: proyecto con dependencias
# Estructura:
# proyecto/
# ├── src/
# ├── lib/
# │   ├── ui-components/     (submodule)
# │   └── utils/            (submodule)
# └── package.json

git submodule add https://github.com/company/ui-components.git lib/ui-components
git submodule add https://github.com/company/utils.git lib/utils

# En CI/CD pipeline
git clone --recurse-submodules $REPO_URL
git submodule update --init --recursive

# MONOREPOSITORIES - Un repo, múltiples proyectos

# Estructura típica de monorepo
# monorepo/
# ├── packages/
# │   ├── web-app/
# │   ├── mobile-app/  
# │   ├── shared-ui/
# │   └── shared-utils/
# ├── tools/
# ├── package.json
# └── lerna.json (si usa Lerna)

# Herramientas para monorepos
# - Lerna: gestión de paquetes múltiples
# - Nx: build system y herramientas
# - Rush: escalabilidad enterprise
# - Yarn Workspaces: workspaces nativo

# Ejemplo con Yarn Workspaces
# package.json raíz:
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}

# Comandos en monorepo
yarn workspace web-app add react
yarn workspace mobile-app test
yarn workspaces run build
git add .
git commit -m "Update all packages"

# Ventajas monorepo vs multi-repo:
# Monorepo: código compartido fácil, refactoring atómico
# Multi-repo: despliegues independientes, equipos separados
```

**Comparación:** Tags vs Releases - Git tags son marcadores de commits locales/remotos, mientras que GitHub releases añaden interfaz web, release notes y assets descargables. Submodules vs Monorepos - Submodules vinculan repos externos manteniendo separación, mientras que monorepos centralizan múltiples proyectos en un repositorio único.

## Estrategias de Branching
**Descripción:** Diferentes metodologías para organizar y gestionar ramas en proyectos, desde Git Flow tradicional hasta estrategias modernas como GitHub Flow y GitLab Flow, incluyendo cuándo usar cada una según el tipo de proyecto y equipo.

**Ejemplo:**
```bash
# 1. GIT FLOW - Estrategia tradicional para releases planificados

# Estructura de ramas:
# main - código de producción estable
# develop - rama de desarrollo principal  
# feature/* - nuevas funcionalidades
# release/* - preparación de releases
# hotfix/* - fixes críticos de producción

# Inicialización Git Flow
git flow init
# Define branch names:
# main, develop, feature/, release/, hotfix/

# Feature development
git flow feature start user-authentication
# Crea: feature/user-authentication desde develop
echo "auth logic" > auth.js
git add auth.js
git commit -m "Add user authentication"
git flow feature finish user-authentication
# Merge a develop y elimina feature branch

# Release process
git flow release start v1.2.0
# Crea: release/v1.2.0 desde develop
echo "1.2.0" > VERSION
git add VERSION  
git commit -m "Bump version to 1.2.0"
git flow release finish v1.2.0
# Merge a main y develop, crea tag v1.2.0

# Hotfix critical bugs
git flow hotfix start v1.2.1
# Crea: hotfix/v1.2.1 desde main
echo "critical fix" > fix.js
git add fix.js
git commit -m "Fix critical security issue"
git flow hotfix finish v1.2.1
# Merge a main y develop, crea tag v1.2.1

# 2. GITHUB FLOW - Estrategia simple para despliegue continuo

# Estructura simplificada:
# main - siempre deployable
# feature-branches - trabajo en progreso

# Feature workflow con GitHub Flow
git checkout main
git pull origin main               # Siempre empezar desde main actualizado
git checkout -b feature/add-payment-system

# Desarrollo iterativo
echo "payment logic" > payment.js
git add payment.js
git commit -m "Add payment system foundation"
git push origin feature/add-payment-system

# Continuar desarrollo
echo "payment validation" >> payment.js
git add payment.js
git commit -m "Add payment validation"
git push origin feature/add-payment-system

# Pull Request y deploy de testing
# En GitHub: crear PR feature/add-payment-system -> main
# Deploy automático a staging para testing
# Code review y discusión

# Merge y deploy a producción
git checkout main
git pull origin main               # PR ya mergeado
# Deploy automático a producción

# 3. GITLAB FLOW - Híbrido con environment branches

# Estructura con environment branches:
# main - desarrollo principal
# pre-production - testing/staging
# production - código de producción

# Feature development
git checkout main
git pull origin main
git checkout -b feature/user-dashboard

echo "dashboard code" > dashboard.js
git add dashboard.js
git commit -m "Add user dashboard"
git push origin feature/user-dashboard

# Merge Request to main
# Después de merge, flujo a environments
git checkout main
git pull origin main

# Deploy a pre-production para testing
git checkout pre-production
git merge main
git push origin pre-production
# Deploy automático a staging

# Después de testing exitoso, deploy a producción
git checkout production  
git merge pre-production
git push origin production
# Deploy automático a producción

# 4. TRUNK-BASED DEVELOPMENT - Desarrollo en rama principal

# Estructura minimalista:
# main/trunk - desarrollo principal
# short-lived feature branches (< 1 día)

# Feature flags para funcionalidades en desarrollo
git checkout main
git pull origin main

# Rama muy corta
git checkout -b quick-fix/update-header
echo 'const header = "New Header"' > header.js
git add header.js
git commit -m "Update header text"
git push origin quick-fix/update-header

# Merge rápido (mismo día)
git checkout main
git merge quick-fix/update-header
git push origin main
git branch -d quick-fix/update-header

# Para features más grandes, usar feature flags
echo 'const newFeature = process.env.FEATURE_FLAG_NEW_UI' > feature.js
git add feature.js
git commit -m "Add new UI behind feature flag"
git push origin main

# 5. ESTRATEGIA PERSONALIZADA PARA EQUIPOS

# Para equipos pequeños (2-5 devs):
# main - producción
# develop - desarrollo
# feature/* - features individuales

git checkout develop
git pull origin develop
git checkout -b feature/small-team-feature

# Para equipos grandes (10+ devs):  
# main - producción
# develop - desarrollo
# team-a/* - features del equipo A
# team-b/* - features del equipo B
# integration/* - integración entre equipos

git checkout develop
git checkout -b team-frontend/user-interface
git checkout -b team-backend/api-endpoints

# Para proyectos de microservicios:
# main - código estable
# service-a/* - features del servicio A
# service-b/* - features del servicio B
# integration/* - cambios que afectan múltiples servicios

git checkout main
git checkout -b service-auth/new-oauth-provider
git checkout -b service-payment/stripe-integration

# Ejemplo completo: migración de Git Flow a GitHub Flow
# Situación: equipo quiere despliegues más rápidos

# Antes (Git Flow):
git flow feature start new-feature    # Rama larga
# ... desarrollo prolongado ...
git flow release start v2.0.0         # Release branch
# ... testing y fixes ...
git flow release finish v2.0.0        # Deploy semanal

# Después (GitHub Flow):
git checkout main
git checkout -b feature/new-feature   # Rama corta
echo "quick implementation" > feature.js
git add feature.js
git commit -m "Implement new feature"
git push origin feature/new-feature
# PR + review + merge + deploy (mismo día)

# Protección de ramas para asegurar calidad
# En GitHub/GitLab settings:
# - Require PR before merge
# - Require status checks (CI/CD)
# - Require up-to-date branches
# - Dismiss stale reviews
# - Require admin to follow rules

# Branch protection rules via CLI
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["ci/tests","ci/build"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":2}'
```

**Comparación:** Git Flow vs GitHub Flow vs Trunk-based - Git Flow es robusto para releases planificados pero complejo, GitHub Flow es simple y rápido para despliegue continuo, mientras que Trunk-based maximiza velocidad con ramas muy cortas y feature flags.
