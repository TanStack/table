---
id: useTable
title: useTable
---

# Function: useTable()

```ts
function useTable<TFeatures, TData, TSelected>(tableOptions, selector?): OctaneTable<TFeatures, TData, TSelected>;
```

Defined in: [useTable.tsrx.d.ts:14](https://github.com/TanStack/table/blob/main/packages/octane-table/src/useTable.tsrx.d.ts#L14)

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

[`OctaneTable`](../type-aliases/OctaneTable.md)\<`TFeatures`, `TData`, `TSelected`\>
