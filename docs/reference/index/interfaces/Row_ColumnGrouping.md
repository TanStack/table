---
id: Row_ColumnGrouping
title: Row_ColumnGrouping
---

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:59](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L59)

## Properties

### \_groupingValuesCache

```ts
_groupingValuesCache: Record<string, any>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:60](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L60)

***

### getGroupingValue

```ts
getGroupingValue: (columnId) => unknown;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:64](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L64)

Reads the value used to group this row for a column id.

#### Parameters

##### columnId

`string`

#### Returns

`unknown`

***

### getIsGrouped

```ts
getIsGrouped: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:68](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L68)

Checks whether this row represents a grouped row.

#### Returns

`boolean`

***

### groupingColumnId?

```ts
optional groupingColumnId?: string;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:72](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L72)

If this row is grouped, this is the id of the column that this row is grouped by.

***

### groupingValue?

```ts
optional groupingValue?: unknown;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:76](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L76)

If this row is grouped, this is the unique/shared value for the `groupingColumnId` for all of the rows in this group.
