---
name: devtools
description: >
  Register TanStack Table targets and inspect options, state, features, columns, rows, and row models with @tanstack/table-devtools. Load for missing connections, required unique table options.key, target replacement/cleanup, or an explicit request for production Devtools entrypoints.
metadata:
  type: core
  library: '@tanstack/table-devtools'
  library_version: '9.0.0-beta.43'
requires:
  - '@tanstack/table-core#core'
sources:
  - 'TanStack/table:docs/devtools.md'
  - 'TanStack/table:packages/table-devtools/src/index.ts'
  - 'TanStack/table:packages/table-devtools/src/tableTarget.ts'
  - 'TanStack/table:packages/table-devtools/src/production.ts'
---

## Setup

Framework adapters should use their lifecycle hook or injector. The framework-neutral registration primitive is:

```ts
import { constructTable, tableFeatures } from '@tanstack/table-core'
import { storeReactivityBindings } from '@tanstack/table-core/store-reactivity-bindings'
import { upsertTableDevtoolsTarget } from '@tanstack/table-devtools'

const features = tableFeatures({
  coreReactivityFeature: storeReactivityBindings(),
})

const table = constructTable({
  key: 'users-table',
  features,
  columns: [],
  data: [],
})

const cleanup = upsertTableDevtoolsTarget({ table })
cleanup()
```

## Core Patterns

### Give every live table a descriptive unique key

The non-empty `options.key` is both registry identity and panel label. Use stable application identity, not an array index.

### Let adapter lifecycles own registration

React/Preact/Solid/Vue hooks and the Angular injector register and clean up at the correct time. Use core target functions only for unsupported frameworks or infrastructure code.

### Keep ordinary Devtools development-only

Default entrypoints export no-op panels/plugins outside development. Use `/production` only when the application explicitly chooses production inspection and its security/bundle implications.

## Common Mistakes

### HIGH Missing key skips registration

Wrong: register a table whose `options.key` is absent or whitespace.

Correct: set a stable value such as `key: 'billing-invoices'` before registration.

The registry logs the missing-key error and returns without adding a target.

Source: TanStack/table:packages/table-devtools/src/tableTarget.ts

### HIGH Two tables share one key

Wrong: use `key: 'table'` for simultaneous tables.

Correct: use unique domain identities such as `users-table` and `orders-table`.

Upserting a different table under an existing key replaces that registration.

Source: TanStack/table:packages/table-devtools/src/tableTarget.ts

### MEDIUM Production panel expected by default

Wrong: debug why the normal entrypoint renders nothing in production.

Correct: keep Devtools development-only unless production inspection was explicitly requested; then import the documented `/production` entrypoint.

Default production exports intentionally use no-op implementations.

Source: TanStack/table:docs/devtools.md

## API Discovery

Inspect `node_modules/@tanstack/table-devtools/src/index.ts`, `tableTarget.ts`, and `production.ts`. Framework registration belongs to the matching `@tanstack/<framework>-table-devtools` package.
