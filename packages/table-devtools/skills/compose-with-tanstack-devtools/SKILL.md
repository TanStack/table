---
name: compose-with-tanstack-devtools
description: >
  Internal implementation of TanStack Table devtools. Consumers should NOT
  depend on `@tanstack/table-devtools` directly — install the framework-specific
  adapter (`@tanstack/react-table-devtools`, `@tanstack/vue-table-devtools`,
  `@tanstack/solid-table-devtools`, or `@tanstack/preact-table-devtools`)
  instead. This skill explains the underlying solid-js-based implementation for
  maintainers and contributors investigating internals.
type: composition
library: tanstack-table
library_version: '9.0.0-alpha.48'
requires:
  - state-management
sources:
  - TanStack/table:docs/devtools.md
  - TanStack/table:packages/table-devtools/src/index.ts
  - TanStack/table:packages/table-devtools/src/production.ts
  - TanStack/table:packages/table-devtools/src/core.tsx
  - TanStack/table:packages/table-devtools/src/tableTarget.ts
---

> **For consumers:** stop reading and install the framework adapter:
>
> - React: `@tanstack/react-table-devtools`
> - Vue: `@tanstack/vue-table-devtools`
> - Solid: `@tanstack/solid-table-devtools`
> - Preact: `@tanstack/preact-table-devtools`
>
> Angular, Lit, Svelte, and the vanilla `@tanstack/table-core` package **do not** currently ship table devtools adapters. There is no supported way to mount the devtools in those frameworks today.
>
> See the per-framework skills under `tanstack-table/<framework>/compose-with-tanstack-devtools` for setup. This skill documents internals only.

## Setup (internals)

`@tanstack/table-devtools` is the shared core that every framework adapter wraps. It is **not** meant to be installed by application code. Its package.json declares dependencies on `solid-js`, `@tanstack/solid-store`, `@tanstack/devtools-ui`, `@tanstack/devtools-utils`, and `goober` — pulling it directly into a React/Vue/Preact app drags Solid's runtime into the bundle for no benefit, since the framework adapter already does the right thing.

The package exports two surfaces:

- **`@tanstack/table-devtools`** — `TableDevtoolsCore` resolves to a no-op when `process.env.NODE_ENV !== 'development'`.
- **`@tanstack/table-devtools/production`** — `TableDevtoolsCore` always resolves to the real implementation.

Both surfaces also re-export the registration target store:

```ts
import {
  getTableDevtoolsTargets,
  removeTableDevtoolsTarget,
  setTableDevtoolsTarget,
  subscribeTableDevtoolsTargets,
  upsertTableDevtoolsTarget,
} from '@tanstack/table-devtools'
```

These are the functions the framework adapter hooks (`useTanStackTableDevtools`) call to register/unregister `Table` instances by id.

## Architecture

### Solid-based core

The panel UI is built in Solid even when it is mounted inside a React/Vue/Preact tree:

- `core.tsx` constructs `TableDevtoolsCore` via `constructCoreClass` from `@tanstack/devtools-utils/solid` and lazy-loads `./TableDevtools` (the Solid panel component).
- `useTableStore.ts` uses `@tanstack/solid-store` to back the panel's reactive state.
- Styling is handled with `goober` (atomic CSS-in-JS), keeping the bundle small and side-effect free.

Framework adapters mount this Solid component inside the host framework via `@tanstack/devtools-utils` interop helpers:

- `@tanstack/devtools-utils/react` (`createReactPlugin`) — used by `react-table-devtools` and `preact-table-devtools` plugin builders.
- `@tanstack/devtools-utils/solid` — used directly by `solid-table-devtools`.
- The vue adapter uses its own interop in `packages/vue-table-devtools/src/plugin.ts`.

Each adapter exports `tableDevtoolsPlugin()` (returns a plugin descriptor for the `TanStackDevtools` host) and a `useTanStackTableDevtools(table, options?)` hook idiomatic to the framework. The hook's only job is to call `upsertTableDevtoolsTarget(...)` on mount/update and runs the returned cleanup on unmount.

### Registration target store (`tableTarget.ts`)

The target store is the bridge between framework-specific hooks and the Solid panel:

- `upsertTableDevtoolsTarget({ table })` — register or update a table by `table.options.key`.
- `removeTableDevtoolsTarget(id)` — unregister on cleanup.
- `setTableDevtoolsTarget(...)` — register a table through the same key-based path (used internally).
- `subscribeTableDevtoolsTargets(listener)` — the Solid panel subscribes here to keep its selector in sync.
- `getTableDevtoolsTargets()` — snapshot for non-reactive reads.

Devtools use `table.options.key` as the stable registration id. No adapter generates ids automatically.

### Dev vs. production swap

Every entrypoint (root and adapters) re-exports a development binding and a no-op binding. The default index file picks between them based on `process.env.NODE_ENV`; the `/production` entrypoint always returns the real binding. Bundlers (Vite, Rollup, webpack, esbuild) tree-shake the unused branch.

## Common Mistakes

### Importing `@tanstack/table-devtools` directly into a non-Solid framework app

You will pay for Solid's runtime in your bundle and you will not get a working integration — there is no React/Vue/Preact-aware hook on this package. Install `@tanstack/<framework>-table-devtools` instead and import `tableDevtoolsPlugin` + `useTanStackTableDevtools` from there.

### Confusing this with the framework adapter packages

The framework-specific packages (`react-table-devtools`, etc.) re-export adapter hooks and plugins; this package re-exports only the registration target store and a Solid `TableDevtoolsCore` class. The names overlap (`tableDevtoolsPlugin` exists only on adapters; `TableDevtoolsCore` exists only here), so reading source code requires noting which package you are in.

### Expecting Angular/Lit/Svelte/vanilla support

There is no `@tanstack/angular-table-devtools`, `-lit-`, `-svelte-`, or `-table-core-devtools` package today. Document this gap when answering user questions — do not invent an import path. A future release may add adapters; until then the only way to inspect a table in those frameworks is to log `table.getState()` and `table.getRowModel()` manually.
