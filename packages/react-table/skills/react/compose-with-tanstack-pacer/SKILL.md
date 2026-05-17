---
name: react/compose-with-tanstack-pacer
description: >
  Use `@tanstack/react-pacer` to debounce/throttle the high-frequency writes
  that drive an interactive `@tanstack/react-table` v9 table: column filter
  inputs and column resize state. Pattern: import `useDebouncedCallback`
  from `@tanstack/react-pacer/debouncer`, wrap your `onChange` writer in
  it, and keep local input state so typing feels instant. For column
  resizing, throttle `onColumnResizingChange` so a drag doesn't push 60+
  state updates per second. Pacer is the v9 replacement for the hand-rolled
  `DebouncedInput` setTimeout component from v8 examples.
type: composition
library: tanstack-table
framework: react
library_version: '9.0.0-alpha.48'
requires:
  - filtering
  - column-layout
  - react/table-state
sources:
  - TanStack/table:examples/react/basic-subscribe/src/main.tsx
  - TanStack/table:examples/react/with-tanstack-form/src/main.tsx
  - TanStack/table:examples/react/kitchen-sink/src/main.tsx
---

This skill builds on `tanstack-table/state-management`, `tanstack-table/react/table-state`, and the `filtering` core skill. Read those first.

## Why this exists

A column filter input writes to `state.columnFilters` on every keystroke. Each write recomputes the filtered row model. For 100 rows that's fine; for 10k+ it's visibly janky. Pacer debounces the write so the filter only fires once after typing stops, while the input itself updates instantly via local state.

The same principle applies to drag-to-resize: a single drag can fire `onColumnResizingChange` 60+ times per second. Throttling at ~16ms (one frame) keeps the perceived smoothness without spamming the store.

## Setup

```bash
pnpm add @tanstack/react-pacer
```

```tsx
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { useThrottledCallback } from '@tanstack/react-pacer/throttler'
```

## Core Pattern — `DebouncedInput` for column filters

The shape comes straight from the v9 examples — keep local input state so the input is instant, debounce the writer so the store only sees the trailing value.

```tsx
import * as React from 'react'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  // Local state so the input feels instant.
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // Debounced writer — fires once after `debounce` ms of inactivity.
  const debouncedOnChange = useDebouncedCallback(onChange, { wait: debounce })

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => {
        setValue(e.target.value) // instant UI update
        debouncedOnChange(e.target.value) // debounced store write
      }}
    />
  )
}

// Usage in a column filter:
;<DebouncedInput
  value={(column.getFilterValue() ?? '') as string}
  onChange={(v) => column.setFilterValue(v)}
  placeholder="Search..."
/>
```

Source: `examples/react/basic-subscribe/src/main.tsx`; `examples/react/with-tanstack-form/src/main.tsx`.

## Debounce vs throttle — choose by intent

| Pattern      | Use case                                                                 | Typical wait     |
| ------------ | ------------------------------------------------------------------------ | ---------------- |
| **Debounce** | "Wait until they stop typing, then commit" — filter inputs, search boxes | 250–500ms        |
| **Throttle** | "Fire at most every N ms" — drag-to-resize, scroll-triggered fetches     | 16ms (one frame) |

```tsx
// Throttled column resize
const throttledResize = useThrottledCallback(
  (next: ColumnResizingState) => columnResizingAtom.set(next),
  { wait: 16 },
)
```

## Global filter with debounce + instant input

The exact pattern used in `examples/react/basic-subscribe/src/main.tsx`:

```tsx
<table.Subscribe source={table.atoms.globalFilter}>
  {(globalFilter) => (
    <DebouncedInput
      value={globalFilter ?? ''}
      onChange={(value) => table.setGlobalFilter(value)}
      placeholder="Search all columns..."
    />
  )}
</table.Subscribe>
```

The `<table.Subscribe>` wrapper keeps the input controlled by the table's atom (so external resets propagate), while `DebouncedInput`'s local state keeps the visual update instant.

## Common Mistakes

### CRITICAL Writing filter values directly on every keystroke

Wrong:

```tsx
<input onChange={(e) => column.setFilterValue(e.target.value)} />
// On a 10k-row table, this recomputes the filtered row model per character — janky.
```

Correct:

```tsx
<DebouncedInput
  value={(column.getFilterValue() ?? '') as string}
  onChange={(v) => column.setFilterValue(v)}
/>
```

Debounce the store write; keep the input instant via local state.
Source: `examples/react/basic-subscribe/src/main.tsx`.

### HIGH Rolling your own `setTimeout` debounce

Wrong:

```tsx
function DebouncedInput({ value, onChange, debounce = 300 }) {
  const [v, setV] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => onChange(v), debounce)
    return () => clearTimeout(t)
  }, [v])
  // Works, but reinvents what useDebouncedCallback already provides with proper
  // ref stability, cleanup, and trailing-edge semantics.
}
```

Correct:

```tsx
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue)
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  const debouncedOnChange = useDebouncedCallback(onChange, { wait: debounce })
  return (
    <input
      {...props}
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        debouncedOnChange(e.target.value)
      }}
    />
  )
}
```

v8 examples shipped the hand-rolled version. v9 explicitly delegates to Pacer.
Source: `examples/react/basic-subscribe/src/main.tsx`.

### HIGH Debouncing the local input state instead of (or in addition to) the writer

Wrong:

```tsx
const debouncedSetLocal = useDebouncedCallback(setValue, { wait: 300 })
<input value={value} onChange={(e) => debouncedSetLocal(e.target.value)} />
// User sees stale characters in the input box.
```

Correct:

```tsx
const debouncedOnChange = useDebouncedCallback(onChange, { wait: 300 })
<input
  value={value}
  onChange={(e) => {
    setValue(e.target.value)           // instant local update
    debouncedOnChange(e.target.value)  // debounced store write only
  }}
/>
```

Local state should always be instant. Only the expensive store write should debounce.
Source: `examples/react/basic-subscribe/src/main.tsx`.

### HIGH Throttling column resize at 250ms

Wrong:

```tsx
const throttledResize = useThrottledCallback(setResize, { wait: 250 })
// 4 fps drag → visibly laggy.
```

Correct:

```tsx
const throttledResize = useThrottledCallback(setResize, { wait: 16 })
// ~60 fps, smooth.
```

Use roughly one frame (16ms). 250ms is fine for filter writes; far too long for drag interactions.
Source: maintainer guidance.

### MEDIUM Wrapping `column.setFilterValue` directly without local input state

Wrong:

```tsx
const debouncedSet = useDebouncedCallback(column.setFilterValue, { wait: 300 })
<input onChange={(e) => debouncedSet(e.target.value)} />
// Input becomes uncontrolled-feeling because the render goes through the slow path.
```

Correct:

```tsx
<DebouncedInput
  value={(column.getFilterValue() ?? '') as string}
  onChange={(v) => column.setFilterValue(v)}
/>
```

The `DebouncedInput` pattern combines local state (instant) with debounced commit (cheap). Don't skip the local state.
Source: `examples/react/basic-subscribe/src/main.tsx`.

### MEDIUM Using `wait: 0` and expecting debouncing

Wrong:

```tsx
const debouncedOnChange = useDebouncedCallback(onChange, { wait: 0 })
// Effectively no debounce — fires synchronously.
```

Correct:

```tsx
const debouncedOnChange = useDebouncedCallback(onChange, { wait: 300 })
```

`wait` is meaningful. 250–500ms is the typical sweet spot for filter inputs; 16ms is the typical sweet spot for resize/scroll throttling.
Source: maintainer guidance.

## See Also

- `tanstack-table/react/table-state` — Subscribe boundaries for the debounced writers to feed into.
- `tanstack-table/filtering` — column filter feature API surface.
- `tanstack-table/column-layout` — column resize feature.
- `tanstack-table/react/compose-with-tanstack-query` — debounce filter input that feeds a server-side query.
