---
id: createTable
title: createTable
---

# Function: createTable()

```ts
function createTable<TFeatures, TData, TSelected>(tableOptions, selector?): SolidTable<TFeatures, TData, TSelected>;
```

Defined in: [createTable.ts:99](https://github.com/TanStack/table/blob/main/packages/solid-table/src/createTable.ts#L99)

Creates a Solid table instance backed by Solid-aware TanStack Store atoms.

The optional selector projects from `table.store`; the selected value is
exposed as the `table.state` accessor. Table APIs and atom reads participate
in Solid dependency tracking, so computations that read a specific slice can
update without invalidating unrelated UI.

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

[`SolidTable`](../type-aliases/SolidTable.md)\<`TFeatures`, `TData`, `TSelected`\>

## Example

```tsx
const table = createTable(
  {
    _features,
    _rowModels: {},
    columns,
    data,
  },
  (state) => ({ pagination: state.pagination }),
)

table.state().pagination
```
