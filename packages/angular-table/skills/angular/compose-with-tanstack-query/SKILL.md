---
name: angular/compose-with-tanstack-query
description: >
  Compose TanStack Table v9 with `@tanstack/angular-query-experimental` for server-side data.
  Key the query on the controlled table state that drives the request (pagination, sorting,
  filters); use `placeholderData: keepPreviousData` to avoid a "0 rows flash" between pages;
  set `manualPagination` / `manualSorting` / `manualFiltering` for the slices the server owns;
  drop the matching client row-model factory slots from `features`; pass `rowCount` from the
  server response; set `getRowId` for stable selection across refetches; hoist controlled slices
  to Angular signals + `state` + `on[State]Change`. Alternative: `rxResource` / `httpResource`
  if you don't want to add the Query dependency (see `client-to-server`).
type: composition
library: tanstack-table
framework: angular
library_version: '9.0.0-alpha.48'
requires:
  - angular/table-state
  - angular/client-to-server
  - angular/getting-started
sources:
  - TanStack/table:docs/framework/angular/guide/table-state.md
  - TanStack/table:examples/angular/remote-data/
  - TanStack/query:packages/angular-query-experimental/src/
---

# Compose with TanStack Query (Angular)

> Goal: server-driven Angular Table v9 with `@tanstack/angular-query-experimental`
> as the fetch / cache / refetch layer. The pattern is the same as the
> `examples/angular/remote-data/` example, just with `injectQuery` instead of
> `rxResource`.
>
> The non-Query variant (`rxResource` / `httpResource`) is documented in
> `tanstack-table/angular/client-to-server`. Both work — Query adds caching,
> request deduplication, background refetch, and offline coordination.

---

## 1. Install

```bash
pnpm add @tanstack/angular-query-experimental
```

Then in `app.config.ts`:

```ts
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental'

export const appConfig: ApplicationConfig = {
  providers: [
    provideTanStackQuery(new QueryClient()),
    // ...
  ],
}
```

---

## 2. The pattern in one snippet

```ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { lastValueFrom, map } from 'rxjs'
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental'
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

  // 1. Hoist controlled slices to Angular signals
  readonly pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 })
  readonly sorting = signal<SortingState>([])
  readonly globalFilter = signal<string | null>(null)

  // 2. Query keyed on those signals — refetches when any of them change
  readonly todosQuery = injectQuery(() => ({
    queryKey: ['todos', this.pagination(), this.sorting(), this.globalFilter()],
    queryFn: () => {
      const p = this.pagination()
      const s = this.sorting()
      const f = this.globalFilter()

      let params = new HttpParams({
        fromObject: { _page: p.pageIndex + 1, _limit: p.pageSize },
      })
      if (f) params = params.set('title_like', f)
      if (s.length) {
        params = params
          .set('_sort', s.map((x) => x.id).join(','))
          .set('_order', s.map((x) => (x.desc ? 'desc' : 'asc')).join(','))
      }

      return lastValueFrom(
        this.http
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
          ),
      )
    },
    placeholderData: keepPreviousData, // ← prevents "0 rows" flash on refetch
    staleTime: 30_000,
  }))

  // 3. Stable column defs (module-scope-able)
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

  // 4. Wire the table — manual flags, features without row-model factories, rowCount, getRowId
  readonly table = injectTable(() => {
    const data = this.todosQuery.data() ?? { items: [], totalCount: 0 }
    return {
      features, // ← features has no paginatedRowModel/sortedRowModel/filteredRowModel slots
      columns: this.columns,
      data: data.items,
      getRowId: (row) => String(row.id),

      state: {
        pagination: this.pagination(),
        sorting: this.sorting(),
        globalFilter: this.globalFilter(),
      },

      manualPagination: true,
      manualSorting: true,
      manualFiltering: true,

      rowCount: data.totalCount, // for getPageCount() under manualPagination

      autoResetPageIndex: false, // we manage page resets explicitly

      onPaginationChange: (u) =>
        typeof u === 'function'
          ? this.pagination.update(u)
          : this.pagination.set(u),
      onSortingChange: (u) =>
        typeof u === 'function' ? this.sorting.update(u) : this.sorting.set(u),
      onGlobalFilterChange: (u) => {
        typeof u === 'function'
          ? this.globalFilter.update(u)
          : this.globalFilter.set(u)
        this.pagination.update((p) => ({ ...p, pageIndex: 0 })) // UX reset
      },
    }
  })
}
```

---

## 3. The four mandatory pieces

For server-driven Table + Query to work correctly:

1. **`queryKey` includes every signal the request reads.** If `pagination`
   changes but `queryKey` doesn't include `this.pagination()`, the query
   won't refetch.
2. **`placeholderData: keepPreviousData`** keeps the last response visible
   during refetches. Without it, `todosQuery.data()` becomes `undefined`
   mid-fetch, your table shows 0 rows for a frame, the user notices.
3. **`manualPagination` / `manualSorting` / `manualFiltering: true`** for
   slices the server owns + **remove the matching factory slots from `features`**
   so the table doesn't re-process the data the server already filtered/sorted/paged.
4. **`rowCount: data.totalCount`** (or `pageCount`) so `getPageCount()`
   computes correctly under `manualPagination`.

Plus: **`getRowId` for stable identity** across refetches (required for
correct row selection).

---

## 4. Loading and error UI

`injectQuery` returns a signal-rich object. Read the state in templates:

```html
@if (todosQuery.isPending()) {
<p>Loading…</p>
} @else if (todosQuery.isError()) {
<p>Failed: {{ todosQuery.error()?.message }}</p>
} @else {
<table>
  ...
</table>
}
```

With `placeholderData: keepPreviousData`, you'll usually want to show the
table even while refetching, plus an inline indicator:

```html
<table>
  <thead>
    ...
  </thead>
  <tbody>
    ...
  </tbody>
</table>

@if (todosQuery.isFetching()) {
<div class="refreshing-indicator">Refreshing…</div>
}
```

`isPending()` is true only for the very first fetch; `isFetching()` is true
on every background refetch.

---

## 5. Pagination button states

Under `manualPagination` + `keepPreviousData`, the next-page button should be
disabled when there's no more data — but `getCanNextPage()` only knows that
because you passed `rowCount`. Always pass it:

```html
<button
  (click)="table.previousPage()"
  [disabled]="!table.getCanPreviousPage() || todosQuery.isFetching()"
>
  ‹
</button>
<span
  >Page {{ table.atoms.pagination.get().pageIndex + 1 }} of {{
  table.getPageCount() }}</span
>
<button
  (click)="table.nextPage()"
  [disabled]="!table.getCanNextPage() || todosQuery.isFetching()"
>
  ›
</button>
```

Disabling buttons during `isFetching()` prevents double-clicks that fire a
second refetch.

---

## 6. Row selection across refetches

```ts
// In the table options
getRowId: (row) => String(row.id),
```

Plus register `rowSelectionFeature`. Now `RowSelectionState` is keyed by
`row.id` (the server primary key) — refetches that change row order don't
break selection. Without `getRowId`, IDs default to row index and selection
points at the wrong rows after a sort flip or refetch.

---

## 7. Mutations (cell-level edits)

Use Query mutations for cell edits and invalidate the list query on success.
For inline editing UI, see `compose-with-tanstack-form` (when it ships) — or
the `examples/angular/editable/` pattern with `flexRenderComponent` and a
local edit signal.

```ts
import { inject } from '@angular/core'
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental'
import { lastValueFrom } from 'rxjs'

private readonly queryClient = inject(QueryClient)

readonly toggleTodoMutation = injectMutation(() => ({
  mutationFn: (id: number) =>
    lastValueFrom(this.http.patch(`/todos/${id}`, { /* … */ })),
  onSuccess: () => {
    this.queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
}))

// In a cell:
cell: ({ row }) => flexRenderComponent(ToggleButton, {
  inputs: { todo: row.original },
  outputs: { toggle: (id) => this.toggleTodoMutation.mutate(id) },
})
```

`invalidateQueries` triggers a background refetch; with `keepPreviousData`,
the user sees the existing list while the new one loads.

---

## 8. Should I use external `Store` atoms or Angular signals here?

For the filter / sort / pagination slices that the Query reads, **either
works**. The example above uses Angular signals because they read cleanly with
`@for` and `OnPush`, and Query's `queryKey` polls them on the next CD cycle.

Use an external TanStack Store atom (see `compose-with-tanstack-store`) when:

- The same slice must drive multiple tables.
- You're syncing the slice to the URL or `localStorage`.
- Other non-table consumers in the app already use the atom.

In those cases:

```ts
import { paginationStore } from './stores'
import { injectSelector } from '@tanstack/angular-store'

readonly paginationSig = injectSelector(paginationStore, (s) => s)

readonly todosQuery = injectQuery(() => ({
  queryKey: ['todos', this.paginationSig() /*, sort, filter */],
  // ...
}))

readonly table = injectTable(() => ({
  // ...
  atoms: { pagination: paginationStore },
  // no state.pagination needed — the atom owns it
}))
```

---

## Failure modes

### 1. (CRITICAL) `queryKey` missing the controlled signals

```ts
// ❌ Query won't refetch when pagination changes
queryKey: ['todos'],

// ✅
queryKey: ['todos', this.pagination(), this.sorting(), this.globalFilter()],
```

Symptom: paginating "doesn't load the next page." Always include every signal
the request reads.

### 2. (CRITICAL) No `placeholderData: keepPreviousData` → "0 rows flash"

Without it, `data()` is `undefined` mid-refetch, the table renders 0 rows
for a frame. `keepPreviousData` (imported from
`@tanstack/angular-query-experimental`) keeps the last successful payload
visible until the new one resolves.

### 3. (CRITICAL) Forgetting `rowCount` under `manualPagination`

`getPageCount()` returns `-1`, "next" never disables. The server tells you
how many rows exist — pass it.

### 4. (CRITICAL) Keeping client row-model factory slots for slices the server owns

```ts
// ❌ Double-processes the data
manualPagination: true,
// features still has paginatedRowModel slot → re-paginates server page

// ✅ remove the factory slot from features for server-owned slices
const features = tableFeatures({
  rowPaginationFeature,
  // paginatedRowModel intentionally omitted — server handles it
})
```

Same applies to `sortedRowModel` under `manualSorting` and `filteredRowModel`
under `manualFiltering`.

### 5. (CRITICAL) Missing `getRowId` with row selection

Selection is keyed by row ID. Index-as-ID breaks when the server returns rows
in a new order. `getRowId: (row) => row.id`.

### 6. (HIGH) `autoResetPageIndex` bouncing the user to page 0 on every refetch

Every Query response is a new array reference → table sees "new data" → resets
`pageIndex`. Set `autoResetPageIndex: false` and reset explicitly when you
want to (e.g. in `onGlobalFilterChange`).

### 7. (HIGH) Refetching on every keystroke

Typing into the global filter fires a fetch per character. Debounce: either
keep a separate `globalFilterInput` signal and propagate to `globalFilter` on
a delay, or compose with `@tanstack/angular-pacer` (when its skill ships).
Also reset `pageIndex: 0` on filter change.

### 8. (HIGH) Forgetting the updater-fn branch in `on[State]Change`

```ts
// ❌ Crashes when TanStack Table passes a function (e.g. table.setPageIndex((p) => p + 1))
onPaginationChange: (value) => this.pagination.set(value)

// ✅
onPaginationChange: (u) =>
  typeof u === 'function' ? this.pagination.update(u) : this.pagination.set(u)
```

### 9. (MEDIUM) Reaching for `effect(...)` to call `query.refetch()` on signal changes

Don't. The whole point of `queryKey` is that Query refetches when the key
changes. Adding an `effect` that calls `refetch()` produces double fetches and
race conditions. Trust the key.

### 10. (MEDIUM) Two sources of truth for filter state

Common bug: keep a `signal('')` for the input AND a `state.globalFilter`
controlled value, and try to sync them via `effect`. Pick one: the table's
`globalFilter` is fine for both UI and server query. If you need debouncing,
use an _additional_ `globalFilterInput` signal for the raw input and update
the table-controlled signal on a delay.

---

## See also

- `tanstack-table/angular/client-to-server` — the no-Query baseline using
  `rxResource` / `httpResource`
- `tanstack-table/angular/table-state` — Angular signal + `state` + `on*Change`
- `tanstack-table/angular/compose-with-tanstack-store` — when to use shared
  atoms instead of signals
- `tanstack-table/core/filtering` — manualFiltering semantics
- `tanstack-table/core/sorting` — manualSorting semantics
- `tanstack-table/core/pagination` — manualPagination + `rowCount`
- Example: `examples/angular/remote-data/` — analogous pattern with
  `rxResource` instead of `injectQuery`
- `@tanstack/angular-query-experimental` docs for `injectQuery`,
  `injectMutation`, `injectInfiniteQuery`, `QueryClient`
