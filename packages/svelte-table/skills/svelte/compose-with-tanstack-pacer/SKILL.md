---
name: svelte/compose-with-tanstack-pacer
description: >
  Use `@tanstack/svelte-pacer` to debounce / throttle high-frequency writes that drive a
  `@tanstack/svelte-table` v9 instance — column filter inputs and column resize state are the
  two hot paths. Import `createDebouncer` (or `createThrottler`) from
  `@tanstack/svelte-pacer/debouncer`, wrap the call site that hits `column.setFilterValue`,
  `table.setGlobalFilter`, or commits a resize, and call `.maybeExecute(value)` on each event.
  Svelte 5+ only — pacer instances live at component-init scope.
type: composition
library: tanstack-table
framework: svelte
library_version: '9.0.0-alpha.48'
requires:
  - filtering
  - column-layout
sources:
  - TanStack/table:examples/svelte/with-tanstack-form/
  - TanStack/table:docs/framework/svelte/guide/table-state.md
---

# Compose with TanStack Pacer (Svelte)

Two places in a v9 table take state writes at event-loop rate: **filter inputs** (one
keystroke = one `setFilterValue`) and **column resizing** (one pointermove = one
`columnSizing` write). Without rate-limiting they either flood the network (server-side
filtering) or burn CPU on tens of thousands of re-renders per drag.

`@tanstack/svelte-pacer` gives you `createDebouncer`, `createThrottler`, and friends. Wrap
the call site and you're done.

## Install

```bash
pnpm add @tanstack/svelte-pacer
```

## Debounce a column filter input

Client-side debouncing reduces re-render churn. Server-side debouncing also kills request
storms.

```svelte
<script lang="ts">
  import { createDebouncer } from '@tanstack/svelte-pacer/debouncer'
  import type { Column } from '@tanstack/svelte-table'

  type Props = { column: Column<typeof features, Person> }
  let { column }: Props = $props()

  let localValue = $state((column.getFilterValue() as string) ?? '')

  const debouncedSetFilter = createDebouncer(
    (value: string) => column.setFilterValue(value),
    { wait: 200 },
  )

  function onInput(e: Event) {
    const value = (e.target as HTMLInputElement).value
    localValue = value
    debouncedSetFilter.maybeExecute(value)
  }
</script>

<input type="text" value={localValue} oninput={onInput} placeholder="Search…" />
```

Why the `localValue`? So the input stays snappy (controlled by `$state`) while the table only
sees the debounced commit.

## Debounce a global filter

Same shape, calling `table.setGlobalFilter`:

```svelte
<script lang="ts">
  import { createDebouncer } from '@tanstack/svelte-pacer/debouncer'

  let search = $state('')
  const debouncedSetGlobalFilter = createDebouncer(
    (value: string) => table.setGlobalFilter(value),
    { wait: 250 },
  )
</script>

<input
  type="text"
  value={search}
  oninput={(e) => {
    search = (e.target as HTMLInputElement).value
    debouncedSetGlobalFilter.maybeExecute(search)
  }}
/>
```

## Throttle column resizing

`columnResizingFeature` (which requires `columnSizingFeature` to also be registered in `tableFeatures`) writes to `columnSizing` continuously. v9 supports `columnResizeMode:
'onChange' | 'onEnd'` — the default is `'onChange'` (commit per-frame). For very heavy tables,
either:

1. Set `columnResizeMode: 'onEnd'` so the commit only happens at pointerup.
2. Or, keep `'onChange'` for the visual handle but throttle the side effects you fire off it.

Throttle a side effect:

```ts
import { createThrottler } from '@tanstack/svelte-pacer/throttler'

const throttledSaveSizing = createThrottler(
  (sizing: ColumnSizingState) => persistColumnSizingToStorage(sizing),
  { wait: 100 },
)

$effect(() => {
  const sizing = table.atoms.columnSizing.get()
  throttledSaveSizing.maybeExecute(sizing)
})
```

## Patterns to avoid

### Don't debounce inside a `$effect`

```ts
// WRONG — new debouncer instance every effect re-run
$effect(() => {
  const d = createDebouncer((v) => column.setFilterValue(v), { wait: 200 })
  d.maybeExecute(value)
})
```

Pacer instances must be stable. Declare them once at component init scope.

### Don't debounce things that should be immediate

Selection toggles, page changes, sort clicks — these are user-driven discrete events. Don't
debounce them. The user expects instant feedback.

### Don't double-commit

```ts
// WRONG — local state syncs immediately AND the debounced commit fires
oninput={(e) => {
  column.setFilterValue(e.currentTarget.value)
  debouncedSetFilter.maybeExecute(e.currentTarget.value)
}}
```

Pick one. If you want a snappy input, store the input value in local `$state` and only call
the debounced commit.

## Coordinating with TanStack Query

If your filter triggers a server query, debouncing the filter handler is necessary but not
sufficient — `placeholderData: keepPreviousData` is what keeps the UI from flashing. See the
`compose-with-tanstack-query` skill.

## Common failure modes

- **Recreating pacer instances inside `$effect` / `$derived`.** Each re-run produces a fresh
  debouncer; nothing is ever delayed.
- **Hand-rolled `setTimeout` debounce.** Loses leading-edge / trailing-edge guarantees; harder
  to cancel on unmount. Use pacer.
- **Debouncing a value that drives layout.** Causes user-visible lag where there shouldn't
  be. Keep the input controlled by local state and only debounce the table-write call.
- **Forgetting to call `.maybeExecute`.** Constructing a debouncer doesn't enqueue anything;
  you have to call `.maybeExecute(value)` per event.
- **Reimplementing pacer with `$effect` timers.** Don't.

## Related skills

- `tanstack-table/core/filtering` — column / global filter mechanics.
- `tanstack-table/core/column-layout` — column resizing modes (`onChange` vs `onEnd`).
- `tanstack-table/svelte/compose-with-tanstack-query` — pairing pacer with server queries.
- `tanstack-table/svelte/production-readiness` — where pacer fits in the perf checklist.
