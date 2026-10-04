# Column filtering

Filtering state, row processing, and filter UI are separate concerns.

## Setup

```ts
import {
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_includesString,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
})
```

Import individual `filterFn_*` built-ins and register only those your columns
reference by string name or that `filterFn: 'auto'` should resolve for your
data types. The full `filterFns` registry object still works but bundles every
built-in.

## Core patterns

```ts
const options = {
  filterFromLeafRows: true,
  maxLeafRowFilterDepth: 2,
}
```

Use leaf-first filtering only when a parent should survive because a descendant matches.

## Common mistakes

### Choose who processes filter state

With client processing, register `filteredRowModel` and leave `manualFiltering` false. With server processing, use `manualFiltering: true`, send filter state to the server, and supply the filtered response. Manual mode returns the pre-filtered model even if a client factory is registered.

Read [client/server ownership](client-vs-server.md) when filtering shares a pipeline with server pagination or another server-owned stage. For controlled callbacks, read [shared state](../../table-state/SKILL.md) and the installed adapter state skill.

Source: `packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts`

### [HIGH] Filtering renderer output

Wrong: `helper.accessor(row => ({ label: row.status }), { filterFn: 'includesString' })`

Correct: `helper.accessor('status', { filterFn: 'includesString' })`

Built-in string and numeric filters expect comparable accessor values, not objects or UI nodes.

Source: `docs/framework/react/guide/column-filtering.md#filterfns`

### [HIGH] Ignoring updater-function callbacks

Wrong: `onColumnFiltersChange: value => { columnFilters = value as ColumnFiltersState }`

Correct: `onColumnFiltersChange: updater => { columnFilters = functionalUpdate(updater, columnFilters) }`

Controlled callbacks receive either a value or a function of previous state.

Source: `packages/table-core/src/features/column-filtering/columnFilteringFeature.types.ts`

## API discovery

Inspect `node_modules/@tanstack/table-core/dist/features/column-filtering/` and `dist/features/column-filtering/filterFns.d.ts` for exact signatures and auto-remove behavior.

## Sources

- `TanStack/table:docs/framework/react/guide/column-filtering.md`
- `TanStack/table:packages/table-core/src/features/column-filtering`
- `TanStack/table:examples/react/filters`
