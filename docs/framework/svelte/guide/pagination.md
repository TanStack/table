---
title: Pagination (Svelte) Guide
---

## Examples

Want to skip to the implementation? Check out these Svelte examples:

- [Pagination](../examples/pagination)

Use getters for reactive inputs such as `data` when passing Svelte state to `createTable`.

### Svelte Setup

```ts
import { createTable, tableFeatures, rowPaginationFeature, createPaginatedRowModel } from '@tanstack/svelte-table'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
})
```

## Pagination (Svelte) Guide

TanStack Table has great support for both client-side and server-side pagination. This guide will walk you through the different ways to implement pagination in your table.

### Client-Side Pagination

Using client-side pagination means that the `data` that you fetch will contain ***ALL*** of the rows for the table, and the table instance will handle pagination logic in the front-end.

#### Should You Use Client-Side Pagination?

Client-side pagination is usually the simplest way to implement pagination when using TanStack Table, but it might not be practical for very large datasets.

However, a lot of people underestimate just how much data can be handled client-side. If your table will only ever have a few thousand rows or less, client-side pagination can still be a viable option. TanStack Table is designed to scale up to 10s of thousands of rows with decent performance for pagination, filtering, sorting, and grouping. The [official pagination example](../examples/pagination) loads 1,000 rows by default and includes a 200,000 row stress-test button that still performs well, albeit with only a handful of columns.

Every use-case is different and will depend on the complexity of the table, how many columns you have, how large every piece of data is, etc. The main bottlenecks to pay attention to are:

1. Can your server query all of the data in a reasonable amount of time (and cost)?
2. What is the total size of the fetch? (This might not scale as badly as you think if you don't have many columns.)
3. Is the client's browser using too much memory if all of the data is loaded at once?

If you're not sure, you can always start with client-side pagination and then switch to server-side pagination in the future as your data grows.

#### Should You Use Virtualization Instead?

Alternatively, instead of paginating the data, you can render all rows of a large dataset on the same page, but only use the browser's resources to render the rows that are visible in the viewport. This strategy is often called "virtualization" or "windowing". TanStack offers a virtualization library called [TanStack Virtual](https://tanstack.com/virtual/latest) that can work well with TanStack Table. The UI/UX of both virtualization and pagination have their own trade-offs, so see which one works best for your use-case.

#### Pagination Row Model

If you want to take advantage of the built-in client-side pagination in TanStack Table, add the `rowPaginationFeature` to your features and the `paginatedRowModel` to your row models:

```ts
import {
  createTable,
  tableFeatures,
  rowPaginationFeature,
  createPaginatedRowModel,
} from '@tanstack/svelte-table'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

const table = createTable({
  features,
  columns,
  data,
})
```

### Manual Server-Side Pagination

If you decide that you need to use server-side pagination, here is how you can implement it.

No pagination row model is needed for server-side pagination, but if you have provided it for other tables that do need it in a shared component, you can still turn off the client-side pagination by setting the `manualPagination` option to `true`. Setting the `manualPagination` option to `true` will tell the table instance to use the `table.getPrePaginatedRowModel` row model under the hood, and it will make the table instance assume that the `data` that you pass in is already paginated.

#### Page Count and Row Count

The table instance will have no way of knowing how many rows/pages there are in total in your back-end unless you tell it. Provide either the `rowCount` or `pageCount` table option to let the table instance know how many pages there are in total. If you provide a `rowCount`, the table instance will calculate the `pageCount` internally from `rowCount` and `pageSize`. Otherwise, you can directly provide the `pageCount` if you already have it. If you don't know the page count, you can just pass in `-1` for the `pageCount`, but the `getCanNextPage` and `getCanPreviousPage` row model functions will always return `true` in this case.

```ts
import {
  createTable,
  tableFeatures,
  rowPaginationFeature,
} from '@tanstack/svelte-table'

const features = tableFeatures({ rowPaginationFeature })

const table = createTable({
  features,
  columns,
  data,
  manualPagination: true, // turn off client-side pagination
  rowCount: dataQuery.data?.rowCount, // pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
  // pageCount: dataQuery.data?.pageCount, // alternatively directly pass in pageCount instead of rowCount
})
```

> **Note**: Setting the `manualPagination` option to `true` will make the table instance assume that the `data` that you pass in is already paginated.

### Pagination State

Whether or not you are using client-side or manual server-side pagination, you can use the built-in `pagination` state and APIs.

The `pagination` state is an object that contains the following properties:

- `pageIndex`: The current page index (zero-based).
- `pageSize`: The current page size.

For reactive reads that should update your UI, use `table.state.pagination` (selected by the `createTable` selector). In event handlers, you can read the current snapshot with `table.atoms.pagination.get()`, but this read only participates in Svelte dependency tracking when called in a rune-tracked context.

If you need access to the `pagination` state outside of the table (a server-side query key is the most common case), you can own the slice yourself. The recommended way in v9 is an external atom passed through the `atoms` table option. Atoms preserve fine-grained subscriptions, and the pagination value can be used elsewhere (such as in a query key) without coupling that code to the table instance.

```ts
import { createAtom, useSelector } from '@tanstack/svelte-store'
import {
  createTable,
  tableFeatures,
  rowPaginationFeature,
  createPaginatedRowModel,
} from '@tanstack/svelte-table'
import type { PaginationState } from '@tanstack/svelte-table'

const features = tableFeatures({ rowPaginationFeature })

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0, // initial page index
  pageSize: 10, // default page size
})

// subscribe to the atom wherever you need the value (e.g. for a query key)
const pagination = useSelector(paginationAtom) // read it reactively with pagination.current

const table = createTable({
  features,

  columns,
  get data() {
    return data
  },
  atoms: {
    pagination: paginationAtom, // table pagination APIs now update paginationAtom
  },
})
```

Alternatively, the v8-style `state.pagination` plus `onPaginationChange` pattern is still supported. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
import { createTableState } from '@tanstack/svelte-table'

const [pagination, setPagination] = createTableState<PaginationState>({
  pageIndex: 0, // initial page index
  pageSize: 10, // default page size
})

const table = createTable({
  features,

  columns,
  get data() {
    return data
  },
  onPaginationChange: setPagination,
  state: {
    get pagination() {
      return pagination()
    },
  },
})
```

Alternatively, if you have no need for managing the `pagination` state in your own scope, but you need to set different initial values for the `pageIndex` and `pageSize`, you can use the `initialState` option.

```ts
const table = createTable({
  features,

  columns,
  data,
  initialState: {
    pagination: {
      pageIndex: 2, // custom initial page index
      pageSize: 25, // custom default page size
    },
  },
})
```

> **Note**: Do NOT provide the `pagination` slice in more than one of the `atoms`, `state`, and `initialState` options. Controlled values (`atoms` or `state`) will overwrite `initialState`. Only use one of them.

### Pagination Options

Besides the `manualPagination`, `pageCount`, and `rowCount` options which are useful for manual server-side pagination (and discussed [above](#manual-server-side-pagination)), there is one other table option that is useful to understand.

#### Auto Reset Page Index

By default, `pageIndex` is reset to `0` whenever the client-side row models recompute, such as when the `data` is updated, filters change, sorting changes, or grouping changes. This behavior is automatically disabled when `manualPagination` is `true`, but it can be overridden by explicitly assigning a boolean value to the `autoResetPageIndex` table option. There is also a global `autoResetAll` table option that disables (or enables) every auto-reset behavior at once.

```ts
const table = createTable({
  features,

  columns,
  data,
  autoResetPageIndex: false, // turn off auto reset of pageIndex
  // autoResetAll: false, // or turn off all auto resets at once
})
```

A common reason to set `autoResetPageIndex: false` is editing data while viewing the table (for example, inline cell editing). Every edit updates `data`, which recomputes the row models and would otherwise snap the user back to the first page. Setting the option to a static `false` keeps the current page when the row model recomputes. If you also use the expanding feature, pair it with `autoResetExpanded: false` so expanded rows do not collapse on edits.

Be aware, however, that if you turn off `autoResetPageIndex`, you may need to add some logic to handle resetting the `pageIndex` yourself to avoid showing empty pages.

### Pagination APIs

There are several pagination table instance APIs that are useful for hooking up your pagination UI components.

#### Pagination Button APIs

- `getCanPreviousPage`: Useful for disabling the "previous page" button when on the first page.
- `getCanNextPage`: Useful for disabling the "next page" button when there are no more pages.
- `previousPage`: Useful for going to the previous page. (Button click handler)
- `nextPage`: Useful for going to the next page. (Button click handler)
- `firstPage`: Useful for going to the first page. (Button click handler)
- `lastPage`: Useful for going to the last page. (Button click handler)
- `setPageIndex`: Useful for a "go to page" input.
- `resetPageIndex`: Useful for resetting the table state to the original page index.
- `setPageSize`: Useful for a "page size" input/select.
- `resetPageSize`: Useful for resetting the table state to the original page size.
- `setPagination`: Useful for setting all of the pagination state at once.
- `resetPagination`: Useful for resetting the table state to the original pagination state.

> **Note**: These pagination APIs are available when using `rowPaginationFeature`.

```svelte
<button onclick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>{'<<'}</button>
<button onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{'<'}</button>
<button onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{'>'}</button>
<button onclick={() => table.lastPage()} disabled={!table.getCanNextPage()}>{'>>'}</button>
<select
  value={table.state.pagination.pageSize}
  onchange={(e) => table.setPageSize(Number((e.target as HTMLSelectElement).value))}
>
  {#each [10, 20, 30, 40, 50] as pageSize}
    <option value={pageSize}>Show {pageSize}</option>
  {/each}
</select>
```

#### Pagination Info APIs

- `getPageCount`: Useful for showing the total number of pages.
- `getRowCount`: Useful for showing the total number of rows.
