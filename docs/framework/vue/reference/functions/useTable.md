---
id: useTable
title: useTable
---

# Function: useTable()

```ts
function useTable<TFeatures, TData>(tableOptions): VueTable<TFeatures, TData>;
```

Defined in: [packages/vue-table/src/useTable.ts:84](https://github.com/TanStack/table/blob/main/packages/vue-table/src/useTable.ts#L84)

Creates a Vue table instance backed by Vue-aware TanStack Store atoms.

Table options may contain Vue refs or computed values. The adapter unwraps
those reactive inputs, watches them with synchronous flushing, and keeps the
table options in sync. Use `table.Subscribe` or native Vue computed values
around `table.atoms.<slice>.get()` for selected reactive reads.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

## Parameters

### tableOptions

`TableOptions`\<`TFeatures`, `TData`\> | [`TableOptionsWithReactiveData`](../type-aliases/TableOptionsWithReactiveData.md)\<`TFeatures`, `TData`\>

## Returns

[`VueTable`](../type-aliases/VueTable.md)\<`TFeatures`, `TData`\>

## Example

```ts
const table = useTable(
  {
    features,
    columns,
    data,
  },
)
```
