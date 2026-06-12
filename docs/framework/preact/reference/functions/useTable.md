---
id: useTable
title: useTable
---

# Function: useTable()

```ts
function useTable<TFeatures, TData, TSelected>(tableOptions, selector?): PreactTable<TFeatures, TData, TSelected>;
```

Defined in: [useTable.ts:112](https://github.com/TanStack/table/blob/main/packages/preact-table/src/useTable.ts#L112)

Creates a Preact table instance backed by TanStack Store atoms.

The optional selector projects from `table.store`; the selected value is
exposed on `table.state` and compared shallowly for Preact re-renders. Omit
the selector to subscribe to every registered table state slice, or pass a
narrower selector and use `table.Subscribe` lower in the tree for targeted
subscriptions.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `TableState`\<`TFeatures`\>

## Parameters

### tableOptions

`TableOptions`\<`TFeatures`, `TData`\>

### selector?

(`state`) => `TSelected`

## Returns

[`PreactTable`](../type-aliases/PreactTable.md)\<`TFeatures`, `TData`, `TSelected`\>

## Example

```tsx
const table = useTable(
  {
    features,
    columns,
    data,
  },
  (state) => ({ pagination: state.pagination }),
)

table.state.pagination
```
