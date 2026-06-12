---
name: angular/table-state
description: >
  TanStack Table v9 state ownership in Angular: signal-backed atoms via `angularReactivity`,
  the `injectTable(() => ({...}))` lazy initializer pattern, reading `table.atoms.<slice>.get()`
  inside templates / `computed(...)` / `effect(...)`, `shallow` for object slices, controlled state
  with Angular signals + `state` + `on[State]Change`, and when to reach for external TanStack Store
  atoms instead. Required reading before any other Angular Table v9 skill.
type: framework
library: tanstack-table
framework: angular
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - setup
sources:
  - TanStack/table:docs/framework/angular/angular-table.md
  - TanStack/table:docs/framework/angular/guide/table-state.md
  - TanStack/table:docs/framework/angular/guide/migrating.md
  - TanStack/table:packages/angular-table/src/injectTable.ts
  - TanStack/table:packages/angular-table/src/reactivity.ts
  - TanStack/table:packages/angular-table/src/lazySignalInitializer.ts
  - TanStack/table:examples/angular/basic-inject-table/
  - TanStack/table:examples/angular/row-selection-signal/
---

# Angular Table State (v9)

> **TanStack Table is a state-management coordinator.** v9 rebuilt that coordinator
> on top of TanStack Store (`alien-signals`). In Angular, the adapter bridges those
> atoms to native Angular signals, so reading `table.atoms.<slice>.get()` from a
> template, `computed(...)`, or `effect(...)` participates in Angular reactivity.
> Prefer that direct atom read when you need a specific state slice.
>
> This is the prerequisite for every other Angular Table skill. Don't skip it.

---

## 1. Prerequisites — `features` decides what state exists

In v9, **a state slice only exists if its feature is registered in `features`**.
This is the #1 v9-specific gotcha and the root cause of many "missing API"
TypeScript errors.

```ts
import {
  injectTable,
  tableFeatures,
  rowPaginationFeature,
  rowSortingFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  sortFns,
} from '@tanstack/angular-table'

// Declare features OUTSIDE the initializer (see §2 below)
const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
}))

this.table.atoms.pagination.get() // ✅
this.table.atoms.sorting.get()    // ✅
// this.table.atoms.rowSelection  // ❌ TS error — rowSelectionFeature not registered
```

If you see `Property 'atoms.rowSelection' does not exist` or
`table.toggleRowSelected is not a function`, **add the feature to `features`** —
don't reach for `@ts-ignore`, don't reimplement the API, don't switch to
`stockFeatures` until you understand which features you actually need.

`tableFeatures({})` (empty) is valid — you get the core row model only.

---

## 2. The `injectTable` lazy-initializer model

`injectTable` is the v9 entrypoint (replacing v8's `createAngularTable`). It must
run inside an Angular injection context (a component constructor / class field).

```ts
readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
}))
```

### The initializer is a `computed`-like function

The initializer runs **whenever any Angular signal read inside it changes**. The
adapter then calls `table.setOptions({ ...previous, ...newOptions })` to sync.
That means:

- **Reactive values that should re-sync the table** (`this.data()`, controlled
  state signals) go _inside_ the initializer.
- **Stable references** (`columns`, `features`) go _outside_ — or you'll
  recreate the column model on every data update.

```ts
// ❌ WRONG — columns + features recreated on every data change
readonly table = injectTable(() => ({
  features: tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns }),
  columns: [/* … */],
  data: this.data(),
}))

// ✅ Stable references outside, signal reads inside
const features = tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns })
const columns: Array<ColumnDef<typeof features, Person>> = [/* … */]

readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(), // ← only the signal read should be inside
}))
```

### The returned table is signal-reactive too

The `table` returned by `injectTable` exposes APIs that read signal-backed atoms
internally, so calling `table.getRowModel()`, `table.getSelectedRowModel()`,
`table.atoms.pagination.get()`, etc. inside templates / `computed` / `effect`
_just works_ — no manual subscriptions.

---

## 3. The three state surfaces

A table instance has three ways to look at its state:

| Surface                   | Shape                                                                          | Use when                                    |
| ------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------- |
| `table.baseAtoms.<slice>` | writable TanStack Store atom (always exists for registered slices)             | low-level direct write; rare                |
| `table.atoms.<slice>`     | **readonly** derived atom per registered feature; backed by Angular `computed` | reading current value or driving reactivity |
| `table.state`             | flat proxy object over every registered slice                                  | full-state JSON/debug output                |

All three are signal-backed in Angular. Reading any of them inside a template,
`computed(...)`, or `effect(...)` registers an Angular dependency. For normal
render code, prefer `table.atoms.<slice>.get()` so the read is explicit and
limited to the slice the component needs. Use `table.state` when you actually
need the flat full-state shape, such as `JSON.stringify(table.state, null, 2)`.

```ts
// Read current value (anywhere)
const pagination = this.table.atoms.pagination.get()

// Same value through the flat proxy; use mainly for full-state debug output
const pagination2 = this.table.state.pagination

// Reactive derivation with custom equality
import { computed } from '@angular/core'
import { shallow } from '@tanstack/angular-table'

readonly pageIndex = computed(
  () => this.table.atoms.pagination.get().pageIndex,
)

readonly pagination = computed(
  () => this.table.atoms.pagination.get(),
  { equal: shallow }, // structural equality — skip downstream work on no-op updates
)
```

### When do I need `computed(...)`?

You **don't need `computed`** just to make an atom reactive. The atom is already
signal-backed. Use `computed(...)` only when you want:

1. **Derivation** — `computed(() => this.table.atoms.pagination.get().pageIndex)`
2. **Custom equality** — `{ equal: shallow }` on object/array slices, so
   downstream `effect`s skip no-op updates when the slice is recreated with the
   same values.
3. **Caching of an expensive transformation** that reads from multiple atoms.

For plain reads in a template, `{{ table.atoms.pagination.get().pageIndex }}`
is fine.

---

## 4. Setting state — use feature APIs, not direct writes

TanStack Table exposes a method for nearly every state transition. **Use those
methods.** Don't reimplement what's already in the public API — that's the #1
tell of AI-generated table code.

```ts
// ✅ Use the API
this.table.setPageIndex(0)
this.table.nextPage()
this.table.setPageSize(25)
this.table.setSorting([{ id: 'age', desc: true }])
this.table.setColumnFilters([{ id: 'status', value: 'active' }])
this.table.toggleAllRowsSelected(true)
this.table.resetSorting()
this.table.resetPagination()
this.table.resetPagination(true) // reset to feature default, not initialState
row.toggleSelected()
column.toggleVisibility()
column.toggleSorting()

// ❌ Don't write to atoms directly unless you really have to
this.table.baseAtoms.pagination.set((old) => ({ ...old, pageIndex: 0 }))
```

Direct `baseAtoms` writes bypass `on[State]Change` handlers and won't update
externally owned state — if you've controlled the slice with an Angular signal,
you must update the signal, not the base atom.

---

## 5. Setting starting values — `initialState`

`initialState` is the single right place to seed registered slices. It is also
the value that reset APIs reset to.

```ts
readonly table = injectTable(() => ({
  features,
  columns,
  data: this.data(),
  initialState: {
    sorting: [{ id: 'age', desc: true }],
    pagination: { pageIndex: 0, pageSize: 25 },
  },
}))

// Later
this.table.resetSorting()  // → initialState.sorting
this.table.resetSorting(true) // → feature default ([])
```

`initialState` only applies to slices whose feature is registered. Mutating
`initialState` after construction does **not** re-seed state — use it for
starting values only.

---

## 6. Controlled state — the recommended Angular pattern

Most Angular Table apps that need cross-component access to a state slice use
**Angular signals + `state` + `on[State]Change`**. This keeps ownership in
Angular's signal model while `injectTable` keeps the table in sync.

```ts
import { signal } from '@angular/core'
import {
  injectTable,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  type PaginationState,
  type SortingState,
} from '@tanstack/angular-table'

const features = tableFeatures({ rowPaginationFeature, rowSortingFeature })

export class Component {
  readonly data = signal<Array<Person>>([])
  readonly sorting = signal<SortingState>([])
  readonly pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 })

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    state: {
      sorting: this.sorting(),
      pagination: this.pagination(),
    },
    onSortingChange: (updater) => {
      updater instanceof Function
        ? this.sorting.update(updater)
        : this.sorting.set(updater)
    },
    onPaginationChange: (updater) => {
      updater instanceof Function
        ? this.pagination.update(updater)
        : this.pagination.set(updater)
    },
  }))
}
```

### `on[State]Change` rules

- **Always pass an updater-or-value handler.** TanStack Table calls
  `on[State]Change(updaterOrValue)` where `updaterOrValue` is either a new value
  or `(old) => new` — check with `instanceof Function` / `typeof === 'function'`.
- **Pair `on[State]Change` with `state.<slice>`.** Providing
  `onPaginationChange` without `state.pagination` will result in your callback
  firing but the table reading its own internal atom — confusing.
- **The v8 `onStateChange` (single global handler) is gone in v9.** Slices are
  controlled individually.

### Don't double-own a slice

For any given slice, exactly one of these should be the source of truth:

- `initialState.<slice>` (uncontrolled, internal)
- `state.<slice>` + `on[State]Change` (controlled by Angular signal)
- `atoms.<slice>` (controlled by external TanStack Store atom — see §7)

If you supply both `state.x` and `atoms.x`, the external atom wins silently. If
you supply both `initialState.x` and `state.x`, `state.x` wins. Pick one.

---

## 7. Beyond signals: external atoms, state types, app-wide hooks

For most Angular apps, **signals + `state` + `on[State]Change` (§6) is the
right ownership model.** When you need more, see
[`references/external-atoms-and-app-hook.md`](references/external-atoms-and-app-hook.md):

- **External TanStack Store atoms** — `atoms: { pagination: paginationAtom }`
  for slices owned by `@tanstack/store` / `@tanstack/angular-store`, when
  multiple non-table parts of the app share the slice.
- **State type imports** — `PaginationState`, `SortingState`,
  `RowSelectionState`, `TableState<typeof features>`, etc.
- **`createTableHook(...)`** — app-wide `injectAppTable` /
  `createAppColumnHelper` that pre-bind `features` (which now carries row-model
  factories and fn registries). Also exposes `tableComponents` / `cellComponents` /
  `headerComponents` registries (covered in `angular-rendering-directives`).

---

## Failure modes

### 1. (CRITICAL) Hallucinating v8 `createAngularTable` / pre-v9 APIs

```ts
// ❌ v8 — does not exist in v9
import { createAngularTable, getCoreRowModel } from '@tanstack/angular-table'
const table = createAngularTable(() => ({
  columns,
  data: data(),
  getCoreRowModel: getCoreRowModel(),
}))

// ✅ v9
import { injectTable, tableFeatures } from '@tanstack/angular-table'
const features = tableFeatures({})
const table = injectTable(() => ({
  features,
  columns,
  data: data(),
}))
```

Also retired: `getFilteredRowModel`, `getSortedRowModel`, `getPaginationRowModel`
as top-level options → migrated to slots on the `features` object
(`filteredRowModel: createFilteredRowModel()`, `sortedRowModel: createSortedRowModel()`,
`paginatedRowModel: createPaginatedRowModel()`) with fn registries (`filterFns`, `sortFns`) also on `features`.

### 2. (CRITICAL) Missing API because feature not in `features`

`table.atoms.rowSelection`, `table.toggleAllRowsSelected`,
`row.getCanSelect`, `column.getCanSort` etc. are **only** present when the
matching feature is in `features`. The fix is to add the feature, not to
patch around it.

### 3. (CRITICAL) Reimplementing built-in state transitions

```ts
// ❌ DON'T
this.pagination.update((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))

// ✅
this.table.nextPage()
```

Same for `setPageIndex`, `setPageSize`, `setSorting`, `toggleSorting`,
`setColumnFilters`, `setGlobalFilter`, `toggleSelected`, `toggleAllRowsSelected`,
`setColumnVisibility`, `setColumnOrder`, `setExpanded`, `toggleExpanded`,
`resetSorting`, `resetPagination`, `resetRowSelection`, etc.

### 4. (HIGH) Expensive values declared **inside** the `injectTable` initializer

Because the initializer re-runs when any reactive read inside it changes,
declaring `columns` or `features` inside the function causes them to be
recreated and re-applied on every data update (row-model factories and fn
registries are part of `features`, so moving `features` outside covers all of
them). Move them outside the class or to stable class fields.

### 5. (HIGH) Forgetting that the initializer re-runs

If you `console.log` inside the `injectTable` initializer, you'll see it fire
multiple times during the component lifetime — that's correct. The adapter
handles the diff and calls `table.setOptions`. Don't kick off side-effects from
inside the initializer; put them in an `effect(...)` reading the relevant
atoms.

Lower-severity failure modes (MEDIUM/LOW: `state.x` vs `atoms.x` conflict,
updater-fn handling in `on[State]Change`, in-place mutation of state values,
premature `computed` wrapping) →
[`references/external-atoms-and-app-hook.md`](references/external-atoms-and-app-hook.md#lower-severity-failure-modes-mediumlow).

---

## References

- [External TanStack Store atoms, state types, `createTableHook` setup, and MEDIUM failure modes](references/external-atoms-and-app-hook.md)

---

## See also

- `tanstack-table/angular/getting-started` — end-to-end first table
- `tanstack-table/angular/angular-rendering-directives` — `*flexRender*`, DI tokens, `flexRenderComponent`
- `tanstack-table/angular/migrate-v8-to-v9` — v8 → v9 mechanical mapping
- `tanstack-table/angular/compose-with-tanstack-store` — external atoms in depth
- `tanstack-table/angular/client-to-server` — controlled state for server-driven tables
- `tanstack-table/core/state-management` — framework-agnostic atom model
