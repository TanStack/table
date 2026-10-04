# Vue Table with TanStack Virtual

Use this reference when virtualizing Vue table rows or columns. Virtual consumes the final Table model in the renderer; it is not a Table feature. For reactive model or subscription problems, read [table state](../../table-state/SKILL.md). Register `columnSizingFeature` before calling sizing APIs, and `columnVisibilityFeature` before visibility-aware APIs.

## Setup

```ts
import { computed, ref } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'

const scrollElement = ref<HTMLElement | null>(null)
const rows = computed(() => table.getRowModel().rows)
const rowVirtualizer = useVirtualizer(
  computed(() => ({
    count: rows.value.length,
    getScrollElement: () => scrollElement.value,
    estimateSize: () => 34,
    getItemKey: (index) => rows.value[index]!.id,
    overscan: 5,
  })),
)
const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())
const totalSize = computed(() => rowVirtualizer.value.getTotalSize())
```

## Core patterns

### Derive from current visible models

Rows come from `table.getRowModel().rows`; columns come from `table.getVisibleLeafColumns()`. Use computed options so counts and scroll targets update.

### Implement the geometry

Give the scroll container a bounded height and positioning context, create a spacer using `getTotalSize()`, and translate/measure virtual items. Follow the grid/flex examples for dynamic row heights and sticky headers.

### Coordinate infinite fetching

Fetch near the last virtual item only while `totalFetched < serverRowCount` and no request is active. Manual sorting means the server must return the sorted order and a sort change normally resets pages.

## Common mistakes

### HIGH Passing a plain options snapshot

Wrong:

```ts
useVirtualizer({ count: rows.value.length, getScrollElement })
```

Correct:

```ts
useVirtualizer(computed(() => ({ count: rows.value.length, getScrollElement })))
```

Computed options keep the virtual range synchronized with Vue’s current model.

Source: `examples/vue/virtualized-rows/src/App.vue`

### HIGH Virtualizing source arrays

Wrong:

```ts
const rows = computed(() => data.value)
```

Correct:

```ts
const rows = computed(() => table.getRowModel().rows)
```

Source arrays do not represent Table’s current filtering, sorting, expansion, or pagination.

Source: `docs/framework/vue/guide/virtualization.md`

### HIGH Assuming Virtual provides CSS

Wrong:

```vue
<div v-for="item in virtualRows" :key="item.key">{{ rows[item.index].id }}</div>
```

Correct:

```vue
<div :style="{ height: `${totalSize}px`, position: 'relative' }"><div style="position:absolute"></div></div>
```

Virtual provides measurements, not spacer layout, transforms, sticky positioning, or Table column widths.

Source: `examples/vue/virtualized-columns/src/App.vue`

## API discovery

Inspect installed `@tanstack/vue-table/dist/` and `@tanstack/vue-virtual/dist/`; use the maintained Vue examples for exact row, column, and infinite layout combinations.

## Sources

- `TanStack/table:docs/framework/vue/guide/virtualization.md`
- `TanStack/table:examples/vue/virtualized-rows`
- `TanStack/table:examples/vue/virtualized-columns`
- `TanStack/table:examples/vue/virtualized-infinite-scrolling`
