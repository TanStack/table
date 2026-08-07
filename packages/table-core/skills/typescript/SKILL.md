---
name: typescript
description: >
  Preserve TanStack Table v9 inference with createColumnHelper, columns(), tableOptions, tableFeatures, and metaHelper. Load for ColumnDef errors, reusable tables, typed meta, named registries, or unnecessary manual feature generics.
metadata:
  type: sub-skill
  library: '@tanstack/table-core'
  library_version: '9.1.0'
requires: ['core', 'table-features']
sources:
  - 'TanStack/table:docs/guide/helpers.md'
  - 'TanStack/table:docs/guide/column-defs.md'
  - 'TanStack/table:docs/guide/table-and-column-meta.md'
  - 'TanStack/table:packages/table-core/src/helpers'
---

This skill builds on `core` and `table-features`. Let the feature object and helpers carry types through userland.

## Setup

```ts
import {
  createColumnHelper,
  metaHelper,
  tableFeatures,
} from '@tanstack/table-core'

type Person = { id: string; age: number }
type ColumnMeta = { align?: 'start' | 'end' }
const features = tableFeatures({ columnMeta: metaHelper<ColumnMeta>() })
const helper = createColumnHelper<typeof features, Person>()
export const columns = helper.columns([
  helper.accessor('age', { meta: { align: 'end' } }),
])
```

## Core Patterns

### Preserve heterogeneous accessor values

```ts
const columns = helper.columns([
  helper.accessor('id', { header: 'ID' }),
  helper.accessor('age', { header: 'Age' }),
])
```

`columns()` preserves each accessor's `TValue` instead of widening the array.

### Compose options through the helper

```ts
const defaults = tableOptions<typeof features, Person>({
  defaultColumn: { meta: { align: 'start' } },
})
```

Use `tableOptions` for reusable fragments; direct adapter options are enough for one-offs.

## Common Mistakes

### [HIGH] Erasing accessor value inference

Wrong:

```ts
const columns: ColumnDef<typeof features, Person, unknown>[] = [
  helper.accessor('age', {}),
]
```

Correct:

```ts
const columns = helper.columns([helper.accessor('age', {})])
```

The broad annotation discards the accessor-specific `number` value type.

Source: `docs/guide/helpers.md#createcolumnhelper`

### [MEDIUM] Threading internal feature generics manually

Wrong:

```ts
type Features = TableFeatures
```

Correct:

```ts
type Features = typeof features
```

The concrete registry is the source of feature-gated APIs and registry keys.

Source: `packages/table-core/src/types/TableFeatures.ts`

### [MEDIUM] Globally merging per-table meta

Wrong:

```ts
declare module '@tanstack/table-core' {
  interface ColumnMeta<TData, TValue> {
    align?: string
  }
}
```

Correct:

```ts
const features = tableFeatures({
  columnMeta: metaHelper<{ align?: 'start' | 'end' }>(),
})
```

V9 type-only feature slots keep meta types scoped to the table factory.

Source: `docs/guide/table-and-column-meta.md`

## API Discovery

Inspect `node_modules/@tanstack/table-core/dist/helpers/` and the signatures re-exported by `dist/index.d.ts`; avoid copying deep internal generic signatures into application code.
