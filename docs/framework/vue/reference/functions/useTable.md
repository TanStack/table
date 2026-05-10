---
id: useTable
title: useTable
---

# Function: useTable()

```ts
function useTable<TFeatures, TData, TSelected>(tableOptions, selector?): VueTable<TFeatures, TData, TSelected>;
```

Defined in: [packages/vue-table/src/useTable.ts:130](https://github.com/TanStack/table/blob/main/packages/vue-table/src/useTable.ts#L130)

Creates a Vue table instance backed by Vue-aware TanStack Store atoms.

Table options may contain Vue refs or computed values. The adapter unwraps
those reactive inputs, watches them with synchronous flushing, and keeps the
table options in sync. The optional selector projects from `table.store` and
exposes the selected value on `table.state`.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = `TableState`\<`TFeatures`\>

## Parameters

### tableOptions

`TableOptions`\<`TFeatures`, `TData`\> | [`TableOptionsWithReactiveData`](../type-aliases/TableOptionsWithReactiveData.md)\<`TFeatures`, `TData`\>

### selector?

(`state`) => `TSelected`

## Returns

[`VueTable`](../type-aliases/VueTable.md)\<`TFeatures`, `TData`, `TSelected`\>

## Example

```ts
const table = useTable(
  {
    _features,
    _rowModels: {},
    columns,
    data,
  },
  (state) => ({ pagination: state.pagination }),
)

table.state.pagination
```
