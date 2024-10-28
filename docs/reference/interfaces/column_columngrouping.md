---
id: Column_ColumnGrouping
title: Column_ColumnGrouping
---

# Interface: Column\_ColumnGrouping\<TFeatures, TData\>

## Type Parameters

• **TFeatures** *extends* [`TableFeatures`](../type-aliases/tablefeatures.md)

• **TData** *extends* [`RowData`](../type-aliases/rowdata.md)

## Properties

### getAggregationFn()

```ts
getAggregationFn: () => undefined | AggregationFn<TFeatures, TData>;
```

Returns the aggregation function for the column.

#### Returns

`undefined` \| [`AggregationFn`](../type-aliases/aggregationfn.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getaggregationfn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:95](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L95)

***

### getAutoAggregationFn()

```ts
getAutoAggregationFn: () => undefined | AggregationFn<TFeatures, TData>;
```

Returns the automatically inferred aggregation function for the column.

#### Returns

`undefined` \| [`AggregationFn`](../type-aliases/aggregationfn.md)\<`TFeatures`, `TData`\>

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getautoaggregationfn)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:101](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L101)

***

### getCanGroup()

```ts
getCanGroup: () => boolean;
```

Returns whether or not the column can be grouped.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getcangroup)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:107](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L107)

***

### getGroupedIndex()

```ts
getGroupedIndex: () => number;
```

Returns the index of the column in the grouping state.

#### Returns

`number`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupedindex)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L113)

***

### getIsGrouped()

```ts
getIsGrouped: () => boolean;
```

Returns whether or not the column is currently grouped.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getisgrouped)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L119)

***

### getToggleGroupingHandler()

```ts
getToggleGroupingHandler: () => () => void;
```

Returns a function that toggles the grouping state of the column. This is useful for passing to the `onClick` prop of a button.

#### Returns

`Function`

##### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#gettogglegroupinghandler)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:125](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L125)

***

### toggleGrouping()

```ts
toggleGrouping: () => void;
```

Toggles the grouping state of the column.

#### Returns

`void`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#togglegrouping)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L131)
