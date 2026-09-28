# Occupify Web Architecture Guide

This document provides a comprehensive overview of the architecture, directory structure, coding conventions, and design principles implemented in the **Occupify Web** application. The codebase adheres to the enterprise-grade **Feature-Driven / Bulletproof React Architecture** powered by the **React 19 + Vite 8** modern web stack.

---

## 1. Core Technology Stack

| Layer | Technology | Version | Role & Description |
| :--- | :--- | :--- | :--- |
| **Framework & Core** | React | 19.x | Client-side UI rendering library |
| **Build Tooling** | Vite | 8.x | High-performance bundler with instant HMR and Rolldown runtime |
| **Language** | TypeScript | 6.x | Strict static typing and compile-time correctness |
| **Styling** | Tailwind CSS | 4.x (`@tailwindcss/vite`) | Next-generation CSS engine compiled directly via Vite plugin |
| **Routing** | React Router | 7.x | Declarative client-side routing with route-level code splitting |
| **Server State** | TanStack Query | 5.x | Asynchronous state management, query caching, and data synchronization |
| **Global Client State** | Zustand | 5.x | Lightweight, boilerplate-free client state container |
| **Iconography** | Phosphor Icons | 2.x (`@phosphor-icons/react`) | Comprehensive and consistent icon system |
| **Linter** | Oxlint | 1.8x | High-performance Rust-based linter |

---

## 2. Directory Blueprint

```text
occupify-web/
├── public/                 # Static assets served directly at the root URL
│   ├── favicon.svg
│   └── icons.svg
├── src/                    # Primary application source code
│   ├── app/                # Application orchestration layer (Router, Providers, Routes)
│   │   ├── routes/         # Route-level container components (Home, NotFound, etc.)
│   │   ├── provider.tsx    # Root provider tree (QueryClient, Suspense, ErrorBoundary)
│   │   └── router.tsx      # React Router configuration & dynamic lazy loading
│   ├── assets/             # Internal bundled assets (SVGs, images, fonts)
│   ├── components/         # Shared domain-agnostic UI primitives
│   │   ├── ui/             # Foundational UI atoms (Button, Input, Modal, Badge...)
│   │   └── feedback/       # Status indicators (Toast, Spinner, Skeleton, EmptyState...)
│   ├── config/             # Centralized application configuration
│   │   ├── env.ts          # Type-safe environment variable reader
│   │   └── site.ts         # Site metadata, branding, and navigation items
│   ├── features/           # Domain-driven feature modules (The core of the app)
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
- **`dist/`** *(generated upon build)*: Contains optimized, minified production assets created by `pnpm run build`. This is the sole artifact deployed to production environments (Nginx, Docker, Vercel, Cloudflare, etc.).

---

### 3.2. Inside `src/`

#### 1. `src/app/` (Application Orchestration Layer)
Serves as the high-level coordinator of the application:
- **`router.tsx`**: Defines the application routing structure using `createBrowserRouter`. All routes utilize `React.lazy()` for automatic route-based code-splitting.
- **`provider.tsx`**: Centralizes all global React providers (`QueryClientProvider`, global `Suspense` fallbacks, future theme or notification contexts).
- **`routes/`**: Route components that correspond to specific URL paths (e.g., `home.tsx`, `not-found.tsx`). These components act strictly as layout containers that assemble feature components together.

#### 2. `src/features/` (Domain-Driven Feature Modules)
The core business domains of Occupify (e.g., `auth`, `jobs`, `contracts`, `proposals`, `wallet`, `chat`). Each feature module is self-contained:

```text
src/features/<feature-name>/
├── api/               # TanStack Query hooks and API communication functions
│   ├── get-jobs.ts    # useQuery hook for fetching data
│   └── create-job.ts  # useMutation hook for data mutations
├── components/        # Feature-specific UI components
│   ├── job-card.tsx
│   └── job-filters.tsx
├── hooks/             # Feature-specific custom hooks
├── types/             # Domain models and DTO interfaces
│   └── index.ts
└── index.ts           # Explicit public API export boundary (Gatekeeper)
```

#### 3. `src/components/` (Shared UI Primitives)
Contains domain-agnostic UI elements that can be used across any screen or feature:
- **`ui/`**: Base design system components (Button, Input, Dropdown, Modal, Card, Badge, Slider...).
- **`feedback/`**: Visual feedback indicators (Toast notifications, Loading spinners, Skeletons, Empty states).

#### 4. `src/config/` (Application Configuration)
Centralized configuration values and environment accessors:
- **`env.ts`**: Provides a type-checked `env` object that prevents undefined variable access and encapsulates `import.meta.env`.
- **`site.ts`**: Contains site metadata, brand identity, navigation menus, and support contacts.

#### 5. `src/hooks/` (Shared Custom Hooks)
Cross-cutting, reusable custom hooks that are domain-agnostic:
- `useDebounce`: Debounces high-frequency user input (search bars).
- `useMediaQuery`: Evaluates CSS media queries for responsive layouts.
- `useLocalStorage`: Synchronizes state with browser storage.
- `useClickOutside`: Detects pointer clicks outside a target container.

#### 6. `src/lib/` (Third-Party Integrations)
Initializes and configures external libraries and clients before exposing them to the application:
- `api-client.ts`: Configured HTTP client (Fetch/Axios) with global auth headers and error interceptors.
- Formatters, charting libraries, or WebSocket client adapters.

#### 7. `src/stores/` (Global Client State)
Houses client-side state stores powered by **Zustand**:
- Reserved strictly for persistent client UI state (e.g., active user session token, sidebar collapse state, UI preferences).
- **Server state from APIs must remain inside TanStack Query**, never duplicated into Zustand.

#### 8. `src/types/` (Global Types)
Shared TypeScript interfaces, utility types, and DTO envelopes used across multiple features:
- Standard API response wrappers (`ApiResponse<T>`).
- Pagination contracts (`PaginatedResponse<T>`).
- Cross-domain entity enums (`UserRole`, `PaymentStatus`).

#### 9. `src/utils/` (Pure Utilities)
Domain-agnostic pure helper functions without React dependencies:
- Currency formatting (`formatVND`).
- Relative timestamp formatting.
- String manipulation and regular expression validators.

---

## 4. Strict Boundary Rules

To maintain high modularity and prevent tightly-coupled spaghetti code, all feature modules must follow three strict rules:

### Rule 1: The `index.ts` Gatekeeper
External modules may only consume code that is explicitly re-exported by `src/features/<feature-name>/index.ts`. Direct imports into internal subdirectories are strictly prohibited.

```typescript
// ✅ ALLOWED: Consuming via public API contract
import { JobCard, useJobs } from '@/features/jobs'

// ❌ FORBIDDEN: Deep internal piercing
import { JobCard } from '@/features/jobs/components/job-card'
```

### Rule 2: Colocation Over Centralization
- If a component, hook, or type is used by a single feature, **it must remain inside that feature**.
- Do not promote code to `src/components/`, `src/hooks/`, or `src/types/` unless it is genuinely shared by two or more independent features.

### Rule 3: Unidirectional Dependency Flow
- Features may freely import from shared directories (`src/components`, `src/lib`, `src/hooks`, `src/utils`).
- Shared directories (`src/components`, `src/utils`...) **must never import from `src/features`**.

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

| Command | Purpose |
| :--- | :--- |
| `pnpm run dev` | Starts Vite local development server with instant HMR |
| `pnpm run build` | Runs TypeScript compilation (`tsc -b`) and produces production bundle in `dist/` |
| `pnpm run lint` | Runs Oxlint across source files for syntax and quality checks |
| `pnpm run preview` | Starts a local web server serving the production `dist/` bundle for verification |
