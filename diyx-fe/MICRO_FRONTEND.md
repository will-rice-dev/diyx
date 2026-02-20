# Micro Frontend Architecture

## Current Architecture: Shell / Remote Pattern (via Angular Lazy Loading)

This app is structured as a **shell application** with **feature remotes** — mirroring the Module Federation micro frontend pattern — using Angular's native lazy loading as the mechanism.

### What "micro frontend" means here

Each feature (`auth`, `portfolios`, `settings`) is:
- **Self-contained**: owns its own routes, services, and components
- **Lazy-loaded**: not included in the initial bundle
- **Isolated**: no direct imports between features; all sharing goes through the `shared/` kernel
- **Independently deployable in spirit**: the boundaries are already drawn for Module Federation extraction

The shell (`app.routes.ts`) only knows about lazy chunk boundaries — not the internals of any feature.

### Directory structure

```
app/
  app.ts            ← Shell: layout host + toast overlay
  app.config.ts     ← Providers: router, HTTP client + interceptors
  app.routes.ts     ← Shell router: lazy-loads each remote by route
  shared/           ← Shared kernel (safe to share between remotes)
    models/         ← TypeScript interfaces matching API schemas
    services/       ← AuthService, ThemeService (singleton, root-provided)
    interceptors/   ← HTTP middleware (auth token, error handling)
    guards/         ← Route guards (authGuard, guestGuard)
    components/     ← Shell-level UI (ShellLayout, Toast)
    utils/          ← RxJS operators
  features/
    auth/           ← Remote 1: login + register
    portfolios/     ← Remote 2: CRUD list/detail/form
    settings/       ← Remote 3: theme + timezone
```

### How to extract into true Module Federation remotes

When the app needs true independent deployment (separate CI, separate CDO, separate teams), extract each feature:

**1. Install Module Federation**
```bash
npm install @angular-architects/module-federation
ng add @angular-architects/module-federation --project diyx-fe --port 4200 --type host
```

**2. For each feature, scaffold a remote app**
```bash
ng generate application portfolios-remote --routing
ng add @angular-architects/module-federation --project portfolios-remote --port 4201 --type remote
```

**3. Expose the feature's routes from the remote's `webpack.config.js`**
```js
exposes: {
  './PortfoliosRoutes': './projects/portfolios-remote/src/app/features/portfolios/portfolios.routes.ts',
},
```

**4. Update the shell's `app.routes.ts` to load from the remote**
```ts
{
  path: 'portfolios',
  loadChildren: () =>
    loadRemoteModule({ remoteEntry: 'http://localhost:4201/remoteEntry.js', exposedModule: './PortfoliosRoutes' })
      .then(m => m.portfoliosRoutes),
}
```

**5. Move shared models/services to a shared library**
```bash
ng generate library shared-kernel
```
Then publish to a private registry or use `npm link` in development.

### Shared Kernel contract

The `shared/` directory is the contract between the shell and remotes. Currently:
- `models/` — typed API DTOs (no Angular dependency)
- `services/` — `AuthService` (JWT state), `ThemeService` (dark mode)
- `interceptors/` — HTTP middleware registered in shell's `app.config.ts`
- `guards/` — Route protection

In a true Module Federation setup, these would live in a versioned `shared-kernel` package. Breaking changes require semver bumps.

### Why lazy loading already gets you most of the way

| Property | Lazy Loading | Module Federation |
|---|---|---|
| Code splitting | ✅ | ✅ |
| Independent bundles | ✅ | ✅ |
| Team isolation | Partial (monorepo) | ✅ (separate repos) |
| Independent deployment | ❌ | ✅ |
| Runtime composition | ❌ | ✅ |
| Shared singleton services | ✅ (same app) | Requires shared libs |

The current implementation is production-ready for a single-team monorepo. Upgrade to Module Federation when you need separate deployment pipelines or separate teams owning each feature.
