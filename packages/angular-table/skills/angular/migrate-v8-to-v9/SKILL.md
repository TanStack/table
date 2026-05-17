---
name: angular/migrate-v8-to-v9
description: >
  Mechanical v8 → v9 migration for `@tanstack/angular-table`: `createAngularTable` →
  `injectTable`, `get*RowModel()` options → `_rowModels` factories with explicit `*Fns`,
  required `_features` via `tableFeatures()`, `state` access via `table.store.state` instead
  of `table.getState()`, `createColumnHelper<TFeatures, TData>()` generic-order flip, every
  type now requires `TFeatures`, `enablePinning` split into `enableColumnPinning` /
  `enableRowPinning`, `sortingFn` → `sortFn` rename pile, `ColumnSizingInfo` → `ColumnResizing`
  split, removal of `_`-prefixed internals, signal-backed atoms replacing v8 memoized accessors,
  and structural-directive rendering replacing v8 component-based rendering.
type: lifecycle
library: tanstack-table
framework: angular
library_version: '9.0.0-alpha.48'
requires:
  - angular/table-state
  - angular/getting-started
  - angular/angular-rendering-directives
sources:
  - TanStack/table:docs/framework/angular/guide/migrating.md
  - TanStack/table:docs/framework/angular/angular-table.md
  - TanStack/table:packages/angular-table/src/injectTable.ts
  - TanStack/table:packages/angular-table/src/reactivity.ts
---

# Migrate from TanStack Table v8 to v9 (Angular)

> **Angular does not ship a legacy v8 API in v9** (unlike React's
> `useLegacyTable`). You migrate directly to v9's `injectTable` + `_features` +
> `_rowModels` shape. There is no incremental in-place adapter — the public
> entrypoint name itself changes.

This skill is a mechanical translation table. Work through it top-to-bottom.

For exhaustive lookup tables (row-model mapping, feature registration, type
generics, sorting renames, sizing-vs-resizing split, etc.) →
[`references/v8-to-v9-mapping.md`](references/v8-to-v9-mapping.md).

---

## 1. Entrypoint rename

```ts
// v8
import { createAngularTable, getCoreRowModel } from '@tanstack/angular-table'

const v8Table = createAngularTable(() => ({
  columns,
  data: data(),
  getCoreRowModel: getCoreRowModel(),
}))

// v9
import { injectTable, tableFeatures } from '@tanstack/angular-table'

const _features = tableFeatures({}) // empty is valid; core row model is automatic

const v9Table = injectTable(() => ({
  _features,
  _rowModels: {},
  columns,
  data: data(),
}))
```

Key behavioral change: **the `injectTable` initializer re-runs when signals
inside it change**, then the adapter calls `table.setOptions({ ...prev, ...new })`.
Move stable values (`columns`, `_features`, `_rowModels`) **outside** the
initializer so they aren't recreated on every data update.

---

## 2. Required new options: `_features` + `_rowModels`

v9 is opt-in for every feature. **Both options are required.**

```ts
// v8 — features were bundled, row models added piecewise
createAngularTable(() => ({
  columns,
  data: data(),
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  filterFns, // root option
  sortingFns, // root option
}))

// v9
import {
  injectTable,
  tableFeatures,
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  createFilteredRowModel,
  createSortedRowModel,
  createPaginatedRowModel,
  filterFns,
  sortFns, // note rename: sortingFns → sortFns
} from '@tanstack/angular-table'

const _features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
})

injectTable(() => ({
  _features,
  _rowModels: {
    filteredRowModel: createFilteredRowModel(filterFns), // fns are PARAMETERS now
    sortedRowModel: createSortedRowModel(sortFns),
    paginatedRowModel: createPaginatedRowModel(),
  },
  columns,
  data: data(),
}))
```

Row-model and feature lookup tables → [`references/v8-to-v9-mapping.md`](references/v8-to-v9-mapping.md#row-model-migration-table).

---

## 3. State access: `getState()` → `table.store.state` (and atoms)

```ts
// v8
const { sorting, pagination } = table.getState()

// v9 — flat snapshot
const { sorting, pagination } = table.store.state

// v9 — per slice (signal-backed in Angular)
const sorting = table.atoms.sorting.get()
const pagination = table.atoms.pagination.get()
```

In Angular, all three (`table.atoms.<slice>`, `table.store.state`,
`table.baseAtoms.<slice>`) are signal-backed — reading them inside a template,
`computed(...)`, or `effect(...)` registers an Angular dependency
automatically. No `toSignal(...)` wrappers needed.

See `tanstack-table/angular/table-state` for the full state surface mental
model.

---

## 4. Controlled state — `on[State]Change` shape

The shape is largely the same. **`onStateChange` (the single global v8 hook) is
gone in v9.** Slices are controlled individually via `state.<slice>` +
`on[State]Change` callbacks. Each callback receives either a new value or an
updater function:

```ts
// v9 pattern
import { signal } from '@angular/core'
import type { SortingState, PaginationState } from '@tanstack/angular-table'

readonly sorting = signal<SortingState>([])
readonly pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 })

readonly table = injectTable(() => ({
  _features,
  _rowModels: { /* … */ },
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
```

> Always check `updater instanceof Function` (or `typeof updater === 'function'`).
> TanStack Table calls the callback with both shapes depending on the
> transition.

---

## 5. Column helper generic-order flip

```ts
// v8
const columnHelper = createColumnHelper<Person>()

// v9 — TFeatures FIRST, then TData
const columnHelper = createColumnHelper<typeof _features, Person>()
```

New in v9: `columnHelper.columns([...])` preserves each column's `TValue` —
prefer it over a bare array literal:

```ts
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First',
    cell: (i) => i.getValue(),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: () => 'Edit',
  }),
])
```

If you don't want to repeat `TFeatures` everywhere, use `createTableHook(...)`
and the resulting `createAppColumnHelper<Person>()` which pre-binds features.

Every public type now requires `TFeatures` (`ColumnDef<TFeatures, TData, TValue>`,
`Cell<TFeatures, TData, TValue>`, etc.). Full mapping →
[`references/v8-to-v9-mapping.md`](references/v8-to-v9-mapping.md#type-generics--every-type-takes-tfeatures-now).

---

## 6. Rendering — directive-based, with shorthand directives

v8 Angular rendering was already directive-flavored, but v9 adds the
**shorthand directives** (`*flexRenderCell`, `*flexRenderHeader`,
`*flexRenderFooter`) that auto-resolve the column-def slot and context. Prefer
them over the long `*flexRender="… ; props: …"` form.

```html
<!-- v8 / v9 long form (still works) -->
<td
  *flexRender="cell.column.columnDef.cell; props: cell.getContext(); let rendered"
>
  {{ rendered }}
</td>

<!-- v9 shorthand — recommended -->
<td *flexRenderCell="cell; let value">{{ value }}</td>
<th *flexRenderHeader="header; let value">{{ value }}</th>
<th *flexRenderFooter="footer; let value">{{ value }}</th>
```

```ts
import { FlexRender } from '@tanstack/angular-table' // ← imports both directives
@Component({ imports: [FlexRender], ... })
```

v9-only:

- `flexRenderComponent(Component, { inputs, outputs, bindings, directives, injector })`
  for explicit component rendering.
- DI tokens (`TanStackTable` / `TanStackTableHeader` / `TanStackTableCell`
  directives + `injectTableContext()` / `injectTableHeaderContext()` /
  `injectTableCellContext()` / `injectFlexRenderContext()`) — no more input
  drilling.
- Column-def `cell` / `header` / `footer` functions run inside
  `runInInjectionContext`, so `inject(...)` and signals work in them.

See `tanstack-table/angular/angular-rendering-directives` for the full surface.

---

## 7. Reactivity model — signals replace v8 memo accessors

v8 backed reactivity with manual memoized getters. v9's adapter
(`angularReactivity(injector)`) backs every readonly atom with an Angular
`computed` and every writable atom with an Angular `signal`. Consequences:

- **No `toSignal(...)` adapters around table state.** Read `table.atoms.x.get()`
  / `table.store.state.x` directly inside templates, `computed`, `effect`.
- **`computed(...)` is for derivation / equality, not for "make it reactive".**
  Use `{ equal: shallow }` from `@tanstack/angular-table` on object/array
  slices to skip downstream work on no-op updates.
- **The `injectTable` initializer re-runs on signal changes.** Don't put
  expensive object literals in there.

---

## 8. Renames at a glance

- `sortingFn` → `sortFn`, `sortingFns` → `sortFns`, `SortingFn` → `SortFn`
  (full table in [`references/v8-to-v9-mapping.md`](references/v8-to-v9-mapping.md#naming-renames--sorting)).
- `enablePinning` → `enableColumnPinning` / `enableRowPinning` (split).
- `columnSizingInfo` state → `columnResizing` state (sizing/resizing split into
  two features — see [`references/v8-to-v9-mapping.md`](references/v8-to-v9-mapping.md#column-sizing-vs-resizing--split)).
- All `_`-prefixed internal APIs removed; use the public equivalents.

---

## Migration checklist

- [ ] Replace `createAngularTable` import + call with `injectTable`.
- [ ] Add `_features: tableFeatures({...})` (or `stockFeatures`) — required.
- [ ] Convert every `get*RowModel()` option to a `_rowModels.<slot>` entry with
      the matching `create*RowModel(...)` factory.
- [ ] Add `filterFns` / `sortFns` / `aggregationFns` as **factory parameters**
      where needed.
- [ ] Update `createColumnHelper<Person>()` → `createColumnHelper<typeof _features, Person>()`.
- [ ] Update every `ColumnDef<Person>` / `Cell<Person, X>` etc. to include
      `TFeatures`.
- [ ] Replace `table.getState()` reads with `table.store.state` (or
      `table.atoms.<slice>.get()` for per-slice reactivity).
- [ ] Remove any usage of the v8 single `onStateChange` — split into per-slice
      `on[State]Change`.
- [ ] In `on[State]Change` callbacks, handle both value and updater-fn shapes.
- [ ] Move `columns`, `_features`, `_rowModels` **outside** the `injectTable`
      initializer.
- [ ] Switch any `flexRender` long-form to `*flexRenderCell` / `*flexRenderHeader` /
      `*flexRenderFooter` shorthand where applicable.
- [ ] Where you need component rendering with explicit options, switch wrapper
      shape to `flexRenderComponent(Component, { inputs, outputs, ... })`.
- [ ] Replace prop-drilled cell/header inputs with
      `injectTableCellContext()` / `injectTableHeaderContext()` /
      `injectFlexRenderContext()` (optional but worthwhile).
- [ ] Rename `sortingFn` → `sortFn`, `getSortingFn` → `getSortFn`,
      `sortingFns` → `sortFns`, `SortingFn` → `SortFn`.
- [ ] Replace `columnSizingInfo` state / setters / change handler with the
      `columnResizing` equivalents; add `columnResizingFeature` to `_features`
      if you actually drag-resize.
- [ ] Replace `enablePinning` with `enableColumnPinning` / `enableRowPinning`.
- [ ] Update `ColumnMeta` module augmentation to include the `TFeatures`
      generic.
- [ ] Drop any `_`-prefixed internal API usages; replace with public
      equivalents.
- [ ] (Optional) Adopt `tableOptions(...)` for shared base config.
- [ ] (Optional) Adopt `createTableHook(...)` for app-wide table infrastructure.

---

## Failure modes

### 1. (CRITICAL) Leaving `getCoreRowModel()` / `getSortedRowModel()` / etc. in v9 options

These options don't exist anymore. They become `_rowModels` entries with
factory functions. The TypeScript error is loud but agents sometimes silence
it with `as any` — don't.

### 2. (CRITICAL) Reaching for `createAngularTable` from v8 muscle memory

Always `injectTable(() => ({...}))`. The injection-context requirement means
it must run from a class field, constructor, or
`runInInjectionContext(injector, () => injectTable(...))`.

### 3. (CRITICAL) Registering a feature but forgetting its row model

```ts
// ❌ filtering enabled, but no filtered row model — UI changes, rows don't filter
_features: tableFeatures({ columnFilteringFeature })
_rowModels: {
} // missing filteredRowModel

// ✅
_rowModels: {
  filteredRowModel: createFilteredRowModel(filterFns)
}
```

Same for sorting, pagination, expanding, grouping, faceting. Selection,
visibility, ordering, pinning, sizing, resizing do **not** need a row model.

### 4. (HIGH) `getState()` → `table.store.state` text replacement loses reactivity

Bulk-replacing `table.getState().x` with `table.store.state.x` works for _current
value_ reads, but if you used a `computed`/`memo` around `getState()` for
reactivity, switch to `table.atoms.x.get()` — it's already signal-backed and
needs no wrapper.

### 5. (HIGH) Stale `sortingFn` / `sortingFns` references in column defs

The rename is mechanical: `sortingFn` → `sortFn`, `sortingFns` → `sortFns`,
`getSortingFn` → `getSortFn`. Missed renames produce silent runtime fallbacks
to default sort.

### 6. (HIGH) Column helper using v8 generic order

```ts
// ❌ TS will complain — the first generic is TFeatures, not TData
const columnHelper = createColumnHelper<Person>()
```

### 7. (HIGH) Putting `_features` / `columns` / row-model factories inside the `injectTable` initializer

The v8 mental model was "build columns inside the hook". v9's
`injectTable` initializer re-runs on every signal read change — keep heavy
literals outside.

Lower-severity failure modes (MEDIUM/LOW: `stockFeatures` cleanup, `enablePinning`
removal, `columnSizingInfo` rename, single-handler porting, hand-rolled
`TFeatures` in render fns, `_`-prefix internal usage, reimplementing built-in
APIs, `ColumnMeta` augmentation drift, `flexRender` as a function, mixing v8/v9
atoms) → [`references/v8-to-v9-mapping.md`](references/v8-to-v9-mapping.md#lower-severity-failure-modes-mediumlow).

---

## References

- [Full v8 → v9 mapping tables (row models, features, types, renames, MEDIUM failure modes)](references/v8-to-v9-mapping.md)

---

## See also

- `tanstack-table/angular/getting-started` — what the v9 target shape looks like
- `tanstack-table/angular/table-state` — signal-backed atom model
- `tanstack-table/angular/angular-rendering-directives` — full rendering API
- `tanstack-table/angular/production-readiness` — once compiling, optimize the bundle
- `tanstack-table/core/migrate-v8-to-v9` — framework-agnostic core changes
