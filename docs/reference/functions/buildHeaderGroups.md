---
id: buildHeaderGroups
title: buildHeaderGroups
---

# Function: buildHeaderGroups()

```ts
function buildHeaderGroups<TFeatures, TData, TValue>(
   allColumns, 
   columnsToGroup, 
   table, 
   headerFamily?): HeaderGroup<TFeatures, TData>[];
```

Defined in: [packages/table-core/src/core/headers/buildHeaderGroups.ts:11](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/buildHeaderGroups.ts#L11)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

### TValue

`TValue` *extends* `unknown` = `unknown`

## Parameters

### allColumns

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>[]

### columnsToGroup

[`Column`](../type-aliases/Column.md)\<`TFeatures`, `TData`, `TValue`\>[]

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### headerFamily?

`"left"` | `"right"` | `"center"`

## Returns

[`HeaderGroup`](../type-aliases/HeaderGroup.md)\<`TFeatures`, `TData`\>[]
