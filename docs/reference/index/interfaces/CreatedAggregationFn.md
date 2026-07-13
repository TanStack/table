---
id: CreatedAggregationFn
title: CreatedAggregationFn
---

# Interface: CreatedAggregationFn()\<TFeatures, TData\>

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L82)

The shape returned by `constructAggregationFn`: an `AggregationFn` with its
definition attached, so variants can be built by spreading it into another
`constructAggregationFn` call.

The call signature is generic so a created aggregation function can be used
with any table's rows, regardless of the feature set it was defined
against.

## Extends

- [`AggregationFnDef`](AggregationFnDef.md)\<`TFeatures`, `TData`\>

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

```ts
CreatedAggregationFn<TRowFeatures, TRowData>(
   columnId, 
   leafRows, 
   childRows): any;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L86)

The shape returned by `constructAggregationFn`: an `AggregationFn` with its
definition attached, so variants can be built by spreading it into another
`constructAggregationFn` call.

The call signature is generic so a created aggregation function can be used
with any table's rows, regardless of the feature set it was defined
against.

## Type Parameters

### TRowFeatures

`TRowFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TRowData

`TRowData` *extends* [`RowData`](../type-aliases/RowData.md)

## Parameters

### columnId

`string`

### leafRows

[`Row`](../type-aliases/Row.md)\<`TRowFeatures`, `TRowData`\>[]

### childRows

[`Row`](../type-aliases/Row.md)\<`TRowFeatures`, `TRowData`\>[]

## Returns

`any`

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

#### Inherited from

[`AggregationFnDef`](AggregationFnDef.md).[`aggregate`](AggregationFnDef.md#aggregate)

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

#### Inherited from

[`AggregationFnDef`](AggregationFnDef.md).[`fromRows`](AggregationFnDef.md#fromrows)

***

### resolveDataValue?

```ts
optional resolveDataValue: TransformDataValueFn;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:70](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L70)

#### Inherited from

[`AggregationFnDef`](AggregationFnDef.md).[`resolveDataValue`](AggregationFnDef.md#resolvedatavalue)
