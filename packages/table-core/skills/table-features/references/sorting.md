# Sorting

Sorting state describes order; client processing requires a sorted model and server processing requires sorted input.

## Setup

```ts
import {
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})
```

Import individual `sortFn_*` built-ins and register only those your columns
reference by string name or that `sortFn: 'auto'` should resolve for your data
types. The full `sortFns` registry object still works but bundles every
built-in; numeric columns fall back to a basic comparator without registration.

## Core patterns

```ts
const options = { enableSortingRemoval: false, enableMultiSort: true }
const numericColumn = { sortUndefined: 'last' as const }
```

Configure sort cycles and undefined placement to match the product rather than relying on implicit defaults.

## Common mistakes

### [CRITICAL] Expecting manual mode to reorder

Wrong: `const options = { data: unsortedRows, manualSorting: true }`

Correct: `const options = { data: serverSortedRows, manualSorting: true }`

Manual sorting bypasses `sortedRowModel` and trusts incoming order.

Source: `packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts`

### [HIGH] Reversing inside the comparator

Wrong: `const newest: SortFn<any, any> = (a, b, id) => b.getValue<number>(id) - a.getValue<number>(id)`

Correct: `const numeric: SortFn<any, any> = (a, b, id) => a.getValue<number>(id) - b.getValue<number>(id)`

Return ascending comparison only; Table reverses it when sorting is descending.

Source: `docs/framework/react/guide/sorting.md#custom-sorting-functions`

### Choose sorting interaction policy

Configure `sortUndefined` on columns and `enableSortingRemoval`, `enableMultiSort`, and multi-sort event options to match the product. Removal-enabled and removal-disabled cycles are both supported. A rank column can use `sortUndefined: 'last'`; a table requiring an always-active sort can use `enableSortingRemoval: false`.

Read [client/server ownership](client-vs-server.md) when the requested sorting must apply beyond loaded rows or combines with a server-owned stage.

Source: `packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts`

## API discovery

Inspect `node_modules/@tanstack/table-core/dist/features/row-sorting/` and `dist/features/row-sorting/sortFns.d.ts` for current names and comparator contracts.

## Sources

- `TanStack/table:docs/framework/react/guide/sorting.md`
- `TanStack/table:packages/table-core/src/features/row-sorting`
- `TanStack/table:examples/react/sorting`
