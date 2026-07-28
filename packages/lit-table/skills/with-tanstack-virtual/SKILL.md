---
name: with-tanstack-virtual
description: >
  Virtualize Lit Table final row or column models with @tanstack/lit-virtual VirtualizerController, host lifecycle-aware counts, scroll refs, stable keys, dynamic measurement, sticky CSS, grid/flex sizing, and infinite data. Load for large rendered tables; Virtual is renderer composition, not tableFeatures.
metadata:
  type: composition
  library: '@tanstack/lit-table'
  framework: lit
  library_version: '9.0.0-beta.58'
requires:
  - '@tanstack/table-core#core'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/lit/guide/virtualization.md'
  - 'TanStack/table:examples/lit/virtualized-rows'
  - 'TanStack/table:examples/lit/virtualized-columns'
  - 'TanStack/table:examples/lit/virtualized-infinite-scrolling'
---

This skill builds on @tanstack/table-core#core plus this package's getting-started and table-state skills.

## Setup

```ts
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { VirtualizerController } from '@tanstack/lit-virtual'
import {
  TableController,
  tableFeatures,
  type ColumnDef,
} from '@tanstack/lit-table'

type Item = { id: string; name: string }
const features = tableFeatures({})
const columns: Array<ColumnDef<typeof features, Item>> = [
  { accessorKey: 'name', header: 'Name' },
]
const data: Array<Item> = Array.from({ length: 10_000 }, (_, id) => ({
  id: String(id),
  name: `Item ${id}`,
}))

@customElement('virtual-items')
export class VirtualItems extends LitElement {
  private controller = new TableController<typeof features, Item>(this)
  private scroller = createRef<HTMLDivElement>()
  private virtualizer = new VirtualizerController(this, {
    count: data.length,
    getScrollElement: () => this.scroller.value,
    estimateSize: () => 32,
    overscan: 5,
  })

  protected render() {
    const table = this.controller.table({
      features,
      columns,
      data,
      getRowId: (row) => row.id,
    })
    const rows = table.getRowModel().rows
    const v = this.virtualizer.getVirtualizer()
    v.setOptions({ ...v.options, count: rows.length })

    return html`<div
      ${ref(this.scroller)}
      style="height:400px;overflow:auto;position:relative"
    >
      <div style="height:${v.getTotalSize()}px;position:relative">
        ${v
          .getVirtualItems()
          .map(
            (item) =>
              html`<div
                style="position:absolute;transform:translateY(${item.start}px)"
              >
                ${rows[item.index].getValue('name')}
              </div>`,
          )}
      </div>
    </div>`
  }
}
```

## Core Patterns

### Virtualize the final row model

Set the virtualizer count from `table.getRowModel().rows.length`; index virtual items into that same array so filtering, sorting, expansion, and pagination are respected.

### Keep geometry sources consistent

For column virtualization, estimate from `column.getSize()` and remeasure when columnSizing changes. Render widths from the same sizing state.

### Treat unsupported combinations as user composition

Drag-and-drop plus virtualization is not a maintained Table recipe. Start from the maintained Virtual example and reconcile both libraries' transforms, measurement, and auto-scroll contracts explicitly.

## Common Mistakes

### HIGH Virtualizing raw data

Wrong: index virtual items into the original `data` array.

Correct: index into `table.getRowModel().rows`.

Raw data ignores active Table processing and produces mismatched rows after sorting or filtering.

Source: TanStack/table:examples/lit/virtualized-rows

### HIGH Count and rows come from different models

Wrong: use `data.length` after filters change but render filtered rows.

Correct: update the virtualizer count from the same current `rows` array being rendered.

Mismatched geometry can index undefined rows or leave blank scroll space.

Source: TanStack/table:examples/lit/virtualized-rows

### HIGH Recreating columns during host renders

Wrong: pass `columns: [...columns]` from `render()` to work around a readonly tuple.

Correct: declare a stable mutable `Array<ColumnDef<typeof features, Item>>` once and pass `columns` directly.

Lit host updates can be driven by scrolling and measurement. A fresh column reference rebuilds Table's column pipeline on every such render.

Source: TanStack/table:examples/lit/virtualized-rows

### HIGH Sticky and sizing CSS assumed automatic

Wrong: add a VirtualizerController and expect sticky headers, widths, and transforms.

Correct: implement the scroll container, total-size spacer, absolute row transforms, sticky regions, and widths in Lit CSS/templates.

Both libraries are headless over rendering geometry.

Source: TanStack/table:docs/framework/lit/guide/virtualization.md

## API Discovery

Inspect `node_modules/@tanstack/lit-table/dist/index.d.ts` and `node_modules/@tanstack/lit-virtual/dist/`. Use maintained examples for geometry; do not register Virtual in `tableFeatures`.
