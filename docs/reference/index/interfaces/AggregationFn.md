---
id: AggregationFn
title: AggregationFn
---

# Interface: AggregationFn()\<TFeatures, TData\>

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:30](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L30)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

```ts
AggregationFn(
   columnId, 
   leafRows, 
   childRows): any;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:34](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L34)

## Parameters

### columnId

`string`

### leafRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

### childRows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

## Returns

`any`

## Properties

### resolveDataValue?

```ts
optional resolveDataValue: TransformDataValueFn;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:44](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L44)

Normalizes each row's value before it is aggregated. Only honored by
aggregation functions built with `constructAggregationFn` (including the
value-based built-in aggregation functions).
