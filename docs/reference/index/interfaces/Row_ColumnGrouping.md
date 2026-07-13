---
id: Row_ColumnGrouping
title: Row_ColumnGrouping
---

# Interface: Row\_ColumnGrouping

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:191](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L191)

## Properties

### \_groupingValuesCache

```ts
_groupingValuesCache: Record<string, any>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:192](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L192)

***

### getGroupingValue()

```ts
getGroupingValue: (columnId) => unknown;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:196](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L196)

Reads the value used to group this row for a column id.

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

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:200](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L200)

Checks whether this row represents a grouped row.

#### Returns

`boolean`

***

### groupingColumnId?

```ts
optional groupingColumnId: string;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:204](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L204)

If this row is grouped, this is the id of the column that this row is grouped by.

***

### groupingValue?

```ts
optional groupingValue: unknown;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:208](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L208)

If this row is grouped, this is the unique/shared value for the `groupingColumnId` for all of the rows in this group.
