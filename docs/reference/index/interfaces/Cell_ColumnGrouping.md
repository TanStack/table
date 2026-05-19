---
id: Cell_ColumnGrouping
title: Cell_ColumnGrouping
---

# Interface: Cell\_ColumnGrouping

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:134](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L134)

## Properties

### getIsAggregated()

```ts
getIsAggregated: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:138](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L138)

Checks whether this cell should render an aggregated value.

#### Returns

`boolean`

***

### getIsGrouped()

```ts
getIsGrouped: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:142](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L142)

Checks whether this cell represents the active grouping column.

#### Returns

`boolean`

***

### getIsPlaceholder()

```ts
getIsPlaceholder: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:146](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L146)

Checks whether this cell is hidden as a grouping placeholder.

#### Returns

`boolean`
