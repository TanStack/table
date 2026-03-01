---
id: Row_ColumnGrouping
title: Row_ColumnGrouping
---

# Interface: Row\_ColumnGrouping

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:112](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L112)

## Properties

### \_groupingValuesCache

```ts
_groupingValuesCache: Record<string, any>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:113](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L113)

***

### getGroupingValue()

```ts
getGroupingValue: (columnId) => unknown;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:117](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L117)

Returns the grouping value for any row and column (including leaf rows).

#### Parameters

##### columnId

`string`

#### Returns

`unknown`

***

### getIsGrouped()

```ts
getIsGrouped: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:121](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L121)

Returns whether or not the row is currently grouped.

#### Returns

`boolean`

***

### groupingColumnId?

```ts
optional groupingColumnId: string;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:125](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L125)

If this row is grouped, this is the id of the column that this row is grouped by.

***

### groupingValue?

```ts
optional groupingValue: unknown;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:129](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L129)

If this row is grouped, this is the unique/shared value for the `groupingColumnId` for all of the rows in this group.
