---
title: Pagination (Solid) Guide
---

## Examples

Want to skip to the implementation? Check out these Solid examples:

- [Pagination](../examples/pagination)

Use getters for reactive inputs such as `data` when passing Solid signals to `createTable`.

### Pagination Setup

Here's how you set up your table to use pagination features. Adding the pagination feature enables the related APIs. Additionally, if using client-side pagination, you also need to set up `paginatedRowModel` after its associated feature because row model slots are type-checked.

```tsx
import {
  createTable,
  tableFeatures,
  rowPaginationFeature,
  createPaginatedRowModel,
} from '@tanstack/solid-table'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(), // if using client-side pagination
  // manualPagination: true, // if using manual server-side pagination
})

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
```

## Pagination (Solid) Guide

TanStack Table has great support for both client-side and server-side pagination. This guide will walk you through the different ways to implement pagination in your table.

### Client-Side Pagination

Using client-side pagination means that the `data` that you fetch will contain **_ALL_** of the rows for the table, and the table instance will handle pagination logic in the front-end.

#### Should You Use Client-Side Pagination?

Client-side pagination is usually the simplest option when the browser can fetch and retain the complete dataset. Use server-side pagination when the full dataset would be too expensive to query, transfer, or store in the browser.

Row count alone does not decide the boundary. See the [Client-Side vs Server-Side Guide](../../../guide/client-side-vs-server-side) for the full decision framework, performance factors, and guidance for keeping filtering and sorting consistent with pagination.

#### Should You Use Virtualization Instead?

Virtualization (or windowing) reduces rendering work by mounting only the visible rows, but the virtualized data still exists in the browser. It can complement client-side or server-side pagination, but it does not replace server-side processing when the complete dataset is too large to load.

See the [Client-Side vs Server-Side Guide](../../../guide/client-side-vs-server-side#rendering-is-a-separate-decision) for that distinction, or [TanStack Virtual](https://tanstack.com/virtual/latest) for virtualization APIs.

#### Pagination Row Model

If you want to take advantage of the built-in client-side pagination in TanStack Table, add the `rowPaginationFeature` and the `paginatedRowModel` factory to your features:

```tsx
import {
  createTable,
  tableFeatures,
  rowPaginationFeature,
  createPaginatedRowModel,
} from '@tanstack/solid-table'

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

The table instance will have no way of knowing how many rows/pages there are in total in your back-end unless you tell it. Provide either the `rowCount` or `pageCount` table option to let the table instance know how many pages there are in total. If you provide a `rowCount`, the table instance will calculate the `pageCount` internally from `rowCount` and `pageSize`. Otherwise, you can directly provide the `pageCount` if you already have it. If you don't know the page count, pass `-1` for `pageCount`. In that case, `getCanNextPage()` returns `true` because the table cannot detect the end, `getCanPreviousPage()` depends on the current `pageIndex`, and `getCanLastPage()` returns `false` because no finite last page is known.

```tsx
import {
  createTable,
  tableFeatures,
  rowPaginationFeature,
} from '@tanstack/solid-table'

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

> [!NOTE]
> Setting the `manualPagination` option to `true` will make the table instance assume that the `data` that you pass in is already paginated.

#### Using TanStack Query

TanStack Query can own the request lifecycle while TanStack Table owns the controlled pagination state. See the complete [With TanStack Query example](../examples/with-tanstack-query), which includes both patterns below.

##### Page-Index Pagination with `useQuery`

Include the pagination state in the query key, return the requested rows plus a total `rowCount`, and pass both to the table:

```tsx
const dataQuery = useQuery(() => ({
  queryKey: ['people', 'offset', pagination(), sorting(), globalFilter()],
  queryFn: () =>
    fetchPeople({
      pagination: pagination(),
      sorting: sorting(),
      globalFilter: globalFilter(),
    }),
  placeholderData: keepPreviousData,
}))

const table = createTable({
  features,
  columns,
  get data() {
    return dataQuery.data?.rows ?? []
  },
  get rowCount() {
    return dataQuery.data?.rowCount
  },
  state: {
    get pagination() {
      return pagination()
    },
  },
  onPaginationChange: setPagination,
  manualPagination: true,
})
```

This supports page counts, page-number navigation, and `lastPage()` because the total row count is known.

##### Cursor-Based Pagination with `useInfiniteQuery`

For a cursor API, return the current rows, a `nextCursor`, and `hasNextPage`. The cursor can be the last row ID when IDs are unique and the server's ordering is stable:

```tsx
const dataQuery = useInfiniteQuery(() => ({
  queryKey: [
    'people',
    'cursor',
    pagination().pageSize,
    sorting(),
    globalFilter(),
  ],
  queryFn: ({ pageParam }) =>
    fetchPeople({
      cursor: pageParam,
      pageSize: pagination().pageSize,
      sorting: sorting(),
      globalFilter: globalFilter(),
    }),
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
}))

const currentPage = () => dataQuery.data?.pages[pagination().pageIndex]
const canNextPage = () =>
  Boolean(dataQuery.data?.pages[pagination().pageIndex + 1]) ||
  Boolean(currentPage()?.hasNextPage)

const table = createTable({
  features,
  columns,
  get data() {
    return currentPage()?.rows ?? []
  },
  pageCount: -1,
  state: {
    get pagination() {
      return pagination()
    },
  },
  onPaginationChange: setPagination,
  manualPagination: true,
})

async function goToNextPage() {
  const nextPageIndex = pagination().pageIndex + 1

  if (!dataQuery.data?.pages[nextPageIndex]) {
    const result = await dataQuery.fetchNextPage()
    if (!result.data?.pages[nextPageIndex]) return
  }

  table.nextPage()
}
```

Use `canNextPage()` for the Next button because `getCanNextPage()` cannot know when an unknown page count has reached the end. Cached pages support backward navigation. Since no finite last page is known, `getCanLastPage()` returns `false`. Reset `pageIndex` to `0` whenever sorting, filtering, or page size changes.

### Pagination State

Whether or not you are using client-side or manual server-side pagination, you can use the built-in `pagination` state and APIs.

The `pagination` state is an object that contains the following properties:

- `pageIndex`: The current page index (zero-based).
- `pageSize`: The current page size.

In Solid, the table's state atoms are backed by Solid signals, so `table.atoms.pagination.get()` is a reactive read when called inside a tracked scope (JSX, `createMemo`, `createEffect`, or `table.Subscribe`). In event handlers, the same call simply returns the current value.

If you need access to the `pagination` state outside of the table (a server-side query key is the most common case), you can own the slice yourself. The recommended way in v9 is an external atom passed through the `atoms` table option. Atoms preserve fine-grained subscriptions, and the pagination value can be used in a query key without making the table depend on component-local state.

```tsx
import { createAtom, useSelector } from '@tanstack/solid-store'
import {
  createTable,
  tableFeatures,
  rowPaginationFeature,
  createPaginatedRowModel,
  type PaginationState,
} from '@tanstack/solid-table'

const features = tableFeatures({ rowPaginationFeature })

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0, // initial page index
  pageSize: 10, // default page size
})

// subscribe to the atom wherever you need the value (e.g. for a query key)
const pagination = useSelector(paginationAtom)

const table = createTable({
  features,
  columns,
  data,
  atoms: {
    pagination: paginationAtom, // table pagination APIs now update paginationAtom
  },
})
```

Alternatively, the v8-style `state.pagination` plus `onPaginationChange` pattern is still supported with Solid signals. It can be convenient for simple integrations or when migrating v8 code, but it is less fine-grained than external atoms. See the [Table State Guide](./table-state) for a deeper comparison.

```tsx
const [pagination, setPagination] = createSignal<PaginationState>({
  pageIndex: 0, // initial page index
  pageSize: 10, // default page size
})

const table = createTable({
  features,
  columns,
  data,
  state: {
    get pagination() {
      return pagination() // connect the signal back down to the table
    },
  },
  onPaginationChange: setPagination,
})
```

Alternatively, if you have no need for managing the `pagination` state in your own scope, but you need to set different initial values for the `pageIndex` and `pageSize`, you can use the `initialState` option.

```tsx
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

> [!NOTE]
> Do NOT provide the `pagination` slice in more than one of the `atoms`, `state`, and `initialState` options. Controlled values (`atoms` or `state`) will overwrite `initialState`. Only use one of them.

### Pagination Options

Besides the `manualPagination`, `pageCount`, and `rowCount` options which are useful for manual server-side pagination (and discussed [above](#manual-server-side-pagination)), there is one other table option that is useful to understand.

#### Auto Reset Page Index

By default, `pageIndex` is reset to `0` whenever the client-side row models recompute, such as when the `data` is updated, filters change, sorting changes, or grouping changes. This behavior is automatically disabled when `manualPagination` is `true`, but it can be overridden by explicitly assigning a boolean value to the `autoResetPageIndex` table option. There is also a global `autoResetAll` table option that disables (or enables) every auto-reset behavior at once.

> [!NOTE]
> Automatic resets run only when an included client-side row model that triggers them recomputes. If a manual server-side table omits the filtered, sorted, grouped, or other relevant row model, changing that controlled state does not trigger a page-index reset—even when `autoResetPageIndex` or `autoResetAll` is `true`. Reset `pageIndex` yourself in the corresponding change handler.

```tsx
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
- `getCanLastPage`: Useful for disabling the "last page" button when no finite last page is known.
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

> [!NOTE]
> These pagination APIs are available when using `rowPaginationFeature`.

```tsx
<button
  onClick={() => table.firstPage()}
  disabled={!table.getCanPreviousPage()}
>
  {'<<'}
</button>
<button
  onClick={() => table.previousPage()}
  disabled={!table.getCanPreviousPage()}
>
  {'<'}
</button>
<button
  onClick={() => table.nextPage()}
  disabled={!table.getCanNextPage()}
>
  {'>'}
</button>
<button
  onClick={() => table.lastPage()}
  disabled={!table.getCanLastPage()}
>
  {'>>'}
</button>
<select
  value={table.atoms.pagination.get().pageSize}
  onChange={e => {
    table.setPageSize(Number(e.currentTarget.value))
  }}
>
  <For each={[10, 20, 30, 40, 50]}>
    {pageSize => <option value={pageSize}>Show {pageSize}</option>}
  </For>
</select>
```

#### Pagination Info APIs

- `getPageCount`: Useful for showing the total number of pages.
- `getRowCount`: Useful for showing the total number of rows.
