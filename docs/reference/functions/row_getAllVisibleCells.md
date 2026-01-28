---
id: row_getAllVisibleCells
title: row_getAllVisibleCells
---

# Function: row\_getAllVisibleCells()

```ts
function row_getAllVisibleCells<TFeatures, TData>(row): Cell<TFeatures, TData, unknown>[];
```

Defined in: [packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-visibility/columnVisibilityFeature.utils.ts#L68)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### row

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

[`Cell`](../type-aliases/Cell.md)\<`TFeatures`, `TData`, `unknown`\>[]
