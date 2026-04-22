---
id: useTable
title: useTable
---

# Function: useTable()

```ts
function useTable<TFeatures, TData, TSelected>(tableOptions, selector): ReactTable<TFeatures, TData, TSelected>;
```

Defined in: [useTable.ts:114](https://github.com/TanStack/table/blob/main/packages/react-table/src/useTable.ts#L114)

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TData

`TData` *extends* `RowData`

### TSelected

`TSelected` = \{
\}

## Parameters

### tableOptions

`TableOptions`\<`TFeatures`, `TData`\>

### selector

(`state`) => `TSelected`

## Returns

[`ReactTable`](../type-aliases/ReactTable.md)\<`TFeatures`, `TData`, `TSelected`\>
