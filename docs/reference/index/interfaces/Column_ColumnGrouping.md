---
id: Column_ColumnGrouping
title: Column_ColumnGrouping
---

# Interface: Column\_ColumnGrouping\<TFeatures, TData\>

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:157](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L157)

## Type Parameters

### TFeatures

`TFeatures` *extends* [`TableFeatures`](TableFeatures.md)

### TData

`TData` *extends* [`RowData`](../type-aliases/RowData.md)

## Properties

### getAggregationFn()

```ts
getAggregationFn: () => AggregationFn<TFeatures, TData> | undefined;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:164](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L164)

Returns the aggregation function for the column.

#### Returns

[`AggregationFn`](AggregationFn.md)\<`TFeatures`, `TData`\> \| `undefined`

***

### getAutoAggregationFn()

```ts
getAutoAggregationFn: () => AggregationFn<TFeatures, TData> | undefined;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:168](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L168)

Returns the automatically inferred aggregation function for the column.

#### Returns

[`AggregationFn`](AggregationFn.md)\<`TFeatures`, `TData`\> \| `undefined`

***

### getCanGroup()

```ts
getCanGroup: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:172](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L172)

Checks whether this column can currently be grouped.

#### Returns

`boolean`

***

### getGroupedIndex()

```ts
getGroupedIndex: () => number;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:176](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L176)

Finds this column's position in the ordered grouping state.

#### Returns

`number`

***

### getIsGrouped()

```ts
getIsGrouped: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:180](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L180)

Checks whether this column id is present in grouping state.

#### Returns

`boolean`

***

### getToggleGroupingHandler()

```ts
getToggleGroupingHandler: () => () => void;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:184](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L184)

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

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:188](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L188)

Toggles the grouping state of the column.

#### Returns

`void`
