---
name: solid/compose-with-tanstack-pacer
description: >
  Debounce or throttle high-frequency writes that drive a `@tanstack/solid-table`
  with `@tanstack/solid-pacer`. Typical targets: column filter inputs (debounce
  text → `column.setFilterValue`) and column-resize state (throttle pointer
  moves). Pattern: wrap the setter in `createDebouncer`/`createThrottler` (or
  use the matching hook), call it from input handlers; the table's atoms still
  drive the row model.
type: composition
library: tanstack-table
framework: solid
library_version: '9.0.0-alpha.48'
requires:
  - filtering
  - column-layout
sources:
  - examples/solid/filters/
  - examples/solid/column-resizing-performant/
---

# Compose with `@tanstack/solid-pacer`

`@tanstack/solid-pacer` rate-limits writes. The two table use cases that pay
back the most:

1. **Filter inputs** — every keystroke triggers a full filter pass. Debounce
   the call to `column.setFilterValue` (or to your filter atom's setter).
2. **Column resizing** — drag events fire dozens per second. Throttle the
   `columnSizing` write so the row model doesn't re-derive on every pointer
   move.

## Install

```bash
pnpm add @tanstack/solid-pacer
```

## Pattern 1 — Debounced column filter

```tsx
import {
  createTable,
  createColumnHelper,
  columnFilteringFeature,
  createFilteredRowModel,
  filterFns,
  tableFeatures,
  FlexRender,
} from '@tanstack/solid-table'
import { useDebouncedCallback } from '@tanstack/solid-pacer/debouncer'
import { For, createSignal } from 'solid-js'

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns,
})
const columnHelper = createColumnHelper<typeof features, Person>()

function FirstNameFilter(props: {
  column: Column<typeof features, Person, string>
}) {
  // Local input value updates immediately (good UX).
  const [text, setText] = createSignal('')

  // Debounced commit to the table's filter state (expensive — runs after 250ms idle).
  const commit = useDebouncedCallback(
    (value: string) => props.column.setFilterValue(value),
    { wait: 250 },
  )

  return (
    <input
      value={text()}
      onInput={(e) => {
        const v = e.currentTarget.value
        setText(v)
        commit(v)
      }}
      placeholder="Filter first name..."
    />
  )
}

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: ({ header }) => <FirstNameFilter column={header.column} />,
    cell: (info) => info.getValue(),
  }),
  // ...
])

function App() {
  const [data] = createSignal(makeData(10_000))

  const table = createTable({
    features,
    columns,
    get data() {
      return data()
    },
  })

  return <table>{/* ... */}</table>
}
```

The local `text()` signal gives the input its responsiveness; the debounced
`commit` keeps the row model from rebuilding on every keystroke.

### Variant: debounce an external filter atom

If you've lifted filters into a `@tanstack/solid-store` atom, debounce the
atom write instead:

```tsx
import { createAtom } from '@tanstack/solid-store'

const filtersAtom = createAtom<ColumnFiltersState>([])

const commitFilter = useDebouncedCallback(
  (id: string, value: string) => {
    filtersAtom.set((old) => {
      const others = old.filter((f) => f.id !== id)
      return value ? [...others, { id, value }] : others
    })
  },
  { wait: 250 },
)
```

Combine with `manualFiltering: true` for server-driven filters — the debounce
also gates the network request.

## Pattern 2 — Throttled column resize

`columnResizingFeature` drives state updates while the user drags. With many
columns this can cause noticeable lag on slower machines.

```tsx
import { useThrottledCallback } from '@tanstack/solid-pacer/throttler'

const table = createTable({
  features: tableFeatures({ columnSizingFeature, columnResizingFeature }),
  columns,
  get data() {
    return data()
  },
  columnResizeMode: 'onChange', // or 'onEnd' for the simplest perf win
})

// Throttle programmatic columnSizing writes (e.g. when synced from a hot atom)
const setColumnSizing = useThrottledCallback(
  (sizing: ColumnSizingState) => table.setColumnSizing(sizing),
  { wait: 16 }, // ~60fps
)
```

If you can accept committing only at the end of the drag, just set
`columnResizeMode: 'onEnd'` — that's a free speedup without pacer at all.

## When NOT to use pacer

- **Pagination, sort.** Click-driven, low-frequency. No debounce needed.
- **Row selection.** Click-driven. No debounce.
- **Global filter that's already server-side and uses TanStack Query.** If the
  query has its own `staleTime`/debounce hooked up upstream, double-throttling
  hurts.
- **Tiny client-side tables.** A 100-row table re-filters in <1ms; debouncing
  introduces a perceived lag for no measurable gain.

## Failure modes

### CRITICAL — debouncing the source of truth instead of the commit

If you debounce the _input value_ signal itself, the input feels laggy
(characters trail). Debounce the **commit** (`setFilterValue` / atom set), not
the local input signal. Keep input echo immediate; throttle the work.

### HIGH — recreating the debounced function per render

Solid components don't re-render in the React sense, but if you call
`useDebouncedCallback` inside a `<For>` body or a derived JSX expression you
may create new debouncers per row. Keep them at component scope, alongside
`createSignal`.

### HIGH — debounce wait larger than user's expectation

250ms is the typical sweet spot for filter inputs. 1000ms feels broken.
50ms gives almost no benefit. Tune to your dataset size.

### MEDIUM — throttling the wrong layer for resize

Setting `columnResizeMode: 'onEnd'` already accomplishes what most resize
throttling tries to do. Reach for `useThrottledCallback` only if you need
during-drag visual sync at a lower rate (e.g. virtualized layouts).

### MEDIUM — debounce on a manual-pagination/query path adds to network jitter

If `useQuery` is keyed on `filtersAtom` and you debounce the atom write, the
network request waits for the debounce. That's usually desirable, but be
explicit about the total latency budget (debounce + fetch).

### LOW — using a debouncer where `untrack` is sufficient

If your problem is "this computation runs too often inside an effect", reach
for Solid's `untrack` or restructure the effect first. Pacer is for
user-driven event streams, not for fixing Solid graph mistakes.
