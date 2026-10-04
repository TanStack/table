# Pagination

Choose client slicing or server pages, never both accidentally.

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

## Core patterns

```ts
const serverOptions = { manualPagination: true, rowCount: response.total }
```

Pass one already-processed page and either `rowCount` or `pageCount`.

## Common mistakes

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

### Choose the page reset policy

Client data and processing changes may reset `pageIndex` to zero. This is separate from whether pagination is controlled. Set `autoResetPageIndex: false` when the product must retain the index, and handle an index that no longer has rows after filtering or deletion.

Read [client/server ownership](client-vs-server.md) when changing server pagination or mixing server pages with client processing.

Source: `docs/framework/react/guide/pagination.md#auto-reset-page-index`

## API discovery

Inspect `node_modules/@tanstack/table-core/dist/features/row-pagination/` for reset rules, count calculation, and navigation APIs.

## Sources

- `TanStack/table:docs/framework/react/guide/pagination.md`
- `TanStack/table:packages/table-core/src/features/row-pagination`
- `TanStack/table:examples/react/pagination`
