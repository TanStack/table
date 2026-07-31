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

Defined in: [core/headers/buildHeaderGroups.ts:211](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/headers/buildHeaderGroups.ts#L211)

Builds the nested header group structure for a table.

The result accounts for visible leaf columns, pinned column groups, and placeholder headers needed to render multi-level headers.

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

[`Table_Internal`](../interfaces/Table_Internal.md)\<`TFeatures`, `TData`\>

### headerFamily?

`"start"` | `"end"` | `"center"`

## Returns

[`HeaderGroup`](../interfaces/HeaderGroup.md)\<`TFeatures`, `TData`\>[]
