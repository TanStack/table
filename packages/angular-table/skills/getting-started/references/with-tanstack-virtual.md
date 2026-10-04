# Angular Table with TanStack Virtual

Read when rendering a large Angular table with TanStack Virtual. Virtual operates on the final Table model. Read [table-state](../../table-state/SKILL.md) if model counts or rendered state stop updating.

This reference inherits the version of its owning skill.

## Setup

```ts
import { Component, computed, viewChild } from '@angular/core'
import { injectTable, tableFeatures } from '@tanstack/angular-table'
import { injectVirtualizer } from '@tanstack/angular-virtual'
import type { ElementRef } from '@angular/core'

const features = tableFeatures({})
const columns = [{ accessorKey: 'name' }]
const data = Array.from({ length: 1000 }, (_, index) => ({
  id: String(index),
  name: `Person ${index}`,
}))

@Component({
  selector: 'virtual-table',
  template: `<div #scrollElement style="height:400px;overflow:auto">
    <div [style.height.px]="totalSize()" style="position:relative">
      @for (item of virtualRows(); track item.key) {
        <div
          [attr.data-index]="item.index"
          [style.transform]="'translateY(' + item.start + 'px)'"
          style="position:absolute;height:34px"
        >
          {{ rows()[item.index]!.getValue('name') }}
        </div>
      }
    </div>
  </div>`,
})
export class VirtualTable {
  readonly table = injectTable(() => ({
    features,
    columns,
    data,
    getRowId: (row) => row.id,
  }))
  readonly scrollElement =
    viewChild<ElementRef<HTMLDivElement>>('scrollElement')
  readonly rows = computed(() => this.table.getRowModel().rows)
  readonly rowVirtualizer = injectVirtualizer(() => ({
    count: this.rows().length,
    scrollElement: this.scrollElement()?.nativeElement,
    estimateSize: () => 34,
    getItemKey: (index) => this.rows()[index]!.id,
    overscan: 5,
  }))
  readonly virtualRows = computed(() => this.rowVirtualizer.getVirtualItems())
  readonly totalSize = computed(() => this.rowVirtualizer.getTotalSize())
}
```

## Core patterns

### Derive reactive models

Use `computed(() => table.getRowModel().rows)` for rows. For column virtualization, register `columnVisibilityFeature` before reading `computed(() => table.getVisibleLeafColumns())`; register `columnSizingFeature` when deriving widths from sizing APIs. `injectVirtualizer` tracks signal reads in its initializer and requires injection context.

### Own the layout contract

Give the scroll element bounded overflow, create a total-size spacer, and translate or measure each virtual item. Use grid/flex widths for dynamic rows/columns and keep sticky headers inside the correct scroll geometry.

### Gate infinite fetches

When the last virtual item approaches fetched length, fetch only if more server rows exist and a request is not active. Manual sorting requires server-sorted pages and a reset/refetch policy.

## Common mistakes

### CRITICAL Constructing outside injection context

Wrong:

```ts
export function virtualize(options) {
  return injectVirtualizer(() => options)
}
```

Correct:

```ts
const features = tableFeatures({})
const columns = [{ accessorKey: 'name' }]
const data = Array.from({ length: 1000 }, (_, index) => ({
  id: String(index),
  name: `Person ${index}`,
}))

@Component({
  selector: 'virtual-table',
  template: `<div #scrollElement style="height:400px;overflow:auto">
    <div [style.height.px]="totalSize()" style="position:relative">
      @for (item of virtualRows(); track item.key) {
        <div
          [attr.data-index]="item.index"
          [style.transform]="'translateY(' + item.start + 'px)'"
          style="position:absolute;height:34px"
        >
          {{ rows()[item.index]!.getValue('name') }}
        </div>
      }
    </div>
  </div>`,
})
export class VirtualTable {
  readonly table = injectTable(() => ({
    features,
    columns,
    data,
    getRowId: (row) => row.id,
  }))
  readonly virtualizer = injectVirtualizer(() => options())
}
```

The Angular virtualizer follows DI lifecycle rules just like `injectTable`.

Source: `examples/angular/virtualized-rows/src/app/app.ts`

### HIGH Virtualizing raw data

Wrong:

```ts
readonly rows = computed(() => this.data())
```

Correct:

```ts
readonly rows = computed(() => this.table.getRowModel().rows)
```

Raw data bypasses Table filtering, sorting, expansion, grouping, and pagination.

Source: `docs/framework/angular/guide/virtualization.md`

### HIGH Forgetting spacer and transforms

Wrong:

```html
@for (item of virtualRows(); track item.key) {
<div>{{ rows()[item.index].id }}</div>
}
```

Correct:

```html
<div [style.height.px]="totalSize()" style="position:relative">
  @for (item of virtualRows(); track item.key) {
  <div
    [style.transform]="'translateY(' + item.start + 'px)'"
    style="position:absolute;height:34px"
  >
    {{ rows()[item.index]!.getValue('name') }}
  </div>
  }
</div>
```

Virtual computes ranges and sizes but does not apply DOM geometry, sticky CSS, or column widths.

Source: `examples/angular/virtualized-columns/src/app/app.ts`

## API discovery

Inspect installed `@tanstack/angular-table/dist/types/`, installed `@tanstack/angular-virtual/dist/`, and the maintained Angular examples for current row, column, measurement, and infinite patterns.

## Sources

- `TanStack/table:docs/framework/angular/guide/virtualization.md`
- `TanStack/table:examples/angular/virtualized-rows`
- `TanStack/table:examples/angular/virtualized-columns`
- `TanStack/table:examples/angular/virtualized-infinite-scrolling`
