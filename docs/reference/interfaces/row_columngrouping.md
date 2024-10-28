---
id: Row_ColumnGrouping
title: Row_ColumnGrouping
---

# Interface: Row\_ColumnGrouping

## Properties

### \_groupingValuesCache

```ts
_groupingValuesCache: Record<string, any>;
```

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:135](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L135)

***

### getGroupingValue()

```ts
getGroupingValue: (columnId) => unknown;
```

Returns the grouping value for any row and column (including leaf rows).

#### Parameters

• **columnId**: `string`

#### Returns

`unknown`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupingvalue)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:141](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L141)

***

### getIsGrouped()

```ts
getIsGrouped: () => boolean;
```

Returns whether or not the row is currently grouped.

#### Returns

`boolean`

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getisgrouped)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:147](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L147)

***

### groupingColumnId?

```ts
optional groupingColumnId: string;
```

If this row is grouped, this is the id of the column that this row is grouped by.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#groupingcolumnid)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:153](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L153)

***

### groupingValue?

```ts
optional groupingValue: unknown;
```

If this row is grouped, this is the unique/shared value for the `groupingColumnId` for all of the rows in this group.

#### Link

[API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#groupingvalue)

#### Link

[Guide](https://tanstack.com/table/v8/docs/guide/grouping)

#### Defined in

[features/column-grouping/ColumnGrouping.types.ts:159](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/ColumnGrouping.types.ts#L159)
