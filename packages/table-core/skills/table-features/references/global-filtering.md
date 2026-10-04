# Global filtering

Global filtering reuses the column-filtering pipeline.

## Setup

```ts
import {
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
})
```

## Core patterns

```ts
const options = {
  globalFilterFn: 'includesString' as const,
  getColumnCanGlobalFilter: (column) => column.id !== 'actions',
}
```

Declare eligibility when product rules differ from default primitive-value detection.

## Common mistakes

### [CRITICAL] Omitting column-filter prerequisite

Wrong: `tableFeatures({ globalFilteringFeature })`

Correct: `tableFeatures({ columnFilteringFeature, globalFilteringFeature, filteredRowModel: createFilteredRowModel() })`

Global filtering depends on column filtering and needs the filtered model for client processing.

Source: `packages/table-core/src/types/TableFeatures.ts#FeatureSlotPrereqs`

### Choose participating columns

Default eligibility checks the first core row and accepts string or number values. Define `getColumnCanGlobalFilter` when product rules differ; setting `globalFilterFn` alone does not make every column eligible. Supply a filter function compatible with every participating accessor value.

Source: `packages/table-core/src/features/global-filtering/globalFilteringFeature.ts`

### [HIGH] Keeping manual filter local only

Wrong: `table.setGlobalFilter(search); const options = { manualFiltering: true }`

Correct: `const page = await fetchRows({ search }); const options = { data: page.rows, manualFiltering: true }`

Manual filtering bypasses the client model, so the value must drive the server request.

Source: `docs/framework/react/guide/global-filtering.md#manual-server-side-global-filtering`

## API discovery

Inspect `node_modules/@tanstack/table-core/dist/features/global-filtering/` plus `dist/features/column-filtering/` for shared state and filter functions.

## Sources

- `TanStack/table:docs/framework/react/guide/global-filtering.md`
- `TanStack/table:packages/table-core/src/features/global-filtering`
- `TanStack/table:examples/react/filters`
