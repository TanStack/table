---
name: angular/compose-with-tanstack-virtual
description: >
  Compose TanStack Table v9 with `@tanstack/angular-virtual` for virtualized rendering of large
  row sets. TanStack Table does NOT virtualize on its own. Pattern: get `rows = table.getRowModel().rows`,
  feed `rows.length` to `injectVirtualizer({ count, estimateSize, getScrollElement, overscan })`,
  iterate `virtualizer.getVirtualItems()` in the template, position each row with
  `transform: translateY(item.start)` inside a tall sentinel, set
  `[style.height.px]="virtualizer.getTotalSize()"` to make the scrollbar correct. Handle the
  table-feature interactions: row-expanding (variable subRow heights → measure with
  `measureElement`), column sizing/pinning (column virtualization is separate),
  row-selection (selection state survives virtualization because it's keyed by row ID).
type: composition
library: tanstack-table
framework: angular
library_version: '9.0.0-alpha.48'
requires:
  - angular/table-state
  - angular/getting-started
  - angular/angular-rendering-directives
sources:
  - TanStack/table:docs/framework/angular/angular-table.md
  - TanStack/virtual:packages/angular-virtual/src/
  - TanStack/table:examples/angular/basic-inject-table/
---

# Compose with TanStack Virtual (Angular)

> TanStack Table is headless — it computes which rows / cells exist, but does
> not decide which ones to render to the DOM. For tables larger than a few
> hundred visible rows, pair with [`@tanstack/angular-virtual`](https://tanstack.com/virtual)
> so only the rows in the viewport (+ overscan) actually mount.
>
> Required reading: `tanstack-table/angular/getting-started` and
> `tanstack-table/angular/table-state`.

---

## 1. Install

```bash
pnpm add @tanstack/angular-virtual
```

Requires the same Angular version as `@tanstack/angular-table`.

---

## 2. The integration in one shape

```ts
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  viewChild,
  ElementRef,
} from '@angular/core'
import {
  FlexRender,
  injectTable,
  tableFeatures,
  type ColumnDef,
} from '@tanstack/angular-table'
import { injectVirtualizer } from '@tanstack/angular-virtual'

const features = tableFeatures({})

@Component({
  selector: 'app-virtual-table',
  imports: [FlexRender],
  templateUrl: './virtual-table.html',
  styleUrl: './virtual-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualTable {
  readonly data = signal<Array<Person>>(makeData(50_000))
  readonly scrollContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('scroll')

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    getRowId: (row) => row.id,
  }))

  // Stable reference to the rows array for the virtualizer
  readonly rows = computed(() => this.table.getRowModel().rows)

  readonly rowVirtualizer = injectVirtualizer(() => ({
    count: this.rows().length,
    getScrollElement: () => this.scrollContainer().nativeElement,
    estimateSize: () => 36, // fixed-height rows
    overscan: 10,
  }))
}
```

```html
<!-- virtual-table.html -->
<div #scroll class="scroll-container" style="height: 600px; overflow: auto">
  <table style="display: grid">
    <thead style="display: grid; position: sticky; top: 0; z-index: 1">
      @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
      <tr style="display: flex; width: 100%">
        @for (header of headerGroup.headers; track header.id) {
        <th style="display: flex">
          <ng-container *flexRenderHeader="header; let value"
            >{{ value }}</ng-container
          >
        </th>
        }
      </tr>
      }
    </thead>

    <tbody
      style="display: grid; position: relative"
      [style.height.px]="rowVirtualizer.getTotalSize()"
    >
      @for (virtualRow of rowVirtualizer.getVirtualItems(); track
      virtualRow.key) { @let row = rows()[virtualRow.index];
      <tr
        [attr.data-index]="virtualRow.index"
        style="display: flex; position: absolute; width: 100%"
        [style.transform]="'translateY(' + virtualRow.start + 'px)'"
      >
        @for (cell of row.getVisibleCells(); track cell.id) {
        <td style="display: flex">
          <ng-container *flexRenderCell="cell; let value"
            >{{ value }}</ng-container
          >
        </td>
        }
      </tr>
      }
    </tbody>
  </table>
</div>
```

### What's doing what

- **Table** produces `rows` (`table.getRowModel().rows`). Length, identity,
  order are decided by registered features (sort, filter, pagination,
  grouping).
- **Virtualizer** turns `rows.length` into the subset of "virtual items"
  currently visible (+ `overscan`). It tracks scroll on `getScrollElement()`
  and emits `getVirtualItems()` keyed by `virtualRow.key` (the row index by
  default).
- **Template** renders only the virtual items, positions each with
  `translateY(virtualRow.start)` inside a sentinel of total height
  `getTotalSize()`. The scrollbar reflects the full row count, but only the
  visible window has DOM nodes.

---

## 3. Mandatory layout details

This integration touches CSS in a few non-obvious places. None are optional:

- **Scroll container has a fixed height** (`height: 600px` / `100vh` /
  whatever) **and `overflow: auto`**. The virtualizer needs both to compute
  visible range.
- **Use `display: grid` on `<table>`, `display: flex` on `<thead>` /
  `<tbody>` / `<tr>`**, or use `<div>` markup. Native `<table>` layout
  defeats positioning rows absolutely. The virtual example above uses CSS
  grid to keep semantic table markup while letting the rows position freely.
- **Container `<tbody>` is `position: relative` with explicit
  `height = virtualizer.getTotalSize()`.** Without that height, the scrollbar
  doesn't reflect the full data.
- **Rows are `position: absolute; top: 0; left: 0; width: 100%` with
  `transform: translateY(virtualRow.start)`.**
- **Sticky header**: `position: sticky; top: 0; z-index: 1` on the `<thead>`
  / its `<tr>` — the scroll container provides the scrolling.

---

## 4. Variable row heights — measure dynamically

When rows can be different heights (expanded subRows, dynamic cell content),
pass `measureElement` and a sensible `estimateSize`:

```ts
readonly rowVirtualizer = injectVirtualizer(() => ({
  count: this.rows().length,
  getScrollElement: () => this.scrollContainer().nativeElement,
  estimateSize: () => 36,
  overscan: 10,
  measureElement: (element) => element?.getBoundingClientRect().height ?? 36,
}))
```

In the template, bind the element so the virtualizer can measure it:

```html
<tr
  #rowEl
  [attr.data-index]="virtualRow.index"
  [virtualizerMeasureElement]="rowVirtualizer"
  ...
></tr>
```

(See `@tanstack/angular-virtual` docs for the exact directive name and API;
the principle is: every mounted row reports its real size, the virtualizer
caches that, scrollbar adjusts.)

---

## 5. Row expanding — `rowExpandingFeature`

Combine with `rowExpandingFeature` for "click to expand details":

- Register `rowExpandingFeature` in `features` and
  `expandedRowModel: createExpandedRowModel()` as a slot on `features`.
- Use `table.getExpandedRowModel().rows` (or `getRowModel().rows`, which
  already includes expansion under `paginateExpandedRows: true` semantics —
  see `tanstack-table/core/row-expanding`).
- **Always use `measureElement`** because expansion changes row heights.
- The virtualizer keys items by index; expanded subRows shift later rows
  down — that's correct and expected.

---

## 6. Row selection works transparently

Row selection is keyed by row ID (`getRowId`), not by DOM presence. A row can
be selected while off-screen; scrolling it into view shows the right checkbox
state. **Always set `getRowId`** — critical for both selection and
virtualizer key stability.

---

## 7. Column virtualization (horizontal)

For very wide tables (50+ columns), virtualize columns too — a second
`injectVirtualizer` over `table.getVisibleLeafColumns().length`. The pattern
mirrors row virtualization but on the X axis. Combine with
`columnPinningFeature` so pinned columns escape the virtualizer (always
rendered, sticky).

That's a meaningfully bigger lift — most tables don't need it. Reach for it
only when you've profiled and column count is the bottleneck.

---

## 8. Interaction with pagination

**If you paginate, you usually don't virtualize.** Pagination already caps
the rendered row count to `pageSize`. Adding virtualization on top is
typically wasted effort — you've already solved the rendering bottleneck.

The exceptions:

- Pages can hold thousands of rows (rare).
- Pagination is "load more" / infinite scroll style — then virtualize the
  accumulated rows.

---

## 9. Interaction with sticky / pinned rows

`rowPinningFeature` + virtualization is fiddly. Pinned rows live at the
top/bottom of the table; they should render _outside_ the virtualizer's
absolute positioning. Render them in dedicated `<thead>` /
top/bottom-of-`<tbody>` sections, and call `table.getCenterRows()` (the
non-pinned rows) to feed the virtualizer. See
`tanstack-table/core/row-pinning` for the API surface.

---

## 10. SSR / first-paint

On the server / first hydration, the scroll container's height is unknown;
the virtualizer can render zero rows. Two mitigations:

- Render a small initial chunk server-side (without the virtualizer) and let
  Angular hydrate into the virtualized version client-side.
- Provide an explicit `initialRect: { width, height }` to the virtualizer
  options for SSR.

---

## Failure modes

### 1. (CRITICAL) Trying to use TanStack Table's own virtualization

There is none. TanStack Table doesn't ship a virtualizer. If an agent
suggests `getVirtualizedRows()` or `enableVirtualization: true` on the table —
those don't exist. Use `@tanstack/angular-virtual`.

### 2. (CRITICAL) Missing height on the scroll container

```html
<!-- ❌ no height → virtualizer reports 0 visible items → nothing renders -->
<div #scroll style="overflow: auto">
  <!-- ✅ -->
  <div #scroll style="height: 600px; overflow: auto"></div>
</div>
```

The virtualizer measures the _scroll element_'s viewport. Without an explicit
or computed height, the viewport is 0 and nothing renders.

### 3. (CRITICAL) Missing `getTotalSize()` height on the row container

```html
<!-- ❌ scrollbar reflects only the rendered rows, not the full dataset -->
<tbody>
  <!-- ✅ -->
</tbody>

<tbody [style.height.px]="rowVirtualizer.getTotalSize()"></tbody>
```

Without this, you can scroll to the bottom of the _visible_ rows but can
never reach row 1000. The scrollbar lies.

### 4. (CRITICAL) Forgetting `transform: translateY(...)` per row

Absolutely-positioned rows without `transform` stack at `top: 0` — every row
renders on top of every other.

### 5. (CRITICAL) Using native `<table>` layout with absolute-positioned rows

Native `<table>` layout overrides positioning on `<tr>` / `<td>`. Either:

- Use `display: grid` on `<table>` and `display: flex` on `<tr>` / `<td>`
  (see §3), preserving semantic markup, OR
- Use `<div>` markup throughout.

### 6. (HIGH) Variable row heights without `measureElement`

Default `estimateSize` is a constant. Different real heights → wrong
positions → rows visually overlap or leave gaps. Pass `measureElement` and a
way for each mounted row to report its real size.

### 7. (HIGH) Pagination + virtualization both enabled

Pagination already caps row count. Adding virtualization on top doubles the
indirection for no win. Pick one.

### 8. (HIGH) Reimplementing virtualization with `IntersectionObserver`

Saw an agent build a homegrown "render rows when visible" with
`IntersectionObserver`? That's hundreds of lines of broken virtualization.
Use the library.

### 9. (HIGH) Wrong `track` in the virtualized `@for`

```html
<!-- ❌ tracking by row.id confuses Angular because positions shift -->
@for (virtualRow of rowVirtualizer.getVirtualItems(); track row.id)

<!-- ✅ -->
@for (virtualRow of rowVirtualizer.getVirtualItems(); track virtualRow.key)
```

Track by the virtual item's stable key (or index). The row is _inside_ the
virtual item — Angular uses the outer track for DOM reuse.

### 10. (MEDIUM) `injectVirtualizer` outside an injection context

Like `injectTable`, `injectVirtualizer` calls `assertInInjectionContext()`.
Place it on a class field, in a constructor, or inside `runInInjectionContext`.

### 11. (MEDIUM) Recreating `count` / `estimateSize` on every signal change without

stable callbacks

Move `estimateSize`, `measureElement`, `getScrollElement` to stable
references (class arrow methods or module-scope functions) where possible.
Otherwise the virtualizer re-initializes its internal state on every change.

### 12. (MEDIUM) Missing `getRowId` — selection breaks across re-sorts in a

virtualized table

This isn't virtualization-specific, but it's especially visible here because
virtualization renders a window of rows; refreshing that window via scroll
makes mismatched checkbox state obvious. `getRowId: (row) => row.id` is
mandatory.

---

## See also

- `tanstack-table/angular/getting-started` — baseline table that this skill
  layers virtualization on top of
- `tanstack-table/angular/production-readiness` — when to reach for
  virtualization vs server-side pagination
- `tanstack-table/core/row-expanding` — variable subRow heights + virtual
- `tanstack-table/core/column-layout` — pinning interaction
- `@tanstack/angular-virtual` docs — `injectVirtualizer`, options reference,
  variable-height patterns
