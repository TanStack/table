# Diagnose a missing API

Use the installed package version and declarations as exact API truth.

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

## Core patterns

### Trace an export to its declaration

```sh
rg "export .*rowSortingFeature|rowSortingFeature" node_modules/@tanstack/table-core/dist/
```

For an adapter API, start at `node_modules/@tanstack/<framework>-table/dist/index.d.ts`.

### Check feature gating before replacement

```ts
const features = tableFeatures({ rowSortingFeature })
```

If the export exists but the instance API does not, inspect `dist/types/TableFeatures.d.ts` and the table's registry.

## Common mistakes

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

## API discovery

Use this order: installed `package.json` version, installed adapter `dist/index.d.ts`, installed core `dist/index.d.ts`, then the exported declaration or feature directory. Prefer `dist/**/*.d.ts`. Ember publishes `declarations/**/*.d.ts`; Angular publishes `dist/types/*.d.ts`. Octane intentionally publishes `src/index.d.ts`, `src/*.tsrx.d.ts`, and `src/types.ts`. Resolve the installed package root first when package-manager layout differs.

## Sources

- `TanStack/table:packages/table-core/src/index.ts`
- `TanStack/table:packages/table-core/src/types/TableFeatures.ts`
- `TanStack/table:docs/framework/react/guide/migrating.md`
