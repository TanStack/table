---
name: preact/compose-with-tanstack-pacer
description: >
  Use `@tanstack/preact-pacer` to debounce / throttle the high-frequency writes
  that drive an interactive table: column filter inputs and column resize
  state. Pattern: import `useDebouncedCallback` from
  `@tanstack/preact-pacer/debouncer` (or `useThrottledCallback` for resize),
  wrap your `column.setFilterValue` / `table.setColumnSizing` calls, and let
  the table's expensive row-model recompute happen on the trailing edge.
  Routing keywords: preact-pacer, debounce filter, throttle resize, useDebouncedCallback,
  performant filtering.
type: composition
library: tanstack-table
framework: preact
library_version: '9.0.0-alpha.48'
requires:
  - filtering
  - column-layout
sources:
  - TanStack/table:examples/preact/filters/
  - TanStack/table:examples/preact/column-resizing-performant/
  - TanStack/table:examples/react/with-tanstack-form/
---

Filtering and column resizing fire a lot of events. Each `column.setFilterValue(...)` invalidates `filteredRowModel`, then `paginatedRowModel`, then re-renders subscribed components. For large tables that is the difference between a snappy UI and a janky one. Debounce or throttle the writes with @tanstack/preact-pacer.

## Install

```bash
npm install @tanstack/preact-pacer
```

## Pattern 1 — Debounced column filter input

Render the input value from local state (immediate visual feedback) and push the value into the table on a debounce.

```tsx
import { useState } from 'preact/hooks'
import { useDebouncedCallback } from '@tanstack/preact-pacer/debouncer'
import type { Column } from '@tanstack/preact-table'

function FilterInput<TFeatures, TData>({
  column,
}: {
  column: Column<TFeatures, TData>
}) {
  const initial = (column.getFilterValue() as string | undefined) ?? ''
  const [value, setValue] = useState(initial)

  const pushToTable = useDebouncedCallback(
    (next: string) => column.setFilterValue(next),
    { wait: 250 },
  )

  return (
    <input
      type="text"
      value={value}
      onInput={(e) => {
        const next = (e.target as HTMLInputElement).value
        setValue(next)
        pushToTable(next)
      }}
      placeholder="Search…"
    />
  )
}
```

The local `value` keeps the cursor and typing responsive; `pushToTable` only runs on the trailing edge, so the table only recomputes the filtered row model once per pause.

Same pattern works for the global filter via `table.setGlobalFilter`.

Source: `examples/preact/filters/`.

## Pattern 2 — Throttled column resize

Column resize fires per-mousemove. Throttling keeps the resize visually smooth without re-running the full layout on every pixel.

```tsx
import { useThrottledCallback } from '@tanstack/preact-pacer/throttler'

function ResizeHandle({ header, table }) {
  const pushSize = useThrottledCallback(
    (size: number) => {
      table.setColumnSizing((prev) => ({ ...prev, [header.column.id]: size }))
    },
    { wait: 16 }, // ~60fps
  )

  // Hook this into your existing pointermove handler.
  return null
}
```

In v9, column sizing is driven by `columnSizingFeature` + `table.setColumnSizing`. The throttle wraps the write side; the read side stays direct.

Source: `examples/preact/column-resizing-performant/`.

## When NOT to debounce

- Sorting (`table.setSorting`) — fires once per click.
- Pagination (`table.setPageIndex`, `table.setPageSize`) — fires once per page.
- Row selection (`row.toggleSelected`) — fires once per toggle.

Debouncing these adds latency for no win. Reach for pacer only on input/resize/scroll-driven writes.

## With External Atoms

If you've moved a slice to an external atom, debounce the atom write instead of the table API.

```tsx
const globalFilterAtom = useCreateAtom<string>('')

const pushFilter = useDebouncedCallback(
  (next: string) => globalFilterAtom.set(next),
  { wait: 250 },
)
```

The table reads from the atom; the atom now changes less often; the row model recomputes less often.

## Common Mistakes

### CRITICAL Wrapping `column.setFilterValue` AND reading filter via `column.getFilterValue()` in the same input

Wrong:

```tsx
const debouncedSet = useDebouncedCallback(
  (v: string) => column.setFilterValue(v),
  { wait: 250 },
)
return (
  <input
    value={(column.getFilterValue() ?? '') as string} // doesn't reflect typed value
    onInput={(e) => debouncedSet((e.target as HTMLInputElement).value)}
  />
)
```

Correct: hold local state for the visual `value`, debounce the write.

```tsx
const [v, setV] = useState((column.getFilterValue() ?? '') as string)
const debouncedSet = useDebouncedCallback(
  (next: string) => column.setFilterValue(next),
  { wait: 250 },
)

return (
  <input
    value={v}
    onInput={(e) => {
      const next = (e.target as HTMLInputElement).value
      setV(next)
      debouncedSet(next)
    }}
  />
)
```

Otherwise the input lags by the debounce wait — the user sees stale characters.

### HIGH Debouncing the wrong direction

Wrong: debouncing the read (`column.getFilterValue`), which is just a memoized derivation.

Correct: debounce the **write** (`column.setFilterValue`) — that's what triggers the row-model recompute.

### HIGH Treating pacer as a substitute for stable references

Wrong: debouncing every `useTable` call.

Correct: pacer doesn't fix unstable `features` / `columns` / `data` references. Stabilize those first; reach for pacer for input/scroll/resize hotspots.
Source: `docs/framework/preact/guide/table-state.md` (FAQ #1).

### MEDIUM Forgetting that debounce delays the trailing edge

The first keystroke still hits the table at the trailing edge of the debounce window. If you want a leading-edge call (e.g. fire immediately, then debounce subsequent calls), use the `{ leading: true, trailing: true }` shape.

## See Also

- `tanstack-table/filtering` — column / global filter state shape.
- `tanstack-table/column-layout` — column sizing / pinning / visibility.
- `tanstack-table/preact/production-readiness` — narrow selectors, stable refs.
