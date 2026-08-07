---
name: table-features
description: >
  Register TanStack Table v9 tableFeatures, feature plugins, create*RowModel factories, and function registries in prerequisite order. Load when an option, state slice, or instance API is missing, or when choosing explicit features versus stockFeatures.
metadata:
  type: sub-skill
  library: '@tanstack/table-core'
  library_version: '9.1.0'
requires: ['core']
sources:
  - 'TanStack/table:docs/guide/row-models.md'
  - 'TanStack/table:packages/table-core/src/types/TableFeatures.ts'
  - 'TanStack/table:packages/table-core/src/features/stockFeatures.ts'
  - 'TanStack/table:packages/table-core/src/core/table/constructTable.ts'
---

This skill builds on `core`. Read it first for the headless model and stable inputs.

## Setup

<!-- skill-snippet:check -->

```ts
import {
  rowAggregationFeature,
  aggregationFn_sum,
  columnGroupingFeature,
  createFilteredRowModel,
  createSortedRowModel,
  columnFilteringFeature,
  filterFn_includesString,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
  rowAggregationFeature,
  columnGroupingFeature,
  aggregationFns: { sum: aggregationFn_sum },
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
})
```

## Core Patterns

### Register feature before its dependent slot

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})
```

`tableFeatures` checks slot prerequisites and its inferred type gates APIs throughout the table.

### Register named function slots with their features

```ts
const features = tableFeatures({
  columnFilteringFeature,
  filterFns: { includesString: filterFn_includesString },
  rowSortingFeature,
  sortFns: { alphanumeric: sortFn_alphanumeric },
  rowAggregationFeature,
  columnGroupingFeature,
  aggregationFns: { sum: aggregationFn_sum },
})
```

`filterFns`, `sortFns`, and `aggregationFns` are feature slots, not table
options. They respectively require `columnFilteringFeature`,
`rowSortingFeature`, and `rowAggregationFeature`. Import individual built-ins
(`filterFn_*`, `sortFn_*`, `aggregationFn_*`) and register them under their
conventional keys; the full registry objects (`filterFns`, `sortFns`,
`aggregationFns` exports) still work but bundle every built-in. A registered
key can be used as a typed string name, and `'auto'` resolves only registered
functions; pass a function directly when no registry name is needed.

### Prefer explicit features

```ts
const features = tableFeatures({ columnFilteringFeature })
```

Use `stockFeatures` only for deliberate kitchen-sink or temporary migration behavior.

## Common Mistakes

### [CRITICAL] Calling an unregistered feature API

Wrong:

```ts
const features = tableFeatures({})
table.setSorting([{ id: 'name', desc: false }])
```

Correct:

```ts
const features = tableFeatures({ rowSortingFeature })
```

Optional feature state and APIs are installed only when their feature is registered.

Source: `packages/table-core/src/core/table/constructTable.ts`

### [HIGH] Omitting a slot prerequisite

Wrong:

```ts
const features = tableFeatures({ sortedRowModel: createSortedRowModel() })
```

Correct:

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})
```

The sorted model slot requires `rowSortingFeature`; the same rule applies to every mapped slot.

Source: `packages/table-core/src/types/TableFeatures.ts#FeatureSlotPrereqs`

### [MEDIUM] Shipping all features by default

Wrong:

```ts
const features = stockFeatures
```

Correct:

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})
```

`stockFeatures` registers every stock plugin and processing slot, defeating v9's normal tree-shaking strategy.

Source: `packages/table-core/src/features/stockFeatures.ts`

## API Discovery

Inspect `node_modules/@tanstack/table-core/dist/types/TableFeatures.d.ts` for current slots and `FeatureSlotPrereqs`, and `dist/features/stockFeatures.d.ts` for the stock inventory.
