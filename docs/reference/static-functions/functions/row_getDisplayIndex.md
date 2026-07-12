---
id: row_getDisplayIndex
title: row_getDisplayIndex
---

# Function: row\_getDisplayIndex()

```ts
function row_getDisplayIndex<TFeatures, TData>(row): number;
```

Defined in: [core/rows/coreRowsFeature.utils.ts:14](https://github.com/TanStack/table/blob/main/packages/table-core/src/core/rows/coreRowsFeature.utils.ts#L14)

Returns this row's zero-based position in the current pre-pagination row
model. Rows outside that model return `-1`.

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../../index/interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../../index/type-aliases/RowData.md)

## Parameters

### row

[`Row`](../../index/type-aliases/Row.md)\<`TFeatures`, `TData`\>

## Returns

`number`
