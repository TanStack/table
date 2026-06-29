---
name: angular/client-to-server
description: >
  Convert an Angular Table v9 from client-side to server-side processing. Flip
  `manualPagination` / `manualSorting` / `manualFiltering` / `manualGrouping` / `manualExpanding`
  for the slices the server now owns; drop the corresponding row-model factory slots from the
  `features` object for the factories the server replaces; supply `rowCount` (server total) so
  pagination computes correctly; hoist `pagination` / `sorting` / `columnFilters` / `globalFilter`
  to Angular signals with `state` + `on[State]Change`; fetch via `rxResource` / `httpResource` /
  `@tanstack/angular-query`; preserve previous data on refetch with `linkedSignal` (or
  `placeholderData: keepPreviousData` for Query); set `getRowId` for stable selection across
  refetches.
type: lifecycle
library: tanstack-table
framework: angular
library_version: '9.0.0-alpha.48'
requires:
  - angular/table-state
  - angular/getting-started
  - filtering
  - sorting
  - pagination
sources:
  - TanStack/table:docs/framework/angular/guide/table-state.md
  - TanStack/table:docs/framework/angular/guide/migrating.md
  - TanStack/table:examples/angular/remote-data/
  - TanStack/table:packages/angular-table/src/injectTable.ts
---

# Client → Server Conversion (Angular Table v9)

> Goal: take a working client-side Angular Table v9 and migrate it to server-driven
> processing for one or more of pagination / sorting / filtering / grouping /
> expanding — without rewriting your row markup, columns, or feature surface.
>
> The canonical Angular example is `examples/angular/remote-data/`, using
> `rxResource` + `linkedSignal`. The same pattern composes with
> `@tanstack/angular-query` (see `compose-with-tanstack-query`).

---

## 1. The 5-step recipe

For each slice the server now owns:

1. **Flip `manualX: true`** in table options. This tells the table "don't
   process this on the client — trust the data you receive."
2. **Drop the matching client-side row-model factory slot** from `features`
   (or keep it if you still want the feature's _state_ but no client
   recomputation — see §3).
3. **Hoist the slice to an Angular signal**, control it via `state.x` +
   `on[State]Change`. Server requests must depend on the signal.
4. **Pass `rowCount`** (the server's total) so `getPageCount()`,
   `getCanNextPage()`, etc. compute correctly under `manualPagination`.
5. **Set `getRowId`** so row selection (and refetch identity) survives across
   server refetches.

Plus: keep previous data visible during refetches (avoid a "0-rows flash") with
`linkedSignal`, `placeholderData: keepPreviousData` (Query), or
`previousValue:` (`httpResource`).

---

## 2. The `manualX` matrix

| Slice          | Option                   | Client row-model needed? | Notes                                                          |
| -------------- | ------------------------ | ------------------------ | -------------------------------------------------------------- |
| Pagination     | `manualPagination: true` | drop `paginatedRowModel` | also pass `rowCount: <serverTotal>`                            |
| Sorting        | `manualSorting: true`    | drop `sortedRowModel`    | feature still controls `sorting` state                         |
| Column filters | `manualFiltering: true`  | drop `filteredRowModel`  | also affects global filter when sharing the filtered row model |
| Global filter  | `manualFiltering: true`  | drop `filteredRowModel`  | global filter shares the filtered row model                    |
| Grouping       | `manualGrouping: true`   | drop `groupedRowModel`   | rare — most servers don't return grouped trees                 |
| Expanding      | `manualExpanding: true`  | drop `expandedRowModel`  | server returns sub-rows pre-expanded                           |

Selection, visibility, ordering, pinning, sizing, resizing, row-pinning are
all UI-only state — they don't have manual modes. They keep working unchanged.

---

## 3. Canonical example — pagination + sorting + global filter

The `examples/angular/remote-data/` pattern, condensed:

```ts
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  signal,
} from '@angular/core'
import { rxResource } from '@angular/core/rxjs-interop'
import { HttpClient, HttpParams } from '@angular/common/http'
import { map } from 'rxjs'
import {
  FlexRender,
  injectTable,
  tableFeatures,
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  createColumnHelper,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from '@tanstack/angular-table'

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
})

const columnHelper = createColumnHelper<typeof features, Todo>()

type TodoResponse = { items: Array<Todo>; totalCount: number }

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly http = inject(HttpClient)

  // 1. Hoist controlled slices to signals
  readonly pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 })
  readonly sorting = signal<SortingState>([{ id: 'id', desc: false }])
  readonly globalFilter = signal<string | null>(null)

  // 2. Fetch — server query depends on those signals
  private readonly data = rxResource({
    params: () => ({
      page: this.pagination(),
      sorting: this.sorting(),
      globalFilter: this.globalFilter(),
    }),
    stream: ({ params: { page, sorting, globalFilter } }) => {
      let params = new HttpParams({
        fromObject: {
          _page: page.pageIndex + 1,
          _limit: page.pageSize,
        },
      })
      if (globalFilter) params = params.set('title_like', globalFilter)
      if (sorting.length) {
        params = params
          .set('_sort', sorting.map((s) => s.id).join(','))
          .set(
            '_order',
            sorting.map((s) => (s.desc ? 'desc' : 'asc')).join(','),
          )
      }
      return this.http
        .get<Array<Todo>>('https://jsonplaceholder.typicode.com/todos', {
          params,
          observe: 'response',
        })
        .pipe(
          map(
            (res) =>
              ({
                items: res.body ?? [],
                totalCount: Number(res.headers.get('X-Total-Count')),
              }) satisfies TodoResponse,
          ),
        )
    },
  })

  // 3. Keep previous page visible during refetch — no "0 rows" flash
  readonly dataWithLatest = linkedSignal<
    {
      value: TodoResponse | undefined
      status: 'idle' | 'loading' | 'resolved' | 'error'
    },
    TodoResponse
  >({
    source: () => ({
      value: this.data.value(),
      status: this.data.status(),
    }),
    computation: (source, previous) => {
      if (previous && source.status === 'loading') return previous.value
      return source.value ?? { items: [], totalCount: 0 }
    },
  })

  readonly columns: Array<ColumnDef<typeof features, Todo>> = [
    columnHelper.accessor('id', { header: 'Id', cell: (i) => i.getValue() }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (i) => i.getValue(),
    }),
    columnHelper.accessor('completed', {
      header: 'Completed',
      cell: (i) => (i.getValue() ? '✅' : '❌'),
    }),
  ]

  // 4. Wire the table — manualX flags, features without row-model factories, supply rowCount
  readonly table = injectTable(() => {
    const data = this.dataWithLatest()
    return {
      features, // ← features has no paginatedRowModel/sortedRowModel/filteredRowModel slots
      columns: this.columns,
      data: data.items,
      getRowId: (row) => String(row.id),

      // Controlled slices
      state: {
        pagination: this.pagination(),
        sorting: this.sorting(),
        globalFilter: this.globalFilter(),
      },

      // Manual modes
      manualPagination: true,
      manualSorting: true,
      manualFiltering: true,

      // Server's truth about total row count
      rowCount: data.totalCount,

      onPaginationChange: (u) =>
        typeof u === 'function'
          ? this.pagination.update(u)
          : this.pagination.set(u),

      onSortingChange: (u) =>
        typeof u === 'function' ? this.sorting.update(u) : this.sorting.set(u),

      // When filter changes, also reset page index
      onGlobalFilterChange: (u) => {
        typeof u === 'function'
          ? this.globalFilter.update(u)
          : this.globalFilter.set(u)
        this.pagination.update((p) => ({ ...p, pageIndex: 0 }))
      },
    }
  })
}
```

### What changed from the client-side version

- `features` has no `paginatedRowModel`, `sortedRowModel`, or `filteredRowModel`
  slots — the server is the source of truth for those.
- `manualPagination` / `manualSorting` / `manualFiltering: true`.
- `rowCount: data.totalCount` — required for correct `getPageCount()` and the
  next/prev buttons.
- `state` + per-slice `on[State]Change` for everything the server reads.
- `getRowId` set so row selection survives refetch reorderings.
- `linkedSignal` keeps the previous response visible during loading — without
  it, paginating yields a one-frame "no rows" flash because `data.value()` is
  `undefined` mid-fetch.
- Resetting `pageIndex` on global-filter change is a UX rule, not framework
  behavior — make it explicit.

---

## 4. Wiring with `@tanstack/angular-query-experimental`

For Query users, the equivalent of `linkedSignal` is
`placeholderData: keepPreviousData`. See `compose-with-tanstack-query` for the
full pattern. The table-side wiring (manual flags, dropped row models,
controlled signals, `rowCount`, `getRowId`) is identical.

---

## 5. `rowCount` and friends

Under `manualPagination: true`, the table no longer knows the total. You must
tell it:

```ts
rowCount: data.totalCount // total rows server reports
// pageCount: 42                // can be passed instead, if your API gives pages not rows
```

If you omit both, `getPageCount()` returns `-1` and the "next page" button
never disables. If your API reports `pageCount` directly (rare), prefer
`pageCount` — otherwise compute it from `rowCount`.

---

## 6. Always set `getRowId` when server-driven

Without `getRowId`, row IDs default to row index. That works on the client
because order is stable per render. On the server, a refetch may return rows in
a different order — `RowSelectionState`, keyed by row ID, then targets the
wrong rows.

```ts
getRowId: (row) => row.id
```

Required for:

- `rowSelectionFeature` correctness across refetches
- pinned-row identity
- stable `track row.id` performance in `@for`

---

## 7. Debouncing rapid input — global filter typing

Naively, every keystroke triggers a server fetch. Two options:

- **Manual signal indirection** — keep a `globalFilterInput` signal that the
  UI writes to, then update `globalFilter` after a delay via `effect(...) +
setTimeout` or RxJS `debounceTime`.
- **Compose with `@tanstack/angular-pacer`** — see
  `compose-with-tanstack-pacer` (not in this batch but on the roadmap).

Resetting `pageIndex` to 0 when filter or sort changes is a UX standard:

```ts
onGlobalFilterChange: (u) => {
  typeof u === 'function' ? this.globalFilter.update(u) : this.globalFilter.set(u)
  this.pagination.update((p) => ({ ...p, pageIndex: 0 }))
},
```

---

## 8. Mixed mode — some slices server, others client

Common pattern: pagination + sorting on the server, but row selection +
column visibility stay client-only. **Nothing special required** — only the
slices you mark `manualX` are server-driven. Selection / visibility / ordering
work unchanged.

You can also keep client-side filtering on a column while paginating on the
server, but be wary: if rows are paginated server-side, you only have the
current page to filter against. Usually it's cleaner to flip all data-shape
slices to the server consistently.

---

## 9. Resetting state on slice changes

These behaviors are intentional and you'll often want to _override_ them when
server-driven:

| Default                                                                       | When server-driven                                                                                                         |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `autoResetPageIndex: true` resets `pageIndex` to 0 when data identity changes | OK as-is — every fetch is a new array reference, so the page index resets unless you also pass `autoResetPageIndex: false` |
| Filter change does **not** auto-reset page                                    | UX-standard to reset manually (see §7)                                                                                     |
| Sort change does **not** auto-reset page                                      | Reset manually if your UX expects "new sort → page 1"                                                                      |

If your fetch always returns a fresh array, **set `autoResetPageIndex: false`** —
otherwise paginating to page 3 will reset back to page 0 the moment the new
data lands. The remote-data example demonstrates the alternative pattern for
edits (toggle the flag around the update).

---

## Failure modes

### 1. (CRITICAL) Flipping `manualPagination: true` but keeping `paginatedRowModel` on `features`

The client row-model factory will re-paginate the (already-paginated) data,
chopping the visible rows down to the first `pageSize` of the page slice.
**Remove the `paginatedRowModel` slot from `features`** when going manual — or
accept double-pagination.

### 2. (CRITICAL) Forgetting `rowCount` under `manualPagination`

`getPageCount()` returns `-1`, `getCanNextPage()` is `true` forever,
"page N of -1" appears in the UI. Always pass either `rowCount: serverTotal`
or `pageCount: serverPageCount`.

### 3. (CRITICAL) Missing `getRowId` with selection + server refetches

The row-selection state is keyed by row ID. With index-as-ID, refetches that
return rows in any new order (sort flip, page change) reselect the wrong
rows. Always set `getRowId: row => row.id` (or whatever your primary key is).

### 4. (HIGH) "0 rows" flash between pages

If your fetch resolves to `undefined` during loading, `data.items` becomes `[]`
mid-fetch — the table renders empty for a frame. Use `linkedSignal` (or
`@tanstack/query`'s `placeholderData: keepPreviousData`, or
`httpResource`'s previous-value semantics) to keep the previous page visible.

### 5. (HIGH) Forgetting to handle both value AND updater-fn shapes in `on[State]Change`

```ts
// ❌ Crashes when the table passes an updater function
onPaginationChange: (value) => this.pagination.set(value)

// ✅
onPaginationChange: (u) =>
  typeof u === 'function' ? this.pagination.update(u) : this.pagination.set(u)
```

### 6. (HIGH) `autoResetPageIndex` resetting your server pagination

By default, when data identity changes, the table resets to page 0. Under
server-driven pagination, _every_ fetch is a new array, so the table resets
the page index back to 0 every time. Set `autoResetPageIndex: false` and
manage page resets explicitly (e.g. reset on filter/sort change, but not on
the fetch itself).

### 7. (HIGH) Filtering on the client when only one page is loaded

```ts
manualPagination: true,
// columnFilteringFeature still registered, filteredRowModel slot still on features
```

The filtered row model now filters only the _current page_ — useless. If the
server paginates, the server must also filter; flip `manualFiltering: true`
and remove the `filteredRowModel` slot from `features`.

### 8. (HIGH) Forgetting to depend on the controlled signals in your fetch

If your `rxResource` / Query's `queryKey` doesn't read `pagination()`,
`sorting()`, `globalFilter()`, refetches won't happen. Both the table and the
fetcher must observe the same signals.

### 9. (MEDIUM) Reimplementing pagination state with raw `pageIndex` /

`pageSize` signals separate from the table

```ts
// ❌ Two sources of truth
readonly pageIndex = signal(0)
readonly pageSize = signal(10)
// table doesn't know about either

// ✅
readonly pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 })
state: { pagination: this.pagination() }
onPaginationChange: ...
```

Same lesson: use `setSorting`, not a manual sort signal that the table can't
see.

### 10. (MEDIUM) Not resetting `pageIndex` on filter/sort change

A common bug: user is on page 5, types in the filter, gets "no results" — but
the new filtered result set only has 2 pages. They have to manually click back
to page 1. Always reset `pageIndex` to 0 in `onGlobalFilterChange` /
`onColumnFiltersChange`.

### 11. (MEDIUM) Thinking that omitting all row-model slots means "no row models work"

Core row model is always automatic. `table.getRowModel().rows` returns the
data array as `Row<...>` objects no matter what — a `features` object with no
factory slots just means no client-side processing on top.

---

## See also

- `tanstack-table/angular/table-state` — state ownership, `state` vs `atoms`
- `tanstack-table/angular/compose-with-tanstack-query` — server fetch with Query
- `tanstack-table/angular/compose-with-tanstack-store` — external atom ownership
- `tanstack-table/core/filtering` — manualFiltering semantics
- `tanstack-table/core/sorting` — manualSorting semantics
- `tanstack-table/core/pagination` — manualPagination + `rowCount` / `pageCount`
- Example: `examples/angular/remote-data/`
