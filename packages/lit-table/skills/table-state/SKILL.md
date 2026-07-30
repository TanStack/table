---
name: table-state
description: >
  Use TableController-selected table.state, table.atoms/store, stable table.subscribe selectors, controlled reactive properties plus on*Change, and external TanStack Store atoms. Load when Lit state appears stale, host updates are too broad, or table state must be shared outside the element.
metadata:
  type: framework
  library: '@tanstack/lit-table'
  framework: lit
  library_version: '9.0.0-beta.62'
requires:
  - '@tanstack/table-core#core'
  - getting-started
sources:
  - 'TanStack/table:docs/framework/lit/guide/table-state.md'
  - 'TanStack/table:examples/lit/basic-external-state'
  - 'TanStack/table:packages/lit-table/src/TableController.ts'
---

This skill builds on @tanstack/table-core#core and this package's getting-started skill.

## State Mental Model

TanStack Table is primarily a state coordinator. Keep state internal unless another subsystem needs to read, persist, or drive it. Without `initialState`, `atoms`, `state`, or `on[State]Change`, the table owns every registered slice.

- `table.baseAtoms` are internal writable atoms initialized from resolved initial state.
- `table.atoms` are readonly derived atoms for the active owner of each registered slice.
- `table.store` combines those atoms into one readonly flat store.
- `table.state` is only the value selected by the second `controller.table` argument.

`TableController` subscribes to state/options and requests host updates. State is feature-based: if pagination is missing from options, atoms, or types, register `rowPaginationFeature`. Keep `features`, `columns`, and `data` references stable across `render()` calls; never create arrays or derive rows inline in the `controller.table` options.

## Setup

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import {
  TableController,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/lit-table'
import type { PaginationState } from '@tanstack/lit-table'

type Item = { id: string }
const features = tableFeatures({ rowPaginationFeature })
const columns = [{ accessorKey: 'id' }]
const data: Item[] = [{ id: '1' }]

@customElement('paged-items')
export class PagedItems extends LitElement {
  @state() private pagination: PaginationState = { pageIndex: 0, pageSize: 10 }
  private controller = new TableController<typeof features, Item>(this)

  protected render() {
    const table = this.controller.table(
      {
        features,
        columns,
        data,
        state: { pagination: this.pagination },
        onPaginationChange: (updater) => {
          this.pagination =
            typeof updater === 'function' ? updater(this.pagination) : updater
        },
      },
      (state) => ({ pagination: state.pagination }),
    )

    return html`<button @click=${() => table.nextPage()}>
      Page ${table.state.pagination.pageIndex + 1}
    </button>`
  }
}
```

## Core Patterns

### Read selected render state from table.state

The second argument to `controller.table` defines the shape of `table.state`. Its selector should be stable when reused across renders.

### Read one current slice from its atom

`table.atoms.pagination.get()` returns the current pagination snapshot. Use it in event handlers; use selected state or `table.subscribe` when a template region must update reactively.

### Put narrow reactive islands in table.subscribe

```ts
const page = table.subscribe(
  table.store,
  (state) => state.pagination.pageIndex,
  (pageIndex) => html`<span>Page ${pageIndex + 1}</span>`,
)
```

Keep the selector reference stable for repeated subscription sites.

## Choose State Ownership

Use exactly one owner per slice:

- Prefer internal state and feature APIs for table-local behavior.
- Use `initialState` for starting/reset values. Changing it later does not reset current state.
- Prefer a stable external TanStack Store atom in `atoms` when state is shared. Feature APIs write it directly, so omit `on[State]Change`.
- Use a reactive host property in `state.<slice>` plus its matching callback for simple controlled state. Write raw values and resolved updater functions back to the property.

External atoms take precedence over external `state`, which syncs into the internal base atom. Do not configure multiple owners. The global v8 `onStateChange` option is gone; subscribe to `table.store` if all state changes must be observed.

## Initialize, Update, and Reset

Prefer `setSorting`, `nextPage`, `toggleVisibility`, `toggleSelected`, and other feature methods. Direct `baseAtoms` writes are a rare escape hatch for internal state; write the supplied external atom when it owns the slice.

```ts
table.resetSorting()
table.resetPagination()
table.resetPagination(true)
```

Feature resets use `table.initialState` unless `true` requests the feature default and can update external owners. Core `table.reset()` resets internal base atoms only. Use slice types such as `PaginationState` and use `TableState<typeof features>` for the complete feature-inferred state.

## Common Mistakes

### HIGH Callback freezes controlled state

Wrong: provide `onPaginationChange` but omit `state.pagination`.

Correct: pass the current controlled value and write both direct values and updater functions back to the owning property.

An on-change callback marks the slice as externally managed; failing to feed the next value back leaves the table reading the old value.

Source: TanStack/table:docs/framework/lit/guide/table-state.md

### HIGH Snapshot read mistaken for subscription

Wrong: cache `const page = table.store.state.pagination.pageIndex` outside render and expect it to change.

Correct: read selected `table.state` during render or create a `table.subscribe` template island.

A store snapshot is current data, not a continuing Lit subscription.

Source: TanStack/table:packages/lit-table/src/TableController.ts

### MEDIUM Unstable selector defeats update gating

Wrong: create unrelated selector closures throughout the render tree.

Correct: define reusable selectors as stable class fields or module functions.

TableController shallow-compares selected output; stable selector intent avoids unnecessary subscription churn.

Source: TanStack/table:docs/framework/lit/guide/table-state.md

## API Discovery

Inspect `node_modules/@tanstack/lit-table/dist/TableController.d.ts`, then `node_modules/@tanstack/table-core/dist/core/table/` for state precedence and updater behavior.
