---
title: Table Context Guide
---

When you register reusable components with [`createTableHook`](./composable-tables), those components read the current table, cell, or header from Preact context instead of from props. This guide explains how that context works, how to read it with full type-safety, and how to create an isolated context for advanced cases like nested tables.

## How The Context Is Provided

The components returned by `useAppTable` are what put values on context:

- `<table.AppTable>` provides the current table instance.
- `<table.AppCell cell={cell}>` provides the current cell instance.
- `<table.AppHeader header={header}>` and `<table.AppFooter header={footer}>` provide the current header instance.

Your registered `tableComponents`, `cellComponents`, and `headerComponents` then read those instances with the matching hooks:

```tsx
function PaginationControls() {
  const table = useTableContext() // the table provided by <table.AppTable>
  return <button onClick={() => table.nextPage()}>Next</button>
}

function TextCell() {
  const cell = useCellContext<string>() // the cell provided by <table.AppCell>
  return <span>{cell.getValue()}</span>
}

function SortIndicator() {
  const header = useHeaderContext() // the header provided by <table.AppHeader>
  return header.column.getIsSorted() ? '🔼' : null
}
```

The instance you read back is the same one those wrappers render with, already extended with the `App*` components and your registered components. For example, inside a table component `table.PaginationControls` and `table.AppCell` are available, and inside a cell component `cell.TextCell` and `cell.FlexRender` are available.

> [!TIP]
> You often do not need table context to reach the table at all. Every `cell`, `header`, `row`, and `column` instance already carries a reference back to its table: `cell.table`, `header.table`, `row.table`, and `column.table`. So inside a cell or header component you can read the table straight off the instance you already have (for example `cell.table.nextPage()`) instead of calling `useTableContext()`. The instances are linked to each other too (`cell.row`, `cell.column`, `header.column`, `row.getAllCells()`), so a single instance is usually enough to navigate to whatever you need. Reach for `useTableContext()` when a component has no instance to start from, such as a standalone toolbar or pagination control.

## Import The Hooks From Your createTableHook Result

> [!IMPORTANT]
> For the best type-safety, import `useTableContext`, `useCellContext`, and `useHeaderContext` from the same module where you called `createTableHook`. Those hooks know your `TFeatures` **and** your registered component maps, so `table.PaginationControls`, `cell.TextCell`, and `header.SortIndicator` are all typed.

```tsx
// hooks/table.ts
export const {
  useAppTable,
  createAppColumnHelper,
  useTableContext, // <- typed with TFeatures + your tableComponents
  useCellContext, //  <- typed with TFeatures + your cellComponents
  useHeaderContext, // <- typed with TFeatures + your headerComponents
} = createTableHook({
  features,
  tableComponents,
  cellComponents,
  headerComponents,
})
```

## Passing Instances Through Your Own Context

`createTableHookContexts` is also useful on its own, separately from `createTableHook`, for avoiding prop drilling. The `column`, `row`, `cell`, and `header` instances are **stable references**. You can place any of them on a context and read it deep in a subtree, and because the reference does not change when table state changes, the context value stays the same and consumers will not re-render from state changes.

Reach for `createTableHookContexts` instead of hand-rolling `createContext`. It hands you a context plus a matching `TFeatures`-typed hook, so you do not have to retype the value or write the `useContext` guard yourself. (See [Scoped Contexts With createTableHookContexts](#scoped-contexts-with-createtablehookcontexts) below for the other use of this util, passing the contexts into `createTableHook`.)

```tsx
// cell-slot-context.ts
export const { cellContext, useCellContext } =
  createTableHookContexts<typeof features>()

// provide the (stable) cell once, near where you render it
function CellSlot({ cell }: { cell: Cell<typeof features, Person, unknown> }) {
  return (
    <cellContext.Provider value={cell}>
      <DeeplyNestedCellUI />
    </cellContext.Provider>
  )
}

// read it anywhere below, no prop drilling
function DeeplyNestedCellUI() {
  const cell = useCellContext() // typed with your TFeatures
  return <span>{/* ... */}</span>
}
```

> [!IMPORTANT]
> That stability is exactly why state-dependent method reads go stale. A memoized component that reads something like `header.column.getIsSorted()`, `cell.row.getIsSelected()`, or `cell.getValue()` off a context-provided instance will not re-render when that state changes on its own. Wrap reactive reads in `Subscribe` (or `useSelector`) so they re-run on the state they depend on. See the [table state guide](./table-state) for `Subscribe` and selector patterns.

The `table` object is the exception. `useTable` returns a fresh `table` reference on every state change, so that JSX which depends on it re-evaluates. It is therefore **not** a stable context value. Providing the table through your own context re-renders consumers whenever the providing component re-renders. If you want a stable handle to pass down, provide `table.store` or a specific atom such as `table.atoms.rowSelection` (these are stable) and read them with `Subscribe` / `useSelector`, or keep the table in a ref.

## The Default Shared Context

By default you do not create or wire any context yourself. `createTableHook` connects its `AppTable`/`AppCell`/`AppHeader` providers to a shared, module-scoped context, and the hooks it returns read from that same context. Because the context lives at module scope, its identity is stable across hot module replacement during local development, so a component edit never leaves a provider and a consumer pointing at mismatched contexts.

Independent tables stay isolated through normal provider scoping: each `<table.AppTable>` provides its own table instance, and a consumer reads the nearest provider. Rendering two different tables side by side, or in different routes, works without any extra setup.

## Scoped Contexts With createTableHookContexts

The shared context only becomes a problem if you **nest** one table's provider inside another's and a consumer in that overlap reads the nearest (inner) provider instead of the one you intended. For that case, create an isolated context with `createTableHookContexts` and pass it into `createTableHook`:

```tsx
// scoped-table-context.ts (no component imports)
import { createTableHookContexts, tableFeatures } from '@tanstack/preact-table'

export const features = tableFeatures({/* ... */})

export const {
  tableContext,
  cellContext,
  headerContext,
  useTableContext,
  useCellContext,
  useHeaderContext,
} = createTableHookContexts<typeof features>()
```

```tsx
// table.ts
import { createTableHook } from '@tanstack/preact-table'
import {
  cellContext,
  features,
  headerContext,
  tableContext,
} from './scoped-table-context'

export const { useAppTable } = createTableHook({
  features,
  tableContext, // <- providers now use these scoped contexts
  cellContext,
  headerContext,
  tableComponents: {/* ... */},
})
```

Each call to `createTableHookContexts` returns a brand-new set of contexts, so two table setups that use their own scoped contexts can be nested without reading each other's values.

### Which Hooks To Use With Scoped Contexts

`createTableHookContexts` also returns `useTableContext`/`useCellContext`/`useHeaderContext`, but they are typed with `TFeatures` only. They do not know your registered component maps, because those are defined later in `createTableHook`. So:

- Prefer the hooks returned from your `createTableHook` call for the richest types (your `tableComponents`/`cellComponents`/`headerComponents` are typed).
- Use the hooks from `createTableHookContexts` only when you need to read context from a module that cannot import the `createTableHook` result.

This mirrors TanStack Form's `createFormHookContexts`, where the context hooks are intentionally loose and the strongly typed path lives on the form/field components.

## When To Use This

- Do nothing special for the common case. The default shared context handles single tables and multiple independent tables.
- Reach for `createTableHookContexts` only when you nest different table setups and need their contexts isolated, or when you want to read context from a component-free module.
