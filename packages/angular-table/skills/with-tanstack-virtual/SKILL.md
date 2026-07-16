---
name: with-tanstack-virtual
description: >
  Virtualize Angular Table final row or column models inside the correct injection and reactive lifecycle with signal counts, scroll elements, keys, measurement, transforms, sticky regions, grid/flex sizing, and infinite data.
metadata:
  type: composition
  library: '@tanstack/angular-table'
  framework: angular
  library_version: '9.0.0-beta.51'
requires:
  - '@tanstack/table-core#core'
  - getting-started
  - table-state
sources:
  - 'TanStack/table:docs/framework/angular/guide/virtualization.md'
  - 'TanStack/table:examples/angular/virtualized-rows'
  - 'TanStack/table:examples/angular/virtualized-columns'
  - 'TanStack/table:examples/angular/virtualized-infinite-scrolling'
---

This skill builds on `@tanstack/table-core#core`, `getting-started`, and `table-state`. Virtual is a rendering concern over final Table models, not a feature plugin.

## Setup

```ts
import { computed, viewChild } from '@angular/core'
import { injectVirtualizer } from '@tanstack/angular-virtual'
import type { ElementRef } from '@angular/core'

export class VirtualTable {
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

## Core Patterns

### Derive reactive models

Use `computed(() => table.getRowModel().rows)` and `computed(() => table.getVisibleLeafColumns())`. `injectVirtualizer` tracks signal reads in its initializer and requires injection context.

### Own the layout contract

Give the scroll element bounded overflow, create a total-size spacer, and translate or measure each virtual item. Use grid/flex widths for dynamic rows/columns and keep sticky headers inside the correct scroll geometry.

### Gate infinite fetches

When the last virtual item approaches fetched length, fetch only if more server rows exist and a request is not active. Manual sorting requires server-sorted pages and a reset/refetch policy.

## Common Mistakes

### CRITICAL Constructing outside injection context

Wrong:

```ts
export function virtualize(options) {
  return injectVirtualizer(() => options)
}
```

Correct:

```ts
export class VirtualTable {
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
  <div style="position:absolute"></div>
</div>
```

Virtual computes ranges and sizes but does not apply DOM geometry, sticky CSS, or column widths.

Source: `examples/angular/virtualized-columns/src/app/app.ts`

## API Discovery

Inspect installed `@tanstack/angular-table/src`, installed `@tanstack/angular-virtual/src`, and the maintained Angular examples for current row, column, measurement, and infinite patterns.
