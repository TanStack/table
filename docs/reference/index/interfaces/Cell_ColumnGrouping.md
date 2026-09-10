---
id: Cell_ColumnGrouping
title: Cell_ColumnGrouping
---

# Interface: Cell\_ColumnGrouping

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:78](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L78)

## Properties

### getIsGrouped()

```ts
getIsGrouped: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:82](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L82)

Checks whether this cell represents the active grouping column.

#### Returns

`boolean`

***

### getIsPlaceholder()

```ts
getIsPlaceholder: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:86](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L86)

Checks whether this cell is hidden as a grouping placeholder.

#### Returns

`boolean`
