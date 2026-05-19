---
name: react/react-subscribe-compiler-compat
description: >
  React Compiler compatibility for `@tanstack/react-table` v9. When you read
  table state via builder APIs (`column.getIsPinned()`, `row.getIsSelected()`,
  `cell.getIsAggregated()`, `header.column.getIsSorted()`) inside a nested
  custom component, React Compiler memoizes the child against the stable
  `column` / `row` / `cell` reference and never re-runs when the underlying
  atom changes. Symptom: stale checkboxes, frozen sort indicators, dead pin
  buttons. Fix: wrap the JSX in `<Subscribe source={table.store} selector={…}>`
  or `<Subscribe source={table.atoms.X}>` so the dependency is visible to the
  compiler. Routing keywords: Subscribe, table.Subscribe, React Compiler,
  stale checkbox, memoized header/cell, builder API.
type: framework
library: tanstack-table
framework: react
library_version: '9.0.0-alpha.48'
requires:
  - react/table-state
sources:
  - TanStack/table:docs/framework/react/guide/table-state.md
  - TanStack/table:packages/react-table/src/Subscribe.ts
  - TanStack/table:examples/react/basic-subscribe/src/main.tsx
---

This skill builds on `tanstack-table/state-management` and `tanstack-table/react/table-state`. Read those first — the atom model is what makes builder reads invisible to React Compiler, and `table-state` covers the basics of `<Subscribe>` / `<table.Subscribe>`. This skill is laser-focused on the **one** React-specific failure mode that comes up when React Compiler is enabled.

## Why this exists

Under React Compiler, JSX is memoized against the props your component receives. A custom `DraggableHeader({ header })` receives a stable `header` reference; the compiler hashes the JSX it produces against that reference. When you call `header.column.getIsPinned()` inside that component, the compiler **cannot see the atom read** hidden behind the method — it returns the cached JSX, and the UI goes stale.

The fix is to make the dependency visible: read the slice via `<Subscribe>` or `<table.Subscribe>`. The compiler sees the selector function, picks up the dependency edge, and re-runs the children whenever the subscribed slice changes.

## Setup

You only need `<Subscribe>` from `@tanstack/react-table`. It's the same component shown in `table-state`, applied specifically around builder-pattern reads in custom nested components.

```tsx
import { Subscribe } from '@tanstack/react-table'
```

## Core Pattern: wrap nested builder reads in `<Subscribe>`

Whenever a child component reads state via a builder method (`getIs*`, `getCan*`, etc.) inside JSX that the compiler memoizes, wrap it in `<Subscribe>` keyed on the relevant slice.

### Pin / sort indicator on a custom header component

```tsx
import { Subscribe } from '@tanstack/react-table'

function DraggableHeader({ header, table }) {
  return (
    <Subscribe
      source={table.store}
      selector={(s) => ({ columnPinning: s.columnPinning, sorting: s.sorting })}
    >
      {() => {
        // Reads run inside the Subscribe child — re-evaluated on selected slice changes.
        const isPinned = header.column.getIsPinned()
        const sortDir = header.column.getIsSorted()
        return (
          <th data-pinned={isPinned}>
            {header.column.id}
            {sortDir === 'asc' ? ' 🔼' : sortDir === 'desc' ? ' 🔽' : null}
          </th>
        )
      }}
    </Subscribe>
  )
}
```

Source: `docs/framework/react/guide/table-state.md` (Subscribe for React Compiler Compatibility); `packages/react-table/src/Subscribe.ts`.

### Row-selection checkbox inside a cell — narrowest subscription

```tsx
columnHelper.display({
  id: 'select',
  cell: ({ row, table }) => (
    // Subscribe to the rowSelection ATOM (not table.store) and project to ONE row.
    // Re-renders ONLY when this row's selection flips.
    <Subscribe
      source={table.atoms.rowSelection}
      selector={(rowSelection) => rowSelection[row.id]}
    >
      {(isSelected) => (
        <input
          type="checkbox"
          checked={!!isSelected}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      )}
    </Subscribe>
  ),
})
```

Source: `examples/react/basic-subscribe/src/main.tsx` (this exact pattern).

### Component-level vs cell-level — which API

| Context                                                      | `table` is                     | API                                                                          |
| ------------------------------------------------------------ | ------------------------------ | ---------------------------------------------------------------------------- |
| Component receiving `table` from `useTable`                  | `ReactTable<…>`                | `<table.Subscribe>` works                                                    |
| Inside `cell: ({ table }) => …` / `header: ({ table }) => …` | core `Table<TFeatures, TData>` | `table.Subscribe` is **undefined**. Use the standalone `<Subscribe>` import. |

## Common Mistakes

### CRITICAL Builder read in a nested component without `<Subscribe>`

Wrong:

```tsx
function DraggableHeader({ header }) {
  const isPinned = header.column.getIsPinned() // hidden atom read
  return <th data-pinned={isPinned}>{header.column.id}</th>
}
```

Correct:

```tsx
import { Subscribe } from '@tanstack/react-table'

function DraggableHeader({ header, table }) {
  return (
    <Subscribe source={table.store} selector={(s) => s.columnPinning}>
      {() => {
        const isPinned = header.column.getIsPinned()
        return <th data-pinned={isPinned}>{header.column.id}</th>
      }}
    </Subscribe>
  )
}
```

React Compiler memoizes the child's JSX against the stable `header` reference. The state-dependent builder method hides its atom dependency, so the memoized JSX never re-runs.
Source: `docs/framework/react/guide/table-state.md`; `examples/react/basic-subscribe/src/main.tsx`; `packages/react-table/src/Subscribe.ts`.

### HIGH Using `table.Subscribe` from inside a cell or header definition

Wrong:

```tsx
cell: ({ row, table }) => (
  <table.Subscribe
    source={table.atoms.rowSelection}
    selector={(s) => s[row.id]}
  >
    {(isSelected) => <input type="checkbox" checked={!!isSelected} />}
  </table.Subscribe>
)
```

Correct:

```tsx
import { Subscribe } from '@tanstack/react-table'

cell: ({ row, table }) => (
  <Subscribe source={table.atoms.rowSelection} selector={(s) => s[row.id]}>
    {(isSelected) => (
      <input
        type="checkbox"
        checked={!!isSelected}
        onChange={row.getToggleSelectedHandler()}
      />
    )}
  </Subscribe>
)
```

Cell and header render contexts type `table` as `Table<TFeatures, TData>`, not `ReactTable` — `table.Subscribe` is undefined. Import the standalone `<Subscribe>`.
Source: `docs/framework/react/guide/table-state.md` (Tips); `packages/react-table/src/Subscribe.ts`.

### MEDIUM Wrapping every cell in `<Subscribe>` by default

Wrong:

```tsx
// Inline cell that already re-runs on every parent render — wrap is unnecessary.
{
  row.getVisibleCells().map((cell) => (
    <Subscribe source={table.store} selector={(s) => s.rowSelection}>
      {() => (
        <td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
      )}
    </Subscribe>
  ))
}
```

Correct:

```tsx
{
  row.getVisibleCells().map((cell) => (
    <td key={cell.id}>
      <table.FlexRender cell={cell} />
    </td>
  ))
}
```

`<Subscribe>` is overhead. For inline JSX in the parent component the compiler always re-evaluates on parent re-render, so wrapping adds subscription churn without correctness benefit. Reach for `<Subscribe>` only at custom-component boundaries that the compiler memoizes.
Source: `docs/framework/react/guide/table-state.md`.

### MEDIUM Subscribing to the whole `table.store` for one row's checkbox

Wrong:

```tsx
<Subscribe source={table.store} selector={(s) => s.rowSelection[row.id]}>
  {(isSelected) => <input type="checkbox" checked={!!isSelected} />}
</Subscribe>
```

Correct:

```tsx
<Subscribe source={table.atoms.rowSelection} selector={(s) => s[row.id]}>
  {(isSelected) => (
    <input
      type="checkbox"
      checked={!!isSelected}
      onChange={row.getToggleSelectedHandler()}
    />
  )}
</Subscribe>
```

Every change to `table.store` re-runs the Subscribe child. Subscribing to `table.atoms.rowSelection` (a single slice atom) with a per-row projection limits work to actual selection changes for that row.
Source: `examples/react/basic-subscribe/src/main.tsx`; `docs/framework/react/guide/table-state.md` (Tips).

### CRITICAL Reading raw state with `table.getState()` on v9 instead of `<Subscribe>`

Wrong:

```tsx
function Toolbar({ table }) {
  // v8 muscle memory — does NOT subscribe in v9.
  const { rowSelection } = table.getState()
  return <div>{Object.keys(rowSelection).length} selected</div>
}
```

Correct:

```tsx
function Toolbar({ table }) {
  return (
    <table.Subscribe selector={(s) => Object.keys(s.rowSelection).length}>
      {(count) => <div>{count} selected</div>}
    </table.Subscribe>
  )
}
```

`table.getState()` is a current-value read in v9; it does not subscribe the component. The default `useTable` selector subscribes the parent, but deeply-nested children should opt in explicitly.
Source: PR #6246; `packages/react-table/src/useTable.ts` JSDoc.

## See Also

- `tanstack-table/react/table-state` — base `<Subscribe>` / `<table.Subscribe>` API and external atoms.
- `tanstack-table/react/production-readiness` — selector narrowing and per-slice `useSelector(table.atoms.X)`.
- `tanstack-table/react/migrate-v8-to-v9` — replacing `useReactTable` with `useTable` to fix the React Compiler "incompatible library" warning.
