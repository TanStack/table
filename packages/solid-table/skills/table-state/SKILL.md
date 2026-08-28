---
name: table-state
description: >
  Read Solid-backed table atoms inside JSX, createMemo, createEffect, or table.Subscribe; own slices with Solid signals or external TanStack Store atoms; and apply value-or-updater callbacks correctly. Load for Solid tracking and controlled-state bugs.
metadata:
  {
    type: framework,
    library: '@tanstack/solid-table',
    library_version: '9.2.4',
    framework: solid,
  }
requires: ['@tanstack/table-core#core', getting-started]
sources:
  - 'TanStack/table:docs/framework/solid/guide/table-state.md'
  - 'TanStack/table:examples/solid/basic-external-state'
  - 'TanStack/table:packages/solid-table/src/createTable.ts'
---

This skill builds on `@tanstack/table-core#core` and `getting-started`. Solid-backed atom reads react only inside a tracked scope; there is no React-style selected `table.state` object.

## State Mental Model

TanStack Table is primarily a state coordinator. Let it own state unless another subsystem needs the value. Without `initialState`, `atoms`, `state`, or `on[State]Change`, all registered slices are internal.

- `table.baseAtoms` are internal writable atoms created from initial state.
- `table.atoms` are readonly derived atoms that resolve the active owner of each slice.
- `table.store` combines registered atoms into one readonly flat store.

The Solid adapter backs core atoms with Solid signals and memos. An atom `.get()` participates in dependency tracking only inside JSX, `createMemo`, `createEffect`, or another tracked owner. State is feature-based: no `rowPaginationFeature` means no pagination state, atom, option, or method. Keep `features` and `columns` stable, and expose changing data through a reactive getter rather than rebuilding model inputs in a tracked computation.

## Setup

```tsx
import { createMemo } from 'solid-js'

const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
})
const selectedCount = createMemo(
  () => Object.keys(table.atoms.rowSelection.get()).length,
)
return <output>{selectedCount()}</output>
```

## Core Patterns

### Control with a native signal

```tsx
const [sorting, setSorting] = createSignal([])
const table = createTable({
  features,
  columns,
  get data() {
    return data()
  },
  get state() {
    return { sorting: sorting() }
  },
  onSortingChange: setSorting,
})
```

Solid signal setters already accept either a value or an updater function, so pass the setter directly. Wrap it only when adding validation, transformation, or a side effect:

```tsx
onSortingChange: (updater) =>
  setSorting((old) => {
    const next = typeof updater === 'function' ? updater(old) : updater
    logSortingChange(next)
    return next
  })
```

### Own a slice with an external atom

```tsx
import { createAtom } from '@tanstack/solid-store'
const pagination = createAtom({ pageIndex: 0, pageSize: 20 })
const table = createTable({ features, columns, data, atoms: { pagination } })
```

## Choose State Ownership

Use one owner for each slice:

- Keep state internal and use feature methods for ordinary table-local interaction.
- Use `initialState` for a starting/reset value. Later changes to that object do not reset state.
- Prefer a stable `@tanstack/solid-store` atom through `atoms` when state is shared; feature methods write it directly.
- Use a Solid signal through a reactive `state` getter plus `on[State]Change` for simple controlled state. Resolve raw values and updater functions.

External atoms take precedence over controlled `state`, which syncs into the internal base atom. Do not configure two owners for one slice. The global v8 `onStateChange` option is gone; observe `table.store` when all state changes matter.

## Initialize, Update, and Reset

Prefer feature APIs such as `table.setSorting`, `table.nextPage`, `column.toggleVisibility`, and `row.toggleSelected`. Write `table.baseAtoms` only as a low-level escape hatch for internally owned state, and write the supplied atom when external `atoms` own the slice.

```tsx
table.resetSorting()
table.resetPagination()
table.resetPagination(true)
```

Feature resets use `table.initialState` unless `true` requests the feature default, and they can update an external owner. Core `table.reset()` resets internal base atoms only. Use `PaginationState` or another slice type for external state; use `TableState<typeof features>` for the complete feature-inferred state.

## Common Mistakes

### HIGH Reading outside a tracked scope

Wrong:

```tsx
const page = table.atoms.pagination.get().pageIndex
setInterval(() => console.log(page), 1000)
```

Correct:

```tsx
const page = createMemo(() => table.atoms.pagination.get().pageIndex)
setInterval(() => console.log(page()), 1000)
```

An atom read only establishes Solid dependencies inside JSX, a memo, an effect, or another tracked owner.

Source: `docs/framework/solid/guide/table-state.md`

### MEDIUM Adding broad React-style rerenders

Wrong:

```tsx
createEffect(() => {
  JSON.stringify(table.store.state)
  forceUpdate()
})
```

Correct:

```tsx
const count = createMemo(
  () => Object.keys(table.atoms.rowSelection.get()).length,
)
```

Solid should track the narrow atom reads actually used by the computation.

Source: `packages/solid-table/src/createTable.ts`

## API Discovery

Inspect `node_modules/@tanstack/solid-table/dist/createTable.d.ts` and `reactivity.d.ts`; state slice definitions and atom precedence are in installed `@tanstack/table-core/dist/`.
