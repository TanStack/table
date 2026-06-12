---
name: vue/compose-with-tanstack-virtual
description: >
  `@tanstack/vue-table` v9 does not include virtualization — pair with `@tanstack/vue-virtual`.
  Standard row-virtualization pattern: get the row array from `table.getRowModel().rows`, feed
  `rows.length` to `useVirtualizer(computed(() => ({ count, estimateSize, getScrollElement,
  overscan })))`, iterate `rowVirtualizer.value.getVirtualItems()` instead of `rows.map`,
  absolute-position each row with `transform: translateY(virtualRow.start)px`, and use
  `display: grid` on `<table>`/`<thead>`/`<tbody>`. The virtualizer MUST live in the deepest
  component possible so unrelated state changes don't re-run it. Column virtualization mirrors
  the shape with `horizontal: true` plus padding-left/right placeholder cells. Skip
  `measureElement` on Firefox — it returns inconsistent table-row heights.
type: composition
library: tanstack-table
framework: vue
library_version: '9.0.0-alpha.48'
requires:
  - vue/table-state
  - row-expanding
sources:
  - docs/guide/virtualization.md
  - examples/vue/virtualized-rows/src/App.vue
  - examples/vue/virtualized-columns/
  - examples/vue/virtualized-infinite-scrolling/
---

# Compose @tanstack/vue-table with @tanstack/vue-virtual

## Dependencies

```bash
pnpm add @tanstack/vue-table @tanstack/vue-virtual
```

`@tanstack/vue-virtual` is the Vue adapter for TanStack Virtual. Its key Vue-isms:

- `useVirtualizer(optionsRef)` accepts a `ref`/`computed` of options (or a getter), and
  returns a `Ref<Virtualizer>` — you read `.value.getVirtualItems()`, `.value.getTotalSize()`, etc.
- `getScrollElement` resolves the scrollable container via a template ref.

## Setup — row virtualization, the standard pattern

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  FlexRender,
  columnSizingFeature,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
  type ColumnDef,
} from '@tanstack/vue-table'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { makeData, type Person } from './makeData'

const features = tableFeatures({
  columnSizingFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const columns: ColumnDef<typeof features, Person>[] = [
  { accessorKey: 'firstName' },
  { accessorKey: 'lastName' },
  { accessorKey: 'age' },
]

const data = ref<Person[]>(makeData(50_000))

const table = useTable({
  features,
  columns,
  data,
})

const rows = computed(() => table.getRowModel().rows)

// 1) Template ref to the scrollable container.
const tableContainerRef = ref<HTMLDivElement | null>(null)

// 2) Reactive virtualizer options — recomputed when rows.length changes.
const rowVirtualizerOptions = computed(() => ({
  count: rows.value.length,
  estimateSize: () => 33,
  getScrollElement: () => tableContainerRef.value,
  overscan: 5,
}))

const rowVirtualizer = useVirtualizer(rowVirtualizerOptions)

const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())
const totalSize = computed(() => rowVirtualizer.value.getTotalSize())
</script>

<template>
  <div
    ref="tableContainerRef"
    :style="{ overflow: 'auto', position: 'relative', height: '800px' }"
  >
    <!-- display: grid is required for absolute-positioned virtual rows -->
    <table :style="{ display: 'grid' }">
      <thead
        :style="{ display: 'grid', position: 'sticky', top: 0, zIndex: 1 }"
      >
        <tr
          v-for="hg in table.getHeaderGroups()"
          :key="hg.id"
          :style="{ display: 'flex', width: '100%' }"
        >
          <th
            v-for="h in hg.headers"
            :key="h.id"
            :style="{ width: `${h.getSize()}px` }"
          >
            <FlexRender v-if="!h.isPlaceholder" :header="h" />
          </th>
        </tr>
      </thead>
      <tbody
        :style="{
          display: 'grid',
          height: `${totalSize}px`,
          position: 'relative',
        }"
      >
        <tr
          v-for="vRow in virtualRows"
          :key="rows[vRow.index].id"
          :data-index="vRow.index"
          :style="{
            display: 'flex',
            position: 'absolute',
            transform: `translateY(${vRow.start}px)`,
            width: '100%',
          }"
        >
          <td
            v-for="cell in rows[vRow.index].getAllCells()"
            :key="cell.id"
            :style="{ display: 'flex', width: `${cell.column.getSize()}px` }"
          >
            <FlexRender :cell="cell" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

Source: `examples/vue/virtualized-rows/src/App.vue`.

## Core Patterns

### 1. Keep `useVirtualizer` in the deepest possible component

```vue
<!-- ✅ Body owns the virtualizer. Filter input changes in App.vue don't re-run it. -->
<!-- App.vue -->
<TableContainer ref="tableContainerRef">
  <TableBody :table="table" :container-ref="tableContainerRef" />
</TableContainer>

<!-- TableBody.vue: useVirtualizer lives here. -->
```

This is the single most important perf rule. Putting `useVirtualizer` in the same component
as `useTable` means any state change in that component re-runs the virtualizer, blowing
scroll position and measurement cache.

### 2. `display: grid` + absolute-positioned rows

Semantic `<table>` markup still works, but the _layout_ must be CSS grid + flexbox. Without
`display: grid` on `<table>`/`<thead>`/`<tbody>` plus `position: absolute` + `transform:
translateY(start)px` on each row, virtual rows stack or overlap.

### 3. Column virtualization

```ts
const columnVirtualizer = useVirtualizer(
  computed(() => ({
    count: columns.length,
    estimateSize: (index) => columns[index].size ?? 150,
    getScrollElement: () => tableContainerRef.value,
    horizontal: true,
    overscan: 3,
  })),
)

const virtualCols = computed(() => columnVirtualizer.value.getVirtualItems())

// Then in template, render only virtualCols. Pad with empty cells at left/right:
const virtualPaddingLeft = computed(() => virtualCols.value[0]?.start ?? 0)
const virtualPaddingRight = computed(() => {
  const last = virtualCols.value[virtualCols.value.length - 1]
  return columnVirtualizer.value.getTotalSize() - (last?.end ?? 0)
})
```

Without left/right padding placeholder cells, visible columns slide left as you scroll because
unrendered columns aren't taking up scroll space.

### 4. Dynamic row heights via `measureElement`

```ts
const rowVirtualizerOptions = computed(() => ({
  count: rows.value.length,
  estimateSize: () => 33,
  getScrollElement: () => tableContainerRef.value,
  // Firefox returns inconsistent table-row heights — skip there.
  measureElement:
    typeof window !== 'undefined' &&
    navigator.userAgent.indexOf('Firefox') === -1
      ? (el) => el.getBoundingClientRect().height
      : undefined,
  overscan: 5,
}))
```

In templates, wire `measureElement` via a ref callback:

```vue
<tr :ref="(el) => rowVirtualizer.value.measureElement(el as Element)">
  ...
</tr>
```

### 5. Infinite scroll

Combine `useInfiniteQuery` from `@tanstack/vue-query` with a scroll-event handler that calls
`fetchNextPage()` when within ~500px of the bottom. **Set `manualSorting: true`** so a new
query fires on sort changes — otherwise the table re-sorts already-fetched pages locally and
scrambles order.

```ts
const flatData = computed(
  () => infiniteQuery.data.value?.pages.flatMap((p) => p.rows) ?? [],
)

const onScroll = (e: Event) => {
  const t = e.target as HTMLDivElement
  if (
    t.scrollHeight - t.scrollTop - t.clientHeight < 500 &&
    !infiniteQuery.isFetching.value
  ) {
    infiniteQuery.fetchNextPage()
  }
}
```

Source: `examples/vue/virtualized-infinite-scrolling/`.

## Common Mistakes

### Putting `useVirtualizer` in the same component as `useTable` (CRITICAL)

Any unrelated state change in that component re-runs the virtualizer. Move it down to a
`TableBody.vue` component that takes the table as a prop.

### Forgetting `display: grid` on `<table>`/`<thead>`/`<tbody>` (CRITICAL)

The semantic table layout fights with absolute positioning. Virtual rows stack on top of each
other or overlap.

### Missing `transform: translateY(virtualRow.start)px` (CRITICAL)

All rows render at `top: 0` and only the last few are visible. The virtualizer reports the
correct `start` for each item; you must apply it.

### Using `measureElement` on Firefox (HIGH)

Firefox returns inconsistent border-height measurements for `<tr>` elements — rows jitter on
every scroll. Guard with `navigator.userAgent.indexOf('Firefox') === -1`.

### Passing options as a plain object instead of a `computed` / getter (HIGH — Vue-specific)

```ts
// ❌ Static options — virtualizer doesn't re-run when rows.length changes.
const rowVirtualizer = useVirtualizer({
  count: rows.value.length,
  // ...
})

// ✅ Reactive options.
const rowVirtualizer = useVirtualizer(
  computed(() => ({
    count: rows.value.length,
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef.value,
  })),
)
```

### Forgetting padding cells in column virtualization (HIGH)

Without `virtualPaddingLeft` / `virtualPaddingRight` cells, columns slide horizontally as you
scroll because unrendered columns aren't taking up scroll space.

### Forgetting `manualSorting: true` on infinite scroll (HIGH)

The table re-sorts already-fetched pages every time a new page arrives, scrambling order.

### Reading `table.state` above the virtualizer (HIGH)

Any reactive read of `table.state` in a parent component re-renders the parent → re-renders
the virtualizer-owning child → loses scroll. Use the narrowest read at the lowest level
(see `tanstack-table/vue/production-readiness`).

### Hallucinating React Virtual hooks in Vue code (CRITICAL)

```ts
// ❌
import { useVirtualizer } from '@tanstack/react-virtual'

// ✅
import { useVirtualizer } from '@tanstack/vue-virtual'
```

Same name, Vue-specific reactivity contract — `useVirtualizer` returns a `Ref<Virtualizer>`
in Vue, not a plain object.

### "API missing" — `getRowModel` returns nothing (CRITICAL — v9-specific)

If `table.getRowModel().rows` is empty when data is loaded, the row-model feature for whatever
slice you need (filtering/sorting/grouping) isn't registered. Add the feature, its factory, and
its fn registry to `tableFeatures({...})`.

### Reimplementing virtualization manually (CRITICAL — #1 AI tell)

Slice `rows` with `Array.slice(start, end)` based on scroll position is the classic
re-invention. Use `useVirtualizer` — it handles overscan, dynamic heights, scroll-to-index,
all of which the hand-rolled version skips.

## See Also

- `tanstack-table/vue/production-readiness` — keep the virtualizer in a leaf component
- `tanstack-table/vue/table-state` — narrow reads to avoid parent re-renders
- `tanstack-table/vue/compose-with-tanstack-query` — infinite-scroll pairs with `useInfiniteQuery`
- `tanstack-table/table-core/row-expanding` — virtualized + expanding interactions
- `tanstack-table/table-core/column-layout` — column sizing/pinning + virtualization
