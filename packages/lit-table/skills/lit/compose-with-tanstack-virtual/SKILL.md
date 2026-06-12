---
name: lit/compose-with-tanstack-virtual
description: >
  TanStack Table does NOT include virtualization — pair with
  `@tanstack/lit-virtual`. The standard pattern: get the row array from
  `table.getRowModel().rows`, construct a `VirtualizerController(host, opts)`
  alongside `TableController`, feed `rows.length` as the virtualizer count
  inside `render()`, and render only `virtualizer.getVirtualItems()` with each
  row absolutely positioned via `transform: translateY(...)`. Routing keywords:
  lit-virtual, VirtualizerController, virtualization, virtualized-rows, lit
  table.
type: composition
library: tanstack-table
framework: lit
library_version: '9.0.0-alpha.48'
requires:
  - lit/table-state
  - row-expanding
sources:
  - TanStack/table:docs/guide/virtualization.md
  - TanStack/table:examples/lit/virtualized-rows/src/main.ts
  - TanStack/table:examples/react/virtualized-rows/
  - TanStack/table:examples/react/virtualized-columns/
---

> **Maintainer note:** the Lit adapter is scheduled for a rewrite alongside TanStack Lit Store during the v9 beta cycle. APIs in this skill may change in a future beta. The patterns below match `9.0.0-alpha.48`.

TanStack Table is headless — it does not virtualize rows or columns. For long lists, pair the table with `@tanstack/lit-virtual`, which ships `VirtualizerController` — a `ReactiveController` like `TableController`.

## Install

```bash
npm install @tanstack/lit-table @tanstack/lit-virtual
```

## The Pattern (Row Virtualization)

1. Build the table with `TableController` as usual.
2. Construct a `VirtualizerController(host, opts)` once. Capture a `Ref` for the scroll element.
3. Inside `render()`, get `rows = table.getRowModel().rows`, then call `virtualizer.setOptions({ ..., count: rows.length })`.
4. Render only `virtualizer.getVirtualItems()`. Each virtual row is absolutely positioned via `transform: translateY(${item.start}px)`.
5. Attach `ref` on each row to call `virtualizer.measureElement(...)` for dynamic sizing.

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'
import { Ref, createRef, ref } from 'lit/directives/ref.js'
import { VirtualizerController } from '@tanstack/lit-virtual'
import {
  FlexRender,
  TableController,
  columnSizingFeature,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  type ColumnDef,
} from '@tanstack/lit-table'

const features = tableFeatures({
  columnSizingFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const columns: Array<ColumnDef<typeof features, Person>> = [
  { accessorKey: 'id', header: 'ID', size: 60 },
  {
    accessorKey: 'firstName',
    header: 'First',
    cell: (info) => info.getValue(),
  },
  // …
]

@customElement('virtualized-table')
class VirtualizedTable extends LitElement {
  @state()
  private _data: Person[] = makeData(50_000)

  private tableController = new TableController<typeof features, Person>(this)
  private rowVirtualizerController!: VirtualizerController<Element, Element>
  private tableContainerRef: Ref = createRef()

  connectedCallback() {
    this.rowVirtualizerController = new VirtualizerController(this, {
      count: this._data.length,
      getScrollElement: () => this.tableContainerRef.value!,
      estimateSize: () => 33,
      overscan: 5,
    })
    super.connectedCallback()
  }

  protected render() {
    const table = this.tableController.table(
      {
        features,
        columns,
        data: this._data,
      },
      () => ({}),
    )

    const { rows } = table.getRowModel()

    // Sync the virtualizer count with the post-feature rows.
    const virtualizer = this.rowVirtualizerController.getVirtualizer()
    virtualizer.setOptions({ ...virtualizer.options, count: rows.length })

    return html`
      <div
        ${ref(this.tableContainerRef)}
        style="${styleMap({
          overflow: 'auto',
          position: 'relative',
          height: '800px',
        })}"
      >
        <table style="display: grid">
          <thead
            style="${styleMap({
              display: 'grid',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            })}"
          >
            ${repeat(
              table.getHeaderGroups(),
              (hg) => hg.id,
              (hg) => html`
                <tr style="${styleMap({ display: 'flex', width: '100%' })}">
                  ${repeat(
                    hg.headers,
                    (h) => h.id,
                    (h) => html`
                      <th
                        style="${styleMap({
                          display: 'flex',
                          width: `${h.getSize()}px`,
                        })}"
                        @click="${h.column.getToggleSortingHandler()}"
                      >
                        ${FlexRender({ header: h })}
                      </th>
                    `,
                  )}
                </tr>
              `,
            )}
          </thead>
          <tbody
            style="${styleMap({
              display: 'grid',
              height: `${virtualizer.getTotalSize()}px`,
              position: 'relative',
            })}"
          >
            ${repeat(
              virtualizer.getVirtualItems(),
              (item) => item.key,
              (item) => {
                const row = rows[item.index]
                return html`
                  <tr
                    style="${styleMap({
                      display: 'flex',
                      position: 'absolute',
                      transform: `translateY(${item.start}px)`,
                      width: '100%',
                    })}"
                    ${ref((node) => virtualizer.measureElement(node ?? null))}
                  >
                    ${repeat(
                      row.getAllCells(),
                      (c) => c.id,
                      (cell) => html`
                        <td
                          style="${styleMap({
                            display: 'flex',
                            width: `${cell.column.getSize()}px`,
                          })}"
                        >
                          ${FlexRender({ cell })}
                        </td>
                      `,
                    )}
                  </tr>
                `
              },
            )}
          </tbody>
        </table>
      </div>
    `
  }
}
```

Source: `examples/lit/virtualized-rows/src/main.ts`.

## Column Virtualization

Same shape, but the virtualizer's `count` is `columns.length` (or visible columns) and you index visible columns inside each row. Useful for wide kitchen-sink tables. The horizontal virtualizer's options include `horizontal: true`.

## With Pagination / Filtering

Always use `table.getRowModel().rows.length` as the count — that's the post-feature row array (sorted, filtered, paginated). The virtualizer should never wrap the raw `data` array.

## With `@tanstack/lit-table`'s `Subscribe`

The current Lit adapter wires host invalidation through the full store, so re-renders are already triggered when slices change. Use `table.Subscribe` for render-time projections; don't expect source-mode invalidation savings yet.
Source: `packages/lit-table/src/TableController.ts`.

## Common Mistakes

### CRITICAL Reimplementing virtualization by hand

Wrong: manual slicing + intersection observers + per-row offset math.

Correct: use `@tanstack/lit-virtual`'s `VirtualizerController`. It handles measurement, overscan, scroll alignment, and dynamic sizing.
Source: `docs/guide/virtualization.md`.

### HIGH Using the wrong row source

Wrong:

```ts
new VirtualizerController(this, { count: this._data.length /* … */ })
```

Correct:

```ts
const { rows } = table.getRowModel()
virtualizer.setOptions({ ...virtualizer.options, count: rows.length })
```

Always count post-feature rows, not raw data.
Source: `examples/lit/virtualized-rows/src/main.ts`.

### HIGH Constructing `VirtualizerController` inside `render()`

Wrong: new controller per frame.

Correct: construct once (typically in `connectedCallback`) and call `setOptions` per render to sync `count`.
Source: `examples/lit/virtualized-rows/src/main.ts` (lines 77–85).

### HIGH Forgetting `position: relative` on the scroll parent / `position: absolute` on rows

Wrong: rows stack at the top because there's no positioned ancestor with the total height.

Correct: scroll parent uses `position: relative`, `<tbody>` uses `height: virtualizer.getTotalSize() + 'px'`, each row uses `position: absolute` + `transform: translateY(...)`.

### MEDIUM Mixing virtualization with `manualPagination`

You usually don't need both. Server pagination already limits the row count. Virtualize when the client holds the full dataset.

## See Also

- `tanstack-table/lit/table-state` — Subscribe for fine-grained re-renders.
- `tanstack-table/lit/lit-table-controller` — controller lifecycle.
- `tanstack-table/row-expanding` — virtualizing rows with sub-component rows requires variable height + measureElement.
