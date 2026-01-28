---
id: table_getPinnedLeafColumns
title: table_getPinnedLeafColumns
---

# Function: table\_getPinnedLeafColumns()

```ts
function table_getPinnedLeafColumns<TFeatures, TData>(table, position): any[];
```

Defined in: [packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts:438](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L438)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### position

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md) | `"center"`

## Returns

`any`[]
