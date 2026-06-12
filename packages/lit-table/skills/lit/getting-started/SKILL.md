---
name: lit/getting-started
description: >
  End-to-end first-table journey for `@tanstack/lit-table` v9: install the
  adapter (plus required `lit` and `@lit/context` peers), declare `features`
  via `tableFeatures()` (row model factories live as slots on the features
  object), build a typed column helper, construct one `TableController` per
  LitElement host, call `.table(options, selector?)` inside `render()`, and
  render with `FlexRender({ cell|header|footer })`. Routing keywords: install
  lit-table, first table, getting started, TableController,
  basic-table-controller, tableFeatures.
type: lifecycle
library: tanstack-table
framework: lit
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - column-definitions
  - state-management
  - lit/table-state
sources:
  - TanStack/table:docs/installation.md
  - TanStack/table:docs/framework/lit/lit-table.md
  - TanStack/table:examples/lit/basic-table-controller/src/main.ts
  - TanStack/table:packages/lit-table/src/TableController.ts
---

> **Maintainer note:** the Lit adapter is scheduled for a rewrite alongside TanStack Lit Store during the v9 beta cycle. APIs in this skill may change in a future beta. The patterns below match `9.0.0-alpha.48`.

This skill walks through a first working Lit v9 table end-to-end. Read `tanstack-table/setup` and `tanstack-table/state-management` for v9 core concepts and `tanstack-table/lit/lit-table-controller` for the controller lifecycle.

## Install

`@tanstack/lit-table` is the Lit adapter. It depends on `@tanstack/table-core` and `@tanstack/store`, and lists `lit` and `@lit/context` as peer dependencies.

```bash
npm install @tanstack/lit-table lit @lit/context
```

Peer dependency versions: `lit ^3.1.3`, `@lit/context ^1.1.0`.

Source: `packages/lit-table/package.json`.

## Step 1 — Declare `features`

v9 is explicit about what a table uses. Use `tableFeatures({...})` at module scope. The TypeScript shape drives state inference, API surface, and tree-shaking.

```ts
import {
  tableFeatures,
  rowPaginationFeature,
  rowSortingFeature,
} from '@tanstack/lit-table'

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
})
```

If `features` does not include `rowSelectionFeature`, then `table.atoms.rowSelection`, `table.setRowSelection`, etc. become TypeScript errors — and the runtime won't ship that logic. Pass `tableFeatures({})` for a minimum-overhead table with just the core row model.

Source: `docs/framework/lit/lit-table.md`; `docs/guide/features.md`.

## Step 2 — Add row model factories to `features`

Each registered feature that needs a row-model stage gets its factory as a slot directly on the `tableFeatures({...})` call. Pass any associated `*Fns` maps as additional slots.

```ts
import {
  tableFeatures,
  rowPaginationFeature,
  rowSortingFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  sortFns,
} from '@tanstack/lit-table'

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
```

The core row model is always included. A feature-free table needs only `tableFeatures({})`.

Update the `features` declaration from Step 1 to include these slots instead of keeping a separate object.

## Step 3 — Type your data and build columns

```ts
import type { ColumnDef } from '@tanstack/lit-table'
import { html } from 'lit'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    header: () => html`<span>Last Name</span>`,
    cell: (info) => html`<i>${info.getValue<string>()}</i>`,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    cell: (info) => info.renderValue(),
  },
  { accessorKey: 'visits', header: () => html`<span>Visits</span>` },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'progress', header: 'Profile Progress' },
]
```

For a more type-safe path, use `createColumnHelper<typeof features, Person>()`.

Source: `examples/lit/basic-table-controller/src/main.ts`.

## Step 4 — Build the LitElement host with `TableController`

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { FlexRender, TableController } from '@tanstack/lit-table'

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  // ONE controller per host. Constructed as a class field so the constructor's
  // `host.addController(this)` call happens once.
  private tableController = new TableController<typeof features, Person>(this)

  @state()
  private data: Person[] = makeData(20)

  private rerender() {
    this.data = makeData(20)
  }

  protected render() {
    // Build the table for THIS render pass.
    // First call constructs the core table + subscribes the host to table.store.
    // Later calls merge options into the same instance.
    const table = this.tableController.table(
      {
        features,
        columns,
        data: this.data,
      },
      () => ({}), // empty selector — we don't need to project state for this minimal example
    )

    return html`
      <button @click=${() => this.rerender()}>Rerender</button>
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
        <tfoot>
          ${repeat(
            table.getFooterGroups(),
            (fg) => fg.id,
            (fg) => html`
              <tr>
                ${repeat(
                  fg.headers,
                  (h) => h.id,
                  (h) => html`
                    <th>
                      ${h.isPlaceholder ? null : FlexRender({ footer: h })}
                    </th>
                  `,
                )}
              </tr>
            `,
          )}
        </tfoot>
      </table>
    `
  }
}
```

Source: `examples/lit/basic-table-controller/src/main.ts` (lines 53–162).

## Step 5 — Drive features with feature APIs

```ts
<button @click=${() => table.setPageIndex(0)} ?disabled=${!table.getCanPreviousPage()}>First</button>
<button @click=${() => table.nextPage()}      ?disabled=${!table.getCanNextPage()}>Next</button>
```

For starting values, use `initialState`. For controlled slices, use `atoms` or `state` + `on*Change` — see `tanstack-table/lit/table-state`.

## Common Mistakes

### CRITICAL `new TableController(this)` inside `render()`

Wrong:

```ts
protected render() {
  const controller = new TableController<typeof features, Person>(this) // every frame
  const table = controller.table({ /* … */ })
}
```

Correct:

```ts
private tableController = new TableController<typeof features, Person>(this) // once per host
```

A new controller per render registers a new subscription and resets table state every frame.
Source: `packages/lit-table/src/TableController.ts`.

### CRITICAL Calling a feature API when the feature is not in `features`

Wrong:

```ts
const features = tableFeatures({}) // no rowPaginationFeature
const table = this.tableController.table({
  features,
  columns,
  data: this.data,
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
  data: this.data,
})
```

v9 generates feature APIs and state slices only for registered features. #1 v9 trap.
Source: `docs/guide/features.md`.

### HIGH Forgetting the matching row-model factory slot

Wrong:

```ts
const features = tableFeatures({ rowSortingFeature }) // no sortedRowModel slot
const table = this.tableController.table({ features /* … */ })
table.setSorting([{ id: 'age', desc: true }])
// rows are NOT sorted — no sortedRowModel registered
```

Correct:

```ts
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const table = this.tableController.table({
  features,
  /* … */
})
```

### HIGH Building `features` / `columns` / `data` inside `render()`

Wrong: re-creating these every frame busts internal memos.

Correct: `features` and `columns` at module scope; `data` from a `@state()` field on the element.
Source: `docs/framework/lit/guide/table-state.md` (FAQ #1).

### HIGH Reimplementing built-in feature logic

Wrong: hand-rolled sorting / filtering / pagination outside the table.

Correct: register the feature + factory and use feature APIs. v9 ships built-ins for sorting, filtering, pagination, grouping, expanding, faceting, row selection, column visibility/order/pinning/sizing, and row pinning.
Source: `docs/guide/features.md`.

### MEDIUM Using v8 hook names (`useReactTable`, `getCoreRowModel`, `flexRender(def, ctx)`)

Wrong: v8 imports from a Lit context.

Correct: `@tanstack/lit-table` exposes `TableController` + `FlexRender({ cell | header | footer })`. There is no `useReactTable` here. See `tanstack-table/lit/migrate-v8-to-v9`.

## See Also

- `tanstack-table/lit/table-state` — atoms, Subscribe, createTableHook.
- `tanstack-table/lit/lit-table-controller` — controller lifecycle in depth.
- `tanstack-table/lit/migrate-v8-to-v9` — moving an existing v8 codebase over.
