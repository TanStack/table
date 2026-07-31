---
name: api-not-found
description: >
  Diagnose missing TanStack Table v9 exports, options, state slices, and instance methods. Load before inventing an API when code sees a type error, undefined feature method, absent object key, adapter mismatch, or v8-shaped example.
metadata:
  type: sub-skill
  library: '@tanstack/table-core'
  library_version: '9.0.0-beta.65'
requires: ['core', 'table-features']
sources:
  - 'TanStack/table:packages/table-core/src/index.ts'
  - 'TanStack/table:packages/table-core/src/types/TableFeatures.ts'
  - 'TanStack/table:docs/framework/react/guide/migrating.md'
---

This skill builds on `core` and `table-features`. Treat the installed package—not remembered docs—as exact API truth.

## Setup

```ts
import { readFile } from 'node:fs/promises'

const packageJson = JSON.parse(
  await readFile('node_modules/@tanstack/table-core/package.json', 'utf8'),
)
const entrypoint = await readFile(
  'node_modules/@tanstack/table-core/dist/index.d.ts',
  'utf8',
)
console.log(packageJson.version, entrypoint.includes('rowSortingFeature'))
```

## Core Patterns

### Trace an export to source

```sh
rg "export .*rowSortingFeature|rowSortingFeature" node_modules/@tanstack/table-core/dist/
```

For an adapter API, start at `node_modules/@tanstack/<framework>-table/dist/index.d.ts`.

### Check feature gating before replacement

```ts
const features = tableFeatures({ rowSortingFeature })
```

If the export exists but the instance API does not, inspect `TableFeatures.ts` and the table's registry.

## Common Mistakes

### [CRITICAL] Substituting a remembered v8 API

Wrong:

```ts
const options = { getSortedRowModel: getSortedRowModel() }
```

Correct:

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})
```

V9 moved row-model factories to named feature slots and renamed `get*` factories to `create*`.

Source: `docs/framework/react/guide/migrating.md#row-model-factories`

### [HIGH] Mistaking omitted feature for removal

Wrong:

```ts
const features = tableFeatures({})
```

Correct:

```ts
const features = tableFeatures({ columnVisibilityFeature })
```

Optional APIs and state are typed and installed from the concrete feature registry.

Source: `packages/table-core/src/types/TableFeatures.ts`

### [HIGH] Discovering methods through own keys

Wrong:

```ts
const methods = Object.keys(row).filter((key) => key.startsWith('get'))
```

Correct:

```ts
const value = row.getValue('name')
const prototype = Object.getPrototypeOf(row)
```

V9 shares many instance methods through prototypes, so spread, serialization, and `Object.keys` omit them.

Source: `docs/framework/react/guide/migrating.md#instance-methods-must-be-called-on-their-instance`

## API Discovery

Use this order: installed `package.json` version, installed adapter `dist/index.d.ts`, installed core `dist/index.d.ts`, then the exported implementation or feature directory. Prefer `dist/**/*.d.ts` (Ember: `declarations/**/*.d.ts`; Angular: `dist/types/*.d.ts`).
