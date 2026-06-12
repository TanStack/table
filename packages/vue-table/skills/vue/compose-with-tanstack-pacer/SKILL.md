---
name: vue/compose-with-tanstack-pacer
description: >
  Use `@tanstack/pacer` to debounce/throttle high-frequency writes in `@tanstack/vue-table` v9:
  column filter inputs and column-resize state. There is no `@tanstack/vue-pacer` adapter yet —
  use the framework-agnostic core `@tanstack/pacer` (`Debouncer`, `Throttler`, or the
  `debounce`/`throttle` function helpers) directly from a Vue component. Pattern: keep local
  state for the input value so typing feels instant; route the table-writing callback through
  a `Debouncer` instance scoped to the component (so cleanup happens on unmount); pick
  `wait: 300` for filter inputs and `wait: 16` (one frame) for column resize. Pacer replaces
  the hand-rolled `setTimeout`-based `DebouncedInput` component that appears in every v8
  filtering example.
type: composition
library: tanstack-table
framework: vue
library_version: '9.0.0-alpha.48'
requires:
  - filtering
  - column-layout
sources:
  - examples/vue/filters/src/DebouncedInput.vue
  - examples/react/with-tanstack-form/
  - packages/pacer/src/debouncer.ts
---

# Compose @tanstack/vue-table with @tanstack/pacer

## Dependencies

```bash
pnpm add @tanstack/vue-table @tanstack/pacer
```

**Note:** there is no `@tanstack/vue-pacer` adapter at the time of writing — only React,
Preact, Solid, and Angular ship dedicated Pacer adapters. Vue users consume the
framework-agnostic core (`@tanstack/pacer`) directly. That's a fine fit: `Debouncer` and
`Throttler` are plain classes; integration with Vue is just `onBeforeUnmount(() => debouncer.cancel())`.

## Setup — debounced filter input

```vue
<!-- DebouncedInput.vue — the v9 replacement for the hand-rolled v8 component -->
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { Debouncer } from '@tanstack/pacer'

const props = defineProps<{
  modelValue: string | number
  debounce?: number
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()

// 1) Local state — instant UI updates while the user types.
const local = ref(props.modelValue)

// 2) One Debouncer per component instance. Reset between renders is not needed.
const debouncer = new Debouncer(
  (next: string | number) => emit('update:modelValue', next),
  { wait: props.debounce ?? 300 },
)

// 3) Keep local in sync with external changes (e.g. table.resetColumnFilters()).
watch(
  () => props.modelValue,
  (v) => {
    local.value = v
  },
)

const onInput = (e: Event) => {
  const v = (e.target as HTMLInputElement).value
  local.value = v
  debouncer.maybeExecute(v)
}

// 4) Cancel pending work on unmount.
onBeforeUnmount(() => debouncer.cancel())
</script>

<template>
  <input :value="local" @input="onInput" />
</template>
```

Use it in a column filter:

```vue
<DebouncedInput
  :model-value="(column.getFilterValue() ?? '') as string"
  @update:model-value="(v) => column.setFilterValue(v)"
  placeholder="Search…"
  :debounce="300"
/>
```

## Core Patterns

### 1. Local state + debounced writer = instant input, deferred store write

```ts
// ❌ Writes to the table on every keystroke. Row model recomputes per character.
@input="(e) => column.setFilterValue(e.target.value)"
```

```ts
// ✅ Local ref drives the input; Debouncer batches the store write at wait=300.
const local = ref('')
const debouncer = new Debouncer((v) => column.setFilterValue(v), { wait: 300 })
const onInput = (e) => {
  local.value = e.target.value
  debouncer.maybeExecute(local.value)
}
```

### 2. `Debouncer` vs `Throttler`

| Use case                                 | Pick        | Typical `wait`      |
| ---------------------------------------- | ----------- | ------------------- |
| Filter input (commit after typing stops) | `Debouncer` | `300` ms            |
| Global filter (same shape)               | `Debouncer` | `250–500` ms        |
| Column resize drag                       | `Throttler` | `16` ms (one frame) |
| Scroll-triggered fetch                   | `Throttler` | `100–250` ms        |

```ts
import { Throttler } from '@tanstack/pacer'

const resizeThrottler = new Throttler(
  (event: ColumnResizeInfoEvent) => /* commit resize */,
  { wait: 16 },
)
```

### 3. Throttling column resize via the atoms write path

If you own column resize state externally (via `@tanstack/vue-store`), throttle the atom
write:

```ts
import { Throttler } from '@tanstack/pacer'
import { createAtom } from '@tanstack/vue-store'
import type { ColumnResizingState } from '@tanstack/vue-table'

const columnResizingAtom = createAtom<ColumnResizingState>(
  {} as ColumnResizingState,
)
const throttler = new Throttler(
  (next: ColumnResizingState) => columnResizingAtom.set(next),
  { wait: 16 },
)

useTable({
  features,
  columns,
  data,
  state: {
    get columnResizing() {
      return columnResizingAtom.get()
    },
  },
  onColumnResizingChange: (u) => {
    const next = typeof u === 'function' ? u(columnResizingAtom.get()) : u
    throttler.maybeExecute(next)
  },
})
```

For pure local resize state, the same pattern using `ref` + `onColumnResizingChange` works.

### 4. Global filter debounce

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { Debouncer } from '@tanstack/pacer'

const props = defineProps<{ table: any }>() // import the typed Table<TFeatures, TData> in real code
const local = ref('')

const debouncer = new Debouncer((v: string) => props.table.setGlobalFilter(v), {
  wait: 250,
})

watch(local, (v) => debouncer.maybeExecute(v))
onBeforeUnmount(() => debouncer.cancel())
</script>

<template>
  <input v-model="local" placeholder="Search all columns…" />
</template>
```

### 5. The `debounce`/`throttle` function helpers (alternative shape)

If you don't need access to the instance (`cancel`, `flush`, etc.), the function helpers are
the lowest-overhead form:

```ts
import { debounce } from '@tanstack/pacer'

const writeFilter = debounce((v: string) => column.setFilterValue(v), {
  wait: 300,
})
// later: writeFilter(value)
```

They still register internally for proper cleanup via the Pacer event client; you just don't
expose a handle.

## Common Mistakes

### Writing `column.setFilterValue` directly on every keystroke (HIGH)

```ts
// ❌ Whole filtered row model recomputes per character.
@input="(e) => column.setFilterValue(e.target.value)"
```

Fine for 100 rows, miserable for 10k+. Debounce the writer.

### Hand-rolling `setTimeout`-based debounce (HIGH)

```ts
// ❌ The v8-era DebouncedInput pattern — works, but reinvents what Pacer does correctly.
const t = ref<ReturnType<typeof setTimeout>>()
const setter = (v) => {
  if (t.value) clearTimeout(t.value)
  t.value = setTimeout(() => emit('update:modelValue', v), 300)
}
onBeforeUnmount(() => clearTimeout(t.value))
```

Pacer handles `cancel`/`flush`/`maybeExecute`/leading edge/trailing edge consistently and
integrates with the Pacer Devtools event client.

### Importing from `@tanstack/vue-pacer` (HIGH — Vue-specific)

There is no `@tanstack/vue-pacer` package. Import from `@tanstack/pacer` directly.

```ts
// ❌
import { useDebouncedCallback } from '@tanstack/vue-pacer'

// ✅
import { Debouncer } from '@tanstack/pacer'
```

### Debouncing the local input state too (MEDIUM)

The user sees stale characters in the input. Local state must be **instant**; only the
table/store write should debounce.

```ts
// ❌
const debouncedLocal = new Debouncer((v) => (local.value = v), { wait: 300 })

// ✅ Local instant, store deferred.
local.value = e.target.value
debouncer.maybeExecute(local.value)
```

### Throttling resize at 250ms (MEDIUM)

Too long — drag feels laggy. Use `wait: 16` (roughly one animation frame) for resize. 250ms
is a filter-input wait.

### Forgetting `onBeforeUnmount(() => debouncer.cancel())` (MEDIUM)

Pending fires after unmount → call into a stale closure / nonexistent table → console error.
Always cancel on unmount.

### Hallucinating `useDebouncedCallback` from React (CRITICAL — top AI tell)

`useDebouncedCallback` is a React-pacer hook. It doesn't exist in `@tanstack/vue-pacer` (which
doesn't exist either) or in core `@tanstack/pacer`. Use the `Debouncer` class or the
`debounce` function helper in Vue.

### Hallucinating pre-v9 table APIs in the writer (CRITICAL)

The debounced callback wraps `column.setFilterValue`, `table.setGlobalFilter`,
`columnResizingAtom.set`, etc. These are v9 APIs — `useVueTable` /
`table.setGlobalFilter` on a v8 table would not exist. See
`tanstack-table/vue/migrate-v8-to-v9`.

### "Filter API missing" because feature not in `features` (CRITICAL — v9-specific)

`column.setFilterValue` is only available if `columnFilteringFeature` is registered.
`table.setGlobalFilter` requires `globalFilteringFeature`. Debouncing a missing API is still
a missing API.

### Reimplementing per-keystroke filter logic (CRITICAL — #1 AI tell)

```ts
// ❌ Filter rows yourself.
const filtered = computed(() =>
  data.value.filter((r) => r.name.includes(local.value)),
)
useTable({ ..., data: filtered })
```

```ts
// ✅ Use the table's filter feature; debounce the writer.
useTable({
  features: tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    filteredRowModel: createFilteredRowModel(),
    filterFns,
  }),
  columns,
  data,
})
// In a filter input:
debouncer.maybeExecute(local.value) // → table.setGlobalFilter(local.value)
```

## See Also

- `tanstack-table/vue/compose-with-tanstack-form` — debounce filter while editing
- `tanstack-table/vue/production-readiness` — debounce + tree-shake together
- `tanstack-table/table-core/filtering` — `columnFilteringFeature` / `globalFilteringFeature`
- `tanstack-table/table-core/column-layout` — column resizing state
