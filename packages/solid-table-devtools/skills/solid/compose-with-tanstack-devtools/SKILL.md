---
name: solid/compose-with-tanstack-devtools
description: >
  Wire up TanStack Devtools for TanStack Table in Solid. Mount `TanStackDevtools`
  with `tableDevtoolsPlugin()` once at the app root and call
  `useTanStackTableDevtools(table)` after each `createTable` so the table
  is registered as a devtools target. Live devtools are tree-shaken to no-ops in
  production unless you import from `@tanstack/solid-table-devtools/production`.
type: composition
library: tanstack-table
framework: solid
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - solid/table-state
sources:
  - TanStack/table:docs/devtools.md
  - TanStack/table:packages/solid-table-devtools/src/index.ts
  - TanStack/table:packages/solid-table-devtools/src/plugin.tsx
  - TanStack/table:packages/solid-table-devtools/src/useTanStackTableDevtools.ts
  - TanStack/table:packages/solid-table-devtools/src/production.ts
---

This skill builds on `tanstack-table/solid/table-state`. Read that first — the devtools panel inspects whatever table instance you register, so you need a working `createTable` before this skill is useful.

## Setup

Install the TanStack Devtools host and the Solid Table adapter:

```sh
pnpm add @tanstack/solid-devtools @tanstack/solid-table-devtools
```

The recommended pattern has two parts:

1. Mount `<TanStackDevtools>` once at the app root with `tableDevtoolsPlugin()`.
2. Call `useTanStackTableDevtools(table)` right after every `createTable()`.

```tsx
import { render } from 'solid-js/web'
import { createTable } from '@tanstack/solid-table'
import { TanStackDevtools } from '@tanstack/solid-devtools'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/solid-table-devtools'

function UsersScreen() {
  const table = createTable({
    features,
    key: 'users-table',
    columns,
    data,
  })

  // Register this table with the devtools panel.
  useTanStackTableDevtools(table)

  return <UsersGrid table={table} />
}

render(
  () => (
    <>
      <UsersScreen />
      {/* Mount once, anywhere in the tree. */}
      <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
    </>
  ),
  document.getElementById('root')!,
)
```

`tableDevtoolsPlugin()` returns a plugin descriptor for the multi-panel TanStack Devtools UI. `useTanStackTableDevtools` registers the table inside a `createRenderEffect` and removes it via `onCleanup`, so it tracks the table's reactive scope.

## Patterns

### Keying Tables

Add a stable `key` option to the table options. Devtools use this key as both the registration id and the panel selector label.

```tsx
useTanStackTableDevtools(table)
```

### Multiple Tables

Register as many tables as you like. The Table panel renders a selector. Name each one.

```tsx
function Dashboard() {
  const ordersTable = createTable(ordersOptions)
  const usersTable = createTable(usersOptions)

  useTanStackTableDevtools(ordersTable)
  useTanStackTableDevtools(usersTable)

  return <Layout ordersTable={ordersTable} usersTable={usersTable} />
}
```

### Disabling Per Table

`useTanStackTableDevtools` accepts an `enabled` option. When `false`, the registration is removed (the table disappears from the panel) but the hook still runs cleanly.

```tsx
useTanStackTableDevtools(table, {
  enabled: import.meta.env.DEV && showTableDevtools(),
})
```

### Production Builds

The default `@tanstack/solid-table-devtools` entrypoint swaps to no-op implementations when `process.env.NODE_ENV !== 'development'`. To ship the real devtools to production, switch BOTH imports to the `/production` entrypoint:

```tsx
import { TanStackDevtools } from '@tanstack/solid-devtools'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/solid-table-devtools/production'
```

If you mix entrypoints (one from `/production`, one from the default), one side is a no-op in production and the panel will appear empty.

### Conditional Devtools by Env

For a code-split production-only devtools bundle, dynamically import the `/production` entrypoint behind a flag:

```tsx
import { lazy, Show, Suspense } from 'solid-js'

const TableDevtoolsRoot = lazy(async () => {
  const { tableDevtoolsPlugin } =
    await import('@tanstack/solid-table-devtools/production')
  const { TanStackDevtools } = await import('@tanstack/solid-devtools')
  return {
    default: () => <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />,
  }
})

function Root() {
  return (
    <>
      <App />
      <Show when={showDevtools()}>
        <Suspense>
          <TableDevtoolsRoot />
        </Suspense>
      </Show>
    </>
  )
}
```

## Common Mistakes

### Forgetting to mount `<TanStackDevtools>` at the app root

Calling `useTanStackTableDevtools(table)` alone does nothing visible — it only registers the table with the devtools target store. Without a `<TanStackDevtools plugins={[tableDevtoolsPlugin()]} />` somewhere in the tree, there is no panel to render the registration. Symptom: hook runs without errors, no devtools button appears.

### Importing devtools from the default path in a prod-only bundle

If you only deploy production builds, `@tanstack/solid-table-devtools` resolves to no-op implementations. The plugin will mount, but the panel will be empty. Use `@tanstack/solid-table-devtools/production` if you want the real devtools available there.

### Accidentally shipping devtools to end users via `/production`

The flip side: importing from `/production` in your default app bundle means every visitor downloads and runs the devtools UI. That is usually not what you want. Restrict `/production` imports to dev/preview entrypoints or code-split them behind a flag.

### Calling `useTanStackTableDevtools` outside a reactive scope

The hook uses `createRenderEffect` + `onCleanup`. Call it inside a component (or another Solid reactive scope) that owns the `table`. Calling it in a top-level module body bypasses the reactive owner and the cleanup never fires.

### Multiple tables without keys

A table registered without `options.key` is skipped and devtools log an error. Add a unique `key` option to every table that should appear in devtools.
