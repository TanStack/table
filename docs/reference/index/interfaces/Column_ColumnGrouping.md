---
id: Column_ColumnGrouping
title: Column_ColumnGrouping
---

# Interface: Column\_ColumnGrouping\<TFeatures, TData\>

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:80](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L80)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getAggregationFn()

```ts
getAggregationFn: () => 
  | AggregationFn<TFeatures, TData>
  | undefined;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:87](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L87)

Returns the aggregation function for the column.

#### Returns

  \| [`AggregationFn`](../type-aliases/AggregationFn.md)\<`TFeatures`, `TData`\>
  \| `undefined`

***

### getAutoAggregationFn()

```ts
getAutoAggregationFn: () => 
  | AggregationFn<TFeatures, TData>
  | undefined;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:91](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L91)

Returns the automatically inferred aggregation function for the column.

#### Returns

  \| [`AggregationFn`](../type-aliases/AggregationFn.md)\<`TFeatures`, `TData`\>
  \| `undefined`

***

### getCanGroup()

```ts
getCanGroup: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L95)

Checks whether this column can currently be grouped.

#### Returns

`boolean`

***

### getGroupedIndex()

```ts
getGroupedIndex: () => number;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:99](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L99)

Finds this column's position in the ordered grouping state.

#### Returns

`number`

***

### getIsGrouped()

```ts
getIsGrouped: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:103](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L103)

Checks whether this column id is present in grouping state.

#### Returns

`boolean`

***

### getToggleGroupingHandler()

```ts
getToggleGroupingHandler: () => () => void;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L107)

Returns a function that toggles the grouping state of the column. This is useful for passing to the `onClick` prop of a button.

#### Returns

```ts
(): void;
```

##### Returns

`void`

***

### toggleGrouping()

```ts
toggleGrouping: () => void;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:111](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L111)

Toggles the grouping state of the column.

#### Returns

`void`
