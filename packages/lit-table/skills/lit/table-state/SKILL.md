---
name: lit/table-state
description: >
  Wiring reactivity for `@tanstack/lit-table` v9. Covers `TableController`
  (constructed once per LitElement host, `.table(options, selector?)` called per
  render), reading state via `table.state` / `table.store` / `table.atoms.<slice>`,
  rendering with `table.FlexRender` / `FlexRender`, fine-grained subscriptions
  via the `table.subscribe` directive, owning slices with external atoms via `createAtom` +
  `options.atoms`, and packaging shared config into `createTableHook`
  (`useAppTable`, `createAppColumnHelper`, `useTableContext`,
  `table.AppCell` / `table.AppHeader` / `table.AppFooter`). Routing keywords:
  TableController, ReactiveController, useAppTable, atoms, lit-context,
  FlexRender, lit-table.
type: framework
library: tanstack-table
framework: lit
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - setup
sources:
  - TanStack/table:docs/framework/lit/guide/table-state.md
  - TanStack/table:docs/framework/lit/lit-table.md
  - TanStack/table:packages/lit-table/src/TableController.ts
  - TanStack/table:packages/lit-table/src/subscribe-directive.ts
  - TanStack/table:packages/lit-table/src/createTableHook.ts
  - TanStack/table:packages/lit-table/src/flexRender.ts
  - TanStack/table:packages/lit-table/src/reactivity.ts
  - TanStack/table:examples/lit/basic-table-controller/src/main.ts
  - TanStack/table:examples/lit/basic-external-atoms/src/main.ts
  - TanStack/table:examples/lit/basic-subscribe/src/main.ts
  - TanStack/table:examples/lit/basic-app-table/src/main.ts
---

> **Maintainer note:** the Lit adapter now runs on `@tanstack/lit-store`. The old `table.Subscribe({ source, selector, children })` helper has been replaced by the `table.subscribe(source, selector?, template)` directive (see Core Pattern 4). Further changes may land during the v9 beta cycle.

This skill builds on `tanstack-table/state-management` and `tanstack-table/setup`. Read those first — `state-management` explains the v9 atom model. The Lit adapter wires that atom model into a `ReactiveController` (`TableController`) attached to a `LitElement` host.

## Setup

The shape every Lit v9 table follows: register `features` (including row model factories) at module scope, construct `TableController` once per host element, and call `.table(options, selector?)` from inside `render()`.

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  rowSortingFeature,
  createSortedRowModel,
  sortFns,
  tableFeatures,
  type ColumnDef,
} from '@tanstack/lit-table'

type Person = { firstName: string; lastName: string; age: number }

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  { accessorKey: 'lastName', header: () => html`<span>Last Name</span>` },
  { accessorKey: 'age', header: 'Age' },
]

@customElement('people-table')
export class PeopleTable extends LitElement {
  // ONE controller per host. The constructor calls host.addController(this).
  private tableController = new TableController<typeof features, Person>(this)

  @state()
  private data: Person[] = []

  protected render() {
    const table = this.tableController.table(
      {
        features,
        columns,
        data: this.data,
      },
      (state) => ({ sorting: state.sorting }),
    )

    return html`
      <table>
        <thead>
          ${repeat(
            table.getHeaderGroups(),
            (hg) => hg.id,
            (hg) => html`
              <tr>
                ${repeat(
                  hg.headers,
                  (h) => h.id,
                  (h) => html`
                    <th @click=${h.column.getToggleSortingHandler()}>
                      ${h.isPlaceholder ? null : FlexRender({ header: h })}
                    </th>
                  `,
                )}
              </tr>
            `,
          )}
        </thead>
        <tbody>
          ${repeat(
            table.getRowModel().rows,
            (r) => r.id,
            (row) => html`
              <tr>
                ${repeat(
                  row.getAllCells(),
                  (c) => c.id,
                  (cell) => html` <td>${FlexRender({ cell })}</td> `,
                )}
              </tr>
            `,
          )}
        </tbody>
      </table>
    `
  }
}
```

Source: `examples/lit/basic-table-controller/src/main.ts`.

## Core Patterns

### 1. `TableController` lifecycle

- Construct once per host (typically as a class field). The constructor calls `host.addController(this)`.
- Call `.table(options, selector?)` inside `render()` (or any place you have a fresh `options` ready). The first call constructs the underlying core table and subscribes the host to `table.store` and `table.optionsStore`. Subsequent calls merge options and return the same logical table instance.
- `hostConnected` re-establishes subscriptions; `hostDisconnected` tears them down.

Source: `packages/lit-table/src/TableController.ts`.

### 2. `.table(options, selector?)` second argument

The selector is a function from full table state to whatever you want exposed on `table.state`. Default is full state. Narrowing documents the host's actual data dependencies. Note this selector only shapes `table.state`; **the host `render()` still re-runs on every `table.store` change** because `TableController` subscribes to the full store. To skip re-rendering an expensive template region when its slice is unchanged, wrap it in the `table.subscribe` directive (Core Pattern 4).

```ts
const table = this.tableController.table(
  { features, columns, data: this._data },
  (state) => ({ pagination: state.pagination }),
)

table.state.pagination
```

Source: `docs/framework/lit/guide/table-state.md`.

### 3. Reading state without subscribing

Direct atom / store reads return the current value without subscribing to changes. The controller already subscribes the host to the full store, so these reads stay reactive through the host's invalidation.

```ts
const pagination = table.atoms.pagination.get()
const sorting = table.atoms.sorting.get()
const snapshot = table.state
```

### 4. `table.subscribe` directive for fine-grained updates

`table.subscribe` is a Lit async directive (backed by `@tanstack/lit-store`'s `TanStackStoreSelector`). It subscribes the wrapped template to a single source and re-renders **only that template region**, leaving the rest of the host template untouched. The region re-renders whenever the selected value's reference changes (identity comparison). Return a specific slice (e.g. `state => state.pagination`) to update only when that slice changes; a selector that builds a fresh object every call re-renders on every store emit. Unlike `table.state`, it can update its slice without re-running the whole host template.

Two call signatures:

```ts
// 1. Selected slice — re-renders only when the `pagination` reference changes
${table.subscribe(
  table.store,
  (state) => state.pagination,
  (pagination) => html`<span>Page ${pagination.pageIndex + 1}</span>`,
)}

// 2. Whole source — any source mutation re-renders the region
${table.subscribe(
  table.atoms.rowSelection,
  (rowSelection) => html`<span>${Object.keys(rowSelection).length} selected</span>`,
)}
```

`source` is any store or atom: `table.store` (full table state), `table.atoms.<slice>`, or an external atom you own.

**Use a stable selector reference.** The directive memoizes on the identity of the `source` and `selector` you pass. Declare selectors as class fields/methods so the same reference is passed every render:

```ts
private getBodyState = (state: ReturnType<typeof this.table.store.get>) => ({
  columnFilters: state.columnFilters,
  pagination: state.pagination,
})

// ...in render():
${this.table.subscribe(this.table.store, this.getBodyState, () => html`<tbody>…</tbody>`)}
```

An inline `(state) => ({ … })` allocates a new function every render, which forces the directive to re-subscribe and re-render every time, defeating the optimization.

Source: `packages/lit-table/src/subscribe-directive.ts`; `examples/lit/basic-subscribe/src/main.ts`.

### 5. External atoms with `createAtom` + `options.atoms`

Move slice ownership to a TanStack Store atom. The table writes to your atom when you call `table.setSorting(...)` etc. — no `on*Change` handler is needed.

Precedence: `options.atoms[key]` > `options.state[key]` > internal `baseAtoms[key]`.

```ts
import { createAtom } from '@tanstack/lit-store'
import {
  TableController,
  rowPaginationFeature,
  tableFeatures,
  type PaginationState,
} from '@tanstack/lit-table'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

// Module-scope atoms — stable identity, shareable across components.
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

@customElement('my-table')
class MyTable extends LitElement {
  private tableController = new TableController<typeof features, Person>(this)

  protected render() {
    const table = this.tableController.table({
      features,
      columns,
      data: this._data,
      atoms: { pagination: paginationAtom },
    })

    const { pageIndex } = paginationAtom.get()
    // ...
  }
}
```

Source: `examples/lit/basic-external-atoms/src/main.ts`.

### 6. External state with `state` + `on*Change`

Classic integration with `@state()` properties. Less atomic than external atoms.

```ts
@state()
private _sorting: SortingState = []

protected render() {
  const table = this.tableController.table({
    features,
    columns,
    data: this._data,
    state: { sorting: this._sorting },
    onSortingChange: (updater) => {
      this._sorting = updater instanceof Function ? updater(this._sorting) : updater
    },
  })
}
```

Source: `docs/framework/lit/guide/table-state.md`.

### 7. `createTableHook` for reusable shared config

Bundle `features` (including row model factories), default options, and pre-bound cell/header components. You get `useAppTable(host, options, selector?)`, `createAppColumnHelper`, and `useTableContext` / `useCellContext` / `useHeaderContext` (Lit Context consumers).

```ts
const { useAppTable, createAppColumnHelper } = createTableHook({
  features: tableFeatures({
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns,
  }),
})

const columnHelper = createAppColumnHelper<Person>()
const columns = columnHelper.columns([
  /* … */
])

@customElement('users-table')
class UsersTable extends LitElement {
  @state() private data: Person[] = []

  // NOTE: capture `this` before the options getter — inside the getter `this`
  // refers to the options object.
  private appTable = (() => {
    const host = this
    return useAppTable(this, {
      columns,
      get data() {
        return host.data
      },
    })
  })()

  protected render() {
    const table = this.appTable.table()

    return html`
      <table>
        <tbody>
          ${table.getRowModel().rows.map(
            (row) => html`
              <tr>
                ${row
                  .getAllCells()
                  .map((c) =>
                    table.AppCell(
                      c,
                      (cell) => html`<td>${cell.FlexRender()}</td>`,
                    ),
                  )}
              </tr>
            `,
          )}
        </tbody>
      </table>
    `
  }
}
```

Source: `examples/lit/basic-app-table/src/main.ts`; `packages/lit-table/src/createTableHook.ts`.

## Common Mistakes

### CRITICAL Creating a new `TableController` every render

Wrong:

```ts
protected render() {
  const controller = new TableController<typeof features, Person>(this) // new instance every render
  const table = controller.table({ /* … */ })
}
```

Correct:

```ts
class MyTable extends LitElement {
  private tableController = new TableController<typeof features, Person>(this) // once

  protected render() {
    const table = this.tableController.table({
      /* … */
    })
  }
}
```

Each `new TableController(host)` registers another controller on the host. The original table is discarded; the new one resubscribes; state is reset every render.
Source: `packages/lit-table/src/TableController.ts`.

### CRITICAL Calling a feature API when the feature is not in `features`

Wrong:

```ts
const features = tableFeatures({}) // no rowPaginationFeature
const table = this.tableController.table({
  features,
  columns,
  data: this._data,
})
table.setPageIndex(0) // TypeScript error AND runtime no-op
```

Correct:

```ts
const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})
const table = this.tableController.table({
  features,
  columns,
  data: this._data,
})
```

v9 generates feature APIs and state slices only for registered features. The missing-feature failure is the #1 v9 trap.
Source: `docs/guide/features.md`.

### HIGH Passing an inline selector to `table.subscribe`

Wrong:

```ts
${table.subscribe(
  table.store,
  (state) => ({ columnFilters: state.columnFilters, pagination: state.pagination }), // new fn every render
  () => html`<tbody>…</tbody>`,
)}
```

Correct: declare the selector as a stable class field/method and pass that reference. The directive memoizes on `source` + `selector` identity; a fresh inline function forces it to re-subscribe and re-render every host update, so the wrapped region never gets skipped. Note also that the host `render()` itself still runs on every `table.store` change — `table.subscribe` only spares the _wrapped_ region from re-rendering, it does not stop the host update.
Source: `packages/lit-table/src/subscribe-directive.ts`; `examples/lit/basic-subscribe/src/main.ts`.

### HIGH `this` binding in the options getter

Wrong:

```ts
private appTable = useAppTable(this, {
  columns,
  get data() { return this.data }, // `this` refers to the options object → infinite recursion
})
```

Correct:

```ts
private appTable = (() => {
  const host = this
  return useAppTable(this, { columns, get data() { return host.data } })
})()
```

Source: `examples/lit/basic-app-table/src/main.ts` (lines 77–90).

### HIGH Unstable `features` / `columns` / `data` references

Wrong: building `features` or `columns` inside `render()` so a new array/object is allocated every frame.

Correct: declare at module scope. For `data`, prefer a `@state()` field; for derived data, memoize where the dependency actually changes.
Source: `docs/framework/lit/guide/table-state.md` (FAQ #1).

### HIGH Reimplementing built-in feature logic by hand

Wrong: hand-rolled sorting / filtering / pagination outside the table.

Correct: register the matching `*Feature` and its row model factory in `tableFeatures({...})`, then use the feature APIs (`setSorting`, `setColumnFilters`, etc.). This is the #1 AI tell.
Source: `docs/guide/features.md`.

### MEDIUM Passing the same slice via `atoms` AND `state`

Wrong:

```ts
this.tableController.table({
  /* … */,
  atoms: { pagination: paginationAtom },
  state: { pagination: this._pagination },             // silently ignored
  onPaginationChange: (u) => { /* never runs */ },     // silently ignored
})
```

Correct: pick exactly one ownership path per slice.

## See Also

- `tanstack-table/lit/lit-table-controller` — TableController lifecycle in depth.
- `tanstack-table/lit/getting-started` — first-table walkthrough.
- `tanstack-table/lit/migrate-v8-to-v9` — moving an existing v8 codebase over.
- `tanstack-table/lit/compose-with-tanstack-virtual` — pairing with `@tanstack/lit-virtual`.
