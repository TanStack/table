---
id: Column_ColumnGrouping
title: Column_ColumnGrouping
---

# Interface: Column\_ColumnGrouping\<TFeatures, TData\>

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:102](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L102)

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

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:109](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L109)

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

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L113)

Returns the automatically inferred aggregation function for the column.

#### Returns

  \| [`AggregationFn`](../type-aliases/AggregationFn.md)\<`TFeatures`, `TData`\>
  \| `undefined`

***

### getCanGroup()

```ts
getCanGroup: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:117](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L117)

Checks whether this column can currently be grouped.

#### Returns

`boolean`

***

### getGroupedIndex()

```ts
getGroupedIndex: () => number;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:121](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L121)

Finds this column's position in the ordered grouping state.

#### Returns

`number`

***

### getIsGrouped()

```ts
getIsGrouped: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:125](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L125)

Checks whether this column id is present in grouping state.

#### Returns

`boolean`

***

### getToggleGroupingHandler()

```ts
getToggleGroupingHandler: () => () => void;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:129](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L129)

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

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:133](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L133)

Toggles the grouping state of the column.

#### Returns

`void`
