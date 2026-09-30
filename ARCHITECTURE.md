# Occupify Web Architecture Guide

This document provides a comprehensive overview of the architecture, directory structure, coding conventions, and design principles implemented in the **Occupify Web** application. The codebase adheres to the enterprise-grade **Feature-Driven / Bulletproof React Architecture** powered by the **React 19 + Vite 8** modern web stack.

---

## 1. Core Technology Stack

| Layer                   | Technology     | Version                       | Role & Description                                                     |
| :---------------------- | :------------- | :---------------------------- | :--------------------------------------------------------------------- |
| **Framework & Core**    | React          | 19.x                          | Client-side UI rendering library                                       |
| **Build Tooling**       | Vite           | 8.x                           | High-performance bundler with instant HMR and Rolldown runtime         |
| **Language**            | TypeScript     | 6.x                           | Strict static typing and compile-time correctness                      |
| **Styling**             | Tailwind CSS   | 4.x (`@tailwindcss/vite`)     | Next-generation CSS engine compiled directly via Vite plugin           |
| **Routing**             | React Router   | 7.x                           | Declarative client-side routing with route-level code splitting        |
| **Server State**        | TanStack Query | 5.x                           | Asynchronous state management, query caching, and data synchronization |
| **Global Client State** | Zustand        | 5.x                           | Lightweight, boilerplate-free client state container                   |
| **Iconography**         | Phosphor Icons | 2.x (`@phosphor-icons/react`) | Comprehensive and consistent icon system                               |
| **Linter**              | Oxlint         | 1.8x                          | High-performance Rust-based linter                                     |

---

## 2. Directory Blueprint

```text
occupify-web/
├── public/                 # Static assets served directly at the root URL
│   ├── favicon.svg
│   └── icons.svg
├── src/                    # Primary application source code
│   ├── app/                # Application orchestration layer (Router, Providers)
│   │   ├── provider.tsx    # Root provider tree (QueryClient, Suspense, ErrorBoundary)
│   │   └── router.tsx      # React Router configuration & dynamic lazy loading
│   ├── assets/             # Internal bundled assets (SVGs, images, fonts)
│   ├── components/         # Shared domain-agnostic UI primitives
│   │   ├── ui/             # Foundational UI atoms (Button, Input, Modal, Badge...)
│   │   └── feedback/       # Status indicators (Toast, Spinner, Skeleton, EmptyState...)
│   ├── config/             # Centralized application configuration
│   │   ├── env.ts          # Type-safe environment variable reader
│   │   └── site.ts         # Site metadata, branding, and navigation items
│   ├── features/           # Domain-driven business capability modules (The core of the app)
│   │   └── auth/           # Business capability: authentication domain
│   │       ├── api/        # loginApi, registerApi, getCurrentUser
│   │       ├── components/ # LoginForm, SignUpModal, AuthButton
│   │       ├── hooks/      # useAuth, useLogin, useSignUp
│   │       ├── types/      # Domain models, credentials, and DTOs
│   │       └── index.ts    # Public API export for auth
│   ├── pages/              # Routed composition layer (or app/ if using Next.js App Router)
│   │   └── landing/        # Landing page route composition
│   │       ├── components/ # Landing-specific presentational sections (Hero, Features, Pricing)
│   │       ├── LandingPage.tsx # Assembles sections and integrates auth features
│   │       └── index.ts    # Public route entry export for router lazy-loading
│   ├── hooks/              # Shared custom hooks (useDebounce, useMediaQuery...)
│   ├── lib/                # Pre-configured third-party library instances (API client, formatters)
│   ├── stores/             # Global client state stores (Zustand)
│   ├── types/              # Global shared TypeScript types and data contracts
│   ├── utils/              # Pure utility functions (formatting, validation, helpers)
│   ├── index.css           # Global stylesheets & Tailwind imports
│   ├── main.tsx            # Application entry point mounting React root
│   └── vite-env.d.ts       # TypeScript declarations for Vite and ImportMetaEnv
├── .env.example            # Environment variables template for team & CI/CD
├── .gitignore              # Git ignore specifications
├── .oxlintrc.json          # Oxlint configuration
├── package.json            # Project manifest, dependencies, and npm scripts
├── pnpm-lock.yaml          # Deterministic dependency lockfile
├── tsconfig.json           # TypeScript solution configuration
├── tsconfig.app.json       # TypeScript configuration for `src/` code
├── tsconfig.node.json      # TypeScript configuration for Node tooling (`vite.config.ts`)
└── vite.config.ts          # Vite build, server, and vendor chunking configuration
```

---

## 3. Directory Responsibilities

### 3.1. Root Level

- **`public/`**: Contains static assets served untouched by Vite at the root URL (e.g., `favicon.svg`, `robots.txt`, `sitemap.xml`).
- **`dist/`** _(generated upon build)_: Contains optimized, minified production assets created by `pnpm run build`. This is the sole artifact deployed to production environments (Nginx, Docker, Vercel, Cloudflare, etc.).

---

### 3.2. Inside `src/`

#### 1. `src/app/` (Application Orchestration Layer)

Serves as the high-level coordinator of the application:

- **`router.tsx`**: Defines the application routing structure using `createBrowserRouter` (React Router 7). All routes utilize `React.lazy()` to dynamically code-split and load target page views from `src/pages/`.
- **`provider.tsx`**: Centralizes all global React providers (`QueryClientProvider`, global `Suspense` fallbacks, future theme or notification contexts).

#### 2. `src/pages/` (Routed Composition Layer)

Represents the routed composition layer (analogous to the `app/` directory if using Next.js App Router, or routed view assemblies in modular React SPAs). Each folder under `src/pages/<page-name>/` represents a distinct URL route destination:

```text
src/pages/landing/
├── components/       # Landing-specific presentational sections (Hero, Features, Pricing)
├── LandingPage.tsx   # Assembles sections and integrates auth features
└── index.ts          # Public route entry export (re-exports LandingPage for router lazy-loading)
```

- **Presentational Section Colocation**: Presentational sections that belong solely to a specific page (e.g., `Hero`, `FeaturesSection`, `PricingTable`) are colocated under `src/pages/<page-name>/components/`. They do not belong in `src/components/ui/` because they are single-purpose and tied directly to the narrative of that page.
- **Feature Assembly**: The page view (`LandingPage.tsx`) orchestrates the layout and seamlessly integrates domain capabilities imported from `src/features/*` (such as auth buttons, sign-in modals, job boards, or property filters).
- **Thin Composition**: Pages do not define low-level API queries, mutation algorithms, or complex domain stores. They remain thin composition layers that orchestrate feature components and manage page-level UI state (e.g., modal visibility, active section tabs).
- **Lazy Loading Contract**: Each page exposes an `index.ts` re-exporting the page component to allow clean, uniform dynamic imports inside `src/app/router.tsx`:
  ```typescript
  const LandingPage = lazy(() => import('@/pages/landing'))
  ```

#### 3. `src/features/` (Domain-Driven Business Modules)

The core business domains and capabilities of Occupify (e.g., `auth`, `properties`, `jobs`, `contracts`, `proposals`, `wallet`, `chat`). Each feature module is an autonomous, self-contained business domain:

```text
src/features/auth/
├── api/              # API queries, mutations, and client callers (loginApi, registerApi)
├── components/       # Domain-specific UI widgets (LoginForm, SignUpModal, AuthButton)
├── hooks/            # Business logic and authentication state hooks (useAuth, useLogin, useSignUp)
├── types/            # Domain models, credentials, and DTO interfaces
└── index.ts          # Public API export boundary for auth (Gatekeeper)
```

- **Domain Independence**: Features are completely decoupled from specific routes or pages. They can be mounted across multiple pages, headers, modals, or drawer panels without modification.
- **Encapsulated State & Data**: TanStack Query hooks, mutation logic, form validation, and feature-scoped hooks live inside the feature module.

##### Architectural Comparison: Pages vs. Features vs. Shared Components

| Dimension        | `src/components/ui/`                              | `src/features/<feature>/`                      | `src/pages/<page>/`                                 |
| :--------------- | :------------------------------------------------ | :--------------------------------------------- | :-------------------------------------------------- |
| **Role**         | Foundational UI primitives (Atoms)                | Autonomous business domain capability          | Route composition & layout orchestration            |
| **Scope**        | Global design system (`Button`, `Modal`, `Input`) | Domain slice (`auth`, `properties`, `jobs`)    | Route endpoint (`landing`, `dashboard`, `settings`) |
| **Domain Logic** | None (Domain-agnostic, styling & a11y only)       | High (Data fetching, validation, domain state) | Low (Coordinates features & page layout)            |
| **Reusability**  | Ubiquitous across the entire application          | Reusable across multiple pages/views           | Scoped to one specific URL route                    |
| **Exports**      | Direct component exports via `index.ts`           | Strict public contract via `index.ts`          | Page component export via `index.ts`                |

#### 4. `src/components/` (Shared UI Primitives)

Contains domain-agnostic UI elements that can be used across any screen or feature:

- **`ui/`**: Base design system components (Button, Input, Dropdown, Modal, Card, Badge, Slider...).
- **`feedback/`**: Visual feedback indicators (Toast notifications, Loading spinners, Skeletons, Empty states).

#### 5. `src/config/` (Application Configuration)

Centralized configuration values and environment accessors:

- **`env.ts`**: Provides a type-checked `env` object that prevents undefined variable access and encapsulates `import.meta.env`.
- **`site.ts`**: Contains site metadata, brand identity, navigation menus, and support contacts.

#### 6. `src/hooks/` (Shared Custom Hooks)

Cross-cutting, reusable custom hooks that are domain-agnostic:

- `useDebounce`: Debounces high-frequency user input (search bars).
- `useMediaQuery`: Evaluates CSS media queries for responsive layouts.
- `useLocalStorage`: Synchronizes state with browser storage.
- `useClickOutside`: Detects pointer clicks outside a target container.

#### 7. `src/lib/` (Third-Party Integrations)

Initializes and configures external libraries and clients before exposing them to the application:

- `api-client.ts`: Configured HTTP client (Fetch/Axios) with global auth headers and error interceptors.
- Formatters, charting libraries, or WebSocket client adapters.

#### 8. `src/stores/` (Global Client State)

Houses client-side state stores powered by **Zustand**:

- Reserved strictly for persistent client UI state (e.g., active user session token, sidebar collapse state, UI preferences).
- **Server state from APIs must remain inside TanStack Query**, never duplicated into Zustand.

#### 9. `src/types/` (Global Types)

Shared TypeScript interfaces, utility types, and DTO envelopes used across multiple features:

- Standard API response wrappers (`ApiResponse<T>`).
- Pagination contracts (`PaginatedResponse<T>`).
- Cross-domain entity enums (`UserRole`, `PaymentStatus`).

#### 10. `src/utils/` (Pure Utilities)

Domain-agnostic pure helper functions without React dependencies:

- Currency formatting (`formatVND`).
- Relative timestamp formatting.
- String manipulation and regular expression validators.

---

## 4. Strict Boundary Rules

To maintain high modularity, prevent tightly-coupled spaghetti code, and enforce clean separation of concerns, all modules must follow five strict boundary rules:

### Rule 1: The `index.ts` Gatekeeper

External modules may only consume code that is explicitly re-exported by `src/features/<feature-name>/index.ts` or `src/pages/<page-name>/index.ts`. Direct imports into internal subdirectories are strictly prohibited.

```typescript
// ✅ ALLOWED: Consuming via public API contract
import { AuthButton, LoginForm, useAuth } from '@/features/auth'
import LandingPage from '@/pages/landing'

// ❌ FORBIDDEN: Deep internal piercing into feature internals
import { LoginForm } from '@/features/auth/components/LoginForm'
import { loginApi } from '@/features/auth/api/signin'
```

### Rule 2: Colocation Over Centralization

- If a component, hook, or type is used by a single feature, **it must remain inside that feature**.
- If a presentational section is specific to a single page (e.g. `HeroSection`, `PricingSection` on `landing`), **it must reside in `src/pages/<page>/components/`**.
- Do not promote code to `src/components/`, `src/hooks/`, or `src/types/` unless it is genuinely shared by two or more independent features or pages.

### Rule 3: Unidirectional Dependency Flow

Dependencies must always flow downwards from higher-order composition layers to foundational primitives:

```text
┌──────────────────────────────────────────────┐
│  src/app/ (Router & Providers)               │
└──────────────────────┬───────────────────────┘
                       │ imports
                       ▼
┌──────────────────────────────────────────────┐
│  src/pages/ (Routed Composition Layer)       │
└──────────────┬───────────────────────┬───────┘
               │ imports               │ imports
               ▼                       │
┌──────────────────────────────────┐   │
│  src/features/ (Domain Modules)  │   │
└──────────────┬───────────────────┘   │
               │ imports               │
               ▼                       ▼
┌──────────────────────────────────────────────┐
│  src/components/, src/hooks/, src/lib/,      │
│  src/stores/, src/types/, src/utils/         │
└──────────────────────────────────────────────┘
```

- **Pages as Composition Consumers**: Pages (`src/pages/*`) import from `src/features/*` (via public `index.ts`), `src/components/ui/`, `src/hooks/`, and `src/stores/`.
- **Zero Feature-to-Page Imports**: Features (`src/features/*`) **must NEVER import from `src/pages/*`**. Features are portable business capabilities and must remain entirely unaware of the pages hosting them.
- **Shared Primitives Isolation**: Shared directories (`src/components/`, `src/utils/`, `src/lib/`, `src/hooks/`) **must NEVER import from `src/features/` or `src/pages/`**.
- **Page Isolation**: A page module must never import private components from a sibling page (e.g., `src/pages/landing` must never import from `src/pages/dashboard/components`).

---

## 5. State Management Taxonomy

The application strictly divides state into four distinct tiers:

```text
┌────────────────────────────────────────────────────────┐
│ 1. Server State (Remote API Data)                      │
│    -> Tool: TanStack Query v5                          │
│    -> Scope: Caching, deduplication, automatic refetch │
├────────────────────────────────────────────────────────┤
│ 2. Global Client State (Shared UI State)               │
│    -> Tool: Zustand v5                                 │
│    -> Scope: User session, theme mode, navigation state│
├────────────────────────────────────────────────────────┤
│ 3. URL State (Routing Parameters)                      │
│    -> Tool: React Router (useSearchParams, useParams)  │
│    -> Scope: Filtering, sorting, pagination, search    │
├────────────────────────────────────────────────────────┤
│ 4. Local UI State (Component-Scoped State)             │
│    -> Tool: React.useState, React.useReducer           │
│    -> Scope: Modal toggles, form fields, active tabs   │
└────────────────────────────────────────────────────────┘
```

---

## 6. Environment Configuration

Environment variables are type-safe and validated at compile time:

- **`.env`**: Local development environment configuration (ignored by Git).
- **`.env.example`**: Version-controlled template documenting all required variables.
- **`src/vite-env.d.ts`**: Declares TypeScript types for `ImportMetaEnv` to enable IDE autocompletion.
- **`src/config/env.ts`**: Encapsulates runtime variable resolution and provides fallback defaults:
  ```ts
  import { env } from '@/config/env'
  console.log(env.appName, env.apiBaseUrl)
  ```

---

## 7. Development & Build Scripts

| Command                      | Purpose                                                                          |
| :--------------------------- | :------------------------------------------------------------------------------- |
| `pnpm run dev`               | Starts Vite local development server with instant HMR                            |
| `pnpm run build`             | Runs TypeScript compilation (`tsc -b`) and produces production bundle in `dist/` |
| `pnpm run lint`              | Runs Oxlint across source files for syntax and quality checks                    |
| `pnpm run format:check`      | Verifies code formatting across the repository with Prettier                     |
| `pnpm run format`            | Auto-formats all source files using Prettier                                     |
| `pnpm run scan:deprecations` | Scans codebase for `@deprecated` symbols in third-party libraries                |
| `pnpm run preview`           | Starts a local web server serving the production `dist/` bundle for verification |
