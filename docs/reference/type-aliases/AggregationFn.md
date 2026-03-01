---
id: AggregationFn
title: AggregationFn
---

# Type Alias: AggregationFn()\<TFeatures, TData\>

```ts
type AggregationFn<TFeatures, TData> = (columnId, leafRows, childRows) => any;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L30)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](../interfaces/TableFeatures.md)

### TData

`TData` *extends* [`RowData`](RowData.md)

## Parameters

### columnId

`string`

### leafRows

[`Row`](Row.md)\<`TFeatures`, `TData`\>[]

### childRows

[`Row`](Row.md)\<`TFeatures`, `TData`\>[]

## Returns

`any`
