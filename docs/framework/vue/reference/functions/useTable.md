---
id: useTable
title: useTable
---

# Function: useTable()

```ts
function useTable<TFeatures, TData>(tableOptions): VueTable<TFeatures, TData>;
```

Defined in: [useTable.ts:80](https://github.com/TanStack/table/blob/main/packages/vue-table/src/useTable.ts#L80)

Creates a Vue table instance backed by Vue-aware TanStack Store atoms.

Table options may contain Vue refs or computed values. The adapter unwraps
those reactive inputs, watches them with synchronous flushing, and keeps the
table options in sync. Read table APIs or atoms inside templates, render
functions, computed values, or watcher sources to track updates.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

## Parameters

### tableOptions

  \| `TableOptions`\<`TFeatures`, `TData`\>
  \| [`TableOptionsWithReactiveData`](../type-aliases/TableOptionsWithReactiveData.md)\<`TFeatures`, `TData`\>

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
