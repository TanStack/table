---
name: client-vs-server
description: >
  Choose client or server ownership for filtering, grouping, sorting, expanding, and pagination in TanStack Table v9. Load for manual* flags, mixed pipelines, server counts, or deciding which dataset each row-model stage receives.
metadata:
  type: sub-skill
  library: '@tanstack/table-core'
  library_version: '9.0.0-beta.52'
requires: ['core', 'table-features']
sources:
  - 'TanStack/table:docs/guide/row-models.md'
  - 'TanStack/table:packages/table-core/src/core/row-models/coreRowModelsFeature.utils.ts'
  - 'TanStack/table:examples/react/with-tanstack-query'
---

This skill builds on `core` and `table-features`. Read them first for the model pipeline and plugin slots.

## Setup

```ts
import {
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
})
export const serverOptions = {
  manualSorting: true,
  manualPagination: true,
  rowCount: 12_450,
} as const
```

## Core Patterns

### Client owns the complete pipeline

```ts
const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})
```

Pass the full client dataset so each stage can process all rows.

### Server owns processing

```ts
const options = {
  data: serverPage.rows,
  manualFiltering: true,
  manualSorting: true,
  manualPagination: true,
  rowCount: serverPage.total,
}
```

Put controlled filter, sorting, and pagination state into the request/query key.

## Common Mistakes

### [CRITICAL] Treating manual flags as requests

Wrong:

```ts
const options = { manualSorting: true, data: unsortedRows }
```

Correct:

```ts
const sortedPage = await fetchPage({ sorting })
const options = { manualSorting: true, data: sortedPage.rows }
```

`manualSorting` only bypasses client sorting; it never calls a backend.

Source: `packages/table-core/src/features/row-sorting/rowSortingFeature.types.ts`

### [HIGH] Expecting manual pagination to slice

Wrong:

```ts
const options = { data: allRows, manualPagination: true }
```

Correct:

```ts
const page = await fetchPage({ pageIndex, pageSize })
const options = {
  data: page.rows,
  manualPagination: true,
  rowCount: page.rowCount,
}
```

Manual pagination assumes `data` already represents the intended page. Pass the stable page result directly. If the application deliberately performs custom local slicing instead, derive it with the framework's memo/computed primitive and keep the reference stable until its actual inputs change.

Source: `docs/framework/react/guide/pagination.md#manual-server-side-pagination`

### [HIGH] Sorting only the loaded page accidentally

Wrong:

```ts
const options = {
  data: serverPage.rows,
  manualPagination: true,
  manualSorting: false,
}
```

Correct:

```ts
const options = {
  data: serverPage.rows,
  manualPagination: true,
  manualSorting: true,
}
```

Client sorting can see only loaded rows, so it cannot produce database-wide order.

Source: `docs/guide/row-models.md`

### [HIGH] Recreating processed data or columns inline

Wrong:

```ts
const options = {
  data: allRows.filter(matchesFilters).slice(pageStart, pageEnd),
  columns: makeColumns(),
}
```

Correct:

```ts
const processedRows = pageResult.rows
const columns = sharedColumns
const options = { data: processedRows, columns }
```

`data` and `columns` are model inputs. Keep both references stable between meaningful changes with module constants, state, or the adapter's memo/computed primitive; otherwise Table repeatedly invalidates row and column models and some adapters can enter render loops. “Manual” describes processing ownership, not permission to derive new arrays inside table options.

Source: `docs/guide/data.md`

## API Discovery

Inspect `node_modules/@tanstack/table-core/dist/core/row-models/coreRowModelsFeature.utils.d.ts` for pipeline order and each feature's `.types.d.ts` for its `manual*` contract.
