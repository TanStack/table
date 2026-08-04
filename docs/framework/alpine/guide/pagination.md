---
title: Pagination (Alpine) Guide
---

## Examples

Want to skip to the implementation? Check out these Alpine examples:

- [Pagination](../examples/pagination)

Read your reactive inputs such as `data` through a getter (for example backing them with `Alpine.reactive`) when creating the table, so the table sees updates.

### Pagination Setup

Here's how you set up your table to use pagination features. Adding the pagination feature enables the related APIs. Additionally, if using client-side pagination, you also need to set up `paginatedRowModel` after its associated feature because row model slots are type-checked.

```ts
import {
  createPaginatedRowModel,
  createTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/alpine-table'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(), // if using client-side pagination
})

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
})
```

## Pagination (Alpine) Guide

TanStack Table has great support for both client-side and server-side pagination. This guide will walk you through the different ways to implement pagination in your table.

### Client-Side Pagination

Using client-side pagination means that the `data` that you fetch will contain **_ALL_** of the rows for the table, and the table instance will handle pagination logic in the front-end.

#### Should You Use Client-Side Pagination?

Client-side pagination is usually the simplest option when the browser can fetch and retain the complete dataset. Use server-side pagination when the full dataset would be too expensive to query, transfer, or store in the browser.

Row count alone does not decide the boundary. See the [Client-Side vs Server-Side Guide](../../../guide/client-side-vs-server-side) for the full decision framework, performance factors, and guidance for keeping filtering and sorting consistent with pagination.

#### Pagination Row Model

If you want to take advantage of the built-in client-side pagination in TanStack Table, add the `rowPaginationFeature` and the `paginatedRowModel` factory to your features:

```ts
import {
  createPaginatedRowModel,
  createTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/alpine-table'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
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
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/alpine-table'

const features = tableFeatures({ rowPaginationFeature })

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
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

In Alpine, the table's state atoms are reactive. `table.atoms.pagination.get()` is a reactive read when used inside an Alpine binding (`x-text`, `x-html`, `:value`, `x-if`, `x-for`, `x-effect`, or a getter/method on your `Alpine.data` object); in event handlers and other untracked code, the same call simply returns the current value.

If you need access to the `pagination` state outside of the table (a server-side query key is the most common case), you can own the slice yourself. The recommended way in v9 is an external atom passed through the `atoms` table option. `@tanstack/store` is already a dependency of `@tanstack/alpine-table`, so `createAtom` is available. The pagination value can be used in a query key without making the table depend on component-local state.

```ts
import { createAtom } from '@tanstack/store'
import {
  createTable,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/alpine-table'

const features = tableFeatures({ rowPaginationFeature })

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0, // initial page index
  pageSize: 10, // default page size
})

// subscribe to the atom wherever you need the value (e.g. for a query key)
paginationAtom.subscribe(() => {
  // react to pagination changes
})

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
  atoms: {
    pagination: paginationAtom, // table pagination APIs now update paginationAtom
  },
})
```

Alternatively, the v8-style `state.pagination` plus `onPaginationChange` pattern is still supported by owning the slice in `Alpine.reactive`. It can be convenient for simple integrations or when migrating v8 code. See the [Table State Guide](./table-state) for a deeper comparison.

```ts
const local = Alpine.reactive({
  pagination: {
    pageIndex: 0, // initial page index
    pageSize: 10, // default page size
  } as PaginationState,
})

const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
  state: {
    get pagination() {
      return local.pagination // connect the reactive slice back down to the table
    },
  },
  onPaginationChange: (updater) => {
    local.pagination =
      typeof updater === 'function' ? updater(local.pagination) : updater
  },
})
```

Alternatively, if you have no need for managing the `pagination` state in your own scope, but you need to set different initial values for the `pageIndex` and `pageSize`, you can use the `initialState` option.

```ts
const table = createTable({
  features,
  columns,
  get data() {
    return local.data
  },
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
  get data() {
    return local.data
  },
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

Pagination controls live on real elements so the click handlers and `:disabled` bindings stay interactive. Read the page index and page size with `table.atoms.pagination.get()`.

```html
<button @click="table.firstPage()" :disabled="!table.getCanPreviousPage()">
  &lt;&lt;
</button>
<button @click="table.previousPage()" :disabled="!table.getCanPreviousPage()">
  &lt;
</button>
<button @click="table.nextPage()" :disabled="!table.getCanNextPage()">
  &gt;
</button>
<button @click="table.lastPage()" :disabled="!table.getCanNextPage()">
  &gt;&gt;
</button>
<span>
  Page
  <strong>
    <span x-text="table.atoms.pagination.get().pageIndex + 1"></span>
    of
    <span x-text="table.getPageCount()"></span>
  </strong>
</span>
<select
  :value="table.atoms.pagination.get().pageSize"
  @change="table.setPageSize(Number($event.target.value))"
>
  <template x-for="pageSize in [10, 20, 30, 40, 50]" :key="pageSize">
    <option :value="pageSize" x-text="'Show ' + pageSize"></option>
  </template>
</select>
```

#### Pagination Info APIs

- `getPageCount`: Useful for showing the total number of pages.
- `getRowCount`: Useful for showing the total number of rows.
