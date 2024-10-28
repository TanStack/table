---
id: AggregationFn
title: AggregationFn
---

# Type Alias: AggregationFn()\<TFeatures, TData\>

```ts
type AggregationFn<TFeatures, TData>: (columnId, leafRows, childRows) => any;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Parameters

• **columnId**: `string`

• **leafRows**: [`Row`](row.md)\<`TFeatures`, `TData`\>[]

• **childRows**: [`Row`](row.md)\<`TFeatures`, `TData`\>[]

## Returns

`any`

## Defined in

[features/column-grouping/ColumnGrouping.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L30)
