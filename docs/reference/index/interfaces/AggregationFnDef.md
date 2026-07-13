---
id: AggregationFnDef
title: AggregationFnDef
---

# Interface: AggregationFnDef\<TFeatures, TData\>

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:54](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L54)

The definition object accepted by `constructAggregationFn`.

`aggregate` is a value-level reducer: it receives the rows' (resolved)
values instead of the rows themselves, so normalization concerns stay in
`resolveDataValue`.

## Extended by

- [`CreatedAggregationFn`](CreatedAggregationFn.md)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### aggregate()

```ts
aggregate: (values, rows, columnId) => any;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:58](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L58)

#### Parameters

##### values

`any`[]

##### rows

[`Row`](../type-aliases/Row.md)\<`TFeatures`, `TData`\>[]

##### columnId

`string`

#### Returns

`any`

***

### fromRows?

```ts
optional fromRows: "leafRows" | "childRows";
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:69](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L69)

Which of the group's rows feed the aggregation: all of its `leafRows`
(the default) or its immediate `childRows`. For nested groups, child rows
expose already-aggregated values, which is faster for reaggregatable
computations like sums and extents.

***

### resolveDataValue?

```ts
optional resolveDataValue: TransformDataValueFn;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L70)
