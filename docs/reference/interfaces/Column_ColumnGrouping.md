---
id: Column_ColumnGrouping
title: Column_ColumnGrouping
---

# Interface: Column\_ColumnGrouping\<TFeatures, TData\>

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L78)

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

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:85](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L85)

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

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:89](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L89)

Returns the automatically inferred aggregation function for the column.

#### Returns

  \| [`AggregationFn`](../type-aliases/AggregationFn.md)\<`TFeatures`, `TData`\>
  \| `undefined`

***

### getCanGroup()

```ts
getCanGroup: () => boolean;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:93](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L93)

Returns whether or not the column can be grouped.

#### Returns

`boolean`

***

### getGroupedIndex()

```ts
getGroupedIndex: () => number;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:97](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L97)

Returns the index of the column in the grouping state.

#### Returns

`number`

***

### getIsGrouped()

```ts
getIsGrouped: () => boolean;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:101](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L101)

Returns whether or not the column is currently grouped.

#### Returns

`boolean`

***

### getToggleGroupingHandler()

```ts
getToggleGroupingHandler: () => () => void;
```

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:105](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L105)

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

Defined in: [packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts:109](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L109)

Toggles the grouping state of the column.

#### Returns

`void`
