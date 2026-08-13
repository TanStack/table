---
title: Client-Side vs Server-Side Guide
---

## Examples

<!-- ::start:framework -->

# React

- [With TanStack Query](../framework/react/examples/with-tanstack-query)

# Preact

- [With TanStack Query](../framework/preact/examples/with-tanstack-query)

# Vue

- [With TanStack Query](../framework/vue/examples/with-tanstack-query)

# Solid

- [With TanStack Query](../framework/solid/examples/with-tanstack-query)

# Svelte

- [With TanStack Query](../framework/svelte/examples/with-tanstack-query)

# Angular

- [With TanStack Query](../framework/angular/examples/with-tanstack-query)

<!-- ::end:framework -->

> [!IMPORTANT] TanStack Table supports both client-side and server-side row processing!

More accurately, TanStack Table lets you bring your own backend or other manual approach to processing data for features such as filtering, grouping, sorting, expanding, aggregating, faceting, and pagination.

TanStack Table can filter, group, sort, expand, aggregate, facet, and paginate rows in the browser through client-side [row model](./row-models) processing. It can also just manage the state for those features while your server performs the actual data processing. The right approach depends on how much data the browser receives, how expensive that data is to transfer and process, and the experience you want to provide.

Whichever option you choose, you pretty much have to choose just one or the other. You can't really mix and match client-side and server-side row processing for different features. This guide covers that shared decision. The individual feature guides explain the options and row models for implementing each feature.

## Start With the Simplest Approach That Fits

Client-side processing is usually the simplest approach. This is where you let TanStack Table do that processing for you. Fetch the complete dataset for the table, pass it to TanStack Table, and enable the row models you need. Filtering, sorting, and pagination can then update immediately without another request.

You might be tempted to rule out client-side processing based on what you think is a large dataset, but tables with just a few thousand rows are often practical in the browser. TanStack Table examples stress-test much larger datasets. In fact, we stress-test all TanStack Table features with 1 million rows client-side and expect usable performance. Actual performance depends on the number of columns, the size and shape of each row, the work performed by accessors and feature functions, and the devices your users have. Test with representative data and target hardware.

Older versions of TanStack Table used to start running into memory issues at about 1 million rows, but thanks to our [Object Prototypes Refactor](https://tanstack.com//blog/tanstack-table-v9-memory-performance) we can now claim to support up to 15 million rows client-side with ease. Is loading 15 million rows practical for your use-case? Probably not! But we hope you know that TanStack Table should give you headroom many client-side rows.

Server-side processing is usually a better fit when:

- fetching the complete dataset would be slow, expensive, or memory-intensive;
- the browser only receives a page or another subset of the rows;
- queries, permissions, or business rules must be enforced by the backend;
- data changes frequently enough that downloading it all would become stale; or
- the backend can perform indexed searching, sorting, grouping, or aggregation more efficiently.

When evaluating the tradeoff, measure:

1. How long and how much it costs the server to query the complete dataset.
2. The transferred payload size, not only the number of rows.
3. Browser memory usage and the time spent computing row models.
4. The interaction cost of waiting for a request after each state change.

If both approaches fit today, starting on the client keeps the data flow smaller. Owning the relevant table state makes it easier to move processing to the server later.

## Keep Dataset-Wide Operations Consistent

Filtering, grouping, sorting, and pagination usually describe one pipeline over the same dataset. If the server sends only part of that dataset, a client-side operation can only process the loaded rows.

For example, client-side sorting after server-side pagination sorts the current page, not every matching row. Client-side filtering after server-side pagination can hide rows on the current page without finding matches on other pages. These results are usually misleading.

As a rule, when the server owns pagination, it should also own any filtering, grouping, sorting, or aggregation that must apply to the full result set. Mixing approaches is valid when the smaller scope is intentional. For example, you might rank the rows within each server-provided group. Make that scope clear in the UI.

Facets need the same consideration. Facet counts calculated from a server-provided page describe only that page. Calculate facets on the server when they need to represent the full filtered dataset.

## What “Manual” Means

TanStack Table calls server-side data processing “manual” because the table does not perform that transformation. A `manual*` option does not fetch or transform data. It tells the table to use the data you provide as already processed for that feature.

| Operation                   | Manual option       | Client-side row model or implementation |
| --------------------------- | ------------------- | --------------------------------------- |
| Column and global filtering | `manualFiltering`   | `filteredRowModel`                      |
| Grouping                    | `manualGrouping`    | `groupedRowModel`                       |
| Aggregation values          | `manualAggregation` | `aggregationFn` local fallback          |
| Sorting                     | `manualSorting`     | `sortedRowModel`                        |
| Expanding                   | `manualExpanding`   | `expandedRowModel`                      |
| Pagination                  | `manualPagination`  | `paginatedRowModel`                     |

Faceting also supports server-provided results, but it uses custom factories rather than a `manual*` option. See the [Aggregation](../framework/react/guide/aggregation) and [Faceting](../framework/react/guide/column-faceting#custom-server-side-faceting) guides for those feature-specific details.

You can omit an unused client-side row model. If a shared table configuration includes one, its matching `manual*` option tells the table to bypass it. The feature itself can remain enabled so the table still supplies its state and APIs.

## A Typical Server-Side Data Flow

With server-side processing, you write the filtering, grouping, sorting, aggregation, and pagination logic in the backend language, SQL query layer, database API, or service architecture that fits your application.

TanStack Table also does not fetch data. Your application is responsible for sending the table state to the backend and providing the returned rows to the table. You can use any data-fetching solution you prefer. [TanStack Query](https://tanstack.com/query/latest) is an excellent companion when you want declarative fetching, caching, loading states, and request lifecycle management, and it composes naturally with controlled TanStack Table state.

For server-side processing:

1. Own the relevant filter, grouping, sorting, and pagination state so your data-fetching code can read it.
2. Include every server-owned state value in the request or query key.
3. Enable the matching `manual*` options.
4. Pass the processed rows returned by the server to `data`.
5. For manual pagination, also provide `rowCount` or `pageCount` when known.
6. Reset or validate the page index when filters, grouping, sorting, or page size change.
7. Keep previous results or show loading state deliberately, and prevent slower stale responses from replacing newer results.

`manualPagination` disables `autoResetPageIndex` by default.

More generally, auto-reset side effects run when a row model that invokes them recomputes. Client-side filtering, grouping, and sorting row models normally invoke page-index resets after their related state changes. In a fully manual server-side configuration that omits those row models, controlled state changes do not run their reset hooks. Reset dependent state in the corresponding change callbacks instead, as shown below. Core data changes can still trigger some auto-reset behaviors when returned data is processed.

The table continues to manage state and expose event handlers; your application connects that state to its data-fetching layer. See the framework-specific Table State guide and the With TanStack Query example for complete patterns:

<!-- ::start:framework -->

# React

- [Table State](../framework/react/guide/table-state)
- [With TanStack Query](../framework/react/examples/with-tanstack-query)

# Preact

- [Table State](../framework/preact/guide/table-state)
- [With TanStack Query](../framework/preact/examples/with-tanstack-query)

# Octane

- [Table State](../framework/octane/guide/table-state)

# Vue

- [Table State](../framework/vue/guide/table-state)
- [With TanStack Query](../framework/vue/examples/with-tanstack-query)

# Solid

- [Table State](../framework/solid/guide/table-state)
- [With TanStack Query](../framework/solid/examples/with-tanstack-query)

# Svelte

- [Table State](../framework/svelte/guide/table-state)
- [With TanStack Query](../framework/svelte/examples/with-tanstack-query)

# Angular

- [Table State](../framework/angular/guide/table-state)
- [With TanStack Query](../framework/angular/examples/with-tanstack-query)

# Ember

- [Table State](../framework/ember/guide/table-state)

# Lit

- [Table State](../framework/lit/guide/table-state)

# Alpine

- [Table State](../framework/alpine/guide/table-state)

# Vanilla

- [Table State](../framework/vanilla/guide/table-state)

<!-- ::end:framework -->

Use a stable backend identifier with `getRowId` when selection, expansion, or other row state must survive requests. Page-relative row indexes do not identify the same record reliably across server responses.

### Why No Built-In Server Row Models

TanStack Table is a synchronous table state manager. Its client-side row models synchronously transform data that is already in memory, while its state and APIs describe the filtering, sorting, and pagination the user wants. Fetching data and running backend queries happen outside of the table.

There are countless valid ways to design a backend and the contract between a frontend and backend: REST query parameters, GraphQL inputs, RPC calls, SQL builders, database SDKs, streaming responses, and more. A built-in server row model would have to impose opinions about those choices. TanStack Table deliberately leaves that boundary to your application so it can work with any backend stack or API design.

In practice, [TanStack Query](https://tanstack.com/query/latest) serves as the client-side coordinator for server-side row processing. Your own fetching layer can fill the same role. It observes the controlled table state, sends that state through your API contract, caches the result, and gives the returned rows back to the table. For example, a React integration can pass every server-owned state value to both the query key and query function:

#### Page-Index Pagination with `useQuery`

```tsx
const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  // Client-side filtering, sorting, and pagination row models are not
  // required because those operations are handled manually on the server.
  // Omitting the filtered and sorted row models also omits their page-reset
  // hooks, so pagination is reset in the change handlers below.
})

const [sorting, setSorting] = useState<SortingState>([])
const [globalFilter, setGlobalFilter] = useState('')
const [pagination, setPagination] = useState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const dataQuery = useQuery({
  queryKey: ['people', { sorting, globalFilter, pagination }],
  queryFn: () => fetchPeople({ sorting, globalFilter, pagination }),
  placeholderData: keepPreviousData,
})

const table = useTable(
  {
    features,
    columns,
    data: dataQuery.data?.rows ?? [],
    rowCount: dataQuery.data?.rowCount,
    state: { sorting, globalFilter, pagination },
    onSortingChange: (updater) => {
      setSorting(updater)
      setPagination((previous) => ({ ...previous, pageIndex: 0 })) // reset page index when sorting changes
    },
    onGlobalFilterChange: (updater) => {
      setGlobalFilter(updater)
      setPagination((previous) => ({ ...previous, pageIndex: 0 })) // reset page index when global filter changes
    },
    onPaginationChange: setPagination,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
  },
  (state) => state,
)
```

Here, `fetchPeople` defines your application's frontend-backend contract. The backend remains responsible for applying the operations in the correct order and returning the requested rows plus the total filtered `rowCount`.

#### Cursor-Based Pagination with `useInfiniteQuery`

Cursor pagination is a useful alternative when calculating a total row count or supporting arbitrary page jumps would be expensive. Instead of accepting a page index, the backend accepts a cursor and returns the current rows, a `nextCursor`, and whether another page exists. A production cursor is often opaque; a stable last-row ID can also work when IDs are unique and the backend ordering is deterministic.

TanStack Query's `useInfiniteQuery` caches the cursor chain. TanStack Table can use `pagination.pageIndex` to select one of those cached pages while the application fetches a new page only when the user advances beyond the cache:

```tsx
const dataQuery = useInfiniteQuery({
  queryKey: ['people', 'cursor', pagination.pageSize, sorting, globalFilter],
  queryFn: ({ pageParam }) =>
    fetchPeople({
      cursor: pageParam,
      pageSize: pagination.pageSize,
      sorting,
      globalFilter,
    }),
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
})

const currentPage = dataQuery.data?.pages[pagination.pageIndex]
const hasCachedNextPage = Boolean(
  dataQuery.data?.pages[pagination.pageIndex + 1],
)
const canNextPage = hasCachedNextPage || Boolean(currentPage?.hasNextPage)

const table = useTable(
  {
    features,
    columns,
    data: currentPage?.rows ?? [],
    pageCount: -1, // the cursor API does not expose a total page count
    state: { sorting, globalFilter, pagination },
    onSortingChange: (updater) => {
      setSorting(updater)
      setPagination((previous) => ({ ...previous, pageIndex: 0 }))
    },
    onGlobalFilterChange: (updater) => {
      setGlobalFilter(updater)
      setPagination((previous) => ({ ...previous, pageIndex: 0 }))
    },
    onPaginationChange: setPagination,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
  },
  (state) => state,
)

async function goToNextPage() {
  const nextPageIndex = pagination.pageIndex + 1

  if (!dataQuery.data?.pages[nextPageIndex]) {
    const result = await dataQuery.fetchNextPage()
    if (!result.data?.pages[nextPageIndex]) return
  }

  table.nextPage()
}
```

Use `canNextPage` for the Next button. With `pageCount: -1`, the table's `getCanNextPage()` cannot know when the server has reached the end. Previously fetched pages can still be revisited without another request. Because the total is unknown, there is no finite page for `lastPage()` to target, so `getCanLastPage()` returns `false`. Reset `pageIndex` to `0` when sorting, filtering, or page size changes so the new query starts from its initial cursor.

## Rendering Is a Separate Decision

Data processing and rendering solve different problems:

- Pagination limits how many rows appear at once and can be performed on either the client or server.
- Virtualization renders only the visible portion of the rows already loaded in the browser.

Virtualization can make a large client-side dataset inexpensive to render, but it does not reduce the amount of data fetched or the work needed to filter and sort that dataset. If the complete dataset is too large to load, use server-side operations or incremental fetching; then add virtualization if the loaded result is still large enough to make rendering expensive.

## Choosing an Approach

Use client-side processing when the browser can reasonably fetch and retain the complete dataset and immediate local interactions are valuable. Use server-side processing when the complete dataset should not or cannot be loaded, or when the backend must define the authoritative result.

Choosing server-side processing means bringing your own implementation. TanStack Table supplies the state and APIs that describe what the user wants, but your backend code or SQL must process that state, and your data-fetching code must transport the request and response. No TanStack Table server-side model or built-in fetching layer is involved. This separation keeps TanStack Table compatible with any backend. TanStack Query is an optional companion when you want help managing the fetching and caching layer.

Whichever approach you choose, test the full pipeline with realistic data. Network transfer, browser memory, row-model computation, DOM rendering, and backend query cost are separate bottlenecks, and the best boundary is the one that keeps all of them acceptable for your users.
