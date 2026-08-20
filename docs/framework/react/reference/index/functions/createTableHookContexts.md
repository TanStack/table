---
id: createTableHookContexts
title: createTableHookContexts
---

# Function: createTableHookContexts()

```ts
function createTableHookContexts<TFeatures, TData>(): TableHookContexts<TFeatures, TData>;
```

Defined in: [react-table/src/createTableHookContexts.tsx:83](https://github.com/TanStack/table/blob/main/packages/react-table/src/createTableHookContexts.tsx#L83)

Creates a fresh, scoped set of table/cell/header contexts (plus matching
context hooks) that you can pass into [createTableHook](createTableHook.md). This mirrors
TanStack Form's `createFormHookContexts`.

You usually do NOT need this: by default `createTableHook` wires its
`AppTable`/`AppCell`/`AppHeader` providers to a shared module-scoped context,
and you read it with the `useTableContext`/`useCellContext`/`useHeaderContext`
hooks returned from `createTableHook`. Reach for `createTableHookContexts`
when you need an *isolated* context, e.g. when nesting one table inside
another and a consumer would otherwise read the wrong (nearest) provider.

Type-safety note: the hooks returned here are typed with `TFeatures` only.
They do NOT know the component maps you register in `createTableHook`
(`tableComponents`/`cellComponents`/`headerComponents`), because those are
defined later. For the richest types (the `App*` components and your
registered components attached), prefer the `use*Context` hooks returned from
your `createTableHook` call. The hooks here are the escape hatch for reading
context from a module that does not / cannot import the `createTableHook`
result.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData` = `RowData`

## Returns

[`TableHookContexts`](../interfaces/TableHookContexts.md)\<`TFeatures`, `TData`\>

## Example

```tsx
// scoped-table-context.ts
export const {
  tableContext,
  cellContext,
  headerContext,
  useTableContext,
  useCellContext,
  useHeaderContext,
} = createTableHookContexts<typeof features>()

// table.ts
export const { useAppTable } = createTableHook({
  features,
  tableContext, // <- pass the scoped contexts so the providers use them
  cellContext,
  headerContext,
  tableComponents: { PaginationControls },
})
```
