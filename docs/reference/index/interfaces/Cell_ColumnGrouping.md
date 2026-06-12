---
id: Cell_ColumnGrouping
title: Cell_ColumnGrouping
---

# Interface: Cell\_ColumnGrouping

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:149](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L149)

## Properties

### getIsAggregated()

```ts
getIsAggregated: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:153](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L153)

Checks whether this cell should render an aggregated value.

#### Returns

`boolean`

***

### getIsGrouped()

```ts
getIsGrouped: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:157](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L157)

Checks whether this cell represents the active grouping column.

#### Returns

`boolean`

***

### getIsPlaceholder()

```ts
getIsPlaceholder: () => boolean;
```

Defined in: [features/column-grouping/columnGroupingFeature.types.ts:161](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/column-grouping/columnGroupingFeature.types.ts#L161)

Checks whether this cell is hidden as a grouping placeholder.

#### Returns

`boolean`
