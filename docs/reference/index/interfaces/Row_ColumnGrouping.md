---
id: Row_ColumnGrouping
title: Row_ColumnGrouping
---

# Interface: Row\_ColumnGrouping

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:114](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L114)

## Properties

### \_groupingValuesCache

```ts
_groupingValuesCache: Record<string, any>;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:115](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L115)

***

### getGroupingValue()

```ts
getGroupingValue: (columnId) => unknown;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:119](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L119)

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

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:123](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L123)

Checks whether this row represents a grouped row.

#### Returns

`boolean`

***

### groupingColumnId?

```ts
optional groupingColumnId: string;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:127](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L127)

If this row is grouped, this is the id of the column that this row is grouped by.

***

### groupingValue?

```ts
optional groupingValue: unknown;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:131](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L131)

If this row is grouped, this is the unique/shared value for the `groupingColumnId` for all of the rows in this group.
