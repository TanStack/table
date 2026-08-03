---
name: pagination
description: >
  Paginate with rowPaginationFeature and paginatedRowModel or manualPagination. Load for pageIndex/pageSize state, rowCount/pageCount, unknown next-page limits, already-paginated server data, or autoResetPageIndex surprises.
metadata:
  {
    type: sub-skill,
    library: '@tanstack/table-core',
    library_version: '9.0.0-beta.77',
  }
requires: ['core', 'table-features', 'client-vs-server']
sources:
  - 'TanStack/table:docs/framework/react/guide/pagination.md'
  - 'TanStack/table:packages/table-core/src/features/row-pagination'
  - 'TanStack/table:examples/react/pagination'
---

This skill builds on `core`, `table-features`, and `client-vs-server`. Choose client slicing or server pages, never both accidentally.

## Setup

```ts
import {
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/table-core'

export const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})
export const initialState = { pagination: { pageIndex: 0, pageSize: 25 } }
```

## Core Patterns

```ts
const serverOptions = { manualPagination: true, rowCount: response.total }
```

Pass one already-processed page and either `rowCount` or `pageCount`.

## Common Mistakes

### [CRITICAL] Expecting manual mode to slice

Wrong: `const options = { data: allRows, manualPagination: true }`

Correct: `const options = { data: requestedPageRows, manualPagination: true, rowCount: totalRows }`

Manual pagination trusts the provided data as the current page.

Source: `https://github.com/TanStack/table/issues/4917`

### [HIGH] Omitting the server total

Wrong: `const options = { data: pageRows, manualPagination: true }`

Correct: `const options = { data: pageRows, manualPagination: true, rowCount: 1234 }`

Without a count, last-page and next-page availability cannot reflect the server dataset.

Source: `packages/table-core/src/features/row-pagination/rowPaginationFeature.types.ts`

### [HIGH] Fighting automatic page resets

Wrong: `onPaginationChange: setPagination`

Correct: `const options = { onPaginationChange: setPagination, autoResetPageIndex: false }`

Client data and processing changes may reset page index; configure the policy when product state must retain it.

Source: `docs/framework/react/guide/pagination.md#auto-reset-page-index`

## API Discovery

Inspect `node_modules/@tanstack/table-core/dist/features/row-pagination/` for reset rules, count calculation, and navigation APIs.
