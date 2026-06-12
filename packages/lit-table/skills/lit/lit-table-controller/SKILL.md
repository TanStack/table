---
name: lit/lit-table-controller
description: >
  The `TableController` ReactiveController pattern for hosting a TanStack Table
  instance inside a LitElement. One controller per host (constructed in a class
  field); `.table(options, selector?)` called from `render()`. The controller
  installs the Lit `coreReactivityFeature`, subscribes the host to `table.store`
  and `table.optionsStore`, and tears those subscriptions down on
  `hostDisconnected`. Routing keywords: TableController, ReactiveController,
  ReactiveControllerHost, hostConnected, hostDisconnected, lit-table.
type: framework
library: tanstack-table
framework: lit
library_version: '9.0.0-alpha.48'
requires:
  - lit/table-state
sources:
  - TanStack/table:docs/framework/lit/lit-table.md
  - TanStack/table:docs/framework/lit/guide/table-state.md
  - TanStack/table:packages/lit-table/src/TableController.ts
  - TanStack/table:packages/lit-table/src/reactivity.ts
  - TanStack/table:examples/lit/basic-table-controller/src/main.ts
---

> **Maintainer note:** the Lit adapter is scheduled for a rewrite alongside TanStack Lit Store during the v9 beta cycle. `TableController`'s invalidation model and `Subscribe` mode may change in a future beta. The patterns below match `9.0.0-alpha.48`.

`TableController` is the Lit-specific entry point for `@tanstack/lit-table`. It implements the Lit `ReactiveController` interface, hosts the underlying core `Table` instance, and bridges TanStack Store atom changes to `host.requestUpdate()` calls. This skill explains the lifecycle in detail.

## What `TableController` actually does

```ts
export class TableController<TFeatures, TData> implements ReactiveController {
  constructor(host: ReactiveControllerHost) {
    ;(this.host = host).addController(this) // registers controller on host
  }

  public table(tableOptions, selector?) {
    if (!this._table) {
      // First call: build the core table with the Lit reactivity bindings.
      this._table = constructTable({
        ...tableOptions,
        features: {
          coreReactivityFeature: litReactivity(),
          ...tableOptions.features,
        },
        mergeOptions: (def, next) => ({ ...def, ...next }),
      })
      this._setupSubscriptions()
    }
    // Subsequent calls: merge new options.
    this._table.setOptions((prev) => ({ ...prev, ...tableOptions }))

    return {
      /* ...this._table, Subscribe, FlexRender, get state() {...} */
    }
  }

  private _setupSubscriptions() {
    this._storeSubscription = this._table.store.subscribe(() =>
      this.host.requestUpdate(),
    )
    this._optionsSubscription = this._table.optionsStore!.subscribe(() =>
      this.host.requestUpdate(),
    )
  }

  hostConnected() {
    this._setupSubscriptions()
  }
  hostDisconnected() {
    this._storeSubscription?.unsubscribe()
    this._optionsSubscription?.unsubscribe()
  }
}
```

Source: `packages/lit-table/src/TableController.ts` (full file).

Key points:

1. **One core table per controller.** The first `.table(options)` call constructs it; later calls merge options into the same instance.
2. **Two subscriptions:** `table.store` (state) and `table.optionsStore` (options). Both call `host.requestUpdate()`.
3. **Subscriptions are torn down on `hostDisconnected`** and reset on `hostConnected`.
4. **`Subscribe` is whole-store.** The current adapter does not split host invalidation by source; `table.Subscribe` reads its source at render time, but the host still re-renders on any store change.

## Lifecycle Diagram

```text
   constructor                    render()                       hostDisconnected
        │                             │                                  │
        ▼                             ▼                                  ▼
host.addController(this)     this.tableController.table(opts)     unsubscribe(store)
                                │                                  unsubscribe(options)
                                ▼
              (first call)  constructTable(opts) + _setupSubscriptions
              (later calls) table.setOptions(prev => ({ ...prev, ...opts }))
                                │
                                ▼
                       returns { ...table, Subscribe, FlexRender, state }
```

## Canonical Setup

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  tableFeatures,
  type ColumnDef,
} from '@tanstack/lit-table'

const features = tableFeatures({}) // module scope

const columns: Array<ColumnDef<typeof features, Person>> = [
  /* … module scope … */
]

@customElement('people-table')
class PeopleTable extends LitElement {
  // ONE controller, constructed as a class field.
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
      () => ({}), // selector — empty when you don't need to project state
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
                  (h) => html`<th>${FlexRender({ header: h })}</th>`,
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
                  (cell) => html`<td>${FlexRender({ cell })}</td>`,
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

## Multiple Tables in One Host

Each table needs its own controller. Don't try to share one across instances.

```ts
class DashboardElement extends LitElement {
  private peopleController = new TableController<
    typeof _peopleFeatures,
    Person
  >(this)
  private projectsController = new TableController<
    typeof _projectsFeatures,
    Project
  >(this)

  protected render() {
    const people = this.peopleController.table({
      /* … */
    })
    const projects = this.projectsController.table({
      /* … */
    })

    return html`
      <people-section .data=${people}></people-section>
      <projects-section .data=${projects}></projects-section>
    `
  }
}
```

## Reading State Off the Controller

The controller's `.table(...)` return value carries everything you usually need: feature methods, `FlexRender`, `Subscribe`, and the `state` projection. Direct reads off `table.atoms.<slice>.get()` and `table.state.<slice>` are current-value reads; reactivity comes from the host invalidation subscriptions the controller already wires up.

```ts
// Inside render():
const pagination = table.atoms.pagination.get() // current value
const snapshot = table.state // current full state
const selected = table.state // projected via the selector you passed to .table()
```

## Common Mistakes

### CRITICAL Creating a new `TableController` per render

Wrong:

```ts
protected render() {
  const controller = new TableController<typeof features, Person>(this) // every frame
  const table = controller.table({ /* … */ })
}
```

Correct: construct the controller once as a class field.

```ts
private tableController = new TableController<typeof features, Person>(this)

protected render() {
  const table = this.tableController.table({ /* … */ })
}
```

Each new controller installs another subscription on the host; old controller state is discarded; table state resets every frame.
Source: `packages/lit-table/src/TableController.ts`.

### CRITICAL Calling `.table()` outside `render()` and caching the return value

Wrong:

```ts
connectedCallback() {
  super.connectedCallback()
  this.cachedTable = this.tableController.table({ features, columns, data: this.data })
}

protected render() {
  return html`${this.cachedTable.getRowModel().rows.map(/* … */)}`
}
```

Correct: call `.table()` each `render()`. The options are merged into the same logical table on each call, and the returned object carries fresh state/projections.

```ts
protected render() {
  const table = this.tableController.table({ features, columns, data: this.data })
  return html`${table.getRowModel().rows.map(/* … */)}`
}
```

Source: `packages/lit-table/src/TableController.ts`.

### HIGH Forgetting that `Subscribe` re-renders the host on any store change

Wrong: assuming `table.Subscribe({ source: table.atoms.rowSelection, … })` makes the host invalidate only on selection changes.

Correct: in the current adapter, the host's `requestUpdate()` is wired to the full `table.store` and `table.optionsStore`. `Subscribe` is a render-time projection convenience; it does not narrow host invalidation. Plan accordingly for large lists.
Source: `packages/lit-table/src/TableController.ts` (lines 200–218 + `_setupSubscriptions`).

### HIGH Building `features` inside `render()`

Wrong:

```ts
protected render() {
  const features = tableFeatures({ rowSortingFeature }) // new each frame
  const table = this.tableController.table({ features, /* … */ })
}
```

Correct: declare `features` at module scope (or once on the class, frozen). Identity drives internal memos.

```ts
const features = tableFeatures({ rowSortingFeature })
```

Source: `docs/framework/lit/guide/table-state.md` (FAQ #1).

### MEDIUM Calling `.table()` from a non-host context (e.g. a child component)

Wrong: passing the controller down and calling `.table()` from a different LitElement. The subscriptions belong to the host that constructed the controller — calling from elsewhere is undefined behavior.

Correct: each LitElement that needs its own table builds its own controller. Use `createTableHook`'s `useTableContext` / `useCellContext` / `useHeaderContext` (`@lit/context`) to access a table from descendant elements.
Source: `packages/lit-table/src/createTableHook.ts`.

## See Also

- `tanstack-table/lit/table-state` — atoms, Subscribe, FlexRender, createTableHook.
- `tanstack-table/lit/getting-started` — first-table walkthrough.
- `tanstack-table/lit/compose-with-tanstack-virtual` — pairing with `@tanstack/lit-virtual`.
