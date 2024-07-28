---
id: AggregationFn
title: AggregationFn
---

# Type Alias: AggregationFn()\<TFeatures, TData\>

```ts
type AggregationFn<TFeatures, TData>: (columnId, leafRows, childRows) => any;
```

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../interfaces/tablefeatures.md)

• **TData** *extends* [`RowData`](rowdata.md)

## Parameters

• **columnId**: `string`

• **leafRows**: [`Row`](row.md)\<`TFeatures`, `TData`\>[]

• **childRows**: [`Row`](row.md)\<`TFeatures`, `TData`\>[]

## Returns

`any`

## Defined in

[features/column-grouping/ColumnGrouping.types.ts:22](https://github.com/TanStack/table/blob/b1e6b79157b0debc7222660572b06c8b857f4605/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L22)
