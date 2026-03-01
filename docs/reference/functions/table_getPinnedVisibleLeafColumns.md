---
id: table_getPinnedVisibleLeafColumns
title: table_getPinnedVisibleLeafColumns
---

# Function: table\_getPinnedVisibleLeafColumns()

```ts
function table_getPinnedVisibleLeafColumns<TFeatures, TData>(table, position?): any[];
```

Defined in: [features/column-pinning/columnPinningFeature.utils.ts:507](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-pinning/columnPinningFeature.utils.ts#L507)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### table

[`Table_Internal`](../type-aliases/Table_Internal.md)\<`TFeatures`, `TData`\>

### position?

[`ColumnPinningPosition`](../type-aliases/ColumnPinningPosition.md) | `"center"`

## Returns

`any`[]
